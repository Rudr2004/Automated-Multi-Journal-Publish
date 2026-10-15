// Issue page as a table of contents, laid out as in the issue reference: wine banner, then a 3 + 9 column workspace
// (filter panel and telemetry on the left; search card and one section per article type on the right).
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { IssueData } from '../../../core/types'
import { Button } from '../components/Button'
import { Container, EmptyState } from '../components/primitives'
import { ArrowRight, History } from '../icons'
import { PaperRow } from '../components/PaperBits'
import { applyFilters, EMPTY, type IssueFilters } from './issue/filter'
import { IssueHeader } from './issue/IssueHeader'
import { IssueRail } from './issue/IssueRail'
import { IssueSearchCard } from './issue/IssueSearchCard'

const nav = 'inline-flex min-h-11 items-center gap-2 rounded border border-[#DCC0BE] bg-white px-4 font-work text-sm font-semibold text-[#141B2B] transition-colors motion-reduce:transition-none hover:border-wine-800 hover:text-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const [f, setF] = useState<IssueFilters>(EMPTY)
  const visible = useMemo(() => applyFilters(articles, f), [articles, f])
  // One list for the whole issue (no article-type headings), five articles per page.
  const PAGE = 5
  const [page, setPage] = useState(1)
  useEffect(() => { setPage(1) }, [f])
  const pages = Math.max(1, Math.ceil(visible.length / PAGE))
  const cur = Math.min(page, pages)
  const slice = visible.slice((cur - 1) * PAGE, cur * PAGE)
  const goPage = (n: number) => { setPage(n); document.getElementById('issue-list')?.scrollIntoView({ block: 'start' }) }
  const dirty = !!(f.area || f.type || f.text)
  const prev = issue.issue > 1 ? { v: issue.volume, i: issue.issue - 1 } : null
  const next = !issue.isCurrent ? { v: issue.volume, i: issue.issue + 1 } : null

  return (
    <>
      <Helmet><title>{`Volume ${issue.volume}, Issue ${issue.issue} (${formatMonthYear(issue.month)}) | ${journal.shortName}`}</title></Helmet>
      <IssueHeader issue={issue} articles={articles} />
      <div className="bg-[#F9F9FF]"><Container className="pb-10 pt-8">
        <div className="grid items-start gap-8 lg:grid-cols-12">
          <IssueRail value={f} onChange={setF} articles={articles} shown={visible.length} />
          <div className="min-w-0 space-y-6 lg:col-span-9">
            <IssueSearchCard value={f} onChange={setF} articles={articles} issue={issue} />
            <p role="status" aria-live="polite" className="sr-only">{dirty ? `${visible.length} of ${articles.length} articles shown` : `${articles.length} articles in this issue`}</p>
            <div className="space-y-10">
              {visible.length === 0 ? (
                <EmptyState title="No articles match these filters" text="Try a different word, or clear the area and type filters."
                  action={<Button variant="primary" onClick={() => setF({ ...EMPTY, sort: f.sort })}>Clear filters</Button>} />
              ) : (
                <>
                  <ol id="issue-list" className="scroll-mt-28 space-y-0" aria-label="Articles of this issue">{slice.map((a) => <PaperRow key={a.paperId} article={a} />)}</ol>
                  {pages > 1 && (
                    <nav aria-label="Article pages" className="flex items-center justify-center gap-1.5">
                      <button type="button" aria-label="Previous page" disabled={cur === 1} onClick={() => goPage(cur - 1)} className="flex h-10 w-10 items-center justify-center rounded border border-[#DCC0BE] bg-white text-[#141B2B] hover:border-wine-800 disabled:cursor-not-allowed disabled:opacity-40"><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" /></button>
                      {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                        <button key={n} type="button" aria-label={`Page ${n}`} aria-current={n === cur ? 'page' : undefined} onClick={() => goPage(n)} className={n === cur ? 'flex h-10 w-10 items-center justify-center rounded bg-wine-800 font-work text-sm font-bold text-white' : 'flex h-10 w-10 items-center justify-center rounded border border-[#DCC0BE] bg-white font-work text-sm font-semibold text-[#141B2B] hover:border-wine-800'}>{n}</button>
                      ))}
                      <button type="button" aria-label="Next page" disabled={cur === pages} onClick={() => goPage(cur + 1)} className="flex h-10 w-10 items-center justify-center rounded border border-[#DCC0BE] bg-white text-[#141B2B] hover:border-wine-800 disabled:cursor-not-allowed disabled:opacity-40"><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <nav aria-label="Issue navigation" className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#DCC0BE]/60 pt-6">
          {prev ? <AppLink to={paths.issue(prev.v, prev.i)} className={nav}><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />Previous: Issue {prev.i}</AppLink> : <span />}
          <AppLink to={paths.pastIssues} className={nav}><History className="h-4 w-4" aria-hidden="true" />All issues</AppLink>
          {next ? <AppLink to={paths.issue(next.v, next.i)} className={nav}>Next: Issue {next.i}<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink> : <span />}
        </nav>
      </Container></div>
    </>
  )
}
