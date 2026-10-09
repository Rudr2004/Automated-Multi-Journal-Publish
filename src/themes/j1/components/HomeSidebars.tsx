import { MdOutlineArrowForward, MdOutlineArticle, MdOutlineDownload, MdOutlineFactCheck, MdOutlineFolderZip, MdOutlineNotifications, MdOutlineSchool, MdOutlineTrackChanges, MdOutlineVerified, MdOutlineVerifiedUser, MdOutlineWorkspacePremium } from 'react-icons/md'
import type { J1HomeData } from '../../../mock-data/journals/j1'
import { journal, visibleLogos } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { Countdown } from './Countdown'
import { AwardsCard } from './AwardsCard'
import { Card } from './PortalParts'
import { useToast } from './Toast'
import { TrackForm } from './TrackForm'
import { FilePlus2, OpenInNew } from './uiIcons'

const DAY = 86400000
const SIDE_LINK = 'inline-flex w-full items-center justify-center gap-1.5 rounded px-3 text-[13px] font-bold transition-colors'

/** Call for papers: navy-bordered card with the live countdown (final 5 days) or the deadline date. */
export function CfpCard() {
  const { nextIssue } = journal
  const days = (new Date(nextIssue.deadline).getTime() - Date.now()) / DAY
  const live = days > 0 && days <= 5
  return (
    <section aria-labelledby="cfp-h" className="overflow-hidden rounded border-2 border-navy bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 bg-navy px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
        <span className="inline-flex items-center gap-1.5"><span aria-hidden className="h-2 w-2 rounded-full bg-[#7FD6A0]" />Active CFP • {nextIssue.label.split(' — ')[0]}</span>
        <span className="rounded-sm bg-scholar px-1.5 py-0.5">First decision ~{journal.heroStats.find((s) => s.id === 'review')?.value ?? '14 days'}</span>
      </div>
      <div className="p-4">
        <h2 id="cfp-h" className="font-serif text-[1.375rem] font-bold leading-tight text-navy">Call for Research Papers &amp; Articles</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{nextIssue.label.split(' — ')[1] ? `${nextIssue.label.split(' — ')[1]} issue: ` : ''}original research, review papers and short communications across the journal’s subject areas.</p>
        <div className="mt-3 rounded border border-line bg-paper p-3">
          <p className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            <span>Submission window closes {live ? 'in' : 'on'}</span>
            {!live && <span className="text-[11px] font-bold normal-case tracking-normal text-navy tabular-nums">{formatDate(nextIssue.deadline.slice(0, 10))}</span>}
          </p>
          {live
            ? <Countdown deadline={nextIssue.deadline} tone="light" />
            : <p className="rounded border border-line bg-white px-2 py-2 text-center font-mono text-lg font-bold tabular-nums text-navy">{formatDate(nextIssue.deadline.slice(0, 10))}</p>}
          <p className="mt-2 text-xs text-ink-muted">Online issue: <strong className="tabular-nums text-navy">{formatDate(nextIssue.expectedPublication)}</strong></p>
        </div>
        <AppLink to={paths.submit} className={`${SIDE_LINK} mt-3 h-11 bg-scholar text-white hover:bg-scholar-dark`}><FilePlus2 className="h-5 w-5" aria-hidden />Submit Your Manuscript</AppLink>
        <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-[11px] text-ink-muted">
          <span>DOI prefix {journal.doiPrefix}</span><span aria-hidden>•</span><span>APC after acceptance</span><span aria-hidden>•</span><span>{journal.licence.name}</span>
        </p>
      </div>
    </section>
  )
}

/** Navy "academic service" card inviting reviewers. */
function JoinBoardCard() {
  return (
    <section aria-labelledby="join-h" className="rounded border border-navy bg-navy p-4 text-white">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FBD28D]"><MdOutlineVerified className="h-4 w-4" aria-hidden />Academic service</span>
        <span className="rounded-sm border border-white/30 bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-white">Reviewers wanted</span>
      </div>
      <h2 id="join-h" className="font-serif text-[1.0625rem] font-bold leading-snug">Join the Editorial &amp; Peer Review Board</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-navy-100">Doctoral degree holders, post-docs and university faculty are invited to review. Reviewers receive a verifiable certificate for every review.</p>
      <ul className="mt-3 space-y-1.5 border-t border-white/20 pt-3 text-xs text-navy-50">
        <li className="flex items-center gap-2"><MdOutlineSchool className="h-4 w-4 shrink-0 text-[#FBD28D]" aria-hidden />Doctoral degree or faculty position</li>
        <li className="flex items-center gap-2"><MdOutlineVerifiedUser className="h-4 w-4 shrink-0 text-[#7FD6A0]" aria-hidden />Verifiable reviewer certificate</li>
      </ul>
      <AppLink to={paths.forAuthors('become-a-reviewer')} className={`${SIDE_LINK} mt-3.5 h-10 bg-scholar text-white hover:bg-scholar-dark`}>Apply as a reviewer<MdOutlineArrowForward className="h-4 w-4" aria-hidden /></AppLink>
    </section>
  )
}

