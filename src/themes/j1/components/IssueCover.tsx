import { journal } from '../../../config/journals/j1'
import { formatMonthYear } from '../../../core/lib/format'

/** Generated issue cover (no image assets). Pattern varies by issue number. */
export function IssueCover({ volume, issue, month, className = '' }: {
  volume: number; issue: number; month: string; className?: string
}) {
  const seed = volume * 12 + issue
  const hue = ['#14284B', '#183868', '#1F4E9C'][seed % 3]
  const circles = Array.from({ length: 7 }, (_, i) => ({
    cx: 40 + ((seed * 37 + i * 53) % 160), cy: 60 + ((seed * 23 + i * 71) % 150), r: 10 + ((seed + i * 13) % 28),
  }))
  return (
    <svg viewBox="0 0 240 320" className={className} role="img"
      aria-label={`${journal.shortName} cover, Volume ${volume}, Issue ${issue}, ${formatMonthYear(month)}`}>
      <defs>
        <linearGradient id={`cov-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hue} />
          <stop offset="1" stopColor="#0B1930" />
        </linearGradient>
      </defs>
      <rect width="240" height="320" rx="6" fill={`url(#cov-${seed})`} />
      {circles.map((c, i) => (
        <g key={i} fill="none" stroke="#7F9ACB" strokeOpacity="0.45">
          <circle cx={c.cx} cy={c.cy} r={c.r} />
          <circle cx={c.cx} cy={c.cy} r={c.r / 2} />
        </g>
      ))}
      <path d="M30 175 L90 135 L150 160 L210 110" stroke="#DEE7F8" strokeOpacity="0.5" fill="none" strokeWidth="1.5" />
      <rect x="20" y="20" width="200" height="1.5" fill="#DEE7F8" opacity="0.6" />
      <text x="20" y="48" fill="#fff" fontSize="22" fontFamily="'Source Serif 4 Variable', 'Source Serif 4', serif" fontWeight="700">{journal.shortName}</text>
      <text x="20" y="66" fill="#AFC1E3" fontSize="8.5" fontFamily="'Source Sans 3 Variable', 'Source Sans 3', sans-serif" letterSpacing="1.2">OPEN ACCESS JOURNAL</text>
      <text x="20" y="276" fill="#fff" fontSize="15" fontFamily="'Source Serif 4 Variable', 'Source Serif 4', serif" fontWeight="600">Volume {volume} · Issue {issue}</text>
      <text x="20" y="296" fill="#AFC1E3" fontSize="11" fontFamily="'Source Sans 3 Variable', 'Source Sans 3', sans-serif">{formatMonthYear(month)}</text>
    </svg>
  )
}
