// Search results: query box, filter rail (drawer on phones), sorting and 10-per-page pagination.
import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineFilterList } from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { ARTICLE_TYPES } from '../../../core/types'
import { ArticleCard } from '../components/ArticleCard'
import { Button } from '../components/Button'
import { CheckGroup, countBy, FilterDrawer, SortSelect, toggleIn } from '../components/FilterControls'
import { Container, cx, EmptyState } from '../components/primitives'
import { DisciplineIcon, disciplines } from '../components/discipline'
import { SearchBox } from '../components/SearchBox'
import { useSearchApi } from '../components/searchContext'
import { ArrowRight, Close } from '../icons'

type Sort = 'relevance' | 'newest' | 'views'
const SORTS: { value: Sort; label: string }[] = [{ value: 'relevance', label: 'Relevance' }, { value: 'newest', label: 'Newest first' }, { value: 'views', label: 'Most viewed' }]
const PER_PAGE = 10
const SUGGESTIONS = ['machine learning', 'renewable energy', 'public health', 'supply chain', 'climate adaptation']
const yearOf = (a: ArticleSummary) => a.publishedAt.slice(0, 4)
const matchingDiscipline = (q: string) => disciplines.find((d) => d.name.toLowerCase() === q.trim().toLowerCase())?.name

function pageList(page: number, pages: number): (number | '…')[] {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))
  const sorted = [...set].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  sorted.forEach((n, i) => { if (i && n - sorted[i - 1] > 1) out.push('…'); out.push(n) })
  return out
}

