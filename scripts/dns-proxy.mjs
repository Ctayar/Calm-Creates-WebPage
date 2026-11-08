/**
 * A tiny HTTP CONNECT proxy that resolves hostnames through a public DNS
 * resolver instead of the system one.
 *
 * Why this exists: some routers (including the one on this network) return
 * NXDOMAIN for certain domains even though they resolve fine everywhere else.
 * That breaks services like Cloudflare's quick tunnel, which needs to reach
 * api.trycloudflare.com to register.
 *
 * Standalone:
 *   node scripts/dns-proxy.mjs
 *
 * Then point a tool at it:
 *   HTTPS_PROXY=http://127.0.0.1:8899 some-tool
 *
 * Or import it:
 *   import { startProxy } from './scripts/dns-proxy.mjs'
 *   const proxy = await startProxy()
 */
import http from 'node:http'
import net from 'node:net'
import { Resolver } from 'node:dns/promises'

const resolver = new Resolver()
resolver.setServers(
  (process.env.UPSTREAM_DNS || '1.1.1.1,8.8.8.8')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)

async function resolve(host) {
  try {
    const addresses = await resolver.resolve4(host)
    if (addresses.length) return addresses[0]
  } catch (err) {
    console.error(`[dns-proxy] A lookup failed for ${host}: ${err.code || err.message}`)
  }

  try {
    // Fall back to IPv6 if there is no A record.
    const addresses = await resolver.resolve6(host)
    if (addresses.length) return addresses[0]
  } catch (err) {
    console.error(`[dns-proxy] AAAA lookup failed for ${host}: ${err.code || err.message}`)
  }

  throw new Error(`could not resolve ${host}`)
}

function buildServer({ verbose = true } = {}) {
  const log = (msg) => verbose && console.error(`[dns-proxy] ${msg}`)

  const server = http.createServer((req, res) => {
    // Plain (non-CONNECT) proxying: forward the absolute-URI request.
    let target
    try {
      target = new URL(req.url)
    } catch {
      res.writeHead(400).end('proxy: bad request URI')
      return
    }

    const upstream = http.request(
      {
        host: target.hostname,
        port: target.port || 80,
        method: req.method,
        path: target.pathname + target.search,
        headers: { ...req.headers, host: target.host },
      },
      (upRes) => {
        res.writeHead(upRes.statusCode, upRes.headers)
        upRes.pipe(res)
      },
    )
    upstream.on('error', () => {
      if (!res.headersSent) res.writeHead(502)
      res.end('proxy: upstream error')
    })
    req.pipe(upstream)
  })

  server.on('connect', async (req, clientSocket, head) => {
    const [host, portRaw] = req.url.split(':')
    const port = Number(portRaw || 443)

    try {
      const address = await resolve(host)
      log(`CONNECT ${host}:${port} -> ${address}`)

      const serverSocket = net.connect(port, address, () => {
        clientSocket.write('HTTP/1.1 200 Connection Established\r\nProxy-Agent: calm-dns-proxy\r\n\r\n')
        if (head?.length) serverSocket.write(head)
        serverSocket.pipe(clientSocket)
        clientSocket.pipe(serverSocket)
      })

      const kill = () => {
        serverSocket.destroy()
        clientSocket.destroy()
      }
      serverSocket.on('error', kill)
      clientSocket.on('error', kill)
    } catch (err) {
      log(`CONNECT ${host}:${port} failed: ${err.message}`)
      clientSocket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n')
      clientSocket.end()
    }
  })

  return server
}

/**
 * Starts the proxy. Pass port: 0 to let the OS pick a free port.
 * @returns {Promise<{port: number, close: () => Promise<void>}>}
 */
export function startProxy({ port = Number(process.env.PROXY_PORT || 8899), verbose = true } = {}) {
  const server = buildServer({ verbose })

  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', () => {
      const actual = server.address().port
      if (verbose) console.error(`[dns-proxy] listening on http://127.0.0.1:${actual}`)
      resolve({
        port: actual,
        close: () => new Promise((done) => server.close(done)),
      })
    })
  })
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`

if (isMain) {
  const { port } = await startProxy()
  console.log(`DNS proxy ready on http://127.0.0.1:${port}`)
}
