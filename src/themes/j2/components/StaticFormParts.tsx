// Form building blocks used by the J2 static-page forms (contact, reviewer). Display only.
import { cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react'
import { ErrorIcon } from '../icons'
import { cx } from './primitives'

export const fieldClass = (error?: string) => cx(
  'block w-full rounded-soft border bg-white px-3 py-2.5 text-base text-graphite-800 placeholder:text-graphite-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-1',
  error ? 'border-red-700' : 'border-graphite-300 hover:border-graphite-400',
)

/** Label + control + hint + error. The control gets id, aria-describedby and aria-invalid automatically. */
export function FormField({ label, name, required, error, hint, counter, children }: {
  label: string; name: string; required?: boolean; error?: string; hint?: string; counter?: string; children: ReactElement<Record<string, unknown>>
}) {
  const id = useId()
  const desc = [hint && `${id}-h`, error && `${id}-e`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-graphite-800">
        {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}
      </label>
      {isValidElement(children) && cloneElement(children, { id, name, 'aria-describedby': desc, 'aria-invalid': error ? true : undefined, 'aria-required': required || undefined })}
      <div className="mt-1 flex justify-between gap-3 text-xs">
        <div>
          {hint && <p id={`${id}-h`} className="text-graphite-600">{hint}</p>}
          {error && <p id={`${id}-e`} className="flex items-center gap-1 font-medium text-red-700"><ErrorIcon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />{error}</p>}
        </div>
        {counter && <p className="shrink-0 text-graphite-600">{counter}</p>}
      </div>
    </div>
  )
}

export function FormCheckbox({ name, checked, error, onChange, children }: { name: string; checked: boolean; error?: string; onChange: (c: boolean) => void; children: ReactNode }) {
  const id = useId()
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-graphite-700">
        <input id={id} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-e` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-graphite-400 accent-accent-700 focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-1" />
        <span>{children}</span>
      </label>
      {error && <p id={`${id}-e`} className="mt-1 flex items-center gap-1 text-xs font-medium text-red-700"><ErrorIcon className="h-3.5 w-3.5" aria-hidden="true" />{error}</p>}
    </div>
  )
}
