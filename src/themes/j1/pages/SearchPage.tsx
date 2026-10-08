import { useMemo, useState, type ChangeEvent } from 'react'
import { ARTICLE_TYPES, SUBJECTS, type ArticleSummary } from '../../../mock-data/journals/j1'
import { ArticleCard } from '../components/ArticleCard'
import { inputClass } from '../components/form'
import { Pagination } from '../components/Pagination'
import { SearchBox } from '../components/SearchBox'
import { AppLink, useRouter } from '../../../core/router'
import { PageHeader } from '../components/PageHeader'
import { Container } from '../components/primitives'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'

const PAGE_SIZE = 6

function NoResults({ query }: { query: string }) {
  return (
    <div className="rounded-card border border-dashed border-line bg-mist p-8 text-center">
      <p className="font-semibold text-ink">{query ? `No articles match “${query}”` : 'Start typing to search the archive'}</p>
      <p className="mt-1 text-sm text-ink-muted">Check the spelling, use fewer words, or try one of these subject areas.</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2">
        {journal.subjects.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded border border-line bg-white px-3 py-1 text-xs font-semibold text-navy hover:border-navy">{s}</AppLink></li>)}
      </ul>
    </div>
  )
}

export function SearchPage({ query, results }: { query: string; results: ArticleSummary[] }) {
  const { navigate } = useRouter()
  const [year, setYear] = useState('')
  const [type, setType] = useState('')
  const [subject, setSubject] = useState('')
  const [page, setPage] = useState(1)

  const years = useMemo(() => [...new Set(results.map((r) => r.publishedAt.slice(0, 4)))].sort().reverse(), [results])
  const filtered = useMemo(() => results.filter((r) => (!year || r.publishedAt.startsWith(year)) && (!type || r.type === type) && (!subject || r.subject === subject)), [results, year, type, subject])
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const onFilter = (set: (v: string) => void) => (e: ChangeEvent<HTMLSelectElement>) => { set(e.target.value); setPage(1) }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', to: paths.home }, { label: 'Search Results' }]} title="Search Results"
        subtitle={query ? `${filtered.length} result${filtered.length === 1 ? '' : 's'} for “${query}”` : 'Enter a keyword, title, author or DOI.'}>
        <SearchBox id="results-search" large className="mt-5 max-w-2xl" onSearch={(q) => navigate(paths.search(q))} />
      </PageHeader>
      <Container className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <form aria-label="Filter results" className="space-y-4 lg:sticky lg:top-20 lg:self-start" onSubmit={(e) => e.preventDefault()}>
          {[
            { id: 'f-year', label: 'Year', value: year, set: setYear, options: years },
            { id: 'f-type', label: 'Article type', value: type, set: setType, options: ARTICLE_TYPES as readonly string[] },
            { id: 'f-subject', label: 'Subject', value: subject, set: setSubject, options: SUBJECTS as readonly string[] },
          ].map((f) => (
            <div key={f.id}>
              <label htmlFor={f.id} className="mb-1.5 block text-sm font-medium">{f.label}</label>
              <select id={f.id} className={inputClass()} value={f.value} onChange={onFilter(f.set)}>
                <option value="">All</option>{f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </form>
        <div>
          <div className="grid gap-4">
            {filtered.length === 0
              ? <NoResults query={query} />
              : shown.map((a) => <ArticleCard key={a.paperId} article={a} variant="list" highlight={query} />)}
          </div>
          <div className="mt-6"><Pagination page={page} pageCount={pageCount} onChange={setPage} /></div>
        </div>
      </Container>
    </>
  )
}
