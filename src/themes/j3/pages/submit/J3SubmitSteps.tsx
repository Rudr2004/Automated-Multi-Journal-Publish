// The sections of the Journal 3 manuscript submission form (reference: "Academic Manuscript Submission Form").
// Each section is a white ruled card with an orange square marker, an uppercase title and a "Step n of 5" note; all five sit on one page.
import { useId, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { MdOutlineDeleteOutline, MdOutlinePersonAddAlt, MdOutlineSchool } from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { PHOTO_ACCEPT, PHOTO_MAX_MB, readPhoto, validatePhoto } from '../../../../core/lib/photo'
import {
  ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, ACCEPTED_EXT, COUNTRIES, DIAL_CODES, LIMITS, MAX_FILE_MB, validateFile, wordCount,
  type AuthorPhoto, type FormErrors, type SubmissionForm,
} from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, formatReferral, parseKeywords, phoneMaxLength } from '../../../../core/lib/validators'
import { AppLink } from '../../../../core/router'
import { ARTICLE_TYPES, type ArticleType } from '../../../../core/types'
import { J3Check, J3Field, j3Input } from '../../components/J3Field'
import { J3FileDrop } from '../../components/J3FileDrop'
import { cx } from '../../components/primitives'
import { Check, Person } from '../../icons'

export interface SectionProps {
  form: SubmissionForm
  errors: FormErrors
  setForm: Dispatch<SetStateAction<SubmissionForm>>
}

const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
const cleanEmail = (s: string) => s.replace(/\s/g, '')

/** Secondary (ruled) button used inside the form. */
const ruled = 'inline-flex items-center justify-center gap-1.5 rounded-tile border border-j3paper-rule bg-white px-3.5 py-2 font-inter text-[13px] font-semibold text-iris-700 transition-colors hover:border-iris-700 hover:bg-j3paper-cool disabled:cursor-not-allowed disabled:opacity-50'

export function Section({ n, total = 5, title, action, children, id }: { n: number; total?: number; title: string; action?: ReactNode; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="space-y-5 rounded-tile border border-j3paper-rule bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-j3paper-rule pb-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-ember-500" />
          <h2 id={id} className="font-jakarta text-sm font-bold uppercase tracking-[0.05em] text-night-900 sm:text-base">Section {n}: {title}</h2>
        </div>
        {action ?? <span className="font-inter text-[11px] tabular-nums text-mauve-600">Step {n} of {total}</span>}
      </div>
      {children}
    </section>
  )
}

// ---- 1. Article classification & metadata ----
export function SectionClassification({ form, errors, setForm }: SectionProps) {
  const words = wordCount(form.abstract)
  const kw = parseKeywords(form.keywords)
  const badWords = words > 0 && (words < ABSTRACT_MIN_WORDS || words > ABSTRACT_MAX_WORDS)
  return (
    <Section id="sec-1" n={1} title="Article Classification & Metadata">
      <div className="grid gap-4 sm:grid-cols-2">
        <J3Field label="Article type" name="articleType" required error={errors.articleType}>
          <select className={j3Input(errors.articleType)} value={form.articleType} onChange={(e) => setForm((f) => ({ ...f, articleType: e.target.value as ArticleType | '' }))}>
            <option value="">Select article type</option>
            {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => <option key={t}>{t}</option>)}
          </select>
        </J3Field>
        <J3Field label="Theme (collection)" name="subject" required error={errors.subject}>
          <select className={j3Input(errors.subject)} value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}>
            <option value="">Select a theme</option>
            {journal.subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
        </J3Field>
      </div>
      <J3Field label="Full manuscript title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title}`} hint="Use the full title, as it should appear in print. Avoid non-standard abbreviations.">
        <input className={cx(j3Input(errors.title), 'font-semibold')} value={form.title} maxLength={LIMITS.title} placeholder="Enter the full title of your paper" autoComplete="off"
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value.replace(/\s{2,}/g, ' ') }))} onBlur={() => setForm((f) => ({ ...f, title: f.title.trim() }))} />
      </J3Field>
      <div>
        <J3Field label="Abstract" name="abstract" required error={errors.abstract} hint={`${ABSTRACT_MIN_WORDS} to ${ABSTRACT_MAX_WORDS} words. Cover the aim, method, findings and conclusion.`}>
          <textarea rows={8} className={cx(j3Input(errors.abstract), 'leading-relaxed')} value={form.abstract}
            onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))} onBlur={() => setForm((f) => ({ ...f, abstract: f.abstract.trim() }))} />
        </J3Field>
        <p aria-live="polite" className={cx('mt-1 text-right font-inter text-xs font-semibold tabular-nums', badWords ? 'text-red-700' : 'text-mauve-600')}>{words} / {ABSTRACT_MAX_WORDS} words</p>
      </div>
      <div>
        <J3Field label="Keywords" name="keywords" required error={errors.keywords} hint="3 to 8 keywords, separated by commas.">
          <input className={j3Input(errors.keywords)} value={form.keywords} maxLength={300} placeholder="e.g. public art, community, urban identity"
            onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
        </J3Field>
        {kw.length > 0 && (
          <ul aria-label="Keyword preview" className="mt-2.5 flex flex-wrap gap-2">
            {kw.slice(0, 12).map((k, i) => <li key={`${k}-${i}`} className="rounded-tile bg-j3paper-deep px-2.5 py-1 font-inter text-xs font-semibold text-iris-700">{k}</li>)}
          </ul>
        )}
      </div>
    </Section>
  )
}

