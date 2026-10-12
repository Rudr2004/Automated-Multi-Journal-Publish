// Reading tabs: Abstract (with keywords and history), Full text (sections, tables, figure data) and References.
import { Fragment, useMemo } from 'react'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ArticleFigure, ArticleFull, ArticleTable, Reference } from '../../../../core/types'
import { MdOutlineStars, MdOutlineSubject } from 'react-icons/md'
import { exhibitsOf, H2, MONO, NAVY } from './shared'

const BODY = 'break-words font-work text-xs leading-relaxed text-justify text-abyss-800 sm:text-sm'
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
        : <span key={i} className="whitespace-nowrap text-[0.85em]">[{n.map((x, j) => (
          <Fragment key={x}>{j > 0 && ','}<button type="button" aria-label={`Reference ${x}`} onClick={() => onRef(x)} className="rounded-sm px-0.5 font-semibold text-cobalt-700 hover:underline">{x}</button></Fragment>
        ))}]</span>)}
    </p>
  )
}

function DataTable({ table }: { table: ArticleTable }) {
  return (
    <div role="region" aria-label={table.caption} tabIndex={0} className="max-h-[26rem] overflow-auto rounded-lg border border-abyss-200">
      <table className="w-full min-w-[460px] border-collapse text-left text-xs">
        <caption className="caption-top border-b border-abyss-200 bg-abyss-50 p-2.5 text-left text-xs font-semibold text-abyss-900">{table.caption}</caption>
        <thead><tr>{table.head.map((h) => <th key={h} scope="col" className="sticky top-0 border-b border-abyss-200 bg-abyss-100 p-2.5 text-xs font-semibold text-[#0b2545]">{h}</th>)}</tr></thead>
        <tbody className="divide-y divide-abyss-100">{table.rows.map((r, i) => (
          <tr key={i} className="hover:bg-abyss-50">
            {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="p-2.5 font-medium text-abyss-900">{c}</th> : <td key={j} className={`p-2.5 text-[11px] text-steel-700 ${MONO}`}>{c}</td>)}
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
    <figure className="rounded-lg border border-abyss-200 bg-abyss-50 p-3 shadow-hair">
      <ul className="space-y-2" aria-label={`${fig.yLabel} by ${fig.xLabel}`}>
        {fig.labels.map((l, i) => (
          <li key={l} className="grid grid-cols-[minmax(0,8rem)_1fr_3.5rem] items-center gap-3 text-sm sm:grid-cols-[10rem_1fr_4rem]">
            <span className="break-words text-steel-700">{l}</span>
            <span aria-hidden="true" className="h-3 rounded-sm bg-abyss-100"><span className="block h-full rounded-sm bg-azure-600" style={{ width: `${(fig.values[i] / max) * 100}%` }} /></span>
            <span className="text-right font-semibold tabular-nums text-abyss-900">{fig.values[i]}</span>
          </li>
        ))}
      </ul>
      <figcaption className="mt-3 border-t border-abyss-100 pt-3 text-[11px] leading-snug text-abyss-800"><strong className="font-semibold text-abyss-900">Figure {index}.</strong> {fig.caption.replace(/^Figure\s+\d+\.\s*/i, '')}</figcaption>
    </figure>
  )
}

export function AbstractPanel({ article }: { article: ArticleFull }) {
  const figs = exhibitsOf(article).length
  const glance = [
    article.subject && `Research area: ${article.subject}.`,
    `${article.type}${article.pages ? `, pages ${article.pages}` : ''}.`,
    article.sections?.length && `${article.sections.length} sections${figs ? ` with ${figs} figure${figs === 1 ? '' : 's'} and tables` : ''}.`,
    article.references?.length && `${article.references.length} references.`,
  ].filter(Boolean) as string[]
  return (
    <div className="space-y-4 pt-1">
      <div className="flex items-center justify-between gap-3 border-b border-abyss-100 pb-2">
        <h2 className={`${H2} flex items-center gap-2`}><MdOutlineSubject className="h-6 w-6 text-azure-600" aria-hidden="true" />Abstract</h2>
        <span className={`hidden text-[11px] text-steel-600 sm:inline ${MONO}`}>{article.type}</span>
      </div>
      {glance.length > 0 && (
        <div className="space-y-2 rounded-r-lg border border-l-4 border-azure-200 border-l-azure-600 bg-azure-50 p-4 text-xs">
          <div className={`flex items-center gap-1.5 font-serif4 font-bold ${NAVY}`}><MdOutlineStars className="h-4 w-4 text-azure-600" aria-hidden="true" />At a glance</div>
          <ul className="space-y-1.5 pl-2 text-abyss-800">
            {glance.map((g) => <li key={g} className="flex items-start gap-1.5"><span aria-hidden="true" className="font-bold text-azure-600">•</span>{g}</li>)}
          </ul>
        </div>
      )}
      <div id="abstract-text" className="scroll-mt-32">
        {article.abstract ? <p className={BODY}>{article.abstract}</p> : <p className="text-sm text-steel-600">No abstract is available for this article.</p>}
      </div>
      {article.keywords?.length > 0 && (
        <div id="keywords" className="scroll-mt-32 space-y-1.5 pt-2">
          <h3 className="text-xs font-semibold text-abyss-800">Keywords:</h3>
          <ul className="flex flex-wrap gap-1.5">
            {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-flex min-h-9 items-center rounded border border-abyss-200 bg-abyss-100 px-2.5 text-xs text-abyss-700 hover:border-azure-600 hover:text-cobalt-700">{k}</AppLink></li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

export function FullTextPanel({ article, onRef }: { article: ArticleFull; onRef: (n: number) => void }) {
  let fig = 0
  return (
    <div>
      <h2 className="sr-only">Full article</h2>
      {article.sections.map((s, i) => (
        <section key={s.id} id={s.id} tabIndex={-1} aria-labelledby={`${s.id}-h`} className={`scroll-mt-32 space-y-3 focus:outline-none ${i ? 'pt-6' : 'pt-3'}`}>
          <h3 id={`${s.id}-h`} className={`font-serif4 text-base font-bold leading-snug ${NAVY}`}>{i + 1}. {s.title}</h3>
          <div className="space-y-3">{s.paragraphs.map((p, pi) => <Paragraph key={pi} text={p} count={article.references?.length ?? 0} onRef={onRef} />)}</div>
          {s.table && <div><DataTable table={s.table} /></div>}
          {s.figure && <div><FigureData fig={s.figure} index={++fig} /></div>}
        </section>
      ))}
    </div>
  )
}

/** Every figure and table of the paper in one place (hidden in print, where the full text already carries them). */
export function FiguresPanel({ article, onGo }: { article: ArticleFull; onGo: (sectionId: string) => void }) {
  let fig = 0
  const items = exhibitsOf(article)
  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-abyss-100 pb-2"><h2 className={H2}>Figures &amp; tables</h2><span className="text-xs text-steel-600">{items.length} in total</span></div>
      <ul id="figures-list" className="mt-5 scroll-mt-32 space-y-6">
        {items.map(({ kind, section }) => (
          <li key={`${section.id}-${kind}`}>
            {kind === 'table' ? <DataTable table={section.table as ArticleTable} /> : <FigureData fig={section.figure as ArticleFigure} index={++fig} />}
            <p className="mt-2 text-xs text-steel-600">From section <button type="button" onClick={() => onGo(section.id)} className="rounded font-semibold text-cobalt-700 underline underline-offset-2 hover:text-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">{section.title}</button></p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ReferencesPanel({ article }: { article: ArticleFull }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-abyss-100 pb-2"><h2 className={H2}>References</h2><span className="text-xs text-steel-600">{article.references.length} references</span></div>
      <ol id="references-list" className="mt-4 scroll-mt-32 divide-y divide-abyss-100 border-b border-abyss-100">
        {article.references.map((r, i) => (
          <li key={i} id={`ref-${i + 1}`} tabIndex={-1} className="flex gap-3 py-3 font-work text-sm leading-relaxed text-steel-700 focus:bg-azure-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
            <span className="w-9 shrink-0 font-semibold tabular-nums text-cobalt-700">[{i + 1}]</span>
            <span className="min-w-0 max-w-[72ch] break-words">{r.text}<RefDoi r={r} /></span>
          </li>
        ))}
      </ol>
    </div>
  )
}
