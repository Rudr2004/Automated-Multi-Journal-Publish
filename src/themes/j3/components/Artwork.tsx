// Abstract geometric duotone artwork in violet and orange, generated in code from a seed (e.g. a Paper ID), so each cover is unique and stable.
const hash = (s: string) => s.split('').reduce((n, c) => (n * 33 + c.charCodeAt(0)) >>> 0, 5381)
const PALETTES: [string, string, string, string][] = [
  ['#4B2E9B', '#7B66B6', '#F26B3A', '#1B1430'],
  ['#1B1430', '#634AA8', '#F7A384', '#DCD7EC'],
  ['#34206B', '#AC9ED1', '#F26B3A', '#F4F3F9'],
  ['#634AA8', '#1B1430', '#F4875F', '#C4BADE'],
]

export function Artwork({ seed, className, palette }: { seed: string; className?: string; palette?: number }) {
  const h = hash(seed)
  const [bg, a, b, c] = PALETTES[(palette ?? h) % PALETTES.length]
  const r = (n: number, m = 100) => (Math.floor(h / (n + 1)) >>> 0) % m
  const kind = h % 3
  return (
    <svg viewBox="0 0 200 200" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid slice" className={className}>
      <rect width="200" height="200" fill={bg} />
      {kind === 0 && (<>
        <circle cx={60 + r(1, 40)} cy={70 + r(2, 40)} r={62} fill={a} />
        <rect x={100 + r(3, 20)} y={20 + r(4, 30)} width={80} height={80} rx={40} fill={b} />
        <path d={`M0 200 A100 100 0 0 1 100 ${100 + r(5, 20)} L100 200 Z`} fill={c} opacity={0.9} />
      </>)}
      {kind === 1 && (<>
        <path d="M0 0 H200 V90 A90 90 0 0 1 110 0 Z" fill={a} />
        <circle cx={55 + r(1, 30)} cy={140} r={46} fill={b} />
        <rect x={110} y={110 + r(2, 20)} width={90} height={90} fill={c} opacity={0.9} />
        <circle cx={150} cy={60} r={18} fill={bg} />
      </>)}
      {kind === 2 && (<>
        <rect x={-20} y={110} width={150} height={150} rx={75} fill={a} />
        <path d={`M200 0 V${80 + r(1, 30)} A90 90 0 0 0 ${120 - r(2, 20)} 0 Z`} fill={b} />
        <circle cx={150} cy={150} r={34} fill={c} opacity={0.9} />
        <circle cx={60} cy={50} r={14} fill={b} />
      </>)}
    </svg>
  )
}
