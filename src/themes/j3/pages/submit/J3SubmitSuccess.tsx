// Success screen of the Journal 3 guided submission: Paper ID, DOI, what happens next and the Track link.
import { useEffect, useRef } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadText } from '../../../../core/lib/clipboard'
import { Button, ButtonLink } from '../../components/Button'
import { J3Copy } from '../../components/J3Field'
import { Container, Kicker } from '../../components/primitives'
import { Check, Download, Email } from '../../icons'

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

export function J3SubmitSuccess({ paperId, email, title }: { paperId: string; email: string; title: string }) {
  const head = useRef<HTMLHeadingElement>(null)
  useEffect(() => { head.current?.focus() }, [])
  return (
    <div className="bg-iris-50 py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <section aria-labelledby="done-h" className="rounded-sheet bg-night-900 p-6 text-center text-white shadow-lift3 sm:p-10">
            <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-iris-700 motion-safe:animate-fade-in"><Check className="h-8 w-8" /></span>
            <Kicker className="mt-5 text-iris-200">Manuscript submitted</Kicker>
            <h1 id="done-h" ref={head} tabIndex={-1} className="focus-visible:!outline-none mt-2 font-jakarta text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.1] tracking-tight focus:outline-none">Thank you. Your paper is in the queue.</h1>
            <p className="mt-6 text-sm text-iris-100">Your Paper ID</p>
            <p className="mt-1 break-all font-jakarta text-[1.625rem] font-extrabold tracking-wide sm:text-[2.25rem]" data-testid="paper-id">{paperId}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2"><J3Copy tone="dark" text={paperId} label="Copy Paper ID" done="Paper ID copied" /></div>
            <dl className="mx-auto mt-6 max-w-md rounded-tile bg-white/10 p-4 text-left text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2"><dt className="text-iris-100">Reserved DOI</dt><dd className="break-all font-bold">{doiFor(paperId)}</dd></div>
            </dl>
            <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-iris-100"><Email className="h-4 w-4" aria-hidden="true" />Confirmation sent to <strong className="break-all text-white">{email}</strong> by email, SMS and WhatsApp.</p>
            <p className="mt-2 text-sm text-iris-100">Keep your Paper ID safe. With your email, it is all you need to track your paper.</p>
          </section>

          <section aria-labelledby="next-h" className="mt-8 rounded-sheet bg-white p-6 shadow-lift3 sm:p-8">
            <h2 id="next-h" className="font-jakarta text-[1.75rem] font-extrabold text-night-900">What happens next</h2>
            <ol className="mt-6">
              {NEXT.map(([t, d], i) => (
                <li key={t} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < NEXT.length - 1 && <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 bg-iris-100" />}
                  <span aria-hidden="true" className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-jakarta text-xs font-extrabold ${i === 0 ? 'bg-iris-700 text-white' : 'bg-white text-iris-800 ring-2 ring-iris-200'}`}>{i === 0 ? <Check className="h-4 w-4" /> : i + 1}</span>
                  <div><p className="font-jakarta text-base font-bold text-night-900">{t}{i === 0 && <span className="sr-only"> (done)</span>}</p><p className="text-base text-mauve-700">{d}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <aside className="mt-6 rounded-block bg-iris-100 p-5 text-base text-iris-900">
            <p><strong className="font-jakarta">Certificates and referrals.</strong> Every listed author receives a certificate with a QR code once the article is published. Your Track page shows a personal referral code that earns credits when colleagues publish with {journal.shortName}.</p>
          </aside>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink to={paths.track}>Track My Paper</ButtonLink>
            <Button variant="outline" onClick={() => downloadText(`${paperId}-receipt.txt`, receipt(paperId, email, title))}><Download className="h-4 w-4" aria-hidden="true" />Download receipt</Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
