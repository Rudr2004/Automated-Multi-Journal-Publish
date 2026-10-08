// Journal identity: the logo in a small tile, the full journal name with its short code, and a row of facts underneath.
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'
import { Verified } from '../icons'

/** Short facts shown under the journal name. Each one only appears when the journal config says it is true. */
const facts = () => [
  journal.badges.peerReviewed && 'Peer-Reviewed',
  journal.badges.openAccess && 'Open Access Refereed Journal',
  'Multidisciplinary',
  journal.frequency,
].filter(Boolean) as string[]

/** The full badge, shown as supplied (it has its own frame), so no extra box is drawn around it. */
export function LogoTile({ className }: { className?: string }) {
  return <img src="/journals/j2/logo-badge.png" alt="" width={65} height={84} className={cx('w-auto shrink-0 select-none', className)} />
}

export function BrandBlock() {
  return (
    <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 items-center gap-4">
      <LogoTile className="h-[88px]" />
      <span className="min-w-0">
        <span className="block font-display text-[1.1875rem] font-semibold leading-snug tracking-tight text-brand-900 xl:text-[1.1875rem] 2xl:text-[1.375rem]">{journal.name}</span>
        <span className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-graphite-600">
          {facts().map((f, i) => (
            <span key={f} className="inline-flex items-center gap-3">
              {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-graphite-400" />}
              {f}
            </span>
          ))}
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-graphite-400" />
          <span className="inline-flex items-center gap-1 text-accent-700"><Verified className="h-4 w-4" aria-hidden="true" /> ISSN {journal.issnOnline}</span>
        </span>
      </span>
    </AppLink>
  )
}
