// "Recently Published Articles", as in the reference: a serif heading with a Latest / Most Read / Most Cited switch, then compact rows
// (Volume / Issue, DOI and date line, serif title, authors, two-line abstract, citations chip, icon metrics, Cite, Read Article and PDF).
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { doiFor } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatNumber } from '../../../../core/lib/format'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, HomeData } from '../../../../core/types'
import { CiteMenu } from '../../components/CiteMenu'
import { cx } from '../../components/primitives'
import { Arrow, Download, Eye, Pdf, Quote } from '../../components/refIconsJ4'
import { Box } from './parts'

type TabId = 'latest' | 'read' | 'cited'
const TABS: { id: TabId; label: string }[] = [
  { id: 'latest', label: 'Latest Articles' },
  { id: 'read', label: 'Most Read' },
  { id: 'cited', label: 'Most Cited' },
]
const SHOWN = 5
const monthYear = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

function Metric({ icon: Icon, n, word }: { icon: typeof Eye; n: number; word: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium tabular-nums text-slate-500" title={word}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />{formatNumber(n)}<span className="sr-only"> {word}</span>
    </span>
  )
}

function Row({ a }: { a: ArticleSummary }) {
  return (
    <article className="border-b border-slate-100 pb-4">
      <p className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 font-mono text-xs text-slate-500">
        <span className="font-semibold text-cobalt-700">Volume {String(a.volume).padStart(2, '0')} Issue {String(a.issue).padStart(2, '0')}</span>
        <span aria-hidden="true">•</span><span className="break-all">DOI: {doiFor(a.paperId)}</span>
        <span aria-hidden="true">•</span><span>{monthYear(a.publishedAt)}</span>
      </p>
      <h3 className="mb-1.5 font-serif4 text-sm font-bold leading-snug text-slate-900 md:text-base">
        <AppLink to={paths.article(a.paperId)} className="transition-colors hover:text-cobalt-700">{a.title}</AppLink>
      </h3>
      <p className="mb-2 text-xs text-slate-500">{a.authors.join(', ')} • <em>{a.subject}</em></p>
      <p className="mb-3 line-clamp-2 text-xs leading-relaxed text-slate-600">{a.abstract}</p>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs font-medium">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-700">Citations: {a.citations}</span>
          <Metric icon={Eye} n={a.views} word="views" />
          <Metric icon={Download} n={a.downloads} word="downloads" />
          <CiteMenu article={a} className="inline-flex items-center gap-1 text-[11px] text-slate-500 underline hover:text-cobalt-700"><Quote className="h-3.5 w-3.5" aria-hidden="true" />Cite</CiteMenu>
        </div>
        <div className="flex items-center gap-2">
          <AppLink to={paths.article(a.paperId)} className="text-cobalt-700 hover:underline">Read Article<span className="sr-only">: {a.title}</span></AppLink>
          <button type="button" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`} className="flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-800 transition-colors hover:bg-slate-200"><Pdf className="h-3.5 w-3.5" aria-hidden="true" />PDF</button>
        </div>
      </div>
    </article>
  )
}

export function ArticleTabs({ data }: { data: HomeData }) {
  const [tab, setTab] = useState<TabId>('latest')
  const base = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const lists = useMemo<Record<TabId, ArticleSummary[]>>(() => {
    const seen = new Map<string, ArticleSummary>()
    ;[...data.latest, ...data.mostRead, ...data.editorsChoice].forEach((a) => seen.set(a.paperId, a))
    return { latest: data.latest, read: data.mostRead, cited: [...seen.values()].sort((a, b) => b.citations - a.citations) }
  }, [data])
  const list = lists[tab].slice(0, SHOWN)

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i + TABS.length - 1) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1
    if (n < 0) return
    e.preventDefault(); setTab(TABS[n].id); refs.current[TABS[n].id]?.focus()
  }

  return (
    <Box id="archives" aria-labelledby={`${base}-h`} className="p-5 md:p-6">
      <div className="mb-4 flex flex-col items-start justify-between gap-3 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
        <h2 id={`${base}-h`} className="font-serif4 text-xl font-bold text-[#0b2545]">Recently Published Articles</h2>
        <div role="tablist" aria-label="Article lists" className="flex items-center gap-1 rounded-[8px] bg-slate-100 p-0.5 text-xs font-medium">
          {TABS.map((t, i) => (
            <button key={t.id} ref={(el) => { refs.current[t.id] = el }} type="button" role="tab" id={`${base}-${t.id}`} aria-selected={tab === t.id} aria-controls={`${base}-panel`} tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}
              className={cx('rounded-md px-3 py-1 transition-colors', tab === t.id ? 'bg-cobalt-700 text-white shadow-[0_1px_2px_rgba(15,23,42,0.2)]' : 'text-slate-600 hover:text-slate-900')}>{t.label}</button>
          ))}
        </div>
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-${tab}`} className="space-y-4">
        {list.map((a) => <Row key={`${tab}-${a.paperId}`} a={a} />)}
      </div>
      <div className="pt-3 text-right">
        <AppLink to={paths.search('')} className="inline-flex items-center gap-1 text-xs font-semibold text-cobalt-700 hover:text-cobalt-800">View All Articles <Arrow className="h-4 w-4" aria-hidden="true" /></AppLink>
      </div>
    </Box>
  )
}
