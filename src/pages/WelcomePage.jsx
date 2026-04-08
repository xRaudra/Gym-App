import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Splash image */}
      <img
        src="/splash.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
        draggable={false}
      />

      {/* Gradient: black at top → transparent mid → solid green at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.4) 50%, rgba(103,222,109,0.6) 70%, #67DE6D 100%)',
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col min-h-screen px-6">
        {/* Top badge */}
        <div className="pt-14 flex justify-center">
          <span className="inline-flex items-center gap-2 bg-black/40 border border-white/20 rounded-full px-4 py-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
            <span className="text-white text-[11px] font-bold tracking-widest uppercase">Grit n Gain</span>
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Headline + CTA */}
        <div className="pb-14">
          <p className="text-black/60 text-sm font-semibold uppercase tracking-wider mb-3">
            Your Digital Trainer
          </p>
          <h1 className="text-[2.6rem] font-black text-black leading-[1.08] tracking-tight mb-3">
            Built on Grit,<br />
            Delivered<br />
            by Gain.
          </h1>
          <p className="text-black/60 text-sm leading-relaxed mb-10 max-w-[260px]">
            Train smarter. Track every rep. Become the strongest version of you.
          </p>

          <button
            onClick={() => navigate('/intro')}
            className="w-full py-4 rounded-2xl font-bold text-base text-white active:scale-95 transition-all duration-150"
            style={{ backgroundColor: '#111' }}
          >
            Get Started
          </button>

          <p className="text-center text-black/50 text-sm mt-4">
            Already a member?{' '}
            <button onClick={() => navigate('/login')} className="text-black font-bold underline">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
