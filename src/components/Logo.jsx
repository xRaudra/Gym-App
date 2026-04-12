/**
 * Grit n Gain — G-Plate Logo
 * A weight plate whose shape IS the letter G.
 * Opening on right = the G mouth. Crossbar = the G shelf.
 * Text curves around the outer ring.
 */

export default function Logo({ size = 64, wordmark = false, light = false }) {
  const textColor = light ? '#111111' : '#FFFFFF'
  const brandColor = light ? '#3EBF45' : '#67DE6D'
  const plateFill  = light ? '#E8E8E3' : '#0F0F0F'
  const plateRim   = light ? '#D0D0CB' : '#1A1A1A'
  const holeFill   = light ? '#F4F4F0' : '#050505'
  const mutedText  = light ? '#AAAAAA' : '#2A2A2A'

  const iconSize = size
  const totalWidth = wordmark ? size * 3.4 : size

  return (
    <svg
      viewBox={wordmark ? `0 0 340 200` : `0 0 200 200`}
      width={totalWidth}
      height={iconSize}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Outer arc for top text */}
        <path id="topArc"
          d="M 8 100 A 92 92 0 0 1 192 100"
          fill="none"/>
        {/* Outer arc for bottom text (mirrored) */}
        <path id="botArc"
          d="M 192 100 A 92 92 0 0 1 8 100"
          fill="none"/>
      </defs>

      {/* ── Outer glow ring (subtle) ── */}
      <circle cx="100" cy="100" r="96" fill={brandColor} opacity="0.06"/>

      {/* ── G-plate body ──
          Outer r=88, inner hole r=50
          Opening at ±44° from right (3 o'clock)
          cos44≈0.719  sin44≈0.695
          Outer top-right:  (100+88×0.719, 100−88×0.695) = (163.3, 38.8) ≈ (163,39)
          Outer bot-right:  (163.3, 161.2) ≈ (163,161)
          Inner top-right:  (100+50×0.719, 100−50×0.695) = (136.0, 65.3) ≈ (136,65)
          Inner bot-right:  (136.0, 134.7) ≈ (136,135)
      ── */}
      <path
        d="M 163 39
           A 88 88 0 1 0 163 161
           L 136 135
           A 50 50 0 1 1 136 65
           Z"
        fill={plateFill}
      />

      {/* Plate rim ring detail (like real weight plate grooves) */}
      <path
        d="M 156 48
           A 76 76 0 1 0 156 152
           L 144 140
           A 62 62 0 1 1 144 60
           Z"
        fill="none"
        stroke={plateRim}
        strokeWidth="1.5"
      />

      {/* ── Crossbar (the G's shelf) ──
          From inner edge (x≈136) to outer edge (x≈188), centred vertically
          Crossbar spans y=84 → y=116 (32px tall)
      ── */}
      <path
        d="M 134 84
           L 188 84
           Q 194 84 194 90
           L 194 110
           Q 194 116 188 116
           L 134 116
           Z"
        fill={brandColor}
      />

      {/* ── Center hole ── */}
      <circle cx="100" cy="100" r="50" fill={holeFill}/>

      {/* ── Curved text — outer ring ── */}
      <text
        fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
        fontSize="10.5"
        fontWeight="800"
        letterSpacing="3"
        fill={brandColor}
        opacity="0.85"
        textAnchor="middle"
      >
        <textPath href="#topArc" startOffset="50%">
          GRIT N GAIN
        </textPath>
      </text>
      <text
        fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
        fontSize="10.5"
        fontWeight="800"
        letterSpacing="3"
        fill={brandColor}
        opacity="0.35"
        textAnchor="middle"
      >
        <textPath href="#botArc" startOffset="50%">
          GRIT N GAIN
        </textPath>
      </text>

      {/* ── Inner hole text ── */}
      <text
        x="100" y="94"
        textAnchor="middle"
        fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
        fontSize="20"
        fontWeight="900"
        fill={brandColor}
        letterSpacing="-1"
      >GG</text>
      <text
        x="100" y="108"
        textAnchor="middle"
        fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
        fontSize="7.5"
        fontWeight="700"
        fill={mutedText}
        letterSpacing="1.5"
      >25 KGS</text>

      {/* ══ WORDMARK (optional) ═══════════════════════════════════ */}
      {wordmark && (
        <>
          {/* Vertical divider */}
          <rect x="218" y="60" width="1.5" height="80" rx="1" fill={plateRim}/>

          {/* App name */}
          <text
            x="234" y="106"
            fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
            fontSize="42"
            fontWeight="900"
            letterSpacing="-2"
            fill={textColor}
          >
            GRIT
          </text>
          <text
            x="234" y="148"
            fontFamily="-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"
            fontSize="24"
            fontWeight="900"
            letterSpacing="4"
            fill={brandColor}
          >
            N GAIN
          </text>
        </>
      )}
    </svg>
  )
}
