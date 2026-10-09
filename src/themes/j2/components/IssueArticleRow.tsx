// Article row for the current-issue and archive lists: type pill, author photos, meta chips, DOI, metrics and actions.
import { useId, useState } from 'react'
import { MdOutlineVisibility } from 'react-icons/md'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { Button, buttonClass } from './Button'
import { CiteFlyout } from './CiteFlyout'
import { cx } from './primitives'
import { useToast } from './Toast'
import { disciplineColor } from './discipline'
import { Avatar, TypePill } from './paperType'
import { Calendar, ChevronDown, Copy, Download, OpenAccess, Quote } from '../icons'

export function IssueArticleRow({ article, index, compact }: { article: ArticleSummary; index?: number; compact?: boolean }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const absId = useId()
  const doi = doiFor(article.paperId)
  const color = disciplineColor(article.subject)
  const chip = 'inline-flex items-center gap-1.5 rounded-chip bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-900'
  return (
    <article className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card transition-shadow hover:shadow-soft sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <TypePill type={article.type} />
        {journal.badges.openAccess && (
          <span className="inline-flex items-center gap-1 rounded-full border border-cta-200 bg-cta-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-cta-900">
            <OpenAccess className="h-3.5 w-3.5" aria-hidden="true" /> Open Access
          </span>
        )}
        {index !== undefined && <span aria-hidden="true" className="ml-auto font-mono text-lg font-bold text-graphite-300">{String(index).padStart(2, '0')}</span>}
      </div>

      <h3 className={cx('mt-3 font-display font-bold leading-snug text-graphite-900', compact ? 'text-lg' : 'text-xl')}>
        <AppLink to={paths.article(article.paperId)} className="hover:text-accent-700">{article.title}</AppLink>
      </h3>

      <ul aria-label="Authors" className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {article.authors.map((a) => (
          <li key={a} className="flex items-center gap-2 text-sm font-medium text-graphite-800"><Avatar name={a} size={28} />{a}</li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className={chip}><Calendar className="h-3.5 w-3.5" aria-hidden="true" /> Published: {formatDate(article.publishedAt)}</span>
        {article.pages && <span className={chip}>Pages: {article.pages}</span>}
        <span className={chip}><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{article.subject}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-graphite-700 break-all">DOI: {doi}</span>
          <button type="button" aria-label={`Copy DOI link ${doi}`} onClick={async () => toast((await copyText(`https://doi.org/${doi}`)) ? 'DOI link copied' : 'Could not copy the DOI', 'success')}
            className="inline-flex items-center gap-1 rounded-chip border border-accent-200 bg-accent-50 px-2 py-0.5 text-xs font-semibold text-accent-800 hover:bg-accent-100">
            <Copy className="h-3.5 w-3.5" aria-hidden="true" /> Copy
          </button>
        </div>
        <p className="flex flex-wrap items-center gap-x-4 text-xs text-graphite-700">
          <span className="inline-flex items-center gap-1"><MdOutlineVisibility className="h-4 w-4" aria-hidden="true" /> {formatNumber(article.views)} Views</span>
          <span className="inline-flex items-center gap-1"><Download className="h-4 w-4" aria-hidden="true" /> {formatNumber(article.downloads)} Downloads</span>
          <span className="inline-flex items-center gap-1"><Quote className="h-4 w-4" aria-hidden="true" /> {formatNumber(article.citations)} Citations</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-graphite-200 pt-4">
        <button type="button" aria-expanded={open} aria-controls={absId} onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-soft border border-graphite-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-graphite-800 hover:border-accent-700 hover:text-accent-700">
          Abstract <ChevronDown className={cx('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
        <Button variant="primary" onClick={() => downloadArticlePdf(article)} aria-label={`Download PDF: ${article.title}`}>
          <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
        </Button>
        <AppLink to={paths.article(article.paperId)} className={buttonClass('outline')}>Full Article</AppLink>
        <CiteFlyout article={article} className="sm:ml-auto" />
      </div>

      {open && <p id={absId} className="mt-4 rounded-soft bg-brand-50 p-4 text-sm leading-relaxed text-graphite-800">{article.abstract}</p>}
    </article>
  )
}
