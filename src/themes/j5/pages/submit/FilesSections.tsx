// Sections 03 and 04: manuscript file with optional notes, and the declarations.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { ACCEPTED_EXT, LIMITS, MAX_FILE_MB, validateFile, type SubmissionForm } from '../../../../core/lib/submission'
import { formatReferral } from '../../../../core/lib/validators'
import { AppLink } from '../../../../core/router'
import { CheckRow, Field, fieldInput } from '../../components/form/Field'
import { FileDrop } from '../../components/form/FileDrop'
import { Section, Sub, cleanName, type SectionProps } from './shared'

export function FilesSection({ form, errors, setForm }: SectionProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <Section n={3} id="files" title="Manuscript file" text="One Word file containing the full paper, figures and references.">
      <div>
        <span id="file-label" className="mb-1.5 block text-sm font-semibold text-obsidian-900">Manuscript file <span className="text-red-700" aria-hidden="true">*</span></span>
        <FileDrop name="file" value={form.file} onChange={(f) => set('file', f)} validate={validateFile} accept={ACCEPTED_EXT.join(',')} error={errors.file}
          hint={`Word files only (${ACCEPTED_EXT.join(', ')}), up to ${MAX_FILE_MB} MB.`} describedBy="file-label" />
      </div>
      <fieldset className="space-y-5 border-t border-[#E6DCD0] pt-6">
        <legend className="mb-3"><Sub>Optional notes</Sub></legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Mentor name" name="mentor" optional error={errors.mentor}>
            <input className={fieldInput(errors.mentor)} value={form.mentor} maxLength={LIMITS.mentor} onChange={(e) => set('mentor', cleanName(e.target.value))} onBlur={() => set('mentor', form.mentor.trim())} />
          </Field>
          <Field label="Referral code" name="referralCode" optional error={errors.referralCode} hint="4 to 20 letters, numbers or hyphens.">
            <input className={fieldInput(errors.referralCode)} value={form.referralCode} maxLength={20} autoComplete="off" onChange={(e) => set('referralCode', formatReferral(e.target.value))} />
          </Field>
        </div>
        <Field label="Cover letter or suggested reviewers" name="coverLetter" optional error={errors.coverLetter} counter={`${form.coverLetter.length} / ${LIMITS.coverLetter}`}>
          <textarea rows={5} className={fieldInput(errors.coverLetter)} value={form.coverLetter} maxLength={LIMITS.coverLetter} onChange={(e) => set('coverLetter', e.target.value)}
            placeholder={`Briefly explain why this work suits ${journal.shortName}, and name any reviewers you suggest.`} />
        </Field>
      </fieldset>
    </Section>
  )
}

export function DeclarationsSection({ form, errors, setForm }: SectionProps) {
  const decl = (k: keyof SubmissionForm['declarations'], v: boolean) => setForm((f) => ({ ...f, declarations: { ...f.declarations, [k]: v } }))
  return (
    <Section n={4} id="declarations" title="Declarations and consent" text="All four statements and the check below are required.">
      <div className="space-y-3">
        <CheckRow name="originality" checked={form.declarations.originality} error={errors.originality} onChange={(v) => decl('originality', v)}>
          I confirm this manuscript is original, has not been published before, and all authors have approved it.
        </CheckRow>
        <CheckRow name="noSimultaneous" checked={form.declarations.noSimultaneous} error={errors.noSimultaneous} onChange={(v) => decl('noSimultaneous', v)}>
          I confirm it is not under consideration by any other journal at the same time.
        </CheckRow>
        <CheckRow name="consentData" checked={form.declarations.consentData} error={errors.consentData} onChange={(v) => decl('consentData', v)}>
          I consent to {journal.shortName} processing the personal data in this submission to review and publish my work, as described in the{' '}
          <AppLink to={paths.policy('privacy')} className="font-semibold text-wine-700 underline">Privacy Policy</AppLink>. Author names and affiliations appear publicly if the article is published.
        </CheckRow>
        <CheckRow name="consentMessages" checked={form.declarations.consentMessages} error={errors.consentMessages} onChange={(v) => decl('consentMessages', v)}>
          I consent to receive my Paper ID and status updates by WhatsApp, SMS and email.
        </CheckRow>
      </div>
      <p className="text-sm text-obsidian-600">You can withdraw consent at any time: reply STOP to any message, or email {journal.email}. Withdrawing does not affect work already published.</p>
      {/* Placeholder for the real reCAPTCHA widget. */}
      <CheckRow name="captcha" checked={form.captcha} error={errors.captcha} onChange={(v) => setForm((f) => ({ ...f, captcha: v }))}>
        I am not a robot <span className="text-xs text-obsidian-600">(reCAPTCHA placeholder)</span>
      </CheckRow>
    </Section>
  )
}
