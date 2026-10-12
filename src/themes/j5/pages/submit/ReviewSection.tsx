// Section F: read-only summary (spec sheet), then the final verification bar with Save Draft and Submit.
import type { ReactNode } from 'react'
import { journal } from '../../../../config/journals'
import type { SubmissionForm } from '../../../../core/lib/submission'
import { Spinner } from '../../components/form/Field'
import { cx } from '../../components/primitives'
import { Forward } from './mi'
import { Section, type SectionId } from './shared'

function Row({ k, children }: { k: string; children?: ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-[#DCC0BE]/40 px-4 py-2.5 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="font-work text-xs font-semibold uppercase tracking-[0.06em] text-[#564241]">{k}</dt>
      <dd className="min-w-0 break-words font-serif4 text-[15px] text-[#141B2B]">{children || <span className="text-[#564241]">Not provided</span>}</dd>
    </div>
  )
}

export function ReviewSection({ form, missing, busy, submitError, onJump, onSaveDraft }: {
  form: SubmissionForm; missing: number; busy: boolean; submitError: string; onJump: (id: SectionId) => void; onSaveDraft: () => void
}) {
  const a = form.author
  const abstract = form.abstract.trim()
  const edit = (id: SectionId, label: string) => (
    <button type="button" onClick={() => onJump(id)} aria-label={`Edit ${label}`} className="min-h-[44px] rounded px-2 font-work text-xs font-bold text-wine-800 hover:bg-[#E1E8FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800">Edit</button>
  )
  const Head = ({ title, id }: { title: string; id: SectionId }) => (
    <div className="flex items-center justify-between gap-3 border-b border-[#DCC0BE]/40 bg-[#E9EDFF] px-4"><h3 className="font-newsreader text-base font-bold text-wine-900">{title}</h3>{edit(id, title)}</div>
  )
  return (
    <>
      <Section letter="F" id="review" title="Review Summary" note="Check, then send">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-[#DCC0BE]/40">
            <Head title="Article details" id="details" />
            <dl>
              <Row k="Title">{form.title}</Row>
              <Row k="Type">{form.articleType}</Row>
              <Row k="Research area">{form.subject}</Row>
              <Row k="Abstract">{abstract && (abstract.length > 260 ? `${abstract.slice(0, 260)}…` : abstract)}</Row>
              <Row k="Keywords">{form.keywords}</Row>
            </dl>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#DCC0BE]/40">
            <Head title="Authors" id="authors" />
            <dl>
              <Row k="Corresponding">{a.name && `${a.name}${a.email ? ` (${a.email})` : ''}`}</Row>
              <Row k="WhatsApp">{a.whatsapp && `${a.dialCode} ${a.whatsapp}`}</Row>
              <Row k="Affiliation">{a.institution && `${a.institution}, ${a.country}`}</Row>
              <Row k="ORCID iD">{a.orcid}</Row>
              <Row k="Co-authors">{form.coAuthors.length ? form.coAuthors.map((c) => c.name || 'Unnamed').join(', ') : 'None'}</Row>
              <Row k="Mentor">{form.mentor || undefined}</Row>
            </dl>
          </div>
          <div className="overflow-hidden rounded-lg border border-[#DCC0BE]/40">
            <Head title="File and declarations" id="files" />
            <dl>
              <Row k="Manuscript file">{form.file?.name}</Row>
              <Row k="Referral code">{form.referralCode || undefined}</Row>
              <Row k="Declarations">{Object.values(form.declarations).every(Boolean) && form.captcha ? 'All confirmed' : ''}</Row>
            </dl>
          </div>
        </div>
        <p role="status" className={cx('rounded-lg border px-4 py-3 font-serif4 text-[15px] font-medium', missing ? 'border-amber-700/40 bg-amber-50 text-amber-900' : 'border-[#DCC0BE]/60 bg-[#F1F3FF] text-[#141B2B]')}>
          {missing ? `${missing} required item${missing === 1 ? '' : 's'} still need attention. Pressing Submit takes you to the first one.` : 'Every required item is complete. You can submit your manuscript.'}
        </p>
      </Section>

      <section aria-labelledby="final-h" className="flex flex-col items-start justify-between gap-6 rounded-xl bg-wine-800 p-6 text-white shadow-md sm:p-8 lg:flex-row lg:items-center">
        <div className="flex max-w-lg flex-col gap-1">
          <span className="font-work text-[11px] font-bold uppercase tracking-wider text-[#FFB68E]">Final Verification</span>
          <h3 id="final-h" className="font-newsreader text-xl font-bold leading-7">Ready to Disseminate Your Research?</h3>
          <p className="font-serif4 text-[15px] leading-6 text-[#E1E8FD]">
            Upon dispatch you receive your <strong className="text-white">Paper ID</strong> by email, SMS and WhatsApp, and the editor starts screening. No fee is charged now: if accepted, the processing charge is {'₹'}{journal.apc.inr.toLocaleString('en-IN')} (plus {journal.apc.gstPercent}% GST for Indian authors) or US${journal.apc.usd}.
          </p>
          {submitError && <p role="alert" className="mt-2 rounded-lg border border-red-200 bg-red-50 p-3 font-work text-sm font-semibold text-red-700">{submitError}</p>}
        </div>
        <div className="flex w-full shrink-0 flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button type="button" onClick={onSaveDraft} className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-white px-5 py-3 font-work text-[13px] font-bold text-wine-900 shadow-sm transition-colors hover:bg-[#E9EDFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-wine-800">Save Draft</button>
          <button type="submit" disabled={busy} aria-busy={busy}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-ochre-700 px-7 py-3 font-work text-[13px] font-bold text-white shadow-lg transition-colors hover:bg-ochre-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-wine-800 disabled:cursor-not-allowed disabled:opacity-60">
            {busy && <Spinner />}{busy ? 'Submitting…' : 'Submit Manuscript Now'}{!busy && <Forward className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </section>
    </>
  )
}
