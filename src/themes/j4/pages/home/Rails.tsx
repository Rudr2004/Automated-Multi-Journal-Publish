import { AnnouncementsFeed } from '../../components/AnnouncementsFeedJ4'
// Home right sidebar, as in the reference, in the reference's order: Call for Papers, Announcements (carousel), Track Manuscript Status, Copyright Agreement,
// DOI lookup, Journal Metrics, a recent-activity stream, Manuscript Templates, Become a Reviewer and the Creative Commons note.
// Everything is data-driven from the journal config and mock data; where the reference shows a figure the journal does not have, the card keeps its layout and shows a supported fact instead.
import { useId, useState, type ComponentType, type FormEvent } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink, useRouter } from '../../../../core/router'
import type { ArticleSummary, CallForPapers, IssueSummary } from '../../../../core/types'
import { ButtonLink } from '../../components/Button'
import { cx } from '../../components/primitives'
import { Assignment, Badge, Campaign, Copyright, Description, DownloadOffline, Draw, Fingerprint, FolderZip, Group, Loyalty, Pending, PersonAdd, RateReview, Search, Send, Stream, Verified } from '../../components/refIconsJ4'
import { useSearchApi } from '../../components/searchContext'
import { ScrollLoopJ4 } from '../../components/ScrollLoopJ4'
import { TrackCardJ4 } from '../../components/TrackCardJ4'
import type { IconProps } from '../../icons'
import { splitIssueName } from './Hero'
import { Box } from './parts'
import { idExample } from '../../../../core/lib/manuscriptId'

const card = 'p-5'

const monoTag = (t: string, cls = 'bg-slate-100 text-slate-600') => <span className={cx('rounded px-1.5 py-0.5 font-mono text-[10px]', cls)}>{t}</span>
const longDate = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
const field = 'block w-full rounded border border-slate-300 bg-slate-50 px-3 py-1.5 font-mono text-xs text-slate-900 placeholder:text-slate-500 focus:border-azure-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-azure-600/20 focus-visible:!outline-none'
const solid = 'flex w-full items-center justify-center gap-1.5 rounded bg-cobalt-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-cobalt-800'

function CallForPapersCard({ cfp }: { cfp: CallForPapers }) {
  const [issueName, month] = splitIssueName(cfp.issueName)
  const short = issueName.replace('Volume ', 'Vol ').replace('Issue ', 'Iss ')
  const rows: [string, string, string?][] = [
    ['Submission Deadline:', longDate(cfp.deadline)],
    ['First Decision:', '24 Hours', 'text-emerald-700'],
    ['Expected Publication:', '24-48 Hours', 'text-sky-800'],
  ]
  return (
    <Box aria-labelledby="j4-side-cfp" className={cx(card, '!border-[#bfdbfe]')}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <h2 id="j4-side-cfp" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cobalt-700"><Campaign className="h-4 w-4" aria-hidden="true" />Call for Papers</h2>
        <span className="rounded bg-sky-100 px-2 py-0.5 font-mono text-[10px] font-bold text-cobalt-800">{short}</span>
      </div>
      <div className="mt-3 space-y-2">
        <p className="font-serif4 text-base font-extrabold leading-tight text-[#0b2545]">{issueName}</p>
        {month && <p className="text-xs font-bold text-cobalt-700">{month} Edition</p>}
        <p className="text-xs leading-normal text-slate-600">Submissions invited for the next regular issue. Topics span engineering research and engineering management.</p>
        <dl className="space-y-1.5 rounded-[8px] border border-amber-200 bg-amber-50 p-2.5 text-xs">
          {rows.map(([k, v, tone], i) => (
            <div key={k} className={cx('flex items-center justify-between gap-2', i === 0 ? 'font-semibold text-amber-950' : 'text-[11px] text-amber-900')}>
              <dt className={i === 0 ? 'text-slate-700' : 'text-slate-600'}>{k}</dt>
              <dd className={cx('font-bold', tone)}>{v}</dd>
            </div>
          ))}
        </dl>
        <ButtonLink to={paths.submit} variant="cta" className="w-full !rounded !px-3 !py-2 !text-xs"><Send className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
      </div>
    </Box>
  )
}


