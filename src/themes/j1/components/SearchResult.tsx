import { useState } from 'react'
import type { ArticleSummary } from '../../../mock-data/journals/j1'
import { orcidFor } from '../../../mock-data/shared/identity'
import { doiFor, journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import { OrcidIcon } from './ArticleParts'
import { Highlight } from './Highlight'
import { Badge } from './primitives'
import { useToast } from './Toast'
import { Download, Eye, FormatQuote, LockOpen } from './uiIcons'

/**
 * One search hit in the article-entry style: numbered meta ribbon, serif title, authors, two-line abstract (expandable)
 * and a toolbar. Matching words are highlighted in the title, authors and abstract.
 */
export function SearchResult({ article, index, query }: { article: ArticleSummary; index: number; query: string }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const doi = doiFor(article.paperId)
  const absId = `sr-abs-${article.paperId}`

  return (
    <article className="border-b border-line py-5 first:pt-0">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <span className="w-6 text-sm font-semibold tabular-nums text-ink-muted" aria-label={`Result ${index}`}>{index}.</span>
        <Badge tone="blue">{article.type}</Badge>
        <Badge tone="open"><LockOpen className="mr-1 h-3 w-3" aria-hidden />Open Access</Badge>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
          {journal.shortName} <span aria-hidden>•</span> Vol {article.volume} <span aria-hidden>•</span> Issue {article.issue} <span aria-hidden>•</span> pp. {article.pages} <span aria-hidden>•</span> {formatDate(article.publishedAt)}
        </p>
      </div>

      <div className="sm:pl-8">
        <h3 className="mt-2 font-serif text-[1.25rem] font-semibold leading-snug tracking-tight text-navy">
          <AppLink to={paths.article(article.paperId)} className="hover:text-scholar hover:underline"><Highlight text={article.title} query={query} /></AppLink>
        </h3>

        <p className="mt-1.5 text-sm text-ink-muted">
          {article.authors.map((name, i) => (
            <span key={name}>
              {i > 0 && ', '}
              <AppLink to={paths.search(name)} className="font-medium text-scholar hover:underline"><Highlight text={name} query={query} /></AppLink>
              {orcidFor(name) && <span className="ml-1 align-middle"><OrcidIcon id={orcidFor(name)!} /></span>}
            </span>
          ))}
          <span className="ml-1.5 text-xs">· {article.subject}</span>
        </p>

        <p id={absId} className={`mt-2 text-[0.9375rem] leading-relaxed text-ink ${open ? 'border border-line border-l-[3px] border-l-navy bg-paper p-3' : 'line-clamp-2'}`}>
          <Highlight text={article.abstract} query={query} />
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink-muted">
          <span className="font-semibold uppercase tracking-wide">DOI</span>
          <a href={`https://doi.org/${doi}`} className="tabular-nums text-scholar hover:underline">{doi}</a>
          <span className="inline-flex items-center gap-1 tabular-nums"><FormatQuote className="h-4 w-4" aria-hidden />{formatNumber(article.citations)} citations</span>
          <span className="inline-flex items-center gap-1 tabular-nums"><Eye className="h-4 w-4" aria-hidden />{formatNumber(article.views)}</span>
          <span className="ml-auto flex items-center gap-3">
            <button type="button" aria-expanded={open} aria-controls={absId} onClick={() => setOpen(!open)} className="font-semibold text-scholar hover:underline">{open ? 'Hide abstract' : 'Full abstract'}</button>
            <AppLink to={paths.article(article.paperId)} className="font-semibold text-scholar hover:underline">HTML</AppLink>
            <a href={paths.pdf(article.paperId)} download className="inline-flex items-center gap-1 rounded border border-line px-2.5 py-1 font-semibold text-navy hover:border-scholar hover:bg-paper"
              onClick={(e) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded.`) }}>
              <Download className="h-4 w-4" aria-hidden />PDF
            </a>
          </span>
        </div>
      </div>
    </article>
  )
}
