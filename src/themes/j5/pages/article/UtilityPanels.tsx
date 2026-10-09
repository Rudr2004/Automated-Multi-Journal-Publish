// Metrics, Cite & share and Related tabs.
import { useMemo, useState } from 'react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../../core/lib/cite'
import { downloadText } from '../../../../core/lib/clipboard'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { buttonClass } from '../../components/Button'
import { cx } from '../../components/primitives'
import { Kicker } from '../../components/signature'
import { areaColor } from '../../components/areas'
import { ArrowRight, Download, LinkIcon, Verified } from '../../icons'
import { CopyButton, num, PanelTitle, pageUrl, useArticleActions } from './shared'

export function MetricsPanel({ article }: { article: ArticleFull }) {
  const per100 = article.views > 0 ? ((article.downloads / article.views) * 100).toFixed(1) : null
  const items: [string, number | undefined, string][] = [
    ['Views', article.views, 'Abstract and full-text page loads since publication.'],
    ['Downloads', article.downloads, 'PDF downloads of the published version.'],
    ['Citations', article.citations, 'Citing works found in indexed sources.'],
  ]
  return (
    <div>
      <PanelTitle>Article metrics</PanelTitle>
      <dl className="mt-6 grid gap-px overflow-hidden rounded border border-wine-800/20 bg-wine-800/15 sm:grid-cols-3">
        {items.map(([k, v, hint]) => (
          <div key={k} className="border-t-2 border-t-wine-800 bg-[#FBF8F4] p-5">
            <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600">{k}</dt>
            <dd className="mt-2 font-newsreader text-[2.5rem] leading-none font-semibold tabular-nums text-obsidian-900">{num(v)}</dd>
            <p className="mt-2 text-sm text-obsidian-600">{hint}</p>
          </div>
        ))}
      </dl>
      {per100 && <p className="mt-4 max-w-[68ch] text-sm text-obsidian-700">Readers download the PDF in about <strong className="font-semibold tabular-nums text-obsidian-900">{per100}</strong> of every 100 visits, a sign of how often the full paper is used rather than only skimmed.</p>}
      <p className="mt-2 max-w-[68ch] text-sm text-obsidian-600">Counts update daily. Citation counts depend on the indexing services that report them and may lag by several weeks.</p>
    </div>
  )
}

