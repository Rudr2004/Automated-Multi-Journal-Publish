// Contact form. Submission goes through actions.onContact and returns a ticket id.
import { useMemo, useRef, useState } from 'react'
import { journal } from '../../../../config/journals'
import { copyText } from '../../../../core/lib/clipboard'
import type { FormErrors } from '../../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../../core/lib/useVisibleErrors'
import * as v from '../../../../core/lib/validators'
import type { ContactTicketInput } from '../../../../core/types'
import { Copy, Send } from '../../icons'
import { Button } from '../Button'
import { useToast } from '../Toast'
import { Field, inputClass, SentPanel } from './fields'

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

export function ContactForm({ onSubmit }: { onSubmit: (v: ContactTicketInput) => Promise<{ ticketId: string }> }) {
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
      setTicket((await onSubmit({ ...rest, message: paperId ? `[${paperId}] ${rest.message}` : rest.message })).ticketId)
    } catch { toast('Could not send your message. Please try again.', 'error') } finally { setBusy(false) }
  }

  if (ticket) {
    return (
      <SentPanel title="Message received" actions={<>
        <Button variant="outline" onClick={async () => toast((await copyText(ticket)) ? 'Ticket ID copied' : 'Could not copy')}><Copy className="h-4 w-4" aria-hidden="true" />Copy ticket ID</Button>
        <Button onClick={() => { setF(empty); setTicket(null); reset() }}>Send another</Button>
      </>}>
        <p>Ticket <strong className="font-semibold tabular-nums text-abyss-900">{ticket}</strong> was created. We reply to {f.email} within two working days.</p>
      </SentPanel>
    )
  }

  return (
    <form ref={ref} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} aria-label="Contact form" aria-busy={busy}
      className="space-y-5 rounded-pane border border-abyss-200 bg-white p-5 shadow-hair sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required error={errors.name}>
          <input className={inputClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} />
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          <input type="email" className={inputClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} />
        </Field>
        <Field label="Topic" name="topic" required error={errors.topic}>
          <select className={inputClass(errors.topic)} value={f.topic} onChange={(e) => set('topic', e.target.value)}><option value="">Select a topic</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </Field>
        <Field label="Paper ID (optional)" name="paperId" error={errors.paperId} hint="Include it if you are asking about a submission.">
          <input className={inputClass(errors.paperId)} value={f.paperId} maxLength={15} spellCheck={false} placeholder={`${journal.paperIdPrefix}2026000112`} onChange={(e) => set('paperId', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} />
        </Field>
      </div>
      <Field label="Message" name="message" required error={errors.message} counter={`${f.message.length} / ${MAX}`}>
        <textarea rows={6} className={inputClass(errors.message)} value={f.message} maxLength={MAX} onChange={(e) => set('message', e.target.value)} />
      </Field>
      <Button type="submit" variant="cta" disabled={busy} className="min-h-[44px]"><Send className="h-4 w-4" aria-hidden="true" />{busy ? 'Sending…' : 'Send message'}</Button>
    </form>
  )
}
