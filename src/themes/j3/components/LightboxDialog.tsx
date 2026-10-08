// Accessible modal dialog: focus moves in, Tab is trapped, Esc and the backdrop close it, and focus returns to the trigger.
import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Close } from '../icons'

const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'

export function LightboxDialog({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  const close = useRef(onClose)
  close.current = onClose

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close.current(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      if (!items.length) return
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus() }
  }, [open])

  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-night-900/80 p-3 sm:p-8 motion-safe:animate-fade-in" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={panel} role="dialog" aria-modal="true" aria-label={label} className="relative max-h-full w-full max-w-4xl overflow-auto rounded-sheet bg-white p-5 shadow-dock sm:p-8">
        <button type="button" data-autofocus onClick={onClose} aria-label="Close" className="absolute right-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-full bg-iris-50 text-night-900 hover:bg-iris-100">
          <Close className="h-6 w-6" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  )
}
