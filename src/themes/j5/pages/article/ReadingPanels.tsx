// Reading tabs: Abstract (with keywords and history), Full text (sections, tables, figure data) and References.
import { Fragment, useMemo } from 'react'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFigure, ArticleFull, ArticleTable, Reference } from '../../../../core/types'
import { Kicker, DropCap } from '../../components/signature'
import { AuthorCards } from './AuthorCards'
import { H2, PanelTitle } from './shared'

const BODY = 'max-w-[68ch] break-words font-serif4 text-[17px] leading-[1.75] text-obsidian-800 sm:text-[18px]'
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
  return <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="font-medium text-wine-700 underline underline-offset-2 hover:text-wine-800">doi:{r.doi}<span className="sr-only"> (opens in a new tab)</span></a></>
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
          <Fragment key={x}>{j > 0 && ','}<button type="button" aria-label={`Reference ${x}`} onClick={() => onRef(x)} className="rounded-sm px-0.5 font-semibold text-wine-700 hover:underline">{x}</button></Fragment>
        ))}]</span>)}
    </p>
  )
}

function DataTable({ table }: { table: ArticleTable }) {
  return (
    <div role="region" aria-label={table.caption} tabIndex={0} className="max-h-[26rem] overflow-auto border-y-2 border-wine-800 bg-white">
      <table className="w-full min-w-[460px] border-collapse text-left font-work text-sm">
        <caption className="caption-top bg-white px-1 pb-2 pt-1 text-left font-newsreader text-base font-semibold italic text-obsidian-900">{table.caption}</caption>
        <thead><tr>{table.head.map((h) => <th key={h} scope="col" className="sticky top-0 border-y border-wine-800/40 bg-[#FBF8F4] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-wine-800">{h}</th>)}</tr></thead>
        <tbody>{table.rows.map((r, i) => (
          <tr key={i} className="border-b border-obsidian-100 last:border-0 even:bg-[#FBF8F4]">
            {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-2.5 font-semibold text-obsidian-900">{c}</th> : <td key={j} className="px-4 py-2.5 tabular-nums text-obsidian-700">{c}</td>)}
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
    <figure className="rounded-sm border-y-2 border-wine-800 bg-white px-1 py-4">
      <ul className="space-y-2" aria-label={`${fig.yLabel} by ${fig.xLabel}`}>
        {fig.labels.map((l, i) => (
          <li key={l} className="grid grid-cols-[minmax(0,8rem)_1fr_3.5rem] items-center gap-3 text-sm sm:grid-cols-[10rem_1fr_4rem]">
            <span className="break-words text-obsidian-700">{l}</span>
            <span aria-hidden="true" className="h-3 rounded-sm bg-[#F3ECE3]"><span className="block h-full rounded-sm bg-wine-800" style={{ width: `${(fig.values[i] / max) * 100}%` }} /></span>
            <span className="text-right font-semibold tabular-nums text-obsidian-900">{fig.values[i]}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 border-t border-obsidian-100 pt-3 text-sm text-obsidian-600"><strong className="font-semibold text-obsidian-900">Figure {index}.</strong> {fig.caption.replace(/^Figure\s+\d+\.\s*/i, '')}</figcaption>
    </figure>
  )
}

export function AbstractPanel({ article }: { article: ArticleFull }) {
  const history: [string, string | undefined][] = [['Received', article.received], ['Accepted', article.accepted], ['Published online', article.publishedOnline || article.publishedAt]]
  return (
    <div>
      <PanelTitle>Abstract</PanelTitle>
      <div id="abstract-text" className="mt-6 scroll-mt-32 rounded border border-wine-800/20 border-l-4 border-l-wine-800 bg-[#FBF8F4] bg-[radial-gradient(rgba(112,26,30,0.05)_1px,transparent_1px)] p-5 [background-size:5px_5px] sm:p-7">
        <Kicker>Abstract</Kicker>
        {article.abstract ? <DropCap text={article.abstract} className={`${BODY} mt-3 after:clear-both after:block after:content-['']`} /> : <p className="mt-2 text-obsidian-600">No abstract is available for this article.</p>}
      </div>
      {article.keywords?.length > 0 && (
        <div id="keywords" className="mt-8 scroll-mt-32">
          <h3><Kicker>Keywords</Kicker></h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-flex min-h-9 items-center rounded-sm border border-ochre-400/70 bg-ochre-50 px-3 text-sm font-medium text-obsidian-800 transition-colors hover:border-wine-700 hover:text-wine-700 motion-reduce:transition-none">{k}</AppLink></li>)}
          </ul>
        </div>
      )}
      <AuthorCards article={article} />
      {history.some(([, v]) => v) && (
        <div id="history" className="mt-10 max-w-[68ch] scroll-mt-32">
          <h3><Kicker>Publication history</Kicker></h3>
          <ol className="mt-3 grid gap-px overflow-hidden rounded border border-obsidian-200 bg-wine-800/15 sm:grid-cols-3">
            {history.filter(([, v]) => v).map(([k, v]) => (
              <li key={k} className="bg-[#FBF8F4] px-4 py-3"><p className="font-work text-[11px] font-semibold uppercase tracking-[0.1em] text-obsidian-600">{k}</p><p className="mt-1 font-newsreader text-base font-medium tabular-nums text-obsidian-900">{formatDate(v as string)}</p></li>
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
          <h3 id={`${s.id}-h`} className={H2}><span className="mr-2 font-work text-base font-semibold tabular-nums text-wine-700">{String(i + 1).padStart(2, '0')}</span>{s.title}</h3>
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
      <PanelTitle>References</PanelTitle>
      <ol id="references-list" className="mt-6 scroll-mt-32 divide-y divide-obsidian-100 border-y-2 border-wine-800">
        {article.references.map((r, i) => (
          <li key={i} id={`ref-${i + 1}`} tabIndex={-1} className="relative py-3 pl-10 font-serif4 text-[15px] leading-relaxed text-obsidian-700 focus:bg-wine-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">
            <span className="absolute left-0 top-3 w-9 font-work text-[13px] font-semibold tabular-nums leading-relaxed text-wine-700">[{i + 1}]</span>
            <span className="block min-w-0 max-w-[68ch] break-words">{r.text}<RefDoi r={r} /></span>
          </li>
        ))}
      </ol>
    </div>
  )
}
