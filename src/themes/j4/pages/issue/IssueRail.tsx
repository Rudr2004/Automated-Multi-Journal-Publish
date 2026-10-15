import { AnnouncementsFeed } from '../../components/AnnouncementsFeedJ4'
// Right sidebar of the issue page. Strict replica of the reference (current issue, cover showcase), card for card and in the same order:
// Call for Papers, Announcements (pager), Track Manuscript Status, Copyright Agreement, Crossref DOI Lookup, Journal Metrics, Recent Submissions,
// Manuscript Templates, Become an Editorial Member, Creative Commons Licensing. All copy and values come from the journal config and mock data.
import { useId, useState, type FormEvent, type ReactNode } from 'react'
import {
  MdOutlineBadge as Badge, MdOutlineCampaign as Campaign, MdOutlineCopyright as Copyright,
  MdOutlineDescription as Doc, MdOutlineDownloadForOffline as Offline, MdOutlineDraw as Draw, MdOutlineEditNote as EditDoc, MdOutlineFingerprint as Finger,
  MdOutlineFolderZip as Zip, MdOutlineHowToReg as HowTo, MdOutlineManageSearch as ManageSearch, MdOutlinePriceCheck as PriceCheck, MdOutlineRateReview as Rate,
  MdOutlineSearch as SearchIcon, MdOutlineStream as Stream, MdOutlineTaskAlt as Done, MdOutlineVerified as Ver, MdOutlineSavedSearch as SavedSearch,
} from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import * as validate from '../../../../core/lib/validators'
import { AppLink, useRouter } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { ArrowRight as Arrow, Send } from '../../icons'
import { idExample } from '../../../../core/lib/manuscriptId'

const CARD = 'rounded-[12px] border bg-white p-5 shadow-hair'
const KICK = 'flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cobalt-700'
const INPUT = 'w-full rounded border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-500 focus:border-azure-600 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-600/30 min-h-11 lg:min-h-8'
const BTN = 'flex min-h-11 w-full items-center justify-center gap-1.5 rounded bg-cobalt-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-1 lg:min-h-8'
const SOFT = 'flex min-h-11 w-full items-center justify-center gap-1.5 rounded border border-slate-300 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-8'

const Head = ({ icon, title, chip, tail }: { icon: ReactNode; title: string; chip?: ReactNode; tail?: string }) => (
  <div className={`flex items-center justify-between border-b border-slate-100 pb-2 ${tail ?? 'mb-3'}`}>
    <h2 className={KICK}><span aria-hidden="true" className="text-base">{icon}</span>{title}</h2>{chip}
  </div>
)
const Title = ({ icon, title, sub }: { icon?: ReactNode; title: string; sub?: string }) => (
  <div className="mb-3 border-b border-slate-100 pb-2">
    <div className="flex items-center gap-2">{icon && <span aria-hidden="true" className="text-lg text-cobalt-700">{icon}</span>}<h2 className="font-serif4 text-sm font-bold text-[#0b2545]">{title}</h2></div>
    {sub && <p className="text-[11px] text-slate-500">{sub}</p>}
  </div>
)

/** "Volume 1, Issue 10 — October 2026" -> ["Volume 1, Issue 10", "October 2026"]. */
const splitLabel = (l: string) => { const [a, ...b] = l.split(' — '); return [a, b.join(' — ')] as const }

