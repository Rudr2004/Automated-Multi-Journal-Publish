import { useState, type ComponentType, type FormEvent, type ReactNode } from 'react'
import { MdOutlineArrowForward, MdOutlineArticle, MdOutlineDownload, MdOutlineFactCheck, MdOutlineNotifications, MdOutlineSchool, MdOutlineSearch, MdOutlineTrackChanges, MdOutlineVerified, MdOutlineVerifiedUser, MdOutlineWorkspacePremium } from 'react-icons/md'
import type { J1HomeData } from '../../../mock-data/journals/j1'
import { journal, logoSrc, visibleLogos } from '../../../config/journals/j1'
import { logoAlt } from './IndexLogos'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import * as validate from '../../../core/lib/validators'
import { AppLink, useRouter } from '../../../core/router'
import { closesIn } from '../layouts/ResearchRibbon'
import { AwardsCard, recipientNames } from './AwardsCard'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Field, inputClass } from './form'
import { Modal } from './Modal'
import { Tag } from './PortalParts'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { useToast } from './Toast'
import { FilePlus2, OpenInNew } from './uiIcons'
import { idExample, idMaxLength, normalizeId } from '../../../core/lib/manuscriptId'

type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

const SIDE_LINK = 'inline-flex w-full items-center justify-center gap-1.5 rounded px-3 text-[13px] font-bold transition-colors'

/** Sidebar card at the reference scale: 16px serif heading (sans for `sans`), hairline rule, 12-13px body. Home sidebars only. */
function SideCard({ title, icon: Icon, aside, children, headingId, sans = false, label = false }: {
  title: ReactNode; icon?: IconType; aside?: ReactNode; children: ReactNode; headingId: string; sans?: boolean
  /** Small uppercase label heading (Quick Navigators). */
  label?: boolean
}) {
  return (
    <section aria-labelledby={headingId} className="rounded border border-line bg-white p-4">
      <header className="mb-3 flex items-center justify-between gap-2 border-b border-line pb-2.5">
        <h2 id={headingId} className={label
          ? 'text-[11px] font-bold uppercase tracking-wider text-ink-muted'
          : `flex items-center gap-2 text-base font-bold leading-snug text-navy ${sans ? 'font-sans' : 'font-serif'}`}>
          {Icon && <Icon className="h-[18px] w-[18px] shrink-0 text-scholar" aria-hidden />}{title}
        </h2>
        {aside && <div className="shrink-0 text-[11px] font-medium text-ink-muted">{aside}</div>}
      </header>
      {children}
    </section>
  )
}

