// Issue header: classical bordeaux masthead (dateline, double rules, ornament) with the issue title and a details plate (volume, issue, ISSN, DOI, article count).
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { Dateline, DoubleRule } from '../../components/PageBand'
import { Container } from '../../components/primitives'
import { OrnamentRule } from '../../components/signature'

export function IssueHeader({ issue }: { issue: IssueSummary }) {
  const rows: [string, string][] = [
    ['Volume', String(issue.volume)], ['Issue', String(issue.issue)], ['Articles', String(issue.articleCount)],
    ['Published', formatDate(issue.publishedAt)], ['ISSN (online)', journal.issnOnline],
  ]
  return (
    <section className="relative isolate overflow-hidden bg-bordeaux-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgba(180,83,9,0.28),transparent_55%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(252,211,77,0.07)_1px,transparent_1px)] [background-size:6px_6px]" />
      <Container className="pb-10 pt-6 sm:pb-12">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-bordeaux-200">
            <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
            <li><AppLink to={paths.pastIssues} className="hover:text-white hover:underline">Archive</AppLink></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white">Volume {issue.volume}, Issue {issue.issue}</li>
          </ol>
        </nav>
        <DoubleRule />
        <Dateline label={issue.isCurrent ? 'Current issue' : 'Past issue'} text={`Volume ${issue.volume} · Issue ${issue.issue} · ${formatMonthYear(issue.month)} · ISSN ${journal.issnOnline}`} />
        <DoubleRule />
        <div className="mt-8 grid items-end gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-12">
          <div className="min-w-0">
            <h1 className="font-newsreader font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(32px,3.6vw,50px)' }}>
              Volume {issue.volume}, Issue {issue.issue}<span className="block font-normal italic text-ochre-300">{formatMonthYear(issue.month)}</span>
            </h1>
            <OrnamentRule tone="dark" className="mt-5 max-w-[16rem]" />
            <p className="mt-4 max-w-xl font-serif4 text-base leading-relaxed text-bordeaux-100">Table of contents of {journal.shortName}. Articles are grouped by type; filter by research area on the left.</p>
          </div>
          <div className="border border-ochre-300/40 p-1">
            <dl className="grid grid-cols-3 gap-px overflow-hidden border border-ochre-300/25 bg-ochre-300/25 text-sm tabular-nums">
              {rows.map(([k, v], i) => (
                <div key={k} className={`bg-wine-900 px-3.5 py-3 ${i === 3 ? 'col-span-2' : ''}`}>
                  <dt className="font-work text-[11px] font-semibold uppercase tracking-[0.1em] text-bordeaux-200">{k}</dt>
                  <dd className="mt-1 font-newsreader text-lg font-semibold text-white">{v}</dd>
                </div>
              ))}
              <div className="col-span-3 bg-wine-900 px-3.5 py-3">
                <dt className="font-work text-[11px] font-semibold uppercase tracking-[0.1em] text-bordeaux-200">Issue DOI</dt>
                <dd className="mt-1 break-all font-work text-base font-medium text-ochre-300">{issue.doi}</dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  )
}
