// The six screens of the Journal 3 guided submission flow. Each component renders only its own group of questions.
import { useId, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import {
  ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, ACCEPTED_EXT, COUNTRIES, DIAL_CODES, LIMITS, MAX_FILE_MB, validateFile, wordCount,
  type FormErrors, type SubmissionForm,
} from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, formatReferral, parseKeywords, phoneMaxLength } from '../../../../core/lib/validators'
import { AppLink } from '../../../../core/router'
import { ARTICLE_TYPES, type ArticleType } from '../../../../core/types'
import { AcButton } from '../../components/AcButton'
import { J3Check, J3Field, j3Input } from '../../components/J3Field'
import { J3FileDrop } from '../../components/J3FileDrop'
import { cx } from '../../components/primitives'
import { Check } from '../../icons'

export interface StepProps {
  form: SubmissionForm
  errors: FormErrors
  setForm: Dispatch<SetStateAction<SubmissionForm>>
}

const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
const cleanEmail = (s: string) => s.replace(/\s/g, '')

const TYPE_NOTES: Record<string, string> = {
  'Research Article': 'An original study with methods, findings and discussion.',
  'Review Article': 'A critical synthesis of existing research on a topic.',
  'Short Communication': 'A brief report of a focused, timely finding.',
}

/** A radio presented as a large selectable card. The native radio stays in the page (visually hidden) for keyboard and screen-reader use. */
function ChoiceCard({ name, value, checked, onChange, describedBy, invalid, title, note, index }: {
  name: string; value: string; checked: boolean; onChange: () => void; describedBy?: string; invalid?: boolean; title: string; note?: string; index?: number
}) {
  return (
    <label className="block cursor-pointer">
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} aria-describedby={describedBy} aria-invalid={invalid ? true : undefined} className="peer sr-only" />
      <span className={cx('flex h-full items-start gap-3 rounded-none border p-4 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-iris-700 peer-focus-visible:ring-offset-2',
        checked ? 'border-iris-700 bg-iris-50 shadow-[inset_3px_0_0_0_#0F2B48]' : invalid ? 'border-red-700 bg-red-50' : 'border-mauve-200 bg-white hover:border-iris-400')}>
        <span aria-hidden="true" className={cx('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-none font-inter text-xs font-bold', checked ? 'bg-j3valid-700 text-white' : 'bg-iris-100 text-iris-700')}>
          {checked ? <Check className="h-4 w-4" /> : index ?? ''}
        </span>
        <span className="min-w-0">
          <span className="block font-jakarta text-lg font-semibold leading-snug text-iris-700">{title}</span>
          {note && <span className="mt-0.5 block font-inter text-sm text-mauve-600">{note}</span>}
        </span>
      </span>
    </label>
  )
}

function Group({ legend, error, id, children, className }: { legend: string; error?: string; id: string; children: ReactNode; className?: string }) {
  return (
    <fieldset aria-describedby={error ? id : undefined}>
      <legend className="mb-2 font-inter text-sm font-semibold text-night-900">{legend} <span className="text-red-700" aria-hidden="true">*</span></legend>
      <div className={className}>{children}</div>
      {error && <p id={id} role="alert" className="mt-2 font-inter text-sm font-semibold text-red-700">{error}</p>}
    </fieldset>
  )
}

// ---- 1. Title & type ----
export function StepTitle({ form, errors, setForm }: StepProps) {
  const errId = useId()
  return (
    <div className="space-y-8">
      <J3Field label="Manuscript title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title}`} hint="Use the full title, as it should appear in print.">
        <input className={j3Input(errors.title, true)} value={form.title} maxLength={LIMITS.title} placeholder="e.g. Participatory murals and neighbourhood identity in Pune" autoComplete="off"
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value.replace(/\s{2,}/g, ' ') }))} onBlur={() => setForm((f) => ({ ...f, title: f.title.trim() }))} />
      </J3Field>
      <Group legend="Article type" id={errId} error={errors.articleType} className="grid gap-3 sm:grid-cols-3">
        {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t, i) => (
          <ChoiceCard key={t} name="articleType" value={t} title={t} note={TYPE_NOTES[t]} index={i + 1} checked={form.articleType === t}
            invalid={!!errors.articleType} describedBy={errors.articleType ? errId : undefined} onChange={() => setForm((f) => ({ ...f, articleType: t as ArticleType }))} />
        ))}
      </Group>
    </div>
  )
}

