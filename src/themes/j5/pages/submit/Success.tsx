// Success screen of the Journal 5 (IJFRD) submission: Paper ID receipt, what happens next and the Track link.
import { useEffect, useRef } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadText } from '../../../../core/lib/clipboard'
import { Button, ButtonLink } from '../../components/Button'
import { CopyButton } from '../../components/form/Field'
import { Container } from '../../components/primitives'
import { Download } from '../../icons'
import { CheckCircle } from './mi'

const NEXT: [string, string][] = [
  ['Submitted', 'Done. Your Paper ID was sent by email, SMS and WhatsApp.'],
  ['Screening', 'The editor checks scope, completeness and similarity.'],
  ['Peer review', 'Reviewers assess the work against a published checklist.'],
  ['Decision', 'Accept, revise or reject, always with written reasons.'],
  ['Payment', 'Due only after acceptance, online or by UPI or bank transfer.'],
  ['Publication', 'Layout, DOI, author certificates and the monthly issue.'],
]

const receipt = (paperId: string, email: string, title: string) =>
  [`${journal.name} - Submission receipt`, '', `Paper ID : ${paperId}`, `Title    : ${title || '-'}`, `Email    : ${email}`,
    `DOI      : ${doiFor(paperId)}`, `Date     : ${new Date().toISOString().slice(0, 10)}`, '',
    'Track your paper any time on the Track page with your Paper ID and email. No account is needed.'].join('\n')

export function Success({ paperId, email, title }: { paperId: string; email: string; title: string }) {
  const head = useRef<HTMLHeadingElement>(null)
  useEffect(() => { head.current?.focus() }, [])
  return (
    <div className="bg-[#F9F9FF] py-8 sm:py-14">
      <Container>
        <section aria-labelledby="done-h" className="mx-auto flex max-w-2xl flex-col items-center rounded-2xl border border-[#DCC0BE]/40 bg-white p-6 text-center shadow-xl sm:p-10">
          <span aria-hidden="true" className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#E9EDFF] text-wine-900"><CheckCircle className="h-10 w-10" /></span>
          <span className="font-work text-[11px] font-bold uppercase tracking-widest text-ochre-700">Submission Confirmed</span>
          <h1 id="done-h" ref={head} tabIndex={-1} className="mt-1 font-newsreader text-2xl font-bold leading-8 text-wine-900 focus:outline-none sm:text-[1.75rem]">Manuscript Dispatched Successfully</h1>
          <p className="mt-2 font-serif4 text-[15px] leading-6 text-[#564241]">
            Your paper has been assigned Paper ID: <strong className="break-all font-mono text-base text-[#141B2B]" data-testid="paper-id">{paperId}</strong>. Confirmation was sent to <strong className="break-all text-[#141B2B]">{email}</strong> by email, SMS and WhatsApp. Keep the Paper ID safe: with your email it is all you need to track the paper.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <CopyButton text={paperId} label="Copy Paper ID" done="Paper ID copied" />
            <span className="font-work text-xs text-[#564241]">Reserved DOI <strong className="break-all text-[#141B2B]">{doiFor(paperId)}</strong></span>
          </div>

          <div className="mt-6 w-full text-left">
            <h2 className="font-newsreader text-lg font-bold text-wine-900">What happens next</h2>
            <ol className="mt-3 flex flex-col gap-1 rounded-lg bg-[#F1F3FF] p-3.5 font-work text-xs text-[#141B2B]">
              {NEXT.map(([t, d], i) => (
                <li key={t} className="grid grid-cols-[1.75rem_6.5rem_1fr] items-baseline gap-2 py-1">
                  <span aria-hidden="true" className="tabular-nums text-[#564241]">{String(i + 1).padStart(2, '0')}</span>
                  <strong>{t}{i === 0 && <span className="sr-only"> (done)</span>}</strong>
                  <span className="text-[#564241]">{d}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
            <ButtonLink to={paths.track} variant="cta" className="min-h-[44px] px-5">Track this paper</ButtonLink>
            <Button variant="outline" className="min-h-[44px] px-5" onClick={() => downloadText(`${paperId}-receipt.txt`, receipt(paperId, email, title))}><Download className="h-4 w-4" aria-hidden="true" />Download receipt</Button>
          </div>
        </section>
      </Container>
    </div>
  )
}
