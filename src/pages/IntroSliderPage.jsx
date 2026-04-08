import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const SLIDES = [
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Marine_Pull-ups.jpg/480px-Marine_Pull-ups.jpg',
    eyebrow: 'Meet your coach,',
    headline: 'Start your\njourney',
    sub: 'Personalized plans built around your goals, fitness level, and schedule.',
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Bench_press_1.jpg/480px-Bench_press_1.jpg',
    eyebrow: 'Create a workout plan',
    headline: 'To stay\nfit & strong',
    sub: 'Push/Pull/Legs, Yoga & more — every session tracked, every gain counted.',
  },
  {
    image: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Deadlift-phase_1.JPG',
    eyebrow: 'Action is the',
    headline: 'Key to all\nsuccess',
    sub: "The only person you're competing with is yesterday's you.",
    cta: true,
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
    if (idx >= SLIDES.length) { navigate('/login'); return }
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

      {/* Black at top → transparent mid → solid green at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 50%, rgba(103,222,109,0.6) 70%, #67DE6D 100%)',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen">

        {/* ── Progress bars (WhatsApp status style) ── */}
        <div className="flex gap-1.5 px-4 pt-12">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[3px] rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: '#fff',
                  width:
                    i < current ? '100%'
                    : i === current ? `${progress}%`
                    : '0%',
                  transition: i === current ? 'none' : undefined,
                }}
              />
            </div>
          ))}
        </div>

        {/* Skip */}
        <div className="flex justify-end px-5 pt-3">
          <button
            onClick={() => navigate('/login')}
            className="text-white/60 text-sm font-semibold"
          >
            Skip
          </button>
        </div>

        <div className="flex-1" />

        {/* Bottom text */}
        <div className="px-6 pb-12">
          <p className="text-black/60 text-sm font-medium mb-1">{slide.eyebrow}</p>
          <h2
            className="text-[2.2rem] font-black text-black leading-[1.1] tracking-tight mb-3 whitespace-pre-line"
          >
            {slide.headline}
          </h2>
          <p className="text-black/65 text-sm leading-relaxed mb-8 max-w-[280px]">
            {slide.sub}
          </p>

          {slide.cta ? (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 bg-black text-white font-bold px-7 py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Start Now
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={() => goTo(current + 1)}
              className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowRight size={22} className="text-white" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
