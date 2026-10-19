import { AnnouncementsFeed } from '../AnnouncementsFeedJ4'
// Journal 4 right sidebar for static pages, replicating the reference's card stack: Call for Papers, Announcements, Track Manuscript Status,
// Copyright Agreement, DOI lookup, Journal Metrics, Recent Submissions, Manuscript Templates, Become an Editorial Member, Creative Commons licensing.
// All values come from the journal config and mock data; nothing is invented (no impact factor, acceptance rate or index claims).
import { useEffect, useId, useState, type FormEvent, type ReactNode } from 'react'
import { MdOutlineCampaign as Megaphone, MdOutlineEdit as Pen, MdOutlineBolt as Bolt, MdOutlineSearch as Lens, MdOutlineDescription as Doc, MdOutlineGroupAdd as GroupAdd, MdOutlineVerified as Shield, MdOutlineArrowForward as Arrow, MdOutlineInfo as Info, MdOutlineHistory as Hist } from 'react-icons/md'
import { api } from '../../../../core/api'
import { journal } from '../../../../config/journals'
import { paths, staticPath } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink, useRouter } from '../../../../core/router'
import type { HomeData, StaticPageData } from '../../../../core/types'
import { cx } from '../primitives'
import { ScrollLoopJ4 } from '../ScrollLoopJ4'
import { TrackCardJ4 } from '../TrackCardJ4'

const CARD = 'space-y-3.5 rounded-[12px] border border-slate-200/80 bg-white p-5 shadow-hair'
const HEAD = 'flex items-center justify-between gap-2 border-b border-slate-100 pb-2'
const KICK = 'text-[11px] font-bold uppercase tracking-wider'
const INPUT = 'w-full rounded border border-slate-300 bg-slate-50/50 px-3 py-2.5 text-xs text-abyss-900 placeholder:text-slate-500 focus:border-azure-600 focus:outline-none focus:ring-1 focus:ring-azure-600 lg:py-1.5'
const BTN = 'inline-flex w-full items-center justify-center gap-1.5 rounded bg-cobalt-700 py-2.5 text-xs font-semibold text-white shadow-hair transition-all hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-2 lg:py-2'

const when = (iso: string) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function Card({ label, children, className }: { label: string; children: ReactNode; className?: string }) {
  return <section aria-label={label} className={cx(CARD, className)}>{children}</section>
}

function CallForPapers() {
  const ni = journal.nextIssue
  const [vol, month] = ni.label.split(/\s+[—–-]\s+/)
  const short = (vol ?? '').replace(/Volume\s+(\d+),\s*Issue\s+(\d+)/i, 'Vol $1 • Iss $2')
  const row = 'flex items-center justify-between gap-2 text-slate-700'
  return (
    <Card label="Call for papers" className="border-sky-100">
      <div className={HEAD}>
        <h2 className={cx(KICK, 'flex items-center gap-1.5 text-cobalt-700')}><Megaphone className="h-4 w-4" aria-hidden="true" />Call for papers</h2>
        <span className="rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-800">{short}</span>
      </div>
      <div>
        <p className="font-serif4 text-sm font-bold leading-snug text-[#0b2545]">{(vol ?? ni.label).replace(/,\s*/, ' • ')}</p>
        {month && <p className="mt-0.5 text-xs font-semibold text-cobalt-700">{month} Edition</p>}
        <p className="mt-2 text-xs leading-relaxed text-slate-600">Submissions are open for the next monthly issue. Every accepted article receives a permanent DOI.</p>
      </div>
      <dl className="space-y-1.5 rounded-[8px] border border-amber-200/80 bg-amber-50/60 p-3 text-xs">
        {when(ni.deadline) && <div className={row}><dt className="text-[11px] text-slate-600">Submission Deadline:</dt><dd className="text-[11px] font-bold tabular-nums text-slate-900">{when(ni.deadline)}</dd></div>}
        <div className={row}><dt className="text-[11px] text-slate-600">First Decision Target:</dt><dd className="text-[11px] font-semibold text-emerald-800">14 days</dd></div>
        {ni.expectedPublication && <div className={row}><dt className="text-[11px] text-slate-600">Expected Publication:</dt><dd className="text-[11px] font-semibold tabular-nums text-cobalt-700">{formatDate(ni.expectedPublication)}</dd></div>}
      </dl>
      <AppLink to={paths.submit} className={BTN}><Bolt className="h-4 w-4" aria-hidden="true" />Submit Manuscript</AppLink>
    </Card>
  )
}

