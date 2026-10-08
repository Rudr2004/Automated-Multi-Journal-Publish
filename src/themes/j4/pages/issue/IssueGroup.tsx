// One article-type group of the issue: a dense data table on desktop (rows expand to the abstract) and a card list on phones.
import { Fragment, useId, useState } from 'react'
import { paths } from '../../../../config/routes'
import { formatDate, formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { ArticleActions, AreaTag } from '../../components/PageBand'
import { cx } from '../../components/primitives'
import { ChevronDown } from '../../icons'
import type { IssueSort } from './filter'

const TH = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-steel-700'

export function IssueGroup({ title, items, sort, onSort }: { title: string; items: ArticleSummary[]; sort: IssueSort; onSort: (s: IssueSort) => void }) {
  const uid = useId()
  const [open, setOpen] = useState<string | null>(null)
  const head = (key: IssueSort, label: string, cls?: string) => (
    <th scope="col" aria-sort={sort === key ? (key === 'title' || key === 'pages' ? 'ascending' : 'descending') : 'none'} className={cx(TH, cls)}>
      <button type="button" onClick={() => onSort(key)} className="-mx-1 inline-flex min-h-8 items-center gap-1 rounded-ctl px-1 uppercase hover:text-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
        {label}{sort === key && <span aria-hidden="true" className="text-cobalt-700">{key === 'title' || key === 'pages' ? '↑' : '↓'}</span>}
      </button>
    </th>
  )
  return (
    <section aria-labelledby={`${uid}-h`} className="mt-12 first:mt-0">
      <h2 id={`${uid}-h`} className="mb-4 flex items-baseline gap-3 font-serif4 text-[1.5rem] font-semibold tracking-tight text-abyss-900 sm:text-[1.875rem]">
        {title}<span className="text-base font-medium tabular-nums text-steel-600">{items.length}</span>
      </h2>

      <div className="hidden overflow-x-auto rounded-pane border border-abyss-200 bg-white md:block">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <caption className="sr-only">{title} in this issue, {items.length} {items.length === 1 ? 'article' : 'articles'}</caption>
          <thead className="border-b border-abyss-300 bg-abyss-100">
            <tr>
              {head('title', 'Article', 'w-[44%]')}
              <th scope="col" className={TH}>Type</th>
              {head('pages', 'Pages')}
              <th scope="col" className={TH}>Date</th>
              {head('views', 'Views', 'text-right')}
              {head('downloads', 'Downloads', 'text-right')}
              <th scope="col" className={TH}><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a, i) => {
              const expanded = open === a.paperId
              return (
                <Fragment key={a.paperId}>
                  <tr className={cx('border-b border-abyss-100 align-top', i % 2 ? 'bg-abyss-50/70' : 'bg-white')}>
                    <th scope="row" className="px-4 py-4 text-left font-normal">
                      <div className="flex items-start gap-2">
                        <button type="button" aria-expanded={expanded} aria-controls={`${uid}-${a.paperId}`} aria-label={`${expanded ? 'Hide' : 'Show'} abstract: ${a.title}`} onClick={() => setOpen(expanded ? null : a.paperId)}
                          className="-ml-2 mt-[-2px] inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl text-steel-600 hover:bg-abyss-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:h-9 lg:w-9">
                          <ChevronDown className={cx('h-5 w-5 transition-transform motion-reduce:transition-none', expanded && 'rotate-180')} aria-hidden="true" />
                        </button>
                        <div className="min-w-0">
                          <AppLink to={paths.article(a.paperId)} className="font-serif4 text-[1.0625rem] font-semibold leading-snug text-abyss-900 hover:text-cobalt-700">{a.title}</AppLink>
                          <p className="mt-1 text-[13px] text-steel-600">{a.authors.join(', ')}</p>
                          <p className="mt-1"><AreaTag subject={a.subject} /></p>
                        </div>
                      </div>
                    </th>
                    <td className="px-4 py-4 text-sm text-abyss-800">{a.type}</td>
                    <td className="px-4 py-4 text-sm tabular-nums text-abyss-800">{a.pages}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-sm tabular-nums text-abyss-800">{formatDate(a.publishedAt)}</td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-abyss-800">{formatNumber(a.views)}</td>
                    <td className="px-4 py-4 text-right text-sm tabular-nums text-abyss-800">{formatNumber(a.downloads)}</td>
                    <td className="px-4 py-4"><ArticleActions article={a} /></td>
                  </tr>
                  {expanded && (
                    <tr id={`${uid}-${a.paperId}`} className="border-b border-abyss-100 bg-azure-50/50">
                      <td colSpan={7} className="px-4 py-4 pl-14"><p className="max-w-3xl text-sm leading-relaxed text-steel-700"><span className="font-semibold text-abyss-900">Abstract. </span>{a.abstract}</p></td>
                    </tr>
                  )}
                </Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="space-y-3 md:hidden">
        {items.map((a) => {
          const expanded = open === a.paperId
          return (
            <li key={a.paperId} className="rounded-pane border border-abyss-200 bg-white p-4">
              <AreaTag subject={a.subject} />
              <AppLink to={paths.article(a.paperId)} className="mt-1 block font-serif4 text-lg font-semibold leading-snug text-abyss-900">{a.title}</AppLink>
              <p className="mt-1 text-[13px] text-steel-600">{a.authors.join(', ')}</p>
              <p className="mt-2 text-xs tabular-nums text-steel-600">{a.type} · pp. {a.pages} · {formatDate(a.publishedAt)} · {formatNumber(a.views)} views · {formatNumber(a.downloads)} downloads</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ArticleActions article={a} />
                <button type="button" aria-expanded={expanded} aria-controls={`${uid}-m-${a.paperId}`} onClick={() => setOpen(expanded ? null : a.paperId)}
                  className="inline-flex h-11 items-center gap-1 rounded-ctl px-2 text-xs font-semibold text-cobalt-700 hover:bg-azure-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                  Abstract <ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', expanded && 'rotate-180')} aria-hidden="true" />
                </button>
              </div>
              {expanded && <p id={`${uid}-m-${a.paperId}`} className="mt-3 text-sm leading-relaxed text-steel-700">{a.abstract}</p>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
