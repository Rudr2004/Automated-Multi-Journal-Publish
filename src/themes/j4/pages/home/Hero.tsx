// Home hero, as in the reference: a pale-sky banner (badges, serif title, intro, three actions) beside the white "Call for Papers" card with the issue, key dates, a Submit button and quick links.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { CallForPapers } from '../../../../core/types'
import { ButtonLink } from '../../components/Button'
import { Assignment, Campaign, Description, Draw, Event, Hourglass, Bolt, Search, TableView, UploadFile } from '../../components/refIconsJ4'

const longDate = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00` : iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/** "Volume 1, Issue 10 — October 2026" becomes ["Volume 1 • Issue 10", "October 2026"]. */
export function splitIssueName(name: string): [string, string] {
  const [a, month = ''] = name.split(' — ')
  const m = /Volume\s+(\d+),?\s+Issue\s+(\d+)/i.exec(a)
  return [m ? `Volume ${m[1]} • Issue ${m[2]}` : a, month]
}

function CallCard({ cfp }: { cfp: CallForPapers }) {
  const [issueName, month] = splitIssueName(cfp.issueName)
  const rows: { icon: typeof Event; label: string; value: string; chip?: string }[] = [
    { icon: Event, label: 'Submission Deadline:', value: longDate(cfp.deadline) },
    { icon: Hourglass, label: 'First Decision:', value: '24 Hours', chip: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
    { icon: Bolt, label: 'Expected Publication:', value: '24-48 Hours', chip: 'border-sky-200 bg-sky-50 text-sky-800' },
  ]
  const links: [string, string, typeof Description][] = [
    ['Author Guidelines', paths.policy('author-guidelines'), Description], ['Manuscript Template', paths.forAuthors('templates'), Assignment],
    ['Copyright Form', paths.policy('copyright-licensing'), Draw], ['Track Manuscript', paths.track, Search],
  ]
  return (
    <aside aria-labelledby="j4-cfp" className="flex flex-col justify-between rounded-[12px] border border-[#bfdbfe] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06),0_1px_3px_rgba(15,23,42,0.08)] lg:col-span-4">
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <h2 id="j4-cfp" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cobalt-700"><Campaign className="h-4 w-4" aria-hidden="true" />Call for Papers</h2>
          <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />Open Submissions</span>
        </div>
        <div className="mt-3">
          <p className="font-serif4 text-xl font-extrabold leading-tight tracking-tight text-[#0b2545] sm:text-2xl">{issueName}</p>
          {month && <p className="mt-0.5 font-serif4 text-base font-bold text-cobalt-700 sm:text-lg">{month}</p>}
          <p className="mt-2 text-xs text-slate-600">Submissions are open for the next regular issue, across engineering and engineering management.</p>
          <dl className="mt-3 space-y-2 rounded-[8px] border border-amber-200 bg-amber-50/70 p-3 text-xs">
            {rows.map(({ icon: Icon, label, value, chip }, i) => (
              <div key={label} className={`flex items-center justify-between gap-3 font-medium text-amber-950 ${i ? 'border-t border-amber-200/60 pt-1.5' : ''}`}>
                <dt className="flex items-center gap-1 text-slate-700"><Icon className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />{label}</dt>
                <dd className={chip ? `rounded border px-1.5 font-bold ${chip}` : 'font-bold text-[#0b2545]'}>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <ButtonLink to={paths.submit} variant="cta" className="mt-4 w-full !py-2 !text-xs"><UploadFile className="h-4 w-4" aria-hidden="true" /> Submit Manuscript Online</ButtonLink>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-700">
        {links.map(([l, to, Icon]) => <li key={l}><AppLink to={to} className="flex items-center gap-1.5 py-0.5 hover:text-cobalt-700"><Icon className="h-4 w-4 shrink-0 text-azure-600" aria-hidden="true" />{l}</AppLink></li>)}
      </ul>
    </aside>
  )
}

export function Hero({ cfp }: { cfp: CallForPapers }) {
  const kind = [journal.badges.peerReviewed && 'Peer-Reviewed', journal.badges.openAccess && 'Open Access'].filter(Boolean).join(' • ')
  return (
    <section aria-labelledby="home-title" className="rounded-[12px] border border-[#d2e7fc] bg-gradient-to-br from-[#eef7ff] via-[#f5f9ff] to-[#e4f1fd] p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:p-8">
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-center lg:col-span-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {kind && <span className="inline-flex items-center gap-1 rounded-full bg-[#dbeafe] px-2.5 py-0.5 text-xs font-semibold text-cobalt-700">{kind}</span>}
            <span className="rounded border border-slate-200 bg-white/70 px-2 py-0.5 font-mono text-xs text-slate-600">{journal.licence.name} International</span>
            <span className="rounded border border-amber-300 bg-amber-100/80 px-2 py-0.5 font-mono text-xs font-semibold text-amber-800">ISSN: {journal.issnOnline}</span>
          </div>
          <h1 id="home-title" className="mb-4 font-serif4 text-2xl font-bold leading-tight tracking-tight text-[#0b2545] md:text-3xl lg:text-4xl">{journal.name}</h1>
          <p className="mb-6 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base">{journal.mission}</p>
          <div className="flex flex-wrap items-center gap-3">
            <ButtonLink to={paths.currentIssue} variant="cta" className="px-5">Explore Current Issue</ButtonLink>
            <ButtonLink to={paths.about('journal-information')} variant="outline" className="border-cobalt-700 px-5 text-cobalt-700"><TableView className="h-4 w-4" aria-hidden="true" /> Journal Details</ButtonLink>
            <AppLink to={paths.about('aims-scope')} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-cobalt-700">Read Aims &amp; Scope →</AppLink>
          </div>
        </div>
        <CallCard cfp={cfp} />
      </div>
    </section>
  )
}
