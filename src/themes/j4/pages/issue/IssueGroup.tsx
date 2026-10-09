// One article-type group of the issue: a colour-coded heading with the count, then the paper rows.
import { useId } from 'react'
import type { ArticleSummary, ArticleType } from '../../../../core/types'
import { PaperRow, TYPE_STYLE } from '../../components/PaperBits'

export function IssueGroup({ type, title, items }: { type: ArticleType; title: string; items: ArticleSummary[] }) {
  const uid = useId()
  return (
    <section aria-labelledby={`${uid}-h`} className="mt-10 first:mt-0">
      <h2 id={`${uid}-h`} className="mb-4 flex items-center gap-3 border-b border-abyss-300 pb-2 font-serif4 text-[1.375rem] font-semibold tracking-tight text-abyss-900 sm:text-[1.625rem]">
        <span aria-hidden="true" className="h-4 w-1.5 rounded-sm" style={{ backgroundColor: TYPE_STYLE[type].dot }} />
        {title}<span className="font-work text-sm font-medium tabular-nums text-steel-600">{items.length} {items.length === 1 ? 'article' : 'articles'}</span>
      </h2>
      <ol>{items.map((a) => <PaperRow key={a.paperId} article={a} />)}</ol>
    </section>
  )
}
