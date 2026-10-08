// Final review card and the success screen of the Journal 2 submission page.
import type { ReactNode } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadText } from '../../../../core/lib/clipboard'
import type { SubmissionForm } from '../../../../core/lib/submission'
import { Button, ButtonLink } from '../../components/Button'
import { CopyChip } from '../../components/CopyChip'
import { Gift, Sms, Whatsapp } from '../../components/pageIcons'
import { Container } from '../../components/primitives'
import { PageBand } from '../../components/PageBand'
import { Check, Download, Email } from '../../icons'

const Row = ({ k, children }: { k: string; children?: ReactNode }) => (
  <div className="grid gap-0.5 py-2 sm:grid-cols-[9rem_1fr] sm:gap-4">
    <dt className="text-sm text-graphite-600">{k}</dt>
    <dd className="min-w-0 break-words text-sm font-medium text-graphite-800">{children || <span className="font-normal text-graphite-500">Not provided</span>}</dd>
  </div>
)

export function ReviewSummary({ form, missing }: { form: SubmissionForm; missing: number }) {
  const a = form.author
  const abstract = form.abstract.trim()
  return (
    <div>
      <dl className="divide-y divide-graphite-100 rounded-panel border border-graphite-200 px-4">
        <Row k="Title">{form.title}</Row>
        <Row k="Type and discipline">{form.articleType && form.subject ? `${form.articleType} · ${form.subject}` : ''}</Row>
        <Row k="Keywords">{form.keywords}</Row>
        <Row k="Abstract">{abstract && (abstract.length > 200 ? `${abstract.slice(0, 200)}…` : abstract)}</Row>
        <Row k="Corresponding author">{a.name && `${a.name}${a.email ? ` (${a.email})` : ''}`}</Row>
        <Row k="WhatsApp">{a.whatsapp && `${a.dialCode} ${a.whatsapp}`}</Row>
        <Row k="Affiliation">{a.institution && `${a.institution}, ${a.country}`}</Row>
        <Row k="Co-authors">{form.coAuthors.length ? form.coAuthors.map((c) => c.name || 'Unnamed').join(', ') : 'None'}</Row>
        <Row k="Manuscript file">{form.file?.name}</Row>
        <Row k="Declarations">{Object.values(form.declarations).every(Boolean) && form.captcha ? 'All confirmed' : ''}</Row>
      </dl>
      <p role="status" className={`mt-4 rounded-soft px-4 py-3 text-sm font-medium ${missing ? 'bg-cta-50 text-cta-900' : 'bg-brand-50 text-brand-800'}`}>
        {missing ? `${missing} required field${missing === 1 ? '' : 's'} still need attention. Pressing Submit will take you to the first one.` : 'Everything looks complete. You can submit your manuscript.'}
      </p>
    </div>
  )
}

const NEXT: [string, string][] = [
  ['Submission', 'Done. Your Paper ID was sent by email, SMS and WhatsApp.'],
  ['Review', 'The editor screens your paper. An external reviewer is consulted only if needed.'],
  ['Decision', 'Approve, request changes or reject, with the reason. Decisions are sent daily at 08:45 IST.'],
  ['Acceptance', 'You receive the acceptance letter, copyright form (sign with an email OTP) and payment link.'],
  ['Payment', 'Pay online in INR or USD, or upload your UPI or bank proof. Reminders stop once confirmed.'],
  ['Production', 'Your Word file is converted into the web article and checked by the associate editor.'],
  ['Publication', 'Final approval, then your DOI and certificates with QR codes are issued.'],
  ['Indexing', 'We check Google Scholar every week and email you when your article is indexed.'],
]

const receipt = (paperId: string, email: string, title: string) =>
  [`${journal.name} - Submission receipt`, '', `Paper ID : ${paperId}`, `Title    : ${title || '-'}`, `Email    : ${email}`,
    `DOI      : ${doiFor(paperId)}`, `Date     : ${new Date().toISOString().slice(0, 10)}`, '',
    'Track your paper any time on the Track My Paper page with your Paper ID and email. No account is needed.'].join('\n')

