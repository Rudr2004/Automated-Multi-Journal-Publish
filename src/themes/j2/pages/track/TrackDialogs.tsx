// Dialogs of the Journal 2 track page: email OTP, payment (online or UPI/bank proof) and edit submission.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { journal } from '../../../../config/journals'
import { ACCEPTED_EXT, MAX_FILE_MB, validateFile } from '../../../../core/lib/submission'
import type { PaymentProof } from '../../../../core/types'
import { Button } from '../../components/Button'
import { Field, inputCls } from '../../components/FieldKit'
import { FileDrop, type PickedFile } from '../../components/FileDrop'
import { ModalDialog } from '../../components/ModalDialog'
import { Bank, Card, Lock } from '../../components/pageIcons'
import { cx } from '../../components/primitives'

const Spinner = () => <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" />

/** Email OTP gate for sensitive actions (demo code 123456). */
export function OtpDialog({ open, onClose, email, purpose, onSendOtp, onVerify, onVerified }: {
  open: boolean; onClose: () => void; email: string; purpose: string
  onSendOtp: (email: string) => Promise<unknown>; onVerify: (code: string) => Promise<boolean>; onVerified: () => void
}) {
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (open) { setSent(false); setCode(''); setError(''); setBusy(false) } }, [open])
  useEffect(() => { if (sent) codeRef.current?.focus() }, [sent])

  const send = async () => { setBusy(true); try { await onSendOtp(email); setSent(true) } catch { setError('We could not send the code. Please try again.') } finally { setBusy(false) } }
  const verify = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const ok = await onVerify(code)
      if (ok) onVerified(); else { setError('That code is not correct. Please try again.'); codeRef.current?.focus() }
    } catch { setError('Verification failed. Please try again.') } finally { setBusy(false) }
  }

  return (
    <ModalDialog open={open} onClose={onClose} title="Verify your email">
      <p className="text-sm text-graphite-700">To {purpose}, confirm it is you. We will email a 6-digit code to <strong className="break-all">{email}</strong>.</p>
      {!sent ? (
        <>
          {error && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{error}</p>}
          <Button className="mt-5 w-full" onClick={send} disabled={busy} aria-busy={busy} data-autofocus>{busy && <Spinner />}{busy ? 'Sending…' : 'Send code'}</Button>
        </>
      ) : (
        <form onSubmit={verify} noValidate className="mt-5 space-y-4">
          <p role="status" className="rounded-soft bg-accent-50 px-3 py-2 text-xs text-accent-900">Code sent. For this demo, use <strong>123456</strong>.</p>
          <Field label="6-digit code" name="otp" required error={error}>
            <input ref={codeRef} inputMode="numeric" maxLength={6} autoComplete="one-time-code" className={cx(inputCls(error), 'text-center text-xl tracking-[0.5em]')}
              value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError('') }} />
          </Field>
          <Button type="submit" className="w-full" disabled={busy || code.length !== 6} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Verifying…' : 'Verify and continue'}</Button>
        </form>
      )}
    </ModalDialog>
  )
}

type Residency = 'india' | 'international'
export type PayMode = 'online' | 'proof'
const GATEWAY: Record<Residency, { name: string; methods: string[] }> = {
  india: { name: 'Razorpay', methods: ['UPI', 'Debit / credit card', 'Net banking'] },
  international: { name: 'Stripe', methods: ['International credit / debit card'] },
}
const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 })
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

const PROOF_EXT = ['.jpg', '.jpeg', '.png', '.pdf']
const validateProof = (f: PickedFile) =>
  !PROOF_EXT.some((e) => f.name.toLowerCase().endsWith(e)) ? 'Upload a JPG, PNG or PDF.' : f.size === 0 ? 'This file is empty.' : f.size > 5 * 1024 * 1024 ? 'File is larger than 5 MB.' : ''

