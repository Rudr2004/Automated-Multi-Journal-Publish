// Dense article row for search results (reference "article row"): colour-coded paper type, author photos, meta chips, DOI, actions.
import { useId, useState } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import { Quote } from '../icons'
import { Eye } from './homeIcons'
import type { ArticleSummary } from '../../../core/types'
import { AuthorAvatar } from './AuthorAvatar'
import { buttonClass } from './Button'
import { CiteFlyout } from './CiteFlyout'
import { disciplineColor } from './discipline'
import { Highlight } from './Highlight'
import { TypePill } from './paperType'
import { cx } from './primitives'
import { useToast } from './Toast'
import { Calendar, ChevronDown, Copy, Download, OpenAccess } from '../icons'

const chip = 'inline-flex items-center gap-1.5 rounded-chip bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-900'
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-2'

export function SearchResultRow({ article, index, term }: { article: ArticleSummary; index: number; term: string }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const absId = useId()
  const doi = doiFor(article.paperId)
  const color = disciplineColor(article.subject)
  return (
    <article className="rounded-panel border border-graphite-200 bg-white p-4 shadow-card transition-shadow hover:shadow-soft sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <TypePill type={article.type} />
          {journal.badges.openAccess && <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-900"><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />Open Access</span>}
        </div>
        <span aria-hidden="true" className="font-display text-lg font-bold tabular-nums text-graphite-300 sm:text-2xl">{String(index).padStart(2, '0')}</span>
      </div>

      <h3 className="mt-2.5 font-display text-lg font-bold leading-snug text-graphite-900 sm:text-xl">
        <AppLink to={paths.article(article.paperId)} className={cx('rounded-chip hover:text-accent-700', focusRing)}><Highlight text={article.title} term={term} /></AppLink>
      </h3>

      <ul className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5" aria-label="Authors">
        {article.authors.map((a, i) => (
          <li key={a} className="flex items-center gap-2 text-sm font-medium text-graphite-800">
            <AuthorAvatar name={a} /><span><Highlight text={a} term={term} /><sup className="ml-px text-[10px] text-graphite-600">{i + 1}</sup></span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className={chip}><Calendar className="h-3.5 w-3.5" aria-hidden="true" />Published: {formatDate(article.publishedAt)}</span>
        <span className={chip}>Vol. {article.volume}, Issue {article.issue}{article.pages && `, pp. ${article.pages}`}</span>
        <span className="inline-flex items-center gap-1.5 rounded-chip bg-white px-2.5 py-1 text-xs font-medium text-graphite-800 ring-1 ring-inset ring-graphite-200"><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{article.subject}</span>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-graphite-100 pt-3 text-xs text-graphite-600">
        <button type="button" aria-label={`Copy DOI link ${doi}`} onClick={async () => toast((await copyText(`https://doi.org/${doi}`)) ? 'DOI link copied' : 'Could not copy the DOI', 'success')}
          className={cx('inline-flex items-center gap-1.5 rounded-chip font-mono text-xs text-graphite-700 hover:text-accent-700', focusRing)}>
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />DOI {doi}
        </button>
        <span className="inline-flex flex-wrap items-center gap-x-4 gap-y-1 tabular-nums">
          <span className="inline-flex items-center gap-1" title="Views"><Eye className="h-4 w-4 text-accent-700" aria-hidden="true" />{article.views.toLocaleString('en-US')}<span className="sr-only"> views</span></span>
          <span className="inline-flex items-center gap-1" title="Downloads"><Download className="h-4 w-4 text-accent-700" aria-hidden="true" />{article.downloads.toLocaleString('en-US')}<span className="sr-only"> downloads</span></span>
          <span className="inline-flex items-center gap-1" title="Citations"><Quote className="h-4 w-4 text-accent-700" aria-hidden="true" />{article.citations.toLocaleString('en-US')}<span className="sr-only"> citations</span></span>
        </span>
      </div>

      {open && <p id={absId} className="mt-3 rounded-soft bg-graphite-50 p-3 text-sm leading-relaxed text-graphite-700"><Highlight text={article.abstract} term={term} /></p>}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" aria-expanded={open} aria-controls={open ? absId : undefined} onClick={() => setOpen((o) => !o)} className={buttonClass('outline', cx('!border-graphite-300 !text-graphite-800 hover:!bg-graphite-50', focusRing))}>
          Abstract <ChevronDown className={cx('h-4 w-4 transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
        <button type="button" onClick={() => downloadArticlePdf(article)} aria-label={`Download PDF: ${article.title}`} className={buttonClass('primary', focusRing)}>
          <Download className="h-4 w-4" aria-hidden="true" />Download PDF
        </button>
        <AppLink to={paths.article(article.paperId)} aria-label={`Full article: ${article.title}`} className={buttonClass('outline', cx('border-brand-300 bg-brand-50 !text-brand-900 hover:bg-brand-100', focusRing))}>Full Article</AppLink>
        <CiteFlyout article={article} className="sm:ml-auto" />
      </div>
    </article>
  )
}
