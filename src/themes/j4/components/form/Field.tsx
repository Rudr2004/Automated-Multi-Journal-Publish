// Form building blocks for Journal 4: labelled field, input class, check row, spinner and copy button.
import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from 'react'
import { copyText } from '../../../../core/lib/clipboard'
import { Check, Copy } from '../../icons'
import { cx } from '../primitives'
import { useToast } from '../Toast'

/** Input class: 1px slate border, 6px radius, azure focus ring, red state on error. min-h 44px for touch. */
export const fieldInput = (error?: string) =>
  cx(
    'block min-h-[44px] w-full rounded-ctl border bg-white px-3 py-2 text-base text-abyss-900 placeholder:text-abyss-400 transition-colors focus-visible:outline-none focus-visible:ring-2',
    error
      ? 'border-red-700 bg-red-50 focus-visible:border-red-700 focus-visible:ring-red-700/30'
      : 'border-abyss-300 hover:border-abyss-400 focus-visible:border-azure-600 focus-visible:ring-azure-600/40',
  )

export const Spinner = ({ dark = false }: { dark?: boolean }) => (
  <span aria-hidden="true" className={cx('h-4 w-4 rounded-full border-2 motion-safe:animate-spin', dark ? 'border-abyss-900/30 border-t-abyss-900' : 'border-white/40 border-t-white')} />
)

/** Label, hint, error and counter around one control. The control receives id, name, aria-invalid and aria-describedby. */
export function Field({ label, name, required, optional, error, hint, counter, children }: {
  label: string; name: string; required?: boolean; optional?: boolean; error?: string; hint?: ReactNode; counter?: string; children: ReactElement<Record<string, unknown>>
}) {
  const uid = useId()
  const id = `${uid}-c`, hintId = `${uid}-h`, errId = `${uid}-e`
  const described = [hint ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3">
        <label htmlFor={id} className="text-sm font-semibold text-abyss-900">
          {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}{optional && <span className="font-normal text-steel-600"> (optional)</span>}
        </label>
        {counter && <span className="text-xs tabular-nums text-steel-600">{counter}</span>}
      </div>
      {isValidElement(children) ? cloneElement(children, { id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': described, 'aria-required': required ? true : undefined }) : children}
      {hint && <p id={hintId} className="mt-1.5 text-[13px] leading-snug text-steel-600">{hint}</p>}
      {error && <p id={errId} role="alert" className="mt-1.5 text-[13px] font-semibold leading-snug text-red-700">{error}</p>}
    </div>
  )
}

/** Checkbox row used for declarations (whole row is the 44px+ target). */
export function CheckRow({ name, checked, onChange, error, children }: { name: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode }) {
  const uid = useId()
  return (
    <div>
      <label htmlFor={uid} className={cx('flex min-h-[44px] cursor-pointer items-start gap-3 rounded-ctl border p-3.5 text-[15px] leading-snug focus-within:ring-2 focus-within:ring-azure-600/50',
        error ? 'border-red-700 bg-red-50' : checked ? 'border-cobalt-700 bg-azure-50' : 'border-abyss-200 bg-white hover:border-abyss-400')}>
        <input id={uid} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${uid}-e` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-cobalt-700" />
        <span className="text-abyss-900">{children}</span>
      </label>
      {error && <p id={`${uid}-e`} role="alert" className="mt-1.5 text-[13px] font-semibold text-red-700">{error}</p>}
    </div>
  )
}

/** Copy-to-clipboard button with a toast; dark tone for use on the abyss band. */
export function CopyButton({ text, label = 'Copy', done = 'Copied', tone = 'light' }: { text: string; label?: string; done?: string; tone?: 'light' | 'dark' }) {
  const toast = useToast()
  const [ok, setOk] = useState(false)
  const click = async () => {
    const res = await copyText(text)
    if (res) { setOk(true); toast(done); setTimeout(() => setOk(false), 1800) } else toast('Copy is not available in this browser.', 'error')
  }
  return (
    <button type="button" onClick={click} className={cx('inline-flex min-h-[44px] items-center gap-1.5 rounded-ctl border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-400 sm:min-h-[36px]',
      tone === 'dark' ? 'border-white/25 text-white hover:bg-white/10' : 'border-abyss-300 bg-white text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700')}>
      {ok ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{ok ? done : label}
    </button>
  )
}
