// Right-hand helper cards shared by the Journal 4 submit and track pages (reference order): recent submissions, call for papers,
// announcements, track manuscript, copyright, Crossref DOI lookup, journal facts, templates and licence notice.
import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { api } from '../../../../core/api'
import { formatDate } from '../../../../core/lib/format'
import * as validate from '../../../../core/lib/validators'
import { AppLink, useRouter } from '../../../../core/router'
import type { HomeData } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { ArrowForward, Campaign, ChevronLeft, ChevronRight, Copyright, Description, DownloadOffline, Draw, EditDocument, FingerprintIcon, FolderZip, ManageSearch, PendingActions, RateReview, Rule, SearchIcon, SendIcon, Stream, TrackIcon } from './mi'

const card = 'rounded-xl border border-slate-200 bg-white p-5 shadow-sm'
const inputCls = 'block w-full min-h-[44px] rounded border border-slate-300 bg-slate-50 px-3 py-2 text-base placeholder:text-slate-500 focus:border-sky-600 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-600/30 sm:min-h-0 sm:py-1.5 sm:text-xs'
const btnSky = 'flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 sm:min-h-0'

function HeadSimple({ icon, title, id }: { icon: ReactNode; title: string; id: string }) {
  return (
    <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-2">
      <span aria-hidden="true" className="text-sky-600">{icon}</span>
      <h2 id={id} className="font-serif4 text-sm font-bold text-[#0b2545]">{title}</h2>
    </div>
  )
}

const ago = (m: number) => (m < 60 ? `${Math.max(1, Math.round(m))} min ago` : m < 1440 ? `${Math.floor(m / 60)} h ago` : `${Math.floor(m / 1440)} d ago`)

function RecentCard({ home }: { home: HomeData | null }) {
  const items = home?.recentSubmissions ?? []
  const stages: { icon: ReactNode; tone: string; label: string; text: string }[] = [
    { icon: <PendingActions className="h-3.5 w-3.5" />, tone: 'text-sky-800 bg-sky-50 border-sky-100', label: 'Editorial Screening', text: 'An editor checks scope, completeness and similarity.' },
    { icon: <RateReview className="h-3.5 w-3.5" />, tone: 'text-amber-800 bg-amber-50 border-amber-100', label: 'Assigned to Reviewers', text: 'Experts review against a published checklist.' },
    { icon: <Rule className="h-3.5 w-3.5" />, tone: 'text-purple-800 bg-purple-50 border-purple-100', label: 'Peer Review', text: 'Reviewers send comments to the editor.' },
    { icon: <RateReview className="h-3.5 w-3.5" />, tone: 'text-emerald-800 bg-emerald-50 border-emerald-100', label: 'Decision', text: 'Accept, revise or reject, with written reasons.' },
  ]
  return (
    <section aria-labelledby="j4-recent-h" className={card}>
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 id="j4-recent-h" className="flex items-center gap-1.5 text-xs font-bold text-[#0b2545]"><Stream className="h-4 w-4 text-sky-600" aria-hidden="true" />{items.length ? 'Recent Submissions' : 'After You Submit'}</h2>
        <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-800"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />{items.length ? 'Active Stream' : 'Review stages'}</span>
      </div>
      <ul className="space-y-3 text-xs">
        {items.length
          ? items.slice(0, 4).map((s, i, arr) => (
              <li key={`${s.title ?? s.subject}-${s.minutes}`} className={cx('space-y-1', i < arr.length - 1 && 'border-b border-slate-100 pb-2.5')}>
                <span className="font-mono text-[11px] font-semibold text-sky-700">{s.institution}</span>
                <p className="text-[11px] font-medium leading-snug text-slate-800">{s.title ?? s.subject}</p>
                <span className="inline-flex items-center gap-1.5 rounded border border-sky-100 bg-sky-50 px-1.5 text-[10px] text-sky-800">{ago(s.minutes)}</span>
              </li>
            ))
          : stages.map((s, i) => (
              <li key={s.label} className={cx('space-y-1', i < stages.length - 1 && 'border-b border-slate-100 pb-2.5')}>
                <span className="font-mono text-[11px] font-semibold text-sky-700">Stage {i + 1}</span>
                <p className="text-[11px] font-medium leading-snug text-slate-800">{s.text}</p>
                <span className={cx('inline-flex items-center gap-1.5 rounded border px-1.5 text-[10px]', s.tone)}>{s.icon}{s.label}</span>
              </li>
            ))}
      </ul>
    </section>
  )
}

