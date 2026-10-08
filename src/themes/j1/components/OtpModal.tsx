import { useEffect, useState, type FormEvent } from 'react'
import { Button } from './Button'
import { Field, inputClass } from './form'
import { Modal } from './Modal'

/** Email OTP verification dialog (simulated). Demo code is shown so the flow can be tested. */
export function OtpModal({ open, onClose, email, purpose, onSendOtp, onVerify, onVerified, demoCode = '123456' }: {
  open: boolean; onClose: () => void; email: string; purpose: string
  onSendOtp: (email: string) => Promise<unknown>; onVerify: (code: string) => Promise<boolean>; onVerified: () => void; demoCode?: string
}) {
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { if (open) { setSent(false); setCode(''); setError(''); setBusy(false) } }, [open])

  const send = async () => { setBusy(true); await onSendOtp(email); setSent(true); setBusy(false) }
  const verify = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    const ok = await onVerify(code)
    setBusy(false)
    if (ok) onVerified()
    else setError('That code is not correct. Please try again.')
  }

  return (
    <Modal open={open} onClose={onClose} title="Verify your email">
      <p className="text-sm text-ink">To {purpose}, confirm it is you. We will email a 6-digit code to <strong>{email}</strong>.</p>
      {!sent ? (
        <Button className="mt-5 w-full" onClick={send} loading={busy}>{busy ? 'Sending…' : 'Send OTP'}</Button>
      ) : (
        <form onSubmit={verify} noValidate className="mt-5 space-y-3">
          <Field label="Enter 6-digit code" error={error} hint={`Prototype: use ${demoCode}.`}>
            <input inputMode="numeric" maxLength={6} autoComplete="one-time-code" className={`${inputClass(error)} text-center text-lg tracking-[0.5em]`} value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError('') }} />
          </Field>
          <Button type="submit" className="w-full" loading={busy} disabled={code.length !== 6}>{busy ? 'Verifying…' : 'Verify'}</Button>
        </form>
      )}
    </Modal>
  )
}
