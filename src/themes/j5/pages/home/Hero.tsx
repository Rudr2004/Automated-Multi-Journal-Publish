// Home hero: a dark bordeaux card with a ruled-paper and orbit motif (headline, intro, search, action buttons, fact row) beside the "Official Journal Issue" card with its cover.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { ArchiveSearch } from '../../components/ArchiveSearch'
import { ButtonLink } from '../../components/Button'
import { Fingerprint, Tune, UploadFile } from '../../components/homeIconsJ5'
import { Label, RuledMotif } from '../../components/primitives'
import { areas } from '../../components/areas'
import { Logo } from '../../layouts/Header'
import { ArrowRight, Book, Calendar, Download, OpenAccess, Verified } from '../../icons'

function IssueCard({ issue }: { issue: IssueSummary }) {
  return (
    <aside aria-label="Current issue" className="overflow-hidden rounded border border-obsidian-200 bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-obsidian-200 bg-[#FBF8F4] px-4 py-2.5">
        <Label className="text-wine-800">Official Journal Issue</Label>
        <span className="text-xs font-semibold tabular-nums text-obsidian-700">ISSN {journal.issnOnline}</span>
      </div>
      <div className="relative">
        <img src="/journals/j5/images/issue-cover.svg" alt="" width={360} height={300} className="block h-auto w-full" />
        <Logo size={52} tile className="absolute right-3 top-3 border border-obsidian-200" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bordeaux-900 via-bordeaux-900/85 to-transparent px-4 pb-3 pt-10 text-white">
          <p className="font-newsreader text-xl font-semibold leading-tight">{journal.shortName}</p>
          <p className="text-sm text-bordeaux-100">Volume {issue.volume}, Issue {issue.issue} · {formatMonthYear(issue.publishedAt)}</p>
        </div>
      </div>
      <dl className="divide-y divide-obsidian-100 px-4 text-sm tabular-nums">
        {[['Published', formatDate(issue.publishedAt)], ['Articles', String(issue.articleCount)], ['Issue DOI', issue.doi]].map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-3 py-2"><dt className="text-obsidian-600">{k}</dt><dd className="min-w-0 break-all text-right font-semibold text-obsidian-900">{v}</dd></div>
        ))}
      </dl>
      <div className="flex items-center gap-2 p-4 pt-3">
        <ButtonLink to={paths.currentIssue} variant="primary" className="flex-1">View full issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
        <AppLink to={paths.pastIssues} aria-label="Past issues" className="inline-flex h-10 w-10 items-center justify-center rounded border border-obsidian-300 text-obsidian-800 hover:border-wine-800 hover:text-wine-800"><Book className="h-5 w-5" aria-hidden="true" /></AppLink>
      </div>
    </aside>
  )
}

export function Hero({ issue }: { issue: IssueSummary }) {
  const tries = areas.slice(0, 2).map((a) => a.name)
  const fact = 'inline-flex items-center gap-1.5'
  return (
    <section aria-labelledby="hero-title" className="grid items-stretch gap-4 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_22.5rem]">
      <div className="relative isolate overflow-hidden rounded bg-bordeaux-900 p-5 text-white sm:p-7 lg:p-8">
        <RuledMotif orbits={false} />
        <img src="/journals/j5/images/hero-atom.svg" alt="" width={220} height={220} className="pointer-events-none absolute right-6 top-6 -z-10 hidden h-auto w-44 opacity-90 lg:block xl:w-52" />
        <Label className="text-ochre-300">{journal.descriptor}</Label>
        <h1 id="hero-title" className="mt-3 max-w-2xl font-newsreader lg:max-w-[34rem] xl:max-w-[36rem] font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(30px,3.2vw,46px)' }}>{journal.tagline}</h1>
        <p className="mt-3 max-w-2xl font-serif4 text-[1.0625rem] leading-relaxed text-bordeaux-100 lg:max-w-[34rem] xl:max-w-[36rem]">{journal.mission}</p>

        <div className="mt-5 max-w-2xl">
          <ArchiveSearch />
          <p className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-bordeaux-200">
            <span>Browse:</span>
            {tries.map((t) => <AppLink key={t} to={paths.search(t)} className="font-semibold text-ochre-300 hover:text-white hover:underline">{t}</AppLink>)}
            <AppLink to={paths.search('')} className="inline-flex items-center gap-1 font-semibold text-ochre-300 hover:text-white hover:underline"><Tune className="h-4 w-4" aria-hidden="true" /> Advanced search</AppLink>
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <ButtonLink to={paths.submit} variant="onDarkCta"><UploadFile className="h-[18px] w-[18px]" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          <ButtonLink to={paths.policy('author-guidelines')} variant="onDark"><Book className="h-[18px] w-[18px]" aria-hidden="true" /> Author Guidelines</ButtonLink>
          <ButtonLink to={paths.forAuthors('templates')} variant="onDark"><Download className="h-[18px] w-[18px]" aria-hidden="true" /> Article Templates</ButtonLink>
        </div>

        <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-xs text-bordeaux-100">
          <li className={fact}><Verified className="h-4 w-4 text-ochre-300" aria-hidden="true" /><strong className="font-semibold text-white">ISSN</strong> {journal.issnOnline} (Online)</li>
          <li className={fact}><Fingerprint className="h-4 w-4 text-ochre-300" aria-hidden="true" /><strong className="font-semibold text-white">Crossref DOI</strong> {journal.doiPrefix}</li>
          {journal.badges.openAccess && <li className={fact}><OpenAccess className="h-4 w-4 text-ochre-300" aria-hidden="true" /><strong className="font-semibold text-white">Licence</strong> {journal.licence.name}</li>}
          <li className={fact}><Calendar className="h-4 w-4 text-ochre-300" aria-hidden="true" /><strong className="font-semibold text-white">Frequency</strong> {journal.frequency}</li>
        </ul>
      </div>
      <IssueCard issue={issue} />
    </section>
  )
}
