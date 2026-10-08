import { CheckCircle2 } from '../../components/uiIcons'
import { useMemo, useRef, useState } from 'react'
import { CopyButton } from '../../components/ArticleParts'
import { Button } from '../../components/Button'
import { Field, inputClass } from '../../components/form'
import { useToast } from '../../components/Toast'
import type { FormErrors } from '../../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../../core/lib/useVisibleErrors'
import * as v from '../../../../core/lib/validators'

const TOPICS = ['Submission help', 'Payment or invoice', 'Certificate query', 'Editorial decision', 'Technical issue', 'Other']
const MAX = 1500

interface Values { name: string; email: string; topic: string; paperId: string; message: string }
const empty: Values = { name: '', email: '', topic: '', paperId: '', message: '' }

const validate = (f: Values): FormErrors => {
  const e: FormErrors = {}
  const set = (k: string, m: string) => { if (m) e[k] = m }
  set('name', v.personName(f.name))
  set('email', v.email(f.email))
  if (!f.topic) e.topic = 'Choose a topic so we can route your message.'
  if (f.paperId) set('paperId', v.paperId(f.paperId))
  set('message', v.textLength(f.message, 20, MAX, 'message'))
  return e
}

/** Contact form: creates a (simulated) support ticket. */
export function ContactForm({ onSubmit }: { onSubmit: (v: Values) => Promise<{ ticketId: string }> }) {
  const toast = useToast()
  const [f, setF] = useState<Values>(empty)
  const [busy, setBusy] = useState(false)
  const [ticket, setTicket] = useState<string | null>(null)
  const ref = useRef<HTMLFormElement>(null)
  const all = useMemo(() => validate(f), [f])
  const { errors, onBlur, attempt, reset } = useVisibleErrors(all)
  const set = <K extends keyof Values>(k: K, val: Values[K]) => setF((s) => ({ ...s, [k]: val }))

  const submit = async () => {
    if (!attempt()) { toast('Please fix the highlighted fields.', 'error'); focusFirstError(ref.current, all); return }
    setBusy(true)
    try { setTicket((await onSubmit(f)).ticketId) } catch { toast('Could not create the ticket. Please try again.', 'error') } finally { setBusy(false) }
  }

  if (ticket) {
    return (
      <div role="status" className="rounded-card border border-oa/40 bg-oa-soft p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-oa" aria-hidden />
        <h3 className="mt-2 font-serif text-xl font-semibold text-navy">Your message has been received</h3>
        <p className="mt-1 text-sm">Ticket <strong>{ticket}</strong> was created. We reply to {f.email} within two working days.</p>
        <div className="mt-4 flex justify-center gap-2"><CopyButton text={ticket} label="Copy ticket ID" /><Button size="sm" variant="secondary" onClick={() => { setF(empty); setTicket(null); reset() }}>Send another</Button></div>
      </div>
    )
  }

  return (
    <form ref={ref} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} className="space-y-5 rounded-card border border-line bg-white p-5 sm:p-6" aria-label="Contact form">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={errors.name}>
          <input className={inputClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} />
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          <input type="email" className={inputClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} />
        </Field>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Topic" name="topic" required error={errors.topic}>
          <select className={inputClass(errors.topic)} value={f.topic} onChange={(e) => set('topic', e.target.value)}><option value="">Select…</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <Field label="Paper ID (optional)" name="paperId" error={errors.paperId} hint="Include it if your question is about a submission.">
          <input className={inputClass(errors.paperId)} value={f.paperId} maxLength={15} spellCheck={false} placeholder="IJMAT2026000123" onChange={(e) => set('paperId', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} />
        </Field>
      </div>
      <Field label="Message" name="message" required error={errors.message} counter={`${f.message.length} / ${MAX}`}>
        <textarea rows={6} className={inputClass(errors.message)} value={f.message} maxLength={MAX} onChange={(e) => set('message', e.target.value)} />
      </Field>
      <Button type="submit" size="lg" loading={busy}>Send message</Button>
    </form>
  )
}
