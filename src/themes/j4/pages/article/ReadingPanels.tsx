// Reading tabs: Abstract (with keywords and history), Full text (sections, tables, figure data) and References.
import { Fragment, useMemo } from 'react'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFigure, ArticleFull, ArticleTable, Reference } from '../../../../core/types'
import { Label } from '../../components/primitives'
import { H2 } from './shared'

const BODY = 'max-w-[68ch] break-words font-serif4 text-[17px] leading-[1.75] text-abyss-800 sm:text-[18px]'
const CITE = /\[(\d+(?:\s*[,–-]\s*\d+)*)\]/g

function expand(s: string): number[] {
  const out: number[] = []
  s.split(',').forEach((part) => {
    const [a, b] = part.split(/[–-]/).map((x) => parseInt(x.trim(), 10))
    if (b && b >= a && b - a < 20) for (let n = a; n <= b; n++) out.push(n)
    else if (!Number.isNaN(a)) out.push(a)
  })
  return out
}

function RefDoi({ r }: { r: Reference }) {
  if (!r.doi) return null
  return <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="font-medium text-cobalt-700 underline underline-offset-2 hover:text-cobalt-800">doi:{r.doi}<span className="sr-only"> (opens in a new tab)</span></a></>
}

/** A paragraph whose "[3]" or "[2,4]" markers become buttons that jump to the reference. */
function Paragraph({ text, count, onRef }: { text: string; count: number; onRef: (n: number) => void }) {
  const nodes = useMemo(() => {
    const out: (string | number[])[] = []
    let last = 0
    for (const m of text.matchAll(CITE)) {
      const idx = m.index ?? 0
      out.push(text.slice(last, idx))
      const nums = expand(m[1]).filter((n) => n >= 1 && n <= count)
      out.push(nums.length ? nums : m[0])
      last = idx + m[0].length
    }
    out.push(text.slice(last))
    return out
  }, [text, count])
  return (
    <p className={BODY}>
      {nodes.map((n, i) => typeof n === 'string'
        ? <Fragment key={i}>{n}</Fragment>
        : <span key={i} className="whitespace-nowrap font-work text-[0.85em]">[{n.map((x, j) => (
          <Fragment key={x}>{j > 0 && ','}<button type="button" aria-label={`Reference ${x}`} onClick={() => onRef(x)} className="rounded-sm px-0.5 font-semibold text-cobalt-700 hover:underline">{x}</button></Fragment>
        ))}]</span>)}
    </p>
  )
}

