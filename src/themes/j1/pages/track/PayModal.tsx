import { useState } from 'react'
import { Bank, Lock, Payments } from '../../components/uiIcons'
import { Button } from '../../components/Button'
import { FileDropzone, type PickedFile } from '../../components/FileDropzone'
import { Field, inputClass } from '../../components/form'
import { Modal } from '../../components/Modal'
import { journal } from '../../../../config/journals/j1'

type Residency = 'india' | 'international'
type Mode = 'online' | 'proof'
export interface PaymentProof { reference: string; fileName: string }

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

const GATEWAY: Record<Residency, { name: string; methods: string[] }> = {
  india: { name: 'Razorpay', methods: ['UPI', 'Debit / credit card', 'Net banking'] },
  international: { name: 'Stripe', methods: ['International credit / debit card'] },
}

const PROOF_EXT = ['.jpg', '.jpeg', '.png', '.pdf']
const validateProofFile = (f: PickedFile) =>
  !PROOF_EXT.some((e) => f.name.toLowerCase().endsWith(e)) ? 'Upload a JPG, PNG or PDF.' : f.size === 0 ? 'This file is empty.' : f.size > 5 * 1024 * 1024 ? 'File is larger than 5 MB.' : ''

/**
 * Simulated APC payment. Two routes, as on the real platform:
 * pay online (Razorpay for INR, Stripe for USD) or upload a UPI / bank transfer proof that the editor verifies.
 */