// ---- 2. Abstract & keywords ----
export function StepAbstract({ form, errors, setForm }: StepProps) {
  const words = wordCount(form.abstract)
  const kw = parseKeywords(form.keywords)
  const bad = words > 0 && (words < ABSTRACT_MIN_WORDS || words > ABSTRACT_MAX_WORDS)
  return (
    <div className="space-y-8">
      <div>
        <J3Field label="Abstract" name="abstract" required error={errors.abstract} hint={`${ABSTRACT_MIN_WORDS} to ${ABSTRACT_MAX_WORDS} words. Cover the aim, method, findings and conclusion.`}>
          <textarea rows={10} className={cx(j3Input(errors.abstract, true), 'leading-relaxed')} value={form.abstract}
            onChange={(e) => setForm((f) => ({ ...f, abstract: e.target.value }))} onBlur={() => setForm((f) => ({ ...f, abstract: f.abstract.trim() }))} />
        </J3Field>
        <p aria-live="polite" className={cx('mt-1 text-right font-inter text-sm font-semibold tabular-nums', bad ? 'text-red-700' : 'text-mauve-700')}>{words} / {ABSTRACT_MAX_WORDS} words</p>
      </div>
      <div>
        <J3Field label="Keywords" name="keywords" required error={errors.keywords} hint="3 to 8 keywords, separated by commas.">
          <input className={j3Input(errors.keywords, true)} value={form.keywords} maxLength={300} placeholder="e.g. public art, community, urban identity"
            onChange={(e) => setForm((f) => ({ ...f, keywords: e.target.value }))} />
        </J3Field>
        {kw.length > 0 && (
          <ul aria-label="Keyword preview" className="mt-3 flex flex-wrap gap-2">
            {kw.slice(0, 12).map((k, i) => <li key={`${k}-${i}`} className="rounded-none bg-iris-100 px-3 py-1 font-inter text-sm font-semibold text-iris-700">{k}</li>)}
          </ul>
        )}
      </div>
    </div>
  )
}

// ---- 3. Theme ----
export function StepTheme({ form, errors, setForm }: StepProps) {
  const errId = useId()
  return (
    <Group legend="Theme (collection)" id={errId} error={errors.subject} className="grid gap-3 sm:grid-cols-2">
      {journal.subjects.map((s, i) => (
        <ChoiceCard key={s} name="subject" value={s} title={s} index={i + 1} checked={form.subject === s} invalid={!!errors.subject}
          describedBy={errors.subject ? errId : undefined} onChange={() => setForm((f) => ({ ...f, subject: s }))} />
      ))}
    </Group>
  )
}

