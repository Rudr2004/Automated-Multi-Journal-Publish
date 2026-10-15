// Journal identity: the logo on a white tile, the "Emerald Scholar" and Peer-Reviewed tags, the full journal name with its short code
// and a one-line descriptor underneath. The logo is always shown whole on a white tile (never cropped).
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

/** The client's round emblem (transparent PNG) on a white tile so it stays legible on any background. */
export function LogoTile({ className }: { className?: string }) {
  return (
    <span className={cx('inline-flex shrink-0 items-center justify-center rounded-panel border border-brand-200 bg-white p-1 shadow-card', className)}>
      <img src="/journals/j2/logo.png" alt="" width={512} height={512} className="h-full w-full select-none object-contain" />
    </span>
  )
}

export function BrandBlock() {
  return (
    <AppLink to={paths.home} aria-label={`${journal.shortName}: ${journal.name}, home`} className="flex min-w-0 items-center gap-4">
      <LogoTile className="h-24 w-[4.75rem] shrink-0" />
      <span className="min-w-0">
        <span className="block font-display text-xl font-bold leading-snug tracking-tight text-graphite-900 xl:whitespace-nowrap xl:text-[clamp(1rem,1.2vw,1.5rem)]">
          {journal.name}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 text-sm font-medium text-graphite-600">
          {journal.badges.peerReviewed && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-800"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-600" />Peer-Reviewed</span>
          )}
          <span>· {journal.descriptor.replace(/^peer-reviewed\s*·\s*/i, '')}</span>
        </span>
        <span className="mt-1.5 flex flex-wrap items-center gap-2 text-sm font-bold text-graphite-900">
          <span className="rounded-sm bg-[#FBD28D] px-2 py-0.5">ISSN: {journal.issnOnline}</span>
          {journal.sjifImpactFactor && <span className="rounded-sm bg-[#FBD28D] px-2 py-0.5">SJIF Impact Factor: {journal.sjifImpactFactor}</span>}
        </span>
      </span>
    </AppLink>
  )
}
