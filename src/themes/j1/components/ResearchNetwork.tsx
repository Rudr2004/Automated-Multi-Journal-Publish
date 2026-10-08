// Decorative "research network" graphic (nodes = papers, edges = citations). Pure SVG, deterministic.
const rnd = (n: number) => { const x = Math.sin(n * 9301.7) * 43758.5453; return x - Math.floor(x) }

const NODES = Array.from({ length: 34 }, (_, i) => ({ x: 20 + rnd(i + 1) * 760, y: 20 + rnd(i + 91) * 460, r: 2 + rnd(i + 7) * 4.5 }))
const EDGES = NODES.flatMap((a, i) =>
  NODES.map((b, j) => ({ i, j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
    .filter((e) => e.j > e.i && e.d < 150)
    .map((e) => [NODES[e.i], NODES[e.j]] as const))

export function ResearchNetwork({ className = '' }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className={className}>
      <g stroke="#7F9ACB" strokeOpacity="0.35" strokeWidth="1">
        {EDGES.map(([a, b], i) => <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />)}
      </g>
      {NODES.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={n.r * 2.6} fill="#1F4E9C" fillOpacity="0.18" />
          <circle cx={n.x} cy={n.y} r={n.r} fill={i % 7 === 0 ? '#FFFFFF' : '#AFC1E3'} fillOpacity={i % 7 === 0 ? 0.9 : 0.7} />
        </g>
      ))}
    </svg>
  )
}
