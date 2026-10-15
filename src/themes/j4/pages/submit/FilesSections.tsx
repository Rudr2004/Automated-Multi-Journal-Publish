// Sections C, D and E: manuscript upload (with cover letter), ethical declarations, optional referral code.
import { useState } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { ACCEPTED_EXT, MAX_FILE_MB, validateFile, type SubmissionForm } from '../../../../core/lib/submission'
import { formatReferral, referralCode } from '../../../../core/lib/validators'
import { AppLink } from '../../../../core/router'
import { Spinner } from '../../components/form/Field'
import { FileDrop } from '../../components/form/FileDrop'
import { cx } from '../../components/primitives'
import { CheckCircle, Description, Info, Ticket } from './mi'
import { RField, Section, refInput, type SectionProps } from './shared'

export function FilesSection({ form, errors, setForm }: SectionProps) {
  const set = <K extends keyof SubmissionForm>(k: K, v: SubmissionForm[K]) => setForm((f) => ({ ...f, [k]: v }))
  return (
    <Section letter="C" id="files" title="Manuscript & Document Uploads" text="One Word file containing the full paper, figures and references." chip="Step 3 of 4">
      <div className="space-y-2">
        <span id="file-label" className="flex items-center gap-1 text-xs font-semibold text-slate-700"><Description className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />Primary Manuscript File ({ACCEPTED_EXT.join(', ')}) <span className="text-red-600" aria-hidden="true">*</span></span>
        <FileDrop look="ref" name="file" value={form.file} onChange={(f) => set('file', f)} validate={validateFile} accept={ACCEPTED_EXT.join(',')} error={errors.file}
          hint={`Supported formats: Microsoft Word (${ACCEPTED_EXT.join(', ')}). Maximum file size: ${MAX_FILE_MB} MB.`} describedBy="file-label" />
      </div>
    </Section>
  )
}

function Decl({ name, checked, error, onChange, title, children }: { name: string; checked: boolean; error?: string; onChange: (v: boolean) => void; title: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={cx('flex min-h-[44px] cursor-pointer items-start gap-2.5 rounded-lg border p-3 transition-colors focus-within:ring-2 focus-within:ring-sky-600/50',
        error ? 'border-red-700 bg-red-50' : 'border-slate-200 hover:bg-slate-50')}>
        <input name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 accent-sky-600" />
        <span><span className="font-bold text-slate-800">{title}</span><span className="mt-0.5 block text-[11px] leading-relaxed text-slate-600">{children}</span></span>
      </label>
      {error && <p role="alert" className="mt-1.5 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  )
}

export function DeclarationsSection({ form, errors, setForm }: SectionProps) {
  const decl = (k: keyof SubmissionForm['declarations'], v: boolean) => setForm((f) => ({ ...f, declarations: { ...f.declarations, [k]: v } }))
  return (
    <Section letter="D" id="declarations" title="Ethical Declarations & Compliance" text="All four statements and the check below are required." chip="Step 4 of 4">
      <div className="space-y-3 text-xs">
        <Decl name="originality" title="Original Work & Prior Non-Publication:" checked={form.declarations.originality} error={errors.originality} onChange={(v) => decl('originality', v)}>
          I confirm this manuscript is original, has not been published before, and all authors have approved it.
        </Decl>
        <Decl name="noSimultaneous" title="No Simultaneous Submission:" checked={form.declarations.noSimultaneous} error={errors.noSimultaneous} onChange={(v) => decl('noSimultaneous', v)}>
          I confirm it is not under consideration by any other journal at the same time.
        </Decl>
        <Decl name="consentData" title="Data Processing Consent:" checked={form.declarations.consentData} error={errors.consentData} onChange={(v) => decl('consentData', v)}>
          I consent to {journal.shortName} processing the personal data in this submission to review and publish my work, as described in the{' '}
          <AppLink to={paths.policy('privacy')} className="font-semibold text-sky-700 underline">Privacy Policy</AppLink>. Author names and affiliations appear publicly if the article is published.
        </Decl>
        <Decl name="consentMessages" title="Status Updates:" checked={form.declarations.consentMessages} error={errors.consentMessages} onChange={(v) => decl('consentMessages', v)}>
          I consent to receive my Manuscript ID and status updates by WhatsApp, SMS and email. You can withdraw consent at any time: reply STOP to any message, or email {journal.email}.
        </Decl>
        {/* Placeholder for the real reCAPTCHA widget. */}
        <Decl name="captcha" title="I am not a robot" checked={form.captcha} error={errors.captcha} onChange={(v) => setForm((f) => ({ ...f, captcha: v }))}>reCAPTCHA placeholder</Decl>
      </div>
    </Section>
  )
}

export function ReferralSection({ form, errors, setForm }: SectionProps) {
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const check = () => {
    const bad = referralCode(form.referralCode)
    setBusy(true)
    setTimeout(() => { setBusy(false); setNote(form.referralCode.trim() ? (bad || 'Format looks valid. The code is confirmed when you submit.') : 'Enter a code first.') }, 250)
  }
  return (
    <Section letter="E" id="referral" title="Referral Code" titleNote="(Optional)" text="Enter an author referral code or invite code provided by an editorial member or collaborating author." chip="Optional Step" chipTone="slate">
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <RField className="flex-1" label="Author Referral Code" name="referralCode" error={errors.referralCode} icon={<Ticket className="h-4 w-4 text-sky-600" aria-hidden="true" />}>
            <input className={cx(refInput(errors.referralCode), 'font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal')} value={form.referralCode} maxLength={20} autoComplete="off" placeholder="e.g. REF-AUTH-2026"
              onChange={(e) => { setNote(''); setForm((f) => ({ ...f, referralCode: formatReferral(e.target.value) })) }} />
          </RField>
          <button type="button" onClick={check} disabled={busy} className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-1 rounded border border-sky-300 bg-sky-50 px-4 py-2 text-xs font-semibold text-sky-700 transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:mt-[1.5rem] sm:min-h-0">
            {busy ? <Spinner dark /> : <CheckCircle className="h-3.5 w-3.5" aria-hidden="true" />}Validate Code
          </button>
        </div>
        <p role="status" className="flex items-center gap-1 text-[11px] text-slate-600"><Info className="h-3.5 w-3.5 shrink-0 text-sky-600" aria-hidden="true" />{note || 'Optional: if you received a referral code from an author or editor, enter it here (4 to 20 letters, numbers or hyphens).'}</p>
      </div>
    </Section>
  )
}
