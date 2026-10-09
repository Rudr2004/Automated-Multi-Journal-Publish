// Section 02: corresponding author and co-authors (add / remove).
import { journal } from '../../../../config/journals'
import { COUNTRIES, DIAL_CODES, LIMITS, type SubmissionForm } from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, phoneMaxLength } from '../../../../core/lib/validators'
import { Button } from '../../components/Button'
import { Field, fieldInput } from '../../components/form/Field'
import { Section, Sub, cleanEmail, cleanName, type SectionProps } from './shared'

export function AuthorsSection({ form, errors, setForm }: SectionProps) {
  const a = form.author
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => setForm((f) => ({ ...f, author: { ...f.author, ...patch } }))
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    setForm((f) => ({ ...f, coAuthors: f.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  const addCo = () => setForm((f) => ({ ...f, coAuthors: [...f.coAuthors, { id: Date.now(), name: '', email: '', institution: '' }] }))
  const removeCo = (id: number) => setForm((f) => ({ ...f, coAuthors: f.coAuthors.filter((c) => c.id !== id) }))
  const maxPhone = phoneMaxLength(a.dialCode)
  return (
    <Section n={2} id="authors" title="Authors" text="The corresponding author receives the Paper ID and every status update.">
      <fieldset className="space-y-5">
        <legend className="mb-3"><Sub>Corresponding author</Sub></legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="author.name" required error={errors['author.name']}>
            <input className={fieldInput(errors['author.name'])} value={a.name} maxLength={LIMITS.name} autoComplete="name"
              onChange={(e) => setAuthor({ name: cleanName(e.target.value) })} onBlur={() => setAuthor({ name: a.name.trim() })} />
          </Field>
          <Field label="Email" name="author.email" required error={errors['author.email']} hint="Used with your Paper ID to track the paper. No account is needed.">
            <input type="email" className={fieldInput(errors['author.email'])} value={a.email} maxLength={LIMITS.email} autoComplete="email" inputMode="email" placeholder="name@institution.edu"
              onChange={(e) => setAuthor({ email: cleanEmail(e.target.value) })} onBlur={() => setAuthor({ email: a.email.trim().toLowerCase() })} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_1fr]">
          <Field label="Country code" name="author.dialCode" required>
            <select className={fieldInput()} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
              {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
            </select>
          </Field>
          <Field label="WhatsApp number" name="author.whatsapp" required error={errors['author.whatsapp']}
            hint={a.dialCode === '+91' ? '10-digit mobile number. Updates are also sent here.' : 'Number without the country code. Updates are also sent here.'}>
            <input type="tel" inputMode="numeric" className={fieldInput(errors['author.whatsapp'])} value={a.whatsapp} maxLength={maxPhone} autoComplete="tel-national"
              placeholder={a.dialCode === '+91' ? journal.whatsapp.replace(/^\+91\s?/, '').replace(/\s/g, '') : '5551234567'}
              onChange={(e) => setAuthor({ whatsapp: digitsOnly(e.target.value).slice(0, maxPhone) })} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Affiliation (institution)" name="author.institution" required error={errors['author.institution']}>
            <input className={fieldInput(errors['author.institution'])} value={a.institution} maxLength={LIMITS.institution} autoComplete="organization"
              onChange={(e) => setAuthor({ institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setAuthor({ institution: a.institution.trim() })} />
          </Field>
          <Field label="Country" name="author.country" required error={errors['author.country']}>
            <select className={fieldInput(errors['author.country'])} value={a.country} autoComplete="country-name" onChange={(e) => setAuthor({ country: e.target.value })}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="sm:max-w-sm">
          <Field label="ORCID iD" name="author.orcid" optional error={errors['author.orcid']} hint="Format: 0000-0002-1825-0097">
            <input className={fieldInput(errors['author.orcid'])} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
          </Field>
        </div>
      </fieldset>

      <div role="group" aria-labelledby="co-h" className="border-t border-[#E6DCD0] pt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Sub className="" ><span id="co-h">Co-authors</span></Sub>
            <p className="mt-0.5 text-sm text-obsidian-600" aria-live="polite">{form.coAuthors.length === 0 ? 'None added. Every listed co-author receives a certificate after publication.' : `${form.coAuthors.length} added (maximum 15)`}</p>
          </div>
          <Button variant="outline" disabled={form.coAuthors.length >= 15} onClick={addCo} className="min-h-[44px]">Add co-author</Button>
        </div>
        {form.coAuthors.length > 0 && (
          <div className="mt-4 overflow-hidden rounded border border-[#E6DCD0]">
            <ol>
              {form.coAuthors.map((c, i) => (
                <li key={c.id} className="border-b border-[#E6DCD0] bg-[#F4EEE6] p-4 last:border-b-0">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold tabular-nums text-obsidian-900">Co-author {i + 1}</span>
                    <button type="button" onClick={() => removeCo(c.id)} aria-label={`Remove co-author ${i + 1}`} className="min-h-[44px] rounded px-3 text-sm font-semibold text-red-700 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">Remove</button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Field label="Name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                      <input className={fieldInput(errors[`co.${c.id}.name`])} value={c.name} maxLength={LIMITS.name} onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
                    </Field>
                    <Field label="Email" name={`co.${c.id}.email`} required error={errors[`co.${c.id}.email`]}>
                      <input type="email" className={fieldInput(errors[`co.${c.id}.email`])} value={c.email} maxLength={LIMITS.email} onChange={(e) => setCo(c.id, { email: cleanEmail(e.target.value) })} onBlur={() => setCo(c.id, { email: c.email.trim().toLowerCase() })} />
                    </Field>
                    <Field label="Affiliation" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]}>
                      <input className={fieldInput(errors[`co.${c.id}.institution`])} value={c.institution} maxLength={LIMITS.institution} onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
                    </Field>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </Section>
  )
}
