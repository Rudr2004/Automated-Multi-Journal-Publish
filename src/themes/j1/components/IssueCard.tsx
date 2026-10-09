import type { IssueSummary } from '../../../mock-data/journals/j1'
import { formatMonthYear } from '../../../core/lib/format'
import { IssueCover } from './IssueCover'
import { AppLink } from '../../../core/router'

export function IssueCard({ issue, href }: { issue: IssueSummary; href: string }) {
  return (
    <div className="flex gap-4 border border-line bg-white p-4 transition-colors hover:border-scholar">
      <IssueCover volume={issue.volume} issue={issue.issue} month={issue.month} className="h-28 w-auto shrink-0 shadow-lift" />
      <div className="flex min-w-0 flex-col">
        <h3 className="font-serif text-lg font-semibold leading-snug text-navy">Volume {issue.volume}, Issue {issue.issue}</h3>
        <p className="text-sm text-ink-muted">{formatMonthYear(issue.month)} · {issue.articleCount} articles</p>
        <p className="mt-1 break-all font-mono text-xs tabular-nums text-ink-muted">DOI: {issue.doi}</p>
        <AppLink to={href} className="mt-auto pt-2 text-sm font-semibold text-scholar hover:underline">View Issue →</AppLink>
      </div>
    </div>
  )
}
