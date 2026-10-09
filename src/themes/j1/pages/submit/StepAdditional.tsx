import { MdOutlineVerifiedUser, MdOutlineLockOpen } from 'react-icons/md'
import { Check } from '../../components/uiIcons'
import { journal } from '../../../../config/journals/j1'
import { Checkbox, Field, inputClass } from '../../components/form'
import type { ReactNode } from 'react'
import { paths } from '../../../../config/routes'
import { LIMITS, type SubmissionForm } from '../../../../core/lib/submission'
import { formatReferral } from '../../../../core/lib/validators'
import type { StepProps } from './types'

const PRIVACY_HREF = paths.policy('privacy')

const DECLARATIONS: { key: keyof SubmissionForm['declarations']; text: ReactNode }[] = [
  { key: 'originality', text: (<><strong className="text-navy">Original work &amp; plagiarism:</strong> I confirm this manuscript is original, has not been published before, and all authors have approved it.</>) },
  { key: 'noSimultaneous', text: (<><strong className="text-navy">No simultaneous submission:</strong> I confirm it is not under consideration by any other journal at the same time.</>) },
  { key: 'consentData', text: (<><strong className="text-navy">Author consents:</strong> I consent to the journal processing the personal data in this submission (names, emails, phone numbers, affiliations) to review and publish my work, as described in the <a href={PRIVACY_HREF} target="_blank" rel="noreferrer" className="font-semibold text-scholar underline">Privacy Policy</a>. Author names and affiliations appear publicly if the article is published.</>) },
  { key: 'consentMessages', text: (<><strong className="text-navy">Messages consent:</strong> I consent to receive my Paper ID and status updates by WhatsApp, SMS and email.</>) },
]

export function StepAdditional({ form, errors, onChange }: StepProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => onChange({ ...form, [k]: v })
  return (
    <div className="space-y-5">
      <div className="sm:max-w-sm">
        <Field label="Referral code (optional)" name="referralCode" error={errors.referralCode} hint="4–20 letters, numbers or hyphens. Earn credits when a colleague refers you.">
          <input className={inputClass(errors.referralCode)} value={form.referralCode} maxLength={20} onChange={(e) => set('referralCode', formatReferral(e.target.value))} />
        </Field>
      </div>
      <Field label="Cover letter (optional)" name="coverLetter" error={errors.coverLetter} counter={`${form.coverLetter.length} / ${LIMITS.coverLetter}`}>
        <textarea rows={5} className={inputClass(errors.coverLetter)} value={form.coverLetter} maxLength={LIMITS.coverLetter} onChange={(e) => set('coverLetter', e.target.value)}
          placeholder="Briefly explain the significance of your work for the journal’s readers." />
      </Field>

      <fieldset className="space-y-4 rounded-card border border-line p-5">
        <legend className="flex items-center gap-2 px-2 font-serif text-lg font-semibold text-navy"><MdOutlineVerifiedUser className="h-5 w-5 text-scholar" aria-hidden />Ethical &amp; publication integrity checklist</legend>
        {DECLARATIONS.map((d) => (
          <Checkbox key={d.key} name={d.key} checked={form.declarations[d.key]} error={errors[d.key]}
            onChange={(v) => set('declarations', { ...form.declarations, [d.key]: v })}>{d.text}</Checkbox>
        ))}
        <p className="flex gap-3 text-sm text-ink"><MdOutlineLockOpen className="mt-0.5 h-5 w-5 shrink-0 text-[#8A4B00]" aria-hidden /><span><strong className="text-navy">Open Access &amp; copyright:</strong> articles are published under {journal.licence.name}; authors keep their copyright.</span></p>
        <p className="border-t border-line pt-3 text-xs text-ink-muted">You can withdraw either consent at any time: reply STOP to any WhatsApp or SMS message, or email {journal.email}. Withdrawing does not affect work already published.</p>
      </fieldset>

      {/* Placeholder for the real reCAPTCHA widget. */}
      <div>
        <button type="button" name="captcha" role="checkbox" aria-checked={form.captcha} onClick={() => set('captcha', !form.captcha)}
          className="flex w-full max-w-xs items-center gap-3 rounded border border-line bg-paper px-4 py-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar">
          <span aria-hidden className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border-2 ${form.captcha ? 'border-oa bg-oa text-white' : 'border-ink-muted bg-white'}`}>
            {form.captcha && <Check className="h-4 w-4" aria-hidden />}
          </span>
          <span className="text-sm">I’m not a robot</span><span className="ml-auto text-[10px] text-ink-muted">reCAPTCHA (placeholder)</span>
        </button>
        {errors.captcha && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.captcha}</p>}
      </div>
    </div>
  )
}
