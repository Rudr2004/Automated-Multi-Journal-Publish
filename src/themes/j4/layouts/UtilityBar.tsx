// Utility bar: the sliding announcement bar, then a slim deep-navy strip with the journal's standing facts (left) and quick links (right), as in the reference.
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { AnnouncementTickerJ4 } from '../components/AnnouncementTickerJ4'
import { Arrow, AutoStories, ManageSearch } from '../components/refIconsJ4'

export function UtilityBar() {
  const kind = [journal.badges.peerReviewed && 'Peer-Reviewed', journal.badges.openAccess && 'Open Access'].filter(Boolean).join(' ')
  const sep = <span aria-hidden="true" className="hidden text-slate-600 md:inline">|</span>
  return (
    <>
      <AnnouncementTickerJ4 />
      <div className="w-full border-b border-slate-800 bg-[#071527] px-4 py-1.5 text-xs text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {kind && <span className="hidden sm:inline">International {kind} Journal</span>}
            {kind && <span aria-hidden="true" className="hidden text-slate-600 sm:inline">|</span>}
            <span className="font-mono font-semibold tabular-nums text-amber-300">ISSN: {journal.issnOnline} (Online)</span>
            {sep}
            <span className="hidden items-center gap-1.5 text-sky-300 md:inline-flex"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Frequency: {journal.frequency}</span>
          </div>
          <div className="flex items-center gap-5">
            <AppLink to={paths.track} className="inline-flex items-center gap-1.5 transition-colors hover:text-white"><ManageSearch className="h-4 w-4 text-sky-400" aria-hidden="true" />Track Manuscript</AppLink>
            <span aria-hidden="true" className="text-slate-600">|</span>
            <AppLink to={paths.policy('author-guidelines')} className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-full border border-amber-300/40 bg-gradient-to-r from-amber-700 via-sky-700 to-emerald-700 px-3 py-0.5 text-[11px] font-medium tracking-wide text-white shadow-sm transition-all duration-300 hover:scale-105 sm:text-xs">
              <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300 motion-safe:animate-pulse" />
              <AutoStories className="h-4 w-4 text-amber-200 transition-transform group-hover:rotate-12" aria-hidden="true" />
              <span className="whitespace-nowrap">Learning Resources</span>
              <Arrow className="h-3.5 w-3.5 text-sky-200 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </AppLink>
          </div>
        </div>
      </div>
    </>
  )
}
