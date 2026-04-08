import { useState, useEffect } from 'react'
import { Dumbbell } from 'lucide-react'

// ── Custom gym SVG icons ───────────────────────────────────────────────────────
const Kettlebell = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Ball */}
    <circle cx="12" cy="16" r="7" />
    {/* Handle arch */}
    <path d="M7.5 10 Q7 3.5 12 3.5 Q17 3.5 16.5 10" />
    {/* Handle bar */}
    <line x1="7.5" y1="10" x2="16.5" y2="10" />
  </svg>
)

const Barbell = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Shaft */}
    <line x1="1" y1="12" x2="23" y2="12" />
    {/* Left collar + plate */}
    <rect x="1" y="10.5" width="2" height="3" rx="0.5" fill="currentColor" />
    <rect x="3" y="8.5" width="3" height="7" rx="1" />
    {/* Right collar + plate */}
    <rect x="21" y="10.5" width="2" height="3" rx="0.5" fill="currentColor" />
    <rect x="18" y="8.5" width="3" height="7" rx="1" />
  </svg>
)

const WeightPlate = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="5.5" />
    <circle cx="12" cy="12" r="2" fill="currentColor" />
  </svg>
)

const PunchBag = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {/* Chain */}
    <line x1="12" y1="1" x2="12" y2="4" />
    {/* Hook */}
    <path d="M10 4 Q8 4 8 6 Q8 8 10 8" />
    {/* Bag */}
    <rect x="7" y="8" width="10" height="14" rx="5" />
    {/* Stripe */}
    <line x1="7" y1="15" x2="17" y2="15" />
  </svg>
)

const ICONS = [
  { El: (s) => <Dumbbell size={s} strokeWidth={1.5} />, name: 'Dumbbell' },
  { El: (s) => <Kettlebell size={s} />, name: 'Kettlebell' },
  { El: (s) => <Barbell size={s} />, name: 'Barbell' },
  { El: (s) => <WeightPlate size={s} />, name: 'Plate' },
  { El: (s) => <PunchBag size={s} />, name: 'Bag' },
]

export default function GymLoader() {
  const [idx, setIdx] = useState(0)
  const [show, setShow] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      // Fade out → swap → fade in
      setShow(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % ICONS.length)
        setShow(true)
      }, 180)
    }, 750)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ backgroundColor: '#080808' }}
    >
      {/* Cycling icon */}
      <div
        className="text-brand"
        style={{
          transition: 'opacity 0.18s ease, transform 0.18s ease',
          opacity: show ? 1 : 0,
          transform: show ? 'scale(1)' : 'scale(0.65)',
        }}
      >
        {ICONS[idx].El(56)}
      </div>

      {/* App name */}
      <div className="text-center">
        <p className="text-white text-xl font-black tracking-tight">
          Grit n <span className="text-brand">Gain</span>
        </p>
        <p className="text-gray-600 text-[11px] mt-1 tracking-[0.2em] uppercase">
          {ICONS[idx].name}
        </p>
      </div>
    </div>
  )
}
