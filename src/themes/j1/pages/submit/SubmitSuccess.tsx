import { CheckCircle2, Download, Mail, MessageCircle, Smartphone } from '../../components/uiIcons'
import { CopyButton } from '../../components/ArticleParts'
import { Button, ButtonLink } from '../../components/Button'
import { doiFor, journal } from '../../../../config/journals/j1'
import { paths } from '../../../../config/routes'
import { downloadText } from '../../../../core/lib/clipboard'

const NEXT = [
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
  [`${journal.name} — Submission receipt`, '', `Paper ID : ${paperId}`, `Title    : ${title || '—'}`, `Email    : ${email}`,
    `DOI      : ${doiFor(paperId)}`, `Date     : ${new Date().toISOString().slice(0, 10)}`, '',
    'Track your paper any time at the Track My Paper page with your Paper ID and email. No account is needed.'].join('\n')

export function SubmitSuccess({ paperId, email, title = '' }: { paperId: string; email: string; title?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-oa" aria-hidden />
      <h2 className="mt-4 font-serif text-3xl font-semibold text-navy">Manuscript submitted</h2>
      <p className="mt-2 text-ink-muted">Keep your Paper ID safe. You need it, with your email, to track your paper.</p>
      <div className="mt-6 rounded-card border-2 border-navy bg-navy-50 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-muted">Your Paper ID</p>
        <p className="mt-2 break-all font-serif text-4xl font-semibold tracking-wide text-navy sm:text-5xl" data-testid="paper-id">{paperId}</p>
        <div className="mt-4"><CopyButton text={paperId} label="Copy Paper ID" /></div>
      </div>
      <ul className="mt-5 flex flex-wrap justify-center gap-4 text-sm text-ink">
        <li className="inline-flex items-center gap-2"><Mail className="h-4 w-4 text-navy-500" aria-hidden />Email sent to {email}</li>
        <li className="inline-flex items-center gap-2"><Smartphone className="h-4 w-4 text-navy-500" aria-hidden />SMS sent</li>
        <li className="inline-flex items-center gap-2"><MessageCircle className="h-4 w-4 text-navy-500" aria-hidden />WhatsApp sent</li>
      </ul>
      <section className="mt-8 rounded-card border border-line bg-white p-6 text-left">
        <h3 className="font-serif text-xl font-semibold text-navy">What happens next</h3>
        <ol className="mt-4 space-y-4 border-l-2 border-navy-100 pl-5">
          {NEXT.map(([t, d], i) => (
            <li key={t} className="relative"><span className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white ${i === 0 ? 'bg-oa' : 'bg-navy'}`}>{i === 0 ? '✓' : i + 1}</span>
              <p className="font-semibold">{t}</p><p className="text-sm text-ink-muted">{d}</p></li>
          ))}
        </ol>
      </section>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to={paths.track} variant="primary" size="lg">Track My Paper</ButtonLink>
        <Button variant="secondary" size="lg" onClick={() => downloadText(`${paperId}-receipt.txt`, receipt(paperId, email, title))}><Download className="h-4 w-4" aria-hidden />Download receipt</Button>
      </div>
    </div>
  )
}
