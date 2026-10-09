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
  { key: 'originality', text: 'I confirm this manuscript is original, has not been published before, and all authors have approved it.' },
  { key: 'noSimultaneous', text: 'I confirm it is not under consideration by any other journal at the same time.' },
  { key: 'consentData', text: (<>I consent to the journal processing the personal data in this submission (names, emails, phone numbers, affiliations) to review and publish my work, as described in the <a href={PRIVACY_HREF} target="_blank" rel="noreferrer" className="font-semibold text-scholar underline">Privacy Policy</a>. Author names and affiliations appear publicly if the article is published.</>) },
  { key: 'consentMessages', text: 'I consent to receive my Paper ID and status updates by WhatsApp, SMS and email.' },
]

export function StepAdditional({ form, errors, onChange }: StepProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => onChange({ ...form, [k]: v })
  return (
    <div className="space-y-5">
      <div className="grid gap-5">
        <div className="space-y-2 border border-line bg-paper p-4">
          <div><h3 className="font-serif text-base font-semibold text-navy">Referral</h3><p className="text-xs text-ink-muted">Optional. Earn credits when a colleague refers you.</p></div>
          <Field label="Referral code (optional)" name="referralCode" error={errors.referralCode} hint="4–20 letters, numbers or hyphens.">
            <input className={inputClass(errors.referralCode)} value={form.referralCode} maxLength={20} onChange={(e) => set('referralCode', formatReferral(e.target.value))} />
          </Field>
        </div>
      </div>
      <Field label="Cover letter (optional)" name="coverLetter" error={errors.coverLetter} counter={`${form.coverLetter.length} / ${LIMITS.coverLetter}`}>
        <textarea rows={5} className={inputClass(errors.coverLetter)} value={form.coverLetter} maxLength={LIMITS.coverLetter} onChange={(e) => set('coverLetter', e.target.value)}
          placeholder="Briefly explain the significance of your work for the journal’s readers." />
      </Field>

      <fieldset className="space-y-4 rounded-card border border-line p-5">
        <legend className="px-2 font-serif text-lg font-semibold text-navy">Ethical &amp; publication integrity declarations</legend>
        {DECLARATIONS.map((d) => (
          <Checkbox key={d.key} name={d.key} checked={form.declarations[d.key]} error={errors[d.key]}
            onChange={(v) => set('declarations', { ...form.declarations, [d.key]: v })}>{d.text}</Checkbox>
        ))}
        <p className="border-t border-line pt-3 text-xs text-ink-muted">You can withdraw either consent at any time: reply STOP to any WhatsApp or SMS message, or email {journal.email}. Withdrawing does not affect work already published.</p>
      </fieldset>

      {/* Placeholder for the real reCAPTCHA widget. */}
      <div>
        <div className="flex w-full max-w-xs items-center gap-3 rounded border border-line bg-paper px-4 py-3">
          <button type="button" name="captcha" role="checkbox" aria-checked={form.captcha} aria-label="I am not a robot"
            onClick={() => set('captcha', !form.captcha)} className={`flex h-6 w-6 items-center justify-center rounded border-2 ${form.captcha ? 'border-oa bg-oa text-white' : 'border-ink-muted bg-white'}`}>
            {form.captcha && <Check className="h-4 w-4" aria-hidden />}
          </button>
          <span className="text-sm">I’m not a robot</span><span className="ml-auto text-[10px] text-ink-muted">reCAPTCHA (placeholder)</span>
        </div>
        {errors.captcha && <p role="alert" className="mt-1 text-xs font-medium text-danger">{errors.captcha}</p>}
      </div>
    </div>
  )
}
