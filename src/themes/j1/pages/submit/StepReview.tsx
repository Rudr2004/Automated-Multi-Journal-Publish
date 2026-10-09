import type { ReactNode } from 'react'
import type { StepIndex } from '../../../../core/lib/submission'
import type { StepProps } from './types'

function Block({ title, step, onEdit, children }: { title: string; step: StepIndex; onEdit: (s: StepIndex) => void; children: ReactNode }) {
  return (
    <section className="rounded-card border border-line">
      <div className="flex items-center justify-between border-b border-line bg-paper px-4 py-2.5">
        <h3 className="font-serif text-lg font-semibold text-navy">{title}</h3>
        <button type="button" onClick={() => onEdit(step)} className="text-sm font-semibold text-scholar hover:underline">Edit</button>
      </div>
      <dl className="grid gap-x-6 p-4 gap-y-2 text-sm sm:grid-cols-[150px_1fr]">{children}</dl>
    </section>
  )
}
const Row = ({ k, v }: { k: string; v?: string }) => (<><dt className="font-semibold text-ink-muted">{k}</dt><dd className="break-words font-medium">{v || '—'}</dd></>)

export function StepReview({ form, onEdit, submitError }: Pick<StepProps, 'form'> & { onEdit: (s: StepIndex) => void; submitError?: string }) {
  const a = form.author
  return (
    <div className="space-y-4">
      <p className="text-sm text-ink-muted">Please check everything before submitting. You can edit any section.</p>
      <Block title="Manuscript" step={0} onEdit={onEdit}>
        <Row k="Title" v={form.title} /><Row k="Article type" v={form.articleType} /><Row k="Subject area" v={form.branch ? `${form.subject} · ${form.branch}` : form.subject} />
        <Row k="Keywords" v={form.keywords} /><Row k="File" v={form.file?.name} /><Row k="Abstract" v={form.abstract.length > 220 ? `${form.abstract.slice(0, 220)}…` : form.abstract} />
      </Block>
      <Block title="Authors" step={1} onEdit={onEdit}>
        <Row k="Corresponding" v={`${a.name} (${a.email})`} /><Row k="WhatsApp" v={`${a.dialCode} ${a.whatsapp}`} />
        <Row k="Institution" v={`${a.institution}, ${a.country}`} /><Row k="Designation" v={a.designation} /><Row k="ORCID" v={a.orcid} />
        <Row k="Co-authors" v={form.coAuthors.length ? form.coAuthors.map((c) => c.name).join(', ') : 'None'} />
      </Block>
      <Block title="Additional" step={2} onEdit={onEdit}>
        <Row k="Profile picture" v={form.author.photo?.name} /><Row k="Mentor" v={[form.mentor, form.mentorEmail && `(${form.mentorEmail})`, form.mentorInstitution && `, ${form.mentorInstitution}`].filter(Boolean).join(' ').replace(' ,', ',')} /><Row k="Referral code" v={form.referralCode} /><Row k="Cover letter" v={form.coverLetter ? 'Provided' : ''} />
        <Row k="Declarations" v="All accepted" />
      </Block>
      {submitError && <p role="alert" className="rounded border border-danger/30 bg-red-50 p-3 text-sm font-medium text-danger">{submitError}</p>}
    </div>
  )
}
