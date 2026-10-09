import { useMemo, useState, type ChangeEvent } from 'react'
import { ARTICLE_TYPES, SUBJECTS, type ArticleSummary } from '../../../mock-data/journals/j1'
import { inputClass } from '../components/form'
import { PageHead, RailTitle } from '../components/PageHead'
import { Pagination } from '../components/Pagination'
import { Container } from '../components/primitives'
import { SearchBox } from '../components/SearchBox'
import { SearchResult } from '../components/SearchResult'
import { MdOutlineTune as SlidersHorizontal } from 'react-icons/md'
import { X } from '../components/uiIcons'
import { AppLink, useRouter } from '../../../core/router'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'

const PAGE_SIZE = 8
type Sort = 'relevance' | 'newest' | 'cited' | 'viewed'
const SORTS: { id: Sort; label: string }[] = [
  { id: 'relevance', label: 'Best match' }, { id: 'newest', label: 'Newest first' },
  { id: 'cited', label: 'Most cited' }, { id: 'viewed', label: 'Most viewed' },
]

function NoResults({ query, hasFilters, onClear }: { query: string; hasFilters: boolean; onClear: () => void }) {
  return (
    <div className="border border-line bg-paper p-6 sm:p-8">
      <p className="font-serif text-xl font-semibold text-navy">{query ? `No articles match “${query}”` : 'Start typing to search the archive'}</p>
      <p className="mt-1.5 text-sm text-ink-muted">
        {hasFilters ? 'The selected filters may be too narrow. ' : ''}Check the spelling, use fewer or broader words, or search by author surname, DOI or Paper ID.
      </p>
      {hasFilters && <button type="button" onClick={onClear} className="mt-3 text-sm font-semibold text-scholar hover:underline">Clear all filters</button>}
      <p className="mt-5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Browse by subject</p>
      <ul className="mt-2 flex flex-wrap gap-2">
        {journal.subjects.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded-sm border border-line bg-white px-2.5 py-1 text-xs font-semibold text-navy hover:border-scholar hover:text-scholar">{s}</AppLink></li>)}
      </ul>
    </div>
  )
}

/** One facet group: a radio list with per-option counts ("All" clears the facet). */
function Facet({ name, label, value, options, counts, total, onChange }: {
  name: string; label: string; value: string; options: readonly string[]; counts: Record<string, number>; total: number; onChange: (v: string) => void
}) {
  const row = (v: string, text: string, n: number) => (
    <li key={v || 'all'}>
      <label className={`flex cursor-pointer items-center gap-2.5 py-1 text-sm ${n === 0 && v ? 'text-ink-muted' : 'text-ink'}`}>
        <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} className="h-4 w-4 shrink-0 accent-navy" />
        <span className="flex-1">{text}</span>
        <span className="text-xs tabular-nums text-ink-muted">{n}</span>
      </label>
    </li>
  )
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-muted">{label}</legend>
      <ul>{row('', 'All', total)}{options.map((o) => row(o, o, counts[o] ?? 0))}</ul>
    </fieldset>
  )
}

