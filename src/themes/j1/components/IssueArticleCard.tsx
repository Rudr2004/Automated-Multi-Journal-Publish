import { useState } from 'react'
import type { ArticleSummary } from '../../../mock-data/journals/j1'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { orcidFor } from '../../../mock-data/shared/identity'
import { doiFor, journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { copyText } from '../../../core/lib/clipboard'
import { AppLink } from '../../../core/router'
import { Avatar } from './Avatar'
import { OrcidIcon } from './ArticleParts'
import { Highlight } from './Highlight'
import { useToast } from './Toast'
import { ChevronDown, Download, Eye, FileText, FormatQuote, LockOpen, Share2 } from './uiIcons'

const TYPE_ACCENT: Record<ArticleSummary['type'], string> = {
  'Research Article': 'border-l-scholar',
  'Review Article': 'border-l-navy',
  'Short Communication': 'border-l-navy-300',
  Editorial: 'border-l-ink-muted',
}

const secondary =
  'inline-flex h-9 items-center gap-1.5 rounded border border-line bg-white px-3 text-[13px] font-semibold text-navy transition-colors hover:border-scholar hover:bg-scholar-soft'

/**
 * Issue / archive listing entry modelled on the reference article card: bordered item with a 3px left accent,
 * tag ribbon, serif title, author chips with ORCID, monospace DOI row, metrics and a PDF / full-text / abstract toolbar.
 */
export function IssueArticleCard({ article, highlight, featured = false }: { article: ArticleSummary; highlight?: string; featured?: boolean }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const doi = doiFor(article.paperId)
  const href = paths.article(article.paperId)
  const absId = `abs-${article.paperId}`

  const share = async () => {
    const url = `https://${journal.domain}${href}`
    toast((await copyText(url)) ? 'Article link copied to clipboard.' : 'Could not copy. Copy the address from the browser bar instead.')
  }

  return (
    <article className={`border border-l-[3px] border-line bg-white p-5 sm:p-6 ${TYPE_ACCENT[article.type]} ${featured ? 'border-l-gold' : ''}`}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
        <span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2 py-1 font-semibold uppercase tracking-wider text-scholar">{article.subject}</span>
        <span className="rounded-sm border border-line bg-paper px-2 py-1 font-semibold text-ink">{article.type}</span>
        <span className="rounded-sm bg-mist px-2 py-1 font-mono font-semibold tabular-nums text-ink">pp. {article.pages}</span>
        <span className="inline-flex items-center gap-1 rounded-sm border border-oa/30 bg-oa-soft px-2 py-1 font-semibold text-oa"><LockOpen className="h-3 w-3" aria-hidden />{journal.licence.name}</span>
        <span className="font-semibold tabular-nums text-ink-muted">Published: {formatDate(article.publishedAt)}</span>
      </div>

      <h3 className="mt-3 font-serif text-[1.375rem] font-semibold leading-snug text-navy">
        <AppLink to={href} className="hover:text-scholar hover:underline"><Highlight text={article.title} query={highlight} /></AppLink>
      </h3>

      <ul className="mt-3 flex flex-wrap gap-2" aria-label="Authors">
        {article.authors.map((name, i) => {
          const orcid = orcidFor(name)
          return (
            <li key={name} className="inline-flex items-center gap-2 rounded border border-line bg-white py-1 pl-1 pr-3 text-[13px]">
              <Avatar name={name} photo={portraitFor(name)} size="xs" />
              <AppLink to={paths.search(name)} className="font-semibold text-ink hover:text-scholar hover:underline"><Highlight text={name} query={highlight} /></AppLink>
              {i === 0 && <sup aria-hidden className="-ml-1 text-[10px] font-bold text-scholar">1</sup>}
              {orcid && <OrcidIcon id={orcid} />}
            </li>
          )
        })}
      </ul>

      <p className={`mt-3 text-[0.9375rem] leading-relaxed text-ink ${open ? 'sr-only' : 'line-clamp-2'}`}>{article.abstract}</p>
      {open && (
        <div id={absId} className="mt-3 border border-line border-l-[3px] border-l-navy bg-paper p-4 text-[0.9375rem] leading-relaxed">
          <p className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Abstract</p>
          <p className="mt-1">{article.abstract}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-3 text-[13px] text-ink-muted">
        <span><span className="font-semibold uppercase tracking-wide">DOI:</span> <a href={`https://doi.org/${doi}`} className="font-mono tabular-nums text-scholar hover:underline">{doi}</a></span>
        <span className="ml-auto flex flex-wrap items-center gap-4 font-semibold tabular-nums text-ink">
          <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4 text-ink-muted" aria-hidden />{formatNumber(article.views)}<span className="sr-only"> views</span></span>
          <span className="inline-flex items-center gap-1"><Download className="h-4 w-4 text-ink-muted" aria-hidden />{formatNumber(article.downloads)}<span className="sr-only"> downloads</span></span>
          <span className="inline-flex items-center gap-1"><FormatQuote className="h-4 w-4 text-ink-muted" aria-hidden />{formatNumber(article.citations)} citations</span>
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a href={paths.pdf(article.paperId)} download
          onClick={(e) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded.`) }}
          className="inline-flex h-9 items-center gap-1.5 rounded bg-scholar px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-scholar-dark">
          <Download className="h-4 w-4" aria-hidden />Download PDF
        </a>
        <AppLink to={href} className={secondary}><FileText className="h-4 w-4" aria-hidden />Full Text</AppLink>
        <button type="button" aria-expanded={open} aria-controls={absId} onClick={() => setOpen(!open)} className={`${secondary} bg-scholar-soft`}>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />Abstract
        </button>
        <button type="button" onClick={share} aria-label={`Copy link to ${article.title}`} className={`${secondary} ml-auto w-9 justify-center px-0`}><Share2 className="h-4 w-4" aria-hidden /></button>
      </div>
    </article>
  )
}
