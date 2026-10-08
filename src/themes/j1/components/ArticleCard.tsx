import { Download, Eye } from './uiIcons'
import { useState } from 'react'
import type { ArticleSummary } from '../../../mock-data/journals/j1'
import { doiFor } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { Highlight } from './Highlight'
import { Badge } from './primitives'
import { AppLink } from '../../../core/router'
import { useToast } from './Toast'

// Left accent colour tells readers the article type at a glance (all from the palette).
const TYPE_ACCENT: Record<ArticleSummary['type'], string> = {
  'Research Article': 'border-l-navy-500',
  'Review Article': 'border-l-navy',
  'Short Communication': 'border-l-navy-300',
  Editorial: 'border-l-ink-muted',
}

const linkBtn =
  'inline-flex h-8 items-center rounded-md border border-line px-3 text-xs font-semibold text-navy transition-colors hover:border-navy hover:bg-navy-50'

/** Presentational article card. `variant="list"` shows actions + DOI + inline abstract; "compact" is for grids. */
export function ArticleCard({ article, variant = 'compact', onDownloadPdf, highlight }: {
  article: ArticleSummary
  /** Search words to highlight in the title and authors. */
  highlight?: string
  variant?: 'compact' | 'list'
  onDownloadPdf?: (a: ArticleSummary) => void
}) {
  const [open, setOpen] = useState(false)
  const toast = useToast()
  const href = paths.article(article.paperId)
  return (
    <article className={`flex h-full flex-col rounded-card border border-l-4 border-line bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${TYPE_ACCENT[article.type]}`}>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="navy">{article.type}</Badge>
        <span className="text-xs text-ink-muted">{article.subject}</span>
      </div>
      <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-navy">
        <AppLink to={href} className="hover:underline"><Highlight text={article.title} query={highlight} /></AppLink>
      </h3>
      <p className="mt-2 text-sm text-ink"><Highlight text={article.authors.join(', ')} query={highlight} /></p>
      <p className="mt-1 text-xs text-ink-muted">
        Vol {article.volume}, Issue {article.issue} · pp. {article.pages} · {formatDate(article.publishedAt)}
      </p>
      <div className="mt-3 flex items-center gap-4 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden />{formatNumber(article.views)} views</span>
        <span className="inline-flex items-center gap-1"><Download className="h-3.5 w-3.5" aria-hidden />{formatNumber(article.downloads)} downloads</span>
      </div>
      {variant === 'list' && (
        <>
          <p className="mt-3 text-xs text-ink-muted">DOI: {doiFor(article.paperId)}</p>
          {open && <p className="mt-3 border-l-2 border-navy-200 pl-3 text-sm leading-relaxed text-ink">{article.abstract}</p>}
        </>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
        {variant === 'compact' ? (
          <AppLink to={href} className="text-sm font-semibold text-navy-600 hover:underline">Read Article →</AppLink>
        ) : (
          <>
            <a href={paths.pdf(article.paperId)} download className={linkBtn} onClick={(e) => { e.preventDefault(); if (onDownloadPdf) onDownloadPdf(article); else { downloadArticlePdf(article); toast(`PDF ${article.paperId}.pdf downloaded.`) } }}>PDF</a>
            <AppLink to={href} className={linkBtn}>HTML</AppLink>
            <button type="button" className={linkBtn} aria-expanded={open} onClick={() => setOpen(!open)}>Abstract</button>
          </>
        )}
      </div>
    </article>
  )
}
