import { useState } from 'react'
import { MdOutlineWorkspacePremium } from 'react-icons/md'
import { Plus, Trash2 } from '../../components/uiIcons'
import { ProfilePhotoField } from '../../components/ProfilePhotoField'
import { Button } from '../../components/Button'
import { Field, inputClass } from '../../components/form'
import { useDetectedLocation } from '../../../../core/lib/geo'
import { COUNTRIES, DIAL_CODES, LIMITS, type SubmissionForm } from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, phoneMaxLength } from '../../../../core/lib/validators'
import type { StepProps } from './types'

// Input sanitisers: keep obviously invalid characters out as the user types.
const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
const cleanEmail = (s: string) => s.replace(/\s/g, '')

export function StepAuthors({ form, errors, onChange }: StepProps) {
  const a = form.author
  // Co-authors start with the corresponding author's institution and follow it while it is unchanged; each can be edited freely.
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => onChange({
    ...form, author: { ...a, ...patch },
    coAuthors: patch.institution === undefined ? form.coAuthors : form.coAuthors.map((c) => (c.institution === a.institution ? { ...c, institution: patch.institution! } : c)),
    mentorInstitution: patch.institution !== undefined && form.mentorInstitution === a.institution ? patch.institution : form.mentorInstitution,
  })
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    onChange({ ...form, coAuthors: form.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
  const addCo = () => onChange({ ...form, coAuthors: [...form.coAuthors, { id: Date.now(), name: '', email: '', institution: a.institution, orcid: '', photo: null }] })
  const removeCo = (id: number) => onChange({ ...form, coAuthors: form.coAuthors.filter((c) => c.id !== id) })
  const maxPhone = phoneMaxLength(a.dialCode)
  // Country and dialling code are pre-selected from the visitor's IP address (once, and only while they are still the defaults).
  const geoNote = useDetectedLocation(a, setAuthor)
  // The mentor card opens on request (like co-authors); it starts open when a draft already has mentor details.
  // Like co-authors, the mentor's affiliation starts as the corresponding author's and follows it until it is edited.
  const [mentorOpen, setMentorOpen] = useState(Boolean(form.mentor || form.mentorEmail || form.mentorOrcid || form.mentorPhoto || (form.mentorInstitution && form.mentorInstitution !== a.institution)))
  const openMentor = () => { setMentorOpen(true); if (!form.mentorInstitution) onChange({ ...form, mentorInstitution: a.institution }) }
  const removeMentor = () => { setMentorOpen(false); onChange({ ...form, mentor: '', mentorEmail: '', mentorInstitution: '', mentorOrcid: '', mentorPhoto: null }) }

  return (
    <div className="space-y-8">
      <fieldset className="space-y-5">
        <legend className="mb-1 border-b border-line pb-2 font-serif text-lg font-semibold text-navy w-full">Corresponding author</legend>
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
          <Field label="Country code" name="author.dialCode" hint={geoNote || undefined}>
            <select className={inputClass()} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
              {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
            </select>
          </Field>
          <Field label="WhatsApp number" name="author.whatsapp" required error={errors['author.whatsapp']}
            hint={a.dialCode === '+91' ? '10-digit mobile number. Your Manuscript ID and updates are sent here.' : 'Number without the country code. Your Manuscript ID and updates are sent here.'}>
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
        <ProfilePhotoField value={a.photo} onChange={(photo) => setAuthor({ photo })} error={errors['author.photo']} />
        <Field label="ORCID iD (optional)" name="author.orcid" error={errors['author.orcid']} hint="Format: 0000-0002-1825-0097">
          <input className={inputClass(errors['author.orcid'])} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000"
            onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
        </Field>
        <p className="-mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-muted">
          <span className="inline-flex items-center gap-1.5"><span aria-hidden className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#A6CE39] text-[10px] font-bold text-[#1B3A00]">iD</span>Your ORCID links this paper to your research record.</span>
          <a href="https://orcid.org/register" target="_blank" rel="noopener noreferrer" className="font-semibold text-scholar underline">Find or create ORCID ↗<span className="sr-only"> (opens in a new tab)</span></a>
        </p>
      </fieldset>

      <section aria-labelledby="co-h">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h3 id="co-h" className="font-serif text-lg font-semibold text-navy">Co-authors <span className="text-sm font-normal text-ink-muted">({form.coAuthors.length} added)</span></h3>
          <Button variant="outline" size="sm" disabled={form.coAuthors.length >= 15} onClick={addCo}><Plus className="h-4 w-4" aria-hidden />Add co-author</Button>
        </div>
        {form.coAuthors.length === 0 && <p className="mt-2 text-sm text-ink-muted">No co-authors added. Each listed co-author receives a certificate after publication.</p>}
        <ul className="mt-4 space-y-4">
          {form.coAuthors.map((c, i) => (
            <li key={c.id} className="rounded-card border border-line bg-paper p-4">
              <div className="mb-3 flex items-center justify-between"><span className="text-sm font-semibold text-navy">Co-author {i + 1}</span>
                <button type="button" onClick={() => removeCo(c.id)} aria-label={`Remove co-author ${i + 1}`} className="rounded p-1.5 text-danger hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar"><Trash2 className="h-4 w-4" aria-hidden /></button></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                  <input className={inputClass(errors[`co.${c.id}.name`])} value={c.name} maxLength={LIMITS.name} onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
                </Field>
                <Field label="Email (optional)" name={`co.${c.id}.email`} error={errors[`co.${c.id}.email`]}>
                  <input type="email" className={inputClass(errors[`co.${c.id}.email`])} value={c.email} maxLength={LIMITS.email} onChange={(e) => setCo(c.id, { email: cleanEmail(e.target.value) })} onBlur={() => setCo(c.id, { email: c.email.trim().toLowerCase() })} />
                </Field>
                <div>
                  <span className="mb-1.5 block text-sm font-semibold text-navy">Upload Profile Picture <span className="font-normal text-ink-muted">(optional)</span></span>
                  <ProfilePhotoField compact name={`co.${c.id}.photo`} value={c.photo ?? null} onChange={(photo) => setCo(c.id, { photo })} error={errors[`co.${c.id}.photo`]} />
                </div>
                <Field label="Institution / Affiliation" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]} hint="Taken from the corresponding author; edit it if this co-author is elsewhere.">
                  <input className={inputClass(errors[`co.${c.id}.institution`])} value={c.institution} maxLength={LIMITS.institution} onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
                </Field>
                <Field label="ORCID iD (optional)" name={`co.${c.id}.orcid`} error={errors[`co.${c.id}.orcid`]} hint="Format: 0000-0002-1825-0097">
                  <input className={inputClass(errors[`co.${c.id}.orcid`])} value={c.orcid ?? ''} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => setCo(c.id, { orcid: formatOrcid(e.target.value) })} />
                </Field>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="mentor-h">
        <div className="flex items-center justify-between border-b border-line pb-2">
          <h3 id="mentor-h" className="font-serif text-lg font-semibold text-navy">Research guide / mentor <span className="text-sm font-normal text-ink-muted">(optional)</span></h3>
          {!mentorOpen && <Button variant="outline" size="sm" onClick={openMentor}><Plus className="h-4 w-4" aria-hidden />Add mentor</Button>}
        </div>
        {!mentorOpen && <p className="mt-2 text-sm text-ink-muted">None added. Add your supervisor or mentor if the work was done under their guidance. They are acknowledged on the record; no certificate is issued unless they are also a co-author.</p>}
        {mentorOpen && (
          <div className="mt-4 rounded border border-[#E8CF9A] bg-[#FFF8E8] p-4">
            <p className="mb-3 flex gap-2 text-[13px] text-ink"><MdOutlineWorkspacePremium className="mt-0.5 h-5 w-5 shrink-0 text-[#8A4B00]" aria-hidden /><span><strong className="text-[#6B3A00]">Mentor recognition.</strong> Mentors of published papers are eligible for the Monthly Best Research Mentor recognition.</span></p>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-navy">Mentor</span>
              <button type="button" onClick={removeMentor} aria-label="Remove mentor" className="rounded p-1.5 text-danger hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar"><Trash2 className="h-4 w-4" aria-hidden /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Name" name="mentor" required={Boolean(form.mentorEmail.trim() || form.mentorInstitution.trim())} error={errors.mentor}>
                <input className={inputClass(errors.mentor)} value={form.mentor} maxLength={LIMITS.name} onChange={(e) => onChange({ ...form, mentor: cleanName(e.target.value) })} onBlur={() => onChange({ ...form, mentor: form.mentor.trim() })} />
              </Field>
              <Field label="Email (optional)" name="mentorEmail" error={errors.mentorEmail}>
                <input type="email" className={inputClass(errors.mentorEmail)} value={form.mentorEmail} maxLength={LIMITS.email} onChange={(e) => onChange({ ...form, mentorEmail: cleanEmail(e.target.value) })} onBlur={() => onChange({ ...form, mentorEmail: form.mentorEmail.trim().toLowerCase() })} />
              </Field>
              <Field label="Institution / Affiliation" name="mentorInstitution" error={errors.mentorInstitution} hint="Taken from the corresponding author; edit it if the mentor is elsewhere.">
                <input className={inputClass(errors.mentorInstitution)} value={form.mentorInstitution} maxLength={LIMITS.institution} onChange={(e) => onChange({ ...form, mentorInstitution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => onChange({ ...form, mentorInstitution: form.mentorInstitution.trim() })} />
              </Field>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-navy">Upload Profile Picture <span className="font-normal text-ink-muted">(optional)</span></span>
                <ProfilePhotoField compact name="mentor.photo" value={form.mentorPhoto ?? null} onChange={(mentorPhoto) => onChange({ ...form, mentorPhoto })} error={errors['mentor.photo']} />
              </div>
              <Field label="ORCID iD (optional)" name="mentorOrcid" error={errors.mentorOrcid} hint="Format: 0000-0002-1825-0097">
                <input className={inputClass(errors.mentorOrcid)} value={form.mentorOrcid ?? ''} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => onChange({ ...form, mentorOrcid: formatOrcid(e.target.value) })} />
              </Field>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
