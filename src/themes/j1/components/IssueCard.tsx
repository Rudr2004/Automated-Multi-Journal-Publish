import type { IssueSummary } from '../../../mock-data/journals/j1'
import { formatMonthYear } from '../../../core/lib/format'
import { IssueCover } from './IssueCover'
import { AppLink } from '../../../core/router'

export function IssueCard({ issue, href }: { issue: IssueSummary; href: string }) {
  return (
    <div className="flex gap-4 rounded-card border border-line bg-white p-4 transition-colors hover:border-navy-300">
      <IssueCover volume={issue.volume} issue={issue.issue} month={issue.month} className="h-28 w-auto shrink-0 rounded shadow-sm" />
      <div className="flex flex-col">
        <h3 className="font-serif text-lg font-semibold text-navy">Volume {issue.volume}, Issue {issue.issue}</h3>
        <p className="text-sm text-ink-muted">{formatMonthYear(issue.month)} · {issue.articleCount} articles</p>
        <AppLink to={href} className="mt-auto text-sm font-semibold text-navy-600 hover:underline">View Issue →</AppLink>
      </div>
    </div>
  )
}