// ---- 2. Corresponding author ----
function Headshot({ value, onChange }: { value: AuthorPhoto | null; onChange: (p: AuthorPhoto | null) => void }) {
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [problem, setProblem] = useState('')
  const [busy, setBusy] = useState(false)
  const pick = async (file?: File) => {
    if (!file) return
    const bad = validatePhoto(file)
    if (bad) { setProblem(bad); return }
    setProblem(''); setBusy(true)
    try { onChange(await readPhoto(file)) } catch (e) { setProblem((e as Error).message) } finally { setBusy(false); if (input.current) input.current.value = '' }
  }
  return (
    <div className="flex flex-wrap items-start gap-4 rounded-tile border border-j3paper-rule bg-j3paper-cool p-4">
      <div className="flex shrink-0 flex-col items-center gap-2">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-tile border border-j3paper-rule bg-white p-1">
          {value ? <img src={value.dataUrl} alt="Your profile picture" className="h-full w-full object-cover" /> : <Person className="h-10 w-10 text-mauve-500" aria-hidden="true" />}
        </div>
        <input ref={input} id={id} name="author.photo" type="file" accept={PHOTO_ACCEPT} className="sr-only" onChange={(e) => void pick(e.target.files?.[0])} />
        <button type="button" onClick={() => input.current?.click()} disabled={busy} className={cx(ruled, 'px-2.5 py-1 text-xs')}>{busy ? 'Reading…' : value ? '+ Change photo' : '+ Add photo'}</button>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-inter text-[13px] font-bold text-night-900">Author headshot <span className="font-normal text-mauve-600">(optional)</span></p>
        <p className="mt-1 font-inter text-xs leading-relaxed text-mauve-600">Used for your author profile if the article is published. A formal head-and-shoulders portrait. JPG, PNG or WebP, up to {PHOTO_MAX_MB} MB.</p>
        {value && (
          <p className="mt-2 flex flex-wrap items-center gap-2 font-inter text-xs font-semibold text-j3valid-700"><Check className="h-4 w-4" aria-hidden="true" /><span className="break-all">{value.name} ({(value.size / 1024).toFixed(0)} KB)</span>
            <button type="button" onClick={() => { setProblem(''); onChange(null) }} className="font-semibold text-iris-700 underline hover:text-iris-800">Remove</button></p>
        )}
        {problem && <p role="alert" className="mt-2 font-inter text-xs font-semibold text-red-700">{problem}</p>}
      </div>
    </div>
  )
}