function Choice({ checked, onChange, name, children }: { checked: boolean; onChange: () => void; name: string; children: string }) {
  return (
    <label className={cx('flex cursor-pointer items-center gap-2 rounded-soft border p-3 text-sm focus-within:outline focus-within:outline-2 focus-within:outline-accent-700', checked ? 'border-accent-700 bg-accent-50 font-semibold text-accent-900' : 'border-graphite-300 text-graphite-700')}>
      <input type="radio" name={name} className="accent-accent-700" checked={checked} onChange={onChange} />{children}
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
  const base = india ? journal.apc.inr : journal.apc.usd
  const gst = india ? (base * journal.apc.gstPercent) / 100 : 0
  const total = base + gst
  const fmt = (n: number) => (india ? inr.format(n) : usd.format(n))
  const gateway = GATEWAY[res]

  const choose = (r: Residency) => { setRes(r); setMethod(GATEWAY[r].methods[0]) }
  const run = async (fn: () => Promise<void>) => { setBusy(true); setFailed(''); try { await fn() } catch { setFailed('Something went wrong. You have not been charged. Please try again.') } finally { setBusy(false) } }
  const sendProof = async () => {
    const next: typeof errors = {}
    if (!/^[A-Za-z0-9]{8,22}$/.test(reference.trim())) next.reference = 'Enter the UTR or transaction reference (8 to 22 letters or digits).'
    if (!file) next.file = 'Upload a screenshot or PDF of the payment.'
    setErrors(next)
    if (Object.keys(next).length || !file) return
    await run(() => onProof({ reference: reference.trim().toUpperCase(), fileName: file.name }))
  }

  return (
    <ModalDialog open={open} onClose={onClose} title="Pay article processing charge" size="lg">
      <p className="text-sm text-graphite-600">Paper ID <strong className="text-graphite-800">{paperId}</strong>. This is a simulated payment: no money is charged.</p>

      <div role="group" aria-label="Payment route" className="mt-4 grid grid-cols-2 gap-1 rounded-soft bg-graphite-100 p-1">
        {([['online', 'Pay online', Card], ['proof', 'Upload proof', Bank]] as const).map(([m, label, Icon]) => (
          <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)}
            className={cx('flex items-center justify-center gap-2 rounded-chip px-3 py-2 text-sm font-semibold transition-colors', mode === m ? 'bg-white text-brand-800 shadow-card' : 'text-graphite-600 hover:text-brand-800')}>
            <Icon className="h-4 w-4" aria-hidden="true" />{label}
          </button>
        ))}
      </div>

      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-medium text-graphite-800">Author category</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          <Choice name="res" checked={india} onChange={() => choose('india')}>Indian author (INR)</Choice>
          <Choice name="res" checked={!india} onChange={() => choose('international')}>International author (USD)</Choice>
        </div>
      </fieldset>

      <dl className="mt-4 space-y-1.5 rounded-soft bg-graphite-50 p-4 text-sm ring-1 ring-inset ring-graphite-200">
        <div className="flex justify-between"><dt>APC</dt><dd>{fmt(base)}</dd></div>
        <div className="flex justify-between"><dt>GST ({india ? `${journal.apc.gstPercent}%` : 'not applicable'})</dt><dd>{fmt(gst)}</dd></div>
        <div className="flex justify-between border-t border-graphite-200 pt-2 text-base font-bold text-brand-800"><dt>Total</dt><dd>{fmt(total)}</dd></div>
      </dl>

      {failed && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{failed}</p>}

      {mode === 'online' ? (
        <div className="mt-4">
          <p className="flex items-center gap-2 text-sm text-graphite-700"><Lock className="h-4 w-4 text-brand-700" aria-hidden="true" />Secure checkout by <strong>{gateway.name}</strong> ({india ? 'INR' : 'USD'})</p>
          <fieldset className="mt-3">
            <legend className="sr-only">Payment method</legend>
            <div className="grid gap-2 sm:grid-cols-3">{gateway.methods.map((m) => <Choice key={m} name="method" checked={method === m} onChange={() => setMethod(m)}>{m}</Choice>)}</div>
          </fieldset>
          <Button className="mt-5 w-full py-3" onClick={() => run(onPay)} disabled={busy} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Processing payment…' : `Pay ${fmt(total)}`}</Button>
          <p className="mt-2 text-center text-xs text-graphite-600">A GST invoice is emailed once the payment is confirmed, and reminders stop.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-soft border border-accent-200 bg-accent-50 p-4 text-sm">
            <p className="font-semibold text-accent-900">{india ? 'Pay by UPI or bank transfer' : 'Pay by bank (wire) transfer'}</p>
            <dl className="mt-2 grid gap-x-4 gap-y-1 sm:grid-cols-[7rem_1fr]">
              {india ? (<><dt className="text-graphite-600">UPI ID</dt><dd className="break-all font-medium">pay@{journal.domain.split('.')[0]}</dd></>) : (<><dt className="text-graphite-600">Bank details</dt><dd className="font-medium">Sent to your email on request</dd></>)}
              <dt className="text-graphite-600">Beneficiary</dt><dd className="font-medium">{journal.publisher}</dd>
              <dt className="text-graphite-600">Amount</dt><dd className="font-semibold">{fmt(total)}</dd>
              <dt className="text-graphite-600">Remark</dt><dd className="font-medium">{paperId}</dd>
            </dl>
          </div>
          <Field label="Transaction reference (UTR)" name="reference" required error={errors.reference} hint="Shown in your UPI app or bank statement.">
            <input className={inputCls(errors.reference)} value={reference} maxLength={22} autoComplete="off" spellCheck={false}
              onChange={(e) => { setReference(e.target.value.replace(/[^A-Za-z0-9]/g, '')); setErrors((x) => ({ ...x, reference: undefined })) }} />
          </Field>
          <div>
            <span id="proof-label" className="mb-1.5 block text-sm font-medium text-graphite-800">Payment proof <span className="text-red-700" aria-hidden="true">*</span></span>
            <FileDrop name="proof" value={file} onChange={(f) => { setFile(f); setErrors((x) => ({ ...x, file: undefined })) }} validate={validateProof} accept={PROOF_EXT.join(',')}
              hint="JPG, PNG or PDF, up to 5 MB." error={errors.file} describedBy="proof-label" />
          </div>
          <Button className="w-full py-3" onClick={sendProof} disabled={busy} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Uploading…' : 'Submit proof for verification'}</Button>
          <p className="text-center text-xs text-graphite-600">The editor verifies your proof, usually within one working day.</p>
        </div>
      )}
    </ModalDialog>
  )
}

