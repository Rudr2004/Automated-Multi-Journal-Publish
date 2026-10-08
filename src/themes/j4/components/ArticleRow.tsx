// A result row used by the archive list and the search results: area, title, authors, abstract and a spec-line of facts.
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { ArticleActions, AreaTag, Highlight } from './PageBand'

export function ArticleRow({ article: a, terms = [], abstract = false }: { article: ArticleSummary; terms?: string[]; abstract?: boolean }) {
  return (
    <li className="border-b border-abyss-200 py-5 first:pt-0">
      <AreaTag subject={a.subject} />
      <h3 className="mt-1 font-serif4 text-xl font-semibold leading-snug text-abyss-900">
        <AppLink to={paths.article(a.paperId)} className="hover:text-cobalt-700"><Highlight text={a.title} terms={terms} /></AppLink>
      </h3>
      <p className="mt-1 text-sm text-steel-700"><Highlight text={a.authors.join(', ')} terms={terms} /></p>
      {abstract && <p className="mt-2 max-w-3xl text-sm leading-relaxed text-steel-600"><Highlight text={a.abstract.length > 280 ? `${a.abstract.slice(0, 280).replace(/\s+\S*$/, '')} (more in the article)` : a.abstract} terms={terms} /></p>}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
        <p className="text-xs tabular-nums text-steel-600">
          {a.type} · Vol. {a.volume}, Issue {a.issue} · pp. {a.pages} · {formatDate(a.publishedAt)} · {formatNumber(a.views)} views · {formatNumber(a.downloads)} downloads
        </p>
        <ArticleActions article={a} />
      </div>
    </li>
  )
}
