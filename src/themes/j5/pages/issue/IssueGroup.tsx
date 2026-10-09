// One article-type group of the issue: a classical heading (type colour mark, serif title, count) with a double hairline, then the paper rows.
import { useId } from 'react'
import type { ArticleSummary, ArticleType } from '../../../../core/types'
import { DoubleRule } from '../../components/PageBand'
import { PaperRow, TYPE_STYLE } from '../../components/PaperBits'

export function IssueGroup({ type, title, items }: { type: ArticleType; title: string; items: ArticleSummary[] }) {
  const uid = useId()
  return (
    <section aria-labelledby={`${uid}-h`} className="mt-12 first:mt-0">
      <h2 id={`${uid}-h`} className="flex flex-wrap items-baseline gap-x-3 pb-2 font-newsreader text-[1.375rem] font-semibold tracking-tight text-obsidian-900 sm:text-[1.625rem]">
        <span aria-hidden="true" className="h-3 w-3 shrink-0 rotate-45 self-center" style={{ backgroundColor: TYPE_STYLE[type].dot }} />
        {title}<span className="font-work text-sm font-medium tabular-nums text-obsidian-600">{items.length} {items.length === 1 ? 'article' : 'articles'}</span>
      </h2>
      <DoubleRule tone="light" className="mb-4" />
      <ol>{items.map((a) => <PaperRow key={a.paperId} article={a} />)}</ol>
    </section>
  )
}
