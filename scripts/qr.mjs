/**
 * Generates a phone-friendly page with a scannable QR code for the running dev
 * server, so an iPhone or Android can join the local network with one scan.
 *
 *   npm run qr
 *
 * Writes dev-assets/qr.svg, dev-assets/qr.png and dev-assets/index.html.
 * These live outside public/ so they are served in dev but never shipped in a
 * production build — a deployed site has no reason to publish your LAN address.
 */
import { execSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { networkInterfaces } from 'node:os'
import QRCode from 'qrcode'

const PORT = process.env.PORT || '5173'
const OUT_DIR = 'dev-assets'

function lanAddress() {
  const candidates = Object.values(networkInterfaces())
    .flat()
    .filter((i) => i && i.family === 'IPv4' && !i.internal)
    .map((i) => i.address)

  // Prefer a private LAN range — a VPN or docker interface is usually not it.
  const privateRanges = [/^192\.168\./, /^10\./, /^172\.(1[6-9]|2\d|3[01])\./]
  return candidates.find((a) => privateRanges.some((r) => r.test(a))) || candidates[0]
}

function localName() {
  if (process.env.LOCAL_NAME) return process.env.LOCAL_NAME
  // `scutil` is macOS-only; fall back gracefully elsewhere.
  try {
    return `${execSync('scutil --get LocalHostName').toString().trim()}.local`
  } catch {
    return null
  }
}

const host = lanAddress()

/**
 * A public URL wins over the LAN address when we have one. `npm run tunnel`
 * writes .tunnel-url, so a tunnel that is already running gets a QR code that
 * points at the public address instead of the home network.
 */
function publicUrl() {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.trim()

  const file = '.tunnel-url'
  if (existsSync(file)) {
    const value = readFileSync(file, 'utf8').trim()
    if (value) return value
  }

  return null
}

if (!host && !publicUrl()) {
  console.error('No network interface found. Is the computer connected to Wi-Fi?')
  process.exit(1)
}

const ipUrl = host ? `http://${host}:${PORT}` : null
const name = localName()
const nameUrl = name ? `http://${name}:${PORT}` : null

const isPublic = Boolean(publicUrl())
const primaryUrl = publicUrl() ?? ipUrl

mkdirSync(OUT_DIR, { recursive: true })

const qrOptions = {
  errorCorrectionLevel: 'Q',
  margin: 2,
  color: { dark: '#3a2a5f', light: '#fdfbfa' },
}

// Vector QR stays crisp at any zoom level on a Retina display.
const svg = await QRCode.toString(primaryUrl, { ...qrOptions, type: 'svg' })
writeFileSync(`${OUT_DIR}/qr.svg`, svg)

// Raster fallback for apps that will not render SVG.
await QRCode.toFile(`${OUT_DIR}/qr.png`, primaryUrl, { ...qrOptions, scale: 12 })

const buttons = [
  `<a class="btn primary" href="${primaryUrl}">Open on your phone</a>`,
  isPublic ? '' : nameUrl ? `<a class="btn" href="${nameUrl}">${nameUrl}</a>` : '',
]
  .filter(Boolean)
  .join('\n        ')

const tips = isPublic
  ? `<li>This address works on <strong>any network</strong> &mdash; Wi-Fi or cellular.</li>
      <li>It works as long as this computer is on and the tunnel is running.</li>
      <li>If the scan will not open, tap the button above instead.</li>
      <li>Turn off any <strong>VPN</strong> on the phone.</li>`
  : `<li>Your phone must be on the <strong>same Wi-Fi</strong> as this computer.</li>
      <li>If the scan will not open, tap the button above instead.</li>
      <li>Still nothing? Turn off any <strong>VPN</strong> on the phone.</li>
      <li>Using cellular data? It will not reach this computer.</li>`

const subtitle = isPublic
  ? 'Scan to open the public address.'
  : 'Point your phone&rsquo;s camera at this code.'

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Calm Creates — connect your phone</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 2rem 1.25rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    color: #6d6188;
    background: linear-gradient(150deg, #d9e9f8 0%, #e6ddf6 42%, #f7dde5 78%, #fbeaef 100%);
  }
  .card {
    width: min(34rem, 100%);
    background: rgba(255,255,255,.86);
    border: 1px solid rgba(138,111,196,.2);
    border-radius: 1.75rem;
    padding: 2.25rem 1.75rem;
    text-align: center;
    box-shadow: 0 30px 70px -34px rgba(58,42,95,.55);
  }
  h1 {
    margin: 0 0 .35rem;
    font-family: "Cormorant Garamond", Georgia, serif;
    font-size: 1.9rem;
    font-weight: 500;
    color: #3a2a5f;
  }
  p.sub { margin: 0 0 1.5rem; font-size: .95rem; }
  .qr {
    display: block;
    width: min(20rem, 78vw);
    height: auto;
    margin: 0 auto 1.5rem;
    border-radius: 1rem;
    background: #fdfbfa;
    padding: .75rem;
  }
  .btn {
    display: block;
    margin: .6rem 0;
    padding: .95rem 1.25rem;
    border-radius: 999px;
    border: 1px solid rgba(138,111,196,.35);
    background: #fff;
    color: #3a2a5f;
    text-decoration: none;
    font-size: 1rem;
    word-break: break-all;
  }
  .btn.primary {
    background: linear-gradient(135deg, #553c8c, #3a2a5f);
    color: #fff;
    font-weight: 500;
    border-color: transparent;
    box-shadow: 0 14px 30px -14px rgba(58,42,95,.7);
  }
  .url {
    display: block;
    margin-top: 1.25rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 1.05rem;
    color: #553c8c;
    word-break: break-all;
  }
  ul { text-align: left; margin: 1.5rem 0 0; padding-left: 1.2rem; font-size: .9rem; line-height: 1.75; }
  li { margin-bottom: .35rem; }
  hr { border: 0; border-top: 1px solid rgba(138,111,196,.18); margin: 1.6rem 0; }
</style>
</head>
<body>
  <main class="card">
    <h1>Calm Creates</h1>
    <p class="sub">${subtitle}</p>

    <img class="qr" src="/qr.svg" alt="QR code linking to the Calm Creates journal site" />

    <div>
        ${buttons}
    </div>

    <span class="url">${primaryUrl}</span>

    <hr />

    <ul>
      ${tips}
    </ul>
  </main>
</body>
</html>
`

writeFileSync(`${OUT_DIR}/index.html`, html)

console.log(`
  QR points at:
      ${primaryUrl}
${!isPublic && nameUrl ? `      ${nameUrl}   (also works, survives IP changes)\n` : ''}
  QR page:      http://localhost:${PORT}/qr
  Files:        ${OUT_DIR}/qr.svg, ${OUT_DIR}/qr.png, ${OUT_DIR}/index.html
`)
