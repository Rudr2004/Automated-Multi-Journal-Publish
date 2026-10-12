// Sections B and C: corresponding author, and co-authors plus an optional academic supervisor / mentor (add / remove).
import { useState } from 'react'
import { journal } from '../../../../config/journals'
import { COUNTRIES, DIAL_CODES, LIMITS, type SubmissionForm } from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, phoneMaxLength } from '../../../../core/lib/validators'
import { Fingerprint, PersonAdd, PersonI, School, Trash } from './mi'
import { Fld, Section, cleanEmail, cleanName, inp, softBtn, type SectionProps } from './shared'

export function AuthorsSection({ form, errors, setForm }: SectionProps) {
  const a = form.author
  const [mentorOpen, setMentorOpen] = useState(false)
  const showMentor = mentorOpen || !!form.mentor || !!errors.mentor
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => setForm((f) => ({ ...f, author: { ...f.author, ...patch } }))
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    setForm((f) => ({ ...f, coAuthors: f.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  const addCo = () => setForm((f) => ({ ...f, coAuthors: [...f.coAuthors, { id: Date.now(), name: '', email: '', institution: '' }] }))
  const removeCo = (id: number) => setForm((f) => ({ ...f, coAuthors: f.coAuthors.filter((c) => c.id !== id) }))
  const maxPhone = phoneMaxLength(a.dialCode)
  const remove = 'inline-flex min-h-[44px] items-center gap-1 rounded px-2 font-work text-xs font-semibold text-red-700 hover:bg-[#E9EDFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800'
  return (
    <>
      <Section letter="B" id="authors" title="Corresponding Author Details" note="Primary Contact" tone="secondary">
        <div className="grid gap-5 sm:grid-cols-12">
          <Fld className="sm:col-span-6" label="Full Legal Name" name="author.name" required error={errors['author.name']}>
            <input className={inp(errors['author.name'])} value={a.name} maxLength={LIMITS.name} autoComplete="name" placeholder="e.g. Ramesh V. Kulkarni"
              onChange={(e) => setAuthor({ name: cleanName(e.target.value) })} onBlur={() => setAuthor({ name: a.name.trim() })} />
          </Fld>
          <Fld className="sm:col-span-6" label="Email" name="author.email" required error={errors['author.email']} hint="Used with your Paper ID to track the paper. No account is needed.">
            <input type="email" className={inp(errors['author.email'])} value={a.email} maxLength={LIMITS.email} autoComplete="email" inputMode="email" placeholder="name@institution.edu"
              onChange={(e) => setAuthor({ email: cleanEmail(e.target.value) })} onBlur={() => setAuthor({ email: a.email.trim().toLowerCase() })} />
          </Fld>
          <Fld className="sm:col-span-8" label="Institutional Affiliation & Department" name="author.institution" required error={errors['author.institution']}>
            <input className={inp(errors['author.institution'])} value={a.institution} maxLength={LIMITS.institution} autoComplete="organization" placeholder="e.g. Department of Civil Engineering, National Institute of Technology"
              onChange={(e) => setAuthor({ institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setAuthor({ institution: a.institution.trim() })} />
          </Fld>
          <Fld className="sm:col-span-4" label="Country / Region" name="author.country" required error={errors['author.country']}>
            <select className={inp(errors['author.country'])} value={a.country} autoComplete="country-name" onChange={(e) => setAuthor({ country: e.target.value })}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Fld>
          <div className="grid gap-3 sm:col-span-6 sm:grid-cols-[8.5rem_1fr]">
            <Fld label="Country code" name="author.dialCode" required>
              <select className={inp()} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
                {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
              </select>
            </Fld>
            <Fld label="WhatsApp / Mobile Contact" name="author.whatsapp" required error={errors['author.whatsapp']}
              hint={a.dialCode === '+91' ? '10-digit mobile number. Updates are also sent here.' : 'Number without the country code. Updates are also sent here.'}>
              <input type="tel" inputMode="numeric" className={inp(errors['author.whatsapp'])} value={a.whatsapp} maxLength={maxPhone} autoComplete="tel-national"
                placeholder={a.dialCode === '+91' ? journal.whatsapp.replace(/^\+91\s?/, '').replace(/\s/g, '') : '5551234567'}
                onChange={(e) => setAuthor({ whatsapp: digitsOnly(e.target.value).slice(0, maxPhone) })} />
            </Fld>
          </div>
          <Fld className="sm:col-span-6" label="Author ORCID Identifier" name="author.orcid" optional error={errors['author.orcid']} hint="Format: 0000-0002-1825-0097"
            icon={<Fingerprint aria-hidden="true" className="pointer-events-none absolute left-2.5 top-3 h-5 w-5 text-ochre-700" />}>
            <input className={inp(errors['author.orcid'], 'pl-9')} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
          </Fld>
        </div>
      </Section>

      <Section letter="C" id="coauthors" title="Co-Authors & Academic Supervisors / Mentors" note="Multi-Author Indexing">
        <p className="font-serif4 text-[15px] leading-6 text-[#564241]" aria-live="polite">
          Add contributing research scholars and faculty mentors in exact order. Every listed co-author receives a certificate after publication.
          {' '}{form.coAuthors.length === 0 ? 'None added yet.' : `${form.coAuthors.length} added (maximum 15).`}
        </p>
        <div className="flex flex-col gap-4">
          {form.coAuthors.map((c, i) => (
            <div key={c.id} className="flex flex-col gap-4 rounded-xl border border-[#DCC0BE]/40 bg-[#F1F3FF] p-4 shadow-sm sm:p-5">
              <div className="flex items-center justify-between rounded-lg bg-[#E9EDFF] px-3 py-1.5">
                <span className="flex items-center gap-2 font-work text-xs font-bold text-wine-900"><PersonI className="h-5 w-5" aria-hidden="true" />Co-Author #{i + 2}</span>
                <button type="button" onClick={() => removeCo(c.id)} aria-label={`Remove co-author ${i + 1}`} className={remove}><Trash className="h-4 w-4" aria-hidden="true" />Remove</button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Fld label="Full Legal Name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                  <input className={inp(errors[`co.${c.id}.name`])} value={c.name} maxLength={LIMITS.name} placeholder="Full name" onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
                </Fld>
                <Fld label="Email" name={`co.${c.id}.email`} required error={errors[`co.${c.id}.email`]}>
                  <input type="email" className={inp(errors[`co.${c.id}.email`])} value={c.email} maxLength={LIMITS.email} placeholder="name@institution.edu" onChange={(e) => setCo(c.id, { email: cleanEmail(e.target.value) })} onBlur={() => setCo(c.id, { email: c.email.trim().toLowerCase() })} />
                </Fld>
              </div>
              <Fld label="Affiliation & University" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]}>
                <input className={inp(errors[`co.${c.id}.institution`])} value={c.institution} maxLength={LIMITS.institution} placeholder="e.g. Department of Mechanical Engineering, IIT Bombay" onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
              </Fld>
            </div>
          ))}

          {showMentor && (
            <div className="flex flex-col gap-4 rounded-xl border border-ochre-700/30 bg-[#F1F3FF] p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-[#FFDBCA]/50 px-3 py-1.5">
                <span className="flex items-center gap-2 font-work text-xs font-bold text-[#763300]">
                  <School className="h-5 w-5 text-ochre-700" aria-hidden="true" />Academic Supervisor / Mentor
                  <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-ochre-700">Advisory Role</span>
                </span>
                <button type="button" onClick={() => { setForm((f) => ({ ...f, mentor: '' })); setMentorOpen(false) }} aria-label="Remove mentor" className={remove}><Trash className="h-4 w-4" aria-hidden="true" />Remove</button>
              </div>
              <div className="md:max-w-lg">
                <Fld label="Mentor Full Name" name="mentor" optional error={errors.mentor}>
                  <input className={inp(errors.mentor)} value={form.mentor} maxLength={LIMITS.mentor} placeholder="e.g. Prof. David Miller" onChange={(e) => setForm((f) => ({ ...f, mentor: cleanName(e.target.value) }))} onBlur={() => setForm((f) => ({ ...f, mentor: f.mentor.trim() }))} />
                </Fld>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3 pt-2 sm:grid-cols-2">
          <button type="button" disabled={form.coAuthors.length >= 15} onClick={addCo} className={softBtn + ' w-full py-3'}><PersonAdd className="h-5 w-5" aria-hidden="true" />+ Add Co-Author</button>
          <button type="button" disabled={showMentor} onClick={() => setMentorOpen(true)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-ochre-700/30 bg-[#FFDBCA] px-4 py-3 font-work text-[13px] font-bold text-[#331200] shadow-sm transition-colors hover:bg-[#FFB68E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800 disabled:cursor-not-allowed disabled:opacity-60">
            <School className="h-5 w-5 text-ochre-700" aria-hidden="true" />+ Add Mentor / Academic Supervisor
          </button>
        </div>
      </Section>
    </>
  )
}
