import { CheckCircle2 } from '../../components/uiIcons'
import { useMemo, useRef, useState } from 'react'
import { CopyButton } from '../../components/ArticleParts'
import { Button } from '../../components/Button'
import { Checkbox, Field, inputClass } from '../../components/form'
import { useToast } from '../../components/Toast'
import { COUNTRIES, wordCount, type FormErrors } from '../../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../../core/lib/useVisibleErrors'
import * as v from '../../../../core/lib/validators'

interface Values { name: string; email: string; institution: string; country: string; areas: string; orcid: string; statement: string; consent: boolean }
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
  const w = wordCount(f.statement)
  if (w < 20) e.statement = `Please write at least 20 words (${w} so far).`
  else if (w > 250) e.statement = `Please keep it under 250 words (${w}).`
  if (!f.consent) e.consent = 'Please confirm the declaration.'
  return e
}

/** Reviewer application form (simulated). */
export function ReviewerForm({ onSubmit }: { onSubmit: (v: Omit<Values, 'consent'>) => Promise<{ reference: string }> }) {
  const toast = useToast()
  const [f, setF] = useState<Values>(empty)
  const [busy, setBusy] = useState(false)
  const [ref, setRef] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const all = useMemo(() => validate(f), [f])
  const { errors, onBlur, attempt, reset } = useVisibleErrors(all)
  const set = <K extends keyof Values>(k: K, val: Values[K]) => setF((s) => ({ ...s, [k]: val }))

  const submit = async () => {
    if (!attempt()) { toast('Please fix the highlighted fields.', 'error'); focusFirstError(formRef.current, all); return }
    setBusy(true)
    try { const { consent: _c, ...payload } = f; setRef((await onSubmit(payload)).reference) } catch { toast('Could not send your application. Please try again.', 'error') } finally { setBusy(false) }
  }

  if (ref) {
    return (
      <div role="status" className="rounded-card border border-oa/40 bg-oa-soft p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-oa" aria-hidden />
        <h3 className="mt-2 font-serif text-xl font-semibold text-navy">Application received</h3>
        <p className="mt-1 text-sm">Reference <strong>{ref}</strong>. The editorial office will review your profile and contact you at {f.email}.</p>
        <div className="mt-4 flex justify-center gap-2"><CopyButton text={ref} label="Copy reference" /><Button size="sm" variant="secondary" onClick={() => { setF(empty); setRef(null); reset() }}>Submit another</Button></div>
      </div>
    )
  }

  return (
    <form ref={formRef} noValidate onBlur={onBlur} onSubmit={(e) => { e.preventDefault(); void submit() }} className="space-y-5 rounded-card border border-line bg-white p-5 sm:p-6" aria-label="Reviewer application">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={errors.name}><input className={inputClass(errors.name)} value={f.name} maxLength={80} autoComplete="name" onChange={(e) => set('name', e.target.value.replace(/[^\p{L}\s.'’-]/gu, ''))} /></Field>
        <Field label="Email" name="email" required error={errors.email}><input type="email" className={inputClass(errors.email)} value={f.email} maxLength={120} autoComplete="email" onChange={(e) => set('email', e.target.value.replace(/\s/g, ''))} /></Field>
        <Field label="Institution" name="institution" required error={errors.institution}><input className={inputClass(errors.institution)} value={f.institution} maxLength={120} autoComplete="organization" onChange={(e) => set('institution', e.target.value)} /></Field>
        <Field label="Country" name="country" required error={errors.country}><select className={inputClass(errors.country)} value={f.country} onChange={(e) => set('country', e.target.value)}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select></Field>
      </div>
      <Field label="Areas of expertise" name="areas" required error={errors.areas} hint="Up to 6, separated by commas.">
        <input className={inputClass(errors.areas)} value={f.areas} maxLength={200} placeholder="e.g. polymer composites, fatigue, nanomaterials" onChange={(e) => set('areas', e.target.value)} />
      </Field>
      <Field label="ORCID iD (optional)" name="orcid" error={errors.orcid} hint="Format: 0000-0002-1825-0097">
        <input className={inputClass(errors.orcid)} value={f.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => set('orcid', v.formatOrcid(e.target.value))} />
      </Field>
      <Field label="Why would you like to review?" name="statement" required error={errors.statement} counter={`${wordCount(f.statement)} / 250 words`}>
        <textarea rows={5} className={inputClass(errors.statement)} value={f.statement} onChange={(e) => set('statement', e.target.value)} />
      </Field>
      <Checkbox name="consent" checked={f.consent} error={errors.consent} onChange={(c) => set('consent', c)}>I hold a PhD or equivalent experience and will follow the journal’s reviewer guidelines and confidentiality rules.</Checkbox>
      <Button type="submit" size="lg" loading={busy}>Submit application</Button>
    </form>
  )
}
