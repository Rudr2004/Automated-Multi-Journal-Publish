// Form building blocks for Journal 5 (IJFRD): labelled field, input class, check row, spinner and copy button.
import { cloneElement, isValidElement, useId, useState, type ReactElement, type ReactNode } from 'react'
import { copyText } from '../../../../core/lib/clipboard'
import { Check, Copy } from '../../icons'
import { cx } from '../primitives'
import { useToast } from '../Toast'

/** Input class: 1px slate border, 6px radius, azure focus ring, red state on error. min-h 44px for touch. */
export const fieldInput = (error?: string) =>
  cx(
    'block min-h-[44px] w-full rounded border bg-white px-3 py-2 text-base text-obsidian-900 placeholder:text-obsidian-400 transition-colors focus-visible:outline-none focus-visible:ring-2',
    error
      ? 'border-red-700 bg-red-50 focus-visible:border-red-700 focus-visible:ring-red-700/30'
      : 'border-obsidian-300 hover:border-obsidian-400 focus-visible:border-wine-700 focus-visible:ring-wine-700/30',
  )

export const Spinner = ({ dark = false }: { dark?: boolean }) => (
  <span aria-hidden="true" className={cx('h-4 w-4 rounded-full border-2 motion-safe:animate-spin', dark ? 'border-obsidian-900/30 border-t-obsidian-900' : 'border-white/40 border-t-white')} />
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
        <label htmlFor={id} className="text-sm font-semibold text-obsidian-900">
          {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}{optional && <span className="font-normal text-obsidian-600"> (optional)</span>}
        </label>
        {counter && <span className="text-xs tabular-nums text-obsidian-600">{counter}</span>}
      </div>
      {isValidElement(children) ? cloneElement(children, { id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': described, 'aria-required': required ? true : undefined }) : children}
      {hint && <p id={hintId} className="mt-1.5 text-[13px] leading-snug text-obsidian-600">{hint}</p>}
      {error && <p id={errId} role="alert" className="mt-1.5 text-[13px] font-semibold leading-snug text-red-700">{error}</p>}
    </div>
  )
}

/** Checkbox row used for declarations (whole row is the 44px+ target). */
export function CheckRow({ name, checked, onChange, error, children }: { name: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode }) {
  const uid = useId()
  return (
    <div>
      <label htmlFor={uid} className={cx('flex min-h-[44px] cursor-pointer items-start gap-3 rounded border p-3.5 text-[15px] leading-snug focus-within:ring-2 focus-within:ring-wine-700/30',
        error ? 'border-red-700 bg-red-50' : checked ? 'border-wine-700 bg-ochre-50' : 'border-[#E6DCD0] bg-white hover:border-obsidian-400')}>
        <input id={uid} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${uid}-e` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-wine-700" />
        <span className="text-obsidian-900">{children}</span>
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
    <button type="button" onClick={click} className={cx('inline-flex min-h-[44px] items-center gap-1.5 rounded border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400 sm:min-h-[36px]',
      tone === 'dark' ? 'border-white/25 text-white hover:bg-white/10' : 'border-obsidian-300 bg-white text-obsidian-900 hover:border-wine-700 hover:text-wine-700')}>
      {ok ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{ok ? done : label}
    </button>
  )
}
