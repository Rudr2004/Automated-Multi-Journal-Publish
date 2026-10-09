// Current issue and past issue: emerald issue header, disciplinary breakdown, type tabs and filter bar, then the colour-coded article list.
import { useId, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueData } from '../../../core/types'
import { ARTICLE_TYPES } from '../../../core/types'
import { Button, buttonClass } from '../components/Button'
import { countBy, toggleIn } from '../components/FilterControls'
import { IssueArticleRow } from '../components/IssueArticleRow'
import { Container, cx, EmptyState } from '../components/primitives'
import { WithAwardsRail } from '../components/WithAwardsRail'
import { disciplineColor, DisciplineIcon, disciplines } from '../components/discipline'
import { typeTone } from '../components/paperType'
import { ArrowRight, Calendar, ChevronRight, Close, GridView, ListView, Search } from '../icons'

type Sort = 'default' | 'newest' | 'views' | 'title'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'default', label: 'Issue order' }, { value: 'newest', label: 'Newest first' },
  { value: 'views', label: 'Most viewed' }, { value: 'title', label: 'Title A to Z' },
]
type Layout = 'card' | 'list'
const KEY = 'jimrt-layout'
const loadLayout = (): Layout => { try { return localStorage.getItem(KEY) === 'card' ? 'card' : 'list' } catch { return 'list' } }

