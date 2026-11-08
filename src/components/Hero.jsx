import JournalCover from './JournalCover.jsx'

export default function Hero() {
  return (
    <section id="top" className="cc-hero cc-hero--gradient">
      <div className="cc-hero__glow cc-hero__glow--a" aria-hidden="true" />
      <div className="cc-hero__glow cc-hero__glow--b" aria-hidden="true" />
      <div className="cc-hero__glow cc-hero__glow--c" aria-hidden="true" />

      <div className="container position-relative">
        <div className="row align-items-center g-5 py-5">
          <div className="col-lg-6 order-2 order-lg-1">
            <span className="cc-eyebrow">
              <span className="cc-eyebrow__dot" aria-hidden="true" />
              30 Days of Guided Calm
            </span>

            <h1 className="cc-display cc-hero__title">
              Create Calmness in a
              <span className="cc-hero__title-soft"> World of Chaos</span>
            </h1>

            <p className="cc-hero__lede">
              A soft, guided journal for thirty quiet mornings. Five minutes a day of
              reflection, release, and gentle momentum — designed to bring you back to
              yourself.
            </p>

            <div className="d-flex flex-wrap align-items-center gap-3 mt-4">
              <a className="btn cc-btn cc-btn--primary cc-btn--lg" href="#purchase">
                Buy the Journal
              </a>
              <a className="btn cc-btn cc-btn--ghost cc-btn--lg" href="#features">
                See What&rsquo;s Inside
              </a>
            </div>

            <ul className="cc-hero__meta list-unstyled d-flex flex-wrap gap-4 mt-4">
              <li>
                <strong>30</strong>
                <span>guided days</span>
              </li>
              <li>
                <strong>5 min</strong>
                <span>each morning</span>
              </li>
              <li>
                <strong>200+</strong>
                <span>pages of calm</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-6 order-1 order-lg-1">
            <div className="cc-hero__art">
              <div className="cc-hero__art-halo" aria-hidden="true" />
              <JournalCover className="cc-hero__cover" />
              <div className="cc-hero__art-shadow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
