// Past issues as an archive matrix (volumes by issue number) with a filterable list of every archived article below.
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { formatNumber } from '../../../core/lib/format'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { PageBand, PARCHMENT, PlateHead } from '../components/PageBand'
import { Container, EmptyState } from '../components/primitives'
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
          <div className="border border-ochre-300/40 p-1">
            <dl className="grid grid-cols-3 gap-px overflow-hidden border border-ochre-300/25 bg-ochre-300/25 text-center tabular-nums">
              {stats.map(([k, v]) => <div key={k} className="bg-wine-900 px-4 py-3 sm:px-6"><dt className="font-work text-[11px] font-semibold uppercase tracking-[0.1em] text-bordeaux-200">{k}</dt><dd className="mt-1 font-newsreader text-3xl font-semibold">{v}</dd></div>)}
            </dl>
          </div>
        }>
        <p className="mt-4 max-w-xl font-serif4 text-base leading-relaxed text-bordeaux-100 sm:text-[1.0625rem]">Every issue of {journal.name}. Choose a published issue in the matrix to open its table of contents, or search all articles below.</p>
      </PageBand>

      <div className={PARCHMENT}><Container className="py-12 sm:py-16">
        <PlateHead label="Issue matrix" title="Volumes and issues" text="Each volume holds up to twelve monthly issues. Greyed cells have not been published yet." />
        {rows.length === 0 ? <EmptyState title="No issues published yet" text="Issues will appear here as soon as they are released." /> : (
          <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
            <aside aria-label="Archive overview" className="lg:sticky lg:top-16 lg:self-start">
              <div className="rounded border border-wine-800/20 border-t-2 border-t-wine-800 bg-white shadow-none">
                <h3 className="border-b border-wine-800/15 bg-[#FBF8F4] px-4 py-3 font-newsreader text-lg font-semibold text-obsidian-900">Jump to volume</h3>
                <ul className="divide-y divide-obsidian-100 text-sm">
                  {rows.map((r) => (
                    <li key={r.volume}>
                      <a href={`#vol-${r.volume}`} className="flex min-h-11 items-center justify-between gap-3 px-4 py-2 text-obsidian-900 transition-colors hover:bg-ochre-50 hover:text-wine-700 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wine-700 lg:min-h-10">
                        <span className="font-newsreader text-base font-semibold">Volume {r.volume} <span className="font-work text-sm font-normal text-obsidian-600">· {r.year}</span></span>
                        <span className="tabular-nums text-obsidian-600">{r.articles}<span className="sr-only"> articles</span></span>
                      </a>
                    </li>
                  ))}
                </ul>
                <div className="space-y-2 border-t border-wine-800/15 p-4 text-[13px] text-obsidian-700">
                  <p className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-5 rounded-sm border border-ochre-600 bg-ochre-50" />Current issue</p>
                  <p className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-5 rounded-sm border border-obsidian-300 bg-white" />Published issue</p>
                  <p className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-5 rounded-sm border border-dashed border-obsidian-300 bg-obsidian-50" />Not yet published</p>
                </div>
              </div>
            </aside>
            <ArchiveMatrix rows={rows} />
          </div>
        )}
      </Container></div>

      <section aria-labelledby="archive-articles" className="border-t border-wine-800/20 bg-white py-12 sm:py-16">
        <Container>
          <PlateHead id="archive-articles" label="Archive search" title="All archived articles" text="Filter by research area, article type or issue, or search by title and author." />
          <ArchiveList articles={articles} />
        </Container>
      </section>
    </>
  )
}
