import { useState, type ComponentType, type ReactNode } from 'react'
import { MdOutlineExpandMore } from 'react-icons/md'
import type { ArticleSummary } from '../../../mock-data/journals/j1'
import { orcidFor } from '../../../mock-data/shared/identity'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { doiFor } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import { Avatar } from './Avatar'
import { OrcidIcon } from './ArticleParts'
import { useToast } from './Toast'
import { Download, Eye, FormatQuote } from './uiIcons'

type IconType = ComponentType<{ className?: string; 'aria-hidden'?: boolean }>

/**
 * Flat bordered card of the "academic portal" layout: hairline border, 4px radius, no shadow, serif heading with an optional icon,
 * a hairline rule under the heading and a small slate label on the right. `size="main"` is the larger centre-column heading.
 */
export function Card({ title, subtitle, icon: Icon, aside, children, className = '', size = 'side', id, headingId }: {
  title: ReactNode; subtitle?: ReactNode; icon?: IconType; aside?: ReactNode; children: ReactNode; className?: string; size?: 'side' | 'main'; id?: string; headingId?: string
}) {
  const main = size === 'main'
  return (
    <section id={id} aria-labelledby={headingId} className={`rounded border border-line bg-white p-4 ${main ? 'sm:p-5' : ''} ${className}`}>
      <header className={`mb-3 flex items-start justify-between gap-3 border-b border-line pb-2.5 ${main ? 'sm:mb-4' : ''}`}>
        <div className="min-w-0">
          <h2 id={headingId} className={`flex items-center gap-2 font-serif font-bold leading-snug text-navy ${main ? 'text-[1.1875rem] sm:text-[1.3125rem]' : 'text-[1.0625rem]'}`}>
            {Icon && <Icon className="h-5 w-5 shrink-0 text-scholar" aria-hidden />}{title}
          </h2>
          {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
        </div>
        {aside && <div className="shrink-0 pt-1 text-[11px] font-medium text-ink-muted">{aside}</div>}
      </header>
      {children}
    </section>
  )
}

/** Small uppercase tag (2px radius, never a pill). */
export const Tag = ({ children, tone = 'paper' }: { children: ReactNode; tone?: 'paper' | 'amber' | 'blue' | 'navy' }) => (
  <span className={`inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
    tone === 'amber' ? 'border-[#FCD8A5] bg-[#FFF7EB] text-[#8A4B00]' : tone === 'blue' ? 'border-[#C4D9EE] bg-scholar-soft text-scholar'
      : tone === 'navy' ? 'border-navy-700 bg-navy-700 text-white' : 'border-line bg-paper text-ink-muted'}`}>{children}</span>
)

/** Article row of the "Current Issue Scholarly Articles" list: type, date, serif title, authors, DOI, metrics, abstract toggle, actions. */
export function PortalArticle({ article }: { article: ArticleSummary }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const doi = doiFor(article.paperId)
  const absId = `pabs-${article.paperId}`
  return (
    <article className="border-b border-line px-4 py-5 last:border-b-0 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <Tag tone="amber">{article.type}</Tag>
        <span className="text-xs text-ink-muted">Published: <span className="tabular-nums">{formatDate(article.publishedAt)}</span></span>
        <span aria-hidden className="text-line">•</span>
        <span className="text-xs text-ink-muted">Vol. {article.volume}, Iss. {article.issue}</span>
      </div>
      <h3 className="mt-2 font-serif text-[1.1875rem] font-bold leading-snug tracking-tight text-navy sm:text-[1.25rem]">
        <AppLink to={paths.article(article.paperId)} className="hover:text-scholar hover:underline">{article.title}</AppLink>
      </h3>
      <ul className="mt-2 flex flex-wrap gap-2" aria-label="Authors">
        {article.authors.map((name) => (
          <li key={name} className="inline-flex items-center gap-2 rounded border border-line bg-white py-1 pl-1 pr-2.5 text-[13px]">
            <Avatar name={name} photo={portraitFor(name)} size="xs" />
            <AppLink to={paths.search(name)} className="font-semibold text-ink hover:text-scholar hover:underline">{name}</AppLink>
            {orcidFor(name) && <OrcidIcon id={orcidFor(name)!} />}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span>DOI: <a href={`https://doi.org/${doi}`} className="font-mono tabular-nums text-scholar hover:underline">{doi}</a></span>
        <span className="inline-flex items-center gap-1 tabular-nums"><FormatQuote className="h-4 w-4" aria-hidden />{formatNumber(article.citations)} Citations</span>
        <span className="inline-flex items-center gap-1 tabular-nums"><Eye className="h-4 w-4" aria-hidden />{formatNumber(article.views)} Views</span>
      </div>
      <button type="button" aria-expanded={open} aria-controls={absId} onClick={() => setOpen(!open)} className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-scholar hover:underline">
        <MdOutlineExpandMore className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />{open ? 'Hide Abstract' : 'View Abstract'}
      </button>
      {open && <p id={absId} className="mt-2 border-l-[3px] border-navy bg-paper p-3 text-sm leading-relaxed text-ink">{article.abstract}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <a href={paths.pdf(article.paperId)} download onClick={(e) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded.`) }}
          className="inline-flex h-9 items-center gap-1.5 rounded bg-scholar px-3.5 text-xs font-bold text-white hover:bg-scholar-dark"><Download className="h-4 w-4" aria-hidden />Download PDF</a>
        <AppLink to={paths.article(article.paperId)} className="inline-flex h-9 items-center gap-1.5 rounded border border-line bg-white px-3.5 text-xs font-bold text-navy hover:bg-mist">Read Full Text</AppLink>
      </div>
    </article>
  )
}
