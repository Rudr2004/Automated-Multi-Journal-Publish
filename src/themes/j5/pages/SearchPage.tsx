// Search results: bordeaux header with the search field, a facet column (area, type, issue) with counts, sorting and highlighted result rows.
import { useEffect, useId, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { ARTICLE_TYPES } from '../../../core/types'
import { areas } from '../components/areas'
import { Button } from '../components/Button'
import { FIELD, PageBand, PARCHMENT } from '../components/PageBand'
import { Container, EmptyState } from '../components/primitives'
import { ElementTile, OrnamentRule } from '../components/signature'
import { Facets, type FacetGroup } from './search/Facets'
import { Close } from '../icons'
import { ResultRow } from './search/ResultRow'
import { SearchBox } from './search/SearchBox'

type Sort = 'relevance' | 'newest' | 'views' | 'downloads'
const SORTS: { value: Sort; label: string }[] = [{ value: 'relevance', label: 'Relevance' }, { value: 'newest', label: 'Newest first' }, { value: 'views', label: 'Most viewed' }, { value: 'downloads', label: 'Most downloaded' }]
const STEP = 10
const issueKey = (a: ArticleSummary) => `Volume ${a.volume}, Issue ${a.issue}`
const areaMatch = (q: string) => areas.find((a) => a.name.toLowerCase() === q.trim().toLowerCase())?.name
type Sel = { area: string[]; type: string[]; year: string[]; issue: string[] }
const yearKey = (a: ArticleSummary) => a.publishedAt.slice(0, 4)
const LABEL: Record<keyof Sel, string> = { area: 'Area', type: 'Type', year: 'Year', issue: 'Issue' }
const initial = (q: string): Sel => { const a = areaMatch(q); return { area: a ? [a] : [], type: [], year: [], issue: [] } }

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
    const y = tally(results, yearKey), a = tally(results, (r) => r.subject), t = tally(results, (r) => r.type), i = tally(results, issueKey)
    return [
      { key: 'area', legend: 'Research area', selected: sel.area, options: areas.filter((x) => a.has(x.name)).map((x) => ({ value: x.name, label: x.name, n: a.get(x.name)! })) },
      { key: 'type', legend: 'Article type', selected: sel.type, options: ARTICLE_TYPES.filter((x) => t.has(x)).map((x) => ({ value: x, label: x, n: t.get(x)! })) },
      { key: 'year', legend: 'Year', selected: sel.year, options: [...y].sort((p, q) => q[0].localeCompare(p[0])).map(([v, n]) => ({ value: v, label: v, n })) },
      { key: 'issue', legend: 'Issue', selected: sel.issue, options: [...i].sort((x, y) => y[0].localeCompare(x[0], undefined, { numeric: true })).map(([v, n]) => ({ value: v, label: v, n })) },
    ]
  }, [results, sel])

  const filtered = useMemo(() => {
    const list = results.filter((a) => (!sel.area.length || sel.area.includes(a.subject)) && (!sel.type.length || sel.type.includes(a.type)) && (!sel.year.length || sel.year.includes(yearKey(a))) && (!sel.issue.length || sel.issue.includes(issueKey(a))))
    if (sort === 'newest') return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    if (sort === 'views') return [...list].sort((a, b) => b.views - a.views)
    if (sort === 'downloads') return [...list].sort((a, b) => b.downloads - a.downloads)
    return list
  }, [results, sel, sort])

  const active = sel.area.length + sel.type.length + sel.year.length + sel.issue.length
  const toggle = (key: string, v: string) => setSel((s) => { const k = key as keyof Sel; return { ...s, [k]: s[k].includes(v) ? s[k].filter((x) => x !== v) : [...s[k], v] } })
  const clear = () => setSel({ area: [], type: [], year: [], issue: [] })

  return (
    <>
      <Helmet><title>{`${term ? `Search: ${term}` : 'Search'} | ${journal.shortName}`}</title><meta name="robots" content="noindex" /></Helmet>
      <PageBand label="Search the archive" title={term ? (isArea ? term : 'Search results') : 'Find an article'}>
        <SearchBox query={query} />
        <p className="mt-4 max-w-3xl font-serif4 text-base leading-relaxed text-bordeaux-100">Paste a DOI or a Paper ID such as <span className="font-semibold tabular-nums text-white">{journal.paperIdPrefix}2026000112</span> to jump straight to the article or track it. Words are matched in titles, authors and abstracts.</p>
      </PageBand>

      <div className={PARCHMENT}><Container className="py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-8">
          {results.length > 0 && <Facets groups={groups} onToggle={toggle} onClear={clear} active={active} />}
          <div className={results.length > 0 ? 'min-w-0' : 'min-w-0 lg:col-span-2'}>
            {results.length === 0 ? (
              <>
                <p role="status" aria-live="polite" className="sr-only">0 results</p>
                <EmptyState title={term ? `No articles found for “${term}”` : 'Start with a word or a research area'} text="Check the spelling, try fewer words, or browse one of the research areas below." />
                <h2 className="mt-10 font-newsreader text-2xl font-semibold text-obsidian-900">Browse by research area</h2>
                <OrnamentRule className="mt-3 max-w-xs" />
                <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {areas.map((a, i) => (
                    <li key={a.id}><AppLink to={paths.search(a.name)} className="group block h-full rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">
                      <ElementTile number={i + 1} name={a.name} color={a.color} className="transition-[border-color,transform] duration-150 group-hover:border-wine-800 motion-safe:group-hover:-translate-y-px motion-reduce:transition-none" /></AppLink></li>
                  ))}
                </ul>
              </>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 rounded border border-wine-800/20 border-t-2 border-t-wine-800 bg-white px-4 py-3 shadow-none">
                  <p role="status" aria-live="polite" className="text-base text-obsidian-700">
                    <strong className="font-newsreader text-2xl font-semibold tabular-nums text-obsidian-900">{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'}{term && <> for <strong className="text-obsidian-900">“{term}”</strong></>}
                  </p>
                  <div className="flex items-center gap-2">
                    <label htmlFor={sortId} className="text-sm font-semibold text-obsidian-900">Sort by</label>
                    <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={FIELD}>{SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
                  </div>
                </div>
                {active > 0 && (
                  <ul aria-label="Active filters" className="mb-4 flex flex-wrap items-center gap-2">
                    {(Object.keys(sel) as (keyof Sel)[]).flatMap((k) => sel[k].map((v) => (
                      <li key={k + v}><button type="button" onClick={() => toggle(k, v)} className="inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-ochre-400 bg-ochre-50 px-2.5 text-xs font-semibold text-obsidian-900 transition-colors hover:border-wine-700 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">{LABEL[k]}: {v}<Close className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> (remove filter)</span></button></li>
                    )))}
                    <li><button type="button" onClick={clear} className="text-xs font-semibold text-wine-700 underline">Clear all</button></li>
                  </ul>
                )}
                {filtered.length === 0 ? (
                  <EmptyState title="No results match these filters" text="Remove a filter to see more articles." action={<Button variant="primary" onClick={clear}>Clear all filters</Button>} />
                ) : (
                  <>
                    <ol aria-label="Search results" className="space-y-4">{filtered.slice(0, shown).map((a) => <ResultRow key={a.paperId} article={a} terms={terms} />)}</ol>
                    {filtered.length > shown && <div className="mt-6 text-center"><Button variant="outline" className="h-11" onClick={() => setShown((n) => n + STEP)}>Show {Math.min(STEP, filtered.length - shown)} more of {filtered.length - shown} remaining</Button></div>}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Container></div>
    </>
  )
}
