import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { nav } from '../../../config/navigation'
import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { AppLink } from '../../../core/router'
import { ChevronDown, Explore, FilePlus2, X } from '../components/uiIcons'
import { Brand } from './Header'

/** Slide-in mobile menu: overlay, focus trap, Esc to close, accordion sections. */
export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const [expanded, setExpanded] = useState<string | null>(null)
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab' || !panel.current) return
      const f = panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,select,[tabindex]:not([tabindex="-1"])')
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus() }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <motion.div aria-hidden className="absolute inset-0 bg-navy-900/60" onClick={onClose}
            initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.2 }} />
          <motion.div ref={panel} id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" tabIndex={-1}
            initial={reduce ? false : { x: '100%' }} animate={{ x: 0 }} exit={reduce ? undefined : { x: '100%' }} transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute inset-y-0 right-0 flex w-[min(24rem,92vw)] flex-col overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-line p-4">
              <Brand compact light />
              <button type="button" onClick={onClose} aria-label="Close menu" className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-line text-navy"><X className="h-5 w-5" aria-hidden /></button>
            </div>
            <nav aria-label="Mobile" className="flex-1">
              <ul className="divide-y divide-line">
                {nav.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <>
                        <button type="button" aria-expanded={expanded === item.label} onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                          className="flex w-full items-center justify-between px-4 py-3.5 text-left font-semibold text-navy">
                          {item.label}<ChevronDown className={`h-5 w-5 transition-transform ${expanded === item.label ? 'rotate-180' : ''}`} aria-hidden />
                        </button>
                        {expanded === item.label && (
                          <ul className="bg-paper py-1">
                            {item.children.map((c) => <li key={c.to + c.label}><AppLink to={c.to} onClick={onClose} className="block px-7 py-2.5 text-sm text-ink hover:text-scholar">{c.label}</AppLink></li>)}
                          </ul>
                        )}
                      </>
                    ) : (
                      <AppLink to={item.to} onClick={onClose} className="block px-4 py-3.5 font-semibold text-navy">{item.label}</AppLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="space-y-2.5 border-t border-line p-4">
              <ButtonLink to={paths.track} variant="outline" className="w-full"><Explore className="h-4 w-4" aria-hidden />Track Status</ButtonLink>
              <ButtonLink to={paths.submit} variant="submit" className="w-full"><FilePlus2 className="h-4 w-4" aria-hidden />Submit Manuscript</ButtonLink>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
