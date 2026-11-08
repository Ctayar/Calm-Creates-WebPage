import Butterfly from './Butterfly.jsx'

export default function JournalCover({ className = '' }) {
  return (
    <div className={`cc-journal ${className}`}>
      <div className="cc-journal__spine" aria-hidden="true" />
      <div className="cc-journal__cover">
        <span className="cc-journal__brand">Calm Creates</span>

        <h2 className="cc-journal__title">
          Create
          <br />
          Calmness
        </h2>

        <div className="cc-journal__rule" aria-hidden="true" />

        <Butterfly className="cc-journal__butterfly" />

        <span className="cc-journal__subtitle">30 Day Journal</span>

        <span className="cc-journal__foot">A guided practice in daily peace</span>
      </div>
    </div>
  )
}