/** DOI / Manuscript ID lookup: a DOI or Manuscript ID opens the article directly; anything else runs an archive search. */
function DoiLookup() {
  const { onSuggest } = useSearchApi()
  const { navigate } = useRouter()
  const id = useId()
  const [q, setQ] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const run = async (e: FormEvent) => {
    e.preventDefault()
    const t = q.trim()
    if (!t) { setErr('Enter a DOI or Manuscript ID.'); return }
    setErr(''); setBusy(true)
    try {
      const d = await onSuggest(t)
      if (d.direct?.article) navigate(paths.article(d.direct.paperId))
      else if (d.direct) setErr(`${d.direct.paperId} is not a published article. Check the ID, or track it if it is a submission.`)
      else navigate(paths.search(t))
    } catch { navigate(paths.search(t)) } finally { setBusy(false) }
  }
  return (
    <Box aria-labelledby={`${id}-h`} className={card}>
      <div className="mb-2 flex items-center gap-2"><Fingerprint className="h-[18px] w-[18px] text-azure-600" aria-hidden="true" /><h2 id={`${id}-h`} className="font-serif4 text-sm font-bold text-[#0b2545]">Crossref DOI Lookup</h2></div>
      <p className="mb-3 text-xs text-slate-500">Validate direct metadata and the indexed citation record for any {journal.shortName} article.</p>
      <form onSubmit={run} noValidate className="space-y-2">
        <label htmlFor={`${id}-q`} className="sr-only">DOI or Manuscript ID</label>
        <input id={`${id}-q`} value={q} onChange={(e) => setQ(e.target.value)} placeholder={`${journal.doiPrefix}/${idExample}`} autoComplete="off" aria-invalid={!!err} aria-describedby={err ? `${id}-e` : undefined} className={field} />
        {err && <p id={`${id}-e`} role="alert" className="text-xs font-medium text-red-700">{err}</p>}
        <button type="submit" disabled={busy} className={cx(solid, 'disabled:opacity-60')}><Search className="h-4 w-4" aria-hidden="true" />{busy ? 'Checking…' : 'Verify DOI Record'}</button>
      </form>
    </Box>
  )
}

const STREAM = [
  { tone: 'text-sky-700', chip: 'bg-sky-50 border-sky-100' }, { tone: 'text-amber-700', chip: 'bg-amber-50 border-amber-100' },
  { tone: 'text-purple-700', chip: 'bg-purple-50 border-purple-100' }, { tone: 'text-emerald-700', chip: 'bg-emerald-50 border-emerald-100' },
]

const TEMPLATES: [string, string, string, ComponentType<IconProps>, string][] = [
  ['Manuscript Template', 'Word and LaTeX', paths.forAuthors('templates'), Description, 'text-blue-600'],
  ['Sample Certificate', 'PDF', '', Assignment, 'text-emerald-600'],
  ['Sample Acceptance', 'PDF', '', FolderZip, 'text-amber-600'],
]

import { useToast } from '../../components/Toast'

