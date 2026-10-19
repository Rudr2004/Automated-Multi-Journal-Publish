// "Double-blind peer reviewed" label for the editorial tag row of an article. Hovering, focusing or tapping it shows a short explanation.
import { useId, useState } from 'react'
import { MdOutlineShield } from 'react-icons/md'

export const DOUBLE_BLIND_TIP = 'The identities of both authors and reviewers remain anonymous throughout the peer-review process.'

export function DoubleBlindBadge({ className = '' }: { className?: string }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  return (
    <span className={`relative inline-flex ${className}`} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button type="button" aria-describedby={id} aria-expanded={open} onClick={() => setOpen((v) => !v)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}
        onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
        className="inline-flex items-center gap-1 rounded-tile border border-j3valid-700/40 bg-j3valid-50 px-2.5 py-1 font-jakarta text-[10px] font-bold uppercase tracking-[0.08em] text-j3valid-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-iris-700">
        <MdOutlineShield className="h-3.5 w-3.5" aria-hidden="true" />Double-blind peer reviewed
      </button>
      <span id={id} role="tooltip" className={`absolute left-0 top-full z-30 mt-2 w-64 max-w-[80vw] rounded-tile border border-night-900 bg-night-900 px-3 py-2 font-inter text-xs font-normal normal-case leading-snug tracking-normal text-white shadow-lg sm:w-72 ${open ? 'block' : 'hidden'}`}>
        {DOUBLE_BLIND_TIP}
      </span>
    </span>
  )
}