/** Edit submission (unlocked by OTP): change the title or replace the manuscript file. Only possible before the decision. */
export function EditDialog({ open, onClose, title, onSave }: { open: boolean; onClose: () => void; title: string; onSave: (title: string, file: PickedFile | null) => Promise<void> }) {
  const [value, setValue] = useState(title)
  const [file, setFile] = useState<PickedFile | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => { if (open) { setValue(title); setFile(null); setError(''); setBusy(false) } }, [open, title])

  const save = async (e: FormEvent) => {
    e.preventDefault()
    const t = value.trim()
    if (t.length < 10) { setError('The title is too short (minimum 10 characters).'); return }
    if (t.length > 250) { setError('The title is too long (maximum 250 characters).'); return }
    setBusy(true)
    try { await onSave(t, file) } finally { setBusy(false) }
  }
  return (
    <ModalDialog open={open} onClose={onClose} title="Edit your submission" size="lg">
      <form onSubmit={save} noValidate className="space-y-4">
        <Field label="Manuscript title" name="title" required error={error}>
          <input className={inputCls(error)} value={value} maxLength={250} data-autofocus onChange={(e) => { setValue(e.target.value); setError('') }} />
        </Field>
        <div>
          <span id="edit-file-label" className="mb-1.5 block text-sm font-medium text-graphite-800">Replace manuscript file <span className="font-normal text-graphite-600">(optional)</span></span>
          <FileDrop name="editFile" value={file} onChange={setFile} validate={validateFile} accept={ACCEPTED_EXT.join(',')} hint={`Word files only, up to ${MAX_FILE_MB} MB.`} describedBy="edit-file-label" />
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Saving…' : 'Save changes'}</Button>
        </div>
      </form>
    </ModalDialog>
  )
}
