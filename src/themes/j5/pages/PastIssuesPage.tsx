// Past issues, in the issue reference's visual language: wine banner (breadcrumb, label chip, title, stats box), a 3 + 9 workspace with a
// "Jump to volume" card and the volume plates, then every archived article with the same filter card and article cards.
import { useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineHistory as HistoryIcon } from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { Container, EmptyState } from '../components/primitives'
import { ArrowRight } from '../icons'
import { ArchiveList } from './archive/ArchiveList'
import { ArchiveMatrix, type VolumeRow } from './archive/ArchiveMatrix'

const GREY = 'text-[#6F5A58]'

function BarHeading({ id, title, note }: { id?: string; title: string; note?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div aria-hidden="true" className="h-6 w-1.5 rounded-full bg-wine-800" />
      <h2 id={id} className="font-newsreader text-lg font-bold text-[#141B2B]">{title}</h2>
      {note && <span className={`font-work text-xs ${GREY}`}>• {note}</span>}
    </div>
  )
}

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
  const current = issues.find((i) => i.isCurrent)

  return (
    <>
      <Helmet><title>{`Past issues | ${journal.shortName}`}</title></Helmet>
      <div className="bg-[#F9F9FF] pt-4">
        <Container>
          <section className="relative overflow-hidden rounded border border-[#6B1822] px-6 py-8 text-white shadow-lg sm:px-10" style={{ background: 'linear-gradient(135deg, rgb(74, 14, 23) 0%, rgb(59, 8, 16) 100%)' }}>
            <div className="flex flex-col gap-6">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-2 font-work text-base text-amber-200/80">
                  <li><AppLink to={paths.home} className="transition-colors hover:text-white">Home</AppLink></li><li aria-hidden="true">/</li>
                  <li aria-current="page" className="font-medium text-amber-300">Archives</li>
                </ol>
              </nav>
              <div className="space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded bg-amber-400 px-2.5 py-0.5 font-work text-base font-bold uppercase tracking-wider text-[#3B0810] shadow-sm"><HistoryIcon className="h-[13px] w-[13px]" aria-hidden="true" />Archives</span>
                  <span className="rounded border border-amber-300/40 bg-black/30 px-2.5 py-0.5 font-work text-xs font-semibold uppercase tracking-wide text-amber-200">{journal.shortName} • ISSN {journal.issnOnline}</span>
                </div>
                <div>
                  <h1 className="font-newsreader text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">Past issues</h1>
                  <p className="max-w-3xl pt-1.5 font-serif4 text-sm leading-relaxed text-amber-100/90 sm:text-base">Every issue of {journal.name}. Choose a published issue in the matrix to open its table of contents, or search all articles below.</p>
                </div>
                <dl className="grid max-w-xl grid-cols-3 gap-3 rounded border border-[#6B1822] bg-black/30 p-4 font-work">
                  {stats.map(([k, v]) => <div key={k}><dt className="text-[10px] uppercase text-amber-200/80">{k}</dt><dd className="mt-0.5 font-mono text-sm font-medium tabular-nums text-white">{v}</dd></div>)}
                </dl>
                {current && (
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <AppLink to={paths.issue(current.volume, current.issue)} className="inline-flex min-h-11 items-center gap-2 rounded bg-amber-400 px-4 py-2.5 font-work text-xs font-bold uppercase tracking-wider text-[#3B0810] shadow transition-colors motion-reduce:transition-none hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">Open current issue<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
                  </div>
                )}
              </div>
            </div>
          </section>
        </Container>
      </div>

      <div className="bg-[#F9F9FF]"><Container className="space-y-12 pb-12 pt-8">
        <div className="space-y-5">
          <BarHeading title="Volumes and issues" note="Each volume holds up to twelve monthly issues. Greyed cells have not been published yet." />
          {rows.length === 0 ? <EmptyState title="No issues published yet" text="Issues will appear here as soon as they are released." /> : (
            <div className="grid items-start gap-8 lg:grid-cols-12">
              <aside aria-label="Archive overview" className="min-w-0 space-y-6 lg:col-span-3">
                <div className="space-y-6 rounded bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 pb-1">
                    <h3 className="font-newsreader text-base text-[#141B2B]">Jump to volume</h3>
                    <span className="rounded bg-[#E1E8FD] px-2 py-0.5 font-work text-base text-[#564241]">{rows.length} {rows.length === 1 ? 'volume' : 'volumes'}</span>
                  </div>
                  <ul className="space-y-1 font-work text-base">
                    {rows.map((r) => (
                      <li key={r.volume}>
                        <a href={`#vol-${r.volume}`} className="flex min-h-11 w-full items-center justify-between rounded px-2.5 py-1.5 text-[#564241] transition-colors hover:bg-[#F4F5FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none lg:min-h-0">
                          <span className="flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-wine-800" />Volume {r.volume} <span className={GREY}>· {r.year}</span></span>
                          <span className={`tabular-nums ${GREY}`}>{r.articles}<span className="sr-only"> articles</span></span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3 rounded bg-[#F4F5FC] p-4 shadow-sm">
                  <h3 className="font-work text-base font-bold uppercase tracking-wider text-[#564241]">Key</h3>
                  <ul className="space-y-2 font-work text-[13px] text-[#564241]">
                    <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-5 rounded-sm border border-ochre-700 bg-ochre-50" />Current issue</li>
                    <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-5 rounded-sm border border-[#DCC0BE] bg-white" />Published issue</li>
                    <li className="flex items-center gap-2"><span aria-hidden="true" className="h-3 w-5 rounded-sm border border-dashed border-[#DCC0BE] bg-[#F4F5FC]" />Not yet published</li>
                  </ul>
                </div>
              </aside>
              <div className="min-w-0 lg:col-span-9"><ArchiveMatrix rows={rows} /></div>
            </div>
          )}
        </div>

        <section aria-labelledby="archive-articles" className="space-y-5">
          <BarHeading id="archive-articles" title="All archived articles" note="Filter by research area, article type or issue, or search by title and author." />
          <ArchiveList articles={articles} />
        </section>
      </Container></div>
    </>
  )
}
