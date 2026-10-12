// Form building blocks for the Journal 3 guided pages: labelled field, large inputs, check rows, spinner and copy button.
import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from 'react'
import { copyText } from '../../../core/lib/clipboard'
import { Check, Copy } from '../icons'
import { cx } from './primitives'
import { useToast } from './Toast'

/** Input class: Mist fill that turns white on focus, 1px hairline, 2px radius. `large` is a slightly roomier variant. */
export const j3Input = (error?: string, large = false) =>
  cx(
    'block w-full rounded-tile border font-inter text-night-900 placeholder:text-mauve-600 transition-colors',
    large ? 'px-3.5 py-3 text-base' : 'px-3 py-2.5 text-[15px]',
    error ? 'border-red-700 bg-red-50 focus:bg-white focus:ring-1 focus:ring-red-700 focus-visible:!outline-none' : 'border-j3paper-rule bg-j3paper-cool hover:border-iris-400 focus:border-iris-700 focus:bg-white focus:ring-1 focus:ring-iris-700 focus-visible:!outline-none',
  )

export const J3Spinner = ({ dark = false }: { dark?: boolean }) => (
  <span aria-hidden="true" className={cx('h-4 w-4 rounded-full border-2 motion-safe:animate-spin', dark ? 'border-night-900/30 border-t-night-900' : 'border-white/40 border-t-white')} />
)

/** Label, hint, error and counter around one control. The control gets id, name, aria-invalid and aria-describedby. */
export function J3Field({ label, name, required, error, hint, counter, optional, children }: {
  label: string; name: string; required?: boolean; optional?: boolean; error?: string; hint?: ReactNode; counter?: string; children: ReactElement<Record<string, unknown>>
}) {
  const uid = useId()
  const id = `${uid}-c`, hintId = `${uid}-h`, errId = `${uid}-e`
  const described = [hint ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-inter text-[13px] font-bold text-night-900">
          {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}{optional && <span className="font-normal text-mauve-600"> (optional)</span>}
        </label>
        {counter && <span className="font-inter text-xs tabular-nums text-mauve-600">{counter}</span>}
      </div>
      {isValidElement(children) ? cloneElement(children, { id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': described, 'aria-required': required ? true : undefined }) : children}
      {hint && <p id={hintId} className="mt-1.5 font-inter text-xs text-mauve-600">{hint}</p>}
      {error && <p id={errId} role="alert" className="mt-1.5 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  )
}

/** Large checkbox row for declarations. */
export function J3Check({ name, checked, onChange, error, children }: { name: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode }) {
  const uid = useId()
  return (
    <div>
      <label htmlFor={uid} className={cx('flex cursor-pointer items-start gap-3 rounded-tile border p-4 text-[15px] leading-snug', error ? 'border-red-700 bg-red-50 focus:ring-4 focus:ring-red-700/15 focus-visible:!outline-none' : checked ? 'border-iris-700 bg-iris-50' : 'border-j3paper-rule bg-j3paper-cool hover:border-iris-400')}>
        <input id={uid} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${uid}-e` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-iris-700" />
        <span className="text-night-900">{children}</span>
      </label>
      {error && <p id={`${uid}-e`} role="alert" className="mt-1.5 text-sm font-semibold text-red-700">{error}</p>}
    </div>
  )
}

/** Compact copy-to-clipboard button with a toast. */
export function J3Copy({ text, label = 'Copy', done = 'Copied', tone = 'light' }: { text: string; label?: string; done?: string; tone?: 'light' | 'dark' }) {
  const toast = useToast()
  const [ok, setOk] = useState(false)
  const click = async () => {
    const res = await copyText(text)
    if (res) { setOk(true); toast(done); setTimeout(() => setOk(false), 1800) } else toast('Copy is not available in this browser.', 'error')
  }
  return (
    <button type="button" onClick={click} className={cx('inline-flex items-center gap-1.5 rounded-tile px-3 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.08em] transition-colors',
      tone === 'dark' ? 'bg-white/15 text-white hover:bg-white/25' : 'bg-iris-100 text-iris-700 hover:bg-iris-200')}>
      {ok ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{ok ? done : label}
    </button>
  )
}
