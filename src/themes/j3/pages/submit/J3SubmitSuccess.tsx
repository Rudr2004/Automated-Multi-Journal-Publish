// Success screen of the Journal 3 guided submission: Paper ID, DOI, what happens next and the Track link.
import { useEffect, useRef } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadText } from '../../../../core/lib/clipboard'
import { AcButton, AcButtonLink, AcKicker } from '../../components/AcButton'
import { J3Copy } from '../../components/J3Field'
import { Container } from '../../components/primitives'
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
    <div className="bg-j3paper-cool py-10 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <section aria-labelledby="done-h" className="border-t-4 border-j3valid-700 bg-iris-700 p-6 text-center text-white sm:p-10">
            <span aria-hidden="true" className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-j3valid-700 text-white motion-safe:animate-fade-in"><Check className="h-8 w-8" /></span>
            <AcKicker className="mt-5 text-ember-300">Manuscript submitted</AcKicker>
            <h1 id="done-h" ref={head} tabIndex={-1} className="focus-visible:!outline-none mt-2 font-jakarta text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-tight focus:outline-none">Thank you. Your paper is in the queue.</h1>
            <p className="mt-6 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-200">Your Paper ID</p>
            <p className="mt-1 break-all font-inter text-[1.625rem] font-bold tracking-wide sm:text-[2.25rem]" data-testid="paper-id">{paperId}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2"><J3Copy tone="dark" text={paperId} label="Copy Paper ID" done="Paper ID copied" /></div>
            <dl className="mx-auto mt-6 max-w-md border border-white/20 bg-iris-600 p-4 text-left font-inter text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2"><dt className="text-iris-100">Reserved DOI</dt><dd className="break-all font-bold">{doiFor(paperId)}</dd></div>
            </dl>
            <p className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-iris-100"><Email className="h-4 w-4" aria-hidden="true" />Confirmation sent to <strong className="break-all text-white">{email}</strong> by email, SMS and WhatsApp.</p>
            <p className="mt-2 text-sm text-iris-100">Keep your Paper ID safe. With your email, it is all you need to track your paper.</p>
          </section>

          <section aria-labelledby="next-h" className="mt-8 border border-mauve-200 bg-white p-6 sm:p-8">
            <h2 id="next-h" className="border-b-2 border-iris-700 pb-2 font-jakarta text-[1.625rem] font-semibold text-iris-700">What happens next</h2>
            <ol className="mt-6">
              {NEXT.map(([t, d], i) => (
                <li key={t} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < NEXT.length - 1 && <span aria-hidden="true" className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-mauve-200" />}
                  <span aria-hidden="true" className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-none font-inter text-xs font-bold ${i === 0 ? 'bg-j3valid-700 text-white' : 'bg-white text-iris-700 ring-1 ring-mauve-200'}`}>{i === 0 ? <Check className="h-4 w-4" /> : i + 1}</span>
                  <div><p className="font-jakarta text-lg font-semibold text-iris-700">{t}{i === 0 && <span className="sr-only"> (done)</span>}</p><p className="font-inter text-base text-mauve-600">{d}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <aside className="mt-6 border-l-4 border-iris-700 bg-iris-50 p-5 font-inter text-base text-night-700">
            <p><strong className="font-jakarta text-lg font-semibold text-iris-700">Certificates and referrals.</strong> Every listed author receives a certificate with a QR code once the article is published. Your Track page shows a personal referral code that earns credits when colleagues publish with {journal.shortName}.</p>
          </aside>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <AcButtonLink to={paths.track}>Track My Paper</AcButtonLink>
            <AcButton variant="outline" onClick={() => downloadText(`${paperId}-receipt.txt`, receipt(paperId, email, title))}><Download className="h-4 w-4" aria-hidden="true" />Download receipt</AcButton>
          </div>
        </div>
      </Container>
    </div>
  )
}
