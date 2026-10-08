// Form building blocks for the Journal 2 submit, track and verify pages (labels, hints, errors and ARIA wiring).
import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { ErrorIcon } from '../icons'
import { cx } from './primitives'

export const inputCls = (error?: string) =>
  cx(
    'w-full rounded-soft border bg-white px-3.5 py-2.5 text-sm text-graphite-800 placeholder:text-graphite-500 transition-colors',
    'focus:border-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-700/30',
    error ? 'border-red-700 bg-red-50/40' : 'border-graphite-300 hover:border-graphite-400',
  )

/**
 * Labelled field. Injects id, name, aria-invalid and aria-describedby into its single child control.
 * `name` doubles as the validation key, so focusFirstError can find the control.
 */
export function Field({ label, name, error, hint, required, counter, children, className }: {
  label: string; name?: string; error?: string; hint?: ReactNode; required?: boolean; counter?: string
  children: ReactElement<Record<string, unknown>>; className?: string
}) {
  const id = useId()
  const ids = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined
  const control = isValidElement(children)
    ? cloneElement(children, { id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': ids, 'aria-required': required || undefined })
    : children
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-graphite-800">
          {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}
          {!required && <span className="font-normal text-graphite-600"> (optional)</span>}
        </label>
        {counter && <span className="text-xs tabular-nums text-graphite-600" aria-hidden="true">{counter}</span>}
      </div>
      {control}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-graphite-600">{hint}</p>}
      {error && <p id={`${id}-err`} className="mt-1 flex items-start gap-1 text-xs font-medium text-red-700"><ErrorIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span>{error}</span></p>}
    </div>
  )
}

/** Checkbox with a label and an inline error message. */
export function CheckField({ name, checked, onChange, error, children }: {
  name: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode
}) {
  const id = useId()
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-err` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded-chip border-graphite-400 accent-accent-700" />
        <label htmlFor={id} className="text-sm leading-relaxed text-graphite-700">{children}</label>
      </div>
      {error && <p id={`${id}-err`} className="mt-1 flex items-start gap-1 pl-8 text-xs font-medium text-red-700"><ErrorIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span>{error}</span></p>}
    </div>
  )
}
