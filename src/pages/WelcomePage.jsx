import { useNavigate } from 'react-router-dom'

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">

      {/* Hero image */}
      <img
        src="/welcome.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-top"
        draggable={false}
      />

      {/* Gradient: clear top → yellow bottom */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,236,100,0) 0%, rgba(255,236,100,0) 38%, rgba(255,236,100,0.72) 62%, #ffec64 100%)',
        }}
      />

      {/* Spacer pushes content to bottom */}
      <div className="flex-1" />

      {/* Bottom content — centered with max-width for tablet/desktop */}
      <div className="relative px-6 pb-14 sm:pb-16 w-full max-w-md sm:max-w-lg md:max-w-xl mx-auto">
        <p className="text-black/50 text-xs font-bold uppercase tracking-[0.15em] mb-2">
          Your Digital Trainer
        </p>
        <h1 className="text-[2.75rem] sm:text-5xl font-black text-black leading-[1.05] tracking-tight mb-3">
          Built on Grit,<br />
          Delivered<br />
          by Gain.
        </h1>
        <p className="text-black/55 text-sm sm:text-base leading-relaxed mb-10 max-w-[300px]">
          Train smarter. Track every rep.<br />
          Become the strongest version of you.
        </p>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl font-black text-base active:scale-[0.97] transition-all duration-150 mb-3"
          style={{ backgroundColor: '#080808', color: '#ffec64', letterSpacing: '-0.01em' }}
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
