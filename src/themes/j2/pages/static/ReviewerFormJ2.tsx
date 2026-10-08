import { useMemo, useRef, useState } from 'react'
import { Button } from '../../components/Button'
import { FormCheckbox, FormField, fieldClass } from '../../components/StaticFormParts'
import { useToast } from '../../components/Toast'
import { Check, Copy } from '../../icons'
import { copyText } from '../../../../core/lib/clipboard'
import { COUNTRIES, type FormErrors } from '../../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../../core/lib/useVisibleErrors'
import * as v from '../../../../core/lib/validators'
import type { ReviewerApplicationInput } from '../../../../core/types'

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

export function ReviewerFormJ2({ onSubmit }: { onSubmit: (v: ReviewerApplicationInput) => Promise<{ reference: string }> }) {
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
      <div role="status" className="rounded-panel border border-brand-200 bg-brand-50 p-6 text-center">
        <Check className="mx-auto h-10 w-10 rounded-full bg-brand-800 p-2 text-white" aria-hidden="true" />
        <h3 className="mt-3 font-display text-xl font-semibold text-graphite-800">Application received</h3>
        <p className="mt-1 text-sm text-graphite-700">Reference <strong>{reference}</strong>. The editorial office will review your profile and write to {f.email}.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button variant="outline" onClick={async () => toast((await copyText(reference)) ? 'Reference copied' : 'Could not copy', 'success')}><Copy className="h-4 w-4" aria-hidden="true" />Copy reference</Button>
          <Button variant="secondary" onClick={() => { setF(empty); setReference(null); reset() }}>Submit another</Button>
        </div>
      </div>
    )
  }

  return (
    <form ref={formRef} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} aria-label="Reviewer application" aria-busy={busy}
      className="space-y-5 rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:p-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Full name" name="name" required error={errors.name}><input className={fieldClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} /></FormField>
        <FormField label="Email" name="email" required error={errors.email}><input type="email" className={fieldClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} /></FormField>
        <FormField label="Institution" name="institution" required error={errors.institution}><input className={fieldClass(errors.institution)} value={f.institution} maxLength={120} autoComplete="organization" onChange={(e) => set('institution', e.target.value)} /></FormField>
        <FormField label="Country" name="country" required error={errors.country}><select className={fieldClass(errors.country)} value={f.country} onChange={(e) => set('country', e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></FormField>
      </div>
      <FormField label="Areas of expertise" name="areas" required error={errors.areas} hint="Up to 6, separated by commas.">
        <input className={fieldClass(errors.areas)} value={f.areas} maxLength={200} placeholder="e.g. machine learning, soil science, polymer composites" onChange={(e) => set('areas', e.target.value)} />
      </FormField>
      <FormField label="ORCID iD (optional)" name="orcid" error={errors.orcid} hint="Format: 0000-0002-1825-0097">
        <input className={fieldClass(errors.orcid)} value={f.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => set('orcid', v.formatOrcid(e.target.value))} />
      </FormField>
      <FormField label="Why would you like to review?" name="statement" required error={errors.statement} counter={`${v.wordCount(f.statement)} / 250 words`}>
        <textarea rows={5} className={fieldClass(errors.statement)} value={f.statement} onChange={(e) => set('statement', e.target.value)} />
      </FormField>
      <FormCheckbox name="consent" checked={f.consent} error={errors.consent} onChange={(c) => set('consent', c)}>I hold a PhD or equivalent research experience and will follow the reviewer guidelines and keep manuscripts confidential.</FormCheckbox>
      <Button type="submit" disabled={busy}>{busy ? 'Sending…' : 'Submit application'}</Button>
    </form>
  )
}
