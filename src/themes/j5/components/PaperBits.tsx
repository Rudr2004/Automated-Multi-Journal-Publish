// Shared pieces for article listings (issue, archive, search): colour-coded paper types, author photo chips with ORCID badges,
// icon metrics and the full article row. Scholarly look: hairline borders, a type-coloured left rule, tabular numbers.
import { useId, useState, type ReactNode } from 'react'
import { MdOutlineVisibility as Eye } from 'react-icons/md'
import { doiFor } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, ArticleType } from '../../../core/types'
import { orcidFor } from '../../../mock-data/shared/identity'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { ChevronDown, Download, Quote } from '../icons'
import { cx } from './primitives'
import { ArticleActions, AreaTag, Highlight } from './PageBand'
import { Kicker } from './signature'

/** Paper-type colours: `bar` is the left rule, `chip` the label (all text colours pass 4.5:1 on their tint). */
export const TYPE_STYLE: Record<ArticleType, { bar: string; chip: string; dot: string }> = {
  'Research Article': { bar: 'border-l-wine-800', chip: 'border-wine-200 bg-wine-50 text-wine-800', dot: '#701A1E' },
  'Review Article': { bar: 'border-l-ochre-700', chip: 'border-ochre-200 bg-ochre-50 text-ochre-900', dot: '#B45309' },
  'Short Communication': { bar: 'border-l-lime-700', chip: 'border-lime-200 bg-lime-50 text-lime-900', dot: '#4D7C0F' },
  Editorial: { bar: 'border-l-obsidian-600', chip: 'border-obsidian-300 bg-obsidian-100 text-obsidian-800', dot: '#4B5563' },
}

export const TypeChip = ({ type }: { type: ArticleType }) => (
  <span className={cx('inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 font-work text-xs font-semibold', TYPE_STYLE[type].chip)}>
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TYPE_STYLE[type].dot }} />{type}
  </span>
)

export const OrcidBadge = ({ id, name }: { id: string; name: string }) => (
  <a href={`https://orcid.org/${id}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD of ${name} (opens in a new tab)`} title={`ORCID: ${id}`}
    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#A6CE39] text-[8px] font-bold leading-none text-obsidian-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">iD</a>
)

/** Round author photo, or initials when no portrait is on file. */
export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const src = portraitFor(name)
  const initials = name.replace(/^(Prof|Dr)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('')
  return src
    ? <img src={src} alt="" width={size} height={size} loading="lazy" className="shrink-0 rounded-full bg-obsidian-100 object-cover" style={{ width: size, height: size }} />
    : <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-full bg-wine-100 text-[10px] font-semibold text-wine-900" style={{ width: size, height: size }}>{initials}</span>
}

export function AuthorChips({ names, terms = [] }: { names: string[]; terms?: string[] }) {
  return (
    <ul aria-label="Authors" className="flex flex-wrap gap-1.5">
      {names.map((n) => {
        const orcid = orcidFor(n)
        return (
          <li key={n} className="inline-flex items-center gap-1.5 rounded-full border border-obsidian-200 bg-white py-0.5 pl-0.5 pr-2.5 text-[13px]">
            <Avatar name={n} />
            <AppLink to={paths.search(n)} className="font-medium text-obsidian-900 hover:text-wine-700 hover:underline"><Highlight text={n} terms={terms} /></AppLink>
            {orcid && <OrcidBadge id={orcid} name={n} />}
          </li>
        )
      })}
    </ul>
  )
}

/** Views, downloads and citations as icon + number (screen readers get the words). */
export function Metrics({ views, downloads, citations, className }: { views: number; downloads: number; citations: number; className?: string }) {
  const item = (Icon: typeof Eye, n: number, word: string) => (
    <span className="inline-flex items-center gap-1" title={word}><Icon className="h-4 w-4 text-obsidian-500" aria-hidden="true" />{formatNumber(n)}<span className="sr-only"> {word}</span></span>
  )
  return <p className={cx('flex items-center gap-4 text-[13px] font-semibold tabular-nums text-obsidian-800', className)}>{item(Eye, views, 'views')}{item(Download, downloads, 'downloads')}{item(Quote, citations, 'citations')}</p>
}

const TOGGLE = 'inline-flex h-11 items-center gap-1 rounded border border-obsidian-300 bg-[#FBF8F4] px-3 text-xs font-semibold text-obsidian-900 hover:border-wine-700 hover:text-wine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 lg:h-9'

/** One article in a listing. `showIssue` adds the volume/issue to the meta line (archive and search). */
export function PaperRow({ article: a, terms = [], defaultOpen = false, showIssue = false, extra }: { article: ArticleSummary; terms?: string[]; defaultOpen?: boolean; showIssue?: boolean; extra?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  const absId = useId()
  const doi = doiFor(a.paperId)
  return (
    <li className={cx('mt-3 rounded border border-l-[3px] border-wine-800/15 bg-white p-4 shadow-none transition-[border-color,transform] duration-150 first:mt-0 hover:border-wine-800/50 motion-safe:hover:-translate-y-px motion-reduce:transition-none sm:p-5', TYPE_STYLE[a.type].bar)}>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
        <TypeChip type={a.type} />
        <AreaTag subject={a.subject} />
        <span className="tabular-nums text-obsidian-600">{showIssue && <>Vol. {a.volume}, Issue {a.issue} · </>}pp. {a.pages} · {formatDate(a.publishedAt)}</span>
      </div>
      <h3 className="mt-2 font-newsreader text-[1.1875rem] font-semibold leading-snug text-obsidian-900 sm:text-[1.3125rem]">
        <AppLink to={paths.article(a.paperId)} className="hover:text-wine-700"><Highlight text={a.title} terms={terms} /></AppLink>
      </h3>
      <div className="mt-2.5"><AuthorChips names={a.authors} terms={terms} /></div>
      {open && (
        <div id={absId} className="mt-3 rounded border border-l-[3px] border-obsidian-200 border-l-wine-800 bg-[#FBF8F4] p-3.5">
          <Kicker>Abstract</Kicker>
          <p className="mt-1 font-serif4 text-[15px] leading-relaxed text-obsidian-800"><Highlight text={a.abstract} terms={terms} /></p>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-obsidian-100 pt-3">
        <p className="min-w-0 text-[13px] text-obsidian-600"><span className="font-semibold uppercase tracking-[0.06em]">DOI</span>{' '}
          <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="break-all tabular-nums text-wine-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">{doi}<span className="sr-only"> (opens in a new tab)</span></a></p>
        <Metrics views={a.views} downloads={a.downloads} citations={a.citations} className="sm:ml-auto" />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <ArticleActions article={a} />
        <button type="button" aria-expanded={open} aria-controls={open ? absId : undefined} onClick={() => setOpen(!open)} className={TOGGLE}>
          Abstract<ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
        </button>
        {extra}
      </div>
    </li>
  )
}
