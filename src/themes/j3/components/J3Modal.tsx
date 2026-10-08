// Accessible modal for Journal 3: role=dialog, focus moves in and is trapped, Esc and backdrop close it, focus returns to the trigger.
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Close } from '../icons'
import { cx } from './primitives'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([type="hidden"]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

export function J3Modal({ open, onClose, title, size = 'md', children }: { open: boolean; onClose: () => void; title: string; size?: 'md' | 'lg' | 'xl'; children: ReactNode }) {
  const titleId = useId()
  const panel = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE)
    const target = first ?? panel.current
    target?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); onCloseRef.current(); return }
      if (e.key !== 'Tab' || !panel.current) return
      const items = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null || el === document.activeElement)
      if (!items.length) { e.preventDefault(); return }
      const a = items[0], z = items[items.length - 1]
      if (e.shiftKey && (document.activeElement === a || document.activeElement === panel.current)) { e.preventDefault(); z.focus() }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus() }
    }
    document.addEventListener('keydown', onKey, true)
    return () => {
      document.removeEventListener('keydown', onKey, true)
      document.body.style.overflow = prevOverflow
      opener?.focus?.()
    }
  }, [open])

  if (!open) return null
  const width = { md: 'sm:max-w-md', lg: 'sm:max-w-xl', xl: 'sm:max-w-4xl' }[size]
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-night-900/70 motion-safe:animate-fade-in" />
      <div ref={panel} role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1}
        className={cx('relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-sheet bg-white shadow-dock motion-safe:animate-slide-down sm:rounded-sheet', width)}>
        <div className="flex items-center justify-between gap-3 border-b border-iris-100 px-6 py-4">
          <h2 id={titleId} className="font-jakarta text-xl font-extrabold text-night-900">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="rounded-full p-2 text-mauve-700 hover:bg-iris-50"><Close className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}
