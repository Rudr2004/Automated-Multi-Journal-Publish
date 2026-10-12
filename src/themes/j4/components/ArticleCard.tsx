// Scholarly article card for the issue and archive lists. Strict replica of the reference ("current issue, cover showcase"): chips and serif title on top, then a
// stacked "Contributing authors" list (avatar, name, role chip, certificate link) and a DOI/pages strip on the left, and a column of quick actions
// (view, PDF, cite, share, abstract) with the Views / Downloads panel on the right.
import { useId, useState, type ReactNode } from 'react'
import { MdOutlineVisibility as Eye, MdOutlinePictureAsPdf as Pdf, MdOutlineShare as Share } from 'react-icons/md'
import { doiFor } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, ArticleType } from '../../../core/types'
import { orcidFor } from '../../../mock-data/shared/identity'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { Award, Book, ChevronDown, Download, Quote, Verified } from '../icons'
import { AREA_ICONS, areaColor, areaOf } from './areas'
import { CiteMenu } from './CiteMenu'
import { Highlight } from './PageBand'
import { cx } from './primitives'
import { useToast } from './Toast'

const BTN = 'inline-flex w-full items-center justify-center gap-1.5 rounded px-3 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-1'
const SOLID = `${BTN} min-h-11 bg-cobalt-700 py-2 font-semibold text-white shadow-hair transition-colors hover:bg-cobalt-800 lg:min-h-9`
const SOFT = `${BTN} min-h-11 border border-slate-300 bg-slate-100 py-2 font-semibold text-slate-800 transition-colors hover:bg-slate-200 lg:min-h-9`
const PLAIN = `${BTN} min-h-11 border border-slate-200 bg-white py-1.5 font-medium text-slate-700 transition-colors hover:bg-slate-50 lg:min-h-8`

const TYPE_CHIP: Record<ArticleType, string> = {
  'Research Article': 'border-sky-200 bg-sky-50 text-sky-900',
  'Review Article': 'border-purple-200 bg-purple-50 text-purple-800',
  'Short Communication': 'border-amber-200 bg-amber-50 text-amber-900',
  Editorial: 'border-slate-300 bg-slate-100 text-slate-800',
}

