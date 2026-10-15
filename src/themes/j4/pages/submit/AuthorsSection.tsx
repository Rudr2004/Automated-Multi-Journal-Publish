// Section B: author and research team (corresponding author with profile photo, co-author cards, optional mentor).
import { useId, useRef, useState } from 'react'
import { journal } from '../../../../config/journals'
import { PHOTO_ACCEPT, PHOTO_MAX_MB, readPhoto, validatePhoto } from '../../../../core/lib/photo'
import { COUNTRIES, DIAL_CODES, LIMITS, type AuthorPhoto, type SubmissionForm } from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, phoneMaxLength } from '../../../../core/lib/validators'
import { cx } from '../../components/primitives'
import { AccountCircle, AddPhoto, Delete, FileUpload, GroupIcon, Info, PersonAdd, PhotoCamera, School, VerifiedIcon } from './mi'
import { RField, Section, cleanEmail, cleanName, refInput, type SectionProps } from './shared'

/** Round profile-photo picker (reference photo box). Reads a 256px square thumbnail; nothing is uploaded in the prototype. */
function PhotoBox({ value, onChange, primary }: { value: AuthorPhoto | null; onChange: (p: AuthorPhoto | null) => void; primary?: boolean }) {
  const input = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)
  const pick = async (file?: File) => {
    if (!file) return
    const bad = validatePhoto(file)
    if (bad) { setMsg(bad); return }
    setBusy(true); setMsg('')
    try { onChange(await readPhoto(file)) } catch (e) { setMsg(e instanceof Error ? e.message : 'Could not read this picture.') } finally { setBusy(false) }
  }
  return (
    <div className={cx('flex flex-col items-center justify-center space-y-2 rounded-lg border p-3 text-center md:col-span-3', primary ? 'border-sky-200 bg-white shadow-sm' : 'border-slate-200 bg-slate-50')}>
      <div className="relative">
        <div className={cx('flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white', primary ? 'bg-gradient-to-br from-[#0b2545] to-sky-600 text-sky-100 ring-2 ring-sky-300' : 'bg-slate-200 text-slate-500 ring-1 ring-slate-300')}>
          {value ? <img src={value.dataUrl} alt="Selected author photo" className="h-full w-full object-cover" /> : <AccountCircle className="h-12 w-12" aria-hidden="true" />}
        </div>
        <button type="button" onClick={() => input.current?.click()} disabled={busy} aria-label={value ? 'Change photo' : 'Upload photo'}
          className={cx('absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600', primary ? 'bg-sky-600 hover:bg-sky-700' : 'bg-slate-700 hover:bg-sky-600')}>
          {primary ? <PhotoCamera className="h-3.5 w-3.5" aria-hidden="true" /> : <AddPhoto className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      </div>
      <div>
        <div className={cx('text-xs font-bold', primary ? 'text-[#0b2545]' : 'text-slate-800')}>{primary ? 'Author Photo (Optional)' : 'Co-Author Photo'}</div>
        <div className="text-[10px] text-slate-500">JPG / PNG (Max {PHOTO_MAX_MB}MB)</div>
      </div>
      <input ref={input} name={primary ? 'author.photo' : undefined} type="file" accept={PHOTO_ACCEPT} className="sr-only" tabIndex={-1} onChange={(e) => { void pick(e.target.files?.[0]); e.target.value = '' }} />
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className="flex min-h-[44px] items-center gap-1 whitespace-nowrap text-[11px] font-semibold text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:min-h-0">
          <FileUpload className="h-3.5 w-3.5" aria-hidden="true" />{busy ? 'Reading…' : value ? 'Change Photo' : 'Choose Photo'}
        </button>
        {value && <button type="button" onClick={() => onChange(null)} className="min-h-[44px] text-[11px] font-semibold text-red-700 hover:underline sm:min-h-0">Remove</button>}
      </div>
      {msg && <p role="alert" className="text-[11px] font-semibold text-red-700">{msg}</p>}
    </div>
  )
}

