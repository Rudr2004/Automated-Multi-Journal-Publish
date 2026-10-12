// Shared pieces for article listings (issue, archive, search): colour-coded paper types, author photo chips with ORCID badges,
// icon metrics and the full article row. Scholarly look: hairline borders, a type-coloured left rule, tabular numbers.
import { useId, useState, type ReactNode } from 'react'
import { MdOutlinePictureAsPdf as PdfIcon, MdOutlineVisibility as Eye } from 'react-icons/md'
import { doiFor } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, ArticleType } from '../../../core/types'
import { orcidFor } from '../../../mock-data/shared/identity'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { ChevronDown, Download, Quote } from '../icons'
import { CiteMenu } from './CiteMenu'
import { cx } from './primitives'
import { Highlight } from './PageBand'

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

// Issue-reference article card: a solid type label, a research-area chip cycling through the reference palette, a one-line title,
// author photo + name + ORCID "iD", then a DOI / metrics / action row. Text greys are #6F5A58 (the reference #897270 is 4.1:1 on white).
const GREY = 'text-[#6F5A58]'
const SEP = <span aria-hidden="true" className="text-[#DCC0BE]">•</span>
const TYPE_SOLID: Record<ArticleType, string> = {
  'Research Article': 'bg-wine-800 text-white', 'Review Article': 'bg-ochre-700 text-white',
  'Short Communication': 'bg-[#6B1E2F] text-white', Editorial: 'bg-bordeaux-900 text-white',
}
/** The reference gives area chips different tints; they are assigned by a stable hash of the area name. */
const AREA_TINTS = [
  'border-[#DCC0BE]/30 bg-[#E9EDFF] text-wine-900', 'border-amber-300 bg-amber-50 text-amber-900', 'border-ochre-700/30 bg-ochre-700/10 text-ochre-700',
  'border-[#DCC0BE]/30 bg-[#E1E8FD] text-[#141B2B]', 'border-wine-800/30 bg-wine-800/10 text-wine-800',
]
const tintOf = (subject: string) => AREA_TINTS[[...subject].reduce((n, c) => n + c.charCodeAt(0), 0) % AREA_TINTS.length]

const BTN = 'inline-flex items-center gap-1.5 rounded px-2.5 py-1.5 font-work text-base font-medium transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 min-h-11 lg:min-h-0'
const BTN_GREY = `${BTN} border border-[#DCC0BE]/60 bg-[#E9EDFF] text-[#141B2B] hover:bg-[#E1E8FD]`

/** One article in a listing. `showIssue` adds the volume/issue to the meta line (archive and search). */
export function PaperRow({ article: a, terms = [], defaultOpen = false, showIssue = false, extra }: { article: ArticleSummary; terms?: string[]; defaultOpen?: boolean; showIssue?: boolean; extra?: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen)
  const absId = useId()
  const doi = doiFor(a.paperId)
  const stat = (Icon: typeof Eye, n: number, word: string) => (
    <span className="inline-flex items-center gap-1" title={word}><Icon className="h-[15px] w-[15px]" aria-hidden="true" />{formatNumber(n)}<span className="sr-only"> {word}</span></span>
  )
  return (
    <li className="mt-6 space-y-4 rounded border border-[#DCC0BE]/30 bg-white p-6 shadow-sm transition-shadow first:mt-0 hover:shadow-md motion-reduce:transition-none">
      <div className={cx('flex flex-wrap items-center gap-2 font-work text-base', GREY)}>
        <span className={cx('rounded px-2.5 py-0.5 text-base font-semibold uppercase shadow-sm', TYPE_SOLID[a.type])}>{a.type}</span>
        {SEP}
        <span className={cx('rounded border px-2.5 py-0.5 text-xs font-medium', tintOf(a.subject))}>{a.subject}</span>
        {SEP}
        <span>{showIssue && <>Vol. {a.volume}, Issue {a.issue} · </>}pp. {a.pages}</span>
        {SEP}
        <span>{formatDate(a.publishedAt)}</span>
      </div>
      <h3 className="font-newsreader text-base font-semibold leading-snug text-[#141B2B]">
        <AppLink to={paths.article(a.paperId)} className="transition-colors hover:text-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700"><Highlight text={a.title} terms={terms} /></AppLink>
      </h3>
      <ul aria-label="Authors" className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-work text-base text-[#141B2B]">
        {a.authors.map((n) => {
          const orcid = orcidFor(n)
          return (
            <li key={n} className="inline-flex items-center gap-1.5">
              <Avatar name={n} size={20} />
              <AppLink to={paths.search(n)} className="font-medium hover:text-wine-800 hover:underline"><Highlight text={n} terms={terms} /></AppLink>
              {orcid && <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer" title={`ORCID: ${orcid}`} aria-label={`ORCID iD of ${n} (opens in a new tab)`} className="text-[13px] font-bold text-emerald-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">iD</a>}
            </li>
          )
        })}
      </ul>
      {open && (
        <div id={absId} className="rounded bg-[#F4F5FC] p-4 text-[#564241]">
          <p className="font-serif4 text-base leading-relaxed"><Highlight text={a.abstract} terms={terms} /></p>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E1E8FD] pt-3 font-work text-base">
        <p className="min-w-0"><span className={GREY}>DOI:</span>{' '}
          <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="break-all font-mono text-sm font-medium text-wine-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">{doi}<span className="sr-only"> (opens in a new tab)</span></a></p>
        <p className={cx('flex items-center gap-4 tabular-nums', GREY)}>{stat(Eye, a.views, 'views')}{stat(Download, a.downloads, 'downloads')}{stat(Quote, a.citations, 'citations')}</p>
        <div className="flex flex-wrap items-center gap-2">
          <AppLink to={paths.article(a.paperId)} className={cx(BTN, 'bg-wine-900 font-semibold uppercase text-white shadow-sm hover:bg-wine-800 px-3')}><Eye className="h-[15px] w-[15px]" aria-hidden="true" />View Article</AppLink>
          <button type="button" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`} className={cx(BTN, 'border border-wine-900/20 bg-wine-900/10 text-wine-900 hover:bg-wine-800 hover:text-white')}><PdfIcon className="h-[15px] w-[15px]" aria-hidden="true" />PDF</button>
          <CiteMenu article={a} className={BTN_GREY}><Quote className="h-[15px] w-[15px]" aria-hidden="true" />Cite</CiteMenu>
          <button type="button" aria-expanded={open} aria-controls={open ? absId : undefined} onClick={() => setOpen(!open)} className={BTN_GREY}>
            Abstract<ChevronDown className={cx('h-[14px] w-[14px] transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
          </button>
          {extra}
        </div>
      </div>
    </li>
  )
}
