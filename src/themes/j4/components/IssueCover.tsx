// A CSS-drawn cover for an issue (reference: cover showcase card): navy gradient, round logo emblem, journal name, issue and month, a focus line and ISSN / licence.
// Used by the issue header and the archive showcase.
import { journal } from '../../../config/journals'
import { formatMonthYear } from '../../../core/lib/format'
import type { IssueSummary } from '../../../core/types'
import { cx } from './primitives'

export function IssueCover({ issue, className }: { issue: IssueSummary; className?: string }) {
  return (
    <div role="img" aria-label={`Cover of ${journal.shortName}, Volume ${issue.volume}, Issue ${issue.issue}, ${formatMonthYear(issue.month)}`}
      className={cx('relative flex w-48 flex-col justify-between overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-br from-[#0b2545] via-[#0f3460] to-[#071527] p-3 text-white shadow-lg sm:w-52', className)}>
      <div aria-hidden="true" className="mb-2 flex items-center justify-between border-b border-sky-300/30 pb-2 font-mono text-[9px] uppercase tracking-wider">
        <span className="font-semibold text-sky-300">{journal.shortName} Press</span><span className="font-bold text-amber-300">Vol. {issue.volume} / Iss. {issue.issue}</span>
      </div>
      <div aria-hidden="true" className="my-2 flex flex-col items-center space-y-2 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white p-1">
          <img src="/journals/j4/logo.png" alt="" className="h-full w-full rounded-full object-contain" />
        </span>
        <span className="mt-1 font-serif4 text-[11px] font-bold leading-tight text-white">{journal.name}</span>
        <span className="text-[9px] tracking-wide text-sky-200">{formatMonthYear(issue.month)} Regular Issue</span>
      </div>
      <div aria-hidden="true" className="mt-2 border-t border-sky-300/30 pt-2 text-center">
        <span className="block font-mono text-[8px] uppercase tracking-wider text-amber-300">Journal Focus</span>
        <p className="mt-0.5 font-serif4 text-[9px] italic leading-tight text-white/90">{journal.tagline}</p>
        <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-1.5 font-mono text-[8px] text-slate-300">
          <span>ISSN: {journal.issnOnline}</span><span>{journal.licence.name}</span>
        </div>
      </div>
    </div>
  )
}
