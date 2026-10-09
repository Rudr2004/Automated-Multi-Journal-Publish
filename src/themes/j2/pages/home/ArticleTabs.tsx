// Tabbed article lists: Latest, Most Read and Most Cited. The first article of the active tab is shown as a feature card;
// every article shows its authors with portraits. "Most Cited" ranks the articles on the home page by citation count.
import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatNumber } from '../../../../core/lib/format'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, HomeData } from '../../../../core/types'
import { portraitFor } from '../../../../mock-data/shared/portraits'
import { Button } from '../../components/Button'
import { CiteFlyout } from '../../components/CiteFlyout'
import { disciplineColor } from '../../components/discipline'
import { cx, Tag } from '../../components/primitives'
import { ArrowRight, Download, OpenAccess, Quote } from '../../icons'
import { Eye } from '../../components/homeIcons'

type TabId = 'latest' | 'read' | 'cited'
const TABS: { id: TabId; label: string }[] = [
  { id: 'latest', label: 'Latest Articles' },
  { id: 'read', label: 'Most Read Articles' },
  { id: 'cited', label: 'Most Cited Articles' },
]
const SHOWN = 5

const initials = (name: string) => name.replace(/^(Prof|Dr)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('')

function AuthorChip({ name }: { name: string }) {
  const photo = portraitFor(name)
  return (
    <span className="inline-flex items-center gap-1.5">
      {photo
        ? <img src={photo} alt="" width={24} height={24} loading="lazy" className="h-6 w-6 rounded-full object-cover ring-1 ring-graphite-200" />
        : <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-800">{initials(name)}</span>}
      <span className="text-graphite-700">{name}</span>
    </span>
  )
}

function Authors({ names }: { names: string[] }) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
      {names.slice(0, 3).map((n) => <AuthorChip key={n} name={n} />)}
      {names.length > 3 && <span className="text-xs font-medium text-graphite-600">+{names.length - 3} more</span>}
    </p>
  )
}

function Metric({ tab, a }: { tab: TabId; a: ArticleSummary }) {
  if (tab === 'latest') return null
  const Icon = tab === 'read' ? Eye : Quote
  const count = tab === 'read' ? a.views : a.citations
  const word = tab === 'read' ? 'views' : `citation${a.citations === 1 ? '' : 's'}`
  return (
    <span className="inline-flex items-center gap-1 rounded-chip bg-brand-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-800 ring-1 ring-inset ring-brand-200" title={word}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />{formatNumber(count)}<span className="sr-only"> {word}</span>
    </span>
  )
}

function ArticleItem({ a, tab, featured }: { a: ArticleSummary; tab: TabId; featured?: boolean }) {
  const color = disciplineColor(a.subject)
  const body = (
    <div className="space-y-2.5 p-4 sm:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-chip px-2 py-0.5 text-xs font-semibold" style={{ color, backgroundColor: `${color}14`, boxShadow: `inset 0 0 0 1px ${color}55` }}>{a.subject}</span>
        <Tag tone="neutral">{a.type}</Tag>
        {journal.badges.openAccess && <Tag tone="brand" icon={<OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />}>Open Access</Tag>}
        <Metric tab={tab} a={a} />
        <span className="ml-auto text-xs text-graphite-600">{formatDate(a.publishedAt)}</span>
      </div>
      <h3 className={cx('font-display font-bold leading-snug text-graphite-900', featured ? 'text-xl sm:text-2xl' : 'text-lg')}>
        <AppLink to={paths.article(a.paperId)} className="hover:text-accent-700">{a.title}</AppLink>
      </h3>
      <Authors names={a.authors} />
      <p className={cx('text-sm text-graphite-700', featured ? 'line-clamp-3' : 'line-clamp-2')}>{a.abstract}</p>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-graphite-100 pt-3">
        <p className="font-mono text-xs text-graphite-600">DOI: {doiFor(a.paperId)}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="primary" className="px-3.5 py-2 text-xs" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`}><Download className="h-4 w-4" aria-hidden="true" /> Download PDF</Button>
          <CiteFlyout article={a} />
        </div>
      </div>
    </div>
  )
  if (!featured) return <article className="rounded-panel border border-graphite-200 bg-white shadow-card transition-shadow hover:shadow-soft">{body}</article>
  return (
    <article className="overflow-hidden rounded-sheet border-2 border-brand-300 bg-white shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-brand-800 px-4 py-2.5 text-white sm:px-5">
        <div>
          <p className="font-display text-[10px] font-bold uppercase tracking-wider text-brand-200">Emerald Scholar</p>
          <p className="font-display text-sm font-bold">{journal.shortName}</p>
        </div>
        <span className="rounded bg-white/15 px-2 py-1 font-mono text-[11px] text-white">Vol. {a.volume}, Iss. {a.issue}</span>
      </div>
      {body}
    </article>
  )
}

export function ArticleTabs({ data }: { data: HomeData }) {
  const [tab, setTab] = useState<TabId>('latest')
  const base = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const lists = useMemo<Record<TabId, ArticleSummary[]>>(() => {
    const all = new Map<string, ArticleSummary>()
    ;[...data.latest, ...data.mostRead, ...data.editorsChoice].forEach((a) => all.set(a.paperId, a))
    const cited = [...all.values()].sort((a, b) => b.citations - a.citations || b.views - a.views)
    return { latest: data.latest, read: data.mostRead, cited }
  }, [data])
  const list = lists[tab].slice(0, SHOWN)

  const onKey = (e: KeyboardEvent, i: number) => {
    const n = e.key === 'ArrowRight' ? (i + 1) % TABS.length : e.key === 'ArrowLeft' ? (i + TABS.length - 1) % TABS.length : e.key === 'Home' ? 0 : e.key === 'End' ? TABS.length - 1 : -1
    if (n < 0) return
    e.preventDefault(); setTab(TABS[n].id); refs.current[TABS[n].id]?.focus()
  }

  return (
    <section aria-label="Browse articles" className="space-y-4">
      <div className="flex flex-col items-start justify-between gap-3 rounded-panel border border-graphite-200 bg-white p-3 shadow-card sm:flex-row sm:items-center">
        <div role="tablist" aria-label="Article lists" className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          {TABS.map((t, i) => (
            <button key={t.id} ref={(el) => { refs.current[t.id] = el }} type="button" role="tab" id={`${base}-${t.id}`} aria-selected={tab === t.id} aria-controls={`${base}-panel`} tabIndex={tab === t.id ? 0 : -1}
              onClick={() => setTab(t.id)} onKeyDown={(e) => onKey(e, i)}
              className={cx('rounded-panel px-4 py-2 transition-colors', tab === t.id ? 'bg-brand-800 text-white shadow-card' : 'text-graphite-700 hover:bg-brand-50 hover:text-brand-800')}>{t.label}</button>
          ))}
        </div>
        <AppLink to={paths.search('')} className="inline-flex shrink-0 items-center gap-1 font-display text-xs font-bold text-accent-700 hover:underline">View all articles <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
      </div>
      <div role="tabpanel" id={`${base}-panel`} aria-labelledby={`${base}-${tab}`} className="space-y-4">
        {list.map((a, i) => <ArticleItem key={`${tab}-${a.paperId}`} a={a} tab={tab} featured={i === 0} />)}
      </div>
    </section>
  )
}
