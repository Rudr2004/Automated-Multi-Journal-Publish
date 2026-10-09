// Email OTP gate for sensitive actions on the Journal 5 (IJFRD) status console (demo code 123456).
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Button } from '../../components/Button'
import { Field, Spinner, fieldInput } from '../../components/form/Field'
import { Modal } from '../../components/form/Modal'
import { cx } from '../../components/primitives'

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

  const send = async () => {
    setBusy(true); setError('')
    try { await onSendOtp(email); setSent(true) } catch { setError('We could not send the code. Please try again.') } finally { setBusy(false) }
  }
  const verify = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const ok = await onVerify(code)
      if (ok) onVerified(); else { setError('That code is not correct. Please try again.'); codeRef.current?.focus() }
    } catch { setError('Verification failed. Please try again.') } finally { setBusy(false) }
  }

  return (
    <Modal open={open} onClose={onClose} title="Verify your email">
      <p className="text-[15px] text-obsidian-700">To {purpose}, confirm it is you. We will email a 6-digit code to <strong className="break-all text-obsidian-900">{email}</strong>.</p>
      {!sent ? (
        <>
          {error && <p role="alert" className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
          <Button variant="cta" className="mt-5 min-h-[44px] w-full" onClick={send} disabled={busy} aria-busy={busy} data-autofocus>{busy && <Spinner />}{busy ? 'Sending…' : 'Send code'}</Button>
        </>
      ) : (
        <form onSubmit={verify} noValidate className="mt-5 space-y-4">
          <p role="status" className="rounded border border-ochre-200 bg-ochre-50 px-3 py-2 text-sm text-obsidian-900">Code sent. For this demo, use <strong className="tabular-nums">123456</strong>.</p>
          <Field label="6-digit code" name="otp" required error={error}>
            <input ref={codeRef} inputMode="numeric" maxLength={6} autoComplete="one-time-code" className={cx(fieldInput(error), 'text-center text-2xl tabular-nums tracking-[0.5em]')}
              value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, '')); setError('') }} />
          </Field>
          <Button type="submit" variant="cta" className="min-h-[44px] w-full" disabled={busy || code.length !== 6} aria-busy={busy}>{busy && <Spinner />}{busy ? 'Verifying…' : 'Verify and continue'}</Button>
        </form>
      )}
    </Modal>
  )
}
