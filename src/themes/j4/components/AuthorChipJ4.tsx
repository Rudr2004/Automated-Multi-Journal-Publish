// Round author portrait (placeholder portraits from the mock-data helper) with an initials fallback, plus a chip that adds the name.
// Reusable by any Journal 4 page.
import { useState } from 'react'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { cx } from './primitives'

export const initialsOfJ4 = (name: string) => name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export function AuthorAvatarJ4({ name, photo, className = 'h-7 w-7 text-[10px]' }: { name: string; photo?: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const src = photo ?? portraitFor(name)
  return src && !failed
    ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className={cx('shrink-0 rounded-full bg-abyss-100 object-cover ring-2 ring-white', className)} />
    : <span aria-hidden="true" className={cx('inline-flex shrink-0 items-center justify-center rounded-full bg-azure-100 font-semibold text-azure-900 ring-2 ring-white', className)}>{initialsOfJ4(name)}</span>
}

export function AuthorChipJ4({ name, photo, className }: { name: string; photo?: string; className?: string }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 text-sm text-steel-700', className)}>
      <AuthorAvatarJ4 name={name} photo={photo} />
      <span>{name}</span>
    </span>
  )
}

/** Up to `max` authors as chips, then "+N more". */
export function AuthorChipsJ4({ names, max = 3, className }: { names: string[]; max?: number; className?: string }) {
  return (
    <p className={cx('flex flex-wrap items-center gap-x-4 gap-y-1.5', className)}>
      {names.slice(0, max).map((n) => <AuthorChipJ4 key={n} name={n} />)}
      {names.length > max && <span className="text-xs font-medium text-steel-600">+{names.length - max} more</span>}
    </p>
  )
}
