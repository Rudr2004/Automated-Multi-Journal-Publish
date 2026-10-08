import { Check, Copy } from './uiIcons'
import { useState } from 'react'
import type { ArticleFigure, ArticleTable } from '../../../mock-data/journals/j1'
import { copyText } from '../../../core/lib/clipboard'
import { useToast } from './Toast'

/** Small copy-to-clipboard button with transient "Copied" state. */
export function CopyButton({ text, label = 'Copy', className = '' }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false)
  const toast = useToast()
  const onClick = async () => {
    const ok = await copyText(text)
    if (!ok) { toast('Could not copy. Select the text and copy manually.', 'error'); return }
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  return (
    <button type="button" onClick={onClick} aria-label={done ? 'Copied' : label}
      className={`inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1.5 text-xs font-semibold text-navy transition-colors hover:border-navy hover:bg-navy-50 ${className}`}>
      {done ? <Check className="h-3.5 w-3.5 text-oa" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {done ? 'Copied' : label}
    </button>
  )
}

export function DataTable({ table }: { table: ArticleTable }) {
  return (
    <figure className="my-8">
      <figcaption className="mb-2 text-sm font-semibold text-navy">{table.caption}</figcaption>
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-mist text-xs uppercase tracking-wide text-ink-muted">
            <tr>{table.head.map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="border-t border-line">
                {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-2.5 font-medium">{c}</th> : <td key={j} className="px-4 py-2.5 tabular-nums">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

/** Bar chart drawn in code (no image assets). */
export function BarFigure({ figure }: { figure: ArticleFigure }) {
  const W = 560, H = 300, L = 56, B = 56, T = 16, R = 16
  const max = Math.ceil(Math.max(...figure.values) / 10) * 10
  const bw = (W - L - R) / figure.values.length
  const y = (v: number) => T + (H - T - B) * (1 - v / max)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f))
  return (
    <figure className="my-8 rounded-lg border border-line bg-white p-4">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={figure.caption} className="h-auto w-full">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#D5DEEF" />
            <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#5B6573">{t}</text>
          </g>
        ))}
        {figure.values.map((v, i) => (
          <g key={i}>
            <rect x={L + i * bw + bw * 0.18} y={y(v)} width={bw * 0.64} height={H - B - y(v)} rx="3" fill={i === figure.values.length - 1 ? '#14284B' : '#7F9ACB'} />
            <text x={L + i * bw + bw / 2} y={y(v) - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1B2433">{v}</text>
            <text x={L + i * bw + bw / 2} y={H - B + 18} textAnchor="middle" fontSize="11" fill="#5B6573">{figure.labels[i]}</text>
          </g>
        ))}
        <text x={(L + W - R) / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="#1B2433">{figure.xLabel}</text>
        <text transform={`translate(14 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#1B2433">{figure.yLabel}</text>
      </svg>
      <figcaption className="mt-3 text-sm text-ink-muted"><span className="font-semibold text-navy">{figure.caption.split('.')[0]}.</span>{figure.caption.slice(figure.caption.indexOf('.') + 1)}</figcaption>
    </figure>
  )
}

export const OrcidIcon = ({ id }: { id: string }) => (
  <a href={`https://orcid.org/${id}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD ${id}`} title={`ORCID: ${id}`}
    className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#A6CE39] text-[9px] font-bold leading-none text-white">iD</a>
)