const field = 'rounded-soft border border-graphite-300 bg-white py-2 pl-3 pr-8 text-sm text-graphite-800 focus:border-accent-700'

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const [q, setQ] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [type, setType] = useState<string>('')
  const [sort, setSort] = useState<Sort>('default')
  const [layout, setLayout] = useState<Layout>(loadLayout)
  const ids = { q: useId(), sort: useId() }
  const changeLayout = (l: Layout) => { setLayout(l); try { localStorage.setItem(KEY, l) } catch { /* private mode */ } }

  const subjectCounts = useMemo(() => countBy(articles, (a) => a.subject), [articles])
  const subjectList = useMemo(() => {
    const known = disciplines.filter((d) => subjectCounts.has(d.name)).map((d) => ({ name: d.name, discipline: d }))
    const extra = [...subjectCounts.keys()].filter((s) => !disciplines.some((d) => d.name === s)).map((s) => ({ name: s, discipline: undefined }))
    return [...known, ...extra]
  }, [subjectCounts])
  const typeCounts = useMemo(() => countBy(articles, (a) => a.type), [articles])
  const typeOptions = ARTICLE_TYPES.filter((t) => typeCounts.has(t))

  const shown = useMemo<ArticleSummary[]>(() => {
    const term = q.trim().toLowerCase()
    const list = articles.filter((a) =>
      (!subjects.length || subjects.includes(a.subject)) && (!type || a.type === type) &&
      (!term || `${a.title} ${a.authors.join(' ')} ${a.abstract}`.toLowerCase().includes(term)))
    const sorted = [...list]
    if (sort === 'newest') sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    else if (sort === 'views') sorted.sort((a, b) => b.views - a.views)
    else if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title))
    return sorted
  }, [articles, q, subjects, type, sort])

  // Group by paper type in the configured order (Editorials lead the issue, as before); order inside a group follows the chosen sort.
  const groups = useMemo(() => {
    const order = ['Editorial', ...ARTICLE_TYPES.filter((t) => t !== 'Editorial')] as string[]
    const extra = [...new Set(shown.map((a) => a.type as string))].filter((t) => !order.includes(t))
    return [...order, ...extra].map((t) => ({ type: t, items: shown.filter((a) => a.type === t) })).filter((g) => g.items.length)
  }, [shown])

  const active = subjects.length + (type ? 1 : 0) + (q.trim() ? 1 : 0)
  const clear = () => { setQ(''); setSubjects([]); setType('') }
  let n = 0

  const tab = (value: string, label: string, count: number, color?: string) => {
    const on = type === value
    return (
      <button key={value || 'all'} type="button" aria-pressed={on} onClick={() => setType(value)}
        className={cx('inline-flex items-center gap-1.5 rounded-soft px-3.5 py-2 text-sm font-semibold', on ? 'bg-brand-800 text-white' : 'text-graphite-800 hover:bg-brand-50')}>
        {color && <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: on ? '#fff' : color }} />}{label} ({count})
      </button>
    )
  }

  return (
    <div className="bg-brand-50/60">
      <Helmet><title>{`Volume ${issue.volume}, Issue ${issue.issue} | ${journal.shortName}`}</title></Helmet>
      <Container className="pb-12 pt-5 sm:pb-16">
<WithAwardsRail>
        <nav aria-label="Breadcrumb" className="text-sm text-graphite-700">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><AppLink to={paths.home} className="hover:text-accent-700 hover:underline">Home</AppLink></li><li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li><AppLink to={paths.pastIssues} className="hover:text-accent-700 hover:underline">Issues</AppLink></li><li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li aria-current="page" className="font-semibold text-graphite-900">Volume {issue.volume}, Issue {issue.issue}</li>
          </ol>
        </nav>

        {/* Issue header */}
        <section aria-labelledby="issue-h" className="relative isolate mt-4 overflow-hidden rounded-sheet bg-brand-800 p-6 text-white shadow-soft sm:p-10">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_18rem_at_100%_0%,rgba(15,118,110,0.55),transparent)]" />
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
            <div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                  {issue.isCurrent ? 'Current issue' : 'Past issue'} · Volume {issue.volume} · Issue {issue.issue} · {formatMonthYear(issue.month)}
                </span>
                <span className="font-mono text-brand-50">ISSN {journal.issnOnline}</span>
              </div>
              <h1 id="issue-h" className="mt-5 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">Volume {issue.volume}, Issue {issue.issue}</h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-brand-50 sm:text-lg">
                {journal.name}: {issue.articleCount} article{issue.articleCount === 1 ? '' : 's'}{journal.badges.peerReviewed ? ', peer reviewed' : ''}{journal.badges.openAccess ? ' and open access' : ''}, across {subjectList.length} discipline{subjectList.length === 1 ? '' : 's'}.
              </p>
              <dl className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-50">
                <div className="flex items-center gap-1.5"><dt className="sr-only">Month</dt><Calendar className="h-4 w-4" aria-hidden="true" /><dd>{formatMonthYear(issue.month)}</dd></div>
                <div><dt className="inline">Total: </dt><dd className="inline font-bold text-white">{issue.articleCount} Article{issue.articleCount === 1 ? '' : 's'}</dd></div>
                <div className="min-w-0"><dt className="inline">Issue DOI: </dt><dd className="inline break-all font-mono text-white">{issue.doi}</dd></div>
              </dl>
              <div className="mt-6 flex flex-wrap gap-3">
                <AppLink to={paths.pastIssues} className={cx(buttonClass('onDark'), '!border-white !bg-white !text-brand-900 hover:!bg-brand-50')}>Browse past issues <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
                <AppLink to={paths.submit} className={buttonClass('onDark')}>Submit a manuscript</AppLink>
              </div>
            </div>
            <figure className="mx-auto w-full max-w-[15rem] rounded-panel bg-white p-3 text-center text-graphite-800 shadow-pop lg:mx-0 lg:justify-self-end">
              <div className="flex aspect-[3/4] flex-col items-center justify-between rounded-soft bg-brand-50 p-4">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-800">{journal.shortName} · Vol. {issue.volume} No. {issue.issue}</p>
                <img src="/journals/j2/logo.png" alt="" className="h-28 w-28 object-contain" />
                <div className="flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-graphite-700">
                  <span>{formatMonthYear(issue.month)}</span>{journal.badges.openAccess && <span>Open Access</span>}
                </div>
              </div>
              <figcaption className="mt-2 text-sm font-semibold">Official Journal Cover</figcaption>
            </figure>
          </div>
        </section>

        {/* Disciplinary breakdown */}
        <section aria-labelledby="breakdown-h" className="mt-6 rounded-panel border border-graphite-200 bg-white p-5 shadow-card">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="breakdown-h" className="font-display text-lg font-bold text-brand-900">Issue Disciplinary Breakdown <span className="ml-1 text-sm font-normal text-graphite-700">(Volume {issue.volume} · Issue {issue.issue})</span></h2>
            <span className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 font-mono text-xs font-semibold text-brand-800">Total: {articles.length} Articles</span>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {subjectList.map(({ name, discipline }) => {
              const on = subjects.includes(name)
              const c = subjectCounts.get(name) ?? 0
              return (
                <li key={name}>
                  <button type="button" aria-pressed={on} onClick={() => setSubjects((l) => toggleIn(l, name))}
                    className={cx('flex h-full w-full flex-col items-center rounded-soft border px-2 py-3 text-center transition-colors', on ? 'border-brand-800 bg-brand-50 ring-1 ring-brand-800' : 'border-graphite-200 bg-graphite-50 hover:border-accent-700')}>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-graphite-800">
                      {discipline ? <DisciplineIcon discipline={discipline} size="sm" /> : <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: disciplineColor(name) }} />}
                      <span>{name}</span>
                    </span>
                    <span className="mt-1.5 font-display text-2xl font-bold tabular-nums text-brand-900">{c}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-graphite-700">Paper{c === 1 ? '' : 's'}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Type tabs + filters */}
        <section aria-label="Filter articles" className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-3 rounded-panel border border-graphite-200 bg-white p-3 shadow-card">
          <div className="flex flex-wrap items-center gap-1">
            {tab('', `All Articles`, articles.length)}
            {typeOptions.map((t) => tab(t, t, typeCounts.get(t)!, typeTone(t).bar))}
          </div>
          <div className="relative ml-auto min-w-[14rem] flex-1 sm:max-w-xs">
            <label htmlFor={ids.q} className="sr-only">Search within this issue</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-600" aria-hidden="true" />
            <input id={ids.q} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, author or keyword" className={cx(field, 'w-full pl-9 pr-3')} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label htmlFor={ids.sort} className="text-sm font-medium text-graphite-700">Sort</label>
            <select id={ids.sort} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={field}>
              {SORTS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div role="group" aria-label="Layout" className="flex overflow-hidden rounded-soft border border-graphite-300">
            {([['list', 'List view', ListView], ['card', 'Grid view', GridView]] as const).map(([v, label, Icon]) => (
              <button key={v} type="button" aria-pressed={layout === v} aria-label={label} onClick={() => changeLayout(v)}
                className={cx('p-2', layout === v ? 'bg-brand-800 text-white' : 'bg-white text-graphite-700 hover:bg-brand-50')}><Icon className="h-5 w-5" aria-hidden="true" /></button>
            ))}
          </div>
        </section>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <p role="status" className="text-sm text-graphite-800">Showing <strong className="font-semibold">{shown.length}</strong> of {articles.length} articles</p>
          {active > 0 && <button type="button" onClick={clear} className="text-sm font-semibold text-accent-700 hover:underline">Clear all filters</button>}
        </div>

        {shown.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No articles match these filters" text="Try a different keyword or remove a filter to see more of this issue."
              action={<Button variant="outline" onClick={clear}><Close className="h-4 w-4" aria-hidden="true" /> Clear filters</Button>} />
          </div>
        ) : groups.map((g) => {
          const tone = typeTone(g.type)
          return (
            <section key={g.type} aria-labelledby={`g-${g.type.replace(/\W+/g, '-')}`} className="mt-8">
              <h2 id={`g-${g.type.replace(/\W+/g, '-')}`} className="flex items-center gap-2 border-b-2 pb-2 font-display text-lg font-bold uppercase tracking-wide" style={{ color: tone.fg, borderColor: tone.bar }}>
                {g.type}s <span className="text-sm font-semibold tabular-nums text-graphite-700">({g.items.length})</span>
              </h2>
              <ul className={cx('mt-4 grid gap-4', layout === 'card' ? 'md:grid-cols-2' : 'grid-cols-1')}>
                {g.items.map((a) => <li key={a.paperId} className="min-w-0"><IssueArticleRow article={a} index={++n} compact={layout === 'card'} /></li>)}
              </ul>
            </section>
          )
        })}
      </WithAwardsRail>
</Container>
    </div>
  )
}
