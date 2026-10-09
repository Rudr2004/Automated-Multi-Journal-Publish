// Form building blocks for the Journal 3 contact and reviewer forms.
import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { cx } from './primitives'

export const fieldClass = (error?: string) => cx(
  'block w-full rounded-none border bg-white px-3.5 py-2.5 font-inter text-base text-night-900 placeholder:text-mauve-500 transition-colors',
  error ? 'border-ember-700 focus:ring-1 focus:ring-ember-700 focus-visible:!outline-none' : 'border-mauve-200 hover:border-iris-400 focus:border-iris-700 focus:ring-1 focus:ring-iris-700 focus-visible:!outline-none',
)

/** Label + control + hint + error. The control receives id, name, aria-describedby and aria-invalid automatically. */
export function FormFieldJ3({ label, name, required, error, hint, counter, children }: {
  label: string; name: string; required?: boolean; error?: string; hint?: string; counter?: string; children: ReactElement<Record<string, unknown>>
}) {
  const id = useId()
  const desc = [hint && `${id}-h`, error && `${id}-e`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-inter text-sm font-semibold text-night-900">
        {label}{required && <span className="text-ember-700" aria-hidden="true"> *</span>}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      {isValidElement(children) && cloneElement(children, { id, name, 'aria-describedby': desc, 'aria-invalid': error ? true : undefined, 'aria-required': required || undefined })}
      <div className="mt-1.5 flex justify-between gap-3 text-xs">
        <div className="min-w-0">
          {hint && !error && <p id={`${id}-h`} className="text-mauve-700">{hint}</p>}
          {hint && error && <p id={`${id}-h`} className="sr-only">{hint}</p>}
          {error && <p id={`${id}-e`} className="font-semibold text-ember-700">{error}</p>}
        </div>
        {counter && <p className="shrink-0 text-mauve-700" aria-hidden="true">{counter}</p>}
      </div>
    </div>
  )
}

export function FormCheckboxJ3({ name, checked, error, onChange, children }: { name: string; checked: boolean; error?: string; onChange: (c: boolean) => void; children: ReactNode }) {
  const id = useId()
  return (
    <div>
      <div className="flex items-start gap-3">
        <input id={id} type="checkbox" name={name} checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-e` : undefined} className="mt-1 h-5 w-5 shrink-0 rounded-none border border-mauve-300 accent-iris-700" />
        <label htmlFor={id} className="text-sm leading-relaxed text-mauve-800">{children}</label>
      </div>
      {error && <p id={`${id}-e`} className="mt-1.5 text-xs font-semibold text-ember-700">{error}</p>}
    </div>
  )
}