export function CitePanel({ article }: { article: ArticleFull }) {
  const [style, setStyle] = useState<CitationStyle>('apa')
  const { share, copyLink } = useArticleActions(article)
  const doi = doiFor(article.paperId)
  const text = useMemo(() => formatCitation(article, style), [article, style])
  const asFile = style === 'bibtex' || style === 'ris'
  return (
    <div>
      <PanelTitle>Cite &amp; share</PanelTitle>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <section aria-labelledby="cite-style-h">
          <h3 id="cite-style-h"><Kicker>Citation format</Kicker></h3>
          <div role="group" aria-label="Citation style" className="mt-3 flex flex-wrap gap-1.5">
            {CITATION_STYLES_WITH_IEEE.map((s) => (
              <button key={s.id} type="button" aria-pressed={style === s.id} onClick={() => setStyle(s.id)}
                className={cx('min-h-11 rounded px-3 text-sm font-semibold sm:min-h-9', style === s.id ? 'bg-wine-800 text-white' : 'border border-obsidian-200 bg-white text-obsidian-700 hover:border-wine-700 hover:text-wine-700')}>{s.label}</button>
            ))}
          </div>
          <pre tabIndex={0} aria-label={`${style.toUpperCase()} citation`} className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded border border-obsidian-200 bg-obsidian-50 p-4 font-work text-sm leading-relaxed text-obsidian-800">{text}</pre>
          <div className="mt-3 flex flex-wrap gap-2">
            <CopyButton text={text} label="Copy citation" what="Citation" className={buttonClass('cta', 'min-h-11')}>Copy citation</CopyButton>
            {asFile && <button type="button" onClick={() => downloadText(citationFilename(article, style), text)} className={buttonClass('outline', 'min-h-11')}><Download className="h-4 w-4" aria-hidden="true" />Download .{style === 'ris' ? 'ris' : 'bib'}</button>}
          </div>
        </section>
        <section aria-labelledby="share-h">
          <h3 id="share-h"><Kicker>Share this article</Kicker></h3>
          <dl className="mt-3 divide-y divide-obsidian-100 rounded border border-obsidian-200 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
              <div className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600">DOI</dt><dd className="break-all tabular-nums text-obsidian-900">{doi}</dd></div>
              <CopyButton text={`https://doi.org/${doi}`} label={`Copy DOI link ${doi}`} what="DOI" className="border border-obsidian-200 text-obsidian-700 hover:border-wine-700 hover:text-wine-700">Copy</CopyButton>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2">
              <div className="min-w-0"><dt className="text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600">Article link</dt><dd className="break-all text-obsidian-900">{paths.article(article.paperId)}</dd></div>
              <button type="button" onClick={() => void copyLink()} className="inline-flex min-h-11 items-center gap-1.5 rounded border border-obsidian-200 px-3 text-sm font-semibold text-obsidian-700 hover:border-wine-700 hover:text-wine-700 sm:min-h-9"><LinkIcon className="h-4 w-4" aria-hidden="true" />Copy link</button>
            </div>
          </dl>
          <button type="button" onClick={() => void share()} className={buttonClass('outline', 'mt-3 min-h-11')}><LinkIcon className="h-4 w-4" aria-hidden="true" />Share {typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? '' : 'by link'}</button>
          <p className="mt-5 max-w-[60ch] text-sm leading-relaxed text-obsidian-700">
            Published open access under <a href={journal.licence.url} target="_blank" rel="noreferrer" className="font-medium text-wine-700 underline underline-offset-2">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a>. You may share and adapt the work with credit to the authors.{' '}
            <AppLink to={paths.verify()} className="inline-flex items-center gap-1 font-medium text-wine-700 underline underline-offset-2"><Verified className="h-4 w-4" aria-hidden="true" />Verify an author certificate</AppLink>
          </p>
          <p className="sr-only">Current page address: {typeof window !== 'undefined' ? pageUrl() : ''}</p>
        </section>
      </div>
    </div>
  )
}

export function RelatedPanel({ article }: { article: ArticleFull }) {
  // Same research area first, then those sharing words with this paper's keywords.
  const rows = useMemo(() => {
    const kw = new Set((article.keywords ?? []).flatMap((k) => k.toLowerCase().split(/\s+/)))
    const score = (a: ArticleFull['related'][number]) => (a.subject === article.subject ? 10 : 0) + [...new Set(a.title.toLowerCase().split(/\W+/))].filter((w) => w.length > 3 && kw.has(w)).length
    return [...article.related].filter((a) => a.paperId !== article.paperId).sort((a, b) => score(b) - score(a))
  }, [article])
  return (
    <div>
      <PanelTitle>Related articles</PanelTitle>
      <p className="mt-2 text-sm text-obsidian-600">Matched by research area and keywords.</p>
      <ul className="mt-6 divide-y divide-obsidian-100 border-y-2 border-wine-800">
        {rows.map((a) => (
          <li key={a.paperId}>
            <AppLink to={paths.article(a.paperId)} className="group flex items-start gap-3 py-4 transition-colors hover:bg-[#FBF8F4] motion-reduce:transition-none sm:px-2">
              <span aria-hidden="true" className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ background: areaColor(a.subject) }} />
              <span className="min-w-0 flex-1">
                <span className="block break-words font-newsreader text-lg font-semibold leading-snug text-obsidian-900 group-hover:text-wine-700">{a.title}</span>
                <span className="mt-1 block break-words text-sm text-obsidian-600">{a.authors.join(', ')}</span>
                <span className="mt-1 block text-xs tabular-nums text-obsidian-600">{a.subject} · {a.type} · Vol. {a.volume}, No. {a.issue} · {formatMonthYear(a.publishedAt)}</span>
              </span>
              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-obsidian-500 group-hover:text-wine-700" aria-hidden="true" />
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  )
}
