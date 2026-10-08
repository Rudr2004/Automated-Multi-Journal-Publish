// Past issues: year tabs, a grid of generated covers and a search across every article.
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { ArticleCard } from '../components/ArticleCard'
import { Container, cx, EmptyState, SectionHeading, Tag } from '../components/primitives'
import { Search } from '../icons'

const COVERS = [
  'from-brand-900 to-brand-600', 'from-accent-900 to-accent-500', 'from-brand-800 to-accent-600',
  'from-graphite-800 to-brand-700', 'from-accent-800 to-brand-500', 'from-brand-900 to-accent-700',
]

function Cover({ issue, index }: { issue: IssueSummary; index: number }) {
  return (
    <AppLink to={paths.issue(issue.volume, issue.issue)} aria-label={`Volume ${issue.volume}, Issue ${issue.issue}, ${formatMonthYear(issue.month)}, ${issue.articleCount} articles`}
      className="group block rounded-panel focus-visible:outline-offset-4">
      <div className={cx('relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-panel bg-gradient-to-br p-5 text-white shadow-card transition-shadow group-hover:shadow-pop', COVERS[index % COVERS.length])}>
        <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-14 -left-10 h-44 w-44 rounded-full bg-white/10" />
        <div className="relative">
          <p className="font-display text-2xl font-bold tracking-wide">{journal.shortName}</p>
          <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/80">ISSN {journal.issnOnline}</p>
        </div>
        <div className="relative">
          <p className="font-display text-xl font-semibold">Vol. {issue.volume}, Issue {issue.issue}</p>
          <p className="mt-0.5 text-sm text-white/90">{formatMonthYear(issue.month)}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-graphite-800 group-hover:text-accent-700">Volume {issue.volume}, Issue {issue.issue}</span>
        {issue.isCurrent ? <Tag tone="brand">Current</Tag> : <span className="text-graphite-600">{issue.articleCount} articles</span>}
      </div>
    </AppLink>
  )
}

export function PastIssuesPage({ issues, articles }: { issues: IssueSummary[]; articles: ArticleSummary[] }) {
  const years = useMemo(() => [...new Set(issues.map((i) => i.month.slice(0, 4)))].sort((a, b) => b.localeCompare(a)), [issues])
  const [year, setYear] = useState<string>(years[0] ?? '')
  const [q, setQ] = useState('')
  const inYear = useMemo(() => issues.filter((i) => i.month.startsWith(year)).sort((a, b) => b.month.localeCompare(a.month)), [issues, year])
  const term = q.trim().toLowerCase()
  const matches = useMemo(() => (term.length < 2 ? [] : articles.filter((a) => `${a.title} ${a.authors.join(' ')}`.toLowerCase().includes(term))), [articles, term])

  return (
    <>
      <Helmet><title>{`Past Issues | ${journal.shortName}`}</title></Helmet>
      <section className="bg-gradient-to-br from-brand-900 via-brand-800 to-accent-700 text-white">
        <Container className="py-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">Archive</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">Past issues</h1>
          <p className="mt-3 max-w-2xl text-brand-50">Every issue of {journal.name} stays free to read. Pick a year, or search all published articles by title or author.</p>
          <div className="mt-6 max-w-xl">
            <label htmlFor="archive-q" className="sr-only">Search all articles by title or author</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite-500" aria-hidden="true" />
              <input id="archive-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all articles by title or author"
                className="w-full rounded-panel border border-transparent bg-white py-3 pl-11 pr-4 text-base text-graphite-800 shadow-card placeholder:text-graphite-500 focus:border-accent-700" />
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-10 sm:py-14">
        {term.length >= 2 ? (
          <section aria-labelledby="archive-results">
            <SectionHeading id="archive-results" title={`${matches.length} article${matches.length === 1 ? '' : 's'} for “${q.trim()}”`} />
            {matches.length === 0 ? (
              <EmptyState title="No matching articles" text="Check the spelling or try an author’s surname or a distinctive word from the title."
                action={<button type="button" onClick={() => setQ('')} className="text-sm font-semibold text-accent-700 hover:underline">Clear search</button>} />
            ) : (
              <ul role="status" aria-live="polite" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {matches.map((a) => <li key={a.paperId} className="flex"><div className="w-full min-w-0"><ArticleCard article={a} /></div></li>)}
              </ul>
            )}
          </section>
        ) : (
          <section aria-labelledby="archive-issues">
            <SectionHeading id="archive-issues" eyebrow="Issues" title="Browse by year" />
            {issues.length === 0 ? <EmptyState title="No issues yet" text="Published issues will appear here." /> : (
              <>
                <div role="tablist" aria-label="Year" className="mb-8 flex flex-wrap gap-2">
                  {years.map((y) => (
                    <button key={y} type="button" role="tab" id={`tab-${y}`} aria-selected={year === y} aria-controls="issue-grid" onClick={() => setYear(y)}
                      className={cx('rounded-soft px-5 py-2 font-display text-base font-semibold', year === y ? 'bg-brand-800 text-white' : 'border border-graphite-300 bg-white text-graphite-700 hover:border-accent-700 hover:text-accent-700')}>
                      {y}
                    </button>
                  ))}
                </div>
                <ul id="issue-grid" role="tabpanel" aria-labelledby={`tab-${year}`} className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:grid-cols-5">
                  {inYear.map((i, n) => <li key={`${i.volume}-${i.issue}`}><Cover issue={i} index={n} /></li>)}
                </ul>
              </>
            )}
          </section>
        )}
      </Container>
    </>
  )
}
