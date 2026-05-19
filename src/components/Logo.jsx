export default function Logo({ size = 40, className = '', variant = 'dark' }) {
  const src = variant === 'light' ? '/logo-white.png' : '/logo.png'
  return (
    <img
      src={src}
      alt="Geode Fit"
      draggable={false}
      className={`flex-shrink-0 ${className}`}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
