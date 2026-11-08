import StarIcon from './StarIcon.jsx'

const features = [
  {
    title: 'Guided, Not Overwhelmed',
    body: 'Each day opens with a single written prompt. No blank page, no decision fatigue — just one gentle nudge toward yourself.',
  },
  {
    title: 'Five Minutes to Unwind',
    body: 'Short, unrushed exercises designed for the morning kettle or the quiet hour before sleep. Calm that fits inside a real day.',
  },
  {
    title: 'Made for Returning To',
    body: 'Forgotten pages are welcome here. Skip a day, miss a week, and come back without guilt — the journal meets you where you are.',
  },
]

export default function Features() {
  return (
    <section id="features" className="cc-features">
      <div className="container py-5">
        <div className="text-center mx-auto cc-features__intro">
          <span className="cc-eyebrow">
            <span className="cc-eyebrow__dot" aria-hidden="true" />
            What&rsquo;s Inside
          </span>
          <h2 className="cc-display cc-section-title mt-3">
            Thirty days to find your
            <span className="cc-script-soft"> daily stillness</span>
          </h2>
          <p className="cc-section-lede">
            Everything you need to move from a scattered mind to a quieter one — one
            page at a time.
          </p>
        </div>

        <div className="row g-4 mt-2">
          {features.map((feature, index) => (
            <div className="col-md-6 col-lg-4" key={feature.title}>
              <article className="cc-card h-100">
                <div className="cc-card__icon">
                  <StarIcon className="cc-card__star" />
                </div>
                <span className="cc-card__index">0{index + 1}</span>
                <h3 className="cc-card__title">{feature.title}</h3>
                <p className="cc-card__body">{feature.body}</p>
              </article>
            </div>
          ))}
        </div>

        <div className="cc-features__strip mt-5">
          <div className="row g-0">
            {[
              { k: '200+', v: 'premium pages' },
              { k: '30', v: 'daily prompts' },
              { k: '6', v: 'breathing rituals' },
              { k: '∞', v: 'revisits, always' },
            ].map((item, index) => (
              <div
                className="col-6 col-lg-3 text-center cc-features__stat"
                key={item.k}
                style={{ '--i': index }}
              >
                <span className="cc-features__stat-num">{item.k}</span>
                <span className="cc-features__stat-label">{item.v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
