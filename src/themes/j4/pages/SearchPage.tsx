// Search results: dark header with the search field, a facet column (area, type, issue) with counts, sorting and highlighted result rows.
import { useEffect, useId, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { ARTICLE_TYPES } from '../../../core/types'
import { ArticleRow } from '../components/ArticleRow'
import { areas } from '../components/areas'
import { Button } from '../components/Button'
import { FIELD, PageBand } from '../components/PageBand'
import { Container, EmptyState } from '../components/primitives'
import { Facets, type FacetGroup } from './search/Facets'
import { SearchBox } from './search/SearchBox'

type Sort = 'relevance' | 'newest' | 'views' | 'downloads'
const SORTS: { value: Sort; label: string }[] = [{ value: 'relevance', label: 'Relevance' }, { value: 'newest', label: 'Newest first' }, { value: 'views', label: 'Most viewed' }, { value: 'downloads', label: 'Most downloaded' }]
const STEP = 10
const issueKey = (a: ArticleSummary) => `Volume ${a.volume}, Issue ${a.issue}`
const areaMatch = (q: string) => areas.find((a) => a.name.toLowerCase() === q.trim().toLowerCase())?.name
type Sel = { area: string[]; type: string[]; issue: string[] }
const initial = (q: string): Sel => { const a = areaMatch(q); return { area: a ? [a] : [], type: [], issue: [] } }

function tally(list: ArticleSummary[], key: (a: ArticleSummary) => string) {
  const m = new Map<string, number>()
  list.forEach((a) => m.set(key(a), (m.get(key(a)) ?? 0) + 1))
  return m
}

export function SearchPage({ query, results }: { query: string; results: ArticleSummary[] }) {
  const term = query.trim()
  const [sel, setSel] = useState<Sel>(() => initial(query))
  const [sort, setSort] = useState<Sort>('relevance')
  const [shown, setShown] = useState(STEP)
  const sortId = useId()
  useEffect(() => { setSel(initial(query)); setShown(STEP) }, [query])
  useEffect(() => { setShown(STEP) }, [sel, sort])

  const isArea = !!areaMatch(query)
  const terms = useMemo(() => (isArea ? [] : term.split(/\s+/).filter(Boolean)), [term, isArea])

  const groups = useMemo<FacetGroup[]>(() => {
    const a = tally(results, (r) => r.subject), t = tally(results, (r) => r.type), i = tally(results, issueKey)
    return [
      { key: 'area', legend: 'Research area', selected: sel.area, options: areas.filter((x) => a.has(x.name)).map((x) => ({ value: x.name, label: x.name, n: a.get(x.name)! })) },
      { key: 'type', legend: 'Article type', selected: sel.type, options: ARTICLE_TYPES.filter((x) => t.has(x)).map((x) => ({ value: x, label: x, n: t.get(x)! })) },
      { key: 'issue', legend: 'Issue', selected: sel.issue, options: [...i].sort((x, y) => y[0].localeCompare(x[0], undefined, { numeric: true })).map(([v, n]) => ({ value: v, label: v, n })) },
    ]
  }, [results, sel])

  const filtered = useMemo(() => {
    const list = results.filter((a) => (!sel.area.length || sel.area.includes(a.subject)) && (!sel.type.length || sel.type.includes(a.type)) && (!sel.issue.length || sel.issue.includes(issueKey(a))))
    if (sort === 'newest') return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    if (sort === 'views') return [...list].sort((a, b) => b.views - a.views)
    if (sort === 'downloads') return [...list].sort((a, b) => b.downloads - a.downloads)
    return list
  }, [results, sel, sort])

  const active = sel.area.length + sel.type.length + sel.issue.length
  const toggle = (key: string, v: string) => setSel((s) => { const k = key as keyof Sel; return { ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] } })
  const clear = () => setSel({ area: [], type: [], issue: [] })

  return (
    <>
      <Helmet><title>{`${term ? `Search: ${term}` : 'Search'} | ${journal.shortName}`}</title><meta name="robots" content="noindex" /></Helmet>
      <PageBand label="Search the archive" title={term ? (isArea ? term : 'Search results') : 'Find an article'}>
        <SearchBox query={query} />
      </PageBand>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
          {results.length > 0 && <Facets groups={groups} onToggle={toggle} onClear={clear} active={active} />}
          <div className={results.length > 0 ? 'min-w-0' : 'min-w-0 lg:col-span-2'}>
            {results.length === 0 ? (
              <>
                <p role="status" aria-live="polite" className="sr-only">0 results</p>
                <EmptyState title={term ? `No articles found for “${term}”` : 'Start with a word or a research area'} text="Check the spelling, try fewer words, or browse one of the research areas below." />
                <h2 className="mt-10 font-serif4 text-2xl font-semibold text-abyss-900">Browse by research area</h2>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {areas.map((a) => (
                    <li key={a.id}><AppLink to={paths.search(a.name)} className="flex min-h-11 items-center gap-2 rounded-ctl border border-abyss-300 bg-white px-3 text-sm font-semibold text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                      <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />{a.name}</AppLink></li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-end justify-between gap-4 border-b border-abyss-300 pb-4">
                  <p role="status" aria-live="polite" className="text-base text-steel-700">
                    <strong className="font-serif4 text-2xl font-semibold tabular-nums text-abyss-900">{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'}{term && <> for <strong className="text-abyss-900">“{term}”</strong></>}
                  </p>
                  <div className="flex items-center gap-2">
                    <label htmlFor={sortId} className="text-sm font-semibold text-abyss-900">Sort by</label>
                    <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={FIELD}>{SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
                  </div>
                </div>
                {filtered.length === 0 ? (
                  <EmptyState title="No results match these filters" text="Remove a filter to see more articles." action={<Button variant="primary" onClick={clear}>Clear all filters</Button>} />
                ) : (
                  <>
                    <ol aria-label="Search results">{filtered.slice(0, shown).map((a) => <ArticleRow key={a.paperId} article={a} terms={terms} abstract />)}</ol>
                    {filtered.length > shown && <div className="mt-6 text-center"><Button variant="outline" className="h-11" onClick={() => setShown((n) => n + STEP)}>Show {Math.min(STEP, filtered.length - shown)} more of {filtered.length - shown} remaining</Button></div>}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
