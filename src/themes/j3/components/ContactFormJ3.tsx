// Contact form (Journal 3 style). Validation matches the other journals; submission goes through actions.onContact.
import { useMemo, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { copyText } from '../../../core/lib/clipboard'
import type { FormErrors } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import * as v from '../../../core/lib/validators'
import type { ContactTicketInput } from '../../../core/types'
import { Check, Copy } from '../icons'
import { Button } from './Button'
import { fieldClass, FormFieldJ3 } from './StaticFormPartsJ3'
import { useToast } from './Toast'

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

export function ContactFormJ3({ onSubmit }: { onSubmit: (v: ContactTicketInput) => Promise<{ ticketId: string }> }) {
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
      <div role="status" className="rounded-sheet bg-iris-50 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-iris-700 text-white"><Check className="h-6 w-6" aria-hidden="true" /></span>
        <h3 className="mt-4 font-jakarta text-[1.625rem] font-extrabold tracking-tight text-night-900">Your message has been received</h3>
        <p className="mt-2 text-base text-mauve-700">Ticket <strong className="font-jakarta text-night-900">{ticket}</strong> was created. We reply to {f.email} within two working days.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={async () => toast((await copyText(ticket)) ? 'Ticket ID copied' : 'Could not copy')}><Copy className="h-4 w-4" aria-hidden="true" />Copy ticket ID</Button>
          <Button variant="primary" onClick={() => { setF(empty); setTicket(null); reset() }}>Send another</Button>
        </div>
      </div>
    )
  }

  return (
    <form ref={ref} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} aria-label="Contact form" aria-busy={busy}
      className="space-y-5 rounded-sheet bg-iris-50 p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormFieldJ3 label="Your name" name="name" required error={errors.name}>
          <input className={fieldClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} />
        </FormFieldJ3>
        <FormFieldJ3 label="Email" name="email" required error={errors.email}>
          <input type="email" className={fieldClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} />
        </FormFieldJ3>
        <FormFieldJ3 label="Topic" name="topic" required error={errors.topic}>
          <select className={fieldClass(errors.topic)} value={f.topic} onChange={(e) => set('topic', e.target.value)}><option value="">Select a topic</option>{TOPICS.map((t) => <option key={t}>{t}</option>)}</select>
        </FormFieldJ3>
        <FormFieldJ3 label="Paper ID (optional)" name="paperId" error={errors.paperId} hint="Include it if you are asking about a submission.">
          <input className={fieldClass(errors.paperId)} value={f.paperId} maxLength={15} spellCheck={false} placeholder={`${journal.paperIdPrefix}2026000078`} onChange={(e) => set('paperId', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} />
        </FormFieldJ3>
      </div>
      <FormFieldJ3 label="Message" name="message" required error={errors.message} counter={`${f.message.length} / ${MAX}`}>
        <textarea rows={6} className={fieldClass(errors.message)} value={f.message} maxLength={MAX} onChange={(e) => set('message', e.target.value)} />
      </FormFieldJ3>
      <Button type="submit" variant="primary" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</Button>
    </form>
  )
}
