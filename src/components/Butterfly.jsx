import { useEffect, useId, useState } from 'react'

/**
 * Touch devices are far more sensitive to the cost of SVG filters than desktops,
 * so on coarse pointers we swap the fractal-noise displacement map for a plain
 * Gaussian blur. The wings keep their soft, washed edges at a fraction of the cost.
 */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setCoarse(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return coarse
}

export default function Butterfly({ className = '', title = 'Watercolor purple butterfly' }) {
  const uid = useId().replace(/:/g, '')
  const coarse = useCoarsePointer()

  const wingUpper = `ccWingUpper-${uid}`
  const wingLower = `ccWingLower-${uid}`
  const bodyGrad = `ccBodyGrad-${uid}`
  const wash = `ccWash-${uid}`
  const watercolor = `ccWatercolor-${uid}`
  const softBlur = `ccSoftBlur-${uid}`

  const wingFilter = coarse ? `url(#${softBlur})` : `url(#${watercolor})`

  return (
    <svg
      className={className}
      viewBox="0 0 200 160"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id={wingUpper} cx="46%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#e6dcfa" stopOpacity="0.95" />
          <stop offset="38%" stopColor="#bda4e8" stopOpacity="0.92" />
          <stop offset="72%" stopColor="#8a68c4" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#6a4ba4" stopOpacity="0.1" />
        </radialGradient>

        <radialGradient id={wingLower} cx="50%" cy="42%" r="60%">
          <stop offset="0%" stopColor="#ded2f6" stopOpacity="0.92" />
          <stop offset="45%" stopColor="#a98ede" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#7a5cb0" stopOpacity="0.12" />
        </radialGradient>

        <radialGradient id={bodyGrad} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#6b4ea6" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#4a3178" stopOpacity="0.55" />
        </radialGradient>

        <radialGradient id={wash} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#c3aeea" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#c3aeea" stopOpacity="0" />
        </radialGradient>

        {/* Full watercolor treatment — desktop pointers */}
        <filter id={watercolor} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.026"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="9"
            xChannelSelector="R"
            yChannelSelector="G"
            result="rough"
          />
          <feGaussianBlur in="rough" stdDeviation="1.1" />
        </filter>

        {/* Cheap soft edge — touch devices */}
        <filter id={softBlur} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="2.4" />
        </filter>

        <filter id={`${softBlur}-wash`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <g filter={`url(#${softBlur}-wash)`} opacity="0.4">
        <ellipse cx="72" cy="52" rx="34" ry="26" fill={`url(#${wash})`} />
        <ellipse cx="130" cy="56" rx="32" ry="24" fill={`url(#${wash})`} />
        <ellipse cx="104" cy="116" rx="30" ry="16" fill={`url(#${wash})`} />
      </g>

      <g filter={wingFilter}>
        <path d="M96 58 C 72 20, 26 10, 15 44 C 7 68, 38 92, 95 79 Z" fill={`url(#${wingUpper})`} />
        <path d="M104 58 C 128 20, 174 10, 185 44 C 193 68, 162 92, 105 79 Z" fill={`url(#${wingUpper})`} />
        <path d="M95 80 C 68 84, 37 95, 44 121 C 50 142, 82 141, 96 108 Z" fill={`url(#${wingLower})`} />
        <path d="M105 80 C 132 84, 163 95, 156 121 C 150 142, 118 141, 104 108 Z" fill={`url(#${wingLower})`} />
      </g>

      <g fill={`url(#${bodyGrad})`} opacity="0.9">
        <path d="M100 36 C 104 36 106 40 106 46 L 106 116 C 106 126 104 132 100 132 C 96 132 94 126 94 116 L 94 46 C 94 40 96 36 100 36 Z" />
      </g>

      <g stroke={`url(#${bodyGrad})`} strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.75">
        <path d="M97 40 C 88 30, 80 26, 72 24" />
        <path d="M103 40 C 112 30, 120 26, 128 24" />
      </g>
    </svg>
  )
}
