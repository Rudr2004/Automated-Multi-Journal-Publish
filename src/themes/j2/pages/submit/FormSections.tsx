// The three input sections of the single-page submission form: manuscript details, authors, files and declarations.
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import {
  ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, ACCEPTED_EXT, COUNTRIES, DIAL_CODES, LIMITS, MAX_FILE_MB, validateFile, wordCount,
  type FormErrors, type SubmissionForm,
} from '../../../../core/lib/submission'
import { digitsOnly, formatOrcid, formatReferral, parseKeywords, phoneMaxLength } from '../../../../core/lib/validators'
import { ARTICLE_TYPES, type ArticleType } from '../../../../core/types'
import { AppLink } from '../../../../core/router'
import { Button } from '../../components/Button'
import { CheckField, Field, inputCls } from '../../components/FieldKit'
import { FileDrop } from '../../components/FileDrop'
import { Plus, Trash } from '../../components/pageIcons'
import { Tag, cx } from '../../components/primitives'
import { Check } from '../../icons'

export interface SectionProps {
  form: SubmissionForm
  errors: FormErrors
  setForm: Dispatch<SetStateAction<SubmissionForm>>
}

const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
const cleanEmail = (s: string) => s.replace(/\s/g, '')

/** Numbered card that holds one section. A tick replaces the number once the section is valid. */
export function SectionCard({ id, n, title, text, done, children }: { id: string; n: number; title: string; text: string; done: boolean; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-44 rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:p-7">
      <div className="mb-6 flex items-start gap-3">
        <span aria-hidden="true" className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold', done ? 'bg-brand-800 text-white' : 'bg-accent-50 text-accent-800 ring-1 ring-inset ring-accent-200')}>
          {done ? <Check className="h-5 w-5" /> : n}
        </span>
        <div>
          <h2 id={`${id}-h`} tabIndex={-1} className="font-display text-xl font-bold text-graphite-800 focus:outline-none">{title}{done && <span className="sr-only"> (complete)</span>}</h2>
          <p className="mt-0.5 text-sm text-graphite-600">{text}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

export function ManuscriptSection({ form, errors, setForm }: SectionProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  const words = wordCount(form.abstract)
  const kw = parseKeywords(form.keywords)
  const wordTone = words === 0 ? 'text-graphite-600' : words < ABSTRACT_MIN_WORDS || words > ABSTRACT_MAX_WORDS ? 'text-cta-800' : 'text-brand-700'
  return (
    <div className="space-y-5">
      <Field label="Manuscript title" name="title" required error={errors.title} counter={`${form.title.length} / ${LIMITS.title}`}>
        <input className={inputCls(errors.title)} value={form.title} maxLength={LIMITS.title} placeholder="Full title of your manuscript"
          onChange={(e) => set('title', e.target.value.replace(/\s{2,}/g, ' '))} onBlur={() => set('title', form.title.trim())} />
      </Field>
      <div>
        <Field label="Abstract" name="abstract" required error={errors.abstract} hint={`${ABSTRACT_MIN_WORDS} to ${ABSTRACT_MAX_WORDS} words. Summarise the aim, method, findings and conclusion.`}>
          <textarea rows={8} className={inputCls(errors.abstract)} value={form.abstract} onChange={(e) => set('abstract', e.target.value)} onBlur={() => set('abstract', form.abstract.trim())} />
        </Field>
        <p className={cx('mt-1 text-right text-xs font-semibold tabular-nums', wordTone)} aria-live="polite">{words} / {ABSTRACT_MAX_WORDS} words</p>
      </div>
      <div>
        <Field label="Keywords" name="keywords" required error={errors.keywords} hint="3 to 8 keywords, separated by commas.">
          <input className={inputCls(errors.keywords)} value={form.keywords} maxLength={300} placeholder="e.g. composites, graphene, tensile strength" onChange={(e) => set('keywords', e.target.value)} />
        </Field>
        {kw.length > 0 && <ul aria-label="Keyword preview" className="mt-2 flex flex-wrap gap-1.5">{kw.slice(0, 12).map((k, i) => <li key={`${k}-${i}`}><Tag>{k}</Tag></li>)}</ul>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Article type" name="articleType" required error={errors.articleType}>
          <select className={inputCls(errors.articleType)} value={form.articleType} onChange={(e) => set('articleType', e.target.value as ArticleType | '')}>
            <option value="">Select a type</option>
            {ARTICLE_TYPES.filter((t) => t !== 'Editorial').map((t) => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Discipline" name="subject" required error={errors.subject}>
          <select className={inputCls(errors.subject)} value={form.subject} onChange={(e) => set('subject', e.target.value)}>
            <option value="">Select a discipline</option>
            {journal.subjects.map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
    </div>
  )
}

export function AuthorsSection({ form, errors, setForm }: SectionProps) {
  const a = form.author
  const setAuthor = (patch: Partial<SubmissionForm['author']>) => setForm((f) => ({ ...f, author: { ...f.author, ...patch } }))
  const setCo = (id: number, patch: Partial<SubmissionForm['coAuthors'][number]>) =>
    setForm((f) => ({ ...f, coAuthors: f.coAuthors.map((c) => (c.id === id ? { ...c, ...patch } : c)) }))
  const addCo = () => setForm((f) => ({ ...f, coAuthors: [...f.coAuthors, { id: Date.now(), name: '', email: '', institution: '' }] }))
  const removeCo = (id: number) => setForm((f) => ({ ...f, coAuthors: f.coAuthors.filter((c) => c.id !== id) }))
  const maxPhone = phoneMaxLength(a.dialCode)

  return (
    <div className="space-y-8">
      <fieldset className="space-y-5">
        <legend className="mb-1 font-display text-base font-semibold text-brand-800">Corresponding author</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="author.name" required error={errors['author.name']}>
            <input className={inputCls(errors['author.name'])} value={a.name} maxLength={LIMITS.name} autoComplete="name"
              onChange={(e) => setAuthor({ name: cleanName(e.target.value) })} onBlur={() => setAuthor({ name: a.name.trim() })} />
          </Field>
          <Field label="Email" name="author.email" required error={errors['author.email']} hint="Your Paper ID and all updates are sent here.">
            <input type="email" className={inputCls(errors['author.email'])} value={a.email} maxLength={LIMITS.email} autoComplete="email" inputMode="email" placeholder="name@institution.edu"
              onChange={(e) => setAuthor({ email: cleanEmail(e.target.value) })} onBlur={() => setAuthor({ email: a.email.trim().toLowerCase() })} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-[minmax(0,13rem)_1fr]">
          <Field label="Country code" name="author.dialCode" required>
            <select className={inputCls()} value={a.dialCode} onChange={(e) => setAuthor({ dialCode: e.target.value, whatsapp: a.whatsapp.slice(0, phoneMaxLength(e.target.value)) })}>
              {DIAL_CODES.map((d) => <option key={d.code} value={d.code}>{d.label}</option>)}
            </select>
          </Field>
          <Field label="WhatsApp number" name="author.whatsapp" required error={errors['author.whatsapp']}
            hint={a.dialCode === '+91' ? '10-digit mobile number. Updates are also sent here.' : 'Number without the country code. Updates are also sent here.'}>
            <input type="tel" inputMode="numeric" className={inputCls(errors['author.whatsapp'])} value={a.whatsapp} maxLength={maxPhone} autoComplete="tel-national"
              placeholder={a.dialCode === '+91' ? journal.whatsapp.replace(/^\+91\s?/, '').replace(/\s/g, '') : '5551234567'}
              onChange={(e) => setAuthor({ whatsapp: digitsOnly(e.target.value).slice(0, maxPhone) })} />
          </Field>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Affiliation (institution)" name="author.institution" required error={errors['author.institution']}>
            <input className={inputCls(errors['author.institution'])} value={a.institution} maxLength={LIMITS.institution} autoComplete="organization"
              onChange={(e) => setAuthor({ institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setAuthor({ institution: a.institution.trim() })} />
          </Field>
          <Field label="Country" name="author.country" required error={errors['author.country']}>
            <select className={inputCls(errors['author.country'])} value={a.country} autoComplete="country-name" onChange={(e) => setAuthor({ country: e.target.value })}>
              {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <Field label="ORCID iD" name="author.orcid" error={errors['author.orcid']} hint="Format: 0000-0002-1825-0097">
          <input className={inputCls(errors['author.orcid'])} value={a.orcid} maxLength={19} inputMode="numeric" placeholder="0000-0000-0000-0000"
            onChange={(e) => setAuthor({ orcid: formatOrcid(e.target.value) })} />
        </Field>
      </fieldset>

      <section aria-labelledby="co-h">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 id="co-h" className="font-display text-base font-semibold text-brand-800">Co-authors</h3>
            <p className="text-sm text-graphite-600">{form.coAuthors.length === 0 ? 'None added. Every listed co-author receives a certificate after publication.' : `${form.coAuthors.length} added`}</p>
          </div>
          <Button variant="outline" disabled={form.coAuthors.length >= 15} onClick={addCo}><Plus className="h-4 w-4" aria-hidden="true" />Add co-author</Button>
        </div>
        <ul className="mt-4 space-y-4">
          {form.coAuthors.map((c, i) => (
            <li key={c.id} className="rounded-panel border border-graphite-200 bg-graphite-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-graphite-800">Co-author {i + 1}</span>
                <button type="button" onClick={() => removeCo(c.id)} aria-label={`Remove co-author ${i + 1}`} className="inline-flex items-center gap-1 rounded-chip px-2 py-1 text-xs font-semibold text-red-700 hover:bg-white"><Trash className="h-4 w-4" aria-hidden="true" />Remove</button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Name" name={`co.${c.id}.name`} required error={errors[`co.${c.id}.name`]}>
                  <input className={inputCls(errors[`co.${c.id}.name`])} value={c.name} maxLength={LIMITS.name} onChange={(e) => setCo(c.id, { name: cleanName(e.target.value) })} onBlur={() => setCo(c.id, { name: c.name.trim() })} />
                </Field>
                <Field label="Email" name={`co.${c.id}.email`} required error={errors[`co.${c.id}.email`]}>
                  <input type="email" className={inputCls(errors[`co.${c.id}.email`])} value={c.email} maxLength={LIMITS.email} onChange={(e) => setCo(c.id, { email: cleanEmail(e.target.value) })} onBlur={() => setCo(c.id, { email: c.email.trim().toLowerCase() })} />
                </Field>
                <Field label="Affiliation" name={`co.${c.id}.institution`} required error={errors[`co.${c.id}.institution`]}>
                  <input className={inputCls(errors[`co.${c.id}.institution`])} value={c.institution} maxLength={LIMITS.institution} onChange={(e) => setCo(c.id, { institution: e.target.value.replace(/\s{2,}/g, ' ') })} onBlur={() => setCo(c.id, { institution: c.institution.trim() })} />
                </Field>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export function FilesSection({ form, errors, setForm }: SectionProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  const decl = (k: keyof SubmissionForm['declarations'], v: boolean) => setForm((f) => ({ ...f, declarations: { ...f.declarations, [k]: v } }))
  return (
    <div className="space-y-6">
      <div>
        <span id="file-label" className="mb-1.5 block text-sm font-medium text-graphite-800">Manuscript file <span className="text-red-700" aria-hidden="true">*</span></span>
        <FileDrop name="file" value={form.file} onChange={(f) => set('file', f)} validate={validateFile} accept={ACCEPTED_EXT.join(',')} error={errors.file}
          hint={`Word files only (${ACCEPTED_EXT.join(', ')}), up to ${MAX_FILE_MB} MB.`} describedBy="file-label" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Mentor name" name="mentor" error={errors.mentor}>
          <input className={inputCls(errors.mentor)} value={form.mentor} maxLength={LIMITS.mentor} onChange={(e) => set('mentor', cleanName(e.target.value))} onBlur={() => set('mentor', form.mentor.trim())} />
        </Field>
        <Field label="Referral code" name="referralCode" error={errors.referralCode} hint="4 to 20 letters, numbers or hyphens. Earn credits when a colleague refers you.">
          <input className={inputCls(errors.referralCode)} value={form.referralCode} maxLength={20} onChange={(e) => set('referralCode', formatReferral(e.target.value))} />
        </Field>
      </div>
      <Field label="Cover letter / suggested reviewers" name="coverLetter" error={errors.coverLetter} counter={`${form.coverLetter.length} / ${LIMITS.coverLetter}`}>
        <textarea rows={5} className={inputCls(errors.coverLetter)} value={form.coverLetter} maxLength={LIMITS.coverLetter} onChange={(e) => set('coverLetter', e.target.value)}
          placeholder={`Briefly explain why this work suits ${journal.shortName}, and name any reviewers you suggest.`} />
      </Field>

      <fieldset className="space-y-4 rounded-panel border border-graphite-200 bg-graphite-50 p-4 sm:p-5">
        <legend className="px-2 font-display text-base font-semibold text-brand-800">Declarations and consent</legend>
        <CheckField name="originality" checked={form.declarations.originality} error={errors.originality} onChange={(v) => decl('originality', v)}>
          I confirm this manuscript is original, has not been published before, and all authors have approved it.
        </CheckField>
        <CheckField name="noSimultaneous" checked={form.declarations.noSimultaneous} error={errors.noSimultaneous} onChange={(v) => decl('noSimultaneous', v)}>
          I confirm it is not under consideration by any other journal at the same time.
        </CheckField>
        <CheckField name="consentData" checked={form.declarations.consentData} error={errors.consentData} onChange={(v) => decl('consentData', v)}>
          I consent to {journal.shortName} processing the personal data in this submission to review and publish my work, as described in the{' '}
          <AppLink to={paths.policy('privacy')} className="font-semibold text-accent-700 underline">Privacy Policy</AppLink>. Author names and affiliations appear publicly if the article is published.
        </CheckField>
        <CheckField name="consentMessages" checked={form.declarations.consentMessages} error={errors.consentMessages} onChange={(v) => decl('consentMessages', v)}>
          I consent to receive my Paper ID and status updates by WhatsApp, SMS and email.
        </CheckField>
        <p className="border-t border-graphite-200 pt-3 text-xs text-graphite-600">You can withdraw consent at any time: reply STOP to any message, or email {journal.email}. Withdrawing does not affect work already published.</p>
      </fieldset>

      {/* Placeholder for the real reCAPTCHA widget. */}
      <div>
        <div className="flex w-full max-w-sm items-center gap-3 rounded-soft border border-graphite-300 bg-white px-4 py-3">
          <button type="button" name="captcha" role="checkbox" aria-checked={form.captcha} aria-label="I am not a robot" aria-invalid={errors.captcha ? true : undefined}
            onClick={() => set('captcha', !form.captcha)}
            className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-chip border-2', form.captcha ? 'border-brand-800 bg-brand-800 text-white' : 'border-graphite-500 bg-white')}>
            {form.captcha && <Check className="h-4 w-4" aria-hidden="true" />}
          </button>
          <span className="text-sm text-graphite-800">I’m not a robot</span>
          <span className="ml-auto text-[10px] text-graphite-600">reCAPTCHA placeholder</span>
        </div>
        {errors.captcha && <p className="mt-1 text-xs font-medium text-red-700">{errors.captcha}</p>}
      </div>
    </div>
  )
}
