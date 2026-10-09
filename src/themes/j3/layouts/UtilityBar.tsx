// Utility strip: dark navy band with the Open Access (CC BY 4.0) badge and identifiers on the left, Submit Manuscript and Author Guidelines on the right.
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { OpenAccess } from '../icons'

export function UtilityBar() {
  return (
    <div className="bg-night-900 text-[12px] text-night-200">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-1.5 sm:px-6 lg:px-10">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {journal.badges.openAccess && (
            <span className="inline-flex items-center gap-1 bg-j3valid-800 px-2 py-0.5 font-inter text-[11px] font-semibold uppercase tracking-wider text-white"><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" /> Open Access ({journal.licence.name})</span>
          )}
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/25 sm:block" />
          <span className="font-inter tracking-wide">E-ISSN: {journal.issnOnline}</span>
          <span aria-hidden="true" className="hidden h-3 w-px bg-white/25 md:block" />
          <span className="hidden font-inter tracking-wide md:inline">DOI prefix: {journal.doiPrefix}</span>
        </p>
        <p className="flex items-center gap-4">
          <AppLink to={paths.submit} className="bg-ember-700 px-3 py-1 font-inter text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-ember-500 hover:text-night-900">Submit Manuscript</AppLink>
          <AppLink to={paths.policy('author-guidelines')} className="font-inter text-[13px] text-iris-200 transition-colors hover:text-white hover:underline">Author Guidelines</AppLink>
          <AppLink to={paths.track} className="hidden font-inter text-[13px] text-iris-200 transition-colors hover:text-white hover:underline sm:inline">Track My Paper</AppLink>
        </p>
      </div>
    </div>
  )
}
