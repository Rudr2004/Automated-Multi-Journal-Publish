// Reviewer application form. Submission goes through actions.onReviewer and returns a reference.
import { useMemo, useRef, useState } from 'react'
import { copyText } from '../../../../core/lib/clipboard'
import { COUNTRIES, type FormErrors } from '../../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../../core/lib/useVisibleErrors'
import * as v from '../../../../core/lib/validators'
import type { ReviewerApplicationInput } from '../../../../core/types'
import { Copy, Send } from '../../icons'
import { Button } from '../Button'
import { useToast } from '../Toast'
import { CheckField, Field, inputClass, SentPanel } from './fields'

interface Values extends ReviewerApplicationInput { consent: boolean }
const empty: Values = { name: '', email: '', institution: '', country: 'India', areas: '', orcid: '', statement: '', consent: false }

const validate = (f: Values): FormErrors => {
  const e: FormErrors = {}
  const set = (k: string, m: string) => { if (m) e[k] = m }
  set('name', v.personName(f.name))
  set('email', v.email(f.email))
  set('institution', v.textLength(f.institution, 3, 120, 'institution'))
  if (!f.country) e.country = 'Select a country.'
  set('areas', v.keywords(f.areas, 1, 6).replace('keywords', 'areas of expertise'))
  set('orcid', v.orcid(f.orcid))
  const w = v.wordCount(f.statement)
  if (w < 20) e.statement = `Please write at least 20 words (${w} so far).`
  else if (w > 250) e.statement = `Please keep it under 250 words (${w}).`
  if (!f.consent) e.consent = 'Please confirm the declaration.'
  return e
}

export function ReviewerForm({ onSubmit }: { onSubmit: (v: ReviewerApplicationInput) => Promise<{ reference: string }> }) {
  const toast = useToast()
  const [f, setF] = useState<Values>(empty)
  const [busy, setBusy] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const ref = useRef<HTMLFormElement>(null)
  const all = useMemo(() => validate(f), [f])
  const { errors, onBlur, attempt, reset } = useVisibleErrors(all)
  const set = <K extends keyof Values>(k: K, val: Values[K]) => setF((s) => ({ ...s, [k]: val }))

  const submit = async () => {
    if (busy) return
    if (!attempt()) { toast('Please fix the highlighted fields.', 'error'); focusFirstError(ref.current, all); return }
    setBusy(true)
    try {
      const { consent: _consent, ...payload } = f
      setReference((await onSubmit(payload)).reference)
    } catch { toast('Could not send your application. Please try again.', 'error') } finally { setBusy(false) }
  }

  if (reference) {
    return (
      <SentPanel title="Application received" actions={<>
        <Button variant="outline" onClick={async () => toast((await copyText(reference)) ? 'Reference copied' : 'Could not copy')}><Copy className="h-4 w-4" aria-hidden="true" />Copy reference</Button>
        <Button onClick={() => { setF(empty); setReference(null); reset() }}>Submit another</Button>
      </>}>
        <p>Reference <strong className="font-semibold tabular-nums text-obsidian-900">{reference}</strong>. The editorial office will review your profile and write to {f.email}.</p>
      </SentPanel>
    )
  }

  return (
    <form ref={ref} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} aria-label="Reviewer application" aria-busy={busy}
      className="space-y-5 rounded border border-[#E6DCD0] bg-white p-5 sm:p-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={errors.name}><input className={inputClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} /></Field>
        <Field label="Email" name="email" required error={errors.email}><input type="email" className={inputClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} /></Field>
        <Field label="Institution or organisation" name="institution" required error={errors.institution}><input className={inputClass(errors.institution)} value={f.institution} maxLength={120} autoComplete="organization" onChange={(e) => set('institution', e.target.value)} /></Field>
        <Field label="Country" name="country" required error={errors.country}><select className={inputClass(errors.country)} value={f.country} onChange={(e) => set('country', e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <Field label="Areas of expertise" name="areas" required error={errors.areas} hint="Up to 6, separated by commas.">
        <input className={inputClass(errors.areas)} value={f.areas} maxLength={200} placeholder="e.g. quantum materials, computational chemistry, applied statistics" onChange={(e) => set('areas', e.target.value)} />
      </Field>
      <Field label="ORCID iD (optional)" name="orcid" error={errors.orcid} hint="Format: 0000-0002-1825-0097">
        <input className={inputClass(errors.orcid)} value={f.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => set('orcid', v.formatOrcid(e.target.value))} />
      </Field>
      <Field label="Why would you like to review?" name="statement" required error={errors.statement} counter={`${v.wordCount(f.statement)} / 250 words`}>
        <textarea rows={5} className={inputClass(errors.statement)} value={f.statement} onChange={(e) => set('statement', e.target.value)} />
      </Field>
      <CheckField name="consent" checked={f.consent} error={errors.consent} onChange={(c) => set('consent', c)}>
        I have research or professional experience in the areas I listed. I will follow the reviewer guidelines, keep manuscripts confidential and declare any conflict of interest.
      </CheckField>
      <Button type="submit" variant="cta" disabled={busy} className="min-h-[44px]"><Send className="h-4 w-4" aria-hidden="true" />{busy ? 'Sending…' : 'Submit application'}</Button>
    </form>
  )
}
