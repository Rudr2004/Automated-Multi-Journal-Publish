// Issue header card: dark blueprint band with the issue title and a spec-sheet card (volume, issue, ISSN, DOI, article count).
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { Container, Label } from '../../components/primitives'

export function IssueHeader({ issue }: { issue: IssueSummary }) {
  const rows: [string, string][] = [
    ['Volume', String(issue.volume)], ['Issue', String(issue.issue)], ['Articles', String(issue.articleCount)],
    ['Published', formatDate(issue.publishedAt)], ['ISSN (online)', journal.issnOnline],
  ]
  return (
    <section className="relative isolate bg-abyss-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_72%_30%,black,transparent_72%)]" />
      </div>
      <Container className="py-8 sm:py-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-abyss-300">
            <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
            <li><AppLink to={paths.pastIssues} className="hover:text-white hover:underline">Archive</AppLink></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white">Volume {issue.volume}, Issue {issue.issue}</li>
          </ol>
        </nav>
        <div className="mt-6 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-12">
          <div className="min-w-0">
            <Label className="text-azure-300">{issue.isCurrent ? 'Current issue' : 'Past issue'}</Label>
            <h1 className="mt-3 font-serif4 font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(32px,3.6vw,50px)' }}>
              Volume {issue.volume}, Issue {issue.issue}<span className="block text-abyss-300">{formatMonthYear(issue.month)}</span>
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-abyss-200">Table of contents of {journal.shortName}. Articles are grouped by type; filter by research area on the left.</p>
          </div>
          <dl className="grid grid-cols-3 gap-px overflow-hidden rounded-pane border border-white/15 bg-white/15 text-sm tabular-nums">
            {rows.map(([k, v], i) => (
              <div key={k} className={`bg-abyss-800 px-3.5 py-3 ${i === 3 ? 'col-span-2' : ''}`}>
                <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-abyss-300">{k}</dt>
                <dd className="mt-1 text-base font-medium text-white">{v}</dd>
              </div>
            ))}
            <div className="col-span-3 bg-abyss-800 px-3.5 py-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-abyss-300">Issue DOI</dt>
              <dd className="mt-1 break-all text-base font-medium text-sky-300">{issue.doi}</dd>
            </div>
          </dl>
        </div>
      </Container>
    </section>
  )
}
