// Issue page (reference: current issue with cover showcase): breadcrumb, cover header card, filter card with type tabs, paged article cards,
// previous/next issue links, a right sidebar (10 cards, as in the reference), the dual call-out bar and the honors showcase. Same route and data as before.
import { useEffect, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { IssueData } from '../../../core/types'
import { ArticleCard } from '../components/ArticleCard'
import { Button } from '../components/Button'
import { EmptyState, cx } from '../components/primitives'
import { ArrowRight, History, Send } from '../icons'
import { applyFilters, EMPTY, type IssueFilters } from './issue/filter'
import { IssueHonors, IssuePreFooter } from './issue/IssueFooterBlocks'
import { IssueHeader } from './issue/IssueHeader'
import { IssueRail } from './issue/IssueRail'
import { IssueToolbar } from './issue/IssueToolbar'

const PAGE = 5
const pg = (on: boolean) => cx('inline-flex h-11 min-w-11 items-center justify-center rounded border text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:h-8 lg:min-w-8',
  on ? 'border-cobalt-700 bg-cobalt-700 font-bold text-white' : 'border-slate-200 font-medium text-slate-700 transition-colors hover:bg-slate-100')

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const [f, setF] = useState<IssueFilters>(EMPTY)
  const [page, setPage] = useState(1)
  const visible = useMemo(() => applyFilters(articles, f), [articles, f])
  useEffect(() => { setPage(1) }, [f])
  const pages = Math.max(1, Math.ceil(visible.length / PAGE))
  const cur = Math.min(page, pages)
  const slice = visible.slice((cur - 1) * PAGE, cur * PAGE)
  const prev = issue.issue > 1 ? { v: issue.volume, i: issue.issue - 1 } : null
  const next = !issue.isCurrent ? { v: issue.volume, i: issue.issue + 1 } : null
  const go = (n: number) => { setPage(n); document.getElementById('issue-articles')?.scrollIntoView({ block: 'start' }) }
  const nextShort = journal.nextIssue.label.split(' — ')[0].replace('Volume', 'Vol').replace(', Issue', ' • Iss')
  const link = 'flex min-h-11 items-center gap-1 font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-8'

  return (
    <div className="bg-slate-50">
      <Helmet><title>{`Volume ${issue.volume}, Issue ${issue.issue} (${formatMonthYear(issue.month)}) | ${journal.shortName}`}</title></Helmet>
      <div className="mx-auto w-full max-w-7xl px-4 py-6">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-8">
            <IssueHeader issue={issue} articles={articles} />
            <IssueToolbar value={f} onChange={setF} shown={visible.length} articles={articles} />

            <div id="issue-articles" className="scroll-mt-20">
              {slice.length === 0 ? (
                <EmptyState title="No articles match these filters" text="Try a different word, or clear the area and type filters."
                  action={<Button variant="primary" onClick={() => setF({ ...EMPTY, sort: f.sort })}>Clear filters</Button>} />
              ) : (
                <ol aria-label="Articles in this issue" className="space-y-4">
                  {slice.map((a) => <ArticleCard key={a.paperId} article={a} />)}
                </ol>
              )}
            </div>

            {visible.length > 0 && (
              <div className="flex flex-col items-center justify-between gap-4 rounded-[12px] border border-slate-200 bg-white p-4 text-xs shadow-hair sm:flex-row">
                <p className="text-center font-medium text-slate-600 sm:text-left" aria-live="polite">Showing <span className="font-bold text-slate-900">{(cur - 1) * PAGE + 1}–{Math.min(cur * PAGE, visible.length)}</span> of <span className="font-bold text-slate-900">{visible.length}</span> peer-reviewed articles</p>
                {pages > 1 && (
                  <nav aria-label="Article pages" className="flex items-center gap-1">
                    <button type="button" disabled={cur === 1} onClick={() => go(cur - 1)} aria-label="Previous page" className={cx(pg(false), 'disabled:cursor-not-allowed disabled:text-slate-400')}><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" /></button>
                    {Array.from({ length: pages }, (_, i) => i + 1).map((n) => <button key={n} type="button" aria-current={n === cur ? 'page' : undefined} aria-label={`Page ${n}`} onClick={() => go(n)} className={pg(n === cur)}>{n}</button>)}
                    <button type="button" disabled={cur === pages} onClick={() => go(cur + 1)} aria-label="Next page" className={cx(pg(false), 'disabled:cursor-not-allowed disabled:text-slate-400')}><ArrowRight className="h-4 w-4" aria-hidden="true" /></button>
                  </nav>
                )}
              </div>
            )}

            <nav aria-label="Issue navigation" className="flex flex-col items-center justify-between gap-3 rounded-[12px] border border-slate-200 bg-slate-50 p-4 text-xs sm:flex-row">
              {prev
                ? <AppLink to={paths.issue(prev.v, prev.i)} className="flex min-h-11 items-center gap-2 text-slate-500 hover:text-cobalt-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-8"><History className="h-4 w-4" aria-hidden="true" />Previous: <em>Volume {prev.v} • Issue {prev.i}</em></AppLink>
                : <span className="flex items-center gap-2 text-slate-500"><History className="h-4 w-4" aria-hidden="true" />First issue</span>}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <AppLink to={paths.pastIssues} className={`${link} text-cobalt-700`}>Full Archives Index<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
                {next
                  ? <AppLink to={paths.issue(next.v, next.i)} className={`${link} text-emerald-800`}>Vol {next.v} • Iss {next.i}<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
                  : <AppLink to={paths.submit} className={`${link} text-emerald-800`}>{nextShort} (Submissions Open)<Send className="h-4 w-4" aria-hidden="true" /></AppLink>}
              </div>
            </nav>
          </div>
          <IssueRail articles={articles} />
        </div>

        <IssuePreFooter />
        <IssueHonors />
      </div>
    </div>
  )
}
