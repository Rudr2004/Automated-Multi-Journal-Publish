// Dense search result: type tag, highlighted title, author photo chips, abstract snippet and icon metrics (eye / download / quote).
import { MdOutlineVisibility } from 'react-icons/md'
import { doiFor } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate, formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { portraitFor } from '../../../../mock-data/shared/portraits'
import { ArticleActions, AreaTag, Highlight } from '../../components/PageBand'
import { TypeChip } from '../../components/PaperBits'
import { Download, Quote } from '../../icons'

const initials = (n: string) => n.replace(/^(Prof\.|Dr\.)\s*/i, '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

function Chip({ name, terms }: { name: string; terms: string[] }) {
  const src = portraitFor(name)
  return (
    <li className="inline-flex items-center gap-1.5 rounded-full border border-[#E6DCD0] bg-[#FBF8F4] py-0.5 pl-0.5 pr-2.5 text-xs text-obsidian-800">
      {src ? <img src={src} alt="" loading="lazy" className="h-6 w-6 rounded-full object-cover" /> : <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-wine-800 text-[10px] font-semibold text-white">{initials(name)}</span>}
      <span><Highlight text={name} terms={terms} /></span>
    </li>
  )
}

export function ResultRow({ article: a, terms }: { article: ArticleSummary; terms: string[] }) {
  const abs = a.abstract.length > 260 ? `${a.abstract.slice(0, 260).replace(/\s+\S*$/, '')} (more in the article)` : a.abstract
  const metric = 'inline-flex items-center gap-1 tabular-nums'
  return (
    <li className="rounded border border-wine-800/15 bg-white p-4 shadow-none transition-[border-color,transform] duration-150 hover:border-wine-800/60 motion-safe:hover:-translate-y-px motion-reduce:transition-none sm:p-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <TypeChip type={a.type} />
        <AreaTag subject={a.subject} />
        <span className="text-xs tabular-nums text-obsidian-600">Vol. {a.volume}, Issue {a.issue} · pp. {a.pages} · {formatDate(a.publishedAt)}</span>
      </div>
      <h3 className="mt-2 font-newsreader text-xl font-semibold leading-snug text-obsidian-900">
        <AppLink to={paths.article(a.paperId)} className="hover:text-wine-700"><Highlight text={a.title} terms={terms} /></AppLink>
      </h3>
      <ul aria-label="Authors" className="mt-2 flex flex-wrap gap-1.5">{a.authors.map((n) => <Chip key={n} name={n} terms={terms} />)}</ul>
      <p className="mt-2 max-w-3xl font-serif4 text-[0.9375rem] leading-relaxed text-obsidian-700"><Highlight text={abs} terms={terms} /></p>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-[#EFE7DD] pt-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-obsidian-700">
          <span className="tabular-nums">DOI <span className="break-all">{doiFor(a.paperId)}</span></span>
          <span className={metric}><MdOutlineVisibility className="h-4 w-4 text-ochre-700" aria-hidden="true" />{formatNumber(a.views)}<span className="sr-only"> views</span></span>
          <span className={metric}><Download className="h-4 w-4 text-ochre-700" aria-hidden="true" />{formatNumber(a.downloads)}<span className="sr-only"> downloads</span></span>
          <span className={metric}><Quote className="h-4 w-4 text-ochre-700" aria-hidden="true" />{formatNumber(a.citations)}<span className="sr-only"> citations</span></span>
        </div>
        <ArticleActions article={a} />
      </div>
    </li>
  )
}
