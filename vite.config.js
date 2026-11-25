import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const QR_DIR = resolve(process.cwd(), 'dev-assets')

/**
 * Dev-only convenience routes for getting the site onto a phone:
 *   /qr        -> the QR landing page
 *   /qr.png    -> the QR image itself
 *   /qr.svg    -> the vector QR
 */
function qrRoutes() {
  const handler = (req, res, next) => {
    const path = (req.url || '').split('?')[0]

    if (path === '/qr' || path === '/qr/') {
      const file = resolve(QR_DIR, 'index.html')
      if (!existsSync(file)) return next()
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      res.end(readFileSync(file))
      return
    }

    const image = path === '/qr.png' ? 'qr.png' : path === '/qr.svg' ? 'qr.svg' : null
    if (image) {
      const file = resolve(QR_DIR, image)
      if (!existsSync(file)) return next()
      res.setHeader('Content-Type', image.endsWith('.svg') ? 'image/svg+xml' : 'image/png')
      res.end(readFileSync(file))
      return
    }

    next()
  }

  return {
    name: 'calm-qr-routes',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/Calm-Creates-WebPage/',
  plugins: [react(), qrRoutes()],


  server: {
    // Expose the dev server on the local network so phones and tablets on the
    // same Wi-Fi can load the site (http://<your-lan-ip>:5173).
    host: true,

  
    allowedHosts: process.env.ALLOWED_HOSTS === 'true' ? true : ['.local'],
  },

  preview: {
    host: true,

    // The public tunnel forwards its own hostname (which changes every run),
    // so the preview server has to accept any Host header. It only serves the
    // built site, so there is nothing to leak.
    allowedHosts: true,
  },
})
