// Featured research articles and table of contents, as in the reference: heading with a double rule, three tabs and a stack of article cards
// (category, pages, title, authors, abstract, then a DOI / open access / PDF / Cite bar). Tabs are keyboard operable (arrow keys, Home, End).
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, HomeData } from '../../../../core/types'
import { CiteMenu } from '../../components/CiteMenu'
import { MilitaryTech } from '../../components/homeIconsJ5'
import { cx } from '../../components/primitives'
import { ArrowRight, Download, OpenAccess, Quote } from '../../icons'

type TabId = 'latest' | 'read' | 'choice'
const SHOWN = 3
const outlineBtn = 'inline-flex items-center gap-1 rounded border border-[#dcc0be] bg-white px-2.5 py-1 font-work text-[11px] text-[#141b2b] transition hover:bg-[#e9edff]'

function Card({ a, lead }: { a: ArticleSummary; lead?: boolean }) {
  return (
    <article className="rounded border border-[#dcc0be] bg-white p-6 shadow-sm transition hover:border-wine-800">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {lead && <span className="inline-flex items-center gap-1 rounded border border-[#9b4500]/30 bg-[#f4f5fc] px-2.5 py-0.5 font-work text-[11px] font-semibold uppercase tracking-wider text-[#9b4500]"><MilitaryTech className="h-[13px] w-[13px]" aria-hidden="true" />Featured Article</span>}
          <span className="font-work text-[11px] font-semibold uppercase tracking-wider text-[#564241]">{a.subject} • {a.type}</span>
        </div>
        <span className="font-work text-xs tabular-nums text-[#564241]">Vol. {a.volume}, Iss. {a.issue} • pp. {a.pages}</span>
      </div>
      <h3 className="mb-2 font-newsreader text-xl font-bold leading-snug text-[#141b2b] transition-colors hover:text-wine-800">
        <AppLink to={paths.article(a.paperId)}>{a.title}</AppLink>
      </h3>
      <p className="mb-3 font-work text-xs text-[#564241]">
        {a.authors.map((n, i) => <span key={n}>{i > 0 && ', '}<span className="font-semibold text-[#141b2b]">{n}</span></span>)}
      </p>
      <p className="mb-4 font-serif4 text-xs leading-relaxed text-[#564241] sm:text-sm">{a.abstract}</p>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#dcc0be] bg-[#f4f5fc] p-3 font-work text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-mono text-[11px] font-bold text-wine-800">DOI: {doiFor(a.paperId)}</span>
          {journal.badges.openAccess && <><span aria-hidden="true" className="text-[#dcc0be]">•</span><span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800"><OpenAccess className="h-[13px] w-[13px]" aria-hidden="true" /> Open Access {journal.licence.name}</span></>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`}
            className={lead ? 'inline-flex items-center gap-1 rounded bg-wine-800 px-3 py-1 font-work text-[11px] uppercase tracking-wider text-white transition hover:bg-bordeaux-900' : cx(outlineBtn, 'px-3 uppercase tracking-wider')}>
            <Download className="h-[13px] w-[13px]" aria-hidden="true" /> PDF
          </button>
          <CiteMenu article={a} className={outlineBtn}><Quote className="h-[13px] w-[13px]" aria-hidden="true" /> Cite</CiteMenu>
        </div>
      </div>
    </article>
  )
}

export function FeaturedArticles({ data }: { data: HomeData }) {
  const issue = data.currentIssue
  const tabs: { id: TabId; label: string }[] = [
    { id: 'latest', label: `Current Issue (Vol. ${issue.volume}, No. ${issue.issue})` },
    { id: 'read', label: 'Most Read' },
    { id: 'choice', label: 'Editor’s Choice' },
  ]
  const [tab, setTab] = useState<TabId>('latest')
  const base = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const lists = useMemo<Record<TabId, ArticleSummary[]>>(() => ({ latest: data.latest, read: data.mostRead, choice: data.editorsChoice }), [data])
  const list = lists[tab].slice(0, SHOWN)
  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i + tabs.length - 1) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1
    if (n < 0) return
    e.preventDefault(); setTab(tabs[n].id); refs.current[tabs[n].id]?.focus()
  }
  return (
    <section id="current-issue" aria-labelledby={`${base}-h`} className="space-y-6">
      <div className="border-b border-obsidian-200 pb-2">
        <div className="mb-3 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="min-w-0 flex-1">
            <div aria-hidden="true" className="j5-double-rule mb-2" />
            <h2 id={`${base}-h`} className="font-newsreader text-2xl font-semibold text-[#141b2b]">Featured Research Articles &amp; Table of Contents</h2>
            <p className="font-work text-xs text-[#564241]">Volume {issue.volume}, Issue {issue.issue} ({formatMonthYear(issue.publishedAt)}) • All Articles Open Access</p>
          </div>
          <div role="tablist" aria-label="Article lists" className="flex shrink-0 items-center gap-1 whitespace-nowrap border-b-2 border-[#dcc0be] pb-1 font-work text-xs sm:border-b-0 sm:pb-0">
            {tabs.map((t, i) => (
              <button key={t.id} ref={(el) => { refs.current[t.id] = el }} type="button" role="tab" id={`${base}-${t.id}`} aria-selected={tab === t.id} aria-controls={`${base}-panel`} tabIndex={tab === t.id ? 0 : -1}
                onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}
                className={cx('-mb-[2px] px-3 py-1.5 transition', tab === t.id ? 'border-b-2 border-wine-800 font-bold text-wine-800' : 'text-[#564241] hover:text-[#141b2b]')}>{t.label}</button>
            ))}
          </div>
        </div>
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-${tab}`} className="space-y-5">
        {list.map((a, i) => <Card key={`${tab}-${a.paperId}`} a={a} lead={tab === 'latest' && i === 0} />)}
      </div>
      <p className="text-right"><AppLink to={paths.currentIssue} className="inline-flex items-center gap-1 font-work text-xs font-bold uppercase tracking-wider text-wine-800 hover:underline">View full issue <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></AppLink></p>
    </section>
  )
}
