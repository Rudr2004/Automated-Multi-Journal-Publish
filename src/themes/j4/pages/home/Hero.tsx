// Home hero: a dark blueprint-grid card (headline, intro, search, action buttons, fact row) beside the "Official Journal Issue" card with its cover.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { ArchiveSearch } from '../../components/ArchiveSearch'
import { ButtonLink } from '../../components/Button'
import { Fingerprint, Tune, UploadFile } from '../../components/homeIconsJ4'
import { Label } from '../../components/primitives'
import { areas } from '../../components/areas'
import { Logo } from '../../layouts/Header'
import { ArrowRight, Book, Calendar, Download, OpenAccess, Verified } from '../../icons'

function IssueCard({ issue }: { issue: IssueSummary }) {
  return (
    <aside aria-label="Current issue" className="overflow-hidden rounded-pane border border-abyss-200 bg-white shadow-panel">
      <div className="flex items-center justify-between gap-2 border-b border-abyss-200 bg-abyss-50 px-4 py-2.5">
        <Label className="text-cobalt-700">Official Journal Issue</Label>
        <span className="text-xs font-semibold tabular-nums text-steel-700">ISSN {journal.issnOnline}</span>
      </div>
      <div className="relative">
        <img src="/journals/j4/images/issue-cover.svg" alt="" width={360} height={300} className="block h-auto w-full" />
        <Logo size={52} tile className="absolute right-3 top-3 border border-abyss-200 shadow-hair" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-abyss-900 via-abyss-900/85 to-transparent px-4 pb-3 pt-10 text-white">
          <p className="font-serif4 text-xl font-semibold leading-tight">{journal.shortName}</p>
          <p className="text-sm text-abyss-200">Volume {issue.volume}, Issue {issue.issue} · {formatMonthYear(issue.publishedAt)}</p>
        </div>
      </div>
      <dl className="divide-y divide-abyss-100 px-4 text-sm tabular-nums">
        {[['Published', formatDate(issue.publishedAt)], ['Articles', String(issue.articleCount)], ['Issue DOI', issue.doi]].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 py-2"><dt className="text-steel-600">{k}</dt><dd className="min-w-0 break-all text-right font-semibold text-abyss-900">{v}</dd></div>
        ))}
      </dl>
      <div className="flex items-center gap-2 p-4 pt-3">
        <ButtonLink to={paths.currentIssue} className="flex-1">View full issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
        <AppLink to={paths.pastIssues} aria-label="Past issues" className="inline-flex h-10 w-10 items-center justify-center rounded-ctl border border-abyss-300 text-abyss-800 hover:border-cobalt-700 hover:text-cobalt-700"><Book className="h-5 w-5" aria-hidden="true" /></AppLink>
      </div>
    </aside>
  )
}

export function Hero({ issue }: { issue: IssueSummary }) {
  const tries = areas.slice(0, 2).map((a) => a.name)
  const fact = 'inline-flex items-center gap-1.5'
  return (
    <section aria-labelledby="hero-title" className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_22.5rem]">
      <div className="relative isolate overflow-hidden rounded-pane bg-abyss-900 p-5 text-white sm:p-7 lg:p-8">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_75%)]" />
        <Label className="text-azure-300">{journal.descriptor}</Label>
        <h1 id="hero-title" className="mt-3 max-w-2xl font-serif4 font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(30px,3.2vw,46px)' }}>{journal.tagline}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-abyss-200">{journal.mission}</p>

        <div className="mt-5 max-w-2xl">
          <ArchiveSearch />
          <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-abyss-300">
            <span>Browse:</span>
            {tries.map((t) => <AppLink key={t} to={paths.search(t)} className="font-semibold text-azure-300 hover:text-white hover:underline">{t}</AppLink>)}
            <AppLink to={paths.search('')} className="inline-flex items-center gap-1 font-semibold text-azure-300 hover:text-white hover:underline"><Tune className="h-4 w-4" aria-hidden="true" /> Advanced search</AppLink>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ButtonLink to={paths.submit} variant="cta"><UploadFile className="h-[18px] w-[18px]" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          <ButtonLink to={paths.policy('author-guidelines')} variant="onDark"><Book className="h-[18px] w-[18px]" aria-hidden="true" /> Author Guidelines</ButtonLink>
          <ButtonLink to={paths.forAuthors('templates')} variant="onDark"><Download className="h-[18px] w-[18px]" aria-hidden="true" /> Article Templates</ButtonLink>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs text-abyss-200">
          <li className={fact}><Verified className="h-4 w-4 text-azure-300" aria-hidden="true" /><strong className="font-semibold text-white">ISSN</strong> {journal.issnOnline} (Online)</li>
          <li className={fact}><Fingerprint className="h-4 w-4 text-azure-300" aria-hidden="true" /><strong className="font-semibold text-white">Crossref DOI</strong> {journal.doiPrefix}</li>
          {journal.badges.openAccess && <li className={fact}><OpenAccess className="h-4 w-4 text-azure-300" aria-hidden="true" /><strong className="font-semibold text-white">Licence</strong> {journal.licence.name}</li>}
          <li className={fact}><Calendar className="h-4 w-4 text-azure-300" aria-hidden="true" /><strong className="font-semibold text-white">Frequency</strong> {journal.frequency}</li>
        </ul>
      </div>
      <IssueCard issue={issue} />
    </section>
  )
}
