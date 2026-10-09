import { MdOutlineArticle, MdOutlineDownload, MdOutlineFactCheck, MdOutlineFolderZip, MdOutlineTrackChanges, MdOutlineWorkspacePremium } from 'react-icons/md'
import { journal, visibleLogos } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { AwardsCard } from './AwardsCard'
import { ButtonLink } from './Button'
import { Countdown } from './Countdown'
import { IndexLogo } from './IndexLogos'
import { Card } from './PortalParts'
import { StickyRail } from './StickyRail'
import { useToast } from './Toast'
import { TrackForm } from './TrackForm'
import { CheckCircle2, FilePlus2, OpenInNew, ShieldCheck } from './uiIcons'

/** One row of compact index tiles (only logos switched on in the config) with a link to the indexing page. */
export function IndexedStrip() {
  const logos = visibleLogos()
  if (!logos.length) return null
  return (
    <section aria-labelledby="indexed-title" className="mt-8 border border-line bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="indexed-title" className="font-serif text-[1.125rem] font-semibold text-navy">Indexed &amp; Discoverable On Global Academic Indices</h2>
        <AppLink to={paths.about('indexing')} className="inline-flex items-center gap-1 text-sm font-semibold text-scholar hover:underline">Verify repositories<OpenInNew className="h-3.5 w-3.5" aria-hidden /></AppLink>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:flex lg:gap-2">
        {logos.map((l) => <li key={l.id} className="lg:min-w-0 lg:flex-1"><IndexLogo logo={l} look="compact" opensUp /></li>)}
      </ul>
    </section>
  )
}

/** Navy "Call for next issue" banner with the countdown and the Submit button. */
export function NextIssueBanner() {
  const { nextIssue } = journal
  return (
    <section aria-labelledby="next-call-title" className="mt-6 flex flex-col gap-5 bg-navy p-6 text-white md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFC1E3]">Call for next issue</p>
        <h2 id="next-call-title" className="mt-1 font-serif text-[1.5rem] font-semibold leading-snug">{nextIssue.label}</h2>
        <p className="mt-1 text-sm text-[#D6E0F3]">Submission deadline <strong className="tabular-nums text-white">{formatDate(nextIssue.deadline.slice(0, 10))}</strong> · Expected publication <strong className="tabular-nums text-white">{formatDate(nextIssue.expectedPublication)}</strong></p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Countdown deadline={nextIssue.deadline} windowDays={60} />
        <ButtonLink to={paths.submit} variant="submit" size="lg"><FilePlus2 className="h-5 w-5" aria-hidden />Submit Manuscript</ButtonLink>
      </div>
    </section>
  )
}

const KIT = [
  ['Manuscript Template', 'DOCX', MdOutlineArticle], ['LaTeX Journal Template', 'ZIP', MdOutlineFolderZip],
  ['Peer Review Scorecard', 'PDF', MdOutlineFactCheck], ['Sample Publication Certificate', 'PDF', MdOutlineWorkspacePremium],
] as const

const CFP_POINTS = [
  <><strong>Open Access</strong> ({journal.licence.name}); authors keep copyright</>,
  <><strong>Crossref DOI</strong> assigned to every article</>,
  <>First decision in about <strong>{journal.heroStats.find((s) => s.id === 'review')?.value ?? '14 days'}</strong></>,
  <>Expected publication <strong className="tabular-nums">{formatDate(journal.nextIssue.expectedPublication)}</strong></>,
]

export function IssueRightRail() {
  const toast = useToast()
  const get = (k: string) => journal.info.find(([n]) => n === k)?.[1]
  const iso = visibleLogos().find((l) => l.id === 'iso')
  const rows: [string, string][] = [
    ['Frequency', get('Frequency') ?? journal.frequency], ['Starting Year', get('Starting Year') ?? ''], ['ISSN', journal.issnOnline], ['Publisher', get('Publisher') ?? ''],
    ['Language', get('Language') ?? ''], ['Format', get('Publication Format') ?? 'Online'], ['Review model', journal.badges.peerReviewed ? 'Peer reviewed' : ''], ['DOI Prefix', journal.doiPrefix],
  ]
  return (
    <StickyRail as="div" className="space-y-5 lg:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1">
      <section aria-labelledby="cfp-title" className="overflow-hidden border border-navy bg-navy text-white">
        <div className="border-b border-white/15 p-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFC1E3]">Call for papers</p>
          <h2 id="cfp-title" className="mt-1 font-serif text-[1.375rem] font-semibold leading-snug">Submissions Open</h2>
          <p className="mt-1 text-sm text-[#D6E0F3]">{journal.nextIssue.label}</p>
        </div>
        <div className="bg-white p-5 text-sm text-ink">
          <ul className="space-y-2.5">
            {CFP_POINTS.map((p, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-oa" aria-hidden /><span>{p}</span></li>)}
          </ul>
          <ButtonLink to={paths.submit} variant="submit" className="mt-4 w-full"><FilePlus2 className="h-4 w-4" aria-hidden />Submit Manuscript</ButtonLink>
        </div>
      </section>

      <Card title="Track Manuscript Status" icon={MdOutlineTrackChanges} headingId="issue-track-h">
        <p className="mb-3 text-[13px] text-ink-muted">No login needed. Enter the Paper ID and email from your confirmation.</p>
        <TrackForm idPrefix="issue" submitLabel="Check Review Status" />
      </Card>

      <Card title="Author & Reviewer Kit" icon={MdOutlineDownload} headingId="issue-kit-h">
        <ul className="space-y-1.5">
          {KIT.map(([name, kind, Icon]) => (
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

      <section aria-labelledby="vital-title" className="border border-line bg-white">
        <h2 id="vital-title" className="bg-navy px-4 py-3 font-serif text-[1.0625rem] font-semibold text-white">Journal Vital Statistics</h2>
        <dl className="text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[104px_1fr] border-t border-line first:border-t-0">
              <dt className="bg-navy px-3 py-2.5 text-[13px] font-bold text-white">{k}</dt>
              <dd className="px-3 py-2.5 tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
        {iso && (
          <p className="flex items-center gap-1.5 border-t border-line px-3 py-2.5 text-xs font-bold text-navy">
            <ShieldCheck className="h-4 w-4 text-oa" aria-hidden /><span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2 py-0.5">{iso.name}</span> <span className="font-semibold text-ink-muted">{iso.status}</span>
          </p>
        )}
      </section>
      <AwardsCard />
    </StickyRail>
  )
}
