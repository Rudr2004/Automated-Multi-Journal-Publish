// Past issues: mint header card with archive search, year tabs, issue cards with a generated cover, and search across every article.
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { IssueArticleRow } from '../components/IssueArticleRow'
import { Container, cx, EmptyState } from '../components/primitives'
import { WithAwardsRail } from '../components/WithAwardsRail'
import { ArrowRight, ChevronRight, Search } from '../icons'

function IssueCard({ issue }: { issue: IssueSummary }) {
  return (
    <AppLink to={paths.issue(issue.volume, issue.issue)} aria-label={`Volume ${issue.volume}, Issue ${issue.issue}, ${formatMonthYear(issue.month)}, ${issue.articleCount} articles`}
      className="group flex h-full flex-col rounded-panel border border-graphite-200 bg-white p-4 shadow-card transition-shadow hover:shadow-soft focus-visible:outline-offset-4">
      <div className="relative flex aspect-[3/4] flex-col items-center justify-between overflow-hidden rounded-soft bg-brand-800 p-4 text-white">
        <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <p className="relative font-mono text-[11px] font-semibold uppercase tracking-wider text-brand-100">{journal.shortName} · Vol. {issue.volume} No. {issue.issue}</p>
        <span className="relative rounded-soft bg-white p-2"><img src="/journals/j2/logo.png" alt="" className="h-20 w-20 object-contain" /></span>
        <div className="relative flex w-full items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-brand-100">
          <span>{formatMonthYear(issue.month)}</span>{journal.badges.openAccess && <span>Open Access</span>}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="font-display text-lg font-bold text-graphite-900 group-hover:text-accent-700">Volume {issue.volume}, Issue {issue.issue}</p>
        {issue.isCurrent && <span className="rounded-full border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-800">Current</span>}
      </div>
      <p className="mt-1 text-sm text-graphite-700">{formatMonthYear(issue.month)} · {issue.articleCount} article{issue.articleCount === 1 ? '' : 's'}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-accent-700">View issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
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
  const counts = useMemo(() => new Map(years.map((y) => [y, issues.filter((i) => i.month.startsWith(y)).length])), [years, issues])

  return (
    <div className="bg-brand-50/60">
      <Helmet><title>{`Past Issues | ${journal.shortName}`}</title></Helmet>
      <Container className="pb-12 pt-5 sm:pb-16">
<WithAwardsRail>
        <nav aria-label="Breadcrumb" className="text-sm text-graphite-700">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><AppLink to={paths.home} className="hover:text-accent-700 hover:underline">Home</AppLink></li><li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li aria-current="page" className="font-semibold text-graphite-900">Past issues</li>
          </ol>
        </nav>

        <section aria-labelledby="archive-h" className="relative isolate mt-4 overflow-hidden rounded-sheet bg-brand-800 p-6 text-white shadow-soft sm:p-10">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_18rem_at_100%_0%,rgba(15,118,110,0.55),transparent)]" />
          <span className="rounded-full border border-white/30 bg-white/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider">Archive</span>
          <h1 id="archive-h" className="mt-4 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">Past issues</h1>
          <p className="mt-3 max-w-2xl text-base text-brand-50 sm:text-lg">Every issue of {journal.name} stays free to read. Pick a year, or search all published articles by title or author.</p>
          <div className="mt-6 max-w-xl">
            <label htmlFor="archive-q" className="sr-only">Search all articles by title or author</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-graphite-600" aria-hidden="true" />
              <input id="archive-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search all articles by title or author"
                className="w-full rounded-soft border border-transparent bg-white py-3 pl-11 pr-4 text-base text-graphite-800 shadow-card placeholder:text-graphite-600 focus:border-accent-700" />
            </div>
          </div>
        </section>

        {term.length >= 2 ? (
          <section aria-labelledby="archive-results" className="mt-8">
            <h2 id="archive-results" className="border-b-2 border-brand-800 pb-2 font-display text-lg font-bold uppercase tracking-wide text-brand-900">
              {matches.length} article{matches.length === 1 ? '' : 's'} for “{q.trim()}”
            </h2>
            {matches.length === 0 ? (
              <div className="mt-4"><EmptyState title="No matching articles" text="Check the spelling or try an author’s surname or a distinctive word from the title."
                action={<button type="button" onClick={() => setQ('')} className="text-sm font-semibold text-accent-700 hover:underline">Clear search</button>} /></div>
            ) : (
              <ul role="status" aria-live="polite" className="mt-4 grid gap-4">
                {matches.map((a) => <li key={a.paperId} className="min-w-0"><IssueArticleRow article={a} /></li>)}
              </ul>
            )}
          </section>
        ) : (
          <section aria-labelledby="archive-issues" className="mt-8">
            <h2 id="archive-issues" className="border-b-2 border-brand-800 pb-2 font-display text-lg font-bold uppercase tracking-wide text-brand-900">Browse by year</h2>
            {issues.length === 0 ? <div className="mt-4"><EmptyState title="No issues yet" text="Published issues will appear here." /></div> : (
              <>
                <div role="tablist" aria-label="Year" className="mt-5 flex flex-wrap gap-2 rounded-panel border border-graphite-200 bg-white p-2 shadow-card">
                  {years.map((y) => (
                    <button key={y} type="button" role="tab" id={`tab-${y}`} aria-selected={year === y} aria-controls="issue-grid" onClick={() => setYear(y)}
                      className={cx('rounded-soft px-5 py-2 font-display text-base font-semibold', year === y ? 'bg-brand-800 text-white' : 'text-graphite-800 hover:bg-brand-50')}>
                      {y} <span className={cx('text-sm font-medium tabular-nums', year === y ? 'text-brand-100' : 'text-graphite-700')}>({counts.get(y)})</span>
                    </button>
                  ))}
                </div>
                <ul id="issue-grid" role="tabpanel" aria-labelledby={`tab-${year}`} className="mt-6 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                  {inYear.map((i) => <li key={`${i.volume}-${i.issue}`}><IssueCard issue={i} /></li>)}
                </ul>
              </>
            )}
          </section>
        )}
      </WithAwardsRail>
</Container>
    </div>
  )
}
