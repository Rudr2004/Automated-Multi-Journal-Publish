import type { ArticleSummary } from '../../../mock-data/journals/j1'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { orcidFor } from '../../../mock-data/shared/identity'
import { doiFor, journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import { Avatar } from './Avatar'
import { OrcidIcon } from './ArticleParts'
import { CiteArticleButton, QrArticleButton, ShareArticleButton, issueBtn } from './IssueDialogs'
import { useToast } from './Toast'
import { Download, FileText, FormatQuote, LockOpen, Medal } from './uiIcons'

/** "Best Paper · Editor's Choice": the issue's top article, with gold border, abstract callout, QR, Cite and Share. */
export function IssueFeatured({ article }: { article: ArticleSummary }) {
  const toast = useToast()
  const doi = doiFor(article.paperId)
  const href = paths.article(article.paperId)
  return (
    <section aria-labelledby="featured-title" className="border-2 border-[#B8892B] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E5D3A6] bg-[#FBF5E4] px-5 py-2.5">
        <p className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-[#6B4E0B]"><Medal className="h-4 w-4" aria-hidden />Best Paper · Editor’s Choice</p>
        <span className="inline-flex items-center gap-1 rounded-sm border border-oa/30 bg-oa-soft px-2 py-0.5 text-xs font-semibold text-oa"><LockOpen className="h-3 w-3" aria-hidden />{journal.licence.name}</span>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2 py-1 font-semibold text-scholar">{article.subject}</span>
          <span className="rounded-sm border border-line bg-paper px-2 py-1 font-semibold text-ink">{article.type}</span>
          <span className="font-semibold tabular-nums text-ink-muted">Published: {formatDate(article.publishedAt)}</span>
        </div>
        <h2 id="featured-title" className="mt-3 font-serif text-[1.5rem] font-semibold leading-snug text-navy sm:text-[1.75rem]">
          <AppLink to={href} className="hover:text-scholar hover:underline">{article.title}</AppLink>
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Authors">
          {article.authors.map((name) => {
            const orcid = orcidFor(name)
            return (
              <li key={name} className="inline-flex items-center gap-2 rounded border border-line bg-white py-1 pl-1 pr-3 text-[13px]">
                <Avatar name={name} photo={portraitFor(name)} size="xs" />
                <AppLink to={paths.search(name)} className="font-semibold text-ink hover:text-scholar hover:underline">{name}</AppLink>
                {orcid && <OrcidIcon id={orcid} />}
              </li>
            )
          })}
        </ul>
        <div className="mt-4 border-l-4 border-l-scholar bg-[#F3F7FC] p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-scholar">Abstract &amp; Key Findings</p>
          <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink">{article.abstract}</p>
        </div>
        <p className="mt-4 font-mono text-xs tabular-nums text-ink-muted">
          <span className="font-semibold">DOI</span> <a href={`https://doi.org/${doi}`} className="text-scholar hover:underline">{doi}</a>
          <span aria-hidden className="mx-1.5">•</span><span className="font-semibold">MS ID</span> <span className="text-ink">{article.paperId}</span>
          <span aria-hidden className="mx-1.5">•</span><span className="inline-flex items-center gap-1 align-middle font-sans font-semibold text-ink"><FormatQuote className="h-3.5 w-3.5 text-ink-muted" aria-hidden />{formatNumber(article.citations)} citations</span>
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <a href={paths.pdf(article.paperId)} download onClick={(e) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded.`) }}
            className="inline-flex h-9 items-center gap-1.5 rounded bg-scholar px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-scholar-dark">
            <Download className="h-4 w-4" aria-hidden />Download PDF
          </a>
          <AppLink to={href} className={issueBtn}><FileText className="h-4 w-4" aria-hidden />Full Text</AppLink>
          <QrArticleButton article={article} />
          <CiteArticleButton article={article} />
          <ShareArticleButton article={article} />
        </div>
      </div>
    </section>
  )
}
