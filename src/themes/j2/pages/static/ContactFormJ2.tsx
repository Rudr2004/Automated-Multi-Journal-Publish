import { useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { FormField, fieldClass } from '../../components/StaticFormParts'
import { useToast } from '../../components/Toast'
import { Check, Copy } from '../../icons'
import { copyText } from '../../../../core/lib/clipboard'
import type { FormErrors } from '../../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../../core/lib/useVisibleErrors'
import * as v from '../../../../core/lib/validators'
import type { ContactTicketInput } from '../../../../core/types'

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

export function ContactFormJ2({ onSubmit }: { onSubmit: (v: ContactTicketInput) => Promise<{ ticketId: string }> }) {
  const toast = useToast()
  const [f, setF] = useState<Values>(empty)
  const [busy, setBusy] = useState(false)
  const [ticket, setTicket] = useState<string | null>(null)
  const ref = useRef<HTMLFormElement>(null)
  const all = useMemo(() => validate(f), [f])
  const { errors, onBlur, attempt, reset } = useVisibleErrors(all)
  const set = <K extends keyof Values>(k: K, val: Values[K]) => setF((s) => ({ ...s, [k]: val }))

  const submit = async () => {
    if (busy) return
    if (!attempt()) { toast('Please fix the highlighted fields.', 'error'); focusFirstError(ref.current, all); return }
    setBusy(true)
    try {
      const { paperId, ...rest } = f
      const message = paperId ? `[${paperId}] ${rest.message}` : rest.message
      setTicket((await onSubmit({ ...rest, message })).ticketId)
    } catch { toast('Could not send your message. Please try again.', 'error') } finally { setBusy(false) }
  }

  if (ticket) {
    return (
      <div role="status" className="rounded-panel border border-brand-200 bg-brand-50 p-6 text-center">
        <Check className="mx-auto h-10 w-10 rounded-full bg-brand-800 p-2 text-white" aria-hidden="true" />
        <h3 className="mt-3 font-display text-xl font-semibold text-graphite-800">Your message has been received</h3>
        <p className="mt-1 text-sm text-graphite-700">Ticket <strong>{ticket}</strong> was created. We reply to {f.email} within two working days.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={async () => toast((await copyText(ticket)) ? 'Ticket ID copied' : 'Could not copy', 'success')}><Copy className="h-4 w-4" aria-hidden="true" />Copy ticket ID</Button>
          <Button variant="secondary" onClick={() => { setF(empty); setTicket(null); reset() }}>Send another</Button>
        </div>
      </div>
    )
  }

  return (
    <form ref={ref} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} aria-label="Contact form" aria-busy={busy}
      className="space-y-5 rounded-panel border border-graphite-200 bg-[#F8FBFA] p-5 sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Your name" name="name" required error={errors.name}>
          <input className={fieldClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} />
        </FormField>
        <FormField label="Email" name="email" required error={errors.email}>
          <input type="email" className={fieldClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} />
        </FormField>
        <FormField label="Topic" name="topic" required error={errors.topic}>
          <select className={fieldClass(errors.topic)} value={f.topic} onChange={(e) => set('topic', e.target.value)}><option value="">Select a topic</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </FormField>
        <FormField label="Paper ID (optional)" name="paperId" error={errors.paperId} hint="Include it if you are asking about a submission.">
          <input className={fieldClass(errors.paperId)} value={f.paperId} maxLength={15} spellCheck={false} placeholder="JIMRT2026000045" onChange={(e) => set('paperId', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} />
        </FormField>
      </div>
      <FormField label="Message" name="message" required error={errors.message} counter={`${f.message.length} / ${MAX}`}>
        <textarea rows={6} className={fieldClass(errors.message)} value={f.message} maxLength={MAX} onChange={(e) => set('message', e.target.value)} />
      </FormField>
      <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</Button>
    </form>
  )
}
