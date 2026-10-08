// Past issues as an archive matrix (volumes by issue number) with a filterable list of every archived article below.
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { formatNumber } from '../../../core/lib/format'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { PageBand } from '../components/PageBand'
import { Container, EmptyState, SectionHead } from '../components/primitives'
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
  const stats: [string, string][] = [['Volumes', String(rows.length)], ['Issues', String(issues.length)], ['Articles', formatNumber(articles.length)]]

  return (
    <>
      <Helmet><title>{`Past issues | ${journal.shortName}`}</title></Helmet>
      <PageBand label="Archive" title="Past issues"
        aside={
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-pane border border-white/15 bg-white/15 text-center tabular-nums">
            {stats.map(([k, v]) => <div key={k} className="bg-abyss-800 px-5 py-3"><dt className="text-xs font-semibold uppercase tracking-[0.06em] text-abyss-300">{k}</dt><dd className="mt-1 font-serif4 text-2xl font-semibold">{v}</dd></div>)}
          </dl>
        }>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-abyss-200 sm:text-[1.0625rem]">Every issue of {journal.name}. Choose a published issue in the matrix to open its table of contents, or search all articles below.</p>
      </PageBand>

      <Container className="py-12 sm:py-16">
        <SectionHead label="Issue matrix" title="Volumes and issues" text="Each volume holds up to twelve monthly issues. Greyed cells have not been published yet." />
        {rows.length === 0 ? <EmptyState title="No issues published yet" text="Issues will appear here as soon as they are released." /> : <ArchiveMatrix rows={rows} />}
      </Container>

      <section aria-labelledby="archive-articles" className="border-t border-abyss-200 bg-white py-12 sm:py-16">
        <Container>
          <SectionHead id="archive-articles" label="Archive search" title="All archived articles" text="Filter by research area, article type or issue, or search by title and author." />
          <ArchiveList articles={articles} />
        </Container>
      </section>
    </>
  )
}