export function RightRail({ notices, cfp, issue, articles }: { notices: { date: string; text: string }[]; cfp: CallForPapers; issue: IssueSummary; articles: ArticleSummary[] }) {
  const toast = useToast()
  const sum = (k: 'views' | 'downloads' | 'citations') => articles.reduce((t, a) => t + a[k], 0)
  const metrics: { k: string; v: string; cls: string }[] = [
    { k: 'ISSN', v: journal.issnOnline, cls: 'rounded border border-sky-100 bg-sky-50 px-2 py-0.5 font-bold text-cobalt-700' },
    { k: 'Views, Current Issue', v: formatNumber(sum('views')), cls: 'rounded border border-sky-100 bg-sky-50 px-2 py-0.5 font-bold text-cobalt-700' },
    { k: 'Downloads, Current Issue', v: formatNumber(sum('downloads')), cls: 'font-semibold text-emerald-700' },
    { k: 'Citations, Current Issue', v: formatNumber(sum('citations')), cls: 'rounded bg-sky-50 px-1.5 py-0.5 font-bold text-sky-800' },
    { k: 'First Editorial Decision', v: '24 Hours', cls: 'font-medium text-slate-800' },
  ]
  return (
    <aside aria-label="Author tools and journal information" className="min-w-0 space-y-6">
      <CallForPapersCard cfp={cfp} />
      <AnnouncementsFeed notices={notices} />

      <TrackCardJ4 />

      <Box id="copyright-card" aria-labelledby="j4-copyright" className={card}>
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <h2 id="j4-copyright" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cobalt-700"><Draw className="h-4 w-4" aria-hidden="true" />Copyright Agreement</h2>
          {monoTag(journal.licence.name)}
        </div>
        <p className="mb-3 text-xs leading-relaxed text-slate-600">Authors keep their copyright. Accepted authors sign the copyright form online with an email OTP, from the tracking page.</p>
        <ButtonLink to={paths.track} variant="outline" className="w-full !rounded !border-slate-300 !bg-slate-100 !px-3 !py-1.5 !text-xs !text-slate-800 hover:!bg-slate-200 hover:!text-slate-800"><Draw className="h-4 w-4 text-azure-600" aria-hidden="true" /> Sign Online Form</ButtonLink>
      </Box>

      <DoiLookup />

      <Box aria-labelledby="j4-metrics" className={card}>
        <div className="mb-3 border-b border-slate-100 pb-2"><h2 id="j4-metrics" className="font-serif4 text-sm font-bold text-[#0b2545]">Journal Metrics</h2><p className="text-[11px] text-slate-500">Current issue, Vol. {issue.volume}, Issue {issue.issue}</p></div>
        <dl className="space-y-2.5 text-xs">
          {metrics.map((m, i) => (
            <div key={m.k} className={cx('flex items-center justify-between gap-3', i < metrics.length - 1 && 'border-b border-slate-100 pb-1.5')}>
              <dt className="text-slate-600">{m.k}</dt>
              <dd className={cx('font-mono tabular-nums', m.cls)}>{m.v}</dd>
            </div>
          ))}
        </dl>
      </Box>

      {articles.length > 0 && (
        <Box aria-labelledby="j4-stream" className={card}>
          <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <h2 id="j4-stream" className="flex items-center gap-1.5 text-xs font-bold text-[#0b2545]"><Stream className="h-4 w-4 text-azure-600" aria-hidden="true" />Recent Publications</h2>
            <span className="flex items-center gap-1 rounded bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-700"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />Vol {issue.volume} • Iss {issue.issue}</span>
          </div>
          <ScrollLoopJ4 count={Math.min(4, articles.length)}>
            {articles.slice(0, 4).map((a, i) => (
              <li key={a.paperId} className={cx('space-y-1', i < 3 && 'border-b border-slate-100 pb-2.5')}>
                <AppLink to={paths.article(a.paperId)} className="block font-mono text-[11px] font-semibold text-cobalt-700 hover:underline">Paper #{a.paperId}</AppLink>
                <p className="text-[11px] font-medium leading-snug text-slate-800">{a.title}</p>
                <p className={cx('flex items-center gap-1.5 text-[10px]', STREAM[i % 4].tone)}>{i % 2 ? <Group className="h-3.5 w-3.5" aria-hidden="true" /> : <Pending className="h-3.5 w-3.5" aria-hidden="true" />}<span className={cx('rounded border px-1.5', STREAM[i % 4].chip)}>{a.subject}</span></p>
              </li>
            ))}
          </ScrollLoopJ4>
        </Box>
      )}

      <Box id="template-download" aria-labelledby="j4-templates" className={card}>
        <div className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2"><DownloadOffline className="h-[18px] w-[18px] text-azure-600" aria-hidden="true" /><h2 id="j4-templates" className="font-serif4 text-sm font-bold text-[#0b2545]">Manuscript Templates</h2></div>
        <p className="mb-3 text-xs text-slate-500">Prepare your submission using the official {journal.shortName} formatting guidelines and stylesheet files.</p>
        <ul className="space-y-2">
          {TEMPLATES.map(([t, note, to, Icon, tone]) => (
            <li key={t}>
              {to ? (
                <AppLink to={to} className="group flex items-center justify-between gap-3 rounded border border-slate-200 bg-slate-50/60 p-2.5 text-xs transition-colors hover:border-sky-300 hover:bg-white">
                  <span className="flex items-center gap-2 font-medium text-slate-700"><Icon className={cx('h-4 w-4', tone)} aria-hidden="true" />{t}</span>
                  <span className="font-mono text-[11px] text-slate-500">{note}</span>
                </AppLink>
              ) : (
                <button type="button" onClick={() => toast(`${t} downloaded (simulated).`)} className="group flex w-full items-center justify-between gap-3 rounded border border-slate-200 bg-slate-50/60 p-2.5 text-left text-xs transition-colors hover:border-sky-300 hover:bg-white">
                  <span className="flex items-center gap-2 font-medium text-slate-700"><Icon className={cx('h-4 w-4', tone)} aria-hidden="true" />{t}</span>
                  <span className="font-mono text-[11px] text-slate-500">{note}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </Box>

      <Box id="reviewer-cta" aria-labelledby="j4-reviewer" className="space-y-3 p-4 text-xs">
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
          <h2 id="j4-reviewer" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cobalt-700"><Badge className="h-4 w-4" aria-hidden="true" />Become a Reviewer</h2>
          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">Open Call</span>
        </div>
        <div className="relative overflow-hidden rounded-[8px] border border-slate-200 bg-gradient-to-br from-[#0b2545] to-[#071527]">
          <div aria-hidden="true" className="grid grid-cols-4 gap-0.5 bg-white"><img src="/shared/portraits/women-12.jpg" alt="" loading="lazy" className="h-36 w-full object-cover object-top" /><img src="/shared/portraits/men-8.jpg" alt="" loading="lazy" className="h-36 w-full object-cover object-top" /><img src="/shared/portraits/women-31.jpg" alt="" loading="lazy" className="h-36 w-full object-cover object-top" /><img src="/shared/portraits/men-27.jpg" alt="" loading="lazy" className="h-36 w-full object-cover object-top" /></div>
          <span className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-white"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" />Join the {journal.shortName} Reviewer Panel</span>
        </div>
        <p className="leading-relaxed text-slate-600">Researchers and practising engineers with published work are invited to join the {journal.shortName} reviewer panel and help shape fair, structured peer review.</p>
        <ul className="space-y-1.5 pt-1 text-slate-700">
          {([[Verified, 'Reviewer acknowledgement by the editors'], [Loyalty, 'Review within your own research areas'], [RateReview, 'A direct role in structured peer review']] as [ComponentType<IconProps>, string][]).map(([Icon, t]) => (
            <li key={t} className="flex items-center gap-2"><Icon className="h-4 w-4 shrink-0 text-azure-600" aria-hidden="true" />{t}</li>
          ))}
        </ul>
        <ButtonLink to={paths.forAuthors('become-a-reviewer')} variant="cta" className="mt-2 w-full !rounded-[6px] !px-3 !py-2 !text-xs"><PersonAdd className="h-4 w-4" aria-hidden="true" /> Apply as Reviewer →</ButtonLink>
      </Box>

      <Box className="space-y-2 p-4 text-xs">
        <div className="flex items-center gap-2"><Copyright className="h-4 w-4 text-slate-700" aria-hidden="true" /><h2 className="text-[11px] font-bold uppercase tracking-wide text-slate-800">Creative Commons Licensing</h2></div>
        <p className="text-[11px] leading-relaxed text-slate-600">All {journal.shortName} research articles are published under the open access <strong className="font-semibold text-slate-800">Creative Commons Attribution 4.0 International License ({journal.licence.name})</strong>, permitting unrestricted reuse with proper scholarly citation.</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">CC</span>
          <span className="inline-block rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">BY</span>
          <AppLink to={paths.policy('open-access')} className="ml-auto text-[11px] font-medium text-cobalt-700 hover:underline">View License Rights</AppLink>
        </div>
      </Box>
    </aside>
  )
}
