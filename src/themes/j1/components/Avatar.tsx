import { useState } from 'react'

const SIZES = {
  xs: { box: 'h-7 w-7 text-[10px]', px: 28 },
  sm: { box: 'h-10 w-10 text-sm', px: 40 },
  md: { box: 'h-16 w-16 text-xl', px: 64 },
  lg: { box: 'h-24 w-24 text-3xl', px: 96 },
} as const

/** Portrait with a graceful fallback: if the photo is missing or fails to load, show a flat serif-initials circle. */
export function Avatar({ name, photo, size = 'md' }: { name: string; photo?: string; size?: keyof typeof SIZES }) {
  const [failed, setFailed] = useState(false)
  const { box, px } = SIZES[size]
  const initials = name.replace(/^(Prof|Dr)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('')
  const base = `flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-line ${box}`

  if (photo && !failed) {
    return <img src={photo} alt={`Portrait of ${name}`} loading="lazy" width={px} height={px} onError={() => setFailed(true)} className={`${base} bg-paper object-cover`} />
  }
  return (
    <span role="img" aria-label={`Portrait placeholder for ${name}`} className={`${base} bg-navy-50 font-serif font-bold text-navy`}>
      {initials}
    </span>
  )
}