// ---- 4. Authors ----
export function StepAuthors({ form, errors, setForm }: StepProps) {
  const a = form.author
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => setForm((f) => ({ ...f, author: { ...f.author, ...patch } }))
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    setForm((f) => ({ ...f, coAuthors: f.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  const addCo = () => setForm((f) => ({ ...f, coAuthors: [...f.coAuthors, { id: Date.now(), name: '', email: '', institution: '' }] }))
  const removeCo = (id: number) => setForm((f) => ({ ...f, coAuthors: f.coAuthors.filter((c) => c.id !== id) }))
  const maxPhone = phoneMaxLength(a.dialCode)
  return (
    <div className="space-y-10">
      <fieldset className="space-y-5">
        <legend className="mb-1 border-b-2 border-iris-700 pb-1 font-jakarta text-xl font-semibold text-iris-700">Corresponding author</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <J3Field label="Full name" name="author.name" required error={errors['author.name']}>
            <input className={j3Input(errors['author.name'])} value={a.name} maxLength={LIMITS.name} autoComplete="name"
              onChange={(e) => setAuthor({ name: cleanName(e.target.value) })} onBlur={() => setAuthor({ name: a.name.trim() })} />
          </J3Field>
          <J3Field label="Email" name="author.email" required error={errors['author.email']} hint="Your Paper ID and all updates are sent here.">
            <input type="email" className={j3Input(errors['author.email'])} value={a.email} maxLength={LIMITS.email} autoComplete="email" inputMode="email" placeholder="name@institution.edu"
              onChange={(e) => setAuthor({ email: cleanEmail(e.target.value) })} onBlur={() => setAuthor({ email: a.email.trim().toLowerCase() })} />
          </J3Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-[minmax(0,14rem)_1fr]">
          <J3Field label="Country code" name="author.dialCode" required>
            <select className={j3Input()} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
              {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
            </select>
          </J3Field>
          <J3Field label="WhatsApp number" name="author.whatsapp" required error={errors['author.whatsapp']}
            hint={a.dialCode === '+91' ? '10-digit mobile number. Updates are also sent here.' : 'Number without the country code. Updates are also sent here.'}>
            <input type="tel" inputMode="numeric" className={j3Input(errors['author.whatsapp'])} value={a.whatsapp} maxLength={maxPhone} autoComplete="tel-national"
              placeholder={a.dialCode === '+91' ? journal.whatsapp.replace(/^\+91\s?/, '').replace(/\s/g, '') : '5551234567'}
              onChange={(e) => setAuthor({ whatsapp: digitsOnly(e.target.value).slice(0, maxPhone) })} />
          </J3Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <J3Field label="Affiliation (institution)" name="author.institution" required error={errors['author.institution']}>
            <input className={j3Input(errors['author.institution'])} value={a.institution} maxLength={LIMITS.institution} autoComplete="organization"
              onChange={(e) => setAuthor({ institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setAuthor({ institution: a.institution.trim() })} />
          </J3Field>
          <J3Field label="Country" name="author.country" required error={errors['author.country']}>
            <select className={j3Input(errors['author.country'])} value={a.country} autoComplete="country-name" onChange={(e) => setAuthor({ country: e.target.value })}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </J3Field>
        </div>
        <J3Field label="ORCID iD" name="author.orcid" optional error={errors['author.orcid']} hint="Format: 0000-0002-1825-0097">
          <input className={j3Input(errors['author.orcid'])} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000" onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
        </J3Field>
      </fieldset>

      <section aria-labelledby="co-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="co-h" className="font-jakarta text-xl font-semibold text-iris-700">Co-authors</h2>
            <p className="font-inter text-sm text-mauve-600">{form.coAuthors.length === 0 ? 'None added. Every listed co-author receives a certificate after publication.' : `${form.coAuthors.length} added`}</p>
          </div>
          <AcButton variant="outline" disabled={form.coAuthors.length >= 15} onClick={addCo}>+ Add co-author</AcButton>
        </div>
        <ul className="mt-4 space-y-4">
          {form.coAuthors.map((c, i) => (
            <li key={c.id} className="rounded-none border border-mauve-200 bg-j3paper-cool p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700">Co-author {i + 1}</span>
                <button type="button" onClick={() => removeCo(c.id)} aria-label={`Remove co-author ${i + 1}`} className="rounded-none px-3 py-1 font-inter text-xs font-bold uppercase tracking-[0.08em] text-red-700 hover:bg-white">Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <J3Field label="Name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                  <input className={j3Input(errors[`co.${c.id}.name`])} value={c.name} maxLength={LIMITS.name} onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
                </J3Field>
                <J3Field label="Email" name={`co.${c.id}.email`} required error={errors[`co.${c.id}.email`]}>
                  <input type="email" className={j3Input(errors[`co.${c.id}.email`])} value={c.email} maxLength={LIMITS.email} onChange={(e) => setCo(c.id, { email: cleanEmail(e.target.value) })} onBlur={() => setCo(c.id, { email: c.email.trim().toLowerCase() })} />
                </J3Field>
                <J3Field label="Affiliation" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]}>
                  <input className={j3Input(errors[`co.${c.id}.institution`])} value={c.institution} maxLength={LIMITS.institution} onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
                </J3Field>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

// ---- 5. Files & declarations ----
export function StepFiles({ form, errors, setForm }: StepProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  const decl = (k: keyof SubmissionForm['declarations'], v: boolean) => setForm((f) => ({ ...f, declarations: { ...f.declarations, [k]: v } }))
  return (
    <div className="space-y-10">
      <div>
        <span id="file-label" className="mb-1.5 block font-inter text-sm font-semibold text-night-900">Manuscript file <span className="text-red-700" aria-hidden="true">*</span></span>
        <J3FileDrop name="file" value={form.file} onChange={(f) => set('file', f)} validate={validateFile} accept={ACCEPTED_EXT.join(',')} error={errors.file}
          hint={`Word files only (${ACCEPTED_EXT.join(', ')}), up to ${MAX_FILE_MB} MB.`} describedBy="file-label" />
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-1 border-b-2 border-iris-700 pb-1 font-jakarta text-xl font-semibold text-iris-700">Optional extras</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <J3Field label="Mentor name" name="mentor" optional error={errors.mentor}>
            <input className={j3Input(errors.mentor)} value={form.mentor} maxLength={LIMITS.mentor} onChange={(e) => set('mentor', cleanName(e.target.value))} onBlur={() => set('mentor', form.mentor.trim())} />
          </J3Field>
          <J3Field label="Referral code" name="referralCode" optional error={errors.referralCode} hint="4 to 20 letters, numbers or hyphens. Earns credits for the colleague who referred you.">
            <input className={j3Input(errors.referralCode)} value={form.referralCode} maxLength={20} autoComplete="off" onChange={(e) => set('referralCode', formatReferral(e.target.value))} />
          </J3Field>
        </div>
        <J3Field label="Cover letter / suggested reviewers" name="coverLetter" optional error={errors.coverLetter} counter={`${form.coverLetter.length} / ${LIMITS.coverLetter}`}>
          <textarea rows={5} className={j3Input(errors.coverLetter)} value={form.coverLetter} maxLength={LIMITS.coverLetter} onChange={(e) => set('coverLetter', e.target.value)}
            placeholder={`Briefly explain why this work suits ${journal.shortName}, and name any reviewers you suggest.`} />
        </J3Field>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="mb-2 border-b-2 border-iris-700 pb-1 font-jakarta text-xl font-semibold text-iris-700">Declarations and consent</legend>
        <J3Check name="originality" checked={form.declarations.originality} error={errors.originality} onChange={(v) => decl('originality', v)}>
          I confirm this manuscript is original, has not been published before, and all authors have approved it.
        </J3Check>
        <J3Check name="noSimultaneous" checked={form.declarations.noSimultaneous} error={errors.noSimultaneous} onChange={(v) => decl('noSimultaneous', v)}>
          I confirm it is not under consideration by any other journal at the same time.
        </J3Check>
        <J3Check name="consentData" checked={form.declarations.consentData} error={errors.consentData} onChange={(v) => decl('consentData', v)}>
          I consent to {journal.shortName} processing the personal data in this submission to review and publish my work, as described in the{' '}
          <AppLink to={paths.policy('privacy')} className="font-bold text-iris-700 underline hover:text-ember-700">Privacy Policy</AppLink>. Author names and affiliations appear publicly if the article is published.
        </J3Check>
        <J3Check name="consentMessages" checked={form.declarations.consentMessages} error={errors.consentMessages} onChange={(v) => decl('consentMessages', v)}>
          I consent to receive my Paper ID and status updates by WhatsApp, SMS and email.
        </J3Check>
        <p className="font-inter text-sm text-mauve-600">You can withdraw consent at any time: reply STOP to any message, or email {journal.email}. Withdrawing does not affect work already published.</p>
        <div className="pt-2">
          {/* Placeholder for the real reCAPTCHA widget. */}
          <J3Check name="captcha" checked={form.captcha} error={errors.captcha} onChange={(v) => set('captcha', v)}>
            I’m not a robot <span className="text-xs text-mauve-600">(reCAPTCHA placeholder)</span>
          </J3Check>
        </div>
      </fieldset>
    </div>
  )
}

// ---- 6. Review ----
function Row({ k, children }: { k: string; children?: ReactNode }) {
  return (
    <div className="grid gap-0.5 py-2.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="font-inter text-xs font-bold uppercase tracking-[0.08em] text-mauve-600">{k}</dt>
      <dd className="min-w-0 break-words font-inter text-base text-night-900">{children || <span className="font-normal text-mauve-600">Not provided</span>}</dd>
    </div>
  )
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <section aria-label={title} className="rounded-none border border-mauve-200 bg-white px-4 py-3 sm:px-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-jakarta text-lg font-semibold text-iris-700">{title}</h2>
        <button type="button" onClick={onEdit} aria-label={`Edit ${title}`} className="rounded-none px-3 py-1 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-100">Edit</button>
      </div>
      <dl className="divide-y divide-mauve-100">{children}</dl>
    </section>
  )
}

export function StepReview({ form, missing, onEdit }: { form: SubmissionForm; missing: number; onEdit: (step: number) => void }) {
  const a = form.author
  const abstract = form.abstract.trim()
  return (
    <div className="space-y-4">
      <ReviewBlock title="Title and type" onEdit={() => onEdit(0)}>
        <Row k="Title">{form.title}</Row>
        <Row k="Article type">{form.articleType}</Row>
      </ReviewBlock>
      <ReviewBlock title="Abstract and keywords" onEdit={() => onEdit(1)}>
        <Row k="Abstract">{abstract && (abstract.length > 220 ? `${abstract.slice(0, 220)}…` : abstract)}</Row>
        <Row k="Keywords">{form.keywords}</Row>
      </ReviewBlock>
      <ReviewBlock title="Theme" onEdit={() => onEdit(2)}><Row k="Theme">{form.subject}</Row></ReviewBlock>
      <ReviewBlock title="Authors" onEdit={() => onEdit(3)}>
        <Row k="Corresponding">{a.name && `${a.name}${a.email ? ` (${a.email})` : ''}`}</Row>
        <Row k="WhatsApp">{a.whatsapp && `${a.dialCode} ${a.whatsapp}`}</Row>
        <Row k="Affiliation">{a.institution && `${a.institution}, ${a.country}`}</Row>
        <Row k="ORCID iD">{a.orcid}</Row>
        <Row k="Co-authors">{form.coAuthors.length ? form.coAuthors.map((c) => c.name || 'Unnamed').join(', ') : 'None'}</Row>
      </ReviewBlock>
      <ReviewBlock title="Files and declarations" onEdit={() => onEdit(4)}>
        <Row k="Manuscript file">{form.file?.name}</Row>
        <Row k="Mentor">{form.mentor || undefined}</Row>
        <Row k="Referral code">{form.referralCode || undefined}</Row>
        <Row k="Declarations">{Object.values(form.declarations).every(Boolean) && form.captcha ? 'All confirmed' : ''}</Row>
      </ReviewBlock>
      <p role="status" className={cx('rounded-none border-l-4 px-4 py-3 font-inter text-base font-semibold', missing ? 'border-ember-700 bg-ember-50 text-ember-900' : 'border-j3valid-700 bg-j3valid-50 text-j3valid-800')}>
        {missing ? `${missing} required field${missing === 1 ? '' : 's'} still need attention. Pressing Submit takes you to the first one.` : 'Everything looks complete. You can submit your manuscript.'}
      </p>
    </div>
  )
}
