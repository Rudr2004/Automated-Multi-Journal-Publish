// Bulletin and archive search panel (top of the home page): the latest-issue bulletin, the search bar with a collection scope, quick filters and the advanced link.
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { HeroSearch } from '../../components/HeroSearch'
import { ARTICLE_TYPES } from '../../../../core/types'
import { Book } from '../../icons'
import { btn, labelCls } from './bits'
import { journal } from '../../../../config/journals'

export function SearchPanel({ issue }: { issue: IssueSummary }) {
  return (
    <section aria-label="Archive search" className="mt-8 bg-iris-50 p-4 sm:p-5">
      <div className="flex flex-col justify-between gap-2 pb-3 md:flex-row md:items-center">
        <p className="flex flex-wrap items-center gap-3">
          <span className={`${labelCls} bg-ember-700 px-2 py-0.5 tracking-wider text-white`}>Bulletin</span>
          <span className="font-jakarta text-base font-medium text-iris-700">Volume {issue.volume}, Issue {issue.issue} ({formatMonthYear(issue.publishedAt)}) is now published online</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-inter text-sm">
          <AppLink to={paths.pastIssues} className="inline-flex items-center gap-1 text-iris-700 hover:text-ember-700 hover:underline"><Book className="h-4 w-4" aria-hidden="true" /> Archive catalogue</AppLink>
          <span aria-hidden="true" className="text-mauve-300">|</span>
          <AppLink to={paths.currentIssue} className="text-iris-700 hover:text-ember-700 hover:underline">Current issue</AppLink>
        </p>
      </div>
      <HeroSearch />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 font-inter text-sm text-mauve-600">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className={`${labelCls} tracking-[0.08em]`}>Quick filters:</span>
          {journal.badges.openAccess && <span className={`${labelCls} inline-flex items-center gap-1 text-j3valid-700`}>Open access ({journal.licence.name})</span>}
          {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => (
            <AppLink key={t} to={paths.search(t)} className={`${btn} bg-white px-3 py-1 text-iris-700 ring-1 ring-mauve-100 hover:bg-iris-100`}>{t}s</AppLink>
          ))}
        </div>
        <AppLink to={paths.search('')} className={`${labelCls} tracking-[0.08em] text-iris-700 underline underline-offset-4 hover:text-ember-700`}>Advanced search →</AppLink>
      </div>
    </section>
  )
}

