export default function GymLoader() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: '#080808' }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: '50%',
          border: '3px solid #1e1e1e',
          borderTopColor: '#ffec64',
          animation: 'gymSpin 0.75s linear infinite',
        }}
      />
      <style>{`@keyframes gymSpin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
