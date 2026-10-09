// Success screen of the Journal 5 (IJFRD) submission: Paper ID receipt, what happens next and the Track link.
import { useEffect, useRef } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadText } from '../../../../core/lib/clipboard'
import { Button, ButtonLink } from '../../components/Button'
import { CopyButton } from '../../components/form/Field'
import { Container, Label } from '../../components/primitives'
import { Check, Download } from '../../icons'

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
    <div>
      <section aria-labelledby="done-h" className="relative isolate border-b-2 border-ochre-600 bg-bordeaux-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgba(251,191,36,0.16),transparent_60%),radial-gradient(ellipse_at_0%_100%,rgba(162,45,53,0.35),transparent_55%)]" />
        <Container className="py-12 sm:py-16">
          <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded bg-ochre-400 text-obsidian-900"><Check className="h-6 w-6" /></span>
          <Label className="mt-5 text-ochre-300">Manuscript submitted</Label>
          <h1 id="done-h" ref={head} tabIndex={-1} className="mt-2 max-w-3xl font-newsreader font-semibold leading-[1.1] tracking-tight focus:outline-none" style={{ fontSize: 'clamp(34px,3.8vw,54px)' }}>Received. Your paper is in the screening queue.</h1>
          <div className="mt-8 max-w-2xl rounded border border-white/15 bg-black/25 p-5">
            <dl className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-ochre-300">Your Paper ID</dt>
                <dd className="mt-1 break-all font-newsreader text-[1.75rem] font-semibold tabular-nums tracking-wide sm:text-[2.25rem]" data-testid="paper-id">{paperId}</dd>
              </div>
              <div><CopyButton tone="dark" text={paperId} label="Copy Paper ID" done="Paper ID copied" /></div>
              <div className="sm:col-span-2 border-t border-white/15 pt-3 text-sm text-bordeaux-200">
                <span className="text-bordeaux-300">Reserved DOI </span><span className="break-all font-semibold text-white">{doiFor(paperId)}</span>
              </div>
            </dl>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-bordeaux-200">Confirmation sent to <strong className="break-all text-white">{email}</strong> by email, SMS and WhatsApp. Keep the Paper ID safe: with your email it is all you need to track the paper.</p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <section aria-labelledby="next-h" className="max-w-3xl">
          <h2 id="next-h" className="font-newsreader text-[1.75rem] font-semibold text-obsidian-900">What happens next</h2>
          <ol className="mt-5 overflow-hidden rounded border border-[#E6DCD0] bg-white">
            {NEXT.map(([t, d], i) => (
              <li key={t} className="grid grid-cols-[2.25rem_1fr] gap-3 border-b border-[#E6DCD0] px-4 py-3 last:border-b-0 sm:grid-cols-[2.25rem_9rem_1fr]">
                <span aria-hidden="true" className="font-semibold tabular-nums text-obsidian-600">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-semibold text-obsidian-900">{t}{i === 0 && <span className="sr-only"> (done)</span>}</span>
                <span className="col-start-2 text-[15px] text-obsidian-600 sm:col-start-auto">{d}</span>
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to={paths.track} variant="cta" className="min-h-[44px] px-5">Track this paper</ButtonLink>
            <Button variant="outline" className="min-h-[44px] px-5" onClick={() => downloadText(`${paperId}-receipt.txt`, receipt(paperId, email, title))}><Download className="h-4 w-4" aria-hidden="true" />Download receipt</Button>
          </div>
        </section>
      </Container>
    </div>
  )
}
