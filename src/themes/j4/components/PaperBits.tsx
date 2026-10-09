// Shared pieces for article listings (issue, archive, search): colour-coded paper types, author photo chips with ORCID badges,
// icon metrics and the full article row. Spec-sheet look: hairline borders, a type-coloured left rule, tabular numbers.
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

/** Paper-type colours: `bar` is the left rule, `chip` the label (all text colours pass 4.5:1 on their tint). */
export const TYPE_STYLE: Record<ArticleType, { bar: string; chip: string; dot: string }> = {
  'Research Article': { bar: 'border-l-cobalt-700', chip: 'border-sky-200 bg-sky-50 text-sky-900', dot: '#0369A1' },
  'Review Article': { bar: 'border-l-teal-700', chip: 'border-teal-200 bg-teal-50 text-teal-900', dot: '#0F766E' },
  'Short Communication': { bar: 'border-l-amber-600', chip: 'border-amber-200 bg-amber-50 text-amber-900', dot: '#D97706' },
  Editorial: { bar: 'border-l-slate-600', chip: 'border-slate-300 bg-slate-100 text-slate-800', dot: '#475569' },
}

export const TypeChip = ({ type }: { type: ArticleType }) => (
  <span className={cx('inline-flex items-center gap-1.5 rounded-ctl border px-2 py-0.5 text-xs font-semibold', TYPE_STYLE[type].chip)}>
    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: TYPE_STYLE[type].dot }} />{type}
  </span>
)

export const OrcidBadge = ({ id, name }: { id: string; name: string }) => (
  <a href={`https://orcid.org/${id}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD of ${name} (opens in a new tab)`} title={`ORCID: ${id}`}
    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#A6CE39] text-[8px] font-bold leading-none text-abyss-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">iD</a>
)

/** Round author photo, or initials when no portrait is on file. */
export function Avatar({ name, size = 24 }: { name: string; size?: number }) {
  const src = portraitFor(name)
  const initials = name.replace(/^(Prof|Dr)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('')
  return src
    ? <img src={src} alt="" width={size} height={size} loading="lazy" className="shrink-0 rounded-full bg-abyss-100 object-cover" style={{ width: size, height: size }} />
    : <span aria-hidden="true" className="inline-flex shrink-0 items-center justify-center rounded-full bg-abyss-100 text-[10px] font-semibold text-abyss-800" style={{ width: size, height: size }}>{initials}</span>
}

export function AuthorChips({ names, terms = [] }: { names: string[]; terms?: string[] }) {
  return (
    <ul aria-label="Authors" className="flex flex-wrap gap-1.5">
      {names.map((n) => {
        const orcid = orcidFor(n)
        return (
          <li key={n} className="inline-flex items-center gap-1.5 rounded-full border border-abyss-200 bg-white py-0.5 pl-0.5 pr-2.5 text-[13px]">
            <Avatar name={n} />
            <AppLink to={paths.search(n)} className="font-medium text-abyss-900 hover:text-cobalt-700 hover:underline"><Highlight text={n} terms={terms} /></AppLink>
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
    <span className="inline-flex items-center gap-1" title={word}><Icon className="h-4 w-4 text-steel-500" aria-hidden="true" />{formatNumber(n)}<span className="sr-only"> {word}</span></span>
  )
  return <p className={cx('flex items-center gap-4 text-[13px] font-semibold tabular-nums text-abyss-800', className)}>{item(Eye, views, 'views')}{item(Download, downloads, 'downloads')}{item(Quote, citations, 'citations')}</p>
}

const TOGGLE = 'inline-flex h-11 items-center gap-1 rounded-ctl border border-abyss-300 bg-azure-50 px-3 text-xs font-semibold text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:h-9'

/** One article in a listing. `showIssue` adds the volume/issue to the meta line (archive and search). */
export function PaperRow({ article: a, terms = [], defaultOpen = false, showIssue = false, extra }: { article: ArticleSummary; terms?: string[]; defaultOpen?: boolean; showIssue?: boolean; extra?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  const absId = useId()
  const doi = doiFor(a.paperId)
  return (
    <li className={cx('mt-3 rounded-pane border border-l-[3px] border-abyss-200 bg-white p-4 shadow-hair first:mt-0 sm:p-5', TYPE_STYLE[a.type].bar)}>
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs">
        <TypeChip type={a.type} />
        <AreaTag subject={a.subject} />
        <span className="tabular-nums text-steel-600">{showIssue && <>Vol. {a.volume}, Issue {a.issue} · </>}pp. {a.pages} · {formatDate(a.publishedAt)}</span>
      </div>
      <h3 className="mt-2 font-serif4 text-[1.1875rem] font-semibold leading-snug text-abyss-900 sm:text-[1.3125rem]">
        <AppLink to={paths.article(a.paperId)} className="hover:text-cobalt-700"><Highlight text={a.title} terms={terms} /></AppLink>
      </h3>
      <div className="mt-2.5"><AuthorChips names={a.authors} terms={terms} /></div>
      {open && (
        <div id={absId} className="mt-3 rounded-ctl border border-l-[3px] border-abyss-200 border-l-azure-600 bg-azure-50/60 p-3.5">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-steel-700">Abstract</p>
          <p className="mt-1 text-sm leading-relaxed text-abyss-800"><Highlight text={a.abstract} terms={terms} /></p>
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-abyss-100 pt-3">
        <p className="min-w-0 text-[13px] text-steel-600"><span className="font-semibold uppercase tracking-[0.06em]">DOI</span>{' '}
          <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="break-all tabular-nums text-cobalt-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">{doi}<span className="sr-only"> (opens in a new tab)</span></a></p>
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
