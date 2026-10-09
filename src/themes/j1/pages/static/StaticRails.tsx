// Side rails of the static-page template: policy directory (left) and the action cards (right).
import { useRef, useState, type FormEvent } from 'react'
import {
  MdOutlineDownload, MdOutlineFactCheck, MdOutlineFolderOpen, MdOutlineFolderZip, MdOutlineGavel, MdOutlineLockOpen, MdOutlineSearch,
  MdOutlineTrackChanges, MdOutlineUploadFile, MdOutlineVerified, MdOutlineVerifiedUser, MdOutlineWorkspacePremium, MdOutlineArticle,
} from 'react-icons/md'
import type { IconType } from 'react-icons'
import type { StaticGroup, StaticPageData } from '../../../../mock-data/journals/j1'
import { journal, visibleLogos } from '../../../../config/journals/j1'
import { paths, staticPath } from '../../../../config/routes'
import * as validate from '../../../../core/lib/validators'
import { formatDate } from '../../../../core/lib/format'
import { AppLink, useRouter } from '../../../../core/router'
import { AwardsCard } from '../../components/AwardsCard'
import { Button } from '../../components/Button'
import { Countdown } from '../../components/Countdown'
import { inputClass } from '../../components/form'
import { Card } from '../../components/PortalParts'
import { useToast } from '../../components/Toast'
import { OpenInNew } from '../../components/uiIcons'
import { StaticIcon } from './staticIcons'

/** How the policy pages are grouped in the directory card. Pages that are not listed fall into the last group. */
const POLICY_GROUPS: { label: string; icon: IconType; slugs: string[] }[] = [
  { label: 'Review & Ethics', icon: MdOutlineVerified, slugs: ['peer-review', 'publication-ethics', 'plagiarism', 'ai-policy', 'conflict-of-interest', 'reviewer-guidelines'] },
  { label: 'Publishing & Access', icon: MdOutlineLockOpen, slugs: ['open-access', 'copyright-licensing', 'archiving', 'corrections', 'retraction', 'data', 'author-guidelines'] },
  { label: 'Fees & Governance', icon: MdOutlineGavel, slugs: ['publication-charges', 'refund', 'editorial-policy', 'complaints', 'privacy'] },
]

export const directoryGroups = (group: StaticGroup, label: string, pages: StaticPageData[]) => {
  if (group !== 'policies') return [{ label, icon: MdOutlineFolderOpen, pages }]
  const used = new Set<string>()
  const out = POLICY_GROUPS.map((g) => {
    const list = g.slugs.map((s) => pages.find((p) => p.slug === s)).filter(Boolean) as StaticPageData[]
    list.forEach((p) => used.add(p.slug))
    return { label: g.label, icon: g.icon, pages: list }
  })
  const rest = pages.filter((p) => !used.has(p.slug))
  if (rest.length) out[out.length - 1].pages.push(...rest)
  return out.filter((g) => g.pages.length)
}

