import { useId } from 'react'

export default function StarIcon({ className = '' }) {
  const uid = useId().replace(/:/g, '')
  const starGrad = `ccStarGrad-${uid}`

  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={starGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b49ae2" />
          <stop offset="55%" stopColor="#7d5fbe" />
          <stop offset="100%" stopColor="#553b8f" />
        </linearGradient>
      </defs>
      <path
        d="M24 3 C 25.6 12.6, 29.4 18.2, 45 24 C 29.4 29.4, 25.6 35, 24 45 C 22.4 35, 18.6 29.4, 3 24 C 18.6 18.2, 22.4 12.6, 24 3 Z"
        fill={`url(#${starGrad})`}
      />
      <circle cx="24" cy="24" r="3.4" fill="#efe6fb" opacity="0.85" />
    </svg>
  )
}
