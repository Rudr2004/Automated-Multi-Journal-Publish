// Article card (grid) and article row (list). A colour strip shows the discipline; actions are Download PDF (solid) and Cite Article (outline).
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { Button } from './Button'
import { CiteFlyout } from './CiteFlyout'
import { cx, Tag } from './primitives'
import { useToast } from './Toast'
import { disciplineColor } from './discipline'
import { Copy, Download, OpenAccess, Verified } from '../icons'

export type CardLayout = 'card' | 'list'

function Badges({ type }: { type: string }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Tag tone="neutral">{type}</Tag>
      {journal.badges.peerReviewed && <Tag tone="accent" icon={<Verified className="h-3.5 w-3.5" aria-hidden="true" />}>Peer Reviewed</Tag>}
      {journal.badges.openAccess && <Tag tone="brand" icon={<OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />}>Open Access</Tag>}
    </div>
  )
}

function DoiButton({ paperId }: { paperId: string }) {
  const toast = useToast()
  const doi = doiFor(paperId)
  return (
    <button type="button" onClick={async () => toast((await copyText(`https://doi.org/${doi}`)) ? 'DOI link copied' : 'Could not copy the DOI', 'success')}
      className="inline-flex items-center gap-1 rounded-chip text-xs font-medium text-accent-700 hover:underline" aria-label={`Copy DOI link ${doi}`}>
      <Copy className="h-3.5 w-3.5" aria-hidden="true" /> DOI {doi}
    </button>
  )
}

export function ArticleCard({ article, layout = 'card' }: { article: ArticleSummary; layout?: CardLayout }) {
  const color = disciplineColor(article.subject)
  const list = layout === 'list'
  return (
    <article className={cx('group relative flex h-full overflow-hidden rounded-panel border border-graphite-200 bg-white shadow-card transition-shadow hover:shadow-soft', list ? 'flex-col sm:flex-row' : 'flex-col')}>
      <span aria-hidden="true" className={cx('shrink-0', list ? 'h-1.5 w-full sm:h-auto sm:w-1.5' : 'h-1.5 w-full')} style={{ backgroundColor: color }} />
      <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color }}>{article.subject}</p>
          <p className="text-xs text-graphite-600">{formatDate(article.publishedAt)}</p>
        </div>
        <Badges type={article.type} />
        <h3 className="font-display text-lg font-semibold leading-snug text-graphite-800">
          <AppLink to={paths.article(article.paperId)} className="after:absolute after:inset-0 after:content-[''] hover:text-accent-700">{article.title}</AppLink>
        </h3>
        <p className="text-sm text-graphite-600">{article.authors.join(', ')}</p>
        {!list && <p className="line-clamp-3 text-sm text-graphite-700">{article.abstract}</p>}
        {list && <p className="line-clamp-2 hidden text-sm text-graphite-700 sm:block">{article.abstract}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-graphite-600">
          <span>Vol. {article.volume}, Issue {article.issue}{article.pages && `, pp. ${article.pages}`}</span>
          <span className="relative z-10"><DoiButton paperId={article.paperId} /></span>
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-2 pt-1">
          <Button variant="primary" onClick={() => downloadArticlePdf(article)} aria-label={`Download PDF: ${article.title}`}>
            <Download className="h-4 w-4" aria-hidden="true" /> Download PDF
          </Button>
          <CiteFlyout article={article} />
        </div>
      </div>
    </article>
  )
}
