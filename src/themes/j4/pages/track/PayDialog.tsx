// Payment dialog of the Journal 4 console: pay online (simulated) or upload UPI / bank proof.
import { useEffect, useState } from 'react'
import { journal } from '../../../../config/journals'
import type { PaymentProof } from '../../../../core/types'
import { Button } from '../../components/Button'
import { Field, Spinner, fieldInput } from '../../components/form/Field'
import { FileDrop, type PickedFile } from '../../components/form/FileDrop'
import { Modal } from '../../components/form/Modal'
import { cx } from '../../components/primitives'

export type PayMode = 'online' | 'proof'
type Residency = 'india' | 'international'
const GATEWAY: Record<Residency, { name: string; methods: string[] }> = {
  india: { name: 'Razorpay', methods: ['UPI', 'Debit / credit card', 'Net banking'] },
  international: { name: 'Stripe', methods: ['International credit / debit card'] },
}
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

/** APC figures for one author category. */
export function apcFor(india: boolean) {
  const base = india ? journal.apc.inr : journal.apc.usd
  const gst = india ? (base * journal.apc.gstPercent) / 100 : 0
  return { base, gst, total: base + gst, fmt: (n: number) => (india ? inr.format(n) : usd.format(n)) }
}

const PROOF_EXT = ['.jpg', '.jpeg', '.png', '.pdf']
const validateProof = (f: PickedFile) =>
  !PROOF_EXT.some((e) => f.name.toLowerCase().endsWith(e)) ? 'Upload a JPG, PNG or PDF.' : f.size === 0 ? 'This file is empty.' : f.size > 5 * 1024 * 1024 ? 'File is larger than 5 MB.' : ''

function Choice({ checked, onChange, name, children }: { checked: boolean; onChange: () => void; name: string; children: string }) {
  return (
    <label className={cx('flex min-h-[44px] cursor-pointer items-center gap-2 rounded-ctl border px-3 text-sm font-semibold focus-within:ring-2 focus-within:ring-azure-600/50', checked ? 'border-cobalt-700 bg-azure-50 text-abyss-900' : 'border-abyss-300 text-steel-700 hover:border-abyss-400')}>
      <input type="radio" name={name} className="accent-cobalt-700" checked={checked} onChange={onChange} />{children}
    </label>
  )
}

