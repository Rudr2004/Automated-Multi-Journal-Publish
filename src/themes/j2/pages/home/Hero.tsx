// Home hero: emerald band with a large search box, "Explore by discipline" chips and a small current-issue card.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { SearchBox } from '../../components/SearchBox'
import { useSearchApi } from '../../components/searchContext'
import { disciplines } from '../../components/discipline'
import { Container } from '../../components/primitives'
import { ArrowRight, Book } from '../../icons'

function IssueCard({ issue }: { issue: IssueSummary }) {
  return (
    <aside aria-label="Current issue" className="rounded-panel bg-white p-5 text-graphite-800 shadow-pop">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">Current issue</p>
      <div className="mt-3 flex items-center gap-4">
        <div aria-hidden="true" className="flex h-24 w-[4.5rem] shrink-0 flex-col justify-between rounded-chip bg-gradient-to-br from-brand-700 to-accent-800 p-2 text-white shadow-soft">
          <span className="font-display text-sm font-extrabold tracking-wide">{journal.shortName}</span>
          <span className="text-[10px] leading-tight text-brand-100">Vol. {issue.volume}<br />Issue {issue.issue}</span>
        </div>
        <div>
          <p className="font-display text-lg font-semibold leading-tight">{formatMonthYear(issue.publishedAt)}</p>
          <p className="mt-1 text-sm text-graphite-600">Volume {issue.volume}, Issue {issue.issue}</p>
          <p className="text-sm text-graphite-600">{issue.articleCount} articles</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-graphite-100 pt-3 text-sm font-semibold">
        <AppLink to={paths.currentIssue} className="inline-flex items-center gap-1 text-accent-700 hover:underline"><Book className="h-4 w-4" aria-hidden="true" /> Read issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
        <AppLink to={paths.pastIssues} className="text-graphite-600 hover:text-accent-700 hover:underline">Past issues</AppLink>
      </div>
    </aside>
  )
}

export function Hero({ issue }: { issue: IssueSummary }) {
  const { onSearch, onSuggest } = useSearchApi()
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-brand-800 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(60rem_30rem_at_85%_-10%,rgba(15,118,110,0.55),transparent),radial-gradient(40rem_24rem_at_-5%_110%,rgba(52,211,153,0.18),transparent)]" />
      <Container className="grid items-start gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_21rem] lg:py-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand-100 ring-1 ring-inset ring-white/20">Monthly · Open access · ISSN {journal.issnOnline}</p>
          <h1 id="hero-title" className="mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">{journal.tagline}</h1>
          <p className="mt-4 max-w-2xl text-lg text-brand-100">{journal.mission}</p>
          <SearchBox size="lg" onSearch={onSearch} onSuggest={onSuggest} className="mt-8 max-w-3xl" />
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-200">Explore by discipline</p>
            <ul className="mt-2.5 flex flex-wrap gap-2">
              {disciplines.map((d) => (
                <li key={d.id}><AppLink to={paths.search(d.name)} className="inline-block rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white hover:text-brand-800">{d.name}</AppLink></li>
              ))}
            </ul>
          </div>
        </div>
        <IssueCard issue={issue} />
      </Container>
    </section>
  )
}
