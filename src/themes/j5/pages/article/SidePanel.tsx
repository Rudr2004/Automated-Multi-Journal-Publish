// Right rail (4 of 12 columns), card for card as in the reference: article metrics, author declarations, cite this article, paper details.
import { useMemo, useState } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../../core/lib/cite'
import { downloadText } from '../../../../core/lib/clipboard'
import { formatDate } from '../../../../core/lib/format'
import type { ArticleFull } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { Download, FactCheck, Shield, TaskDone } from '../../icons'
import { CARD, CopyButton, LABEL, num } from './shared'

const H4 = `${LABEL} flex items-center gap-1.5`

export function SidePanel({ article }: { article: ArticleFull }) {
  const doi = doiFor(article.paperId)
  const [style, setStyle] = useState<CitationStyle>('apa')
  const text = useMemo(() => formatCitation(article, style), [article, style])
  const asFile = style === 'bibtex' || style === 'ris'
  const per100 = article.views > 0 ? (article.downloads / article.views) * 100 : null
  const published = article.publishedOnline || article.publishedAt
  const rows: [string, string | undefined, string?][] = [
    ['Journal', journal.shortName],
    ['Type', article.type],
    ['Research area', article.subject],
    ['Volume / issue', `${article.volume} / ${article.issue}`],
    ['Pages', article.pages],
    ['Received', article.received ? formatDate(article.received) : undefined],
    ['Accepted', article.accepted ? formatDate(article.accepted) : undefined],
    ['Published', published ? formatDate(published) : undefined],
    ['Licence', journal.licence.name],
    ['Paper ID', article.paperId, 'font-mono'],
    ['DOI', doi, 'font-mono text-wine-800'],
  ]
  return (
    <aside aria-label="Metrics, declarations, citation and paper details" className="space-y-5 lg:col-span-4">
      <section id="metrics" aria-labelledby="side-metrics-h" className={`${CARD} scroll-mt-32 space-y-3.5 p-4`}>
        <h2 id="side-metrics-h" className={H4}><FactCheck className="h-4 w-4 text-wine-800" aria-hidden="true" />Article metrics &amp; impact</h2>
        <dl className="grid grid-cols-3 gap-2 text-center">
          {([['Views', article.views, 'text-wine-800'], ['Downloads', article.downloads, 'text-ochre-700'], ['Citations', article.citations, 'text-amber-800']] as const).map(([k, v, c]) => (
            <div key={k} className="rounded bg-[#F4F5FC] p-2">
              <dd className={`block text-base font-bold tabular-nums ${c}`}>{num(v)}</dd>
              <dt className="font-work text-[10px] uppercase text-[#564241]">{k}</dt>
            </div>
          ))}
        </dl>
        {per100 !== null && (
          <div className="space-y-1 border-t border-[#DCC0BE] pt-2.5">
            <div className="flex items-center justify-between gap-2 font-work text-[11px] text-[#564241]">
              <span className="flex items-center gap-1"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-ochre-700" />Downloads per 100 views</span>
              <span className="font-semibold tabular-nums text-obsidian-900">{per100.toFixed(1)}</span>
            </div>
            <div role="img" aria-label={`${per100.toFixed(1)} downloads per 100 views`} className="h-2 w-full overflow-hidden rounded-full bg-[#E1E8FD]"><div className="h-full rounded-full bg-ochre-700" style={{ width: `${Math.min(100, per100)}%` }} /></div>
            <p className="font-work text-[11px] text-[#564241]">Counts update daily; citation counts depend on the indexing services that report them.</p>
          </div>
        )}
      </section>

      <section id="disclosures" aria-labelledby="side-decl-h" className={`${CARD} scroll-mt-32 space-y-3 p-4`}>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DCC0BE] pb-1">
          <h2 id="side-decl-h" className={H4}><Shield className="h-4 w-4 text-ochre-700" aria-hidden="true" />Author declarations &amp; disclosures</h2>
        </div>
        <div className="space-y-2 font-work">
          {([
            ['Conflict of Interest', 'Authors declare any competing interests when they submit a manuscript. The statement for this paper is part of the published full text.'],
            ['Funding Statement', 'Funding sources, where reported by the authors, are listed in the published full text.'],
            ['Data Availability Statement', 'Requests for underlying data go to the corresponding author named in the author list above.'],
          ] as const).map(([k, v]) => (
            <div key={k} className="rounded bg-[#F4F5FC]/50 p-2">
              <h3 className="text-[11px] font-bold text-obsidian-900">{k}</h3>
              <p className="text-[11px] leading-tight text-[#564241]">{v}</p>
            </div>
          ))}
          <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-[#564241]">
            <span className="flex items-center gap-1"><TaskDone className="h-[14px] w-[14px] text-wine-800" aria-hidden="true" />Licence:</span>
            <a href={journal.licence.url} target="_blank" rel="noreferrer" className="font-medium text-wine-800 underline-offset-2 hover:underline">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>
      </section>

      <section id="cite-panel" aria-labelledby="side-cite-h" className={`${CARD} scroll-mt-32 space-y-3 p-4`}>
        <h2 id="side-cite-h" className={LABEL}>Cite this article</h2>
        <div role="group" aria-label="Citation style" className="flex flex-wrap gap-1 font-work text-[11px]">
          {CITATION_STYLES_WITH_IEEE.map((s) => (
            <button key={s.id} type="button" aria-pressed={style === s.id} onClick={() => setStyle(s.id)}
              className={cx('min-h-11 rounded px-2.5 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none lg:min-h-8', style === s.id ? 'bg-wine-800 font-semibold text-white' : 'bg-[#E9EDFF] text-obsidian-900 hover:bg-[#E1E8FD]')}>{s.label}</button>
          ))}
        </div>
        <div className="rounded bg-[#F4F5FC] p-2.5 text-left">
          <pre tabIndex={0} aria-label={`${style.toUpperCase()} citation`} className="max-h-24 overflow-y-auto whitespace-pre-wrap break-words pr-1 font-serif4 text-[11px] leading-relaxed text-obsidian-900">{text}</pre>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyButton text={text} label="Copy citation" what="Citation" className="!w-full flex-1 !bg-wine-800 !text-xs !font-bold !text-white shadow transition-colors hover:!bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2 motion-reduce:transition-none">Copy Citation</CopyButton>
          {asFile && <button type="button" onClick={() => downloadText(citationFilename(article, style), text)} className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded border border-[#DCC0BE] px-3 text-xs font-semibold text-obsidian-900 hover:bg-[#F4F5FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 lg:min-h-9"><Download className="h-4 w-4" aria-hidden="true" />Download .{style === 'ris' ? 'ris' : 'bib'}</button>}
        </div>
      </section>

      <section aria-labelledby="spec-h" className={`${CARD} space-y-2.5 p-4 font-work`}>
        <h2 id="spec-h" className={`${LABEL} pb-0.5`}>Paper details</h2>
        <dl className="space-y-1.5 text-xs">
          {rows.filter(([, v]) => v).map(([k, v, cls], i) => (
            <div key={k} className={cx('flex justify-between gap-3 px-2 py-1', i % 2 === 0 && 'rounded bg-[#F4F5FC]/50')}>
              <dt className="shrink-0 text-[#564241]">{k}</dt>
              <dd className={cx('min-w-0 break-words text-right font-semibold text-obsidian-900 [overflow-wrap:anywhere]', cls)}>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  )
}
