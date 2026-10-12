// Reading column blocks: Abstract + keywords, publication history, Full text (sections, tables, figure data) and References.
import { Fragment, useMemo } from 'react'
import { paths } from '../../../../config/routes'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFigure, ArticleFull, ArticleTable, Reference } from '../../../../core/types'
import { Clock, History } from '../../icons'
import { CARD, LABEL } from './shared'

const BODY = 'break-words font-serif4 text-[15px] leading-relaxed text-obsidian-900 sm:text-base'
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
    <div role="region" aria-label={table.caption} tabIndex={0} className={`${CARD} max-h-[26rem] overflow-auto p-4`}>
      <table className="w-full min-w-[460px] border-collapse text-left font-work text-xs">
        <caption className="caption-top pb-2 text-left font-serif4 text-xs italic text-[#564241]">{table.caption}</caption>
        <thead><tr>{table.head.map((h) => <th key={h} scope="col" className="sticky top-0 border-b border-[#DCC0BE] bg-[#F4F5FC] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-wine-900">{h}</th>)}</tr></thead>
        <tbody>{table.rows.map((r, i) => (
          <tr key={i} className="border-b border-[#DCC0BE]/60 last:border-0 even:bg-[#F4F5FC]/50">
            {r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-3 py-2 font-semibold text-obsidian-900">{c}</th> : <td key={j} className="px-3 py-2 tabular-nums text-obsidian-800">{c}</td>)}
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
    <figure className={`${CARD} space-y-2.5 p-4`}>
      <div className="rounded bg-[#F4F5FC] p-3">
        <ul className="space-y-2" aria-label={`${fig.yLabel} by ${fig.xLabel}`}>
          {fig.labels.map((l, i) => (
            <li key={l} className="grid grid-cols-[minmax(0,8rem)_1fr_3.5rem] items-center gap-3 font-work text-xs sm:grid-cols-[10rem_1fr_4rem]">
              <span className="break-words text-obsidian-800">{l}</span>
              <span aria-hidden="true" className="h-3 rounded-sm bg-[#DCE2F7]"><span className="block h-full rounded-sm bg-wine-900" style={{ width: `${(fig.values[i] / max) * 100}%` }} /></span>
              <span className="text-right font-semibold tabular-nums text-obsidian-900">{fig.values[i]}</span>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="font-serif4 text-xs italic text-[#564241]"><strong className="font-bold not-italic">Figure {index}.</strong> {fig.caption.replace(/^Figure\s+\d+\.\s*/i, '')}</figcaption>
    </figure>
  )
}

export function AbstractPanel({ article }: { article: ArticleFull }) {
  return (
    <>
      <div id="abstract" className="scroll-mt-32 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-newsreader text-xl font-semibold text-obsidian-900">Abstract</h2>
          <span className="font-work text-[11px] text-[#564241]">{article.type}</span>
        </div>
        <div className="relative rounded bg-[#F4F5FC] p-4 shadow-[inset_4px_0_0_0_#701A1E]">
          <span className="mb-1.5 block font-work text-[10px] font-bold uppercase tracking-wider text-wine-800">Abstract</span>
          {article.abstract ? <p className="break-words text-justify font-serif4 text-sm leading-relaxed text-obsidian-900">{article.abstract}</p> : <p className="text-sm text-[#564241]">No abstract is available for this article.</p>}
        </div>
      </div>
      {article.keywords?.length > 0 && (
        <div id="keywords" className="scroll-mt-32 space-y-1.5">
          <h3 className={LABEL}>Keywords</h3>
          <ul className="flex flex-wrap gap-1.5">
            {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-flex min-h-9 items-center rounded bg-[#E9EDFF] px-2.5 py-1 font-work text-xs text-obsidian-900 transition-colors hover:bg-[#E1E8FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none">{k}</AppLink></li>)}
          </ul>
        </div>
      )}
    </>
  )
}

const days = (a?: string, b?: string) => (a && b ? Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000) : NaN)

export function HistoryPanel({ article }: { article: ArticleFull }) {
  const published = article.publishedOnline || article.publishedAt
  const all: { label: string; date?: string; hint: string; tone: 'plain' | 'ok' | 'pub' }[] = [
    { label: '1. Received', date: article.received, hint: 'Initial submission', tone: 'plain' },
    { label: '2. Accepted', date: article.accepted, hint: 'Formal acceptance', tone: 'ok' },
    { label: '3. Published online', date: published, hint: 'Open access release', tone: 'pub' },
  ]
  const steps = all.filter((s) => s.date)
  if (!steps.length) return null
  const total = days(article.received, published)
  const prod = days(article.accepted, published)
  return (
    <div id="publication-history" className="scroll-mt-32 space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCC0BE] pb-1">
        <h3 className={`${LABEL} flex items-center gap-1.5`}><History className="h-[15px] w-[15px] text-wine-800" aria-hidden="true" />Publication history &amp; timeline</h3>
        {total >= 0 && <span className="flex items-center gap-1 rounded border border-emerald-300 bg-emerald-50 px-2 py-0.5 font-work text-[10px] font-semibold text-emerald-800"><Clock className="h-3 w-3" aria-hidden="true" />{total} days from receipt to publication</span>}
      </div>
      <div className={`${CARD} space-y-4 p-4`}>
        <ol className={`grid grid-cols-2 gap-3 ${steps.length > 2 ? 'sm:grid-cols-3' : ''}`}>
          {steps.map((s) => (
            <li key={s.label} className={`flex flex-col justify-between space-y-1.5 rounded border p-2.5 ${s.tone === 'pub' ? 'border-amber-300/60 bg-amber-50/60' : 'border-[#DCC0BE]/60 bg-[#F4F5FC]/50'}`}>
              <span className={`font-work text-[10px] font-bold uppercase tracking-wider ${s.tone === 'pub' ? 'text-amber-900' : 'text-[#564241]'}`}>{s.label}</span>
              <span className={`font-mono text-xs font-semibold tabular-nums ${s.tone === 'ok' ? 'text-emerald-800' : s.tone === 'pub' ? 'text-wine-800' : 'text-obsidian-900'}`}>{formatDate(s.date as string)}</span>
              <span className={`font-work text-[11px] ${s.tone === 'ok' ? 'font-medium text-emerald-800' : s.tone === 'pub' ? 'font-medium text-amber-900' : 'text-[#564241]'}`}>{s.hint}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCC0BE] pt-2.5 font-work text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-obsidian-900">Version of Record (VoR):</span>
            <span className="rounded bg-[#E9EDFF] px-2 py-0.5 font-mono text-[11px] font-medium text-wine-800">Vol. {article.volume}, Issue {article.issue} ({formatMonthYear(article.publishedAt)})</span>
          </div>
          {prod >= 0 && <span className="flex items-center gap-1.5 text-[11px] text-[#564241]"><Clock className="h-[13px] w-[13px] text-emerald-700" aria-hidden="true" />Acceptance to online: <strong>{prod} days</strong></span>}
        </div>
      </div>
    </div>
  )
}

export function FullTextPanel({ article, onRef }: { article: ArticleFull; onRef: (n: number) => void }) {
  let fig = 0
  return (
    <div id="full-text" className="scroll-mt-32 space-y-6">
      <h2 className="sr-only">Full text</h2>
      {article.sections.map((s) => {
        const figNo = s.figure ? ++fig : 0
        return (
          <section key={s.id} id={s.id} tabIndex={-1} aria-labelledby={`${s.id}-h`} className="scroll-mt-32 space-y-3 focus:outline-none">
            <div className="flex flex-wrap items-center justify-between gap-x-3">
              <h3 id={`${s.id}-h`} className="font-newsreader text-base font-semibold text-obsidian-900">{s.title}</h3>
              {s.figure && <span className="font-work text-xs text-[#564241]">Fig {figNo}</span>}
            </div>
            <div className="space-y-4">{s.paragraphs.map((p, pi) => <Paragraph key={pi} text={p} count={article.references?.length ?? 0} onRef={onRef} />)}</div>
            {s.table && <DataTable table={s.table} />}
            {s.figure && <FigureData fig={s.figure} index={figNo} />}
          </section>
        )
      })}
    </div>
  )
}

export function ReferencesPanel({ article }: { article: ArticleFull }) {
  return (
    <div id="references" className="scroll-mt-32 space-y-2">
      <h3 className="font-newsreader text-base font-semibold text-obsidian-900">References</h3>
      <ol id="references-list" className={`${CARD} space-y-2 p-3.5 font-work text-xs text-obsidian-900`}>
        {article.references.map((r, i) => (
          <li key={i} id={`ref-${i + 1}`} tabIndex={-1} className="flex gap-1.5 rounded leading-relaxed focus:bg-wine-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">
            <span className="shrink-0 tabular-nums">[{i + 1}]</span>
            <span className="min-w-0 break-words">{r.text}<RefDoi r={r} /></span>
          </li>
        ))}
      </ol>
    </div>
  )
}
