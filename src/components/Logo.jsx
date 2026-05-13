// Logo placeholder — swap this component when the final logo asset is ready
export default function Logo({ size = 40, className = '' }) {
  const fs = Math.round(size * 0.4)
  return (
    <div
      className={`flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.26),
        background: 'rgba(255,236,100,0.1)',
        border: '1.5px solid rgba(255,236,100,0.25)',
      }}
    >
      <span style={{ color: '#ffec64', fontSize: fs, fontWeight: 900, lineHeight: 1 }}>G</span>
    </div>
  )
}
