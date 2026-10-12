// Home right sidebar (4 columns), card for card as in the reference: Call for Papers banner, Indexing & Archiving (vertical scroller),
// Notifications & Alerts (horizontal scroller), a rotating updates ticker, Track Paper Status form, two shortcut buttons, Author Downloads,
// Crossref DOI card, Call for Reviewers and the CC BY notice. Content comes from the journal config and the home data; no activity or membership is invented.
import { useEffect, useId, useMemo, useState, type FormEvent } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import * as validate from '../../../../core/lib/validators'
import { AppLink, useRouter } from '../../../../core/router'
import type { CallForPapers } from '../../../../core/types'
import { CountUpJ5 } from '../../components/CountUpJ5'
import { Article, DownloadForOffline, FindInPage, Fingerprint, Autorenew, Megaphone, NotificationImportant, School, VerifiedUser, Description, Groups, Rights } from '../../components/homeIconsJ5'
import { cx } from '../../components/primitives'
import { ArrowRight, Award, OpenAccess, Send, Verified } from '../../icons'

const card = 'rounded border border-[#dcc0be] bg-white p-5 shadow-sm'
const head = 'mb-3 flex items-center justify-between gap-2 border-b border-obsidian-200 pb-2'
const h4 = 'font-work text-xs font-bold uppercase tracking-wider text-[#141b2b]'
const input = 'w-full rounded border border-[#dcc0be] bg-[#f4f5fc] px-3 py-2 font-work text-xs text-[#141b2b] placeholder:text-obsidian-500 focus:border-wine-800 focus:outline-none'
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function CallBanner({ cfp }: { cfp: CallForPapers }) {
  const [issueName, issueMonth] = cfp.issueName.split(' — ')
  const rows: [string, string, string][] = [
    ['Submission Deadline:', formatDate(cfp.deadline.slice(0, 10)), 'font-bold text-wine-800'],
    ['First Decision Target:', `About ${cfp.avgReviewDays} days`, 'font-medium text-[#141b2b]'],
    ['Expected Publication:', formatDate(cfp.expectedPublication), 'font-medium text-[#141b2b]'],
    ['Publication:', `${journal.frequency} (Online)`, 'font-medium text-[#9b4500]'],
    ['Crossref DOI Prefix:', journal.doiPrefix, 'font-mono font-bold text-wine-800'],
  ]
  return (
    <section aria-labelledby="j5-cfp" className="rounded border-2 border-wine-800 bg-white p-5 shadow-sm">
      <div aria-hidden="true" className="j5-double-rule mb-2.5" />
      <div className="mb-2 flex items-center gap-2 text-wine-800"><NotificationImportant className="h-5 w-5" aria-hidden="true" /><span className={h4}>Call for Papers{issueMonth ? ` • ${issueMonth.split(' ')[0].slice(0, 3)} ${issueMonth.split(' ')[1] ?? ''}` : ''}</span></div>
      <h2 id="j5-cfp" className="mb-2 font-newsreader text-base font-semibold text-[#141b2b]">{issueName}</h2>
      <p className="mb-4 font-work text-xs leading-relaxed text-[#564241]">Submit original manuscripts for the next monthly issue. Submissions are peer-reviewed on a rolling basis.</p>
      <dl className="mb-4 space-y-1.5 rounded border border-[#dcc0be] bg-[#f4f5fc] p-3 font-work text-xs">
        {rows.map(([k, v, cls], i) => <div key={k} className={cx('flex items-center justify-between gap-3', i > 0 && 'border-t border-[#dcc0be]/60 pt-1.5')}><dt className="text-[#564241]">{k}</dt><dd className={cls}>{v}</dd></div>)}
      </dl>
      <AppLink to={paths.submit} className="inline-flex w-full items-center justify-center gap-1.5 rounded bg-wine-800 px-4 py-2.5 font-work text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-bordeaux-900"><Send className="h-4 w-4" aria-hidden="true" /><span>Submit via Portal</span></AppLink>
    </section>
  )
}