export function SearchPage({ query, results }: { query: string; results: ArticleSummary[] }) {
  const { navigate } = useRouter()
  const [year, setYear] = useState('')
  const [type, setType] = useState('')
  const [subject, setSubject] = useState('')
  const [sort, setSort] = useState<Sort>('relevance')
  const [page, setPage] = useState(1)
  const [railOpen, setRailOpen] = useState(false)

  const years = useMemo(() => [...new Set(results.map((r) => r.publishedAt.slice(0, 4)))].sort().reverse(), [results])
  const match = (r: ArticleSummary, skip?: 'year' | 'type' | 'subject') =>
    (skip === 'year' || !year || r.publishedAt.startsWith(year)) && (skip === 'type' || !type || r.type === type) && (skip === 'subject' || !subject || r.subject === subject)
  const filtered = useMemo(() => {
    const list = results.filter((r) => match(r))
    if (sort === 'newest') list.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    if (sort === 'cited') list.sort((a, b) => b.citations - a.citations)
    if (sort === 'viewed') list.sort((a, b) => b.views - a.views)
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results, year, type, subject, sort])
  // Facet counts reflect the other active facets, so every number matches what picking that option would show.
  const count = (skip: 'year' | 'type' | 'subject', key: (r: ArticleSummary) => string) => {
    const out: Record<string, number> = {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
    results.filter((r) => match(r, skip)).forEach((r) => { out[key(r)] = (out[key(r)] ?? 0) + 1 })
    return out
  }
  const yearCounts = count('year', (r) => r.publishedAt.slice(0, 4))
  const typeCounts = count('type', (r) => r.type)
  const subjectCounts = count('subject', (r) => r.subject)
  const sumOf = (c: Record<string, number>) => Object.values(c).reduce((a, b) => a + b, 0)

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const start = (current - 1) * PAGE_SIZE
  const shown = filtered.slice(start, start + PAGE_SIZE)
  const facet = (set: (v: string) => void) => (v: string) => { set(v); setPage(1) }
  const active = [year && { label: `Year: ${year}`, clear: () => setYear('') }, type && { label: type, clear: () => setType('') }, subject && { label: subject, clear: () => setSubject('') }].filter(Boolean) as { label: string; clear: () => void }[]
  const clearAll = () => { setYear(''); setType(''); setSubject(''); setPage(1) }
  const onSort = (e: ChangeEvent<HTMLSelectElement>) => { setSort(e.target.value as Sort); setPage(1) }

  return (
    <>
      <PageHead crumbs={[{ label: 'Home', to: paths.home }, { label: 'Search Results' }]} eyebrow="Search the archive" title="Search Results"
        subtitle="Search by keyword, title, author, DOI or Paper ID.">
        <SearchBox id="results-search" large className="mt-5 max-w-2xl" onSearch={(q) => navigate(paths.search(q))} />
      </PageHead>

      <Container className="mt-6 grid gap-x-8 gap-y-4 pb-4 lg:grid-cols-[250px_minmax(0,1fr)]">
        <div className="lg:hidden">
          <button type="button" aria-expanded={railOpen} aria-controls="search-facets" onClick={() => setRailOpen(!railOpen)}
            className="inline-flex h-10 items-center gap-2 rounded border border-line bg-white px-3.5 text-sm font-semibold text-navy hover:border-scholar">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />Refine results{active.length > 0 && <span className="rounded-sm bg-navy px-1.5 text-xs tabular-nums text-white">{active.length}</span>}
          </button>
        </div>

        <form id="search-facets" aria-label="Filter results" onSubmit={(e) => e.preventDefault()}
          className={`space-y-5 lg:sticky lg:top-24 lg:row-span-1 lg:block lg:self-start ${railOpen ? 'block' : 'hidden'}`}>
          <RailTitle>Refine results</RailTitle>
          <Facet name="f-type" label="Article type" value={type} options={ARTICLE_TYPES as readonly string[]} counts={typeCounts} total={sumOf(typeCounts)} onChange={facet(setType)} />
          <Facet name="f-subject" label="Subject area" value={subject} options={SUBJECTS as readonly string[]} counts={subjectCounts} total={sumOf(subjectCounts)} onChange={facet(setSubject)} />
          <Facet name="f-year" label="Year" value={year} options={years} counts={yearCounts} total={sumOf(yearCounts)} onChange={facet(setYear)} />
          {active.length > 0 && <button type="button" onClick={clearAll} className="text-[13px] font-semibold text-scholar hover:underline">Clear all filters</button>}
        </form>

        <section aria-label="Search results" className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-navy pb-3" style={{ borderBottomWidth: 2 }}>
            <p role="status" aria-live="polite" className="text-sm text-ink">
              {query ? (
                <><strong className="font-semibold tabular-nums">{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'} for <strong className="font-semibold">“{query}”</strong>
                  {filtered.length > 0 && <span className="text-ink-muted"> · showing <span className="tabular-nums">{start + 1}–{start + shown.length}</span></span>}</>
              ) : 'Enter a keyword, title, author or DOI.'}
            </p>
            {filtered.length > 1 && (
              <div className="flex items-center gap-2">
                <label htmlFor="sort" className="text-[13px] font-semibold text-ink-muted">Sort by</label>
                <select id="sort" value={sort} onChange={onSort} className={`${inputClass()} !w-auto !py-1.5`}>
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {active.length > 0 && (
            <ul aria-label="Active filters" className="mt-3 flex flex-wrap gap-2">
              {active.map((a) => (
                <li key={a.label}>
                  <button type="button" onClick={() => { a.clear(); setPage(1) }} aria-label={`Remove filter ${a.label}`}
                    className="inline-flex items-center gap-1.5 rounded-sm border border-line bg-paper px-2 py-1 text-xs font-semibold text-navy hover:border-scholar">
                    {a.label}<X className="h-3 w-3" aria-hidden />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4">
            {filtered.length === 0
              ? <NoResults query={query} hasFilters={active.length > 0} onClear={clearAll} />
              : shown.map((a, i) => <SearchResult key={a.paperId} article={a} index={start + i + 1} query={query} />)}
          </div>
          {pageCount > 1 && <div className="mt-6 border-t border-line pt-5"><Pagination page={current} pageCount={pageCount} onChange={setPage} /></div>}
        </section>
      </Container>
    </>
  )
}
