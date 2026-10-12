// Issue header card (reference: cover showcase): status chips, the issue cover, the issue title and summary, a facts strip and the issue actions.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadText } from '../../../../core/lib/clipboard'
import { formatDate, formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../../core/types'
import { IssueCover } from '../../components/IssueCover'
import { MdOutlineHome as Home, MdOutlineMenuBook as Book } from 'react-icons/md'
import { Download, OpenAccess, Send } from '../../icons'

const csv = (v: string) => `"${v.replace(/"/g, '""')}"`

/** The table of contents as a CSV file, built in the browser from the issue's own data. */
function downloadIndex(issue: IssueSummary, articles: ArticleSummary[]) {
  const head = ['Pages', 'Type', 'Title', 'Authors', 'Research area', 'DOI'].map(csv).join(',')
  const rows = articles.map((a) => [a.pages, a.type, a.title, a.authors.join('; '), a.subject, `${journal.doiPrefix}/${a.paperId}`].map(csv).join(','))
  downloadText(`${journal.shortName}-v${issue.volume}-i${issue.issue}-index.csv`, `﻿${[head, ...rows].join('\r\n')}`, 'text/csv;charset=utf-8')
}

export function IssueHeader({ issue, articles }: { issue: IssueSummary; articles: ArticleSummary[] }) {
  const areaCount = new Set(articles.map((a) => a.subject)).size
  const facts: [string, string, boolean?, boolean?][] = [
    ['DOI Prefix', journal.doiPrefix, false, true], ['Access Model', 'Open Access', true], ['Peer Review', 'Single-anonymised'], ['License', journal.licence.name, false, false],
  ]
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <li><AppLink to={paths.home} className="inline-flex items-center gap-1 transition-colors hover:text-cobalt-700"><Home className="h-4 w-4" aria-hidden="true" />Home</AppLink></li><li aria-hidden="true" className="text-slate-400">/</li>
          <li><AppLink to={issue.isCurrent ? paths.currentIssue : paths.pastIssues} className="transition-colors hover:text-cobalt-700">{issue.isCurrent ? 'Current Issue' : 'Archive'}</AppLink></li><li aria-hidden="true" className="text-slate-400">/</li>
          <li aria-current="page" className="font-medium text-slate-800">Volume {issue.volume} • Issue {issue.issue} ({formatMonthYear(issue.month)})</li>
        </ol>
      </nav>
      <section aria-labelledby="issue-title" className="relative overflow-hidden rounded-[12px] border border-[#bfdbfe] bg-white p-5 shadow-hair md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-xs font-bold uppercase ${issue.isCurrent ? 'border-sky-200 bg-sky-50 text-cobalt-700' : 'border-slate-300 bg-slate-100 text-slate-700'}`}>
              <span aria-hidden="true" className={`h-2 w-2 rounded-full ${issue.isCurrent ? 'bg-emerald-500' : 'bg-slate-500'}`} />{issue.isCurrent ? 'Current Issue' : 'Past Issue'}
            </span>
            <span className="rounded border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">Volume {issue.volume} • Issue {issue.issue}</span>
            <span className="rounded bg-slate-50 px-2 py-1 font-mono text-xs text-slate-500">Published: {formatDate(issue.publishedAt)}</span>
          </div>
          <p className="break-all font-mono text-xs font-semibold text-cobalt-700">DOI: {issue.doi}</p>
        </div>

        <div className="grid items-center gap-6 md:grid-cols-12">
          <div className="flex justify-center md:col-span-4"><IssueCover issue={issue} /></div>
          <div className="min-w-0 space-y-4 md:col-span-8">
            <div className="space-y-1.5">
              <p className="text-xs font-bold uppercase tracking-wider text-cobalt-700">{issue.isCurrent ? 'Issue Focus' : 'Table of Contents'}</p>
              <h1 id="issue-title" className="font-serif4 text-2xl font-bold leading-tight tracking-tight text-[#0b2545] md:text-3xl">Volume {issue.volume} Issue {issue.issue} - {formatMonthYear(issue.month)}</h1>
              <p className="text-xs leading-relaxed text-slate-600 md:text-sm">
                {articles.length} peer-reviewed {articles.length === 1 ? 'article' : 'articles'} across {areaCount} research {areaCount === 1 ? 'area' : 'areas'}, published online on {formatDate(issue.publishedAt)} in {journal.name} ({journal.shortName}), ISSN {journal.issnOnline}.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 rounded-lg border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-xs sm:grid-cols-4">
              {facts.map(([k, v, oa, serif]) => (
                <div key={k}>
                  <dt className="block text-[11px] text-slate-500">{k}</dt>
                  <dd className={`flex items-center gap-1 text-sm ${oa ? 'font-semibold text-emerald-700' : serif ? 'font-serif4 font-bold text-slate-900' : serif === false ? 'font-mono font-medium text-slate-700' : 'font-semibold text-slate-800'}`}>{oa && <OpenAccess className="h-4 w-4" aria-hidden="true" />}{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button type="button" onClick={() => downloadIndex(issue, articles)} className="inline-flex min-h-11 items-center gap-1.5 rounded bg-cobalt-700 px-3.5 py-2 text-xs font-semibold text-white shadow-hair transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-1 lg:min-h-9"><Download className="h-4 w-4" aria-hidden="true" />Download Index (CSV)</button>
              <AppLink to={paths.pastIssues} className="inline-flex min-h-11 items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-9"><Book className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Browse Archive</AppLink>
              <AppLink to={paths.submit} className="inline-flex min-h-11 items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-9"><Send className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Submit Manuscript</AppLink>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
