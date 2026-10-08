// Field markup for the Journal 4 static-page forms (contact and reviewer application). Self-contained on purpose.
import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { cx } from '../primitives'

export const inputClass = (error?: string) => cx(
  'block min-h-[44px] w-full rounded-ctl border bg-white px-3.5 py-2.5 text-base text-abyss-900 placeholder:text-steel-500 shadow-hair transition-colors',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-1',
  error ? 'border-red-700' : 'border-abyss-300 hover:border-steel-500 focus:border-azure-600',
)

/** Label, control, hint and error. The control receives id, name, aria-describedby and aria-invalid. */
export function Field({ label, name, required, error, hint, counter, children }: {
  label: string; name: string; required?: boolean; error?: string; hint?: string; counter?: string; children: ReactElement<Record<string, unknown>>
}) {
  const id = useId()
  const desc = [hint && `${id}-h`, error && `${id}-e`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-abyss-900">
        {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}{required && <span className="sr-only"> (required)</span>}
      </label>
      {isValidElement(children) && cloneElement(children, { id, name, 'aria-describedby': desc, 'aria-invalid': error ? true : undefined, 'aria-required': required || undefined })}
      <div className="mt-1.5 flex justify-between gap-3 text-xs">
        <div className="min-w-0">
          {hint && <p id={`${id}-h`} className={error ? 'sr-only' : 'text-steel-600'}>{hint}</p>}
          {error && <p id={`${id}-e`} className="font-semibold text-red-700">{error}</p>}
        </div>
        {counter && <p className="shrink-0 tabular-nums text-steel-600" aria-hidden="true">{counter}</p>}
      </div>
    </div>
  )
}

export function CheckField({ name, checked, error, onChange, children }: { name: string; checked: boolean; error?: string; onChange: (c: boolean) => void; children: ReactNode }) {
  const id = useId()
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded-sm border-abyss-400 accent-cobalt-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-600" />
        <label htmlFor={id} className="text-sm leading-relaxed text-steel-700">{children}</label>
      </div>
      {error && <p id={`${id}-e`} className="mt-1.5 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  )
}

/** Confirmation panel shown after a form is sent. Announced to screen readers. */
export function SentPanel({ title, children, actions }: { title: string; children: ReactNode; actions: ReactNode }) {
  return (
    <div role="status" aria-live="polite" className="rounded-pane border border-abyss-200 border-t-4 border-t-azure-600 bg-white p-6 shadow-panel sm:p-8">
      <h3 className="font-serif4 text-[1.5rem] font-semibold text-abyss-900">{title}</h3>
      <div className="mt-2 text-base text-steel-600">{children}</div>
      <div className="mt-5 flex flex-wrap gap-3">{actions}</div>
    </div>
  )
}