function DataTable({ table }: { table: ArticleTable }) {
  return (
    <div role="region" aria-label={table.caption} tabIndex={0} className="max-h-[26rem] overflow-auto rounded-pane border border-abyss-200">
      <table className="w-full min-w-[460px] border-collapse text-left text-sm">
        <caption className="caption-top border-b border-abyss-200 bg-abyss-50 px-4 py-3 text-left font-semibold text-abyss-900">{table.caption}</caption>
        <thead><tr>{table.head.map((h) => <th key={h} scope="col" className="sticky top-0 border-b border-abyss-300 bg-abyss-100 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.08em] text-steel-700">{h}</th>)}</tr></thead>
        <tbody>{table.rows.map((r, i) => (
          <tr key={i} className="border-b border-abyss-100 last:border-0 even:bg-abyss-50">
            {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-2.5 font-semibold text-abyss-900">{c}</th> : <td key={j} className="px-4 py-2.5 tabular-nums text-steel-700">{c}</td>)}
          </tr>))}
        </tbody>
      </table>
    </div>
  )
}

/** A figure's data as labelled bars, with the numbers always visible so the chart has a text equivalent. */
function FigureData({ fig, index }: { fig: ArticleFigure; index: number }) {
  const max = Math.max(...fig.values, 1)
  return (
    <figure className="rounded-pane border border-abyss-200 bg-white p-4">
      <ul className="space-y-2" aria-label={`${fig.yLabel} by ${fig.xLabel}`}>
        {fig.labels.map((l, i) => (
          <li key={l} className="grid grid-cols-[minmax(0,8rem)_1fr_3.5rem] items-center gap-3 text-sm sm:grid-cols-[10rem_1fr_4rem]">
            <span className="break-words text-steel-700">{l}</span>
            <span aria-hidden="true" className="h-3 rounded-sm bg-abyss-100"><span className="block h-full rounded-sm bg-azure-600" style={{ width: `${(fig.values[i] / max) * 100}%` }} /></span>
            <span className="text-right font-semibold tabular-nums text-abyss-900">{fig.values[i]}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 border-t border-abyss-100 pt-3 text-sm text-steel-600"><strong className="font-semibold text-abyss-900">Figure {index}.</strong> {fig.caption.replace(/^Figure\s+\d+\.\s*/i, '')}</figcaption>
    </figure>
  )
}

export function AbstractPanel({ article }: { article: ArticleFull }) {
  const history: [string, string | undefined][] = [['Received', article.received], ['Accepted', article.accepted], ['Published online', article.publishedOnline || article.publishedAt]]
  return (
    <div>
      <h2 className={H2}>Abstract</h2>
      {article.abstract ? <p className={`${BODY} mt-4`}>{article.abstract}</p> : <p className="mt-4 text-steel-600">No abstract is available for this article.</p>}
      {article.keywords?.length > 0 && (
        <div className="mt-8">
          <h3><Label className="text-cobalt-700">Keywords</Label></h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-flex min-h-9 items-center rounded-ctl border border-abyss-200 bg-white px-3 text-sm font-medium text-steel-700 hover:border-cobalt-700 hover:text-cobalt-700">{k}</AppLink></li>)}
          </ul>
        </div>
      )}
      {history.some(([, v]) => v) && (
        <div className="mt-8 max-w-[68ch]">
          <h3><Label className="text-cobalt-700">Publication history</Label></h3>
          <ol className="mt-3 grid gap-px overflow-hidden rounded-pane border border-abyss-200 bg-abyss-200 sm:grid-cols-3">
            {history.filter(([, v]) => v).map(([k, v]) => (
              <li key={k} className="bg-white px-4 py-3"><p className="text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">{k}</p><p className="mt-1 text-sm font-medium tabular-nums text-abyss-900">{formatDate(v as string)}</p></li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

export function FullTextPanel({ article, onRef }: { article: ArticleFull; onRef: (n: number) => void }) {
  let fig = 0
  return (
    <div>
      <h2 className="sr-only">Full text</h2>
      {article.sections.map((s, i) => (
        <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className={`scroll-mt-32 ${i ? 'mt-12' : ''}`}>
          <h3 id={`${s.id}-h`} className={H2}><span className="mr-2 font-work text-base font-semibold tabular-nums text-cobalt-700">{String(i + 1).padStart(2, '0')}</span>{s.title}</h3>
          <div className="mt-4 space-y-5">{s.paragraphs.map((p, pi) => <Paragraph key={pi} text={p} count={article.references?.length ?? 0} onRef={onRef} />)}</div>
          {s.table && <div className="mt-6"><DataTable table={s.table} /></div>}
          {s.figure && <div className="mt-6"><FigureData fig={s.figure} index={++fig} /></div>}
        </section>
      ))}
    </div>
  )
}

export function ReferencesPanel({ article }: { article: ArticleFull }) {
  return (
    <div>
      <h2 className={H2}>References</h2>
      <ol className="mt-5 divide-y divide-abyss-100 border-y border-abyss-100">
        {article.references.map((r, i) => (
          <li key={i} id={`ref-${i + 1}`} tabIndex={-1} className="flex gap-3 py-3 text-[15px] leading-relaxed text-steel-700 focus:bg-azure-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
            <span className="w-9 shrink-0 font-semibold tabular-nums text-cobalt-700">[{i + 1}]</span>
            <span className="min-w-0 max-w-[68ch] break-words">{r.text}<RefDoi r={r} /></span>
          </li>
        ))}
      </ol>
    </div>
  )
}
