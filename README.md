# Calm Creates — 30 Day Create Calmness Journal

A single-page storefront for the **30 Day Create Calmness Journal**, a 30-day
guided journal by Carolyn & Christyn.

Built with React 19, Vite and Bootstrap 5. Fonts and icons are self-hosted, so
the site makes no third-party requests — it loads fully offline once cached.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on `:5173`, reachable from phones on the same Wi-Fi |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built `dist/` on `:4173` |
| `npm run lint` | Oxlint |
| `npm run qr` | Generate a scannable QR code + landing page in `dev-assets/` |
| `npm run ip` | Print the URLs a phone on the same Wi-Fi can use |
| `npm run social-card` | Regenerate the social share card (`public/og-image.png`) |
| `npm run tunnel` | **Publish the site to a public URL** (see below) |
| `npm run deploy` | Deploy to Vercel (permanent address) |
| `npm run deploy:netlify` | Deploy to Netlify (permanent address) |
| `npm run deploy:railway` | Deploy to Railway (permanent address) |

## Making the site reachable from any network

### Option 1 — public tunnel (instant, no account)

```bash
npm run build
npm run preview     # in one terminal
npm run tunnel      # in another
```

`npm run tunnel` prints a public `https://<random>.trycloudflare.com` address
that works on any network — cellular data, a different Wi-Fi, another country.
The address changes every time the tunnel starts.

`npm run qr` picks up the running tunnel's address automatically and encodes it
into the QR code, so scanning gets you to the public site rather than the
home network.

Keep the `npm run preview` and `npm run tunnel` terminals open — the site is
only reachable while they are running.

### Option 2 — permanent address (recommended)

A tunnel only lasts as long as this computer is on. For a permanent URL:

```bash
npm run deploy
```

This installs the Vercel CLI on first run and prints a link to sign in. After
signing in, Vercel builds the site and returns a permanent address such as
`https://calm-creates.vercel.app` that works everywhere, always, with no
computer left running. `vercel.json` and `netlify.toml` are already configured.

To use a custom domain, add it to the project in the Vercel dashboard, then
add the matching `<link rel="canonical">` and `og:url` to `index.html` so
search engines and link previews point at the right address.



## Layout

```
src/components/   Header, Hero, AboutUs, Features, Footer, JournalCover, Butterfly
src/index.css     Theme, layout and all mobile / iOS / Android adjustments
public/fonts/     20 self-hosted woff2 files + fonts.css
public/           favicon.svg, apple-touch-icon.png, icon-192/512.png, site.webmanifest,
                  og-image.png + social-card.svg (social share card)
scripts/qr.mjs    QR code + phone landing page generator
scripts/tunnel.mjs  Public tunnel launcher (handles the DNS quirk above)
scripts/dns-proxy.mjs  Local DNS proxy used when the system resolver fails
scripts/social-card.mjs  Regenerates the 1200x630 share card
tools/            Tunnel client binary (gitignored — downloaded on first use)
dev-assets/       Generated QR files (gitignored, never shipped in a build)
```

## Requirements

Node 22 or newer.
