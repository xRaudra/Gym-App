import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDES = [
  {
    image: '/slider1.jpg',
    eyebrow: 'Meet your coach,',
    headline: 'Start your\njourney',
    sub: 'Personalized plans built around your goals, fitness level, and schedule.',
  },
  {
    image: '/slider2.jpg',
    eyebrow: 'Create a workout plan',
    headline: 'To stay\nfit & strong',
    sub: 'Push/Pull/Legs, Yoga & more — every session tracked, every gain counted.',
  },
  {
    image: '/slider3.jpg',
    eyebrow: 'Action is the',
    headline: 'Key to all\nsuccess',
    sub: "The only person you're competing with is yesterday's you.",
  },
]

const DURATION = 4000 // ms per slide

export default function IntroSliderPage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const startRef = useRef(Date.now())
  const rafRef = useRef(null)
  const touchStartX = useRef(null)

  const goTo = (idx) => {
    if (idx >= SLIDES.length) { navigate('/welcome'); return }
    setCurrent(idx)
  }

  // Auto-advance with smooth progress
  useEffect(() => {
    setProgress(0)
    startRef.current = Date.now()

    const tick = () => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / DURATION) * 100, 100)
      setProgress(pct)
      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        goTo(current + 1)
      }
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [current])

  // Touch swipe
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0) goTo(current + 1)
      else if (diff < 0 && current > 0) goTo(current - 1)
    }
    touchStartX.current = null
  }

  const slide = SLIDES[current]

  return (
    <div
      className="min-h-screen relative flex flex-col overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slide image */}
      <img
        key={current}
        src={slide.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center animate-fade-in"
        draggable={false}
      />

      {/* Black at top → transparent → solid green at bottom, green starts above halfway */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.75) 25%, rgba(0,0,0,0.2) 42%, rgba(103,222,109,0.55) 62%, #67DE6D 100%)',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen">

        {/* ── Pill indicators (top) ── */}
        <div className="flex gap-2 px-6 pt-12 justify-center">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                height: '6px',
                borderRadius: '9999px',
                backgroundColor: i < current ? '#fff' : i === current ? '#fff' : 'rgba(255,255,255,0.3)',
                // elongate active pill
                width: i === current ? `${Math.max(24, 24 + (progress / 100) * 28)}px` : '8px',
                transition: i === current ? 'width 0.05s linear' : 'width 0.25s ease',
                flexShrink: 0,
              }}
            />
          ))}
        </div>

        {/* Skip */}
        <div className="flex justify-end px-5 pt-3">
          <button
            onClick={() => navigate('/welcome')}
            className="text-white/60 text-sm font-semibold"
          >
            Skip
          </button>
        </div>

        <div className="flex-1" />

        {/* Bottom text */}
        <div className="px-6 pb-14">
          <p className="text-black/60 text-sm font-medium mb-1">{slide.eyebrow}</p>
          <h2
            className="text-[2.2rem] font-black text-black leading-[1.1] tracking-tight mb-3 whitespace-pre-line"
          >
            {slide.headline}
          </h2>
          <p className="text-black/65 text-sm leading-relaxed mb-8 max-w-[280px]">
            {slide.sub}
          </p>

          <button
            onClick={() => goTo(current + 1)}
            className="w-full py-4 rounded-2xl font-bold text-base text-white active:scale-95 transition-all duration-150"
            style={{ backgroundColor: '#111' }}
          >
            {current === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
