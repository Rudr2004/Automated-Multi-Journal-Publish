// Related articles: matched cards with type / access chips, title, authors, issue + DOI, stats and View / PDF / Cite actions.
import { useMemo } from 'react'
import { MdOutlineVisibility as Eye } from 'react-icons/md'
import { doiFor } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { CiteMenu } from '../../components/CiteMenu'
import { Book, Download, OpenAccess, Quote } from '../../icons'
import { CARD, num } from './shared'

const BTN = 'inline-flex min-h-11 items-center gap-1 rounded border border-[#DCC0BE] bg-[#E9EDFF] px-2.5 py-1 font-work text-[11px] font-semibold uppercase tracking-wider text-obsidian-900 transition-colors hover:bg-[#E1E8FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none sm:min-h-8'

export function RelatedPanel({ article }: { article: ArticleFull }) {
  // Same research area first, then those sharing words with this paper's keywords.
  const rows = useMemo(() => {
    const kw = new Set((article.keywords ?? []).flatMap((k) => k.toLowerCase().split(/\s+/)))
    const score = (a: ArticleFull['related'][number]) => (a.subject === article.subject ? 10 : 0) + [...new Set(a.title.toLowerCase().split(/\W+/))].filter((w) => w.length > 3 && kw.has(w)).length
    return [...article.related].filter((a) => a.paperId !== article.paperId).sort((a, b) => score(b) - score(a))
  }, [article])
  if (!rows.length) return null
  return (
    <div id="related-articles" className="scroll-mt-32 space-y-3 pt-2">
      <div className="flex flex-wrap items-center justify-between gap-x-3 border-b border-[#DCC0BE] pb-1">
        <h3 className="flex items-center gap-1.5 font-newsreader text-base font-semibold text-obsidian-900"><Book className="h-[18px] w-[18px] text-wine-800" aria-hidden="true" />Related Articles</h3>
        <span className="font-work text-xs text-[#564241]">Recommended by topic &amp; keywords</span>
      </div>
      <ul className="space-y-3">
        {rows.map((a) => (
          <li key={a.paperId} className={`${CARD} space-y-2 p-3.5 transition-colors hover:border-wine-800/30 motion-reduce:transition-none`}>
            <div className="flex flex-wrap items-center justify-between gap-1.5 font-work text-[10px] uppercase tracking-wider">
              <span className="rounded border border-wine-800/20 bg-wine-800/10 px-2 py-0.5 font-semibold text-wine-800">{a.type} • {a.subject}</span>
              <span className="flex items-center gap-0.5 font-semibold text-emerald-800"><OpenAccess className="h-[13px] w-[13px] text-emerald-700" aria-hidden="true" />Open Access</span>
            </div>
            <h4 className="font-newsreader text-sm font-bold leading-snug text-obsidian-900 sm:text-base"><AppLink to={paths.article(a.paperId)} className="break-words hover:text-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">{a.title}</AppLink></h4>
            <p className="break-words font-work text-[11px] leading-tight text-[#564241]">{a.authors.join(', ')}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#DCC0BE] pt-1 font-work text-[11px] text-[#564241]">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-medium text-obsidian-900">Vol. {a.volume}, No. {a.issue}{a.pages ? `, pp. ${a.pages}` : ''}</span>
                <span aria-hidden="true" className="text-[#DCC0BE]">•</span>
                <span className="break-all font-mono text-wine-800">DOI: {doiFor(a.paperId)}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="flex items-center gap-0.5"><Eye className="h-3 w-3 text-wine-800" aria-hidden="true" />{num(a.views)} Views</span>
                <span className="flex items-center gap-0.5"><Download className="h-3 w-3 text-ochre-700" aria-hidden="true" />{num(a.downloads)} Downloads</span>
                <span className="flex items-center gap-0.5 font-semibold text-amber-800"><Quote className="h-3 w-3" aria-hidden="true" />{num(a.citations)} Citations</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <AppLink to={paths.article(a.paperId)} className="inline-flex min-h-11 items-center gap-1 rounded bg-wine-800 px-2.5 py-1 font-work text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2 motion-reduce:transition-none sm:min-h-8"><Book className="h-[13px] w-[13px]" aria-hidden="true" />View Article</AppLink>
              <button type="button" onClick={() => downloadArticlePdf(a)} aria-label={`Download PDF: ${a.title}`} className={BTN}><Download className="h-[13px] w-[13px] text-wine-800" aria-hidden="true" />PDF</button>
              <CiteMenu article={a} className={BTN}><Quote className="h-[13px] w-[13px]" aria-hidden="true" />Cite</CiteMenu>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
