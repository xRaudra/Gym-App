/**
 * Grit n Gain — Logo component
 * Uses the official Logo.png from assets.
 * Pass `size` to control height (width scales proportionally).
 */
export default function Logo({ size = 64, className = '' }) {
  return (
    <img
      src="/logo.png"
      alt="Grit n Gain"
      height={size}
      style={{ height: size, width: 'auto', display: 'block' }}
      className={className}
      draggable={false}
    />
  )
}