export function PayDialog({ open, onClose, paperId, initialMode = 'online', onPay, onProof }: {
  open: boolean; onClose: () => void; paperId: string; initialMode?: PayMode
  onPay: () => Promise<void>; onProof: (proof: PaymentProof) => Promise<void>
}) {
  const [mode, setMode] = useState<PayMode>(initialMode)
  const [res, setRes] = useState<Residency>('india')
  const [method, setMethod] = useState(GATEWAY.india.methods[0])
  const [busy, setBusy] = useState(false)
  const [failed, setFailed] = useState('')
  const [reference, setReference] = useState('')
  const [file, setFile] = useState<PickedFile | null>(null)
  const [errors, setErrors] = useState<{ reference?: string; file?: string }>({})

  useEffect(() => { if (open) { setMode(initialMode); setBusy(false); setFailed(''); setErrors({}); setReference(''); setFile(null) } }, [open, initialMode])

  const india = res === 'india'
  const { base, gst, total, fmt } = apcFor(india)
  const gateway = GATEWAY[res]
  const choose = (r: Residency) => { setRes(r); setMethod(GATEWAY[r].methods[0]) }
  const run = async (fn: () => Promise<void>) => {
    setBusy(true); setFailed('')
    try { await fn() } catch { setFailed('Something went wrong. You have not been charged. Please try again.') } finally { setBusy(false) }
  }
  const sendProof = async () => {
    const next: typeof errors = {}
    if (!/^[A-Za-z0-9]{8,22}$/.test(reference.trim())) next.reference = 'Enter the UTR or transaction reference (8 to 22 letters or digits).'
    if (!file) next.file = 'Upload a screenshot or PDF of the payment.'
    setErrors(next)
    if (Object.keys(next).length || !file) return
    await run(() => onProof({ reference: reference.trim().toUpperCase(), fileName: file.name }))
  }

  return (
    <Modal open={open} onClose={onClose} title="Pay article processing charge" size="lg">
      <p className="text-[15px] text-steel-700">Paper ID <strong className="tabular-nums text-abyss-900">{paperId}</strong>. This is a simulated payment: no money is charged.</p>

      <div role="group" aria-label="Payment route" className="mt-4 grid grid-cols-2 gap-1 rounded-ctl border border-abyss-200 bg-abyss-100 p-1">
        {([['online', 'Pay online'], ['proof', 'Upload proof']] as const).map(([m, label]) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}
            className={cx('min-h-[44px] rounded-ctl px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600', mode === m ? 'bg-white text-abyss-900 shadow-hair' : 'text-steel-600 hover:text-abyss-900')}>{label}</button>
        ))}
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-semibold text-abyss-900">Author category</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <Choice name="res" checked={india} onChange={() => choose('india')}>Indian author (INR)</Choice>
          <Choice name="res" checked={!india} onChange={() => choose('international')}>International author (USD)</Choice>
        </div>
      </fieldset>

      <dl className="mt-4 overflow-hidden rounded-ctl border border-abyss-200 text-sm tabular-nums">
        <div className="flex justify-between border-b border-abyss-200 px-3 py-2"><dt className="text-steel-600">APC</dt><dd>{fmt(base)}</dd></div>
        <div className="flex justify-between border-b border-abyss-200 px-3 py-2"><dt className="text-steel-600">GST ({india ? `${journal.apc.gstPercent}%` : 'not applicable'})</dt><dd>{fmt(gst)}</dd></div>
        <div className="flex justify-between bg-abyss-50 px-3 py-2 font-semibold text-abyss-900"><dt>Total</dt><dd>{fmt(total)}</dd></div>
      </dl>

      {failed && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">{failed}</p>}

      {mode === 'online' ? (
        <div className="mt-4">
          <p className="text-sm text-steel-700">Secure checkout by <strong className="text-abyss-900">{gateway.name}</strong> ({india ? 'INR' : 'USD'})</p>
          <fieldset className="mt-3">
            <legend className="sr-only">Payment method</legend>
            <div className="grid gap-2 sm:grid-cols-3">{gateway.methods.map((m) => <Choice key={m} name="method" checked={method === m} onChange={() => setMethod(m)}>{m}</Choice>)}</div>
          </fieldset>
          <Button variant="cta" className="mt-5 min-h-[48px] w-full" onClick={() => run(onPay)} disabled={busy} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Processing payment…' : `Pay ${fmt(total)}`}</Button>
          <p className="mt-2 text-center text-xs text-steel-600">A GST invoice is emailed once the payment is confirmed, and reminders stop.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-ctl border border-abyss-200 bg-abyss-50 p-4 text-sm">
            <p className="font-semibold text-abyss-900">{india ? 'Pay by UPI or bank transfer' : 'Pay by bank (wire) transfer'}</p>
            <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[7rem_1fr]">
              {india ? (<><dt className="text-steel-600">UPI ID</dt><dd className="break-all font-semibold">pay@{journal.domain.split('.')[0]}</dd></>) : (<><dt className="text-steel-600">Bank details</dt><dd className="font-semibold">Sent to your email on request</dd></>)}
              <dt className="text-steel-600">Beneficiary</dt><dd className="font-semibold">{journal.publisher}</dd>
              <dt className="text-steel-600">Amount</dt><dd className="font-semibold tabular-nums">{fmt(total)}</dd>
              <dt className="text-steel-600">Remark</dt><dd className="font-semibold tabular-nums">{paperId}</dd>
            </dl>
          </div>
          <Field label="Transaction reference (UTR)" name="reference" required error={errors.reference} hint="Shown in your UPI app or bank statement.">
            <input className={fieldInput(errors.reference)} value={reference} maxLength={22} autoComplete="off" spellCheck={false}
              onChange={(e) => { setReference(e.target.value.replace(/[^A-Za-z0-9]/g, '')); setErrors((x) => ({ ...x, reference: undefined })) }} />
          </Field>
          <div>
            <span id="proof-label" className="mb-1.5 block text-sm font-semibold text-abyss-900">Payment proof <span className="text-red-700" aria-hidden="true">*</span></span>
            <FileDrop name="proof" tag="IMG" value={file} onChange={(f) => { setFile(f); setErrors((x) => ({ ...x, file: undefined })) }} validate={validateProof} accept={PROOF_EXT.join(',')}
              hint="JPG, PNG or PDF, up to 5 MB." error={errors.file} describedBy="proof-label" />
          </div>
          <Button variant="cta" className="min-h-[48px] w-full" onClick={sendProof} disabled={busy} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Uploading…' : 'Submit proof for verification'}</Button>
          <p className="text-center text-xs text-steel-600">The editor verifies your proof, usually within one working day.</p>
        </div>
      )}
    </Modal>
  )
}