export function SectionAuthor({ form, errors, setForm }: SectionProps) {
  const a = form.author
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => setForm((f) => ({ ...f, author: { ...f.author, ...patch } }))
  const maxPhone = phoneMaxLength(a.dialCode)
  return (
    <Section id="sec-2" n={2} title="Corresponding Author Details">
      <Headshot value={a.photo} onChange={(photo) => setAuthor({ photo })} />
      <div className="grid gap-4 sm:grid-cols-2">
        <J3Field label="Full name" name="author.name" required error={errors['author.name']}>
          <input className={j3Input(errors['author.name'])} value={a.name} maxLength={LIMITS.name} autoComplete="name" placeholder="Given name followed by family name"
            onChange={(e) => setAuthor({ name: cleanName(e.target.value) })} onBlur={() => setAuthor({ name: a.name.trim() })} />
        </J3Field>
        <J3Field label="Email" name="author.email" required error={errors['author.email']} hint="Your Paper ID and all updates are sent here.">
          <input type="email" className={j3Input(errors['author.email'])} value={a.email} maxLength={LIMITS.email} autoComplete="email" inputMode="email" placeholder="name@institution.edu"
            onChange={(e) => setAuthor({ email: cleanEmail(e.target.value) })} onBlur={() => setAuthor({ email: a.email.trim().toLowerCase() })} />
        </J3Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <J3Field label="Institution / university" name="author.institution" required error={errors['author.institution']}>
          <input className={j3Input(errors['author.institution'])} value={a.institution} maxLength={LIMITS.institution} autoComplete="organization" placeholder="Department and institution"
            onChange={(e) => setAuthor({ institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setAuthor({ institution: a.institution.trim() })} />
        </J3Field>
        <J3Field label="Country" name="author.country" required error={errors['author.country']}>
          <select className={j3Input(errors['author.country'])} value={a.country} autoComplete="country-name" onChange={(e) => setAuthor({ country: e.target.value })}>
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </J3Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,13rem)_1fr]">
        <J3Field label="Country code" name="author.dialCode" required>
          <select className={j3Input()} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
            {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
          </select>
        </J3Field>
        <J3Field label="WhatsApp / contact number" name="author.whatsapp" required error={errors['author.whatsapp']}
          hint={a.dialCode === '+91' ? '10-digit mobile number. Updates are also sent here.' : 'Number without the country code. Updates are also sent here.'}>
          <input type="tel" inputMode="numeric" className={j3Input(errors['author.whatsapp'])} value={a.whatsapp} maxLength={maxPhone} autoComplete="tel-national"
            placeholder={a.dialCode === '+91' ? journal.whatsapp.replace(/^\+91\s?/, '').replace(/\s/g, '') : '5551234567'}
            onChange={(e) => setAuthor({ whatsapp: digitsOnly(e.target.value).slice(0, maxPhone) })} />
        </J3Field>
      </div>
      <J3Field label="ORCID iD" name="author.orcid" optional error={errors['author.orcid']} hint="Format: 0000-0002-1825-0097">
        <input className={cx(j3Input(errors['author.orcid']), 'sm:max-w-xs')} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
      </J3Field>
    </Section>
  )
}

// ---- 3. Co-authors & mentor ----
function PersonCard({ label, name, icon, onRemove, children }: { label: string; name: string; icon: ReactNode; onRemove: () => void; children: ReactNode }) {
  return (
    <li className="rounded-tile border border-j3paper-rule bg-j3paper-cool p-4">
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-j3paper-rule pb-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1 rounded-tile bg-iris-700 px-2 py-0.5 font-inter text-[11px] font-bold uppercase tracking-[0.06em] text-white">{icon}{label}</span>
          {name && <span className="truncate font-jakarta text-sm font-semibold text-night-900">{name}</span>}
        </div>
        <button type="button" onClick={onRemove} aria-label={`Remove ${label.toLowerCase()}`} className="inline-flex shrink-0 items-center gap-1 rounded-tile px-2 py-1 font-inter text-xs font-semibold text-red-700 hover:bg-white">
          <MdOutlineDeleteOutline className="h-4 w-4" aria-hidden="true" />Remove
        </button>
      </div>
      {children}
    </li>
  )
}

export function SectionPeople({ form, errors, setForm }: SectionProps) {
  const [mentorOpen, setMentorOpen] = useState(() => !!(form.mentor || form.mentorEmail || form.mentorInstitution))
  const showMentor = mentorOpen || !!(form.mentor || form.mentorEmail || form.mentorInstitution)
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    setForm((f) => ({ ...f, coAuthors: f.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  const addCo = () => setForm((f) => ({ ...f, coAuthors: [...f.coAuthors, { id: Date.now(), name: '', email: '', institution: '' }] }))
  const removeCo = (id: number) => setForm((f) => ({ ...f, coAuthors: f.coAuthors.filter((c) => c.id !== id) }))
  return (
    <Section id="sec-3" n={3} title="Co-Authors & Mentor" action={
      <div className="flex flex-wrap gap-2">
        <button type="button" className={ruled} disabled={form.coAuthors.length >= 15} onClick={addCo}><MdOutlinePersonAddAlt className="h-4 w-4" aria-hidden="true" />+ Add Co-Author</button>
        <button type="button" className={ruled} disabled={showMentor} onClick={() => setMentorOpen(true)}><MdOutlineSchool className="h-4 w-4" aria-hidden="true" />+ Add Mentor</button>
      </div>
    }>
      {form.coAuthors.length === 0 && !showMentor && (
        <p className="font-inter text-sm text-mauve-600">No co-authors or mentor added. Every listed co-author receives a certificate after publication. Add them here if your work has more than one author.</p>
      )}
      <ul className="space-y-4">
        {form.coAuthors.map((c, i) => (
          <PersonCard key={c.id} label={`Co-author ${i + 1}`} name={c.name} icon={null} onRemove={() => removeCo(c.id)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <J3Field label="Full name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                <input className={j3Input(errors[`co.${c.id}.name`])} value={c.name} maxLength={LIMITS.name} onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
              </J3Field>
              <J3Field label="Email" name={`co.${c.id}.email`} required error={errors[`co.${c.id}.email`]}>
                <input type="email" className={j3Input(errors[`co.${c.id}.email`])} value={c.email} maxLength={LIMITS.email} onChange={(e) => setCo(c.id, { email: cleanEmail(e.target.value) })} onBlur={() => setCo(c.id, { email: c.email.trim().toLowerCase() })} />
              </J3Field>
              <div className="sm:col-span-2">
                <J3Field label="Affiliation (department and university)" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]}>
                  <input className={j3Input(errors[`co.${c.id}.institution`])} value={c.institution} maxLength={LIMITS.institution} onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
                </J3Field>
              </div>
            </div>
          </PersonCard>
        ))}
        {showMentor && (
          <PersonCard label="Mentor / guide" name={form.mentor} icon={null} onRemove={() => { setForm((f) => ({ ...f, mentor: '', mentorEmail: '', mentorInstitution: '' })); setMentorOpen(false) }}>
            <div className="grid gap-4 sm:grid-cols-2">
              <J3Field label="Full name" name="mentor" required error={errors.mentor}>
                <input className={j3Input(errors.mentor)} value={form.mentor} maxLength={LIMITS.mentor} onChange={(e) => set('mentor', cleanName(e.target.value))} onBlur={() => set('mentor', form.mentor.trim())} />
              </J3Field>
              <J3Field label="Mentor email" name="mentorEmail" optional error={errors.mentorEmail}>
                <input type="email" className={j3Input(errors.mentorEmail)} value={form.mentorEmail} maxLength={LIMITS.email} onChange={(e) => set('mentorEmail', cleanEmail(e.target.value))} onBlur={() => set('mentorEmail', form.mentorEmail.trim().toLowerCase())} />
              </J3Field>
              <div className="sm:col-span-2">
                <J3Field label="Department and university" name="mentorInstitution" optional error={errors.mentorInstitution}>
                  <input className={j3Input(errors.mentorInstitution)} value={form.mentorInstitution} maxLength={LIMITS.institution} onChange={(e) => set('mentorInstitution', e.target.value.replace(/\s{2,}/g, ' '))} onBlur={() => set('mentorInstitution', form.mentorInstitution.trim())} />
                </J3Field>
              </div>
            </div>
          </PersonCard>
        )}
      </ul>
    </Section>
  )
}

// ---- 4. File upload ----
export function SectionFile({ form, errors, setForm }: SectionProps) {
  return (
    <Section id="sec-4" n={4} title="File Upload & Manuscript Documents">
      <div>
        <span id="file-label" className="mb-1.5 block font-inter text-[13px] font-bold text-night-900">Primary manuscript file <span className="text-red-700" aria-hidden="true">*</span></span>
        <J3FileDrop name="file" value={form.file} onChange={(f) => setForm((s) => ({ ...s, file: f }))} validate={validateFile} accept={ACCEPTED_EXT.join(',')} error={errors.file}
          hint={`Supported formats: Microsoft Word (${ACCEPTED_EXT.join(', ')}). Max ${MAX_FILE_MB} MB.`} describedBy="file-label" />
      </div>
      <J3Field label="Cover letter / suggested reviewers" name="coverLetter" optional error={errors.coverLetter} counter={`${form.coverLetter.length} / ${LIMITS.coverLetter}`}>
        <textarea rows={4} className={j3Input(errors.coverLetter)} value={form.coverLetter} maxLength={LIMITS.coverLetter} onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
          placeholder={`Briefly explain why this work suits ${journal.shortName}, and name any reviewers you suggest.`} />
      </J3Field>
    </Section>
  )
}

// ---- 5. Declarations ----
export function SectionDeclarations({ form, errors, setForm }: SectionProps) {
  const decl = (k: keyof SubmissionForm['declarations'], v: boolean) => setForm((f) => ({ ...f, declarations: { ...f.declarations, [k]: v } }))
  return (
    <Section id="sec-5" n={5} title="Author Declarations & Consent">
      <div className="space-y-3">
        <J3Check name="originality" checked={form.declarations.originality} error={errors.originality} onChange={(v) => decl('originality', v)}>
          <strong>Original work and authorship:</strong> This manuscript is original, has not been published before, and all authors have approved it.
        </J3Check>
        <J3Check name="noSimultaneous" checked={form.declarations.noSimultaneous} error={errors.noSimultaneous} onChange={(v) => decl('noSimultaneous', v)}>
          <strong>No simultaneous submission:</strong> It is not under consideration by any other journal at the same time.
        </J3Check>
        <J3Check name="consentData" checked={form.declarations.consentData} error={errors.consentData} onChange={(v) => decl('consentData', v)}>
          <strong>Data consent:</strong> I consent to {journal.shortName} processing the personal data in this submission to review and publish my work, as described in the{' '}
          <AppLink to={paths.policy('privacy')} className="font-bold text-iris-700 underline hover:text-iris-800">Privacy Policy</AppLink>. Author names and affiliations appear publicly if the article is published.
        </J3Check>
        <J3Check name="consentMessages" checked={form.declarations.consentMessages} error={errors.consentMessages} onChange={(v) => decl('consentMessages', v)}>
          <strong>Messages:</strong> I consent to receive my Paper ID and status updates by WhatsApp, SMS and email.
        </J3Check>
        <p className="font-inter text-xs text-mauve-600">You can withdraw consent at any time: reply STOP to any message, or email {journal.email}. Withdrawing does not affect work already published.</p>
        {/* Placeholder for the real reCAPTCHA widget. */}
        <J3Check name="captcha" checked={form.captcha} error={errors.captcha} onChange={(v) => setForm((f) => ({ ...f, captcha: v }))}>
          I’m not a robot <span className="text-xs text-mauve-600">(reCAPTCHA placeholder)</span>
        </J3Check>
      </div>
    </Section>
  )
}

// ---- Referral ----
export function ReferralCard({ form, errors, setForm }: SectionProps) {
  return (
    <div className="rounded-tile border border-j3paper-rule bg-white p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2.5"><span aria-hidden="true" className="h-2 w-2 bg-ember-500" /><h2 className="font-jakarta text-sm font-bold text-night-900">Referral code <span className="font-normal text-mauve-600">(optional)</span></h2></div>
      <J3Field label="Referral code" name="referralCode" error={errors.referralCode} hint="4 to 20 letters, numbers or hyphens. Earns credits for the colleague who referred you.">
        <input className={cx(j3Input(errors.referralCode), 'font-mono sm:max-w-md')} value={form.referralCode} maxLength={20} autoComplete="off" placeholder="e.g. IJCSD-REF-2026"
          onChange={(e) => setForm((f) => ({ ...f, referralCode: formatReferral(e.target.value) }))} />
      </J3Field>
    </div>
  )
}

// ---- Review summary shown above the submit bar ----
export function ReadinessNote({ missing }: { missing: number }) {
  return (
    <p role="status" className={cx('rounded-tile border-l-4 px-4 py-3 font-inter text-sm font-semibold', missing ? 'border-ember-500 bg-j3paper-deep text-night-900' : 'border-j3valid-700 bg-j3valid-50 text-j3valid-800')}>
      {missing ? `${missing} required field${missing === 1 ? '' : 's'} still need attention. Pressing Submit takes you to the first one.` : 'Everything looks complete. You can submit your manuscript.'}
    </p>
  )
}
