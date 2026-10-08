// Right-hand column: a "Paper details" spec sheet and a short "How to cite" snippet.
import { doiFor, journal } from '../../../../config/journals'
import { formatCitation } from '../../../../core/lib/cite'
import { formatDate } from '../../../../core/lib/format'
import type { ArticleFull } from '../../../../core/types'
import { Label } from '../../components/primitives'
import { CopyButton, num } from './shared'

export function SidePanel({ article }: { article: ArticleFull }) {
  const doi = doiFor(article.paperId)
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
    ['Reads', `${num(article.views)} views · ${num(article.downloads)} downloads`],
  ]
  const snippet = formatCitation(article, 'apa')
  return (
    <aside aria-label="Paper details and citation" className="space-y-4 lg:sticky lg:top-[7.5rem] lg:self-start print:hidden">
      <section aria-labelledby="spec-h" className="rounded-pane border border-abyss-200 bg-white shadow-hair">
        <h2 id="spec-h" className="border-b border-abyss-200 bg-abyss-50 px-4 py-3 font-serif4 text-base font-semibold text-abyss-900">Paper details</h2>
        <dl className="divide-y divide-abyss-100 text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 px-4 py-2">
              <dt className="text-steel-600">{k}</dt>
              <dd className="break-words font-medium tabular-nums text-abyss-900 [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section aria-labelledby="how-cite-h" className="rounded-pane border border-abyss-200 bg-white p-4 shadow-hair">
        <h2 id="how-cite-h"><Label className="text-cobalt-700">How to cite</Label></h2>
        <p className="mt-2 max-h-40 overflow-auto break-words text-[13px] leading-relaxed text-steel-700">{snippet}</p>
        <CopyButton text={snippet} label="Copy APA citation" what="Citation" className="mt-3 border border-abyss-200 text-steel-700 hover:border-cobalt-700 hover:text-cobalt-700">Copy citation</CopyButton>
      </section>
    </aside>
  )
}