export function AuthorsSection({ form, errors, setForm }: SectionProps) {
  const a = form.author
  const uid = useId()
  const [mentorOpen, setMentorOpen] = useState(false)
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => setForm((f) => ({ ...f, author: { ...f.author, ...patch } }))
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    setForm((f) => ({ ...f, coAuthors: f.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  const addCo = () => setForm((f) => ({ ...f, coAuthors: [...f.coAuthors, { id: Date.now(), name: '', email: '', institution: f.author.institution, orcid: '', photo: null }] }))
  const removeCo = (id: number) => setForm((f) => ({ ...f, coAuthors: f.coAuthors.filter((c) => c.id !== id) }))
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  const maxPhone = phoneMaxLength(a.dialCode)
  const showMentor = mentorOpen || !!(form.mentor || form.mentorEmail || form.mentorInstitution || errors.mentor || errors.mentorEmail || errors.mentorInstitution)
  return (
    <Section letter="B" id="authors" title="Author & Research Team" text="The corresponding author receives the Manuscript ID and every status update." chip="Step 2 of 4">
      <div className="space-y-4">
        {/* Corresponding author */}
        <fieldset className="relative min-w-0 rounded-xl border-2 border-sky-200 bg-gradient-to-br from-sky-50/50 via-white to-sky-50/30 p-4 shadow-sm md:p-5">
          <legend className="sr-only">Corresponding author</legend>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-sky-100 pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-sky-600 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm"><VerifiedIcon className="h-3.5 w-3.5" aria-hidden="true" />Corresponding Author</span>
              <span className="text-[11px] font-medium text-slate-500">(Primary Submitter)</span>
            </div>
            <span className="font-mono text-[11px] text-slate-500">Author 1 of {form.coAuthors.length + 1}</span>
          </div>
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
            <PhotoBox primary value={a.photo} onChange={(photo) => setAuthor({ photo })} />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:col-span-9">
              <RField label="Full Name (with Honorific)" name="author.name" required error={errors['author.name']}>
                <input className={refInput(errors['author.name'])} value={a.name} maxLength={LIMITS.name} autoComplete="name" onChange={(e) => setAuthor({ name: cleanName(e.target.value) })} onBlur={() => setAuthor({ name: a.name.trim() })} />
              </RField>
              <RField label="Email" name="author.email" required error={errors['author.email']} hint="Used with your Manuscript ID to track the paper. No account is needed.">
                <input type="email" className={refInput(errors['author.email'])} value={a.email} maxLength={LIMITS.email} autoComplete="email" inputMode="email" placeholder="name@institution.edu"
                  onChange={(e) => setAuthor({ email: cleanEmail(e.target.value) })} onBlur={() => setAuthor({ email: a.email.trim().toLowerCase() })} />
              </RField>
              <div>
                <label htmlFor={`${uid}-wa`} className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-slate-700">Contact Number (WhatsApp) <span className="text-red-600" aria-hidden="true">*</span></label>
                <div className="flex gap-2">
                  <select aria-label="Country code" name="author.dialCode" className={cx(refInput(), '!w-[7.5rem] shrink-0 bg-white px-2')} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
                    {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
                  </select>
                  <input id={`${uid}-wa`} name="author.whatsapp" type="tel" inputMode="numeric" aria-required="true" aria-invalid={errors['author.whatsapp'] ? true : undefined} aria-describedby={`${uid}-wa-h`}
                    className={cx(refInput(errors['author.whatsapp']), 'min-w-0 flex-1 bg-white font-medium')} value={a.whatsapp} maxLength={maxPhone} autoComplete="tel-national"
                    placeholder={a.dialCode === '+91' ? journal.whatsapp.replace(/^\+91\s?/, '').replace(/\s/g, '') : '5551234567'}
                    onChange={(e) => setAuthor({ whatsapp: digitsOnly(e.target.value).slice(0, maxPhone) })} />
                </div>
                <p id={`${uid}-wa-h`} className="mt-1.5 text-[11px] italic text-slate-500">{a.dialCode === '+91' ? '10-digit mobile number. Updates are also sent here.' : 'Number without the country code. Updates are also sent here.'}</p>
                {errors['author.whatsapp'] && <p role="alert" className="mt-1.5 text-xs font-semibold text-red-700">{errors['author.whatsapp']}</p>}
              </div>
              <RField label="Country" name="author.country" required error={errors['author.country']}>
                <select className={cx(refInput(errors['author.country']), 'bg-white')} value={a.country} autoComplete="country-name" onChange={(e) => setAuthor({ country: e.target.value })}>
                  {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </RField>
              <RField className="sm:col-span-2" label="Department, Affiliation / University" name="author.institution" required error={errors['author.institution']}>
                <input className={cx(refInput(errors['author.institution']), 'bg-white')} value={a.institution} maxLength={LIMITS.institution} autoComplete="organization"
                  onChange={(e) => setAuthor({ institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setAuthor({ institution: a.institution.trim() })} />
              </RField>
              <RField className="sm:col-span-2" label="ORCID Identifier" optional name="author.orcid" error={errors['author.orcid']} icon={<VerifiedIcon className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />} hint="Format: 0000-0002-1825-0097">
                <input className={refInput(errors['author.orcid'], 'border-emerald-300 bg-white font-mono focus:border-emerald-600')} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
              </RField>
            </div>
          </div>
        </fieldset>

        {/* Co-author cards */}
        {form.coAuthors.map((c, i) => (
          <fieldset key={c.id} className="relative min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <legend className="sr-only">Co-author {i + 1}</legend>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-700"><GroupIcon className="h-3.5 w-3.5" aria-hidden="true" />Co-Author</span>
                <span className="text-[11px] font-medium text-slate-500">Author {i + 2} of {form.coAuthors.length + 1}</span>
              </div>
              <button type="button" onClick={() => removeCo(c.id)} aria-label={`Remove co-author ${i + 1}`} className="inline-flex min-h-[44px] items-center gap-0.5 text-[11px] font-medium text-red-700 hover:text-red-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:min-h-0"><Delete className="h-3.5 w-3.5" aria-hidden="true" />Remove</button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
              <div className="space-y-3 md:col-span-12 md:grid md:grid-cols-2 md:gap-3 md:space-y-0">
                <RField label="Full Name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                  <input className={cx(refInput(errors[`co.${c.id}.name`]), 'bg-white font-medium')} value={c.name} maxLength={LIMITS.name} onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
                </RField>
                <RField label="Department, Affiliation / University" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]}>
                  <input className={cx(refInput(errors[`co.${c.id}.institution`]), 'bg-white')} value={c.institution} maxLength={LIMITS.institution} onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
                </RField>
                <RField label="ORCID Identifier" optional name={`co.${c.id}.orcid`} error={errors[`co.${c.id}.orcid`]} hint="Format: 0000-0002-1825-0097">
                  <input className={cx(refInput(errors[`co.${c.id}.orcid`]), 'bg-white font-mono')} value={c.orcid ?? ''} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => setCo(c.id, { orcid: formatOrcid(e.target.value) })} />
                </RField>
                <div className="md:col-span-3"><PhotoBox value={c.photo ?? null} onChange={(photo) => setCo(c.id, { photo })} /></div>
              </div>
            </div>
          </fieldset>
        ))}

        {/* Mentor card */}
        {showMentor && (
          <fieldset className="relative min-w-0 rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/60 to-white p-4 shadow-sm md:p-5">
            <legend className="sr-only">Research mentor or faculty advisor</legend>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 pb-2">
              <span className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-900"><School className="h-3.5 w-3.5" aria-hidden="true" />Research Mentor / Faculty Advisor</span>
              <button type="button" onClick={() => { set('mentor', ''); set('mentorEmail', ''); set('mentorInstitution', ''); set('mentorOrcid', ''); set('mentorPhoto', null); setMentorOpen(false) }} className="inline-flex min-h-[44px] items-center gap-0.5 text-[11px] font-medium text-red-700 hover:text-red-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:min-h-0"><Delete className="h-3.5 w-3.5" aria-hidden="true" />Remove</button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <RField label="Mentor Name" name="mentor" error={errors.mentor}>
                <input className={cx(refInput(errors.mentor), 'bg-white font-medium')} value={form.mentor} maxLength={LIMITS.mentor} onChange={(e) => set('mentor', cleanName(e.target.value))} onBlur={() => set('mentor', form.mentor.trim())} />
              </RField>
              <RField label="ORCID Identifier" optional name="mentorOrcid" error={errors.mentorOrcid} hint="Format: 0000-0002-1825-0097">
                <input className={cx(refInput(errors.mentorOrcid), 'bg-white font-mono')} value={form.mentorOrcid ?? ''} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => set('mentorOrcid', formatOrcid(e.target.value))} />
              </RField>
              <div className="md:col-span-3"><PhotoBox value={form.mentorPhoto ?? null} onChange={(photo) => set('mentorPhoto', photo)} /></div>
              <RField label="Mentor Email" optional name="mentorEmail" error={errors.mentorEmail}>
                <input type="email" className={cx(refInput(errors.mentorEmail), 'bg-white')} value={form.mentorEmail} maxLength={LIMITS.email} onChange={(e) => set('mentorEmail', cleanEmail(e.target.value))} />
              </RField>
              <RField label="Mentor Affiliation" optional name="mentorInstitution" error={errors.mentorInstitution}>
                <input className={cx(refInput(errors.mentorInstitution), 'bg-white')} value={form.mentorInstitution} maxLength={LIMITS.institution} onChange={(e) => set('mentorInstitution', e.target.value.replace(/\s{2,}/g, ' '))} />
              </RField>
            </div>
          </fieldset>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 pt-2 sm:flex-row">
        <button type="button" disabled={form.coAuthors.length >= 15} onClick={addCo}
          className="flex min-h-[44px] w-full flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-sky-300 bg-white px-4 py-2.5 text-xs font-bold text-sky-700 transition-colors hover:border-sky-600 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:opacity-60 sm:w-auto">
          <PersonAdd className="h-5 w-5" aria-hidden="true" />+ Add Co-Author
        </button>
        <button type="button" disabled={showMentor} onClick={() => setMentorOpen(true)}
          className="flex min-h-[44px] w-full flex-1 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-amber-300 bg-gradient-to-r from-amber-50 to-white px-4 py-2.5 text-xs font-bold text-amber-900 shadow-sm transition-colors hover:border-amber-400 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 disabled:opacity-60 sm:w-auto">
          <School className="h-5 w-5 text-amber-700" aria-hidden="true" />+ Add Research Mentor / Faculty Advisor
        </button>
      </div>
      <p className="flex items-center gap-2 rounded border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-600" aria-live="polite">
        <Info className="h-4 w-4 shrink-0 text-sky-600" aria-hidden="true" />
        {form.coAuthors.length === 0 ? 'None added yet. Every listed co-author receives a certificate after publication.' : `${form.coAuthors.length} co-author${form.coAuthors.length === 1 ? '' : 's'} added (maximum 15). Every listed author receives a certificate after publication.`}
      </p>
    </Section>
  )
}
