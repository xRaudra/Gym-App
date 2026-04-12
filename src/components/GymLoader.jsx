import Logo from './Logo'

export default function GymLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#080808' }}
    >
      <div style={{ animation: 'loaderSpin 1.8s linear infinite', transformOrigin: 'center' }}>
        <Logo size={72} />
      </div>
      <style>{`
        @keyframes loaderSpin {
          0%   { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