/** Call for papers: navy-bordered card with the current call's key dates (from the journal config). */
export function CfpCard() {
  const call = journal.callForPapers
  const issue = call?.currentCall.match(/^(Volume \d+, Issue \d+)/)?.[1] ?? journal.nextIssue.label.split(' — ')[0]
  const rows: [label: string, value: string][] = call
    ? [['Current Call', call.currentCall], ['Last Date for Submission', call.lastDate], ['Notification of Acceptance', call.acceptance], ['Online Publication', call.publication]]
    : [['Current Call', journal.nextIssue.label], ['Last Date for Submission', formatDate(journal.nextIssue.deadline.slice(0, 10))], ['Online Publication', formatDate(journal.nextIssue.expectedPublication)]]
  return (
    <section aria-labelledby="cfp-h" className="overflow-hidden rounded border-2 border-navy bg-white">
      <div className="flex items-center gap-1.5 whitespace-nowrap bg-navy px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white">
        <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[#7FD6A0]" />Active CFP <span aria-hidden>•</span> {issue.replace('Volume', 'Vol.').replace(/ 0(\d)/g, ' $1')}
      </div>
      <div className="p-4">
        <h2 id="cfp-h" className="font-serif text-lg font-bold leading-tight text-navy">Call for Research Papers &amp; Articles</h2>
        <dl className="mt-3 divide-y divide-line rounded border border-line bg-paper text-[13px]">
          {rows.map(([label, value]) => (
            <div key={label} className="px-3 py-2">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">{label}</dt>
              <dd className="mt-0.5 font-semibold leading-snug text-navy">{value}</dd>
            </div>
          ))}
        </dl>
        <AppLink to={paths.submit} className={`${SIDE_LINK} mt-3 h-11 bg-scholar text-white hover:bg-scholar-dark`}><FilePlus2 className="h-5 w-5" aria-hidden />Submit Your Manuscript</AppLink>
        <p className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-center text-[11px] text-ink-muted">
          <span>DOI prefix {journal.doiPrefix}</span><span aria-hidden>•</span><span>APC after acceptance</span><span aria-hidden>•</span><span>{journal.licence.name}</span>
        </p>
      </div>
    </section>
  )
}

/**
 * "Scholarly Notices": the SAME announcements as the strip at the top of the site (same text, same links, same "closes in" wording),
 * scrolling upwards. Hover or focus pauses them; for reduced-motion visitors they stop and the list can be scrolled by hand.
 */
function ScrollingNotices() {
  const items = journal.announcements.map((a) => ({ ...a, label: a.live ? `${a.text} ${closesIn(journal.nextIssue.deadline)}` : a.text }))
  const list = (copy: number) => items.map((a) => (
    <li key={`${copy}-${a.id}`} className="py-2.5">
      <AppLink to={a.to} className={`block text-[13px] leading-snug hover:underline ${a.highlight ? 'font-semibold text-[#8A4B00]' : 'text-ink'}`}>{a.label}</AppLink>
    </li>
  ))
  return (
    <div className="j1-pausable h-44 overflow-hidden motion-reduce:overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,#000_10px,#000_calc(100%-14px),transparent)]">
      <div className="j1-scroll-up" style={{ ['--j1-scroll-duration' as string]: `${Math.max(16, items.length * 7)}s` }}>
        <ul className="divide-y divide-line" aria-label="Journal announcements">{list(0)}</ul>
        <ul className="divide-y divide-line border-t border-line" aria-hidden>{list(1)}</ul>
      </div>
    </div>
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
      <h2 id="join-h" className="font-serif text-base font-bold leading-snug">Join the Editorial &amp; Peer Review Board</h2>
      <p className="mt-1.5 text-[13px] leading-relaxed text-navy-100">Doctoral degree holders, post-docs and university faculty are invited to review. Reviewers receive a verifiable certificate for every review.</p>
      <AppLink to={paths.forAuthors('become-a-reviewer')} className={`${SIDE_LINK} mt-3.5 h-10 bg-scholar text-white hover:bg-scholar-dark`}>Apply as a reviewer<MdOutlineArrowForward className="h-4 w-4" aria-hidden /></AppLink>
    </section>
  )
}

/** Dialog form to nominate a supervisor / guide. No backend: shows the confirmation toast only. */
function NominateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast()
  const empty = { nominator: '', email: '', supervisor: '', institution: '', reason: '' }
  const [v, setV] = useState(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({})
  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) => { setV((x) => ({ ...x, [k]: e.target.value })); setErrors((x) => ({ ...x, [k]: undefined })) }
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = {
      nominator: v.nominator.trim() ? '' : 'Enter your name.', email: validate.email(v.email),
      supervisor: v.supervisor.trim() ? '' : 'Enter the supervisor’s name.', institution: v.institution.trim() ? '' : 'Enter the institution.',
    }
    setErrors(Object.fromEntries(Object.entries(next).filter(([, m]) => m)))
    if (Object.values(next).some(Boolean)) return
    toast('Nomination received. The editorial office will review it for the monthly recognition.')
    setV(empty); setErrors({}); onClose()
  }
  return (
    <Modal open={open} onClose={onClose} title="Nominate a supervisor or guide">
      <p className="mb-4 text-sm text-ink-muted">Nominate a research supervisor whose mentoring led to a published paper. Nominations are reviewed by the Senior Editorial Committee each month.</p>
      <form onSubmit={submit} noValidate className="space-y-3.5">
        <Field label="Your name" name="nominator" required error={errors.nominator}><input className={inputClass(errors.nominator)} value={v.nominator} maxLength={80} autoComplete="name" onChange={set('nominator')} /></Field>
        <Field label="Your email" name="email" required error={errors.email}><input type="email" className={inputClass(errors.email)} value={v.email} maxLength={120} autoComplete="email" onChange={(e) => set('email')({ target: { value: e.target.value.replace(/\s/g, '') } })} /></Field>
        <Field label="Supervisor / guide name" name="supervisor" required error={errors.supervisor}><input className={inputClass(errors.supervisor)} value={v.supervisor} maxLength={80} onChange={set('supervisor')} /></Field>
        <Field label="Institution" name="institution" required error={errors.institution}><input className={inputClass(errors.institution)} value={v.institution} maxLength={120} onChange={set('institution')} /></Field>
        <Field label="Why do they deserve it?" name="reason" hint="Optional. A sentence or two is enough." counter={`${v.reason.length} / 300`}><textarea rows={3} className={inputClass()} value={v.reason} maxLength={300} onChange={set('reason')} /></Field>
        <div className="flex flex-wrap justify-end gap-2 pt-1">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit">Submit nomination</Button>
        </div>
      </form>
    </Modal>
  )
}