function Track() {
  return <TrackCardJ4 />
}
function Copyright() {
  return (
    <Card label="Copyright agreement" className="space-y-3">
      <div className={HEAD}>
        <h2 className="flex items-center gap-1.5 font-serif4 text-xs font-bold uppercase tracking-wide text-slate-800"><Pen className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Copyright Agreement</h2>
        <span className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">{journal.licence.name}</span>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-600">Authors keep their copyright. Accepted authors sign the publishing agreement online with an email OTP, from the tracking page.</p>
      <AppLink to={paths.track} className="inline-flex w-full items-center justify-center gap-1.5 rounded border border-sky-200 bg-sky-50/80 py-2.5 text-xs font-semibold text-cobalt-700 transition-colors hover:bg-sky-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-600 lg:py-2"><Pen className="h-4 w-4" aria-hidden="true" />Sign Online Form</AppLink>
    </Card>
  )
}

function DoiLookup() {
  const { navigate } = useRouter()
  const id = useId()
  const [q, setQ] = useState('')
  const submit = (e: FormEvent) => { e.preventDefault(); if (q.trim()) navigate(paths.search(q.trim())) }
  return (
    <Card label="Crossref DOI lookup" className="space-y-3">
      <div className={cx(HEAD, 'justify-start')}>
        <span aria-hidden="true" className="flex h-4 w-4 items-center justify-center rounded-full bg-sky-100"><span className="h-2 w-2 rounded-full bg-cobalt-700" /></span>
        <h2 className="font-serif4 text-xs font-bold uppercase tracking-wide text-slate-800">Crossref DOI Lookup</h2>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-600">Validate direct metadata and indexed citation record.</p>
      <form onSubmit={submit} className="space-y-2.5">
        <label htmlFor={id} className="sr-only">DOI or Manuscript ID</label>
        <input id={id} value={q} onChange={(e) => setQ(e.target.value)} placeholder={`${journal.doiPrefix}/${journal.shortName.toLowerCase()}.2026.xxxxx`} autoComplete="off" className={cx(INPUT, 'font-mono')} />
        <button type="submit" className={BTN}><Lens className="h-4 w-4" aria-hidden="true" />Verify DOI Record</button>
      </form>
    </Card>
  )
}

function Metrics() {
  const rows: [string, string, string][] = [
    ['ISSN (online)', journal.issnOnline, 'border-sky-200 bg-sky-50 font-bold text-cobalt-700 font-mono'],
    ['Frequency', journal.frequency, 'border-slate-200 bg-slate-100 font-bold text-slate-700 font-mono'],
    ['Licence', journal.licence.name, 'border-emerald-200 bg-emerald-50 font-bold text-emerald-800 font-mono'],
    ['First Editorial Decision', '14 days target', 'border-slate-200 bg-slate-50 font-semibold text-slate-800'],
    ['Peer Review Model', 'Double-blind', 'border-slate-200 bg-slate-50 font-semibold text-slate-800'],
  ]
  return (
    <Card label="Journal metrics" className="space-y-3">
      <div className="border-b border-slate-100 pb-2">
        <h2 className="font-serif4 text-xs font-bold uppercase tracking-wide text-slate-800">Journal Metrics</h2>
        <span className="mt-0.5 block text-[11px] text-slate-500">Publishing model and timelines</span>
      </div>
      <dl className="space-y-2 text-xs">
        {rows.map(([k, v, c], n) => (
          <div key={k} className={cx('flex items-center justify-between gap-2', n < rows.length - 1 && 'border-b border-slate-50 pb-1.5')}>
            <dt className="text-[11px] text-slate-600">{k}</dt>
            <dd className={cx('rounded border px-2 py-0.5 text-[11px] tabular-nums', c)}>{v}</dd>
          </div>
        ))}
      </dl>
    </Card>
  )
}

