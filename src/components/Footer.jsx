import Butterfly from './Butterfly.jsx'

const YEAR = new Date().getFullYear()

const socials = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Pinterest', href: 'https://pinterest.com' },
  { label: 'TikTok', href: 'https://tiktok.com' },
]

export default function Footer() {
  return (
    <footer id="purchase" className="cc-footer">
      <div className="container py-5">
        <div className="cc-footer__cta text-center mx-auto">
          <Butterfly className="cc-footer__butterfly" />
          <span className="cc-eyebrow justify-content-center">
            <span className="cc-eyebrow__dot" aria-hidden="true" />
            Begin Today
          </span>
          <h2 className="cc-display cc-footer__title mt-3">
            Your calm is waiting
            <span className="cc-script-soft"> at the first page</span>
          </h2>
          <p className="cc-footer__lede">
            Thirty days of guided reflection, in a soft-touch journal made to be
            returned to.
          </p>

          <div className="cc-footer__price">
            <span className="cc-footer__amount">$24.00</span>
            <span className="cc-footer__note">Free shipping &middot; 30-day returns</span>
          </div>

          <a className="btn cc-btn cc-btn--primary cc-btn--lg mt-2" href="#top">
            Buy the Journal
          </a>
        </div>

        <div className="cc-footer__divider" aria-hidden="true" />

        <div className="row g-4 align-items-center cc-footer__base">
          <div className="col-lg-5">
            <div className="cc-brand d-flex align-items-center gap-2">
              <span className="cc-brand__mark">
                <Butterfly className="cc-brand__mark-icon" title="Calm Creates" />
              </span>
              <span className="cc-brand__text">Calm Creates</span>
            </div>
            <p className="cc-footer__blurb mb-0 mt-2">
              Handmade calm for busy hearts. Designed by sisters, made slowly in small
              batches.
            </p>
          </div>

          <div className="col-lg-4">
            <ul className="cc-footer__links list-unstyled mb-0">
              <li>
                <a href="#about">Our Story</a>
              </li>
              <li>
                <a href="#features">What&rsquo;s Inside</a>
              </li>
              <li>
                <a href="#purchase">Order</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3">
            <ul className="cc-footer__links list-unstyled mb-0">
              <li>
                <a href="mailto:hello@calmcreates.com">hello@calmcreates.com</a>
              </li>
              <li>
                <a href="tel:+10000000000">+1 (000) 000-0000</a>
              </li>
            </ul>
            <div className="cc-footer__social d-flex flex-wrap gap-2 mt-3">
              {socials.map((social) => (
                <a
                  className="cc-footer__social-link"
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="cc-footer__legal d-flex flex-wrap justify-content-between gap-2 mt-4">
          <span>&copy; {YEAR} Calm Creates. All rights reserved.</span>
          <span>Made slowly, with calm.</span>
        </div>
      </div>
    </footer>
  )
}