const QUICK = [
  ['Plagiarism Policy', paths.policy('plagiarism'), MdOutlineFactCheck], ['Publication Ethics (COPE)', paths.policy('publication-ethics'), MdOutlineVerifiedUser],
  ['Peer Review Process', paths.policy('peer-review'), MdOutlineArticle], ['Verify Author Certificate', paths.verify(), MdOutlineWorkspacePremium],
  ['Reviewer Guidelines', paths.policy('reviewer-guidelines'), MdOutlineSchool],
] as const

/** Left column: reviewer call, notices, DOI note, quick navigators and author voices. */
export function LeftSidebar({ data }: { data: J1HomeData }) {
  return (
    <>
      <JoinBoardCard />
      <Card title="Scholarly Notices" icon={MdOutlineNotifications} aside="Live" headingId="notices-h">
        <ul className="divide-y divide-line">
          {data.notices.slice(0, 3).map((n) => (
            <li key={n.date} className="py-3 first:pt-0 last:pb-0">
              <p className="text-[11px] font-bold tabular-nums text-scholar">{formatDate(n.date)}</p>
              <p className="mt-0.5 text-[13px] leading-snug text-ink">{n.text}</p>
            </li>
          ))}
        </ul>
      </Card>
      <section aria-labelledby="doi-h" className="rounded border border-line bg-white p-4 text-center">
        <p id="doi-h" className="font-serif text-xl font-bold text-navy">Crossref DOI</p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink">Every published paper is registered with Crossref under the prefix <strong className="tabular-nums">{journal.doiPrefix}</strong> and receives a permanent DOI.</p>
        <AppLink to={paths.about('indexing')} className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-scholar hover:underline">Indexing details<MdOutlineArrowForward className="h-4 w-4" aria-hidden /></AppLink>
      </section>
      <Card title="Quick Navigators" headingId="quick-h">
        <ul className="-my-1 divide-y divide-line text-sm">
          {QUICK.map(([label, to, Icon]) => (
            <li key={label}><AppLink to={to} className="flex items-center justify-between gap-2 py-2.5 font-medium text-ink hover:text-scholar">{label}<Icon className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden /></AppLink></li>
          ))}
        </ul>
      </Card>
    </>
  )
}

const DOWNLOADS = [
  ['Manuscript Template', 'DOCX', MdOutlineArticle], ['LaTeX Journal Template', 'ZIP', MdOutlineFolderZip],
  ['Peer Review Scorecard', 'PDF', MdOutlineFactCheck], ['Sample Publication Certificate', 'PDF', MdOutlineWorkspacePremium],
] as const

/** Right column: call for papers, track a paper, recognition awards, index verifier, downloads and author rights. */
export function RightSidebar({ awards = [] }: { awards?: J1HomeData['awards'] }) {
  const toast = useToast()
  const logos = visibleLogos()
  return (
    <>
      <div className="hidden xl:block"><CfpCard /></div>
      <Card title="Track Manuscript Status" icon={MdOutlineTrackChanges} aside="Author Portal" headingId="track-h">
        <p className="mb-3 text-[13px] text-ink-muted">No login needed. Enter the Paper ID and email from your confirmation.</p>
        <TrackForm idPrefix="side" submitLabel="Check Review Status" />
      </Card>
      <AwardsCard awards={awards} />
      {logos.length > 0 && (
        <Card title="Global Indexing Verifier" aside={`${logos.length} listings`} headingId="verifier-h">
          <ul className="grid grid-cols-2 gap-1.5">
            {logos.map((l) => (
              <li key={l.id}>
                <a href={l.verifyUrl} target="_blank" rel="noopener noreferrer" title={`${l.status}. Verify on ${l.name}`}
                  className="flex h-9 items-center justify-between gap-1 rounded border border-line bg-white px-2 text-xs font-medium text-ink hover:border-scholar hover:text-scholar">
                  <span className="truncate">{l.name}</span><OpenInNew className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </Card>
      )}
      <Card title="Author & Reviewer Downloads" icon={MdOutlineDownload} headingId="downloads-h">
        <ul className="space-y-1.5">
          {DOWNLOADS.map(([name, kind, Icon]) => (
            <li key={name}>
              <button type="button" onClick={() => toast(`${name} downloaded (simulated).`)}
                className="flex min-h-10 w-full items-center gap-2 rounded border border-line bg-white px-2.5 py-1.5 text-left text-[13px] font-medium text-navy hover:border-scholar hover:bg-mist">
                <Icon className="h-4 w-4 shrink-0 text-scholar" aria-hidden /><span className="min-w-0 flex-1">{name}</span>
                <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">{kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Author Rights & Copyright" icon={MdOutlineVerifiedUser} headingId="rights-h">
        <p className="text-[13px] leading-relaxed text-ink-muted">Authors keep their copyright. Accepted authors sign the electronic transfer form with a one-time code sent to their email. Every article is published under {journal.licence.name}.</p>
        <AppLink to={paths.track} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded border border-[#C4D9EE] bg-scholar-soft px-3 text-[13px] font-bold text-navy hover:border-scholar">File Copyright Form (Email OTP)</AppLink>
      </Card>
    </>
  )
}
