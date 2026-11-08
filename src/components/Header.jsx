import { useEffect, useState } from 'react'
import Butterfly from './Butterfly.jsx'

const links = [
  { label: 'Our Story', href: '#about' },
  { label: "What's Inside", href: '#features' },
  { label: 'Purchase', href: '#purchase' },
]

const MOBILE_QUERY = '(max-width: 767.98px)'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Stop the page behind the menu from scrolling on phones
  useEffect(() => {
    if (!open || !window.matchMedia(MOBILE_QUERY).matches) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  // Collapse the menu if the viewport grows past the mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => {
      if (!e.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const close = () => setOpen(false)

  return (
    <header className={`cc-navbar ${scrolled ? 'cc-navbar--scrolled' : ''}`}>
      <nav className="navbar navbar-expand-md container py-3" aria-label="Main navigation">
        <a className="navbar-brand cc-brand d-flex align-items-center gap-2" href="#top" onClick={close}>
          <span className="cc-brand__mark">
            <Butterfly className="cc-brand__mark-icon" title="Calm Creates" />
          </span>
          <span className="cc-brand__text">Calm Creates</span>
        </a>

        <button
          className="navbar-toggler cc-navbar__toggle"
          type="button"
          aria-expanded={open}
          aria-controls="cc-nav-links"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="cc-navbar__toggle-bar" />
          <span className="cc-navbar__toggle-bar" />
          <span className="cc-navbar__toggle-bar" />
        </button>

        <div id="cc-nav-links" className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto align-items-md-center gap-md-2">
            {links.map((link) => (
              <li className="nav-item" key={link.href}>
                <a className="nav-link cc-navlink" href={link.href} onClick={close}>
                  {link.label}
                </a>
              </li>
            ))}
            <li className="nav-item ms-md-3 mt-2 mt-md-0">
              <a
                className="btn cc-btn cc-btn--primary cc-btn--sm w-100 w-md-auto"
                href="#purchase"
                onClick={close}
              >
                Buy Now
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  )
}
