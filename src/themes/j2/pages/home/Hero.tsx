// Home hero: a soft-mint rounded card with the headline, search, action buttons and a fact row, next to the "Official Journal Issue" card.
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../../core/types'
import { LogoTile } from '../../components/BrandBlock'
import { SearchBox } from '../../components/SearchBox'
import { useSearchApi } from '../../components/searchContext'
import { disciplines } from '../../components/discipline'
import { CheckCircle, EventIcon, Fingerprint, Tune, UploadFile } from '../../components/homeIcons'
import { ArrowRight, Book, Download, OpenAccess } from '../../icons'

const dots = { backgroundImage: 'radial-gradient(rgba(6, 95, 70, 0.09) 1.2px, transparent 1.2px)', backgroundSize: '16px 16px' }
const coverDots = { backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1.2px, transparent 1.2px)', backgroundSize: '14px 14px' }

function IssueCard({ issue, featured }: { issue: IssueSummary; featured?: ArticleSummary }) {
  return (
    <aside aria-label="Current issue" className="mx-auto w-full max-w-[22rem] overflow-hidden rounded-sheet border border-brand-200 bg-white shadow-soft">
      <div className="border-b border-brand-700 bg-brand-800 p-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded bg-white/20 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider text-brand-100">Official Journal Issue</span>
          <span className="font-mono text-[11px] text-brand-100">ISSN {journal.issnOnline}</span>
        </div>
        <p className="mt-1 font-display text-lg font-bold">{journal.shortName}</p>
        <p className="text-xs text-brand-100">Volume {issue.volume} · Issue {issue.issue} ({formatMonthYear(issue.publishedAt)})</p>
      </div>
      <div className="relative flex min-h-[15rem] flex-col justify-between gap-6 overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-accent-800 p-4">
        <div aria-hidden="true" className="absolute inset-0 opacity-60" style={coverDots} />
        <div aria-hidden="true" className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-brand-500/25" />
        <div className="relative flex items-start justify-between gap-3">
          <span className="rounded bg-brand-900/90 px-2 py-1 font-mono text-[10px] text-white">DOI: {issue.doi}</span>
          <LogoTile className="h-16 w-16" />
        </div>
        <div className="relative">
          {featured && (
            <AppLink to={paths.article(featured.paperId)} className="block rounded-panel border border-graphite-200 bg-white p-2.5 hover:bg-brand-50">
              <span className="block text-[11px] font-bold leading-snug text-graphite-900">Featured: {featured.title}</span>
              <span className="mt-0.5 block text-[11px] text-graphite-600">{featured.subject}</span>
            </AppLink>
          )}
        </div>
      </div>
      <div className="space-y-2 border-t border-graphite-100 bg-white p-3">
        <div className="flex items-center justify-between text-xs text-graphite-600">
          <span>Published: {formatDate(issue.publishedAt)}</span>
          <span className="font-bold text-brand-800">{issue.articleCount} Articles</span>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <AppLink to={paths.currentIssue} className="inline-flex flex-1 items-center justify-center gap-1 rounded-panel bg-brand-800 py-2 text-xs font-bold text-white hover:bg-accent-700">View Full Issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
          <AppLink to={paths.pastIssues} aria-label="Past issues" className="rounded-panel border border-graphite-300 px-3 py-2 text-graphite-700 hover:bg-graphite-50"><Book className="h-[18px] w-[18px]" aria-hidden="true" /></AppLink>
        </div>
      </div>
    </aside>
  )
}

export function Hero({ issue, featured, sample }: { issue: IssueSummary; featured?: ArticleSummary; sample?: ArticleSummary }) {
  const { onSearch, onSuggest } = useSearchApi()
  const tries = [disciplines[0]?.name, disciplines[1]?.name].filter(Boolean) as string[]
  const fact = 'inline-flex items-center gap-1.5'
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden rounded-sheet border border-brand-200 bg-brand-50 p-5 sm:p-6 lg:p-8" style={dots}>
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-accent-200/40 blur-3xl" />
      <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] xl:gap-12">
        <div className="min-w-0 space-y-4">
          <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-brand-300 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-800 shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-600" /> {journal.descriptor}
          </p>
          <h1 id="hero-title" className="max-w-2xl font-display text-3xl font-extrabold leading-tight text-graphite-900 lg:text-4xl">{journal.tagline}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-graphite-700 lg:text-base">{journal.mission}</p>
          <div className="max-w-2xl">
            <SearchBox size="lg" onSearch={onSearch} onSuggest={onSuggest} placeholder="Search articles, authors, DOI" />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-xs text-graphite-700">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">Try searching:
                {tries.map((t) => <AppLink key={t} to={paths.search(t)} className="font-medium text-accent-700 hover:underline">{t}</AppLink>)}
                {sample && <AppLink to={paths.article(sample.paperId)} className="font-mono font-medium text-accent-700 hover:underline">{doiFor(sample.paperId)}</AppLink>}
              </p>
              <p className="flex items-center gap-4 font-semibold">
                <AppLink to={paths.pastIssues} className="inline-flex items-center gap-1 text-brand-800 hover:underline"><Book className="h-4 w-4" aria-hidden="true" /> Journal Library</AppLink>
                <AppLink to={paths.search('')} className="inline-flex items-center gap-1 text-brand-800 hover:underline">Advanced Search <Tune className="h-4 w-4" aria-hidden="true" /></AppLink>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <AppLink to={paths.submit} className="inline-flex h-10 items-center gap-2 rounded-panel bg-brand-800 px-5 text-xs font-bold text-white shadow-card hover:bg-accent-700"><UploadFile className="h-[18px] w-[18px]" aria-hidden="true" /> Submit Manuscript</AppLink>
            <AppLink to={paths.policy('author-guidelines')} className="inline-flex h-10 items-center gap-2 rounded-panel border border-brand-800 bg-white px-5 text-xs font-bold text-brand-800 hover:bg-brand-50"><Book className="h-[18px] w-[18px]" aria-hidden="true" /> Author Guidelines</AppLink>
            <AppLink to={paths.forAuthors('templates')} className="inline-flex h-10 items-center gap-1.5 rounded-panel bg-brand-100 px-4 text-xs font-semibold text-brand-800 hover:bg-brand-200"><Download className="h-[18px] w-[18px]" aria-hidden="true" /> Article Templates</AppLink>
          </div>
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-brand-200 pt-3 text-xs text-graphite-700">
            <li className={fact}><CheckCircle className="h-4 w-4 text-brand-700" aria-hidden="true" /><strong>ISSN:</strong> {journal.issnOnline} (Online)</li>
            <li className={fact}><Fingerprint className="h-4 w-4 text-accent-700" aria-hidden="true" /><strong>Crossref DOI:</strong> {journal.doiPrefix}</li>
            <li className={fact}><OpenAccess className="h-4 w-4 text-cta-700" aria-hidden="true" /><strong>Licence:</strong> {journal.licence.name}</li>
            <li className={fact}><EventIcon className="h-4 w-4 text-brand-800" aria-hidden="true" /><strong>Frequency:</strong> {journal.frequency}</li>
          </ul>
        </div>
        <IssueCard issue={issue} featured={featured} />
      </div>
    </section>
  )
}
