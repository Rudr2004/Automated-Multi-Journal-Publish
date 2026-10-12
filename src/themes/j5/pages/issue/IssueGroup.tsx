// One article-type group of the issue, as in the reference: a wine bar, serif heading, "• n Article(s)" count, then the article cards.
import { useId } from 'react'
import type { ArticleSummary, ArticleType } from '../../../../core/types'
import { PaperRow } from '../../components/PaperBits'

export function IssueGroup({ title, items }: { type?: ArticleType; title: string; items: ArticleSummary[] }) {
  const uid = useId()
  return (
    <section aria-labelledby={`${uid}-h`} className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div aria-hidden="true" className="h-6 w-1.5 rounded-full bg-wine-800" />
        <h2 id={`${uid}-h`} className="font-newsreader text-lg font-bold text-[#141B2B]">{title}</h2>
        <span className="font-work text-xs text-[#6F5A58]">• {items.length} {items.length === 1 ? 'Article' : 'Articles'}</span>
      </div>
      <ol>{items.map((a) => <PaperRow key={a.paperId} article={a} />)}</ol>
    </section>
  )
}