function Indexing() {
  const logos = visibleLogos()
  if (!logos.length) return null
  const scroll = logos.length >= 5
  const tile = (l: (typeof logos)[number], i: number) => (
    <li key={`${l.id}-${i}`}>
      <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="flex h-12 items-center justify-center gap-3 rounded border border-[#dcc0be] bg-white p-2.5 shadow-sm transition hover:border-wine-800">
        {l.file ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="h-5 max-w-[120px] w-auto object-contain" /> : null}
        <span className="font-work text-xs font-bold text-[#141b2b]">{l.name}</span>
        <span className="sr-only"> ({l.status}; opens in a new tab)</span>
      </a>
    </li>
  )
  return (
    <section aria-labelledby="j5-index" className={card}>
      <div className={head}>
        <div className="flex items-center gap-1.5"><VerifiedUser className="h-[18px] w-[18px] text-[#9b4500]" aria-hidden="true" /><h2 id="j5-index" className={h4}>Indexing &amp; Archiving</h2></div>
        <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-100 px-2 py-0.5 font-work text-[10px] font-bold uppercase tracking-wider text-emerald-800"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-600" /><CountUpJ5 value={`${logos.length} Active`} /></span>
      </div>
      <p className="mb-3 font-work text-xs leading-relaxed text-[#564241]">Active listings only. Each link opens the service so a reader can verify the journal there:</p>
      <div className={cx('relative overflow-hidden rounded border border-[#dcc0be] bg-[#f4f5fc] p-2.5', scroll && 'h-72')}>
        <div className={scroll ? 'j5-vscroll' : undefined}>
          <ul className="space-y-2.5">{logos.map(tile)}</ul>
          {scroll && <ul aria-hidden="true" className="j5-dup mt-2.5 space-y-2.5">{logos.map((l, i) => tile(l, i + logos.length))}</ul>}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-obsidian-200 pt-2.5 font-work text-[11px] text-[#564241]">
        <span className="flex items-center gap-1"><Autorenew className="h-[13px] w-[13px] text-[#9b4500]" aria-hidden="true" />Crossref DOI on every article</span>
        {scroll && <span className="italic text-obsidian-500">Hover to pause</span>}
      </div>
    </section>
  )
}

const ART = ['card-ethics', 'card-review', 'card-guidelines', 'card-perspective']
function Alerts({ notices }: { notices: { date: string; text: string }[] }) {
  const items = useMemo(() => [
    ...journal.announcements.map((a) => ({ chip: a.id === 'doi' ? 'Indexing & DOI' : 'Call for Papers', chipCls: a.id === 'doi' ? 'bg-[#9b4500] text-white' : 'bg-emerald-700 text-white', title: a.id === 'doi' ? `Crossref DOI ${journal.doiPrefix}` : a.text, text: a.id === 'doi' ? a.text : `Submission deadline ${formatDate(journal.nextIssue.deadline.slice(0, 10))}.`, to: a.to })),
    ...notices.slice(0, 3).map((n) => ({ chip: 'Journal Notice', chipCls: 'bg-wine-800 text-white', title: formatDate(n.date), text: n.text, to: undefined as string | undefined })),
  ], [notices])
  const cardEl = (it: (typeof items)[number], i: number, dup: boolean) => (
    <div key={`${i}-${dup}`} className="w-72 shrink-0 rounded border border-[#dcc0be] bg-[#f4f5fc] p-3 shadow-sm">
      <div className="relative mb-2.5 h-28 overflow-hidden rounded">
        <img src={`/journals/j5/images/${ART[i % ART.length]}.svg`} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className={cx('absolute left-2 top-2 rounded px-2 py-0.5 font-work text-[10px] font-bold uppercase tracking-wider shadow', it.chipCls)}>{it.chip}</span>
      </div>
      <h3 className="mb-1 font-newsreader text-sm font-bold text-[#141b2b]">{it.to && !dup ? <AppLink to={it.to} className="hover:text-wine-800">{it.title}</AppLink> : it.title}</h3>
      <p className="font-work text-xs leading-relaxed text-[#564241]">{it.text}</p>
    </div>
  )
  return (
    <section aria-labelledby="j5-alerts" className={card}>
      <div className={cx(head, 'mb-3')}>
        <div className="flex items-center gap-2"><Megaphone className="h-[18px] w-[18px] text-[#9b4500]" aria-hidden="true" /><h2 id="j5-alerts" className={h4}>Notifications &amp; Alerts</h2></div>
        <span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 font-work text-[10px] font-bold uppercase tracking-wider text-amber-900">Latest Updates</span>
      </div>
      <div className="relative -mx-2 overflow-hidden motion-reduce:overflow-x-auto">
        <div className="j5-hscroll items-center gap-4 py-1">
          {items.map((it, i) => cardEl(it, i, false))}
          <div aria-hidden="true" className="j5-dup flex gap-4">{items.map((it, i) => cardEl(it, i, true))}</div>
        </div>
      </div>
    </section>
  )
}

/** A rotating one-line ticker of journal updates (replaces the reference's activity feed; no author activity is invented). */
function UpdatesTicker({ notices }: { notices: { date: string; text: string }[] }) {
  const lines = useMemo(() => [
    ...notices.map((n) => `${formatDate(n.date)}: ${n.text}`),
    `Next issue: ${journal.nextIssue.label}. Submission deadline ${formatDate(journal.nextIssue.deadline.slice(0, 10))}.`,
    `Every ${journal.shortName} article receives a permanent Crossref DOI under ${journal.doiPrefix}.`,
  ], [notices])
  const [i, setI] = useState(0)
  const [show, setShow] = useState(true)
  useEffect(() => {
    if (reduced() || lines.length < 2) return
    const t = window.setInterval(() => { setShow(false); window.setTimeout(() => { setI((n) => (n + 1) % lines.length); setShow(true) }, 300) }, 4200)
    return () => window.clearInterval(t)
  }, [lines.length])
  return (
    <section aria-label="Journal updates" className="rounded border border-[#dcc0be] bg-[#f4f5fc] p-4 shadow-sm">
      <div className="mb-2 flex items-center justify-between border-b border-[#dcc0be] pb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2"><span aria-hidden="true" className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 motion-safe:animate-ping" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" /></span>
          <h2 className="font-work text-[11px] font-bold uppercase tracking-wider text-[#141b2b]">Journal Updates</h2>
        </div>
        <span className="font-work text-[10px] text-[#564241]">{i + 1} / {lines.length}</span>
      </div>
      <div className="flex min-h-12 items-center overflow-hidden">
        <p className={cx('font-work text-xs leading-tight text-[#141b2b] transition-opacity duration-300', show ? 'opacity-100' : 'opacity-0')}>{lines[i % lines.length]}</p>
      </div>
    </section>
  )
}

function TrackForm() {
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
    <section id="track-section" aria-labelledby="j5-track" className={card}>
      <div className="mb-3 flex items-center gap-2 border-b border-obsidian-200 pb-2"><FindInPage className="h-[18px] w-[18px] text-wine-800" aria-hidden="true" /><h2 id="j5-track" className={h4}>Track Paper Status</h2></div>
      <p className="mb-3 font-work text-xs text-[#564241]">Check the status of an active submission with its Paper ID and the email used to submit. No login needed:</p>
      <form onSubmit={submit} noValidate className="space-y-2.5">
        <div>
          <label htmlFor={`${id}-p`} className="sr-only">Paper ID</label>
          <input id={`${id}-p`} value={pid} onChange={(e) => setPid(e.target.value)} placeholder={`Paper ID (e.g. ${journal.paperIdPrefix}2026000112)`} autoComplete="off" aria-invalid={!!err.pid} aria-describedby={err.pid ? `${id}-pe` : undefined} className={input} />
          {err.pid && <p id={`${id}-pe`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.pid}</p>}
        </div>
        <div>
          <label htmlFor={`${id}-m`} className="sr-only">Corresponding author email</label>
          <input id={`${id}-m`} type="email" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Corresponding Author Email" autoComplete="email" aria-invalid={!!err.mail} aria-describedby={err.mail ? `${id}-me` : undefined} className={input} />
          {err.mail && <p id={`${id}-me`} role="alert" className="mt-1 text-xs font-medium text-red-700">{err.mail}</p>}
        </div>
        <button type="submit" className="w-full rounded bg-wine-800 py-2 font-work text-xs font-medium uppercase tracking-wider text-white transition hover:bg-bordeaux-900">Check Manuscript Status</button>
      </form>
    </section>
  )
}

