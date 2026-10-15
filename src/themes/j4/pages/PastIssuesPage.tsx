// Past issues (reference language: cover showcase card, white hairline cards on the slate canvas): a header card with the latest cover, the archive matrix
// (volumes by issue number) and a filterable list of every archived article below.
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { buttonClass } from '../components/Button'
import { IssueCover } from '../components/IssueCover'
import { Container, EmptyState } from '../components/primitives'
import { ArrowRight, Send } from '../icons'
import { ArchiveList } from './archive/ArchiveList'
import { ArchiveMatrix, type VolumeRow } from './archive/ArchiveMatrix'

export function PastIssuesPage({ issues, articles }: { issues: IssueSummary[]; articles: ArticleSummary[] }) {
  const rows = useMemo<VolumeRow[]>(() => {
    const m = new Map<number, IssueSummary[]>()
    issues.forEach((i) => m.set(i.volume, [...(m.get(i.volume) ?? []), i]))
    return [...m.entries()].sort((a, b) => b[0] - a[0]).map(([volume, list]) => {
      const sorted = [...list].sort((a, b) => a.issue - b.issue)
      return { volume, year: sorted[0].month.slice(0, 4), issues: sorted, articles: sorted.reduce((s, i) => s + i.articleCount, 0) }
    })
  }, [issues])
  const latest = issues.find((i) => i.isCurrent) ?? [...issues].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))[0]

  return (
    <div className="bg-abyss-50">
      <Helmet><title>{`Past issues | ${journal.shortName}`}</title></Helmet>
      <Container className="py-6 sm:py-8">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-x-2 text-xs text-steel-600">
            <li><AppLink to={paths.home} className="hover:text-cobalt-700 hover:underline">Home</AppLink></li><li aria-hidden="true" className="text-abyss-400">/</li>
            <li aria-current="page" className="font-medium text-abyss-900">Archive</li>
          </ol>
        </nav>

        <section aria-labelledby="archive-title" className="rounded-pane border border-sky-200 bg-white p-4 shadow-hair sm:p-6">
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_13rem] lg:gap-10">
            <div className="min-w-0 space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-cobalt-700">Archive</p>
              <h1 id="archive-title" className="font-serif4 text-2xl font-bold leading-tight tracking-tight text-[#0b2545] md:text-[2rem]">Past issues</h1>
              <p className="max-w-2xl text-sm leading-relaxed text-abyss-700">Every issue of {journal.name}. Open any issue to read its table of contents, or search all articles below.</p>
              {latest && (
                <div className="flex flex-wrap gap-2">
                  <AppLink to={paths.issue(latest.volume, latest.issue)} className={buttonClass('cta', 'min-h-11 px-3.5 py-2 text-xs lg:min-h-9')}>Open latest issue<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
                  <AppLink to={paths.submit} className={buttonClass('outline', 'min-h-11 px-3.5 py-2 text-xs lg:min-h-9')}><Send className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Submit manuscript</AppLink>
                </div>
              )}
            </div>
            {latest && (
              <AppLink to={paths.issue(latest.volume, latest.issue)} aria-label={`Open Volume ${latest.volume}, Issue ${latest.issue}, ${formatMonthYear(latest.month)}`}
                className="mx-auto block w-40 rounded-pane transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-2 motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:w-full">
                <IssueCover issue={latest} />
              </AppLink>
            )}
          </div>
        </section>

        <section aria-labelledby="archive-matrix" className="mt-8">
          <div className="mb-4">
            <p className="text-xs font-bold uppercase tracking-wider text-cobalt-700">Issue matrix</p>
            <h2 id="archive-matrix" className="mt-1 font-serif4 text-xl font-bold text-[#0b2545] md:text-2xl">Volumes and issues</h2>
            <p className="mt-1 text-sm text-abyss-700">Published issues, newest first.</p>
          </div>
          {rows.length === 0 ? <EmptyState title="No issues published yet" text="Issues will appear here as soon as they are released." /> : (
            <div>
              <ArchiveMatrix rows={rows} />
            </div>
          )}
        </section>
      </Container>

      <section aria-labelledby="archive-articles" className="border-t border-abyss-200 py-10 sm:py-12">
        <Container>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-wider text-cobalt-700">Archive search</p>
            <h2 id="archive-articles" className="mt-1 font-serif4 text-xl font-bold text-[#0b2545] md:text-2xl">All archived articles</h2>
            <p className="mt-1 text-sm text-abyss-700">Filter by research area, article type or issue, or search by title and author.</p>
          </div>
          <ArchiveList articles={articles} />
        </Container>
      </section>
    </div>
  )
}
