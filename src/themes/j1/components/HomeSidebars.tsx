import type { J1HomeData } from '../../../mock-data/journals/j1'
import { journal } from '../../../config/journals/j1'
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { ButtonLink } from './Button'
import { Countdown } from './Countdown'
import { Badge, LiveBadge, Panel } from './primitives'
import { AppLink } from '../../../core/router'
import { useToast } from './Toast'
import { TrackForm } from './TrackForm'
import { Campaign, Description, FilePlus2, Premium, Speed, VerifiedUser } from './uiIcons'

const DAY = 86400000

/** Call for papers with the live countdown (final 5 days) or the deadline date. */
export function CfpCard() {
  const { nextIssue } = journal
  const days = (new Date(nextIssue.deadline).getTime() - Date.now()) / DAY
  return (
    <Panel title="Call for Papers" aside={<Badge tone="open">Active</Badge>}>
      <p className="flex items-center gap-2 font-serif text-lg font-semibold leading-snug text-navy"><Campaign className="h-5 w-5 shrink-0 text-gold" aria-hidden />{nextIssue.label}</p>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">Original research, review papers and short communications across the journal’s subject areas.</p>
      <dl className="mt-3 space-y-1.5 border-y border-line py-2 text-sm">
        <div className="flex items-center justify-between"><dt className="inline-flex items-center gap-1.5 text-ink-muted"><Speed className="h-4 w-4" aria-hidden />First decision</dt><dd className="font-semibold text-navy">~14 days</dd></div>
        <div className="flex items-center justify-between"><dt className="text-ink-muted">Acceptance notice</dt><dd className="font-semibold text-navy">7–14 days</dd></div>
        <div className="flex items-center justify-between"><dt className="text-ink-muted">Online issue</dt><dd className="font-semibold tabular-nums text-navy">{formatDate(nextIssue.expectedPublication)}</dd></div>
      </dl>
      <div className="mt-3">
        {days > 0 && days <= 5
          ? <><p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Submission closes in</p><Countdown deadline={nextIssue.deadline} tone="light" /></>
          : <p className="text-sm"><span className="text-ink-muted">Submission deadline: </span><strong className="text-navy">{formatDate(nextIssue.deadline.slice(0, 10))}</strong></p>}
      </div>
      <ButtonLink to={paths.submit} variant="submit" className="mt-4 w-full"><FilePlus2 className="h-4 w-4" aria-hidden />Submit Your Manuscript</ButtonLink>
    </Panel>
  )
}

/** Left column: stays in view while the main column scrolls (see HomePage). */
export function LeftSidebar({ data }: { data: J1HomeData }) {
  return (
    <>
      {/* On small screens the call for papers is shown right under the masthead instead. */}
      <div className="hidden xl:block"><CfpCard /></div>
      <Panel title="Scholarly Notices" aside={<LiveBadge />}>
        <ul className="space-y-3">
          {data.notices.slice(0, 3).map((n) => (
            <li key={n.date} className="text-sm leading-snug">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{formatDate(n.date)}</p>
              <p className="mt-0.5 text-ink">{n.text}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}

const DOWNLOADS = [['Manuscript Template', 'DOCX'], ['LaTeX Journal Template', 'ZIP'], ['Peer Review Scorecard', 'PDF'], ['Sample Publication Certificate', 'PDF']] as const

/** Right column: track a paper and the downloads authors need most. */
export function RightSidebar() {
  const toast = useToast()
  return (
    <>
      <Panel title="Track Manuscript Status">
        <p className="mb-3 text-sm text-ink-muted">No login needed. Enter the Paper ID and email from your confirmation.</p>
        <TrackForm idPrefix="side" submitLabel="Check Review Status" />
      </Panel>
      <Panel title="Author & Reviewer Downloads">
        <ul className="divide-y divide-line text-sm">
          {DOWNLOADS.map(([name, kind]) => (
            <li key={name}>
              <button type="button" onClick={() => toast(`${name} downloaded (simulated).`)} className="flex w-full items-center justify-between gap-2 py-2 text-left font-medium text-navy hover:text-scholar">
                {name}<span className="rounded-sm border border-line bg-paper px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">{kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}

/** Full-width row at the end of the page: quick links, author rights and the reviewer call. */
export function ResourcesRow() {
  const links = [
    ['Plagiarism Policy', paths.policy('plagiarism'), Description], ['Publication Ethics (COPE)', paths.policy('publication-ethics'), VerifiedUser],
    ['Peer Review Process', paths.policy('peer-review'), Speed], ['Verify Author Certificate', paths.verify(), Premium],
    [policyLinks.find((p) => p.slug === 'reviewer-guidelines')!.label, paths.policy('reviewer-guidelines'), Description],
  ] as const
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Panel title="Quick Navigators">
        <ul className="divide-y divide-line text-sm">
          {links.map(([label, to, Icon]) => (
            <li key={label}><AppLink to={to} className="flex items-center justify-between gap-2 py-2 font-medium text-navy hover:text-scholar">{label}<Icon className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden /></AppLink></li>
          ))}
        </ul>
      </Panel>

      <Panel title="Author Rights & Copyright" tone="paper">
        <p className="text-sm leading-relaxed text-ink">Authors keep their copyright. Accepted authors sign the electronic transfer form with a one-time code sent to their email.</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">Every article is published under {journal.licence.name}, so it can be shared and reused with credit.</p>
        <ButtonLink to={paths.track} variant="outline" size="sm" className="mt-3 w-full">File Copyright Form (Email OTP)</ButtonLink>
      </Panel>

      <section className="flex flex-col border border-navy bg-navy p-5 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-navy-200">Academic service</p>
        <h3 className="mt-1 font-serif text-lg font-semibold leading-snug">Join the Editorial & Peer Review Board</h3>
        <p className="mt-2 text-sm leading-snug text-navy-100">Doctoral degree holders, post-docs and university faculty are invited to review. Reviewers receive a verifiable certificate for every review.</p>
        <ButtonLink to={paths.forAuthors('become-a-reviewer')} variant="outline-light" size="sm" className="mt-auto w-full self-end">Apply as a reviewer</ButtonLink>
      </section>
    </div>
  )
}
