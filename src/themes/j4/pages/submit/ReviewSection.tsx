// Submission action bar (reference layout): Save Draft, Preview Summary and the main Submit button, with a read-only summary and the trust strip.
import { useState, type ReactNode } from 'react'
import { journal } from '../../../../config/journals'
import type { SubmissionForm } from '../../../../core/lib/submission'
import { Spinner } from '../../components/form/Field'
import { cx } from '../../components/primitives'
import { Lock, Preview, Save, SendIcon, VerifiedUser } from './mi'
import type { SectionId } from './shared'

function Row({ k, children }: { k: string; children?: ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-slate-200 px-4 py-2 last:border-b-0 sm:grid-cols-[9rem_1fr] sm:gap-4">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">{k}</dt>
      <dd className="min-w-0 break-words text-xs text-slate-900">{children || <span className="text-slate-600">Not provided</span>}</dd>
    </div>
  )
}

export function ReviewSection({ form, missing, busy, submitError, onJump, onSaveDraft, savedLabel }: {
  form: SubmissionForm; missing: number; busy: boolean; submitError: string; onJump: (id: SectionId) => void; onSaveDraft: () => void; savedLabel: string
}) {
  const [open, setOpen] = useState(false)
  const a = form.author
  const abstract = form.abstract.trim()
  const Head = ({ title, id }: { title: string; id: SectionId }) => (
    <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4">
      <h3 className="font-serif4 text-sm font-semibold text-[#0b2545]">{title}</h3>
      <button type="button" onClick={() => onJump(id)} aria-label={`Edit ${title}`} className="min-h-[44px] px-2 text-xs font-semibold text-sky-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:min-h-8">Edit</button>
    </div>
  )
  const ghost = 'flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:flex-none'
  return (
    <section id="sec-review" aria-labelledby="sec-review-h" className="scroll-mt-24 space-y-4 rounded-xl border border-slate-300 bg-slate-50 p-5 shadow-sm md:p-6">
      <h2 id="sec-review-h" className="sr-only">Review and submit</h2>
      {open && (
        <div id="summary-panel" className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Head title="Article details" id="details" />
            <dl>
              <Row k="Title">{form.title}</Row><Row k="Type">{form.articleType}</Row><Row k="Research area">{form.subject}</Row>
              <Row k="Abstract">{abstract && (abstract.length > 260 ? `${abstract.slice(0, 260)}…` : abstract)}</Row><Row k="Keywords">{form.keywords}</Row>
            </dl>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Head title="Research team" id="authors" />
            <dl>
              <Row k="Corresponding">{a.name && `${a.name}${a.email ? ` (${a.email})` : ''}`}</Row>
              <Row k="WhatsApp">{a.whatsapp && `${a.dialCode} ${a.whatsapp}`}</Row>
              <Row k="Affiliation">{a.institution && `${a.institution}, ${a.country}`}</Row>
              <Row k="ORCID iD">{a.orcid}</Row>
              <Row k="Co-authors">{form.coAuthors.length ? form.coAuthors.map((c) => c.name || 'Unnamed').join(', ') : 'None'}</Row>
              <Row k="Mentor">{form.mentor || undefined}</Row>
            </dl>
          </div>
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Head title="File and declarations" id="files" />
            <dl>
              <Row k="Manuscript file">{form.file?.name}</Row><Row k="Referral code">{form.referralCode || undefined}</Row>
              <Row k="Declarations">{Object.values(form.declarations).every(Boolean) && form.captcha ? 'All confirmed' : ''}</Row>
            </dl>
          </div>
        </div>
      )}
      <p role="status" className={cx('rounded border px-3 py-2 text-xs font-medium', missing ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-sky-200 bg-sky-50 text-slate-900')}>
        {missing ? `${missing} required item${missing === 1 ? '' : 's'} still need attention. Pressing Submit takes you to the first one.` : 'Every required item is complete. You can submit your manuscript.'}
      </p>
      {submitError && <p role="alert" className="rounded border border-red-700 bg-red-50 p-3 text-xs font-semibold text-red-700">{submitError}</p>}
      <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button type="button" onClick={onSaveDraft} className={ghost}><Save className="h-4 w-4 text-slate-500" aria-hidden="true" />Save Draft</button>
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="summary-panel" className={ghost}><Preview className="h-4 w-4 text-sky-600" aria-hidden="true" />{open ? 'Hide Summary' : 'Preview Summary'}</button>
        </div>
        <button type="submit" disabled={busy} aria-busy={busy}
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-sky-700 bg-sky-600 px-7 py-3 text-xs font-bold text-white shadow-md transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:text-sm">
          {busy ? <Spinner /> : <SendIcon className="h-5 w-5" aria-hidden="true" />}{busy ? 'Submitting…' : 'Submit Manuscript to Editorial Board →'}
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-[11px] text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1 font-medium text-emerald-800"><Lock className="h-3.5 w-3.5" aria-hidden="true" />Free until acceptance</span><span aria-hidden="true">•</span>
          <span className="flex items-center gap-1"><VerifiedUser className="h-3.5 w-3.5 text-sky-600" aria-hidden="true" />Editor screens scope and similarity</span><span aria-hidden="true">•</span>
          <span>APC if accepted: {'₹'}{journal.apc.inr.toLocaleString('en-IN')} + {journal.apc.gstPercent}% GST or US${journal.apc.usd}</span>
        </div>
        <div className="font-mono font-semibold text-slate-700" aria-live="polite">{savedLabel}</div>
      </div>
    </section>
  )
}