export function PayModal({ open, onClose, paperId, onPay, onProof }: {
  open: boolean; onClose: () => void; paperId: string
  onPay: () => Promise<void>
  onProof: (proof: PaymentProof) => Promise<void>
}) {
  const [mode, setMode] = useState<Mode>('online')
  const [res, setRes] = useState<Residency>('india')
  const [method, setMethod] = useState(GATEWAY.india.methods[0])
  const [busy, setBusy] = useState(false)
  const [reference, setReference] = useState('')
  const [file, setFile] = useState<PickedFile | null>(null)
  const [errors, setErrors] = useState<{ reference?: string; file?: string }>({})

  const india = res === 'india'
  const base = india ? journal.apc.inr : journal.apc.usd
  const gst = india ? (base * journal.apc.gstPercent) / 100 : 0
  const total = base + gst
  const fmt = (n: number) => (india ? inr.format(n) : usd.format(n))
  const gateway = GATEWAY[res]

  const choose = (r: Residency) => { setRes(r); setMethod(GATEWAY[r].methods[0]) }
  const payOnline = async () => { setBusy(true); await onPay(); setBusy(false) }
  const sendProof = async () => {
    const next: typeof errors = {}
    if (!/^[A-Za-z0-9]{8,22}$/.test(reference.trim())) next.reference = 'Enter the UTR / transaction reference (8 to 22 letters or digits).'
    if (!file) next.file = 'Upload a screenshot or PDF of the payment.'
    setErrors(next)
    if (Object.keys(next).length || !file) return
    setBusy(true); await onProof({ reference: reference.trim().toUpperCase(), fileName: file.name }); setBusy(false)
  }

  return (
    <Modal open={open} onClose={onClose} title="Pay article processing charge" size="xl">
      <p className="text-sm text-ink-muted">Paper ID <strong className="text-ink">{paperId}</strong> · Simulated payment — no money is charged.</p>

      <div role="tablist" aria-label="Payment route" className="mt-4 grid grid-cols-2 gap-1 rounded bg-mist-200 p-1">
        {([['online', 'Pay online', Payments], ['proof', 'Upload UPI / bank proof', Bank]] as const).map(([m, label, Icon]) => (
          <button key={m} role="tab" aria-selected={mode === m} type="button" onClick={() => setMode(m)}
            className={`flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-semibold transition-colors ${mode === m ? 'bg-white text-navy shadow-sm' : 'text-ink-muted hover:text-navy'}`}>
            <Icon className="h-4 w-4" aria-hidden />{label}
          </button>
        ))}
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium">Author category</legend>
        <div className="grid grid-cols-2 gap-2">
          {([['india', 'Indian author (INR)'], ['international', 'International author (USD)']] as const).map(([v, l]) => (
            <label key={v} className={`flex cursor-pointer items-center gap-2 rounded border p-3 text-sm ${res === v ? 'border-navy bg-navy-50 font-semibold' : 'border-line'}`}>
              <input type="radio" name="res" className="accent-navy" checked={res === v} onChange={() => choose(v)} />{l}</label>
          ))}
        </div>
      </fieldset>

      <dl className="mt-4 space-y-1.5 rounded bg-mist p-4 text-sm">
        <div className="flex justify-between"><dt>APC</dt><dd>{fmt(base)}</dd></div>
        <div className="flex justify-between"><dt>GST ({india ? `${journal.apc.gstPercent}%` : 'not applicable'})</dt><dd>{fmt(gst)}</dd></div>
        <div className="flex justify-between border-t border-line pt-2 text-base font-semibold text-navy"><dt>Total</dt><dd>{fmt(total)}</dd></div>
      </dl>

      {mode === 'online' ? (
        <div role="tabpanel">
          <p className="mt-4 flex items-center gap-2 text-sm"><Lock className="h-4 w-4 text-oa" aria-hidden />Secure checkout by <strong>{gateway.name}</strong> ({india ? 'INR' : 'USD'})</p>
          <fieldset className="mt-3">
            <legend className="sr-only">Payment method</legend>
            <div className="grid gap-2 sm:grid-cols-3">
              {gateway.methods.map((m) => (
                <label key={m} className={`flex cursor-pointer items-center gap-2 rounded border p-3 text-sm ${method === m ? 'border-navy bg-navy-50 font-semibold' : 'border-line'}`}>
                  <input type="radio" name="method" className="accent-navy" checked={method === m} onChange={() => setMethod(m)} />{m}</label>
              ))}
            </div>
          </fieldset>
          <Button className="mt-5 w-full" size="lg" onClick={payOnline} loading={busy}>Pay {fmt(total)}</Button>
          <p className="mt-2 text-center text-xs text-ink-muted">A GST invoice is emailed as soon as the payment is confirmed. Payment reminders stop automatically.</p>
        </div>
      ) : (
        <div role="tabpanel" className="mt-4 space-y-4">
          <div className="rounded border border-navy-200 bg-navy-50 p-4 text-sm">
            <p className="font-semibold text-navy">{india ? 'Pay by UPI or bank transfer' : 'Pay by bank (wire) transfer'}</p>
            <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[110px_1fr]">
              {india ? (<><dt className="text-ink-muted">UPI ID</dt><dd className="font-medium">journalone@upi</dd><dt className="text-ink-muted">Account name</dt><dd className="font-medium">EdTech Publishers Pvt. Ltd.</dd><dt className="text-ink-muted">Account / IFSC</dt><dd className="font-medium">0000 0000 0000 · XXXX0000000</dd></>)
                : (<><dt className="text-ink-muted">Beneficiary</dt><dd className="font-medium">EdTech Publishers Pvt. Ltd.</dd><dt className="text-ink-muted">IBAN / SWIFT</dt><dd className="font-medium">Provided on request · XXXXINBB</dd></>)}
              <dt className="text-ink-muted">Amount</dt><dd className="font-semibold">{fmt(total)}</dd>
              <dt className="text-ink-muted">Remark</dt><dd className="font-medium">{paperId}</dd>
            </dl>
          </div>
          <Field label="Transaction reference (UTR)" name="reference" required error={errors.reference} hint="Shown in your UPI app or bank statement.">
            <input className={inputClass(errors.reference)} value={reference} maxLength={22} autoComplete="off" spellCheck={false}
              onChange={(e) => { setReference(e.target.value.replace(/[^A-Za-z0-9]/g, '')); setErrors((x) => ({ ...x, reference: undefined })) }} />
          </Field>
          <div>
            <span className="mb-1.5 block text-sm font-medium">Payment proof <span className="text-danger" aria-hidden>*</span></span>
            <FileDropzone value={file} onChange={(f) => { setFile(f); setErrors((x) => ({ ...x, file: undefined })) }} validate={validateProofFile}
              accept={PROOF_EXT.join(',')} hint="JPG, PNG or PDF, up to 5 MB." error={errors.file} />
          </div>
          <Button className="w-full" size="lg" onClick={sendProof} loading={busy}>Submit proof for verification</Button>
          <p className="text-center text-xs text-ink-muted">The editor verifies your proof, usually within one working day. You will see the status on this page.</p>
        </div>
      )}
    </Modal>
  )
}