function AuthorAvatar({ name }: { name: string }) {
  const src = portraitFor(name)
  const initials = name.replace(/^(Prof|Dr)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('')
  return src
    ? <img src={src} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 shrink-0 rounded-full border border-sky-300 object-cover" />
    : <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-slate-100 font-serif4 text-xs font-bold text-slate-700">{initials}</span>
}

export function ArticleCard({ article: a, terms = [], defaultOpen = false, showIssue = false, extra }: { article: ArticleSummary; terms?: string[]; defaultOpen?: boolean; showIssue?: boolean; extra?: ReactNode }) {
  const toast = useToast()
  const [open, setOpen] = useState(defaultOpen)
  const absId = useId()
  const doi = doiFor(a.paperId)
  const link = () => `${window.location.origin}${paths.article(a.paperId)}`
  const area = areaOf(a.subject)
  const AreaIcon = area ? AREA_ICONS[area.icon] : undefined

  const share = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: a.title, url: link() }); return }
    } catch { return }
    toast((await copyText(link())) ? 'Article link copied' : 'Could not copy the link', 'success')
  }

  return (
    <li className="list-none rounded-[12px] border border-slate-200 bg-white p-5 shadow-hair transition-colors hover:border-sky-300 md:p-6">
      <div className="mb-4 border-b border-slate-200 pb-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className={cx('rounded border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide', TYPE_CHIP[a.type])}>{a.type}</span>
          <span className="inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-800"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Open Access</span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-800">
            {AreaIcon ? <AreaIcon className="h-3.5 w-3.5" style={{ color: areaColor(a.subject) }} aria-hidden="true" /> : null}{a.subject}
          </span>
        </div>
        <h3 className="font-serif4 text-lg font-bold leading-snug text-[#0b2545] md:text-xl">
          <AppLink to={paths.article(a.paperId)} className="transition-colors hover:text-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600"><Highlight text={a.title} terms={terms} /></AppLink>
        </h3>
      </div>

      <div className="grid items-stretch gap-5 md:grid-cols-12">
        <div className="flex min-w-0 flex-col justify-between space-y-4 md:col-span-8 lg:col-span-9">
          <div className="space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{a.authors.length === 1 ? 'Author:' : 'Contributing authors:'}</p>
            <ul aria-label="Authors" className="space-y-2 text-xs">
              {a.authors.map((n, i) => {
                const orcid = orcidFor(n)
                const role = a.authors.length === 1 ? 'Author' : i === 0 ? 'Lead Author' : 'Co-Author'
                return (
                  <li key={n} className="flex items-center justify-between gap-2 rounded-lg border border-slate-100 bg-slate-50/60 p-2 transition-colors hover:bg-slate-50">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <AuthorAvatar name={n} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <AppLink to={paths.search(n)} className="break-words font-serif4 font-bold text-slate-900 hover:text-cobalt-700 hover:underline"><Highlight text={n} terms={terms} /></AppLink>
                          {i === 0 && a.authors.length > 1
                            ? <span className="rounded border border-sky-200 bg-sky-50 px-1.5 text-[10px] font-semibold text-cobalt-700">{role}</span>
                            : <span className="text-[10px] font-medium text-slate-500">{role}</span>}
                        </div>
                        {orcid && <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD of ${n} (opens in a new tab)`} className="mt-0.5 block font-mono text-[11px] leading-none text-slate-500 hover:text-cobalt-700 hover:underline">ORCID {orcid}</a>}
                      </div>
                    </div>
                    <AppLink to={paths.verify()} aria-label={`Verify the author certificate of ${n}`} className="flex shrink-0 items-center gap-0.5 rounded border border-sky-200 bg-white px-2 py-1 text-[10px] font-semibold text-cobalt-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                      <Award className="h-3.5 w-3.5" aria-hidden="true" />Certificate
                    </AppLink>
                  </li>
                )
              })}
            </ul>
          </div>
          {open && (
            <div id={absId} className="rounded-lg border border-l-[3px] border-slate-200 border-l-azure-600 bg-sky-50/60 p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600">Abstract</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-800"><Highlight text={a.abstract} terms={terms} /></p>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 bg-slate-50/60 p-2.5 text-xs">
            <div className="flex min-w-0 flex-wrap items-center gap-2 font-mono text-[11px]">
              <span className="font-medium text-slate-500">DOI:</span>
              <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="break-all font-semibold text-cobalt-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">{doi}<span className="sr-only"> (opens in a new tab)</span></a>
              <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="ml-1 inline-flex items-center gap-1 rounded border border-slate-200 bg-white px-2 py-0.5 text-[10px] text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                <Verified className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />Verify DOI<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-slate-500">Pages:</span>
              <span className="font-mono text-xs font-semibold text-slate-700">{showIssue && <>Vol. {a.volume}, Issue {a.issue} · </>}pp. {a.pages} · {formatDate(a.publishedAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between space-y-4 border-t border-slate-200 pt-4 md:col-span-4 md:border-l md:border-t-0 md:pl-5 md:pt-0 lg:col-span-3">
          <div className="flex w-full flex-col gap-2">
            <AppLink to={paths.article(a.paperId)} aria-label={`View full article: ${a.title}`} className={SOLID}><Book className="h-4 w-4" aria-hidden="true" />View Full Article</AppLink>
            <button type="button" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`} className={SOFT}><Pdf className="h-4 w-4 text-red-600" aria-hidden="true" />Download PDF</button>
            <CiteMenu article={a} className={PLAIN}><Quote className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Cite This Article</CiteMenu>
            <button type="button" onClick={share} aria-label={`Share: ${a.title}`} className={PLAIN}><Share className="h-4 w-4 text-cobalt-700" aria-hidden="true" />Share</button>
            <button type="button" aria-expanded={open} aria-controls={open ? absId : undefined} onClick={() => setOpen(!open)} className={PLAIN}>
              {open ? 'Hide abstract' : 'Show abstract'}<ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
            </button>
            {extra}
          </div>
          <dl className="mt-auto flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 p-2.5 font-mono text-[11px] text-slate-600">
            {([[Eye, 'Views', a.views], [Download, 'Downloads', a.downloads], [Quote, 'Citations', a.citations]] as const).map(([Icon, label, n]) => (
              <div key={label} className="flex items-center justify-between">
                <dt className="inline-flex items-center gap-1 text-slate-500"><Icon className="h-3.5 w-3.5" aria-hidden="true" />{label}:</dt>
                <dd className="font-bold text-slate-800">{formatNumber(n)}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </li>
  )
}
