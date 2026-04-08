import { useState, useRef } from 'react'
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
    sub: 'The only person you\'re competing with is yesterday\'s you.',
    cta: true,
  },
]

export default function IntroSliderPage() {
  const navigate = useNavigate()
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef(null)

  const goNext = () => {
    if (current < SLIDES.length - 1) setCurrent(c => c + 1)
    else navigate('/login')
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) {
      if (diff > 0 && current < SLIDES.length - 1) setCurrent(c => c + 1)
      else if (diff < 0 && current > 0) setCurrent(c => c - 1)
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
      {/* Background image */}
      <img
        key={current}
        src={slide.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center animate-fade-in"
        draggable={false}
      />

      {/* Dark overlay at top so image reads clearly */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-transparent" />

      {/* Green gradient from bottom — fades to transparent at top */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to top, #67DE6D 0%, rgba(103,222,109,0.92) 15%, rgba(103,222,109,0.65) 32%, rgba(103,222,109,0.2) 52%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen">
        {/* Skip button */}
        <div className="flex justify-end px-5 pt-12">
          <button
            onClick={() => navigate('/login')}
            className="text-black/50 text-sm font-semibold"
          >
            Skip
          </button>
        </div>

        <div className="flex-1" />

        {/* Bottom text + CTA */}
        <div className="px-6 pb-12">
          {/* Slide text */}
          <p className="text-black/60 text-sm font-medium mb-1">{slide.eyebrow}</p>
          <h2 className="text-[2.2rem] font-black text-black leading-[1.1] tracking-tight mb-3 whitespace-pre-line">
            {slide.headline}
          </h2>
          <p className="text-black/65 text-sm leading-relaxed mb-8 max-w-[280px]">
            {slide.sub}
          </p>

          {/* Dot indicators */}
          <div className="flex items-center gap-2 mb-6">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="transition-all duration-300 rounded-full"
                style={{
                  width: i === current ? '28px' : '8px',
                  height: '8px',
                  backgroundColor: i === current ? '#111' : 'rgba(0,0,0,0.3)',
                }}
              />
            ))}
          </div>

          {/* CTA */}
          {slide.cta ? (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 bg-black text-white font-bold px-6 py-4 rounded-2xl active:scale-95 transition-transform"
            >
              Start Now
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={goNext}
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
