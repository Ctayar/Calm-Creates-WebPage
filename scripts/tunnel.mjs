#!/usr/bin/env node
/**
 * Publishes the site to a public URL using a Cloudflare quick tunnel.
 *
 *   npm run tunnel            # tunnel the preview server (dist/) on :4173
 *   npm run tunnel -- --port 5173
 *
 * Why this exists: `cloudflared tunnel --url` cannot register on some
 * networks whose DNS resolver refuses to answer for api.trycloudflare.com.
 * This script registers the tunnel through a public resolver instead, then
 * hands the resulting credentials to cloudflared directly.
 *
 * The URL changes every run. For a permanent address, deploy instead:
 *   npm run deploy
 */
import { spawn, execFileSync } from 'node:child_process'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import tls from 'node:tls'
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { startProxy } from './dns-proxy.mjs'

const QUICK_SERVICE = 'https://api.trycloudflare.com'
const CLOUDFLARED = resolve(process.cwd(), 'tools/cloudflared')
const RELEASES = 'https://github.com/cloudflare/cloudflared/releases/latest/download'

const args = process.argv.slice(2)
const portFlag = args.indexOf('--port')
const PORT = portFlag !== -1 ? args[portFlag + 1] : process.env.PORT || '4173'
const ORIGIN = `http://localhost:${PORT}`

/** An https.Agent that tunnels every request through the local DNS proxy. */
class ProxyAgent extends https.Agent {
  constructor(proxyPort) {
    super({ keepAlive: false })
    this.proxyPort = proxyPort
  }

  createConnection(options, callback) {
    const target = `${options.host}:${options.port || 443}`

    const onError = (err) => callback(err)
    const sock = net.connect(this.proxyPort, '127.0.0.1', () => {
      const req = http.request({
        host: '127.0.0.1',
        port: this.proxyPort,
        method: 'CONNECT',
        path: target,
        headers: { Host: target },
      })
      req.once('connect', (res, socket) => {
        if (res.statusCode !== 200) {
          callback(new Error(`proxy CONNECT failed (${res.statusCode})`))
          socket.destroy()
          return
        }
        const tlsSocket = tls.connect({ socket, servername: options.host })
        callback(null, tlsSocket)
      })
      req.once('error', onError)
      req.end()
    })

    sock.once('error', onError)
  }
}

function postJson(url, body, agent) {
  return new Promise((resolvePromise, reject) => {
    const target = new URL(url)
    const payload = Buffer.from(body ?? '')

    const req = https.request(
      {
        hostname: target.hostname,
        port: 443,
        path: target.pathname,
        method: 'POST',
        agent,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': payload.length,
          'User-Agent': 'cloudflared/2026.10.3',
        },
      },
      (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => resolvePromise({ status: res.statusCode, body: data }))
      },
    )

    req.on('error', reject)
    req.end(payload)
  })
}

/**
 * Registers a quick tunnel. Cloudflare returns the tunnel id, secret and the
 * public hostname; an empty request body means "public, no email gate".
 */
async function provision(agent) {
  const res = await postJson(`${QUICK_SERVICE}/tunnel`, '', agent)

  if (res.status !== 200) {
    throw new Error(`provisioning failed (HTTP ${res.status}): ${res.body.slice(0, 200)}`)
  }

  const parsed = JSON.parse(res.body)
  if (!parsed.success || !parsed.result?.hostname) {
    throw new Error(`provisioning failed: ${res.body.slice(0, 200)}`)
  }

  return parsed.result
}

/**
 * cloudflared accepts a base64-encoded JSON credential blob:
 *   {"a": account tag, "s": base64 secret, "t": tunnel id}
 */
function encodeToken({ account_tag, secret, id }) {
  const payload = { a: account_tag, s: secret, t: id }
  return Buffer.from(JSON.stringify(payload)).toString('base64')
}

/**
 * Downloads the cloudflared binary on first run so it never has to be
 * committed to the repository (it is ~40MB per platform).
 */
async function ensureCloudflared(target = CLOUDFLARED) {
  if (existsSync(target)) return

  const arch = process.arch === 'arm64' ? 'arm64' : 'amd64'
  const { platform } = process

  let asset
  let archive = false
  if (platform === 'darwin') {
    asset = `cloudflared-darwin-${arch}.tgz`
    archive = true
  } else if (platform === 'linux') {
    asset = `cloudflared-linux-${arch}`
  } else {
    throw new Error(`No cloudflared build for ${platform}/${arch}`)
  }

  console.log('  Downloading cloudflared (first run only)...')
  const res = await fetch(`${RELEASES}/${asset}`)
  if (!res.ok) throw new Error(`cloudflared download failed (${res.status})`)
  const bytes = Buffer.from(await res.arrayBuffer())

  mkdirSync(resolve(target, '..'), { recursive: true })

  if (!archive) {
    writeFileSync(target, bytes)
  } else {
    const tmp = mkdtempSync(join(tmpdir(), 'cloudflared-'))
    try {
      const tgz = join(tmp, 'cloudflared.tgz')
      writeFileSync(tgz, bytes)
      execFileSync('tar', ['-xzf', tgz, '-C', tmp], { stdio: 'ignore' })
      const found = execFileSync('find', [tmp, '-type', 'f', '-name', 'cloudflared'], {
        encoding: 'utf8',
      })
        .split('\n')
        .filter(Boolean)[0]
      if (!found) throw new Error('cloudflared binary missing from the archive')
      copyFileSync(found, target)
    } finally {
      rmSync(tmp, { recursive: true, force: true })
    }
  }

  chmodSync(target, 0o755)
}

async function main() {
  let proxy = null
  let agent = undefined

  await ensureCloudflared()

  // Try the system resolver first; only fall back to the proxy if it fails.
  try {
    const res = await postJson(`${QUICK_SERVICE}/tunnel`, '', undefined)
    console.log('  DNS: system resolver works')
    return await launch(JSON.parse(res.body).result)
  } catch {
    console.log('  DNS: system resolver blocked, routing through 1.1.1.1')
  }

  proxy = await startProxy({ port: 0, verbose: false })
  agent = new ProxyAgent(proxy.port)

  const tunnel = await provision(agent)
  await launch(tunnel)
}

async function launch(tunnel) {
  const { hostname, id, secret, account_tag } = tunnel
  const publicUrl = `https://${hostname}`

  const token = encodeToken({ account_tag, secret, id })
  const tokenFile = resolve(process.cwd(), '.tunnel-token')
  writeFileSync(tokenFile, token)

  console.log(`\n  Public URL:  ${publicUrl}`)
  console.log(`  Tunnel ID:   ${id}`)
  writeFileSync(resolve(process.cwd(), '.tunnel-url'), `${publicUrl}\n`)

  const child = spawn(
    CLOUDFLARED,
    [
      'tunnel',
      '--no-autoupdate',
      '--edge-ip-version',
      '4',
      '--url',
      ORIGIN,
      'run',
      '--token-file',
      tokenFile,
    ],
    { stdio: 'inherit' },
  )

  const shutdown = () => child.kill('SIGINT')
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  child.on('exit', (code) => {
    console.log(`\n  Tunnel closed (exit ${code}).`)
    process.exit(code ?? 0)
  })
}

export { ensureCloudflared }

const isEntryPoint =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isEntryPoint) {
  main().catch((err) => {
    console.error(`\n  Tunnel failed: ${err.message}\n`)
    process.exit(1)
  })
}