/** "Monthly Best Research Mentor" card with the latest recipient and a nomination dialog. */
function MentorCard({ award }: { award?: J1HomeData['awards'][number] }) {
  const [open, setOpen] = useState(false)
  return (
    <SideCard title="Monthly Best Research Mentor" icon={MdOutlineWorkspacePremium} headingId="mentor-h">
      <p className="text-xs leading-snug text-ink-muted">Recognising academic supervisors and PhD guides who mentored published student manuscripts.</p>
      {award && (
        <div className="mt-3 rounded border border-line bg-paper p-3">
          <div className="flex items-center justify-between gap-2"><Tag tone="amber">Guide Honor</Tag><span className="text-[11px] text-ink-muted">{award.period}</span></div>
          <p className="mt-2 font-serif text-sm font-bold leading-snug text-navy">{award.title}</p>
          <div className="mt-2 flex items-start gap-2">
            <span className="flex shrink-0 -space-x-1.5" aria-hidden>{recipientNames(award.recipient).map((n) => <Avatar key={n} name={n} photo={portraitFor(n)} size="xs" />)}</span>
            <p className="min-w-0 text-[13px] font-semibold leading-snug text-navy">{award.recipient}</p>
          </div>
          <p className="mt-1.5 text-xs leading-snug text-ink-muted">{award.reason}</p>
        </div>
      )}
      <button type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"
        className={`${SIDE_LINK} mt-3 h-10 border border-[#C4D9EE] bg-scholar-soft text-navy hover:border-scholar`}>Nominate supervisor / guide</button>
      <NominateDialog open={open} onClose={() => setOpen(false)} />
    </SideCard>
  )
}

// Only pages that exist: no Fast-Track Peer Review or Reviewer Recognition page, so Peer Review Process / Reviewer Guidelines stay.
const QUICK = [
  ['Plagiarism Policy', paths.policy('plagiarism'), MdOutlineFactCheck], ['Publication Ethics (COPE)', paths.policy('publication-ethics'), MdOutlineVerifiedUser],
  ['Peer Review Process', paths.policy('peer-review'), MdOutlineArticle], ['Verify Author Certificate', paths.verify(), MdOutlineWorkspacePremium],
  ['Reviewer Guidelines', paths.policy('reviewer-guidelines'), MdOutlineSchool],
] as const

/** Left column: reviewer call, notices, mentor award, Crossref note and quick navigators. */
export function LeftSidebar({ data }: { data: J1HomeData }) {
  const mentor = data.awards.find((a) => /mentor/i.test(a.kind))
  return (
    <>
      <JoinBoardCard />
      <SideCard title="Scholarly Notices" icon={MdOutlineNotifications} aside="Live" headingId="notices-h">
        <ScrollingNotices />
      </SideCard>
      <MentorCard award={mentor} />
      <section aria-labelledby="doi-h" className="rounded border border-line bg-white p-4 text-center">
        <p id="doi-h" className="font-sans text-xl font-bold lowercase tracking-tight text-navy"><span className="sr-only">Crossref DOI</span><span aria-hidden>crossref</span></p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink">Every published paper is registered with Crossref under the prefix <strong className="tabular-nums">{journal.doiPrefix}</strong> and receives a permanent DOI.</p>
        <a href="https://search.crossref.org/" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-scholar hover:underline">Verify prefix {journal.doiPrefix}<OpenInNew className="h-3.5 w-3.5" aria-hidden /><span className="sr-only"> (opens in a new tab)</span></a>
      </section>
      <SideCard title="Quick Navigators" label headingId="quick-h">
        <ul className="-my-1 divide-y divide-line text-[13px]">
          {QUICK.map(([label, to, Icon]) => (
            <li key={label}><AppLink to={to} className="flex items-center justify-between gap-2 py-2 font-medium text-ink hover:text-scholar">{label}<Icon className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden /></AppLink></li>
          ))}
        </ul>
      </SideCard>
    </>
  )
}

const LABEL = 'mb-1 block text-[11px] font-bold uppercase tracking-wider text-ink-muted'