const CHIPS = ['border-sky-200 bg-sky-50 text-sky-800', 'border-amber-200 bg-amber-50 text-amber-900', 'border-purple-200 bg-purple-50 text-purple-900', 'border-teal-200 bg-teal-50 text-teal-900']
function Recent() {
  const [items, setItems] = useState<HomeData['recentSubmissions']>([])
  useEffect(() => {
    let live = true
    api.getHome().then((h) => { if (live) setItems(h.recentSubmissions ?? []) }).catch(() => undefined)
    return () => { live = false }
  }, [])
  if (!items.length) return null
  const shown = items.slice(0, 4)
  return (
    <Card label="Recent submissions" className="space-y-3">
      <div className={HEAD}>
        <h2 className="flex items-center gap-1.5 font-serif4 text-xs font-bold uppercase tracking-wide text-slate-800"><Hist className="h-4 w-4 text-emerald-700" aria-hidden="true" />Recent Submissions</h2>
        <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">{shown.length} Recent</span>
      </div>
      <ScrollLoopJ4 count={shown.length}>
        {shown.map((s, n) => (
          <li key={`${s.title ?? s.subject}-${s.minutes}`} className={cx(n < shown.length - 1 && 'border-b border-slate-100 pb-2.5')}>
            <div className="mb-0.5 flex items-center justify-between gap-2 text-[11px]">
              <span className="min-w-0 font-semibold text-cobalt-700">{s.institution}</span>
            </div>
            <p className="text-xs font-medium text-slate-800">{s.title ?? s.subject}</p>
            <div className="mt-1.5"><span className={cx('inline-flex items-center rounded border px-1.5 py-0.5 text-[11px]', CHIPS[n % CHIPS.length])}>{s.subject}</span></div>
          </li>
        ))}
      </ScrollLoopJ4>
    </Card>
  )
}

function Templates() {
  const link = 'flex items-center justify-between rounded-[8px] border border-slate-200 bg-slate-50 p-2 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-600'
  return (
    <Card label="Manuscript templates" className="space-y-3">
      <div className={cx(HEAD, 'justify-start')}>
        <Doc className="h-4 w-4 text-cobalt-700" aria-hidden="true" />
        <h2 className="font-serif4 text-xs font-bold uppercase tracking-wide text-slate-800">Manuscript Templates</h2>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-600">Prepare your submission using the official {journal.shortName} formatting guidelines and stylesheet files.</p>
      <div className="space-y-2 text-xs">
        <AppLink to={paths.forAuthors('templates')} className={link}><span className="flex items-center gap-2 font-medium text-slate-700"><Doc className="h-4 w-4 text-blue-700" aria-hidden="true" />Microsoft Word template</span><span className="font-mono text-[11px] text-slate-500">DOCX</span></AppLink>
        <AppLink to={paths.forAuthors('templates')} className={link}><span className="flex items-center gap-2 font-medium text-slate-700"><Doc className="h-4 w-4 text-emerald-700" aria-hidden="true" />LaTeX template</span><span className="font-mono text-[11px] text-slate-500">LaTeX</span></AppLink>
      </div>
    </Card>
  )
}

function Editorial() {
  const items = ['Reviewer certificate with a QR code anyone can verify', 'Recognition on the editorial and reviewer pages', 'A direct role in structured peer review']
  return (
    <Card label="Become an editorial member" className="space-y-3">
      <div className={HEAD}>
        <h2 className={cx(KICK, 'flex items-center gap-1.5 text-cobalt-700')}><GroupAdd className="h-4 w-4" aria-hidden="true" />Become a reviewer</h2>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">Open Call</span>
      </div>
      <div className="relative overflow-hidden rounded-[8px] border border-slate-200 bg-slate-900">
        <div aria-hidden="true" className="grid grid-cols-4 gap-0.5 bg-white"><img src="/shared/portraits/women-12.jpg" alt="" loading="lazy" className="h-32 w-full object-cover object-top" /><img src="/shared/portraits/men-8.jpg" alt="" loading="lazy" className="h-32 w-full object-cover object-top" /><img src="/shared/portraits/women-31.jpg" alt="" loading="lazy" className="h-32 w-full object-cover object-top" /><img src="/shared/portraits/men-27.jpg" alt="" loading="lazy" className="h-32 w-full object-cover object-top" /></div>
        <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/80 px-2 py-1 text-[11px] font-medium text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-teal-400" />Join our reviewer panel</span>
      </div>
      <p className="text-xs leading-relaxed text-slate-600">Researchers and practising engineers with published work are invited to join the {journal.shortName} reviewer panel.</p>
      <ul className="space-y-2 text-xs font-medium text-slate-700">
        {items.map((t, n) => <li key={t} className="flex items-center gap-2">{n === 0 ? <Shield className="h-4 w-4 shrink-0 text-cobalt-700" aria-hidden="true" /> : n === 1 ? <GroupAdd className="h-4 w-4 shrink-0 text-cobalt-700" aria-hidden="true" /> : <Info className="h-4 w-4 shrink-0 text-cobalt-700" aria-hidden="true" />}{t}</li>)}
      </ul>
      <AppLink to={paths.forAuthors('become-a-reviewer')} className={cx(BTN, 'gap-2 rounded-[8px] px-4')}><GroupAdd className="h-4 w-4" aria-hidden="true" />Apply as Reviewer <Arrow className="h-4 w-4" aria-hidden="true" /></AppLink>
    </Card>
  )
}

