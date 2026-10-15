// Utility strip after the reference: a Plum Ink band with ruled identifier chips on the left (Crossref DOI prefix, peer review, open access)
// and the quick links on the right (Track paper status, Author guidelines, Submit Manuscript in the restricted orange).
import { MdOutlineAutoStories, MdOutlineTrackChanges } from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { onDark } from '../components/primitives'
import { OpenAccess, Verified } from '../icons'

const chip = 'inline-flex items-center gap-1.5 rounded-tile border border-white/30 px-2.5 py-1 font-inter text-[11px] font-semibold tracking-wide text-white'
const quick = 'font-inter text-xs font-medium text-iris-100 transition-colors hover:text-white hover:underline'

export function UtilityBar() {
  return (
    <div className={`bg-night-900 ${onDark}`}>
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2 sm:px-6 lg:px-10">
        <p className="flex flex-wrap items-center gap-2">
          <span className={`${chip} tabular-nums`}>Crossref DOI: {journal.doiPrefix}</span>
          {journal.badges.peerReviewed && <span className={`${chip} hidden sm:inline-flex`}><Verified className="h-3.5 w-3.5" aria-hidden="true" /> Peer-reviewed</span>}
          {journal.badges.openAccess && <span className={`${chip} hidden md:inline-flex`}><OpenAccess className="h-3.5 w-3.5 text-ember-400" aria-hidden="true" /> Open access ({journal.licence.name})</span>}
        </p>
        <p className="flex items-center gap-4">
          <AppLink to={paths.pastIssues} className="hidden items-center gap-1.5 rounded-tile border border-white/30 bg-night-800 px-2.5 py-1 font-jakarta text-xs font-bold text-white transition-colors hover:bg-mauve-700 sm:inline-flex"><MdOutlineAutoStories className="h-3.5 w-3.5 text-ember-500" aria-hidden="true" />Journal Xplore</AppLink>
          <AppLink to={paths.policy('author-guidelines')} className={`${quick} hidden md:inline`}>Author Guidelines</AppLink>
          <AppLink to={paths.reviewerLogin} className={quick}>Reviewer Login</AppLink>
          <AppLink to={paths.track} className="inline-flex items-center gap-1.5 rounded-tile border border-white/60 bg-iris-700 px-3 py-1 font-jakarta text-xs font-bold text-white shadow-sm transition-colors hover:bg-iris-800"><MdOutlineTrackChanges className="h-3.5 w-3.5" aria-hidden="true" />Track Paper Status</AppLink>
          <AppLink to={paths.forAuthors('templates')} className="inline-flex items-center gap-1.5 rounded-tile bg-ember-500 px-3 py-1.5 font-jakarta text-xs font-bold text-night-900 transition-colors hover:bg-ember-400"><MdOutlineAutoStories className="h-3.5 w-3.5" aria-hidden="true" />Author Resources/Blog</AppLink>
        </p>
      </div>
    </div>
  )
}
