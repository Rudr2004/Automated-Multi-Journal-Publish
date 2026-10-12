// Article result card (archive search, related articles): stream and type tags, the title, author photos with names, then DOI and date. Flat hairline card, 2px corners.
// The whole card is one link (the title carries it), so the avatars stay decorative.
import { doiFor } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { AuthorAvatar, TypeTag } from './IssueParts'

export function ArticleListItem({ article }: { article: ArticleSummary }) {
  return (
    <article className="relative flex flex-col border border-j3paper-rule bg-white p-5 hover:border-iris-700 focus-within:border-iris-700">
      <div className="flex flex-wrap items-center gap-2">
        <TypeTag>{article.type}</TypeTag>
        <span className="font-inter text-xs tabular-nums text-mauve-600">Vol. {article.volume}, Issue {article.issue}</span>
      </div>
      <p className="mt-3 font-jakarta text-[11px] font-bold uppercase tracking-[0.06em] text-iris-700">{article.subject}</p>
      <h3 className="mt-1.5 font-jakarta text-[1.0625rem] font-bold leading-snug text-night-900">
        <AppLink to={paths.article(article.paperId)} className="hover:text-iris-700 hover:underline hover:underline-offset-4 after:absolute after:inset-0 after:content-['']">{article.title}</AppLink>
      </h3>
      <ul className="mt-3 flex-1 space-y-1.5" aria-label="Authors">
        {article.authors.slice(0, 3).map((n) => (
          <li key={n} className="flex items-center gap-2 font-inter text-[13px] font-semibold text-night-900"><AuthorAvatar name={n} size={24} />{n}</li>
        ))}
        {article.authors.length > 3 && <li className="pl-8 font-inter text-xs text-mauve-600">and {article.authors.length - 3} more</li>}
      </ul>
      <p className="mt-4 border-t border-j3paper-rule pt-3 font-mono text-[11px] text-mauve-600"><span className="break-all">DOI: {doiFor(article.paperId)}</span> · {formatDate(article.publishedAt)}</p>
    </article>
  )
}
