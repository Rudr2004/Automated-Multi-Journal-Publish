import { User } from './uiIcons'
import { useState } from 'react'

const SIZES = {
  sm: { box: 'h-10 w-10 text-sm', px: 40 },
  md: { box: 'h-16 w-16 text-lg', px: 64 },
  lg: { box: 'h-24 w-24 text-2xl', px: 96 },
} as const

/** Portrait with a graceful fallback: if the photo is missing or fails to load, show a neutral initials avatar. */
export function Avatar({ name, photo, size = 'md' }: { name: string; photo?: string; size?: keyof typeof SIZES }) {
  const [failed, setFailed] = useState(false)
  const { box, px } = SIZES[size]
  const initials = name.replace(/^(Prof|Dr)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('')
  const base = `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-white shadow-md ${box}`

  if (photo && !failed) {
    return <img src={photo} alt={`Portrait of ${name}`} loading="lazy" width={px} height={px} onError={() => setFailed(true)} className={`${base} bg-mist-200 object-cover`} />
  }
  return (
    <span role="img" aria-label={`Portrait placeholder for ${name}`} className={`${base} bg-gradient-to-br from-navy-100 to-navy-200 font-serif font-semibold text-navy`}>
      <User aria-hidden className="absolute -bottom-2 h-3/4 w-3/4 text-white/60" strokeWidth={1.2} />
      <span className="relative">{initials}</span>
    </span>
  )
}
