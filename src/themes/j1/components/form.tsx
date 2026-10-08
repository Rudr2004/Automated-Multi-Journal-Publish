import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'

export const inputClass = (error?: string) =>
  `w-full rounded border px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted/70 outline-none transition-colors focus:bg-white focus:ring-2 ${
    error ? 'border-danger bg-red-50 focus:border-danger focus:ring-danger/20' : 'border-line bg-mist focus:border-navy focus:ring-navy/20'}`

/**
 * Labelled form field. Injects id / name / aria-invalid / aria-describedby into its single child control.
 * `name` is also the key used for validation errors, so the form can track which fields were touched.
 */
export function Field({ label, name, error, hint, required, counter, children, className = '' }: {
  label: string; name?: string; error?: string; hint?: string; required?: boolean
  /** Optional right-aligned counter text, e.g. "120 / 250". */
  counter?: string
  children: ReactElement<Record<string, unknown>>; className?: string
}) {
  const id = useId()
  const describedBy = [error ? `${id}-err` : '', hint ? `${id}-hint` : ''].filter(Boolean).join(' ') || undefined
  const control = isValidElement(children)
    ? cloneElement(children, { id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, 'aria-required': required || undefined })
    : children
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="block text-sm font-medium text-ink">
          {label}{required && <span className="text-danger" aria-hidden> *</span>}
        </label>
        {counter && <span className="text-xs tabular-nums text-ink-muted" aria-hidden>{counter}</span>}
      </div>
      {control}
      {hint && !error && <p id={`${id}-hint`} className="mt-1 text-xs text-ink-muted">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}

export function Checkbox({ name, checked, onChange, error, children }: { name?: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode }) {
  const id = useId()
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined} className="mt-0.5 h-4 w-4 shrink-0 rounded border-line accent-navy" />
        <label htmlFor={id} className="text-sm text-ink">{children}</label>
      </div>
      {error && <p role="alert" className="mt-1 pl-7 text-xs font-medium text-danger">{error}</p>}
    </div>
  )
}