/** "Policy Directory": every page of the group, grouped under headings with a count badge. */
export function PolicyDirectory({ page, pages, label }: { page: StaticPageData; pages: StaticPageData[]; label: string }) {
  const groups = directoryGroups(page.group, label, pages)
  const title = page.group === 'policies' ? 'Policy Directory' : `${label} Directory`
  return (
    <nav aria-label={title} className="hidden border border-line bg-white lg:block">
      <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <h2 className="flex items-center gap-2 font-serif text-[1.0625rem] font-semibold text-navy"><MdOutlineFolderOpen className="h-5 w-5 text-scholar" aria-hidden />{title}</h2>
        <span className="rounded-sm border border-line bg-paper px-1.5 py-0.5 text-[11px] font-semibold tabular-nums text-ink-muted">{pages.length} pages</span>
      </div>
      {groups.map((g) => (
        <div key={g.label} className="border-b border-line py-2 last:border-b-0">
          <h3 className="flex items-center gap-1.5 px-4 pb-1 pt-1 text-[11px] font-bold uppercase tracking-wider text-ink-muted"><g.icon className="h-4 w-4 text-scholar" aria-hidden />{g.label}</h3>
          <ul>
            {g.pages.map((p) => {
              const on = p.slug === page.slug
              return (
                <li key={p.slug}>
                  <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                    className={`flex items-center gap-2 border-l-[3px] px-4 py-1.5 text-[13px] ${on ? 'border-scholar bg-scholar-soft font-semibold text-scholar' : 'border-transparent text-ink hover:bg-paper hover:text-navy'}`}>
                    <StaticIcon name={p.slug} className="h-4 w-4 shrink-0 opacity-80" aria-hidden />{p.title}
                  </AppLink>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/** Call for papers with the live countdown (final five days) or the deadline date. */
function CfpCard() {
  const { nextIssue } = journal
  const m = /Volume\s+(\d+),\s*Issue\s+(\d+)/i.exec(nextIssue.label)
  const days = (new Date(nextIssue.deadline).getTime() - Date.now()) / 86400000
  const live = days > 0 && days <= 5
  const date = formatDate(nextIssue.deadline.slice(0, 10))
  return (
    <section aria-labelledby="static-cfp-h" className="overflow-hidden border border-navy bg-white">
      <div className="flex items-center gap-2 bg-navy px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white">
        <span aria-hidden className="h-2 w-2 rounded-full bg-[#7FD6A0]" />Active CFP{m ? ` · Vol. ${m[1]}, Iss. ${m[2]}` : ''}
      </div>
      <div className="p-4">
        <h2 id="static-cfp-h" className="font-serif text-[1.1875rem] font-bold leading-tight text-navy">Call for Research Papers</h2>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">Original research, review papers and short communications across the journal’s subject areas.</p>
        <div className="mt-3 border border-line bg-paper p-3">
          <p className="mb-2 flex items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-wider text-ink-muted">
            <span>Submission window closes {live ? 'in' : 'on'}</span>
            {live && <span className="text-[11px] normal-case tracking-normal text-navy tabular-nums">{date}</span>}
          </p>
          {live ? <Countdown deadline={nextIssue.deadline} tone="light" /> : <p className="border border-line bg-white px-2 py-2 text-center font-mono text-base font-bold tabular-nums text-navy">{date}</p>}
        </div>
        <AppLink to={paths.submit} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded bg-gold px-3 text-sm font-bold text-navy-900 transition-colors hover:bg-gold-dark hover:text-white">
          <MdOutlineUploadFile className="h-5 w-5" aria-hidden />Submit Your Manuscript
        </AppLink>
        <p className="mt-2.5 text-center text-[11px] tabular-nums text-ink-muted">DOI {journal.doiPrefix} · {journal.licence.name}</p>
      </div>
    </section>
  )
}

/** Track form in the reference order: author email first, then the Paper ID. */
function TrackCard() {
  const { navigate } = useRouter()
  const [email, setEmail] = useState('')
  const [paperId, setPaperId] = useState('')
  const [errors, setErrors] = useState<{ email?: string; paperId?: string }>({})
  const first = useRef<HTMLInputElement>(null)
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { email: validate.email(email) || undefined, paperId: validate.paperId(paperId) || undefined }
    setErrors(next)
    if (next.email) return void first.current?.focus()
    if (next.paperId) return
    navigate(`${paths.track}?id=${paperId.trim().toUpperCase()}&email=${encodeURIComponent(email.trim().toLowerCase())}`)
  }
  const label = 'mb-1 block text-[11px] font-bold uppercase tracking-wider text-ink-muted'
  return (
    <Card title="Track Manuscript Status" icon={MdOutlineTrackChanges} aside="Author Portal" headingId="static-track-h">
      <form onSubmit={submit} noValidate className="space-y-3">
        <div>
          <label htmlFor="static-trk-email" className={label}>Author email address</label>
          <input id="static-trk-email" ref={first} type="email" className={inputClass(errors.email)} value={email} maxLength={120} autoComplete="email" placeholder="you@institution.edu"
            aria-invalid={errors.email ? true : undefined} aria-describedby={errors.email ? 'static-trk-email-err' : undefined}
            onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} />
          {errors.email && <p id="static-trk-email-err" role="alert" className="mt-1 text-xs font-medium text-danger">{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="static-trk-paper" className={label}>Paper ID</label>
          <input id="static-trk-paper" className={inputClass(errors.paperId)} value={paperId} maxLength={15} autoComplete="off" spellCheck={false} placeholder="IJMAT2026000123"
            aria-invalid={errors.paperId ? true : undefined} aria-describedby={errors.paperId ? 'static-trk-paper-err' : undefined}
            onChange={(e) => { setPaperId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setErrors((x) => ({ ...x, paperId: undefined })) }} />
          {errors.paperId && <p id="static-trk-paper-err" role="alert" className="mt-1 text-xs font-medium text-danger">{errors.paperId}</p>}
        </div>
        <Button type="submit" className="w-full"><MdOutlineSearch className="h-5 w-5" aria-hidden />Check Review Status</Button>
      </form>
    </Card>
  )
}

const DOWNLOADS = [
  ['Manuscript Template', 'DOCX', MdOutlineArticle], ['LaTeX Journal Template', 'ZIP', MdOutlineFolderZip],
  ['Peer Review Scorecard', 'PDF', MdOutlineFactCheck], ['Sample Publication Certificate', 'PDF', MdOutlineWorkspacePremium],
] as const

/** Right column: call for papers, track, awards, indexing verifier, downloads, author rights. */
export function PolicyRightRail() {
  const toast = useToast()
  const logos = visibleLogos()
  return (
    <>
      <CfpCard />
      <TrackCard />
      <AwardsCard />
      {logos.length > 0 && (
        <Card title="Global Indexing Verifier" aside={`${logos.length} listings`} headingId="static-verifier-h">
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
      <Card title="Author & Reviewer Downloads" icon={MdOutlineDownload} headingId="static-downloads-h">
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
      <Card title="Author Rights & Copyright" icon={MdOutlineVerifiedUser} headingId="static-rights-h">
        <p className="text-[13px] leading-relaxed text-ink-muted">Authors keep their copyright. Accepted authors sign the electronic transfer form with a one-time code sent to their email. Every article is published under {journal.licence.name}.</p>
        <AppLink to={paths.track} className="mt-3 inline-flex h-10 w-full items-center justify-center rounded border border-[#C4D9EE] bg-scholar-soft px-3 text-[13px] font-bold text-navy hover:border-scholar">File Copyright Form (Email OTP)</AppLink>
      </Card>
    </>
  )
}
