// "03 Recently published articles": ruled entries with type, Open Access and Editor's Choice tags, authors, abstract excerpt, DOI, pages and the Full text / PDF / Cite actions.
// Tabs switch between Latest releases, Most read and Highest impact (most cited); each tab lists the first four.
import { useState } from 'react'
import { api } from '../../../../core/api'
import { doiFor } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatCitation } from '../../../../core/lib/cite'
import { copyText } from '../../../../core/lib/clipboard'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import { Download, Eye, Quote } from '../../icons'
import { btnSecondary, labelCls, miniBtn, OaMark, panel, SquareHead, Tag } from './bits'

const SHOWN = 4
const trim = (t: string, n = 230) => (t.length > n ? `${t.slice(0, n).replace(/\s+\S*$/, '')}…` : t)

function Entry({ a, choice, openAccess }: { a: ArticleSummary; choice: boolean; openAccess: boolean }) {
  const toast = useToast()
  const cite = async () => {
    const full = await api.getArticle(a.paperId)
    if (full) { await copyText(formatCitation(full, 'apa')); toast('Citation copied (APA)') }
  }
  return (
    <article className="border-b border-j3paper-rule p-5 last:border-b-0">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="flex flex-wrap items-center gap-2">
          {openAccess && <OaMark />}
          {choice && <Tag tone="plain"><Quote className="h-3.5 w-3.5 text-ember-600" aria-hidden="true" />Editor&rsquo;s choice</Tag>}
          <span className={`${labelCls} text-mauve-700`}>{a.type}</span>
        </p>
        <span className={`${labelCls} text-mauve-600`}>Vol. {a.volume}, Issue {a.issue} &bull; {formatMonthYear(a.publishedAt)}</span>
      </div>
      <h3 className="mt-3 font-jakarta text-[1.25rem] font-semibold leading-snug text-night-900"><AppLink to={paths.article(a.paperId)} className="hover:text-iris-700 hover:underline">{a.title}</AppLink></h3>
      <p className="mt-2 font-inter text-[13px] font-semibold text-night-900">{a.authors.join(', ')} <span className="font-normal text-mauve-600">&bull; {a.subject}</span></p>
      <p className="mt-2 font-inter text-sm leading-relaxed text-night-700">{trim(a.abstract)}</p>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-inter text-[11px] text-mauve-600">
          <span className="break-all font-mono tabular-nums">DOI: <a href={`https://doi.org/${doiFor(a.paperId)}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-iris-700">{doiFor(a.paperId)}</a></span>
          <span className="tabular-nums">pp. {a.pages}</span>
          <span className="inline-flex items-center gap-1" title="Views"><Eye className="h-4 w-4" aria-hidden="true" /><span className="font-semibold tabular-nums text-night-900">{a.views.toLocaleString('en-US')}</span><span className="sr-only"> views</span></span>
          <span className="inline-flex items-center gap-1" title="Citations"><Quote className="h-4 w-4" aria-hidden="true" /><span className="font-semibold tabular-nums text-night-900">{a.citations}</span><span className="sr-only"> citations</span></span>
        </p>
        <p className="flex flex-wrap items-center gap-2">
          <AppLink to={paths.article(a.paperId)} className={`${miniBtn} border border-j3paper-rule bg-white text-night-900 hover:border-iris-700 hover:bg-j3paper-cool`}>Full Text HTML</AppLink>
          <button type="button" onClick={() => { downloadArticlePdf(a); toast(`${a.paperId}.pdf downloaded`) }} className={`${miniBtn} bg-iris-700 text-white hover:bg-iris-800`}><Download className="h-4 w-4" aria-hidden="true" />Download PDF</button>
          <button type="button" onClick={cite} className={`${miniBtn} border border-j3paper-rule bg-white text-night-900 hover:border-iris-700 hover:bg-j3paper-cool`}>Cite</button>
        </p>
      </div>
    </article>
  )
}

export function LatestList({ latest, mostRead, pool, choiceIds, openAccess }: { latest: ArticleSummary[]; mostRead: ArticleSummary[]; pool: ArticleSummary[]; choiceIds: string[]; openAccess: boolean }) {
  const cited = [...pool].sort((a, b) => b.citations - a.citations || b.views - a.views)
  const tabs = [
    { id: 'latest', label: 'Latest releases', items: latest.filter((a) => a.type !== 'Editorial') },
    { id: 'read', label: 'Most read', items: mostRead },
    { id: 'impact', label: 'Highest impact', items: cited },
  ].filter((t) => t.items.length)
  const [tab, setTab] = useState(tabs[0]?.id ?? 'latest')
  const cur = tabs.find((t) => t.id === tab) ?? tabs[0]
  if (!cur) return null
  return (
    <section aria-labelledby="home-recent">
      <SquareHead id="home-recent" n="03" title="Recently published articles" aside={
        <div role="tablist" aria-label="Article lists" className="flex items-center gap-4">
          {tabs.map((t) => (
            <button key={t.id} id={`home-tab-${t.id}`} role="tab" type="button" aria-selected={cur.id === t.id} aria-controls="home-list" onClick={() => setTab(t.id)}
              className={cx('border-b-2 py-1 font-inter text-[13px] transition-colors', cur.id === t.id ? 'border-iris-700 font-semibold text-iris-700' : 'border-transparent font-medium text-mauve-600 hover:text-iris-700')}>{t.label}</button>
          ))}
        </div>
      } />
      <div id="home-list" role="tabpanel" aria-labelledby={`home-tab-${cur.id}`} className={panel}>
        {cur.items.slice(0, SHOWN).map((a) => <Entry key={a.paperId} a={a} choice={choiceIds.includes(a.paperId)} openAccess={openAccess} />)}
      </div>
      <p className="mt-6 text-center"><AppLink to={paths.pastIssues} className={btnSecondary}>Browse Entire Catalog &rarr;</AppLink></p>
    </section>
  )
}
