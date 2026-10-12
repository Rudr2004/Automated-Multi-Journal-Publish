// Issue page as a table of contents, laid out as in the issue reference: wine banner, then a 3 + 9 column workspace
// (filter panel and telemetry on the left; search card and one section per article type on the right).
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { IssueData } from '../../../core/types'
import { Button } from '../components/Button'
import { Container, EmptyState } from '../components/primitives'
import { ArrowRight, History } from '../icons'
import { applyFilters, EMPTY, groupByType, plural, type IssueFilters } from './issue/filter'
import { IssueGroup } from './issue/IssueGroup'
import { IssueHeader } from './issue/IssueHeader'
import { IssueRail } from './issue/IssueRail'
import { IssueSearchCard } from './issue/IssueSearchCard'

const nav = 'inline-flex min-h-11 items-center gap-2 rounded border border-[#DCC0BE] bg-white px-4 font-work text-sm font-semibold text-[#141B2B] transition-colors motion-reduce:transition-none hover:border-wine-800 hover:text-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const [f, setF] = useState<IssueFilters>(EMPTY)
  const visible = useMemo(() => applyFilters(articles, f), [articles, f])
  const groups = groupByType(visible)
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
              {groups.length === 0 ? (
                <EmptyState title="No articles match these filters" text="Try a different word, or clear the area and type filters."
                  action={<Button variant="primary" onClick={() => setF({ ...EMPTY, sort: f.sort })}>Clear filters</Button>} />
              ) : groups.map((g) => <IssueGroup key={g.type} type={g.type} title={plural(g.type)} items={g.items} />)}
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
