// Home sidebar: Call for Papers, journal vital indicators with indexing, certified standards, author resources, referee and copyright cards.
// Cards are plain blocks that flow with the page (not sticky), so the column never leaves a large empty area.
import type { ReactNode } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { CallForPapers, EditorProfile } from '../../../../core/types'
import { AwardsCard } from '../../components/AwardsCard'
import { Description, EditNote, Groups, Insights, QrCode, VerifiedUser } from '../../components/homeIcons'
import { ArrowRight, Book, Download, LinkIcon, OpenAccess, Review, Submit, Track } from '../../icons'

const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000))
const card = 'rounded-sheet border border-graphite-200 bg-white p-5 shadow-card'
const cardTitle = 'flex items-center gap-2 border-b border-graphite-100 pb-3 font-display text-sm font-bold text-graphite-900'

function CallForPapersCard({ cfp }: { cfp: CallForPapers }) {
  const left = daysLeft(cfp.deadline)
  const [issueName] = cfp.issueName.split(' — ')
  return (
    <section aria-labelledby="cfp-title" className="rounded-sheet bg-brand-800 p-5 text-white shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/15 px-2.5 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-brand-100">Call for papers</span>
        <span className="font-mono text-xs text-brand-100">{issueName}</span>
      </div>
      <h2 id="cfp-title" className="mt-3 font-display text-xl font-bold">Submit to {issueName}</h2>
      <p className="mt-1.5 text-sm text-brand-100">We welcome original research, review articles and short communications from every discipline.</p>
      <div className="mt-4 rounded-panel border border-white/15 bg-brand-900/50 p-3 text-center">
        <p className="text-[11px] uppercase tracking-wider text-brand-100">Submission closing date</p>
        <p className="font-display text-lg font-bold">{formatDate(cfp.deadline.slice(0, 10))}</p>
        <p className="text-xs text-brand-100">{left === 0 ? 'Closing today' : `${left} day${left === 1 ? '' : 's'} left`}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-chip border border-white/15 bg-brand-900/60 p-2"><p className="text-[10px] uppercase tracking-wider text-brand-100">First review</p><p className="font-mono text-xs font-bold">~{cfp.avgReviewDays} Days</p></div>
          <div className="rounded-chip border border-white/15 bg-brand-900/60 p-2"><p className="text-[10px] uppercase tracking-wider text-brand-100">Publication</p><p className="font-mono text-xs font-bold">{formatDate(cfp.expectedPublication)}</p></div>
        </div>
      </div>
      <AppLink to={paths.submit} className="mt-4 flex items-center justify-center gap-2 rounded-panel bg-white py-3 text-sm font-bold text-brand-800 hover:bg-brand-50 focus-visible:!outline-white"><Submit className="h-5 w-5" aria-hidden="true" /> Submit Your Manuscript Now</AppLink>
      <AppLink to={paths.track} className="mt-2 flex items-center justify-center gap-2 rounded-panel border border-brand-300/60 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:!outline-white"><Track className="h-5 w-5" aria-hidden="true" /> Track Your Paper</AppLink>
      <p className="mt-3 text-center text-[11px] text-brand-100">
        {[journal.badges.peerReviewed && '✓ Peer reviewed', journal.badges.openAccess && `✓ ${journal.licence.name}`, '✓ Crossref DOI'].filter(Boolean).join(' · ')}
      </p>
    </section>
  )
}

