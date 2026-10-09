// Article figures and tables: a CSS bar chart that opens in an accessible lightbox, and a scrollable data table.
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ArticleFigure as FigureData, ArticleTable } from '../../../core/types'
import { Close } from '../icons'
import { MdOutlineZoomIn } from 'react-icons/md'

const fmt = (n: number) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(n)

function Bars({ figure, large }: { figure: FigureData; large?: boolean }) {
  const max = Math.max(...figure.values, 1)
  return (
    <div role="img" aria-label={`Bar chart. ${figure.yLabel} by ${figure.xLabel}: ${figure.labels.map((l, i) => `${l} ${fmt(figure.values[i])}`).join(', ')}.`}>
      <p className="mb-2 text-xs font-medium text-graphite-600">{figure.yLabel}</p>
      <ul className={large ? 'space-y-3' : 'space-y-2'}>
        {figure.labels.map((l, i) => (
          <li key={l} className="grid grid-cols-[minmax(4.5rem,28%)_minmax(0,1fr)_auto] items-center gap-3">
            <span className={`break-words text-graphite-700 ${large ? 'text-sm' : 'text-xs'}`}>{l}</span>
            <span className="h-5 overflow-hidden rounded-chip bg-graphite-100" aria-hidden="true">
              <span className="block h-full rounded-chip bg-gradient-to-r from-accent-700 to-brand-500" style={{ width: `${Math.max(2, (figure.values[i] / max) * 100)}%` }} />
            </span>
            <span className={`tabular-nums font-semibold text-graphite-800 ${large ? 'text-sm' : 'text-xs'}`}>{fmt(figure.values[i])}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-right text-xs font-medium text-graphite-600">{figure.xLabel}</p>
    </div>
  )
}

export function FigureBlock({ figure, number }: { figure: FigureData; number: number }) {
  const [open, setOpen] = useState(false)
  const opener = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const btn = opener.current
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; btn?.focus() }
  }, [open])
  return (
    <figure className="mt-6 rounded-panel border border-graphite-200 bg-white p-4 shadow-card sm:p-5">
      <button ref={opener} type="button" onClick={() => setOpen(true)} aria-haspopup="dialog" aria-label={`Enlarge Figure ${number}`} className="group block w-full rounded-soft text-left">
        <Bars figure={figure} />
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent-700 group-hover:underline"><MdOutlineZoomIn className="h-4 w-4" aria-hidden="true" /> Click to enlarge</span>
      </button>
      <figcaption className="mt-3 border-t border-graphite-200 pt-3 text-sm text-graphite-700"><strong className="font-semibold text-graphite-800">Figure {number}.</strong> {figure.caption}</figcaption>
      {open && createPortal(
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-graphite-900/70 motion-safe:animate-fade-in" onClick={() => setOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" aria-label={`Figure ${number}`} className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sheet bg-white p-5 shadow-pop motion-safe:animate-fade-in sm:p-8">
            <button ref={closeBtn} type="button" onClick={() => setOpen(false)} aria-label="Close figure" className="absolute right-3 top-3 rounded-chip p-1.5 text-graphite-600 hover:bg-graphite-100"><Close className="h-5 w-5" aria-hidden="true" /></button>
            <p className="pr-8 font-display text-lg font-semibold text-graphite-800">Figure {number}</p>
            <p className="mb-5 mt-1 text-sm text-graphite-700">{figure.caption}</p>
            <Bars figure={figure} large />
          </div>
        </div>,
        document.body,
      )}
    </figure>
  )
}

export function DataTable({ table, number }: { table: ArticleTable; number: number }) {
  return (
    <figure className="mt-6">
      <figcaption className="mb-2 text-sm text-graphite-700"><strong className="font-semibold text-graphite-800">Table {number}.</strong> {table.caption}</figcaption>
      <div className="overflow-x-auto rounded-panel border border-graphite-200 bg-white" tabIndex={0} role="region" aria-label={`Table ${number}: ${table.caption}`}>
        <table className="w-full min-w-[28rem] border-collapse text-left text-sm">
          <thead className="bg-brand-50 text-brand-900">
            <tr>{table.head.map((h) => <th key={h} scope="col" className="px-3 py-2 font-semibold">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-graphite-200">
            {table.rows.map((r, i) => (
              <tr key={i} className="odd:bg-white even:bg-graphite-50/60">
                {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-3 py-2 font-medium text-graphite-800">{c}</th> : <td key={j} className="px-3 py-2 tabular-nums text-graphite-700">{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  )
}