function Shortcut({ to, Icon, tone, children }: { to: string; Icon: typeof Rights; tone: string; children: string }) {
  return (
    <AppLink to={to} className="flex items-center justify-between rounded border border-[#dcc0be] bg-white p-3 font-work text-xs transition hover:bg-[#e9edff]">
      <span className="flex items-center gap-2 font-semibold text-[#141b2b]"><Icon className={cx('h-[18px] w-[18px]', tone)} aria-hidden="true" /><span>{children}</span></span>
      <ArrowRight className="h-4 w-4 text-[#897270]" aria-hidden="true" />
    </AppLink>
  )
}

export function Sidebar({ cfp, notices }: { cfp: CallForPapers; notices: { date: string; text: string }[] }) {
  const crossref = journal.logos.find((l) => l.id === 'crossref')
  const downloads: [string, string, string, typeof Article, string][] = [
    ['Manuscript Template (Word & LaTeX)', 'Manuscript, cover letter and response templates', paths.forAuthors('templates'), Article, 'text-blue-700'],
    ['Author Guidelines', 'Article types, format and declarations', paths.policy('author-guidelines'), Award, 'text-amber-700'],
    ['APC & Payment', 'Charges, GST and how to pay', paths.forAuthors('apc-payment'), Description, 'text-emerald-700'],
  ]
  return (
    <aside aria-label="Author desk and journal hub" className="space-y-6 lg:col-span-4">
      <CallBanner cfp={cfp} />
      <Indexing />
      <Alerts notices={notices} />
      <UpdatesTicker notices={notices} />
      <TrackForm />
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
        <Shortcut to={paths.track} Icon={Rights} tone="text-[#9b4500]">Fill / Sign Copyright Form</Shortcut>
        <Shortcut to={paths.verify()} Icon={Groups} tone="text-wine-800">Verify a Certificate</Shortcut>
      </div>
      <section aria-labelledby="j5-dl" className={card}>
        <div className="mb-3 flex items-center gap-2 border-b border-obsidian-200 pb-2"><DownloadForOffline className="h-[18px] w-[18px] text-[#141b2b]" aria-hidden="true" /><h2 id="j5-dl" className={h4}>Author Downloads &amp; Toolkits</h2></div>
        <ul className="space-y-2 font-work text-xs">
          {downloads.map(([t, note, to, Icon, tone], i) => (
            <li key={t}>
              <AppLink to={to} className={cx('flex items-center justify-between gap-3 py-1.5 text-[#564241] transition hover:text-wine-800', i < downloads.length - 1 && 'border-b border-obsidian-200')}>
                <span className="flex items-center gap-1.5"><Icon className={cx('h-[15px] w-[15px] shrink-0', tone)} aria-hidden="true" /><span><span className="block font-medium text-[#141b2b]">{t}</span><span className="block text-[11px]">{note}</span></span></span>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#897270]" aria-hidden="true" />
              </AppLink>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="j5-crossref" className="space-y-3 rounded border border-[#dcc0be] bg-white p-4 font-work text-xs shadow-sm">
        <div className="flex items-center justify-between border-b border-obsidian-200 pb-3">
          <h2 id="j5-crossref" className="flex items-center gap-1 font-work text-[11px] font-bold uppercase tracking-wider text-[#141b2b]"><Verified className="h-4 w-4 text-[#9b4500]" aria-hidden="true" />Crossref DOI Registration</h2>
          <span className="inline-flex items-center gap-1.5 rounded border border-emerald-500/20 bg-emerald-100 px-2 py-0.5 font-work text-[10px] font-bold uppercase tracking-wider text-emerald-800"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-600" />{crossref?.status ?? 'Active'}</span>
        </div>
        <div className="flex items-center justify-center gap-4 rounded border border-[#dcc0be]/80 bg-[#f4f5fc] p-3 py-3 font-newsreader text-xl font-bold text-[#141b2b]"><span>Crossref</span><span aria-hidden="true" className="font-light text-[#dcc0be]">|</span><span className="text-[#9b4500]">DOI</span></div>
        <div className="flex items-center justify-between rounded border border-amber-300 bg-amber-50 p-2.5 shadow-sm">
          <span className="flex items-center gap-1.5 font-work text-xs font-bold uppercase tracking-wider text-amber-950"><Fingerprint className="h-[18px] w-[18px] text-amber-800" aria-hidden="true" />Official DOI Prefix</span>
          <span className="rounded border border-amber-300 bg-white px-2.5 py-0.5 font-mono text-sm font-bold text-wine-800 shadow-sm">{journal.doiPrefix}</span>
        </div>
        <p className="text-[11px] leading-relaxed text-[#564241]">{crossref?.description ?? 'Every article receives a permanent Crossref DOI.'} Each DOI resolves to the article page and is deposited when the article is published.</p>
        <div className="border-t border-obsidian-200 pt-2">
          <a href={crossref?.verifyUrl ?? 'https://search.crossref.org/'} target="_blank" rel="noreferrer" className="flex w-full items-center justify-between font-work text-[11px] font-semibold uppercase tracking-wider text-wine-800 transition hover:text-bordeaux-900">
            <span>Verify Crossref Record<span className="sr-only"> (opens in a new tab)</span></span><ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </section>
      <section aria-labelledby="j5-editors" className="rounded border border-[#dcc0be] bg-gradient-to-br from-[#dce2f7] to-[#e1e8fd] p-5">
        <div className="mb-1 flex items-center gap-1.5 font-work text-xs font-bold uppercase text-wine-800"><School className="h-[18px] w-[18px]" aria-hidden="true" /><h2 id="j5-editors">Call for Reviewers</h2></div>
        <p className="mb-3 font-work text-xs leading-relaxed text-[#564241]">Researchers with a record of peer-reviewed publications are invited to join the {journal.shortName} reviewer pool.</p>
        <div className="my-3 overflow-hidden rounded border border-[#dcc0be]/50 shadow-sm"><img src="/journals/j5/images/card-review.svg" alt="" loading="lazy" className="h-32 w-full object-cover" /></div>
        <AppLink to={paths.forAuthors('become-a-reviewer')} className="inline-flex items-center gap-1 font-work text-xs font-bold uppercase tracking-wider text-wine-800 hover:underline"><span>Apply to Review</span><ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></AppLink>
      </section>
      <div className="flex items-start gap-2.5 rounded border border-[#dcc0be] bg-white p-4 font-work text-[11px] text-[#564241]">
        <OpenAccess className="mt-0.5 h-5 w-5 shrink-0 text-[#9b4500]" aria-hidden="true" />
        <p><strong className="text-[#141b2b]">Creative Commons {journal.licence.name}:</strong> Authors retain copyright. Anyone may copy, distribute and adapt the work with proper attribution.</p>
      </div>
    </aside>
  )
}
