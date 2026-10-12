// Sections D and E: manuscript file with optional cover letter, and the declarations with the optional referral code.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { ACCEPTED_EXT, LIMITS, MAX_FILE_MB, validateFile, type SubmissionForm } from '../../../../core/lib/submission'
import { formatReferral } from '../../../../core/lib/validators'
import { AppLink } from '../../../../core/router'
import { useToast } from '../../components/Toast'
import { Dropzone } from './Dropzone'
import { CheckCircle, Key, Ticket } from './mi'
import { Decl, Fld, Section, inp, softBtn, type SectionProps } from './shared'

export function FilesSection({ form, errors, setForm }: SectionProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <Section letter="D" id="files" title="Manuscript File Upload & Notes" note="Step 3 of 4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span id="file-label" className="font-work text-[13px] font-bold text-[#141B2B]">Primary Manuscript File ({ACCEPTED_EXT.join(' / ')}) <span className="text-red-700" aria-hidden="true">*</span></span>
          <span className="font-work text-xs font-semibold text-ochre-700">One Word file with figures and references</span>
        </div>
        <Dropzone name="file" value={form.file} onChange={(f) => set('file', f)} validate={validateFile} accept={ACCEPTED_EXT.join(',')} error={errors.file}
          hint={`Word files only (${ACCEPTED_EXT.join(', ')}), up to ${MAX_FILE_MB} MB.`} describedBy="file-label" />
      </div>
      <Fld label="Cover letter or suggested reviewers" name="coverLetter" optional error={errors.coverLetter} counter={`${form.coverLetter.length} / ${LIMITS.coverLetter}`}>
        <textarea rows={5} className={inp(errors.coverLetter)} value={form.coverLetter} maxLength={LIMITS.coverLetter} onChange={(e) => set('coverLetter', e.target.value)}
          placeholder={`Briefly explain why this work suits ${journal.shortName}, and name any reviewers you suggest.`} />
      </Fld>
    </Section>
  )
}

export function DeclarationsSection({ form, errors, setForm }: SectionProps) {
  const toast = useToast()
  const decl = (k: keyof SubmissionForm['declarations'], v: boolean) => setForm((f) => ({ ...f, declarations: { ...f.declarations, [k]: v } }))
  return (
    <Section letter="E" id="declarations" title="Ethical Declarations & Referral" note="Step 4 of 4">
      <div className="flex flex-col gap-2.5">
        <Decl name="originality" checked={form.declarations.originality} error={errors.originality} onChange={(v) => decl('originality', v)}>
          <strong>Originality &amp; Authorship:</strong> I confirm this manuscript is original, has not been published before, and all authors have approved it.
        </Decl>
        <Decl name="noSimultaneous" checked={form.declarations.noSimultaneous} error={errors.noSimultaneous} onChange={(v) => decl('noSimultaneous', v)}>
          <strong>Non-Duplication:</strong> I confirm it is not under consideration by any other journal at the same time.
        </Decl>
        <Decl name="consentData" checked={form.declarations.consentData} error={errors.consentData} onChange={(v) => decl('consentData', v)}>
          <strong>Data Consent:</strong> I consent to {journal.shortName} processing the personal data in this submission to review and publish my work, as described in the{' '}
          <AppLink to={paths.policy('privacy')} className="font-semibold text-wine-800 underline">Privacy Policy</AppLink>. Author names and affiliations appear publicly if the article is published.
        </Decl>
        <Decl name="consentMessages" checked={form.declarations.consentMessages} error={errors.consentMessages} onChange={(v) => decl('consentMessages', v)}>
          <strong>Status Messages:</strong> I consent to receive my Paper ID and status updates by WhatsApp, SMS and email.
        </Decl>
        {/* Placeholder for the real reCAPTCHA widget. */}
        <Decl name="captcha" checked={form.captcha} error={errors.captcha} onChange={(v) => setForm((f) => ({ ...f, captcha: v }))}>
          <strong>Human Check:</strong> I am not a robot <span className="font-work text-xs text-[#564241]">(reCAPTCHA placeholder)</span>
        </Decl>
      </div>
      <p className="font-serif4 text-[15px] leading-6 text-[#564241]">
        <strong className="text-[#141B2B]">Open Access Licensing:</strong> if accepted, the article is published under <strong className="text-wine-900">{journal.licence.name}</strong> and authors keep their copyright.
        You can withdraw consent at any time: reply STOP to any message, or email {journal.email}. Withdrawing does not affect work already published.
      </p>

      <div className="flex flex-col gap-3 border-t border-[#DCC0BE]/30 pt-4">
        <Fld label="Referral Code" name="referralCode" optional error={errors.referralCode} hint="4 to 20 letters, numbers or hyphens. Valid codes are verified at desk screening."
          icon={<Ticket aria-hidden="true" className="pointer-events-none absolute left-2.5 top-3 h-5 w-5 text-ochre-700" />}
          after={
            <button type="button" className={softBtn + ' shrink-0'}
              onClick={() => toast(form.referralCode ? 'Referral code noted. It is verified at desk screening.' : 'Enter a referral code first.', form.referralCode ? undefined : 'error')}>
              <CheckCircle className="h-4 w-4" aria-hidden="true" />Apply Code
            </button>
          }>
          <input className={inp(errors.referralCode, 'pl-9 font-mono text-sm uppercase placeholder:normal-case')} value={form.referralCode} maxLength={20} autoComplete="off" placeholder="e.g. IJFRD-REF-2026"
            onChange={(e) => setForm((f) => ({ ...f, referralCode: formatReferral(e.target.value) }))} />
        </Fld>
        <p className="flex items-center gap-1.5 font-work text-xs text-[#564241]"><Key className="h-4 w-4 text-ochre-700" aria-hidden="true" />Optional: use a partner or colleague referral code, if you have one.</p>
      </div>
    </Section>
  )
}
