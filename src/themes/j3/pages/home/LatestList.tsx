// Main column: switchable article lists (Latest, Most read) as bordered entries with DOI, views, citations and quick links, plus a numbered pager.
import { useState } from 'react'
import { api } from '../../../../core/api'
import { doiFor } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatCitation } from '../../../../core/lib/cite'
import { copyText } from '../../../../core/lib/clipboard'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import { Eye, Quote } from '../../icons'
import { Chip, labelCls, OaMark, panel } from './bits'

const PAGE = 4
const link = 'hover:text-ember-700 hover:underline'

function Entry({ a, tone }: { a: ArticleSummary; tone: number }) {
  const toast = useToast()
  const cite = async () => {
    const full = await api.getArticle(a.paperId)
    if (full) { await copyText(formatCitation(full, 'apa')); toast('Citation copied (APA)') }
  }
  return (
    <article className={cx(panel, 'flex flex-col gap-2.5 p-5')}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <Chip tone={tone}>{a.type}</Chip>
          <Chip tone={tone + 1} className="normal-case tracking-normal">{a.subject}</Chip>
          <OaMark />
        </div>
        <span className="font-inter text-xs text-mauve-600">Published online: {formatDate(a.publishedAt)}</span>
      </div>
      <h3 className="font-jakarta text-[1.375rem] font-semibold leading-snug text-iris-700"><AppLink to={paths.article(a.paperId)} className="hover:text-ember-700">{a.title}</AppLink></h3>
      <p className="font-jakarta text-base text-mauve-600">{a.authors.join(', ')}</p>
      <p className="font-jakarta text-[1.0625rem] leading-relaxed text-night-700">{a.abstract}</p>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-iris-50 p-3 font-inter text-xs">
        <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-mauve-600">
          <span className="break-all">DOI: <a href={`https://doi.org/${doiFor(a.paperId)}`} target="_blank" rel="noreferrer" className="text-iris-700 underline">{doiFor(a.paperId)}</a></span>
          <span className="inline-flex items-center gap-1" title="Views"><Eye className="h-4 w-4 text-iris-600" aria-hidden="true" /><strong className="text-night-700">{a.views.toLocaleString('en-US')}</strong><span className="sr-only"> views</span></span>
          <span className="inline-flex items-center gap-1" title="Citations"><Quote className="h-4 w-4 text-iris-600" aria-hidden="true" /><strong className="text-night-700">{a.citations}</strong><span className="sr-only"> citations</span></span>
        </p>
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-semibold text-iris-700">
          <AppLink to={paths.article(a.paperId)} className={link}>[Full text]</AppLink>
          <button type="button" onClick={() => { downloadArticlePdf(a); toast(`${a.paperId}.pdf downloaded`) }} className={link}>[PDF]</button>
          <button type="button" onClick={cite} className={link}>[Copy citation]</button>
        </p>
      </div>
    </article>
  )
}

export function LatestList({ latest, mostRead, issueLabel }: { latest: ArticleSummary[]; mostRead: ArticleSummary[]; issueLabel: string }) {
  const tabs = [{ id: 'latest', label: 'Latest research articles', items: latest }, { id: 'read', label: 'Most read', items: mostRead }].filter((t) => t.items.length)
  const [tab, setTab] = useState(tabs[0]?.id ?? 'latest')
  const [page, setPage] = useState(1)
  const cur = tabs.find((t) => t.id === tab) ?? tabs[0]
  if (!cur) return null
  const pages = Math.ceil(cur.items.length / PAGE)
  const shown = cur.items.slice((page - 1) * PAGE, page * PAGE)
  const from = (page - 1) * PAGE + 1
  const pick = (id: string) => { setTab(id); setPage(1) }
  return (
    <section aria-label="Research articles" className="flex min-w-0 flex-col gap-5 lg:col-span-8">
      <div role="tablist" aria-label="Article lists" className="flex items-center gap-1 overflow-x-auto bg-iris-50 p-1">
        {tabs.map((t) => (
          <button key={t.id} id={`home-tab-${t.id}`} role="tab" type="button" aria-selected={tab === t.id} aria-controls="home-list" onClick={() => pick(t.id)}
            className={cx(labelCls, 'whitespace-nowrap px-4 py-2 tracking-[0.06em] transition-colors', tab === t.id ? 'bg-iris-700 text-white' : 'text-mauve-600 hover:bg-iris-100 hover:text-iris-700')}>{t.label}</button>
        ))}
      </div>
      <div id="home-list" role="tabpanel" aria-labelledby={`home-tab-${cur.id}`} className="flex flex-col gap-5">
        {shown.map((a, i) => <Entry key={a.paperId} a={a} tone={i % 3} />)}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-iris-50 p-4">
        <p className="font-inter text-xs text-mauve-600">Displaying {from}–{from + shown.length - 1} of {cur.items.length} articles{cur.id === 'latest' ? ` in ${issueLabel}` : ''}</p>
        {pages > 1 && (
          <nav aria-label="Article pages" className="flex items-center gap-1 font-inter text-sm">
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" onClick={() => setPage(n)} aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined}
                className={cx('h-8 min-w-8 px-3', n === page ? 'bg-iris-700 font-bold text-white' : 'bg-iris-100 text-iris-700 hover:bg-iris-200')}>{n}</button>
            ))}
          </nav>
        )}
      </div>
    </section>
  )
}
