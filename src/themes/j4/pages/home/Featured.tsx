// Featured paper: the editors' lead pick with its key facts in a specification box.
import { journal, doiFor } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { copyText } from '../../../../core/lib/clipboard'
import { formatDate, formatNumber } from '../../../../core/lib/format'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { areaColor } from '../../components/areas'
import { Button, ButtonLink } from '../../components/Button'
import { CiteMenu } from '../../components/CiteMenu'
import { Container, Label } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import { ArrowRight, Copy, Download, Quote } from '../../icons'

export function Featured({ article }: { article: ArticleSummary }) {
  const toast = useToast()
  const doi = doiFor(article.paperId)
  const rows: [string, string][] = [['Type', article.type], ['Published', formatDate(article.publishedAt)], ['Pages', article.pages], ['Views', formatNumber(article.views)], ['Downloads', formatNumber(article.downloads)]]
  return (
    <section aria-labelledby="featured-title" className="pt-28 sm:pt-32">
      <Container>
        <div className="grid gap-px overflow-hidden rounded-pane border border-abyss-200 bg-abyss-200 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <article className="bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Label className="text-cobalt-700">Featured paper</Label>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold" style={{ color: areaColor(article.subject) }}><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: areaColor(article.subject) }} />{article.subject}</span>
            </div>
            <h2 id="featured-title" className="mt-3 font-serif4 text-[1.625rem] font-semibold leading-[1.2] tracking-tight text-abyss-900 sm:text-[2rem]">
              <AppLink to={paths.article(article.paperId)} className="hover:text-cobalt-700">{article.title}</AppLink>
            </h2>
            <p className="mt-3 text-sm font-medium text-abyss-800">{article.authors.join(', ')}</p>
            <p className="mt-4 text-base leading-relaxed text-steel-700">{article.abstract}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <ButtonLink to={paths.article(article.paperId)} variant="primary">Read the paper <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
              <Button variant="outline" onClick={() => downloadArticlePdf(article)}><Download className="h-4 w-4" aria-hidden="true" /> Download PDF</Button>
              <CiteMenu article={article} className="inline-flex items-center justify-center gap-2 rounded-ctl border border-abyss-300 bg-white px-4 py-2.5 text-sm font-semibold text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700"><Quote className="h-4 w-4" aria-hidden="true" />Cite</CiteMenu>
            </div>
          </article>
          <aside aria-label="Paper details" className="bg-abyss-50 p-6 sm:p-8">
            <Label className="text-steel-600">Paper details</Label>
            <dl className="mt-3 divide-y divide-abyss-200 text-sm tabular-nums">
              {rows.map(([k, v]) => <div key={k} className="flex items-center justify-between gap-3 py-2"><dt className="text-steel-600">{k}</dt><dd className="font-medium text-abyss-900">{v}</dd></div>)}
            </dl>
            <p className="mt-4 text-xs text-steel-600">DOI</p>
            <button type="button" onClick={async () => toast((await copyText(`https://doi.org/${doi}`)) ? 'DOI link copied' : 'Could not copy the DOI', 'success')} aria-label={`Copy DOI link ${doi}`}
              className="mt-1 flex w-full items-center justify-between gap-2 rounded-ctl border border-abyss-300 bg-white px-3 py-2 text-left text-sm font-medium tabular-nums text-abyss-900 hover:border-cobalt-700">
              <span className="min-w-0 break-all">{doi}</span><Copy className="h-4 w-4 shrink-0 text-steel-500" aria-hidden="true" />
            </button>
            <p className="mt-4 text-xs text-steel-600">Published open access under {journal.licence.name}.</p>
          </aside>
        </div>
      </Container>
    </section>
  )
}
