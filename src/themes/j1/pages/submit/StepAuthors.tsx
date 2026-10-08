import { Plus, Trash2 } from '../../components/uiIcons'
import { Button } from '../../components/Button'
import { Field, inputClass } from '../../components/form'
import { COUNTRIES, DIAL_CODES, LIMITS, type SubmissionForm } from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, phoneMaxLength } from '../../../../core/lib/validators'
import type { StepProps } from './types'

// Input sanitisers: keep obviously invalid characters out as the user types.
const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
const cleanEmail = (s: string) => s.replace(/\s/g, '')

export function StepAuthors({ form, errors, onChange }: StepProps) {
  const a = form.author
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => onChange({ ...form, author: { ...a, ...patch } })
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    onChange({ ...form, coAuthors: form.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
  const addCo = () => onChange({ ...form, coAuthors: [...form.coAuthors, { id: Date.now(), name: '', email: '', institution: '' }] })
  const removeCo = (id: number) => onChange({ ...form, coAuthors: form.coAuthors.filter((c) => c.id !== id) })
  const maxPhone = phoneMaxLength(a.dialCode)

  return (
    <div className="space-y-8">
      <fieldset className="space-y-5">
        <legend className="font-serif text-lg font-semibold text-navy">Corresponding author</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="author.name" required error={errors['author.name']}>
            <input className={inputClass(errors['author.name'])} value={a.name} maxLength={LIMITS.name} autoComplete="name"
              onChange={(e) => setAuthor({ name: cleanName(e.target.value) })} onBlur={() => setAuthor({ name: a.name.trim() })} />
          </Field>
          <Field label="Email" name="author.email" required error={errors['author.email']}>
            <input type="email" className={inputClass(errors['author.email'])} value={a.email} maxLength={LIMITS.email} autoComplete="email" inputMode="email"
              onChange={(e) => setAuthor({ email: cleanEmail(e.target.value) })} onBlur={() => setAuthor({ email: a.email.trim().toLowerCase() })} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-[200px_1fr]">
          <Field label="Country code" name="author.dialCode">
            <select className={inputClass()} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
              {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
            </select>
          </Field>
          <Field label="WhatsApp number" name="author.whatsapp" required error={errors['author.whatsapp']}
            hint={a.dialCode === '+91' ? '10-digit mobile number. Your Paper ID and updates are sent here.' : 'Number without the country code. Your Paper ID and updates are sent here.'}>
            <input type="tel" inputMode="numeric" className={inputClass(errors['author.whatsapp'])} value={a.whatsapp} maxLength={maxPhone} autoComplete="tel-national"
              onChange={(e) => setAuthor({ whatsapp: digitsOnly(e.target.value).slice(0, maxPhone) })} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Institution" name="author.institution" required error={errors['author.institution']}>
            <input className={inputClass(errors['author.institution'])} value={a.institution} maxLength={LIMITS.institution} autoComplete="organization"
              onChange={(e) => setAuthor({ institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setAuthor({ institution: a.institution.trim() })} />
          </Field>
          <Field label="Country" name="author.country" required error={errors['author.country']}>
            <select className={inputClass(errors['author.country'])} value={a.country} onChange={(e) => setAuthor({ country: e.target.value })}>{COUNTRIES.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
        </div>
        <Field label="ORCID iD (optional)" name="author.orcid" error={errors['author.orcid']} hint="Format: 0000-0002-1825-0097">
          <input className={inputClass(errors['author.orcid'])} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000"
            onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
        </Field>
      </fieldset>

      <section aria-labelledby="co-h">
        <div className="flex items-center justify-between">
          <h3 id="co-h" className="font-serif text-lg font-semibold text-navy">Co-authors</h3>
          <Button variant="secondary" size="sm" disabled={form.coAuthors.length >= 15} onClick={addCo}><Plus className="h-4 w-4" aria-hidden />Add co-author</Button>
        </div>
        {form.coAuthors.length === 0 && <p className="mt-2 text-sm text-ink-muted">No co-authors added. Each listed co-author receives a certificate after publication.</p>}
        <ul className="mt-4 space-y-4">
          {form.coAuthors.map((c, i) => (
            <li key={c.id} className="rounded-card border border-line bg-mist p-4">
              <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold">Co-author {i + 1}</span>
                <button type="button" onClick={() => removeCo(c.id)} aria-label={`Remove co-author ${i + 1}`} className="rounded p-1.5 text-danger hover:bg-white"><Trash2 className="h-4 w-4" aria-hidden /></button></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                  <input className={inputClass(errors[`co.${c.id}.name`])} value={c.name} maxLength={LIMITS.name} onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
                </Field>
                <Field label="Email" name={`co.${c.id}.email`} required error={errors[`co.${c.id}.email`]}>
                  <input type="email" className={inputClass(errors[`co.${c.id}.email`])} value={c.email} maxLength={LIMITS.email} onChange={(e) => setCo(c.id, { email: cleanEmail(e.target.value) })} onBlur={() => setCo(c.id, { email: c.email.trim().toLowerCase() })} />
                </Field>
                <Field label="Institution" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]}>
                  <input className={inputClass(errors[`co.${c.id}.institution`])} value={c.institution} maxLength={LIMITS.institution} onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
                </Field>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