function CallForPapers() {
  const next = journal.nextIssue
  const [vol, month] = splitLabel(next.label)
  const short = vol.replace('Volume', 'Vol').replace(', Issue', ' • Iss')
  return (
    <section aria-label="Call for papers" className={`${CARD} border-[#bfdbfe]`}>
      <Head icon={<Campaign />} title="Call for Papers" tail="" chip={<span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-cobalt-700">{short}</span>} />
      <div className="mt-3 space-y-2">
        <p className="font-serif4 text-base font-extrabold leading-tight text-[#0b2545]">{vol.replace(', Issue', ' • Issue')}</p>
        {month && <p className="text-xs font-bold text-cobalt-700">{month} Edition</p>}
        <p className="text-xs leading-normal text-slate-600">Submissions are open for the next monthly issue. Topics span {journal.subjects.slice(0, 3).join(', ')} and related areas of engineering and management.</p>
        <dl className="space-y-1.5 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs">
          <div className="flex items-center justify-between font-semibold text-amber-950"><dt className="text-slate-700">Submission Deadline:</dt><dd className="font-bold">{formatDate(next.deadline.slice(0, 10))}</dd></div>
          <div className="flex items-center justify-between text-[11px] text-amber-900"><dt className="text-slate-600">First Decision Target:</dt><dd className="font-bold text-emerald-800">Within 14 days</dd></div>
          <div className="flex items-center justify-between text-[11px] text-amber-900"><dt className="text-slate-600">Expected Publication:</dt><dd className="font-bold text-sky-900">{formatDate(next.expectedPublication)}</dd></div>
        </dl>
        <AppLink to={paths.submit} className={BTN}><Send className="h-4 w-4" aria-hidden="true" />Submit Manuscript</AppLink>
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
    <section aria-label="Track manuscript status" id="track-manuscript-sidebar" className={`${CARD} border-slate-200`}>
      <div className="mb-2 flex items-center gap-2 border-b border-slate-100 pb-2"><span aria-hidden="true" className="text-lg text-cobalt-700"><SavedSearch /></span><h2 className="font-serif4 text-sm font-bold text-[#0b2545]">Track Manuscript Status</h2></div>
      <p className="mb-3 text-xs text-slate-500">Enter your Manuscript ID and the email you submitted with to see where your manuscript is in review.</p>
      <form onSubmit={submit} noValidate className="space-y-2.5">
        <div>
          <label htmlFor={`${id}-p`} className="mb-1 block text-[11px] font-medium text-slate-600">Manuscript ID</label>
          <input id={`${id}-p`} value={pid} onChange={(e) => setPid(e.target.value)} placeholder={`e.g. ${idExample}`} autoComplete="off" aria-invalid={!!err.pid} aria-describedby={err.pid ? `${id}-pe` : undefined} className={`${INPUT} font-mono`} />
          {err.pid && <p id={`${id}-pe`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.pid}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-m`} className="mb-1 block text-[11px] font-medium text-slate-600">Corresponding Author Email</label>
          <input id={`${id}-m`} type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="author@university.edu" autoComplete="email" aria-invalid={!!err.mail} aria-describedby={err.mail ? `${id}-me` : undefined} className={INPUT} />
          {err.mail && <p id={`${id}-me`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.mail}</p>}
        </div>
        <button type="submit" className={BTN}><ManageSearch className="h-4 w-4" aria-hidden="true" />Check Status</button>
      </form>
    </section>
  )
}

function CopyrightCard() {
  return (
    <section aria-label="Copyright agreement" id="copyright-card" className={`${CARD} border-slate-200`}>
      <Head icon={<Draw />} title="Copyright Agreement" chip={<span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">{journal.licence.name}</span>} />
      <p className="mb-3 text-xs leading-relaxed text-slate-600">Authors keep their copyright. After acceptance, sign the copyright form online from Track My Paper.</p>
      <div className="space-y-2"><AppLink to={paths.track} className={SOFT}><EditDoc className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Sign Online Form</AppLink></div>
    </section>
  )
}

function DoiLookup() {
  const { navigate } = useRouter()
  const id = useId()
  const [v, setV] = useState('')
  const go = (e: FormEvent) => { e.preventDefault(); if (v.trim()) navigate(paths.search(v.trim())) }
  return (
    <section aria-label="Crossref DOI lookup" className={`${CARD} border-slate-200`}>
      <div className="mb-2 flex items-center gap-2"><span aria-hidden="true" className="text-lg text-cobalt-700"><Finger /></span><h2 className="font-serif4 text-sm font-bold text-[#0b2545]">Crossref DOI Lookup</h2></div>
      <p className="mb-3 text-xs text-slate-500">Find an article by its DOI and open its metadata and citation record.</p>
      <form onSubmit={go} className="space-y-2">
        <label htmlFor={id} className="sr-only">DOI</label>
        <input id={id} value={v} onChange={(e) => setV(e.target.value)} placeholder={`${journal.doiPrefix}/${idExample}`} autoComplete="off" className={`${INPUT} font-mono`} />
        <button type="submit" className={BTN}><SearchIcon className="h-4 w-4" aria-hidden="true" />Verify DOI Record</button>
      </form>
    </section>
  )
}

function Metrics() {
  const row = 'flex items-center justify-between pb-1.5 border-b border-slate-100'
  return (
    <section aria-label="Journal metrics" className={`${CARD} border-slate-200`}>
      <Title title="Journal Metrics" sub="Facts published by the editorial office" />
      <dl className="space-y-2.5 text-xs">
        <div className={row}><dt className="text-slate-600">Publication Frequency</dt><dd className="rounded border border-sky-100 bg-sky-50 px-2 py-0.5 font-mono font-bold text-cobalt-700">{journal.frequency}</dd></div>
        <div className={row}><dt className="text-slate-600">ISSN (Online)</dt><dd className="rounded border border-sky-100 bg-sky-50 px-2 py-0.5 font-mono font-bold text-cobalt-700">{journal.issnOnline}</dd></div>
        <div className={row}><dt className="text-slate-600">Access Model</dt><dd className="font-mono font-semibold text-emerald-700">Open access</dd></div>
        <div className={row}><dt className="text-slate-600">First Editorial Decision</dt><dd className="rounded bg-sky-50 px-1.5 py-0.5 font-mono font-bold text-sky-800">14 days (target)</dd></div>
        <div className="flex items-center justify-between"><dt className="text-slate-600">Reviewers per Paper</dt><dd className="font-mono font-medium text-slate-800">At least two</dd></div>
      </dl>
    </section>
  )
}

function RecentSubmissions({ articles }: { articles: ArticleSummary[] }) {
  const list = articles.slice(0, 4)
  if (!list.length) return null
  return (
    <section aria-label="Recent submissions" className={`${CARD} border-slate-200`}>
      <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
        <h2 className="flex items-center gap-1.5 text-xs font-bold text-[#0b2545]"><Stream className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Recent Submissions</h2>
        <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-800"><span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500 motion-reduce:animate-none" />Published</span>
      </div>
      <ul className="space-y-3 text-xs">
        {list.map((a, k) => (
          <li key={a.paperId} className={`space-y-1 ${k < list.length - 1 ? 'border-b border-slate-100 pb-2.5' : ''}`}>
            <div className="flex items-center justify-between gap-2">
              <AppLink to={paths.article(a.paperId)} className="font-mono text-[11px] font-semibold text-cobalt-700 hover:underline">Paper #{a.paperId}</AppLink>
              <span className="shrink-0 text-[10px] text-slate-500">{formatDate(a.publishedAt)}</span>
            </div>
            <p className="text-[11px] font-medium leading-snug text-slate-800">{a.title}</p>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-800"><Done className="h-3.5 w-3.5" aria-hidden="true" /><span className="rounded border border-emerald-100 bg-emerald-50 px-1.5">Published, {a.type}</span></div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Templates() {
  const row = 'flex items-center justify-between rounded border border-slate-200 bg-slate-50/60 p-2.5 text-xs transition-colors hover:border-sky-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600'
  return (
    <section aria-label="Manuscript templates" id="template-download" className={`${CARD} border-slate-200`}>
      <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2"><span aria-hidden="true" className="text-lg text-cobalt-700"><Offline /></span><h2 className="font-serif4 text-sm font-bold text-[#0b2545]">Manuscript Templates</h2></div>
      <p className="mb-3 text-xs text-slate-500">Prepare your submission with the official {journal.shortName} templates and forms.</p>
      <div className="space-y-2">
        <AppLink to={paths.forAuthors('templates')} className={`${row} min-h-11`}><span className="flex items-center gap-2 font-medium text-slate-700"><Doc className="h-4 w-4 text-blue-600" aria-hidden="true" />Manuscript template</span><span className="font-mono text-[11px] text-slate-500">DOCX</span></AppLink>
        <AppLink to={paths.forAuthors('templates')} className={`${row} min-h-11`}><span className="flex items-center gap-2 font-medium text-slate-700"><Zip className="h-4 w-4 text-emerald-600" aria-hidden="true" />Cover letter and revision forms</span><span className="font-mono text-[11px] text-slate-500">DOCX</span></AppLink>
      </div>
    </section>
  )
}

function Editorial() {
  const perks: [typeof Ver, string][] = [[Ver, 'Review papers in your own field'], [PriceCheck, 'Clear reviewer guidelines'], [Rate, 'Reviews expected within 14 days']]
  return (
    <section aria-label="Become an editorial member" id="reviewer-cta" className={`${CARD} border-[#bfdbfe]`}>
      <Head icon={<Badge />} title="Become an Editorial Member" chip={<span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-800">Open Call</span>} />
      <div className="group relative mb-3 overflow-hidden rounded-lg border border-slate-200">
        <img src="/journals/j4/images/cta-circuit.svg" alt="" className="h-24 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-[#071527]/80 via-transparent to-transparent p-2"><span className="flex items-center gap-1 text-[10px] font-medium text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Join the {journal.shortName} reviewer panel</span></div>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-slate-600">Researchers and practising engineers or managers with publication experience are invited to apply as reviewers for {journal.shortName}.</p>
      <ul className="mb-4 space-y-1.5 text-xs">{perks.map(([I, t]) => <li key={t} className="flex items-center gap-2 text-slate-700"><I className="h-3.5 w-3.5 text-cobalt-700" aria-hidden="true" />{t}</li>)}</ul>
      <AppLink to={paths.forAuthors('become-a-reviewer')} className={BTN}><HowTo className="h-4 w-4" aria-hidden="true" />Apply to Review<Arrow className="h-3.5 w-3.5" aria-hidden="true" /></AppLink>
    </section>
  )
}

function Licence() {
  const chip = 'inline-block rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700'
  return (
    <section aria-label="Creative Commons licensing" className="space-y-2 rounded-[12px] border border-slate-200 bg-white p-4 text-xs shadow-hair">
      <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-800"><Copyright className="h-4 w-4 text-slate-700" aria-hidden="true" />Creative Commons Licensing</h2>
      <p className="text-[11px] leading-relaxed text-slate-600">All {journal.shortName} research articles are published under the open access <strong>Creative Commons Attribution 4.0 International License ({journal.licence.name})</strong>, permitting reuse with proper scholarly citation.</p>
      <div className="flex items-center gap-2 pt-1"><span className={chip}>CC</span><span className={chip}>BY</span><AppLink to={paths.policy('copyright-licensing')} className="ml-auto text-[11px] font-medium text-cobalt-700 hover:underline">View License Rights</AppLink></div>
    </section>
  )
}

export function IssueRail({ articles = [] }: { articles?: ArticleSummary[] }) {
  return (
    <aside aria-label="Issue sidebar" className="min-w-0 space-y-6 lg:col-span-4">
      <CallForPapers />
      <AnnouncementsFeed />
      <TrackCard />
      <CopyrightCard />
      <DoiLookup />
      <Metrics />
      <RecentSubmissions articles={articles} />
      <Templates />
      <Editorial />
      <Licence />
    </aside>
  )
}
