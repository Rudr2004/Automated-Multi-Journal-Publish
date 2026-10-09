import { Check, Copy, ImageIcon, ZoomOut } from './uiIcons'
import { useRef, useState, type Ref } from 'react'
import type { ArticleFigure, ArticleTable } from '../../../mock-data/journals/j1'
import { copyText } from '../../../core/lib/clipboard'
import { useToast } from './Toast'
import { Modal } from './Modal'

/** Small copy-to-clipboard button with transient "Copied" state. */
export function CopyButton({ text, label = 'Copy', className = '', tone = 'default', iconOnly = false }: { text: string; label?: string; className?: string; tone?: 'default' | 'solid'; iconOnly?: boolean }) {
  const [done, setDone] = useState(false)
  const toast = useToast()
  const onClick = async () => {
    const ok = await copyText(text)
    if (!ok) { toast('Could not copy. Select the text and copy manually.', 'error'); return }
    setDone(true)
    setTimeout(() => setDone(false), 1800)
  }
  if (iconOnly) {
    return (
      <button type="button" onClick={onClick} aria-label={done ? 'Copied' : label} title={done ? 'Copied' : label}
        className={`inline-flex h-7 w-7 items-center justify-center rounded border border-transparent text-ink-muted transition-colors hover:border-line hover:bg-paper hover:text-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar ${className}`}>
        {done ? <Check className="h-4 w-4 text-oa" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      </button>
    )
  }
  return (
    <button type="button" onClick={onClick} aria-label={done ? 'Copied' : label}
      className={`inline-flex items-center justify-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-colors ${tone === 'solid' ? 'border-navy bg-navy text-white hover:bg-navy-900' : 'border-line bg-white text-navy hover:border-scholar hover:bg-scholar-soft'} ${className}`}>
      {done ? <Check className={`h-3.5 w-3.5 ${tone === 'solid' ? '' : 'text-oa'}`} aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
      {done ? 'Copied' : label}
    </button>
  )
}

export function DataTable({ table }: { table: ArticleTable }) {
  const m = /^(Table \d+)\.\s*(.*)$/.exec(table.caption)
  return (
    <figure className="my-8 overflow-hidden border border-line">
      <figcaption className="border-b border-line bg-mist px-4 py-2.5 text-[13px] leading-snug text-navy">
        {m ? <><span className="font-bold uppercase tracking-wide">{m[1]}.</span> <span className="font-semibold">{m[2]}</span></> : <span className="font-semibold">{table.caption}</span>}
      </figcaption>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="bg-white text-xs text-navy">
            <tr className="border-b border-line">{table.head.map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody>
            {table.rows.map((r, i) => (
              <tr key={i} className="border-t border-line first:border-t-0 hover:bg-mist/60">
                {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-2.5 font-medium">{c}</th> : <td key={j} className="px-4 py-2.5 tabular-nums">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}

const FW = 560, FH = 300

function ChartSvg({ figure, svgRef }: { figure: ArticleFigure; svgRef?: Ref<SVGSVGElement> }) {
  const W = FW, H = FH, L = 56, B = 56, T = 16, R = 16
  const max = Math.ceil(Math.max(...figure.values) / 10) * 10
  const bw = (W - L - R) / figure.values.length
  const y = (v: number) => T + (H - T - B) * (1 - v / max)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f))
  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={figure.caption} className="h-auto w-full border border-line bg-white" fontFamily="'Source Sans 3', Arial, sans-serif">
      <rect width={W} height={H} fill="#FFFFFF" />
      {ticks.map((t) => (
        <g key={t}>
          <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="#D5DEEF" />
          <text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#5B6573">{t}</text>
        </g>
      ))}
      {figure.values.map((v, i) => (
        <g key={i}>
          <rect x={L + i * bw + bw * 0.18} y={y(v)} width={bw * 0.64} height={H - B - y(v)} rx="0" fill={i === figure.values.length - 1 ? '#14284B' : '#7F9ACB'} />
          <text x={L + i * bw + bw / 2} y={y(v) - 6} textAnchor="middle" fontSize="11" fontWeight="600" fill="#1B2433">{v}</text>
          <text x={L + i * bw + bw / 2} y={H - B + 18} textAnchor="middle" fontSize="11" fill="#5B6573">{figure.labels[i]}</text>
        </g>
      ))}
      <text x={(L + W - R) / 2} y={H - 10} textAnchor="middle" fontSize="12" fill="#1B2433">{figure.xLabel}</text>
      <text transform={`translate(14 ${(T + H - B) / 2}) rotate(-90)`} textAnchor="middle" fontSize="12" fill="#1B2433">{figure.yLabel}</text>
    </svg>
  )
}

/** Bar chart drawn in code (no image assets). "View high-res" opens it large in a dialog; "Download image (PNG)" exports it at 3x. */
export function BarFigure({ figure }: { figure: ArticleFigure }) {
  const ref = useRef<SVGSVGElement>(null)
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const label = figure.caption.split('.')[0]
  const png = () => {
    const svg = ref.current
    if (!svg) return
    const scale = 3
    const xml = new XMLSerializer().serializeToString(svg).replace('<svg ', `<svg width="${FW}" height="${FH}" `)
    const img = new Image()
    img.onload = () => {
      const c = document.createElement('canvas')
      c.width = FW * scale; c.height = FH * scale
      const ctx = c.getContext('2d')
      if (!ctx) { toast('Could not export the image in this browser.', 'error'); return }
      ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height)
      ctx.drawImage(img, 0, 0, c.width, c.height)
      const a = document.createElement('a')
      a.href = c.toDataURL('image/png')
      a.download = `${label.toLowerCase().replace(/\s+/g, '-')}.png`
      a.click()
      toast('Figure image downloaded.')
    }
    img.onerror = () => toast('Could not export the image in this browser.', 'error')
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(xml)}`
  }
  const link = 'inline-flex items-center gap-1 rounded-sm py-1 text-xs font-semibold text-scholar hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar'
  return (
    <figure className="my-8 border border-line bg-mist p-4">
      <ChartSvg figure={figure} svgRef={ref} />
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
        <button type="button" onClick={() => setOpen(true)} className={link}><ZoomOut className="h-4 w-4" aria-hidden />View high-res</button>
        <span aria-hidden className="text-ink-muted">|</span>
        <button type="button" onClick={png} className={link}><ImageIcon className="h-4 w-4" aria-hidden />Download image (PNG)</button>
      </div>
      <figcaption className="mt-2 text-[13px] leading-relaxed text-ink-muted"><span className="font-bold text-navy">{label}.</span>{figure.caption.slice(figure.caption.indexOf('.') + 1)}</figcaption>
      <Modal open={open} onClose={() => setOpen(false)} title={label} size="xl">
        <ChartSvg figure={figure} />
        <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">{figure.caption}</p>
      </Modal>
    </figure>
  )
}

export const OrcidIcon = ({ id }: { id: string }) => (
  <a href={`https://orcid.org/${id}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD ${id}`} title={`ORCID: ${id}`}
    className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#A6CE39] text-[9px] font-bold leading-none text-white">iD</a>
)
