// Right-hand rail: metrics with icons, a compact cite exporter (APA, MLA, Chicago, BibTeX, RIS, IEEE) and the "Paper details" details panel.
import { useMemo, useState } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../../core/lib/cite'
import { downloadText } from '../../../../core/lib/clipboard'
import { formatDate } from '../../../../core/lib/format'
import type { ArticleFull } from '../../../../core/types'
import { buttonClass } from '../../components/Button'
import { Metrics } from '../../components/PaperBits'
import { cx } from '../../components/primitives'
import { Kicker } from '../../components/signature'
import { Download } from '../../icons'
import { CopyButton } from './shared'

export function SidePanel({ article }: { article: ArticleFull }) {
  const doi = doiFor(article.paperId)
  const [style, setStyle] = useState<CitationStyle>('apa')
  const text = useMemo(() => formatCitation(article, style), [article, style])
  const asFile = style === 'bibtex' || style === 'ris'
  const rows: [string, string | undefined][] = [
    ['Journal', journal.shortName],
    ['Type', article.type],
    ['Research area', article.subject],
    ['Volume / issue', `${article.volume} / ${article.issue}`],
    ['Pages', article.pages],
    ['Received', article.received ? formatDate(article.received) : undefined],
    ['Accepted', article.accepted ? formatDate(article.accepted) : undefined],
    ['Published', article.publishedOnline ? formatDate(article.publishedOnline) : article.publishedAt ? formatDate(article.publishedAt) : undefined],
    ['Licence', journal.licence.name],
    ['Paper ID', article.paperId],
    ['DOI', doi],
  ]
  return (
    <aside aria-label="Metrics, citation and paper details" className="space-y-4 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-0.5 print:hidden">
      <section aria-labelledby="side-metrics-h" className="rounded border border-wine-800/20 border-t-2 border-t-wine-800 bg-white p-4 shadow-none">
        <h2 id="side-metrics-h"><Kicker>Article metrics</Kicker></h2>
        <Metrics views={article.views} downloads={article.downloads} citations={article.citations} className="mt-3 justify-between text-base" />
        <p className="mt-2 text-xs text-obsidian-600">Views, PDF downloads and citations.</p>
      </section>

      <section aria-labelledby="side-cite-h" className="rounded border border-wine-800/20 border-t-2 border-t-wine-800 bg-white p-4 shadow-none">
        <h2 id="side-cite-h"><Kicker>Cite this article</Kicker></h2>
        <div role="group" aria-label="Citation style" className="mt-3 flex flex-wrap gap-1">
          {CITATION_STYLES_WITH_IEEE.map((s) => (
            <button key={s.id} type="button" aria-pressed={style === s.id} onClick={() => setStyle(s.id)}
              className={cx('min-h-11 rounded px-2.5 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 lg:min-h-8 transition-colors motion-reduce:transition-none', style === s.id ? 'bg-wine-800 text-white' : 'border border-obsidian-200 bg-white text-obsidian-700 hover:border-wine-700 hover:text-wine-700')}>{s.label}</button>
          ))}
        </div>
        <pre tabIndex={0} aria-label={`${style.toUpperCase()} citation`} className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded border border-obsidian-200 bg-obsidian-50 p-3 font-work text-xs leading-relaxed text-obsidian-800">{text}</pre>
        <div className="mt-3 flex flex-wrap gap-2">
          <CopyButton text={text} label="Copy citation" what="Citation" className={buttonClass('primary', 'min-h-11 !py-0 lg:min-h-9')}>Copy</CopyButton>
          {asFile && <button type="button" onClick={() => downloadText(citationFilename(article, style), text)} className={buttonClass('outline', 'min-h-11 !py-0 lg:min-h-9')}><Download className="h-4 w-4" aria-hidden="true" />.{style === 'ris' ? 'ris' : 'bib'}</button>}
        </div>
      </section>

      <section aria-labelledby="spec-h" className="rounded border border-wine-800/20 border-t-2 border-t-wine-800 bg-white shadow-none">
        <h2 id="spec-h" className="border-b border-wine-800/15 bg-[#FBF8F4] px-4 py-3 font-newsreader text-lg font-semibold text-obsidian-900">Paper details</h2>
        <dl className="divide-y divide-obsidian-100 text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 px-4 py-2">
              <dt className="text-obsidian-600">{k}</dt>
              <dd className="break-words font-medium tabular-nums text-obsidian-900 [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </aside>
  )
}
