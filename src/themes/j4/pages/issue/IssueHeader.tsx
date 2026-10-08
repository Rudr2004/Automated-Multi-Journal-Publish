// Issue page header: dark band with the issue metadata laid out like a spec sheet.
import { journal } from '../../../../config/journals'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import type { IssueSummary } from '../../../../core/types'
import { PageBand } from '../../components/PageBand'

export function IssueHeader({ issue }: { issue: IssueSummary }) {
  const rows: [string, string][] = [
    ['Volume', String(issue.volume)], ['Issue', String(issue.issue)], ['Month', formatMonthYear(issue.month)],
    ['Published', formatDate(issue.publishedAt)], ['Articles', String(issue.articleCount)], ['ISSN (online)', journal.issnOnline],
  ]
  return (
    <PageBand label={issue.isCurrent ? 'Current issue' : 'Past issue'} title={<>Volume {issue.volume}, Issue {issue.issue}<span className="block text-abyss-300">{formatMonthYear(issue.month)}</span></>}>
      <dl className="mt-8 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-pane border border-white/15 bg-white/15 text-sm tabular-nums sm:grid-cols-3 lg:grid-cols-6">
        {rows.map(([k, v]) => (
          <div key={k} className="bg-abyss-800 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-abyss-300">{k}</dt>
            <dd className="mt-1 text-base font-medium text-white">{v}</dd>
          </div>
        ))}
        <div className="col-span-2 bg-abyss-800 px-4 py-3 sm:col-span-3 lg:col-span-6">
          <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-abyss-300">Issue DOI</dt>
          <dd className="mt-1 break-all text-base font-medium text-white">{issue.doi}</dd>
        </div>
      </dl>
    </PageBand>
  )
}
