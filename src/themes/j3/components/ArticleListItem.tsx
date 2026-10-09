// Reference-style article result: a hairline card with type and DOI metadata, a serif navy title and the author line. Used for archive search results.
import { doiFor } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'

export function ArticleListItem({ article }: { article: ArticleSummary }) {
  return (
    <article className="relative flex flex-col border border-mauve-100 bg-white p-5 hover:border-iris-700 focus-within:border-iris-700">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-inter text-xs text-mauve-600">
        <span className="bg-iris-50 px-2 py-0.5 font-semibold text-iris-700">{article.type}</span>
        <span>Vol. {article.volume}, Issue {article.issue}</span>
      </div>
      <h3 className="mt-3 font-jakarta text-[1.1875rem] font-semibold leading-snug text-iris-700">
        <AppLink to={paths.article(article.paperId)} className="hover:text-ember-700 hover:underline after:absolute after:inset-0 after:content-['']">{article.title}</AppLink>
      </h3>
      <p className="mt-2 font-jakarta text-[0.9375rem] font-semibold text-night-900">{article.authors.join(', ')}</p>
      <p className="mt-auto pt-4 font-inter text-xs text-mauve-600"><span className="break-all">doi:{doiFor(article.paperId)}</span> · {formatDate(article.publishedAt)}</p>
    </article>
  )
}