/** Track form for the home sidebar: email first, then Manuscript ID, small uppercase labels and a search icon on the button. Same behaviour as TrackForm. */
function SideTrackForm() {
  const { navigate } = useRouter()
  const [paperId, setPaperId] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ paperId?: string; email?: string }>({})
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { paperId: validate.paperId(paperId) || undefined, email: validate.email(email) || undefined }
    setErrors(next)
    if (next.paperId || next.email) return
    navigate(`${paths.track}?id=${normalizeId(paperId.trim())}&email=${encodeURIComponent(email.trim().toLowerCase())}`)
  }
  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <div>
        <label htmlFor="side-email" className={LABEL}>Email</label>
        <input id="side-email" type="email" className={`${inputClass(errors.email)} !py-1.5 !text-sm`} value={email} maxLength={120} autoComplete="email" placeholder="you@institution.edu"
          aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'side-email-err' : undefined}
          onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} />
        {errors.email && <p id="side-email-err" role="alert" className="mt-1 text-xs font-medium text-danger">{errors.email}</p>}
      </div>
      <div>
        <label htmlFor="side-paper" className={LABEL}>Manuscript ID</label>
        <input id="side-paper" className={`${inputClass(errors.paperId)} !py-1.5 !text-sm`} value={paperId} maxLength={idMaxLength} autoComplete="off" spellCheck={false} placeholder={idExample}
          aria-invalid={errors.paperId ? true : undefined} aria-describedby={errors.paperId ? 'side-paper-err' : undefined}
          onChange={(e) => { setPaperId(normalizeId(e.target.value)); setErrors((x) => ({ ...x, paperId: undefined })) }} />
        {errors.paperId && <p id="side-paper-err" role="alert" className="mt-1 text-xs font-medium text-danger">{errors.paperId}</p>}
      </div>
      <Button type="submit" className="w-full"><MdOutlineSearch className="h-5 w-5" aria-hidden />Check Review Status</Button>
    </form>
  )
}

// File names carry the extension; the badge names the format. Downloads are simulated (toast) until real files are supplied.
const DOWNLOADS = [
  ['Manuscript_Template.docx', 'Word', MdOutlineArticle], ['Sample_Acceptance_Certificate.pdf', 'PDF', MdOutlineVerified],
  ['Sample_Certificate.pdf', 'PDF', MdOutlineWorkspacePremium],
] as const

/** Right column: call for papers, track a paper, recognition awards, index verifier, downloads and author rights. */
export function RightSidebar({ awards = [] }: { awards?: J1HomeData['awards'] }) {
  const toast = useToast()
  const logos = visibleLogos()
  return (
    <>
      <div className="hidden xl:block"><CfpCard /></div>
      <SideCard title="Track Manuscript Status" icon={MdOutlineTrackChanges} headingId="track-h">
        <p className="mb-3 text-xs text-ink-muted">No login needed. Enter the email and Manuscript ID from your confirmation.</p>
        <SideTrackForm />
      </SideCard>
      {/* AwardsCard is shared; scale its heading and text down to the sidebar scale on the home page only. */}
      <div className="[&_h2]:text-[15px] [&_h2]:leading-snug [&_section>header_p]:text-xs"><AwardsCard awards={awards} /></div>
      {logos.length > 0 && (
        <SideCard title="Global Indexing Verifier" aside={`${logos.length} listings`} headingId="verifier-h">
          <ul className="grid grid-cols-2 gap-1.5">
            {logos.slice(0, 12).map((l) => (
              <li key={l.id}>
                <a href={l.verifyUrl} target="_blank" rel="noopener noreferrer" title={`${l.status}. Verify on ${l.name}`}
                  className="flex h-12 items-center justify-center rounded border border-line bg-white px-2 hover:border-scholar">
                  <img src={logoSrc(l.file)} alt={logoAlt(l)} loading="lazy" className="max-h-7 w-auto max-w-full object-contain" /><span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
          {logos.length > 12 && <AppLink to={paths.about('indexing')} className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-scholar hover:underline">All {logos.length} listings<MdOutlineArrowForward className="h-3.5 w-3.5" aria-hidden /></AppLink>}
        </SideCard>
      )}
      <SideCard title="Author & Reviewer Downloads" icon={MdOutlineDownload} headingId="downloads-h">
        <ul className="space-y-1.5">
          {DOWNLOADS.map(([name, kind, Icon]) => (
            <li key={name}>
              <button type="button" onClick={() => toast(`${name} downloaded (simulated).`)}
                className="flex min-h-10 w-full items-center gap-2 rounded border border-line bg-white px-2.5 py-1.5 text-left text-[13px] font-medium text-navy hover:border-scholar hover:bg-mist">
                <Icon className="h-4 w-4 shrink-0 text-scholar" aria-hidden /><span className="min-w-0 flex-1 break-all">{name}</span>
                <span className="shrink-0 rounded-sm border border-line bg-paper px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink-muted">{kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </SideCard>
      <SideCard title="Author Rights & Copyright" icon={MdOutlineVerifiedUser} sans headingId="rights-h">
        <p className="text-[13px] leading-relaxed text-ink-muted">Authors keep their copyright. Accepted authors sign the electronic transfer form with a one-time code sent to their email. Every article is published under {journal.licence.name}.</p>
        <AppLink to={paths.track} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded border border-[#C4D9EE] bg-scholar-soft px-3 text-[13px] font-bold text-navy hover:border-scholar">File Copyright Form (Email OTP)</AppLink>
      </SideCard>
    </>
  )
}