function Vitals() {
  const logos = visibleLogos()
  const rows: [string, string][] = [['ISSN (Online)', journal.issnOnline], ['Crossref DOI Prefix', journal.doiPrefix], ['Licensing', journal.licence.name], ['Frequency', journal.frequency]]
  return (
    <section aria-labelledby="vital-title" className={card}>
      <h2 id="vital-title" className={cardTitle}><Insights className="h-5 w-5 text-brand-800" aria-hidden="true" /> Journal Vital Indicators</h2>
      <dl className="mt-1 divide-y divide-graphite-100 text-sm">
        {rows.map(([k, v]) => <div key={k} className="flex items-baseline justify-between gap-3 py-2"><dt className="text-graphite-700">{k}</dt><dd className="font-mono text-graphite-900">{v}</dd></div>)}
      </dl>
      {logos.length > 0 && (
        <>
          <p className="mt-4 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-graphite-600">Indexed &amp; discovered in <AppLink to={paths.about('indexing')} className="font-semibold normal-case tracking-normal text-accent-700 hover:underline">Indexing</AppLink></p>
          <ul className="mt-2 space-y-2">
            {logos.map((l) => (
              <li key={l.id}><a href={l.verifyUrl} target="_blank" rel="noreferrer" aria-label={`${l.name}: ${l.status} (opens in a new tab)`} className="flex items-center gap-3 rounded-panel border border-graphite-200 bg-white px-3 py-2 hover:border-accent-700">
                <span className="flex h-8 w-12 shrink-0 items-center justify-center">{l.file ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" /> : <span className="font-display text-[10px] font-bold text-brand-800">{l.name}</span>}</span>
                <span className="flex-1 text-sm font-semibold text-graphite-800">{l.name}</span>
                <span className="font-mono text-[11px] text-graphite-600">{l.status}</span>
              </a></li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}

function Standards() {
  const tiles: { icon: ReactNode; label: string; to: string }[] = [
    ...(journal.badges.peerReviewed ? [{ icon: <Review className="h-6 w-6" />, label: 'Peer Reviewed', to: paths.policy('peer-review') }] : []),
    ...(journal.badges.openAccess ? [{ icon: <OpenAccess className="h-6 w-6" />, label: `${journal.licence.name} Open`, to: paths.policy('open-access') }] : []),
    { icon: <LinkIcon className="h-6 w-6" />, label: 'Crossref DOI', to: paths.policy('archiving') },
    { icon: <QrCode className="h-6 w-6" />, label: 'Verifiable Certificates', to: paths.verify() },
  ]
  return (
    <section aria-labelledby="std-title" className={card}>
      <h2 id="std-title" className="font-display text-sm font-bold text-graphite-900">Certified Scholarly Standards</h2>
      <ul className="mt-3 grid grid-cols-2 gap-3">
        {tiles.map((t) => (
          <li key={t.label}><AppLink to={t.to} className="flex h-full flex-col items-center gap-2 rounded-panel border border-graphite-200 bg-graphite-50 px-2 py-4 text-center text-xs font-bold text-graphite-800 hover:border-accent-700 hover:bg-brand-50">
            <span aria-hidden="true" className="text-brand-800">{t.icon}</span>{t.label}
          </AppLink></li>
        ))}
      </ul>
    </section>
  )
}

function Resources() {
  const rows: [ReactNode, string, string, string][] = [
    [<Description key="t" className="h-5 w-5" />, 'Manuscript Template', 'Word and LaTeX formats', paths.forAuthors('templates')],
    [<Book key="g" className="h-5 w-5" />, 'Author Guidelines', 'Format and ethics checklist', paths.policy('author-guidelines')],
    [<VerifiedUser key="v" className="h-5 w-5" />, 'Verify a Certificate', 'Scan the QR code or enter the ID', paths.verify()],
  ]
  return (
    <section aria-labelledby="res-title" className={card}>
      <h2 id="res-title" className={cardTitle}><Download className="h-5 w-5 text-brand-800" aria-hidden="true" /> Author Resources</h2>
      <ul className="mt-3 space-y-2.5">
        {rows.map(([icon, title, note, to]) => (
          <li key={title}><AppLink to={to} className="flex items-center gap-3 rounded-panel border border-graphite-200 p-2.5 hover:border-accent-700 hover:bg-brand-50">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-soft bg-brand-100 text-brand-800">{icon}</span>
            <span className="min-w-0 flex-1"><span className="block text-sm font-bold text-graphite-900">{title}</span><span className="block text-xs text-graphite-600">{note}</span></span>
            <ArrowRight className="h-4 w-4 text-graphite-500" aria-hidden="true" />
          </AppLink></li>
        ))}
      </ul>
    </section>
  )
}

function Referee() {
  return (
    <section aria-labelledby="ref-title" className="rounded-sheet border border-brand-300 bg-brand-50 p-5">
      <h2 id="ref-title" className="flex items-center gap-2 font-display text-sm font-bold text-graphite-900"><Groups className="h-5 w-5 text-brand-800" aria-hidden="true" /> Become an Expert Reviewer</h2>
      <p className="mt-2 text-sm text-graphite-700">Join {journal.shortName}&rsquo;s reviewer pool. Help authors improve their work and receive a reviewer certificate.</p>
      <AppLink to={paths.forAuthors('become-a-reviewer')} className="mt-3 flex items-center justify-center gap-1.5 rounded-panel bg-brand-800 py-2.5 text-sm font-bold text-white hover:bg-accent-700">Join the Reviewer Pool <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
    </section>
  )
}

function Copyright() {
  return (
    <section aria-labelledby="copy-title" className={card}>
      <h2 id="copy-title" className={cardTitle}><EditNote className="h-5 w-5 text-brand-800" aria-hidden="true" /> Copyright &amp; Licensing</h2>
      <p className="mt-3 text-sm text-graphite-700">Authors keep their copyright. Accepted authors complete the copyright agreement online with an email OTP, from the tracking page.</p>
      <AppLink to={paths.policy('copyright-licensing')} className="mt-3 flex items-center justify-center gap-1.5 rounded-panel border border-brand-800 py-2.5 text-sm font-bold text-brand-800 hover:bg-brand-50">Read the licensing policy <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
    </section>
  )
}

function Board({ editors }: { editors: EditorProfile[] }) {
  if (!editors.length) return null
  return (
    <section aria-labelledby="board-title" className={card}>
      <h2 id="board-title" className={cardTitle}><Groups className="h-5 w-5 text-brand-800" aria-hidden="true" /> Editorial Leadership</h2>
      <ul className="mt-3 space-y-3">
        {editors.slice(0, 3).map((e) => {
          const ini = e.name.replace(/^(Prof|Dr)\.?\s+/i, '').split(' ').map((x) => x[0]).slice(0, 2).join('')
          return (
            <li key={e.id} className="flex items-center gap-3">
              {e.photo ? <img src={e.photo} alt="" width={44} height={44} loading="lazy" className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-graphite-200" /> : <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800">{ini}</span>}
              <span className="min-w-0"><span className="block text-sm font-bold text-graphite-900">{e.name}</span><span className="block text-xs font-semibold text-accent-800">{e.role}</span><span className="block text-xs text-graphite-600">{e.institution}, {e.country}</span></span>
            </li>
          )
        })}
      </ul>
      <AppLink to={paths.editorialBoard} className="mt-4 flex items-center justify-center gap-1.5 rounded-panel border border-brand-800 py-2.5 text-sm font-bold text-brand-800 hover:bg-brand-50">Meet the full board <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
    </section>
  )
}

export function Sidebar({ cfp, editors }: { cfp: CallForPapers; editors: EditorProfile[] }) {
  return (
    <aside aria-label="Journal information" className="space-y-5">
      <CallForPapersCard cfp={cfp} />
      <AwardsCard />
      <Vitals />
      <Standards />
      <Resources />
      <Board editors={editors} />
      <Referee />
      <Copyright />
    </aside>
  )
}
