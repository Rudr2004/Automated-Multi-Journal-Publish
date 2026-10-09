// Issue page as a table of contents: metadata band, filter toolbar, then one data table per article type (editorial first).
import { useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { IssueData } from '../../../core/types'
import { Button } from '../components/Button'
import { PARCHMENT } from '../components/PageBand'
import { Container, EmptyState } from '../components/primitives'
import { OrnamentRule } from '../components/signature'
import { ArrowRight, History } from '../icons'
import { applyFilters, EMPTY, groupByType, plural, type IssueFilters } from './issue/filter'
import { IssueGroup } from './issue/IssueGroup'
import { IssueHeader } from './issue/IssueHeader'
import { IssueRail } from './issue/IssueRail'

const nav = 'inline-flex min-h-11 items-center gap-2 rounded border border-obsidian-300 bg-white px-4 text-sm font-semibold text-obsidian-900 transition-colors motion-reduce:transition-none hover:border-wine-700 hover:text-wine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const [f, setF] = useState<IssueFilters>(EMPTY)
  const visible = useMemo(() => applyFilters(articles, f), [articles, f])
  const groups = groupByType(visible)
  const prev = issue.issue > 1 ? { v: issue.volume, i: issue.issue - 1 } : null
  const next = !issue.isCurrent ? { v: issue.volume, i: issue.issue + 1 } : null

  return (
    <>
      <Helmet><title>{`Volume ${issue.volume}, Issue ${issue.issue} (${formatMonthYear(issue.month)}) | ${journal.shortName}`}</title></Helmet>
      <IssueHeader issue={issue} />
      <div className={PARCHMENT}><Container className="py-8 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
          <IssueRail value={f} onChange={setF} articles={articles} shown={visible.length} />
          <div className="min-w-0">
            {groups.length === 0 ? (
              <EmptyState title="No articles match these filters" text="Try a different word, or clear the area and type filters."
                action={<Button variant="primary" onClick={() => setF({ ...EMPTY, sort: f.sort })}>Clear filters</Button>} />
            ) : groups.map((g) => <IssueGroup key={g.type} type={g.type} title={plural(g.type)} items={g.items} />)}
          </div>
        </div>

        <OrnamentRule className="mt-16" />
        <nav aria-label="Issue navigation" className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {prev ? <AppLink to={paths.issue(prev.v, prev.i)} className={nav}><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />Previous: Issue {prev.i}</AppLink> : <span />}
          <AppLink to={paths.pastIssues} className={nav}><History className="h-4 w-4" aria-hidden="true" />All issues</AppLink>
          {next ? <AppLink to={paths.issue(next.v, next.i)} className={nav}>Next: Issue {next.i}<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink> : <span />}
        </nav>
      </Container></div>
    </>
  )
}
