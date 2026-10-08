// Utility bar: ISSN, DOI prefix and licence on the left, the call-for-papers notice in the centre, Track My Paper on the right.
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { OpenAccess, Track } from '../icons'

export function UtilityBar() {
  const { nextIssue } = journal
  const issue = nextIssue.label.split(' — ')[0]
  return (
    <div className="bg-night-900 text-[12px] text-night-100 sm:text-[13px]">
      <div className="mx-auto flex h-9 max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6">
        <p className="flex shrink-0 items-center gap-3 whitespace-nowrap">
          <span>ISSN {journal.issnOnline}</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 sm:block" />
          <span className="hidden sm:inline">DOI {journal.doiPrefix}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-ember-500 px-2.5 py-0.5 font-jakarta text-[11px] font-bold text-night-900"><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" /> Open Access</span>
          <span className="hidden md:inline">{journal.licence.name}</span>
        </p>
        <AppLink to={paths.submit} className="hidden min-w-0 truncate rounded-full bg-white/10 px-3 py-0.5 text-night-50 hover:bg-white/20 lg:block">
          Call for Papers: {issue}. Submissions open until {formatDate(nextIssue.deadline.slice(0, 10))}
        </AppLink>
        <AppLink to={paths.track} className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-white hover:underline"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
      </div>
    </div>
  )
}
