import { useState } from 'react'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { ButtonLink } from './Button'
import { Check } from './uiIcons'

type Option = 'karnataka' | 'india' | 'foreign'

const OPTIONS: { id: Option; label: string; hint: string }[] = [
  { id: 'karnataka', label: 'Indian author, Karnataka', hint: 'CGST + SGST' },
  { id: 'india', label: 'Indian author, other state', hint: 'IGST' },
  { id: 'foreign', label: 'Foreign author', hint: 'No GST' },
]

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })
const INCLUDED = ['Crossref DOI', 'Certificate for every author', 'Open access hosting (CC BY 4.0)', 'Indexing support']

/** APC calculator: Indian authors see INR with a CGST + SGST or IGST breakdown; foreign authors see USD with no GST. */
export function ApcCalculator() {
  const [opt, setOpt] = useState<Option>('karnataka')
  const foreign = opt === 'foreign'
  const base = foreign ? journal.apc.usd : journal.apc.inr
  const fmt = (n: number) => (foreign ? usd.format(n) : inr.format(n))
  const half = (base * journal.apc.gstPercent) / 200
  const rows: [string, number][] = foreign
    ? [['APC', base]]
    : opt === 'karnataka'
      ? [['APC', base], [`CGST (${journal.apc.gstPercent / 2}%)`, half], [`SGST (${journal.apc.gstPercent / 2}%)`, half]]
      : [['APC', base], [`IGST (${journal.apc.gstPercent}%)`, half * 2]]
  const total = rows.reduce((n, [, v]) => n + v, 0)

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div>
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-navy">Who is paying?</legend>
          <div className="space-y-2">
            {OPTIONS.map((o) => (
              <label key={o.id} className={`flex cursor-pointer items-center justify-between gap-3 rounded border p-3 text-sm ${opt === o.id ? 'border-scholar bg-scholar-soft font-semibold' : 'border-line hover:border-scholar'}`}>
                <span className="flex items-center gap-2"><input type="radio" name="apc-who" className="accent-scholar" checked={opt === o.id} onChange={() => setOpt(o.id)} />{o.label}</span>
                <span className="text-xs font-medium text-ink-muted">{o.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className="mt-3 text-xs text-ink-muted">The APC is payable only after your paper is accepted. Nothing is charged at submission.</p>
      </div>

      <div className="border border-line bg-paper p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Your charge</p>
        <dl className="mt-2 space-y-1.5 text-sm">
          {rows.map(([k, v]) => <div key={k} className="flex justify-between tabular-nums"><dt>{k}</dt><dd>{fmt(v)}</dd></div>)}
          <div className="flex justify-between border-t border-line pt-2 font-serif text-xl font-semibold text-navy tabular-nums"><dt>Total</dt><dd aria-live="polite">{fmt(total)}</dd></div>
        </dl>
        <ul className="mt-4 grid gap-1.5 text-sm">
          {INCLUDED.map((x) => <li key={x} className="flex items-center gap-1.5"><Check className="h-4 w-4 shrink-0 text-oa" aria-hidden />{x}</li>)}
        </ul>
        <p className="mt-3 text-xs text-ink-muted">Pay by card, UPI or net banking, or upload a UPI or bank proof for verification.</p>
        <ButtonLink to={paths.pay} variant="primary" className="mt-4 w-full">Pay using your Paper ID</ButtonLink>
      </div>
    </div>
  )
}
