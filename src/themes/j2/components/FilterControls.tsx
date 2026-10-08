// Filter building blocks shared by the issue and search pages: checkbox groups, a mobile drawer and a small sort select.
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { cx } from './primitives'
import { Close } from '../icons'

export interface FilterOption { value: string; label: string; count: number; color?: string }

export function CheckGroup({ legend, options, selected, onToggle }: { legend: string; options: FilterOption[]; selected: string[]; onToggle: (v: string) => void }) {
  if (options.length === 0) return null
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-display text-sm font-semibold text-graphite-800">{legend}</legend>
      <ul className="space-y-1">
        {options.map((o) => {
          const on = selected.includes(o.value)
          return (
            <li key={o.value}>
              <label className={cx('flex cursor-pointer items-start gap-2.5 rounded-chip px-2 py-1.5 text-sm hover:bg-graphite-50', on && 'bg-accent-50')}>
                <input type="checkbox" checked={on} onChange={() => onToggle(o.value)} className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border-graphite-400 text-accent-700 focus:ring-accent-700" />
                {o.color && <span aria-hidden="true" className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: o.color }} />}
                <span className="min-w-0 flex-1 text-graphite-700">{o.label}</span>
                <span className="text-xs tabular-nums text-graphite-600" aria-label={`${o.count} articles`}>{o.count}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}

export function SortSelect<T extends string>({ value, onChange, options, label = 'Sort by' }: { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label?: string }) {
  const id = useId()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium text-graphite-700">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as T)} className="rounded-soft border border-graphite-300 bg-white py-1.5 pl-3 pr-8 text-sm text-graphite-800 focus:border-accent-700">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

/** Slide-in drawer used for filters on small screens. Closes on Escape and on backdrop click, and returns focus to the opener. */
export function FilterDrawer({ open, onClose, title, children, footer }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode }) {
  const panel = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    panel.current?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; prev?.focus() }
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      <div className="absolute inset-0 bg-graphite-900/50 motion-safe:animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div ref={panel} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className="absolute inset-y-0 left-0 flex w-[88%] max-w-sm flex-col bg-white shadow-drawer focus:outline-none motion-safe:animate-fade-in">
        <div className="flex items-center justify-between border-b border-graphite-200 px-4 py-3">
          <p className="font-display text-lg font-semibold text-graphite-800">{title}</p>
          <button type="button" onClick={onClose} aria-label="Close filters" className="rounded-chip p-1.5 text-graphite-600 hover:bg-graphite-100"><Close className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-4">{children}</div>
        {footer && <div className="border-t border-graphite-200 p-4">{footer}</div>}
      </div>
    </div>
  )
}

export const toggleIn = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])
export function countBy<T>(items: T[], key: (t: T) => string) {
  const m = new Map<string, number>()
  items.forEach((i) => m.set(key(i), (m.get(key(i)) ?? 0) + 1))
  return m
}
