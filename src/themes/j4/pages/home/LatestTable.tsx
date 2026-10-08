// "Latest articles": a sortable data table (title and authors on two lines, type, pages, date, views, actions). A row expands to show the abstract.
// On phones the same data is shown as a list of cards. Titles wrap; nothing is cut off with an ellipsis.
import { Fragment, useMemo, useState } from 'react'
import { paths } from '../../../../config/routes'
import { formatDate, formatNumber } from '../../../../core/lib/format'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { areaColor } from '../../components/areas'
import { CiteMenu } from '../../components/CiteMenu'
import { Container, cx, SectionHead } from '../../components/primitives'
import { ArrowDown, ArrowRight, ArrowUp, ChevronDown, Download, Quote, Unfold } from '../../icons'

type Key = 'title' | 'type' | 'date' | 'views'
const act = 'inline-flex h-8 items-center gap-1.5 rounded-ctl border border-abyss-300 bg-white px-2.5 text-xs font-semibold text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700'

export function LatestTable({ articles }: { articles: ArticleSummary[] }) {
  const [sort, setSort] = useState<{ key: Key; dir: 1 | -1 }>({ key: 'date', dir: -1 })
  const [open, setOpen] = useState<string | null>(null)
  const rows = useMemo(() => {
    const v = (a: ArticleSummary) => (sort.key === 'title' ? a.title.toLowerCase() : sort.key === 'type' ? a.type : sort.key === 'date' ? a.publishedAt : a.views)
    return [...articles].sort((a, b) => (v(a) < v(b) ? -1 : v(a) > v(b) ? 1 : b.views - a.views) * sort.dir)
  }, [articles, sort])
  const toggleSort = (key: Key) => setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: key === 'title' || key === 'type' ? 1 : -1 }))
  const th = (key: Key, label: string, cls?: string) => {
    const on = sort.key === key
    return (
      <th scope="col" aria-sort={on ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'} className={cx('px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-steel-700', cls)}>
        <button type="button" onClick={() => toggleSort(key)} className="inline-flex items-center gap-1 uppercase hover:text-cobalt-700">
          {label}{on ? (sort.dir === 1 ? <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />) : <Unfold className="h-3.5 w-3.5 text-steel-400" aria-hidden="true" />}
        </button>
      </th>
    )
  }
  const actions = (a: ArticleSummary) => (
    <div className="flex flex-wrap gap-1.5">
      <button type="button" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`} className={act}><Download className="h-3.5 w-3.5" aria-hidden="true" />PDF</button>
      <CiteMenu article={a} className={act}><Quote className="h-3.5 w-3.5" aria-hidden="true" />Cite</CiteMenu>
    </div>
  )

  return (
    <section aria-labelledby="latest-title" className="border-y border-abyss-200 bg-abyss-50 py-16 sm:py-24">
      <Container>
        <SectionHead id="latest-title" label="Latest articles" title="In the current issue" text="Sort by title, type, date or views. Open a row to read the abstract."
          action={<AppLink to={paths.currentIssue} className="inline-flex items-center gap-1 text-sm font-semibold text-cobalt-700 hover:underline">Full issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>} />

        <div className="hidden overflow-x-auto rounded-pane border border-abyss-200 bg-white md:block">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <caption className="sr-only">Latest articles in the current issue</caption>
            <thead className="border-b border-abyss-300 bg-abyss-100">
              <tr>{th('title', 'Article', 'w-[46%]')}{th('type', 'Type')}<th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-steel-700">Pages</th>{th('date', 'Date')}{th('views', 'Views', 'text-right')}<th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-steel-700"><span className="sr-only">Actions</span></th></tr>
            </thead>
            <tbody>
              {rows.map((a, i) => {
                const expanded = open === a.paperId
                return (
                  <Fragment key={a.paperId}>
                    <tr className={cx('border-b border-abyss-100 align-top', i % 2 ? 'bg-abyss-50/70' : 'bg-white')}>
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          <button type="button" aria-expanded={expanded} aria-controls={`abs-${a.paperId}`} aria-label={`${expanded ? 'Hide' : 'Show'} abstract: ${a.title}`} onClick={() => setOpen(expanded ? null : a.paperId)} className="mt-0.5 rounded-ctl p-1 text-steel-500 hover:bg-abyss-100 hover:text-abyss-900">
                            <ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', expanded && 'rotate-180')} aria-hidden="true" />
                          </button>
                          <div className="min-w-0">
                            <AppLink to={paths.article(a.paperId)} className="font-serif4 text-[1.0625rem] font-semibold leading-snug text-abyss-900 hover:text-cobalt-700">{a.title}</AppLink>
                            <p className="mt-1 text-[13px] text-steel-600">{a.authors.join(', ')}</p>
                            <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: areaColor(a.subject) }}><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: areaColor(a.subject) }} />{a.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-abyss-800">{a.type}</td>
                      <td className="px-4 py-4 text-sm tabular-nums text-abyss-800">{a.pages}</td>
                      <td className="whitespace-nowrap px-4 py-4 text-sm tabular-nums text-abyss-800">{formatDate(a.publishedAt)}</td>
                      <td className="px-4 py-4 text-right text-sm tabular-nums text-abyss-800">{formatNumber(a.views)}<span className="block text-xs text-steel-500">{formatNumber(a.downloads)} downloads</span></td>
                      <td className="px-4 py-4">{actions(a)}</td>
                    </tr>
                    {expanded && (
                      <tr id={`abs-${a.paperId}`} className="border-b border-abyss-100 bg-azure-50/50">
                        <td colSpan={6} className="px-4 py-4 pl-14"><p className="max-w-3xl text-sm leading-relaxed text-steel-700"><span className="font-semibold text-abyss-900">Abstract. </span>{a.abstract}</p></td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        <ul className="space-y-3 md:hidden">
          {rows.map((a) => (
            <li key={a.paperId} className="rounded-pane border border-abyss-200 bg-white p-4">
              <p className="text-xs font-semibold" style={{ color: areaColor(a.subject) }}>{a.subject}</p>
              <AppLink to={paths.article(a.paperId)} className="mt-1 block font-serif4 text-lg font-semibold leading-snug text-abyss-900">{a.title}</AppLink>
              <p className="mt-1 text-[13px] text-steel-600">{a.authors.join(', ')}</p>
              <p className="mt-2 text-xs tabular-nums text-steel-600">{a.type} · pp. {a.pages} · {formatDate(a.publishedAt)} · {formatNumber(a.views)} views</p>
              <div className="mt-3">{actions(a)}</div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
