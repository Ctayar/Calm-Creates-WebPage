import Butterfly from './Butterfly.jsx'

export default function AboutUs() {
  return (
    <section id="about" className="cc-about">
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-lg-5">
            <div className="cc-about__art">
              <div className="cc-about__blob cc-about__blob--lilac" aria-hidden="true" />
              <div className="cc-about__blob cc-about__blob--blue" aria-hidden="true" />
              <div className="cc-about__blob cc-about__blob--pink" aria-hidden="true" />

              <div className="cc-about__sister cc-about__sister--one">
                <span className="cc-about__sister-initial">C</span>
                <span className="cc-about__sister-name">Carolyn</span>
              </div>
              <div className="cc-about__sister cc-about__sister--two">
                <span className="cc-about__sister-initial">C</span>
                <span className="cc-about__sister-name">Christyn</span>
              </div>

              <Butterfly className="cc-about__butterfly cc-about__butterfly--one" />
              <Butterfly className="cc-about__butterfly cc-about__butterfly--two" />

              <span className="cc-about__caption">Sisters, making space for stillness.</span>
            </div>
          </div>

          <div className="col-lg-7">
            <span className="cc-eyebrow">
              <span className="cc-eyebrow__dot" aria-hidden="true" />
              Our Story
            </span>

            <h2 className="cc-display cc-section-title mt-3">
              Made by two sisters who
              <span className="cc-script-soft"> forgot to slow down</span>
            </h2>

            <div className="cc-about__body">
              <p>
                We are Carolyn and Christyn — two sisters that grew up in the same
                chaotic household but found calmness through each other and the bond we
                have continued to nurture throughout our hectic lives.
              </p>
              <p>
                When the world kept pulling us in a hundred directions, we started
                writing our way back to ourselves. Every evening, five minutes. One page.
                Nothing fancy. That small ritual became the steadiest thing in our lives,
                and we wished more people had something just as simple to hold.
              </p>
              <p>
                So we made the journal we wanted and could not find. Thirty days of
                gentle prompts, breathing spaces, and small Permission slips to be
                unfinished. It is designed to be returned to, never finished — a soft
                place to put the noise, so the quiet underneath can be heard.
              </p>
            </div>

            <div className="cc-about__signoff">
              <Butterfly className="cc-about__signoff-butterfly" />
              <div>
                <span className="cc-script cc-about__signoff-name">Carolyn &amp; Christyn</span>
                <span className="cc-about__signoff-role">Founders, Calm Creates</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
