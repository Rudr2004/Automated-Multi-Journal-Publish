import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { paths } from '../../../config/routes'
import { btnClass } from './Button'
import { AppLink } from '../../../core/router'
import { TrackForm } from './TrackForm'
import { Search } from './uiIcons'

/** "Track My Paper" button that opens a quick-track popover (Paper ID + email) instead of leaving the page. */
export function QuickTrack({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    first.current?.focus()
    const onDown = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); wrap.current?.querySelector('button')?.focus() } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={wrap} className={`relative ${className}`}>
      <button type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(!open)} className={btnClass('outline', 'md', '!border-line !text-navy hover:!bg-mist')}>
        <Search className="h-5 w-5" aria-hidden />Track Status
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="dialog" aria-label="Quick track" initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded border border-line bg-white p-4 shadow-xl">
            <p className="font-serif text-lg font-semibold text-navy">Track your paper</p>
            <p className="mt-0.5 text-xs text-ink-muted">No login needed. Use the Paper ID from your confirmation.</p>
            <div className="mt-3"><TrackForm idPrefix="qt" firstRef={first} onDone={() => setOpen(false)} /></div>
            <AppLink to={paths.track} onClick={() => setOpen(false)} className="mt-3 inline-block text-xs font-semibold text-scholar hover:underline">Open the full tracking page →</AppLink>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
