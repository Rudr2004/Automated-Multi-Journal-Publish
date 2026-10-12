// Generated issue cover after the reference book cover: a Plum Ink cover with an inset hairline frame, the journal emblem (shown whole), the volume and issue and the journal name.
// 2px corners, no shadow, no photograph; the orange is a single small square marker.
import { journal } from '../../../config/journals'
import { cx } from './primitives'

export function IssueCover({ volume, issue, large, className }: { volume: number; issue: number; large?: boolean; className?: string }) {
  return (
    <div className={cx('relative aspect-[3/4] overflow-hidden rounded-block bg-night-900 text-white', large ? 'p-3' : 'p-2', className)}>
      <div className={cx('flex h-full flex-col items-center justify-between border border-white/25 text-center', large ? 'px-4 py-5' : 'px-2 py-3')}>
        <div>
          <p className={cx('font-jakarta font-bold uppercase tracking-[0.2em] text-iris-100', large ? 'text-sm' : 'text-[10px]')}>{journal.shortName}</p>
          <p className={cx('mt-1 font-inter tabular-nums text-iris-200', large ? 'text-xs' : 'text-[10px]')}>Vol. {volume} · No. {issue}</p>
        </div>
        <div className={cx('bg-white p-1', large ? 'w-[44%]' : 'w-[46%]')}>
          <img src="/journals/j3/logo.png" alt="" aria-hidden="true" className="block h-auto w-full" />
        </div>
        <div>
          <span className={cx('mx-auto mb-2 block bg-ember-500', large ? 'h-2 w-2' : 'h-1.5 w-1.5')} aria-hidden="true" />
          <p className={cx('font-jakarta font-bold leading-tight', large ? 'text-[1.0625rem]' : 'text-[10px]')}>{journal.name}</p>
          <p className={cx('mt-1.5 font-inter tabular-nums text-iris-200', large ? 'text-[11px]' : 'text-[9px]')}>E-ISSN {journal.issnOnline}</p>
        </div>
      </div>
    </div>
  )
}