export function SubmitSuccess({ paperId, email, title }: { paperId: string; email: string; title: string }) {
  return (
    <>
      <PageBand eyebrow="Submit manuscript" title="Manuscript submitted" text="Thank you. Your paper is now in the editorial queue." />
      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <section aria-labelledby="pid-h" className="rounded-sheet border border-brand-200 bg-gradient-to-br from-brand-50 to-white p-6 text-center shadow-soft sm:p-8">
            <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-800 text-white motion-safe:animate-fade-in"><Check className="h-8 w-8" /></span>
            <h2 id="pid-h" className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-700">Your Paper ID</h2>
            <p className="mt-1 break-all font-display text-3xl font-extrabold tracking-wide text-brand-800 sm:text-5xl" data-testid="paper-id">{paperId}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2"><CopyChip text={paperId} label="Copy Paper ID" done="Paper ID copied" className="!px-3.5 !py-2 !text-sm" /></div>
            <dl className="mx-auto mt-5 max-w-md rounded-soft bg-white p-3 text-left text-sm ring-1 ring-graphite-200">
              <div className="flex flex-wrap items-center justify-between gap-2"><dt className="text-graphite-600">Reserved DOI</dt><dd className="break-all font-semibold text-graphite-800">{doiFor(paperId)}</dd></div>
            </dl>
            <p className="mt-4 text-sm text-graphite-600">Keep your Paper ID safe. With your email, it is all you need to track your paper.</p>
            <ul className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-graphite-700">
              <li className="inline-flex items-center gap-1.5"><Email className="h-4 w-4 text-accent-700" aria-hidden="true" />Emailed to {email}</li>
              <li className="inline-flex items-center gap-1.5"><Sms className="h-4 w-4 text-accent-700" aria-hidden="true" />SMS sent</li>
              <li className="inline-flex items-center gap-1.5"><Whatsapp className="h-4 w-4 text-accent-700" aria-hidden="true" />WhatsApp sent</li>
            </ul>
          </section>

          <section aria-labelledby="next-h" className="mt-8 rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:p-7">
            <h2 id="next-h" className="font-display text-xl font-bold text-graphite-800">What happens next</h2>
            <ol className="mt-5">
              {NEXT.map(([t, d], i) => (
                <li key={t} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < NEXT.length - 1 && <span aria-hidden="true" className="absolute left-[13px] top-7 h-[calc(100%-1.75rem)] w-0.5 bg-graphite-200" />}
                  <span aria-hidden="true" className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-brand-800 text-white' : 'bg-white text-accent-800 ring-2 ring-accent-200'}`}>{i === 0 ? <Check className="h-4 w-4" /> : i + 1}</span>
                  <div><p className="font-semibold text-graphite-800">{t}{i === 0 && <span className="sr-only"> (done)</span>}</p><p className="text-sm text-graphite-600">{d}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <aside className="mt-6 flex gap-3 rounded-panel bg-accent-50 p-5 text-sm text-accent-900 ring-1 ring-inset ring-accent-200">
            <Gift className="mt-0.5 h-6 w-6 shrink-0 text-accent-700" aria-hidden="true" />
            <p><strong>Certificates and referrals.</strong> Every listed author receives a certificate with a QR code once the article is published. After you submit, your Track page shows a personal referral code that earns credits when colleagues publish with {journal.shortName}.</p>
          </aside>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to={paths.track}>Track My Paper</ButtonLink>
            <Button variant="outline" onClick={() => downloadText(`${paperId}-receipt.txt`, receipt(paperId, email, title))}><Download className="h-4 w-4" aria-hidden="true" />Download receipt</Button>
          </div>
        </div>
      </Container>
    </>
  )
}