function CfpCard({ home }: { home: HomeData | null }) {
  const cfp = home?.callForPapers
  const label = cfp?.issueName ?? journal.nextIssue.label
  const [issue, month] = label.split(' — ')
  const [vol, iss] = issue.replace('Volume', 'Vol').replace('Issue', 'Iss').split(', ')
  const rows: [string, string, string][] = [
    ['Submission Deadline:', formatDate((cfp?.deadline ?? journal.nextIssue.deadline).slice(0, 10)), 'font-bold text-amber-950'],
    ...(cfp ? [['First Decision:', `~${cfp.avgReviewDays} Days`, 'font-bold text-emerald-700'] as [string, string, string]] : []),
    ['Expected Publication:', formatDate(cfp?.expectedPublication ?? journal.nextIssue.expectedPublication), 'font-bold text-sky-800'],
  ]
  return (
    <section aria-labelledby="j4-cfp-h" className="rounded-xl border border-[#bfdbfe] bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 id="j4-cfp-h" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700"><Campaign className="h-5 w-5" aria-hidden="true" />Call for Papers</h2>
        <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-sky-800">{vol} • {iss}</span>
      </div>
      <div className="mt-3 space-y-2">
        <div className="font-serif4 text-base font-extrabold leading-tight text-[#0b2545]">{issue.replace(', ', ' • ')}</div>
        <div className="text-xs font-bold text-sky-700">{month} Edition</div>
        <p className="text-xs leading-normal text-slate-600">Submissions are invited for the next regular issue of {journal.shortName}, covering engineering research and engineering management.</p>
        <div className="space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs">
          {rows.map(([k, v, cls]) => <div key={k} className="flex items-center justify-between text-[11px]"><span className="text-slate-700">{k}</span><span className={cls}>{v}</span></div>)}
        </div>
        <AppLink to={paths.submit} className={btnSky}><SendIcon className="h-4 w-4" aria-hidden="true" />Submit Manuscript</AppLink>
      </div>
    </section>
  )
}

