// Generated issue cover after the reference: a solid archival-navy cover with the IJCSD wordmark, the volume and issue, an amber rule and the journal name. Sharp corners, no artwork.
import { journal } from '../../../config/journals'
import { cx } from './primitives'
import { Book } from '../icons'

export function IssueCover({ volume, issue, large, className }: { volume: number; issue: number; large?: boolean; className?: string }) {
  return (
    <div className={cx('relative flex aspect-[3/4] flex-col justify-between overflow-hidden bg-iris-700 text-white shadow-lift3', large ? 'p-6' : 'p-3.5', className)}>
      <div>
        <p className={cx('font-inter font-semibold uppercase tracking-[0.18em] text-iris-100', large ? 'text-base' : 'text-xs')}>{journal.shortName}</p>
        <p className={cx('mt-1 font-inter text-iris-200', large ? 'text-sm' : 'text-[11px]')}>Vol. {volume} · No. {issue}</p>
      </div>
      <div className="py-2">
        <div className={cx('mb-2 bg-ember-500', large ? 'h-1.5 w-12' : 'h-1 w-8')} />
        <p className={cx('font-jakarta font-semibold leading-tight', large ? 'text-[1.375rem]' : 'text-[13px]')}>{journal.name}</p>
      </div>
      <div className={cx('flex items-end justify-between font-inter text-iris-200', large ? 'text-xs' : 'text-[10px]')}>
        <span>E-ISSN {journal.issnOnline}</span>
        <Book className={large ? 'h-6 w-6' : 'h-4 w-4'} aria-hidden="true" />
      </div>
    </div>
  )
}
