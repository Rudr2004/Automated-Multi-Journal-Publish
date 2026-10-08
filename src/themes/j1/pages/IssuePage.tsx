import { Calendar, Download, Hash, Search, X } from '../components/uiIcons'
import { useMemo, useState } from 'react'
import { ARTICLE_TYPES, SUBJECTS, type ArticleSummary, type ArticleType, type IssueData } from '../../../mock-data/journals/j1'
import { ArticleCard } from '../components/ArticleCard'
import { Button } from '../components/Button'
import { inputClass } from '../components/form'
import { IssueCover } from '../components/IssueCover'
import { PageHeader } from '../components/PageHeader'
import { Badge, Container, EmptyState } from '../components/primitives'
import { useToast } from '../components/Toast'
import { paths } from '../../../config/routes'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'

type Sort = 'latest' | 'views' | 'pages'

const firstPage = (a: ArticleSummary) => (a.pages.startsWith('i') ? 0 : parseInt(a.pages, 10))

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [type, setType] = useState<ArticleType | ''>('')
  const [sort, setSort] = useState<Sort>('pages')

  const counts = useMemo(() => Object.fromEntries(ARTICLE_TYPES.map((t) => [t, articles.filter((a) => a.type === t).length])), [articles])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = articles.filter((a) =>
      (!type || a.type === type) && (!subject || a.subject === subject) &&
      (!q || a.title.toLowerCase().includes(q) || a.authors.join(' ').toLowerCase().includes(q) || a.paperId.toLowerCase().includes(q)))
    return [...list].sort((a, b) =>
      sort === 'views' ? b.views - a.views : sort === 'latest' ? b.publishedAt.localeCompare(a.publishedAt) || b.paperId.localeCompare(a.paperId) : firstPage(a) - firstPage(b))
  }, [articles, query, subject, type, sort])

  const hasFilters = !!(query || subject || type)
  const clear = () => { setQuery(''); setSubject(''); setType('') }
  const title = issue.isCurrent ? 'Current Issue' : `Volume ${issue.volume}, Issue ${issue.issue}`
  const crumbs = issue.isCurrent
    ? [{ label: 'Home', to: paths.home }, { label: 'Current Issue' }]
    : [{ label: 'Home', to: paths.home }, { label: 'Past Issues', to: paths.pastIssues }, { label: `Volume ${issue.volume}, Issue ${issue.issue}` }]

  return (
    <>
      <PageHeader crumbs={crumbs} title={title}>
        <div className="mt-6 grid gap-6 lg:grid-cols-[auto_1fr_340px] lg:items-start">
          <IssueCover volume={issue.volume} issue={issue.issue} month={issue.month} className="mx-auto h-56 w-auto rounded-lg shadow-xl lg:mx-0" />
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {issue.isCurrent && <Badge tone="blue">Latest issue</Badge>}
              <Badge tone="open">Open Access</Badge>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-navy">Volume {issue.volume}, Issue {issue.issue}</h2>
            <dl className="mt-3 space-y-2 text-sm text-ink">
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-navy-500" aria-hidden /><dt className="sr-only">Month</dt><dd>{formatMonthYear(issue.month)}</dd></div>
              <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-navy-500" aria-hidden /><dt className="text-ink-muted">Published:</dt><dd>{formatDate(issue.publishedAt)}</dd></div>
              <div className="flex items-center gap-2"><Hash className="h-4 w-4 text-navy-500" aria-hidden /><dt className="text-ink-muted">Issue DOI:</dt><dd>{issue.doi}</dd></div>
            </dl>
            <Button className="mt-5" onClick={() => toast('Complete issue PDF download started (simulated).')}>
              <Download className="h-4 w-4" aria-hidden />Download Complete Issue (PDF)
            </Button>
          </div>
          <aside aria-labelledby="in-issue" className="rounded-card border border-line bg-white p-5 shadow-sm">
            <h2 id="in-issue" className="font-serif text-lg font-semibold text-navy">In this Issue</h2>
            <ul className="mt-3 divide-y divide-line">
              {ARTICLE_TYPES.map((t) => (
                <li key={t}>
                  <button type="button" disabled={!counts[t]} aria-pressed={type === t} onClick={() => setType(type === t ? '' : t)}
                    className={`flex w-full items-center justify-between py-2.5 text-left text-sm transition-colors disabled:opacity-40 ${type === t ? 'font-semibold text-navy' : 'text-ink hover:text-navy'}`}>
                    <span>{t === 'Editorial' ? 'Editorial' : `${t}s`}</span>
                    <span className={`rounded px-2 py-0.5 text-xs font-semibold ${type === t ? 'bg-navy text-white' : 'bg-mist-200 text-ink-muted'}`}>{counts[t]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-muted">{articles.length} articles in total. Click a type to filter.</p>
          </aside>
        </div>
      </PageHeader>

      <Container className="mt-8">
        <form role="search" aria-label="Search within this issue" onSubmit={(e) => e.preventDefault()}
          className="grid gap-3 rounded-card border border-line bg-mist p-4 md:grid-cols-[1fr_200px_200px_180px]">
          <div className="relative">
            <label htmlFor="issue-q" className="sr-only">Search within this issue</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input id="issue-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search within this issue…" className={`${inputClass()} pl-9`} />
          </div>
          <div>
            <label htmlFor="issue-cat" className="sr-only">Category</label>
            <select id="issue-cat" value={subject} onChange={(e) => setSubject(e.target.value)} className={inputClass()}>
              <option value="">All categories</option>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="issue-type" className="sr-only">Article type</label>
            <select id="issue-type" value={type} onChange={(e) => setType(e.target.value as ArticleType | '')} className={inputClass()}>
              <option value="">All article types</option>
              {ARTICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="issue-sort" className="sr-only">Sort by</label>
            <select id="issue-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={inputClass()}>
              <option value="pages">Sort: Page order</option>
              <option value="latest">Sort: Latest</option>
              <option value="views">Sort: Most viewed</option>
            </select>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-ink-muted" aria-live="polite">
          <span>Showing {filtered.length} of {articles.length} articles · {formatNumber(filtered.reduce((n, a) => n + a.views, 0))} total views</span>
          {hasFilters && <button type="button" onClick={clear} className="inline-flex items-center gap-1 font-semibold text-navy-600 hover:underline"><X className="h-3.5 w-3.5" aria-hidden />Clear filters</button>}
        </div>

        <div className="mt-4 grid gap-4">
          {filtered.length === 0 ? (
            <EmptyState title="No articles match your filters" hint="Try a different keyword or clear the filters." />
          ) : (
            filtered.map((a) => <ArticleCard key={a.paperId} article={a} variant="list" />)
          )}
        </div>
      </Container>
    </>
  )
}
