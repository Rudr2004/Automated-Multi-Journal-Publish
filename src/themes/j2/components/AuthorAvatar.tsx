// Round author portrait (placeholder portraits from the mock-data helper) with an initials fallback.
import { useState } from 'react'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { cx } from './primitives'

export const initialsOf = (name: string) => name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export function AuthorAvatar({ name, photo, className = 'h-7 w-7 text-[10px]' }: { name: string; photo?: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  const src = photo ?? portraitFor(name)
  return src && !failed
    ? <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} className={cx('shrink-0 rounded-full bg-graphite-100 object-cover ring-2 ring-white', className)} />
    : <span aria-hidden="true" className={cx('inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-800 ring-2 ring-white', className)}>{initialsOf(name)}</span>
}
