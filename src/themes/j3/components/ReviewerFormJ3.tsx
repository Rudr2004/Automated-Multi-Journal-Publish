// Reviewer application form (Journal 3 style). Submission goes through actions.onReviewer.
import { useMemo, useRef, useState } from 'react'
import { copyText } from '../../../core/lib/clipboard'
import { COUNTRIES, type FormErrors } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import * as v from '../../../core/lib/validators'
import type { ReviewerApplicationInput } from '../../../core/types'
import { Check, Copy } from '../icons'
import { Button } from './Button'
import { fieldClass, FormCheckboxJ3, FormFieldJ3 } from './StaticFormPartsJ3'
import { useToast } from './Toast'

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

export function ReviewerFormJ3({ onSubmit }: { onSubmit: (v: ReviewerApplicationInput) => Promise<{ reference: string }> }) {
  const toast = useToast()
  const [f, setF] = useState<Values>(empty)
  const [busy, setBusy] = useState(false)
  const [reference, setReference] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const all = useMemo(() => validate(f), [f])
  const { errors, onBlur, attempt, reset } = useVisibleErrors(all)
  const set = <K extends keyof Values>(k: K, val: Values[K]) => setF((s) => ({ ...s, [k]: val }))

  const submit = async () => {
    if (busy) return
    if (!attempt()) { toast('Please fix the highlighted fields.', 'error'); focusFirstError(formRef.current, all); return }
    setBusy(true)
    try {
      const { consent: _consent, ...payload } = f
      setReference((await onSubmit(payload)).reference)
    } catch { toast('Could not send your application. Please try again.', 'error') } finally { setBusy(false) }
  }

  if (reference) {
    return (
      <div role="status" className="rounded-sheet bg-iris-50 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-iris-700 text-white"><Check className="h-6 w-6" aria-hidden="true" /></span>
        <h3 className="mt-4 font-jakarta text-[1.625rem] font-extrabold tracking-tight text-night-900">Application received</h3>
        <p className="mt-2 text-base text-mauve-700">Reference <strong className="font-jakarta text-night-900">{reference}</strong>. The editorial office will review your profile and write to {f.email}.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button variant="outline" onClick={async () => toast((await copyText(reference)) ? 'Reference copied' : 'Could not copy')}><Copy className="h-4 w-4" aria-hidden="true" />Copy reference</Button>
          <Button variant="primary" onClick={() => { setF(empty); setReference(null); reset() }}>Submit another</Button>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} aria-label="Reviewer application" aria-busy={busy}
      className="space-y-5 rounded-sheet bg-iris-50 p-5 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormFieldJ3 label="Full name" name="name" required error={errors.name}><input className={fieldClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} /></FormFieldJ3>
        <FormFieldJ3 label="Email" name="email" required error={errors.email}><input type="email" className={fieldClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} /></FormFieldJ3>
        <FormFieldJ3 label="Institution" name="institution" required error={errors.institution}><input className={fieldClass(errors.institution)} value={f.institution} maxLength={120} autoComplete="organization" onChange={(e) => set('institution', e.target.value)} /></FormFieldJ3>
        <FormFieldJ3 label="Country" name="country" required error={errors.country}><select className={fieldClass(errors.country)} value={f.country} onChange={(e) => set('country', e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></FormFieldJ3>
      </div>
      <FormFieldJ3 label="Areas of expertise" name="areas" required error={errors.areas} hint="Up to 6, separated by commas.">
        <input className={fieldClass(errors.areas)} value={f.areas} maxLength={200} placeholder="e.g. design research, museum studies, oral history" onChange={(e) => set('areas', e.target.value)} />
      </FormFieldJ3>
      <FormFieldJ3 label="ORCID iD (optional)" name="orcid" error={errors.orcid} hint="Format: 0000-0002-1825-0097">
        <input className={fieldClass(errors.orcid)} value={f.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => set('orcid', v.formatOrcid(e.target.value))} />
      </FormFieldJ3>
      <FormFieldJ3 label="Why would you like to review?" name="statement" required error={errors.statement} counter={`${v.wordCount(f.statement)} / 250 words`}>
        <textarea rows={5} className={fieldClass(errors.statement)} value={f.statement} onChange={(e) => set('statement', e.target.value)} />
      </FormFieldJ3>
      <FormCheckboxJ3 name="consent" checked={f.consent} error={errors.consent} onChange={(c) => set('consent', c)}>
        I have research or professional experience in the areas I listed. I will follow the reviewer guidelines, keep manuscripts confidential and declare any conflict of interest.
      </FormCheckboxJ3>
      <Button type="submit" variant="primary" disabled={busy}>{busy ? 'Sending…' : 'Submit application'}</Button>
    </form>
  )
}
