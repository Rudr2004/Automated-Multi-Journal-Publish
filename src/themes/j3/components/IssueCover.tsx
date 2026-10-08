// Generated issue cover: seeded artwork with the IJCSD wordmark and the volume and issue on a solid band, so text always reads clearly.
import { journal } from '../../../config/journals'
import { Artwork } from './Artwork'
import { cx } from './primitives'

export function IssueCover({ volume, issue, large, className }: { volume: number; issue: number; large?: boolean; className?: string }) {
  return (
    <div className={cx('relative flex aspect-[3/4] flex-col overflow-hidden rounded-block bg-night-900 shadow-lift3', className)}>
      <div className="relative min-h-0 flex-1">
        <Artwork seed={`issue-${volume}-${issue}`} className="absolute inset-0 h-full w-full" />
      </div>
      <div className={cx('bg-night-900 text-white', large ? 'px-6 py-5' : 'px-3.5 py-3')}>
        <p className={cx('font-jakarta font-extrabold leading-none tracking-tight', large ? 'text-[1.875rem]' : 'text-[1.375rem]')}>{journal.shortName}</p>
        <p className={cx('mt-1.5 font-jakarta font-bold text-ember-400', large ? 'text-base' : 'text-[13px]')}>Vol. {volume} · No. {issue}</p>
      </div>
    </div>
  )
}
