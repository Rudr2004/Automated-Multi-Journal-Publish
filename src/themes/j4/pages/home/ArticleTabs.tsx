// Tabbed article lists: Latest, Most Read and Editor's Choice. Every row shows the area and type, the title, author photo chips, the DOI,
// icon metrics (views, downloads, citations) and PDF / Cite actions. The abstract opens on demand, so no text is cut off.
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatNumber } from '../../../../core/lib/format'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, HomeData } from '../../../../core/types'
import { areaColor } from '../../components/areas'
import { AuthorChipsJ4 } from '../../components/AuthorChipJ4'
import { CiteMenu } from '../../components/CiteMenu'
import { Eye } from '../../components/homeIconsJ4'
import { cx, Tag } from '../../components/primitives'
import { ArrowRight, Download, OpenAccess, Quote } from '../../icons'

type TabId = 'latest' | 'read' | 'choice'
const TABS: { id: TabId; label: string }[] = [
  { id: 'latest', label: 'Latest' },
  { id: 'read', label: 'Most Read' },
  { id: 'choice', label: 'Editor’s Choice' },
]
const SHOWN = 5
const act = 'inline-flex h-8 items-center gap-1.5 rounded-ctl border border-abyss-300 bg-white px-2.5 text-xs font-semibold text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700'

function Metric({ icon: Icon, n, word }: { icon: typeof Eye; n: number; word: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold tabular-nums text-steel-700" title={word}>
      <Icon className="h-4 w-4 text-steel-500" aria-hidden="true" />{formatNumber(n)}<span className="sr-only"> {word}</span>
    </span>
  )
}

function Row({ a }: { a: ArticleSummary }) {
  const color = areaColor(a.subject)
  return (
    <article className="p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-ctl border px-2 py-0.5 text-xs font-semibold text-abyss-900" style={{ borderColor: `${color}66`, backgroundColor: `${color}12` }}>
          <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{a.subject}
        </span>
        <Tag>{a.type}</Tag>
        {journal.badges.openAccess && <Tag tone="azure" icon={<OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />}>Open access</Tag>}
        <span className="ml-auto text-xs tabular-nums text-steel-600">{formatDate(a.publishedAt)} · pp. {a.pages}</span>
      </div>
      <h3 className="mt-2.5 font-serif4 text-lg font-semibold leading-snug text-abyss-900 sm:text-[1.1875rem]">
        <AppLink to={paths.article(a.paperId)} className="hover:text-cobalt-700">{a.title}</AppLink>
      </h3>
      <AuthorChipsJ4 names={a.authors} className="mt-2" />
      <details className="group mt-2">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-semibold text-cobalt-700 hover:underline">Abstract</summary>
        <p className="mt-1.5 text-sm leading-relaxed text-steel-700">{a.abstract}</p>
      </details>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-abyss-100 pt-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <p className="text-xs tabular-nums text-steel-600">DOI {doiFor(a.paperId)}</p>
          <Metric icon={Eye} n={a.views} word="views" />
          <Metric icon={Download} n={a.downloads} word="downloads" />
          <Metric icon={Quote} n={a.citations} word={a.citations === 1 ? 'citation' : 'citations'} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`} className={act}><Download className="h-3.5 w-3.5" aria-hidden="true" />PDF</button>
          <CiteMenu article={a} className={act}><Quote className="h-3.5 w-3.5" aria-hidden="true" />Cite</CiteMenu>
        </div>
      </div>
    </article>
  )
}

export function ArticleTabs({ data }: { data: HomeData }) {
  const [tab, setTab] = useState<TabId>('latest')
  const base = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const lists = useMemo<Record<TabId, ArticleSummary[]>>(() => ({ latest: data.latest, read: data.mostRead, choice: data.editorsChoice }), [data])
  const list = lists[tab].slice(0, SHOWN)

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i + TABS.length - 1) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1
    if (n < 0) return
    e.preventDefault(); setTab(TABS[n].id); refs.current[TABS[n].id]?.focus()
  }

  return (
    <section aria-labelledby={`${base}-h`} className="overflow-hidden rounded-pane border border-abyss-200 bg-white shadow-hair">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-abyss-200 bg-abyss-50 px-3 py-2.5 sm:px-4">
        <h2 id={`${base}-h`} className="sr-only">Browse articles</h2>
        <div role="tablist" aria-label="Article lists" className="flex flex-wrap items-center gap-1.5">
          {TABS.map((t, i) => (
            <button key={t.id} ref={(el) => { refs.current[t.id] = el }} type="button" role="tab" id={`${base}-${t.id}`} aria-selected={tab === t.id} aria-controls={`${base}-panel`} tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}
              className={cx('rounded-ctl px-3.5 py-2 text-sm font-semibold transition-colors', tab === t.id ? 'bg-abyss-900 text-white' : 'text-abyss-800 hover:bg-abyss-200/60')}>{t.label}</button>
          ))}
        </div>
        <AppLink to={paths.search('')} className="inline-flex items-center gap-1 text-sm font-semibold text-cobalt-700 hover:underline">View all articles <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-${tab}`} className="divide-y divide-abyss-200">
        {list.map((a) => <Row key={`${tab}-${a.paperId}`} a={a} />)}
      </div>
    </section>
  )
}