function AnnouncementsCard({ home }: { home: HomeData | null }) {
  const list = journal.announcements
  const [i, setI] = useState(0)
  if (!list.length) return null
  const a = list[i % list.length]
  const cfp = a.id === 'cfp'
  const step = (d: number) => setI((n) => (n + d + list.length) % list.length)
  return (
    <section aria-labelledby="j4-ann-h" className={cx(card, 'space-y-3')}>
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 id="j4-ann-h" className="flex items-center gap-1.5 font-serif4 text-xs font-bold uppercase tracking-wider text-amber-800"><Campaign className="h-5 w-5 text-amber-600" aria-hidden="true" />Announcements</h2>
        {a.live && <span className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-amber-900 shadow-sm"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-amber-500 motion-safe:animate-pulse" />Live Updates</span>}
      </div>
      <div className="space-y-2" aria-live="polite">
        <span className="inline-block rounded border border-sky-100 bg-sky-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky-700">{cfp ? 'Call for Papers' : 'Notice'}</span>
        <h3 className="font-serif4 text-xs font-bold leading-snug text-[#0b2545]"><AppLink to={a.to} className="hover:text-sky-700 hover:underline">{a.text}</AppLink></h3>
        {cfp && (
          <div className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-2 text-[11px]">
            <span className="text-slate-600">Submission Deadline:</span>
            <span className="font-mono font-bold text-amber-950">{formatDate((home?.callForPapers.deadline ?? journal.nextIssue.deadline).slice(0, 10))}</span>
          </div>
        )}
        <div className="flex items-center justify-between pt-1">
          <AppLink to={a.to} className="flex min-h-[44px] items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 hover:underline sm:min-h-0">{cfp ? 'Learn More & Submit' : 'Read More'}<ArrowForward className="h-3.5 w-3.5" aria-hidden="true" /></AppLink>
          {list.length > 1 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1" aria-hidden="true">{list.map((x, n) => <span key={x.id} className={cx('rounded-full', n === i ? 'h-2 w-2 bg-sky-600' : 'h-1.5 w-1.5 bg-slate-300')} />)}</div>
              <div className="ml-1 flex items-center gap-1 text-slate-500">
                <button type="button" onClick={() => step(-1)} aria-label="Previous announcement" className="flex h-8 w-8 items-center justify-center rounded hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"><ChevronLeft className="h-4 w-4" /></button>
                <button type="button" onClick={() => step(1)} aria-label="Next announcement" className="flex h-8 w-8 items-center justify-center rounded hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function TrackCard() {
  const { navigate } = useRouter()
  const id = useId()
  const [pid, setPid] = useState('')
  const [mail, setMail] = useState('')
  const [err, setErr] = useState({ pid: '', mail: '' })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    const next = { pid: validate.paperId(pid.trim().toUpperCase()), mail: validate.email(mail) }
    setErr(next)
    if (next.pid || next.mail) return
    navigate(`${paths.track}?id=${encodeURIComponent(pid.trim().toUpperCase())}&email=${encodeURIComponent(mail.trim())}`)
  }
  return (
    <section aria-labelledby="j4-trk-h" id="track-manuscript-sidebar" className={card}>
      <HeadSimple icon={<TrackIcon className="h-5 w-5" />} title="Track Manuscript Status" id="j4-trk-h" />
      <p className="mb-3 text-xs text-slate-600">Enter your Paper ID and the corresponding author email to see real-time review progress.</p>
      <form onSubmit={submit} noValidate className="space-y-2.5">
        <div>
          <label htmlFor={`${id}-p`} className="mb-1 block text-[11px] font-medium text-slate-700">Manuscript ID</label>
          <input id={`${id}-p`} value={pid} onChange={(e) => setPid(e.target.value)} placeholder={`e.g. ${journal.paperIdPrefix}2026000112`} autoComplete="off" aria-invalid={!!err.pid} aria-describedby={err.pid ? `${id}-pe` : undefined} className={cx(inputCls, 'font-mono')} />
          {err.pid && <p id={`${id}-pe`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.pid}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-m`} className="mb-1 block text-[11px] font-medium text-slate-700">Corresponding Author Email</label>
          <input id={`${id}-m`} type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="author@university.edu" autoComplete="email" aria-invalid={!!err.mail} aria-describedby={err.mail ? `${id}-me` : undefined} className={inputCls} />
          {err.mail && <p id={`${id}-me`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.mail}</p>}
        </div>
        <button type="submit" className={btnSky}><ManageSearch className="h-4 w-4" aria-hidden="true" />Check Status</button>
      </form>
    </section>
  )
}

function CopyrightCard() {
  return (
    <section aria-labelledby="j4-cr-h" className={card}>
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 id="j4-cr-h" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700"><Draw className="h-5 w-5" aria-hidden="true" />Copyright Agreement</h2>
        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-700">{journal.licence.name}</span>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-600">Authors keep their copyright. If your paper is accepted you sign the Author Guarantee &amp; Publishing Rights form online, after an email code check.</p>
      <AppLink to={paths.policy('copyright-licensing')} className="flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:min-h-0">
        <EditDocument className="h-4 w-4 text-sky-600" aria-hidden="true" />Read Copyright &amp; Licensing
      </AppLink>
    </section>
  )
}

function DoiCard() {
  const id = useId()
  const [doi, setDoi] = useState('')
  const [err, setErr] = useState('')
  const go = (e: FormEvent) => {
    e.preventDefault()
    const d = doi.trim().replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    if (!/^10\.\d{4,9}\/\S+$/.test(d)) { setErr(`Enter a DOI such as ${journal.doiPrefix}/ijecm.2026.00001.`); return }
    setErr('')
    window.open(`https://search.crossref.org/?q=${encodeURIComponent(d)}`, '_blank', 'noopener,noreferrer')
  }
  return (
    <section aria-labelledby="j4-doi-h" className={card}>
      <div className="mb-2 flex items-center gap-2"><FingerprintIcon className="h-5 w-5 text-sky-600" aria-hidden="true" /><h2 id="j4-doi-h" className="font-serif4 text-sm font-bold text-[#0b2545]">Crossref DOI Lookup</h2></div>
      <p className="mb-3 text-xs text-slate-600">Validate direct metadata and the indexed citation record.</p>
      <form onSubmit={go} noValidate className="space-y-2">
        <label htmlFor={`${id}-d`} className="sr-only">DOI</label>
        <input id={`${id}-d`} value={doi} onChange={(e) => setDoi(e.target.value)} placeholder={`${journal.doiPrefix}/ijecm.2026.xxxxx`} autoComplete="off" aria-invalid={!!err} aria-describedby={err ? `${id}-e` : undefined} className={cx(inputCls, 'font-mono')} />
        {err && <p id={`${id}-e`} role="alert" className="text-xs font-medium text-red-700">{err}</p>}
        <button type="submit" className={btnSky}><SearchIcon className="h-4 w-4" aria-hidden="true" />Verify DOI Record</button>
      </form>
    </section>
  )
}

function FactsCard({ home }: { home: HomeData | null }) {
  const rows: [string, string, string][] = [
    ['ISSN (Online)', journal.issnOnline, 'rounded border border-sky-100 bg-sky-50 px-2 py-0.5 font-bold text-sky-700'],
    ['Frequency', journal.frequency, 'rounded border border-sky-100 bg-sky-50 px-2 py-0.5 font-bold text-sky-700'],
    ['Licence', journal.licence.name, 'font-semibold text-emerald-700'],
    ['DOI Prefix', journal.doiPrefix, 'rounded bg-sky-50 px-1.5 py-0.5 font-bold text-sky-800'],
    ...(home ? [['First Editorial Decision', `~${home.callForPapers.avgReviewDays} Days`, 'font-medium text-slate-800'] as [string, string, string]] : []),
  ]
  return (
    <section aria-labelledby="j4-facts-h" className={card}>
      <div className="mb-3 border-b border-slate-100 pb-2">
        <h2 id="j4-facts-h" className="font-serif4 text-sm font-bold text-[#0b2545]">Journal Metrics</h2>
        <p className="text-[11px] text-slate-600">Facts from the journal&rsquo;s published policies</p>
      </div>
      <dl className="space-y-2.5 text-xs">
        {rows.map(([k, v, cls], i) => (
          <div key={k} className={cx('flex items-center justify-between', i < rows.length - 1 && 'border-b border-slate-100 pb-1.5')}>
            <dt className="text-slate-600">{k}</dt><dd className={cx('font-mono', cls)}>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function TemplatesCard() {
  const row = 'flex min-h-[44px] items-center justify-between gap-2 rounded border border-slate-200 bg-slate-50/60 p-2.5 text-xs transition-colors hover:border-sky-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:min-h-0'
  return (
    <section aria-labelledby="j4-tpl-h" id="template-download" className={card}>
      <HeadSimple icon={<DownloadOffline className="h-5 w-5" />} title="Manuscript Templates" id="j4-tpl-h" />
      <p className="mb-3 text-xs text-slate-600">Prepare your submission using the official {journal.shortName} formatting guidelines and stylesheet files.</p>
      <div className="space-y-2">
        <AppLink to={paths.forAuthors('templates')} className={row}><span className="flex items-center gap-2 font-medium text-slate-700"><Description className="h-4 w-4 text-blue-600" aria-hidden="true" />Manuscript Template</span><span className="font-mono text-[11px] text-slate-600">View</span></AppLink>
        <AppLink to={paths.policy('author-guidelines')} className={row}><span className="flex items-center gap-2 font-medium text-slate-700"><FolderZip className="h-4 w-4 text-emerald-600" aria-hidden="true" />Author Guidelines</span><span className="font-mono text-[11px] text-slate-600">View</span></AppLink>
      </div>
    </section>
  )
}

function LicenceCard() {
  return (
    <section aria-labelledby="j4-lic-h" className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 text-xs shadow-sm">
      <div className="flex items-center gap-2"><Copyright className="h-4 w-4 text-slate-700" aria-hidden="true" /><h2 id="j4-lic-h" className="text-[11px] font-bold uppercase tracking-wide text-slate-800">Creative Commons Licensing</h2></div>
      <p className="text-[11px] leading-relaxed text-slate-700">All {journal.shortName} research articles are published under the open access <strong>Creative Commons Attribution 4.0 International License ({journal.licence.name})</strong>, permitting unrestricted reuse with proper scholarly citation.</p>
      <div className="flex items-center gap-2 pt-1">
        <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">CC</span>
        <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">BY</span>
        <AppLink to={paths.policy('open-access')} className="ml-auto text-[11px] font-medium text-sky-700 hover:underline">View License Rights</AppLink>
      </div>
    </section>
  )
}

export function SubmitAside({ hideTrack = false, children }: { hideTrack?: boolean; children?: ReactNode }) {
  const [home, setHome] = useState<HomeData | null>(null)
  useEffect(() => {
    let live = true
    api.getHome().then((h) => { if (live) setHome(h) }).catch(() => undefined)
    return () => { live = false }
  }, [])
  return (
    <aside aria-label="Submission help and journal information" className="min-w-0 space-y-6">
      {children}
      <RecentCard home={home} />
      <CfpCard home={home} />
      <AnnouncementsCard home={home} />
      {!hideTrack && <TrackCard />}
      <CopyrightCard />
      <DoiCard />
      <FactsCard home={home} />
      <TemplatesCard />
      <LicenceCard />
    </aside>
  )
}
