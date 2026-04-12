import { useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
      {/* Hero image — fills full screen */}
      <img
        src="/advid.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />

      {/* Gradient: fully transparent top-half → solid green bottom-half */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(103,222,109,0) 0%, rgba(103,222,109,0) 45%, rgba(103,222,109,0.7) 65%, #67DE6D 100%)',
        }}
      />

      {/* Logo mark */}
      <div className="relative pt-12 flex justify-center">
        <Logo size={72} />
      </div>

      {/* Spacer pushes content to bottom */}
      <div className="flex-1" />

      {/* Bottom content — sits on the solid green zone */}
      <div className="relative px-6 pb-14">
        <p className="text-black/55 text-xs font-bold uppercase tracking-[0.15em] mb-2">
          Your Digital Trainer
        </p>
        <h1 className="text-[2.8rem] font-black text-black leading-[1.05] tracking-tight mb-3">
          Built on Grit,<br />
          Delivered<br />
          by Gain.
        </h1>
        <p className="text-black/55 text-sm leading-relaxed mb-10 max-w-[270px]">
          Train smarter. Track every rep.<br />Become the strongest version of you.
        </p>

        {/* Primary CTA */}
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl font-black text-base text-brand active:scale-[0.97] transition-all duration-150 mb-3"
          style={{ backgroundColor: '#080808', letterSpacing: '-0.01em' }}
        >
          Get Started
        </button>

        <p className="text-center text-black/50 text-sm">
          Already a member?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-black font-black underline underline-offset-2"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  )
}
