import Logo from './Logo'

// Shared split layout for all auth pages (Login, Register)
// Mobile  → full-screen with advid.jpg background + form overlay
// Desktop → left half: fitness image + brand copy / right half: form panel
export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Left image panel (lg+) ───────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col overflow-hidden flex-shrink-0">
        <img
          src="/advid.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          draggable={false}
        />
        {/* Dark tinted gradient over image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(150deg, rgba(5,5,5,0.96) 0%, rgba(5,5,5,0.72) 55%, rgba(5,5,5,0.88) 100%)',
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-12 xl:p-16">
          {/* Logo placeholder */}
          <Logo size={46} />

          <div className="flex-1" />

          {/* Brand copy */}
          <div className="max-w-xs xl:max-w-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600 mb-4">
              Grit n Gain
            </p>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight mb-4">
              Every rep<br />counts.
            </h2>
            <p className="text-gray-400 text-[15px] leading-relaxed mb-10">
              Personalised workouts, smart nutrition, and progress
              tracking — all in one place.
            </p>

            {/* Stats */}
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-black" style={{ color: '#ffec64' }}>500+</p>
                <p className="text-xs text-gray-600 mt-0.5">Exercises</p>
              </div>
              <div>
                <p className="text-2xl font-black text-brand">7-Day</p>
                <p className="text-xs text-gray-600 mt-0.5">Plan</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-gray-600 mt-0.5">Yours</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div className="flex-1 relative flex flex-col min-h-screen overflow-y-auto">
        {/* Mobile-only image background */}
        <img
          src="/advid.jpg"
          alt=""
          className="lg:hidden absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.12 }}
          draggable={false}
        />
        <div
          className="lg:hidden absolute inset-0"
          style={{ backgroundColor: 'rgba(5,5,5,0.9)' }}
        />

        {/* Form slot — vertically centered on desktop, stacked on mobile */}
        <div className="relative z-10 flex flex-col min-h-screen lg:min-h-0 lg:h-full lg:justify-center px-6 sm:px-10 lg:px-12 xl:px-16 py-10">
          {children}
        </div>
      </div>
    </div>
  )
}