export function SearchPage({ query, results }: { query: string; results: ArticleSummary[] }) {
  const { onSearch, onSuggest } = useSearchApi()
  const term = query.trim()
  const [subjects, setSubjects] = useState<string[]>(() => { const d = matchingDiscipline(query); return d ? [d] : [] })
  const [types, setTypes] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [sort, setSort] = useState<Sort>('relevance')
  const [page, setPage] = useState(1)
  const [drawer, setDrawer] = useState(false)
  const top = useRef<HTMLDivElement>(null)

  useEffect(() => { const d = matchingDiscipline(query); setSubjects(d ? [d] : []); setTypes([]); setYears([]); setPage(1) }, [query])
  useEffect(() => { setPage(1) }, [subjects, types, years, sort])

  const subjectOptions = useMemo(() => {
    const c = countBy(results, (a) => a.subject)
    return [...c.keys()].map((s) => { const d = disciplines.find((x) => x.name === s); return { value: s, label: s, count: c.get(s)!, color: d?.color } })
  }, [results])
  const typeOptions = useMemo(() => { const c = countBy(results, (a) => a.type); return ARTICLE_TYPES.filter((t) => c.has(t)).map((t) => ({ value: t as string, label: t as string, count: c.get(t)! })) }, [results])
  const yearOptions = useMemo(() => { const c = countBy(results, yearOf); return [...c.keys()].sort((a, b) => b.localeCompare(a)).map((y) => ({ value: y, label: y, count: c.get(y)! })) }, [results])

  const filtered = useMemo(() => {
    const list = results.filter((a) => (!subjects.length || subjects.includes(a.subject)) && (!types.length || types.includes(a.type)) && (!years.length || years.includes(yearOf(a))))
    if (sort === 'newest') return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    if (sort === 'views') return [...list].sort((a, b) => b.views - a.views)
    return list
  }, [results, subjects, types, years, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const active = subjects.length + types.length + years.length
  const clear = () => { setSubjects([]); setTypes([]); setYears([]) }
  const go = (n: number) => { setPage(n); top.current?.scrollIntoView({ block: 'start' }) }

  const filters = (
    <>
      <CheckGroup legend="Discipline" options={subjectOptions} selected={subjects} onToggle={(v) => setSubjects((l) => toggleIn(l, v))} />
      <CheckGroup legend="Article type" options={typeOptions} selected={types} onToggle={(v) => setTypes((l) => toggleIn(l, v))} />
      <CheckGroup legend="Year" options={yearOptions} selected={years} onToggle={(v) => setYears((l) => toggleIn(l, v))} />
      {active > 0 && <button type="button" onClick={clear} className="text-sm font-semibold text-accent-700 hover:underline">Clear all filters</button>}
    </>
  )

  return (
    <>
      <Helmet><title>{`${term ? `Search: ${term}` : 'Search'} | ${journal.shortName}`}</title><meta name="robots" content="noindex" /></Helmet>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 text-white">
        <Container className="py-10 sm:py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{term ? 'Search results' : 'Browse all articles'}</h1>
          <SearchBox className="mt-5 max-w-2xl text-graphite-800" size="lg" onSearch={onSearch} onSuggest={onSuggest} />
          <p role="status" className="mt-4 text-sm text-brand-50">
            {term ? <>{results.length} result{results.length === 1 ? '' : 's'} for <strong className="text-white">“{term}”</strong></> : 'Search by title, author, keyword, DOI or Paper ID, or pick a discipline below.'}
          </p>
        </Container>
      </section>

      <Container className="py-8 sm:py-10">
        {!term ? (
          <section aria-labelledby="by-discipline">
            <h2 id="by-discipline" className="font-display text-2xl font-bold text-graphite-800">Explore by discipline</h2>
            <p className="mt-1 text-graphite-600">Enter a search above, or open a discipline to see its published articles.</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {disciplines.map((d) => (
                <li key={d.id}>
                  <AppLink to={paths.search(d.name)} className="group flex h-full items-center gap-3 rounded-panel border border-graphite-200 bg-white p-4 shadow-card hover:border-accent-200 hover:shadow-soft">
                    <DisciplineIcon discipline={d} />
                    <span className="min-w-0 flex-1 font-display text-base font-semibold leading-snug text-graphite-800">{d.name}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-accent-700 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </AppLink>
                </li>
              ))}
            </ul>
          </section>
        ) : results.length === 0 ? (
          <EmptyState title={`No articles found for “${term}”`} text="Check the spelling, use fewer or more general words, or try one of these searches."
            action={<ul className="flex flex-wrap justify-center gap-2">{SUGGESTIONS.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded-chip border border-accent-200 bg-accent-50 px-3 py-1 text-sm font-medium text-accent-800 hover:bg-accent-100">{s}</AppLink></li>)}</ul>} />
        ) : (
          <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside aria-label="Filters" className="hidden lg:block">
              <div className="sticky top-24 space-y-6 rounded-panel border border-graphite-200 bg-white p-5 shadow-card">{filters}</div>
            </aside>
            <div className="min-w-0" ref={top}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="outline" className="lg:hidden" onClick={() => setDrawer(true)} aria-haspopup="dialog">
                    <MdOutlineFilterList className="h-4 w-4" aria-hidden="true" /> Filters{active > 0 && ` (${active})`}
                  </Button>
                  <p className="text-sm text-graphite-700"><strong className="font-semibold text-graphite-800">{filtered.length}</strong> article{filtered.length === 1 ? '' : 's'}{filtered.length > PER_PAGE && `, page ${current} of ${pages}`}</p>
                </div>
                <SortSelect value={sort} onChange={setSort} options={SORTS} />
              </div>

              {filtered.length === 0 ? (
                <EmptyState title="No results with these filters" text="Remove a filter to see the other matches."
                  action={<Button variant="outline" onClick={clear}><Close className="h-4 w-4" aria-hidden="true" /> Clear filters</Button>} />
              ) : (
                <ul className="grid grid-cols-1 gap-4">
                  {slice.map((a) => <li key={a.paperId}><ArticleCard article={a} layout="list" /></li>)}
                </ul>
              )}

              {pages > 1 && (
                <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
                  <Button variant="outline" disabled={current === 1} onClick={() => go(current - 1)}>Previous</Button>
                  {pageList(current, pages).map((n, i) => n === '…'
                    ? <span key={`gap${i}`} aria-hidden="true" className="px-1 text-graphite-500">…</span>
                    : <button key={n} type="button" onClick={() => go(n)} aria-label={`Page ${n}`} aria-current={n === current ? 'page' : undefined}
                        className={cx('h-10 min-w-10 rounded-soft px-3 text-sm font-semibold', n === current ? 'bg-brand-800 text-white' : 'border border-graphite-300 bg-white text-graphite-700 hover:border-accent-700')}>{n}</button>)}
                  <Button variant="outline" disabled={current === pages} onClick={() => go(current + 1)}>Next</Button>
                </nav>
              )}
            </div>
          </div>
        )}
      </Container>

      <FilterDrawer open={drawer} onClose={() => setDrawer(false)} title="Filters"
        footer={<Button variant="primary" className="w-full" onClick={() => setDrawer(false)}>Show {filtered.length} article{filtered.length === 1 ? '' : 's'}</Button>}>
        {filters}
      </FilterDrawer>
    </>
  )
}