function Licensing() {
  return (
    <Card label="Creative Commons licensing" className="space-y-3">
      <div className={cx(HEAD, 'justify-start')}>
        <Info className="h-4 w-4 text-slate-600" aria-hidden="true" />
        <h2 className="font-serif4 text-xs font-bold uppercase tracking-wide text-slate-800">Creative Commons Licensing</h2>
      </div>
      <p className="text-[11px] leading-relaxed text-slate-600">All {journal.shortName} research articles are published under the open access <strong>Creative Commons Attribution 4.0 International License ({journal.licence.name})</strong>, permitting unrestricted reuse with proper scholarly citation.</p>
      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs">
        <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-slate-700"><span className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5">CC</span><span className="rounded border border-slate-300 bg-slate-50 px-1.5 py-0.5">BY</span></div>
        <a href={journal.licence.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-cobalt-700 hover:underline">View License Rights<span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    </Card>
  )
}

/** Navigation among the pages of the current group: kept below the reference cards so readers can still move between policies. */
function MorePages({ page, sidebar, related, groupLabel }: { page: StaticPageData; sidebar: StaticPageData[]; related: StaticPageData[]; groupLabel: string }) {
  return (
    <>
      {sidebar.length > 1 && (
        <nav aria-label={`${groupLabel} pages`} className={cx(CARD, 'space-y-0')}>
          <h2 className={cx(HEAD, KICK, 'text-slate-800')}>More in {groupLabel}</h2>
          <ul className="mt-2 max-h-[22rem] space-y-0.5 overflow-y-auto pr-1">
            {sidebar.map((p) => {
              const on = p.slug === page.slug
              return (
                <li key={p.slug}>
                  <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                    className={cx('block min-h-[44px] border-l-[3px] px-3 py-2.5 text-xs leading-snug lg:min-h-0 lg:py-1.5', on ? 'border-azure-600 bg-sky-50 font-semibold text-slate-900' : 'border-transparent text-slate-700 hover:border-slate-300 hover:bg-slate-50')}>{p.title}</AppLink>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
      {related.length > 0 && (
        <nav aria-label="Related policies" className={CARD}>
          <h2 className={cx(HEAD, KICK, 'text-slate-800')}>Related pages</h2>
          <ul className="space-y-1">{related.map((r) => <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="flex min-h-[44px] items-center justify-between gap-2 py-1.5 text-xs font-medium text-cobalt-700 hover:underline lg:min-h-0">{r.title}<Arrow className="h-4 w-4 shrink-0" aria-hidden="true" /></AppLink></li>)}</ul>
        </nav>
      )}
    </>
  )
}

export function RightRail(props: { page: StaticPageData; sidebar: StaticPageData[]; related: StaticPageData[]; groupLabel: string }) {
  return (
    <aside aria-label="Journal information" className="min-w-0 space-y-6 print:hidden">
      <CallForPapers />
      <AnnouncementsFeed />
      <Track />
      <Copyright />
      <DoiLookup />
      <Metrics />
      <Recent />
      <Templates />
      <Editorial />
      <Licensing />
      <MorePages {...props} />
    </aside>
  )
}

