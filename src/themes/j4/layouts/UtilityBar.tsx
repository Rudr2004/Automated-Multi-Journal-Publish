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
    <div className="border-b border-white/10 bg-abyss-900 text-[12px] text-abyss-300 sm:text-[13px]">
      <div className="mx-auto flex h-9 max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <p className="flex shrink-0 items-center gap-3 whitespace-nowrap tabular-nums">
          <span>ISSN {journal.issnOnline}</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/20 sm:block" />
          <span className="hidden sm:inline">DOI {journal.doiPrefix}</span>
          <span className="inline-flex items-center gap-1 rounded-ctl border border-azure-400/40 bg-azure-400/10 px-2 py-0.5 font-semibold text-azure-300"><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" /> Open Access</span>
          <span className="hidden md:inline">{journal.licence.name}</span>
        </p>
        <AppLink to={paths.submit} className="hidden min-w-0 truncate rounded-ctl bg-white/10 px-3 py-0.5 text-abyss-100 hover:bg-white/15 lg:block">
          Call for Papers: {issue}. Submissions open until {formatDate(nextIssue.deadline.slice(0, 10))}
        </AppLink>
        <AppLink to={paths.track} className="inline-flex shrink-0 items-center gap-1.5 font-semibold text-white hover:underline"><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
      </div>
    </div>
  )
}
