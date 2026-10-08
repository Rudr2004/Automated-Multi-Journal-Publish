// Current issue and past issue: emerald banner, filter rail (drawer on phones) and a card / list results area.
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineFilterList } from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueData } from '../../../core/types'
import { ARTICLE_TYPES } from '../../../core/types'
import { ArticleCard, type CardLayout } from '../components/ArticleCard'
import { Button } from '../components/Button'
import { CheckGroup, countBy, FilterDrawer, SortSelect, toggleIn } from '../components/FilterControls'
import { Container, EmptyState } from '../components/primitives'
import { disciplineColor, disciplines } from '../components/discipline'
import { ArrowRight, Calendar, Close, Search } from '../icons'
import { LayoutToggle } from './home/FreshResearch'

type Sort = 'default' | 'newest' | 'views' | 'title'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'default', label: 'Issue order' }, { value: 'newest', label: 'Newest first' },
  { value: 'views', label: 'Most viewed' }, { value: 'title', label: 'Title A to Z' },
]
const KEY = 'jimrt-layout'
const loadLayout = (): CardLayout => { try { return localStorage.getItem(KEY) === 'list' ? 'list' : 'card' } catch { return 'card' } }

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const [q, setQ] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [sort, setSort] = useState<Sort>('default')
  const [layout, setLayout] = useState<CardLayout>(loadLayout)
  const [drawer, setDrawer] = useState(false)

  const subjectOptions = useMemo(() => {
    const c = countBy(articles, (a) => a.subject)
    const known = disciplines.filter((d) => c.has(d.name)).map((d) => ({ value: d.name, label: d.name, count: c.get(d.name)!, color: d.color }))
    const extra = [...c.keys()].filter((s) => !disciplines.some((d) => d.name === s)).map((s) => ({ value: s, label: s, count: c.get(s)!, color: disciplineColor(s) }))
    return [...known, ...extra]
  }, [articles])
  const typeOptions = useMemo(() => {
    const c = countBy(articles, (a) => a.type)
    return ARTICLE_TYPES.filter((t) => c.has(t)).map((t) => ({ value: t as string, label: t as string, count: c.get(t)! }))
  }, [articles])

  const shown = useMemo<ArticleSummary[]>(() => {
    const term = q.trim().toLowerCase()
    const list = articles.filter((a) =>
      (!subjects.length || subjects.includes(a.subject)) && (!types.length || types.includes(a.type)) &&
      (!term || `${a.title} ${a.authors.join(' ')} ${a.abstract}`.toLowerCase().includes(term)))
    const sorted = [...list]
    if (sort === 'newest') sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    else if (sort === 'views') sorted.sort((a, b) => b.views - a.views)
    else if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title))
    // Editorials lead the issue; the sort above is stable, so order inside each group is kept.
    return [...sorted.filter((a) => a.type === 'Editorial'), ...sorted.filter((a) => a.type !== 'Editorial')]
  }, [articles, q, subjects, types, sort])

  const active = subjects.length + types.length + (q.trim() ? 1 : 0)
  const clear = () => { setQ(''); setSubjects([]); setTypes([]) }

  const filters = (idp: string) => (
    <>
      <div>
        <label htmlFor={`${idp}-q`} className="mb-2 block font-display text-sm font-semibold text-graphite-800">Search within this issue</label>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-500" aria-hidden="true" />
          <input id={`${idp}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, author or keyword" className="w-full rounded-soft border border-graphite-300 bg-white py-2 pl-9 pr-3 text-sm text-graphite-800 placeholder:text-graphite-500 focus:border-accent-700" />
        </div>
      </div>
      <CheckGroup legend="Discipline" options={subjectOptions} selected={subjects} onToggle={(v) => setSubjects((l) => toggleIn(l, v))} />
      <fieldset>
        <legend className="mb-2 font-display text-sm font-semibold text-graphite-800">Article type</legend>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map((t) => {
            const on = types.includes(t.value)
            return (
              <button key={t.value} type="button" aria-pressed={on} onClick={() => setTypes((l) => toggleIn(l, t.value))}
                className={`rounded-chip border px-2.5 py-1 text-xs font-semibold ${on ? 'border-accent-700 bg-accent-700 text-white' : 'border-graphite-300 bg-white text-graphite-700 hover:border-accent-700'}`}>
                {t.label} <span className={on ? 'text-accent-100' : 'text-graphite-600'}>({t.count})</span>
              </button>
            )
          })}
        </div>
      </fieldset>
      <SortSelect value={sort} onChange={setSort} options={SORTS} />
      {active > 0 && <button type="button" onClick={clear} className="text-sm font-semibold text-accent-700 hover:underline">Clear all filters</button>}
    </>
  )

  return (
    <>
      <Helmet><title>{`Volume ${issue.volume}, Issue ${issue.issue} | ${journal.shortName}`}</title></Helmet>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 text-white">
        <Container className="py-10 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-brand-100">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li><AppLink to={paths.home} className="hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
              <li><AppLink to={paths.pastIssues} className="hover:underline">Issues</AppLink></li><li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">Volume {issue.volume}, Issue {issue.issue}</li>
            </ol>
          </nav>
          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">{issue.isCurrent ? 'Current issue' : 'Past issue'}</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Volume {issue.volume}, Issue {issue.issue}</h1>
          <dl className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-brand-50">
            <div className="flex items-center gap-1.5"><dt className="sr-only">Month</dt><Calendar className="h-4 w-4" aria-hidden="true" /><dd>{formatMonthYear(issue.month)}</dd></div>
            <div><dt className="sr-only">Articles</dt><dd>{issue.articleCount} article{issue.articleCount === 1 ? '' : 's'}</dd></div>
            <div className="min-w-0"><dt className="inline">Issue DOI: </dt><dd className="inline break-all font-medium text-white">{issue.doi}</dd></div>
          </dl>
          <AppLink to={paths.pastIssues} className="mt-6 inline-flex items-center gap-1.5 rounded-soft border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
            Browse past issues <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </AppLink>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside aria-label="Filters" className="hidden lg:block">
            <div className="sticky top-24 space-y-6 rounded-panel border border-graphite-200 bg-white p-5 shadow-card">{filters('rail')}</div>
          </aside>

          <div className="min-w-0">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" className="lg:hidden" onClick={() => setDrawer(true)} aria-haspopup="dialog">
                  <MdOutlineFilterList className="h-4 w-4" aria-hidden="true" /> Filters{active > 0 && ` (${active})`}
                </Button>
                <p role="status" className="text-sm text-graphite-700">Showing <strong className="font-semibold text-graphite-800">{shown.length}</strong> of {articles.length} articles</p>
              </div>
              <LayoutToggle value={layout} onChange={setLayout} />
            </div>

            {shown.length === 0 ? (
              <EmptyState title="No articles match these filters" text="Try a different keyword or remove a filter to see more of this issue."
                action={<Button variant="outline" onClick={clear}><Close className="h-4 w-4" aria-hidden="true" /> Clear filters</Button>} />
            ) : (
              <ul className={layout === 'card' ? 'grid gap-5 sm:grid-cols-2' : 'grid grid-cols-1 gap-4'}>
                {shown.map((a) => <li key={a.paperId} className="flex"><div className="w-full min-w-0"><ArticleCard article={a} layout={layout} /></div></li>)}
              </ul>
            )}
          </div>
        </div>
      </Container>

      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} title="Filters"
        footer={<Button variant="primary" className="w-full" onClick={() => setDrawer(false)}>Show {shown.length} article{shown.length === 1 ? '' : 's'}</Button>}>
        {filters('drawer')}
      </FilterDrawer>
    </>
  )
}
