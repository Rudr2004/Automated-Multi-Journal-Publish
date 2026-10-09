// Section 05: read-only summary as a spec sheet, completeness status and the submit button.
import type { ReactNode } from 'react'
import { journal } from '../../../../config/journals'
import type { SubmissionForm } from '../../../../core/lib/submission'
import { cx } from '../../components/primitives'
import { Spinner } from '../../components/form/Field'
import { Section, type SectionId } from './shared'

function Row({ k, children }: { k: string; children?: ReactNode }) {
  return (
    <div className="grid gap-0.5 border-b border-[#E6DCD0] px-4 py-2.5 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-4">
      <dt className="text-[13px] font-semibold uppercase tracking-[0.06em] text-obsidian-600">{k}</dt>
      <dd className="min-w-0 break-words text-[15px] text-obsidian-900">{children || <span className="text-obsidian-600">Not provided</span>}</dd>
    </div>
  )
}

export function ReviewSection({ form, missing, busy, submitError, onJump }: {
  form: SubmissionForm; missing: number; busy: boolean; submitError: string; onJump: (id: SectionId) => void
}) {
  const a = form.author
  const abstract = form.abstract.trim()
  const edit = (id: SectionId, label: string) => (
    <button type="button" onClick={() => onJump(id)} aria-label={`Edit ${label}`} className="min-h-[44px] rounded px-2 text-sm font-semibold text-wine-700 hover:bg-ochre-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">Edit</button>
  )
  const Head = ({ title, id }: { title: string; id: SectionId }) => (
    <div className="flex items-center justify-between gap-3 border-b border-[#E6DCD0] bg-[#F4EEE6] px-4"><h3 className="font-newsreader text-base font-semibold text-obsidian-900">{title}</h3>{edit(id, title)}</div>
  )
  return (
    <Section n={5} id="review" title="Review and submit" text="Free to submit. The processing charge is payable only after acceptance.">
      <div className="space-y-4">
        <div className="overflow-hidden rounded border border-[#E6DCD0]">
          <Head title="Article details" id="details" />
          <dl>
            <Row k="Title">{form.title}</Row>
            <Row k="Type">{form.articleType}</Row>
            <Row k="Research area">{form.subject}</Row>
            <Row k="Abstract">{abstract && (abstract.length > 260 ? `${abstract.slice(0, 260)}…` : abstract)}</Row>
            <Row k="Keywords">{form.keywords}</Row>
          </dl>
        </div>
        <div className="overflow-hidden rounded border border-[#E6DCD0]">
          <Head title="Authors" id="authors" />
          <dl>
            <Row k="Corresponding">{a.name && `${a.name}${a.email ? ` (${a.email})` : ''}`}</Row>
            <Row k="WhatsApp">{a.whatsapp && `${a.dialCode} ${a.whatsapp}`}</Row>
            <Row k="Affiliation">{a.institution && `${a.institution}, ${a.country}`}</Row>
            <Row k="ORCID iD">{a.orcid}</Row>
            <Row k="Co-authors">{form.coAuthors.length ? form.coAuthors.map((c) => c.name || 'Unnamed').join(', ') : 'None'}</Row>
          </dl>
        </div>
        <div className="overflow-hidden rounded border border-[#E6DCD0]">
          <Head title="File and declarations" id="files" />
          <dl>
            <Row k="Manuscript file">{form.file?.name}</Row>
            <Row k="Mentor">{form.mentor || undefined}</Row>
            <Row k="Referral code">{form.referralCode || undefined}</Row>
            <Row k="Declarations">{Object.values(form.declarations).every(Boolean) && form.captcha ? 'All confirmed' : ''}</Row>
          </dl>
        </div>
      </div>

      <p role="status" className={cx('rounded border px-4 py-3 text-[15px] font-medium', missing ? 'border-amber-700/40 bg-amber-50 text-amber-900' : 'border-ochre-200 bg-ochre-50 text-obsidian-900')}>
        {missing ? `${missing} required item${missing === 1 ? '' : 's'} still need attention. Pressing Submit takes you to the first one.` : 'Every required item is complete. You can submit your manuscript.'}
      </p>
      <p className="text-sm text-obsidian-600">No fee is charged now. If accepted, the article processing charge is {'₹'}{journal.apc.inr.toLocaleString('en-IN')} (plus {journal.apc.gstPercent}% GST for Indian authors) or US${journal.apc.usd}.</p>
      {submitError && <p role="alert" className="rounded border border-red-700 bg-red-50 p-3 text-[15px] font-semibold text-red-700">{submitError}</p>}
      <div>
        <button type="submit" disabled={busy} aria-busy={busy}
          className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded bg-wine-800 px-6 text-base font-semibold text-white transition-colors hover:bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
          {busy && <Spinner />}{busy ? 'Submitting…' : 'Submit manuscript'}
        </button>
      </div>
    </Section>
  )
}
