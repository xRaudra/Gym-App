import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">

      {/* Mobile background */}
      <img
        src="/bg-mobile.jpg"
        alt=""
        className="lg:hidden absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />
      {/* Desktop background */}
      <img
        src="/bg-desktop.jpg"
        alt=""
        className="hidden lg:block absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />

      {/* Subtle bottom shadow to ensure text readability */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.6) 100%)' }}
      />

      {/* Top label + line */}
      <div className="relative px-6 pt-14 sm:pt-16 max-w-md sm:max-w-lg lg:max-w-2xl mx-auto w-full">
        <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.18em] mb-2">
          Your Digital Trainer
        </p>
        <div className="w-8 h-[1.5px]" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom content */}
      <div className="relative px-6 pb-14 sm:pb-16 w-full max-w-md sm:max-w-lg lg:max-w-2xl mx-auto">
        <h1 className="text-[2.75rem] sm:text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-3">
          Built on Grit,<br />
          Delivered by<br />
          Gain.
        </h1>
        <p className="text-white/55 text-sm sm:text-base leading-relaxed mb-8 max-w-[280px] lg:max-w-sm">
          Train smarter. Track every rep.<br />
          Become the strongest version of you.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-full font-black text-base active:scale-[0.97] transition-all duration-150 mb-4"
          style={{ backgroundColor: '#ffec64', color: '#080808', letterSpacing: '-0.01em' }}
        >
          Get Started
        </button>

        <p className="text-center text-white/50 text-sm">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-white font-bold underline underline-offset-2"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  )
}
