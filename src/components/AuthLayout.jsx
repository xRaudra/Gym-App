import Logo from './Logo'

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Left image card (lg+) ────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[46%] flex-shrink-0 p-4">
        {/* Rounded card */}
        <div className="relative w-full rounded-[20px] overflow-hidden flex flex-col">
          <img
            src="/bg-desktop.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.68) 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col h-full p-10 xl:p-12">
            {/* Top brand */}
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-[0.18em] mb-2">
                Your Digital Trainer
              </p>
              <div className="w-8 h-[1.5px]" style={{ backgroundColor: 'rgba(255,255,255,0.4)' }} />
            </div>

            <div className="flex-1" />

            {/* Bottom headline */}
            <div>
              <h2 className="text-4xl xl:text-5xl font-black text-white leading-[1.05] tracking-tight mb-3">
                Built on Grit,<br />
                Delivered by<br />
                Gain.
              </h2>
              <p className="text-white/55 text-sm xl:text-base leading-relaxed max-w-[260px]">
                Train smarter. Track every rep.<br />
                Become the strongest version of you.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div className="panel-light flex-1 relative flex flex-col min-h-screen overflow-y-auto lg:bg-white">
        {/* Mobile bg image */}
        <img
          src="/bg-mobile.jpg"
          alt=""
          className="lg:hidden absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.14 }}
          draggable={false}
        />
        <div
          className="lg:hidden absolute inset-0"
          style={{ backgroundColor: 'rgba(5,5,5,0.88)' }}
        />

        {/* Logo — top center on desktop */}
        <div className="hidden lg:flex justify-center pt-10 relative z-10">
          <Logo size={46} />
        </div>

        {/* Form slot */}
        <div className="relative z-10 flex flex-col flex-1 lg:justify-center px-6 sm:px-10 lg:px-14 xl:px-20 py-10 lg:py-8">
          {children}
        </div>
      </div>
    </div>
  )
}
