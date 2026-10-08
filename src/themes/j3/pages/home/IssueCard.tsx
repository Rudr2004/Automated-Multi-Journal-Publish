// Current issue card for the hero: generated cover artwork with the cover story title, the publication date and the issue DOI.
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import type { ArticleSummary, IssueSummary } from '../../../../core/types'
import { Artwork } from '../../components/Artwork'
import { ButtonLink } from '../../components/Button'
import { ArrowRight } from '../../icons'

export function IssueCard({ issue, story }: { issue: IssueSummary; story?: ArticleSummary }) {
  return (
    <aside aria-label="Current issue" className="rounded-block bg-white p-5 shadow-dock ring-1 ring-mauve-100">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-iris-100 px-3 py-1 font-jakarta text-[11px] font-extrabold uppercase tracking-[0.06em] text-iris-800"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ember-500" /> Open access issue</span>
        <span className="font-jakarta text-xs font-bold text-mauve-700">Vol {issue.volume} · Issue {issue.issue}</span>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-tile bg-iris-700">
        <Artwork seed={story?.paperId ?? `issue-${issue.volume}-${issue.issue}`} palette={0} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-night-900/90 via-night-900/40 to-transparent" aria-hidden="true" />
        <div className="relative flex min-h-[10.5rem] flex-col justify-end p-4 text-white">
          <p className="font-jakarta text-[11px] font-extrabold uppercase tracking-[0.06em] text-ember-400">Cover story</p>
          <p className="mt-1 line-clamp-3 font-jakarta text-lg font-extrabold leading-snug">{story?.title ?? 'Read the current issue'}</p>
        </div>
      </div>

      <dl className="mt-4 divide-y divide-mauve-100 text-sm">
        <div className="flex items-center justify-between gap-3 py-2"><dt className="text-mauve-600">Publication date</dt><dd className="font-jakarta font-bold text-night-900">{formatDate(issue.publishedAt)}</dd></div>
        <div className="flex items-center justify-between gap-3 py-2"><dt className="text-mauve-600">Issue DOI</dt><dd className="truncate font-jakarta font-bold text-night-900">{issue.doi}</dd></div>
      </dl>
      <ButtonLink to={paths.currentIssue} variant="outline" className="mt-2 w-full">View issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
    </aside>
  )
}
