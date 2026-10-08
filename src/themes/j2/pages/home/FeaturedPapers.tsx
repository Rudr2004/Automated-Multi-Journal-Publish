// "Editor's choice": one large feature and a short list of compact picks.
import { paths } from '../../../../config/routes'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { Button } from '../../components/Button'
import { CiteFlyout } from '../../components/CiteFlyout'
import { DisciplineIcon, disciplineColor, disciplineOf } from '../../components/discipline'
import { Container, SectionHeading, Tag } from '../../components/primitives'
import { ArrowRight, Download, Star } from '../../icons'

export function FeaturedPapers({ articles }: { articles: ArticleSummary[] }) {
  if (!articles.length) return null
  const [lead, ...rest] = articles
  const d = disciplineOf(lead.subject)
  return (
    <section aria-labelledby="featured-title" className="py-14 sm:py-20">
      <Container>
        <SectionHeading id="featured-title" eyebrow="Editor’s choice" title="Papers our editors recommend"
          action={<AppLink to={paths.currentIssue} className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700 hover:underline">Browse the current issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>} />
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <article className="flex flex-col overflow-hidden rounded-panel border border-graphite-200 bg-white shadow-card">
            <div className="flex items-center justify-between gap-3 px-6 py-4" style={{ backgroundColor: `${disciplineColor(lead.subject)}14` }}>
              <div className="flex items-center gap-3">{d && <DisciplineIcon discipline={d} />}<p className="text-sm font-semibold" style={{ color: disciplineColor(lead.subject) }}>{lead.subject}</p></div>
              <Tag tone="brand" icon={<Star className="h-3.5 w-3.5" aria-hidden="true" />}>Editor’s choice</Tag>
            </div>
            <div className="flex flex-1 flex-col gap-3 p-6">
              <h3 className="font-display text-2xl font-bold leading-snug text-graphite-800"><AppLink to={paths.article(lead.paperId)} className="hover:text-accent-700">{lead.title}</AppLink></h3>
              <p className="text-sm text-graphite-600">{lead.authors.join(', ')} · {formatDate(lead.publishedAt)}</p>
              <p className="line-clamp-4 text-graphite-700">{lead.abstract}</p>
              <div className="mt-auto flex flex-wrap gap-2 pt-3">
                <Button onClick={() => downloadArticlePdf(lead)}><Download className="h-4 w-4" aria-hidden="true" /> Download PDF</Button>
                <CiteFlyout article={lead} />
              </div>
            </div>
          </article>
          <ul className="grid content-start gap-4">
            {rest.slice(0, 3).map((a) => (
              <li key={a.paperId}>
                <article className="flex gap-4 rounded-panel border border-graphite-200 bg-white p-4 shadow-card transition-shadow hover:shadow-soft">
                  <span aria-hidden="true" className="w-1 shrink-0 rounded-full" style={{ backgroundColor: disciplineColor(a.subject) }} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: disciplineColor(a.subject) }}>{a.subject}</p>
                    <h3 className="mt-1 font-display text-base font-semibold leading-snug text-graphite-800"><AppLink to={paths.article(a.paperId)} className="hover:text-accent-700">{a.title}</AppLink></h3>
                    <p className="mt-1 text-sm text-graphite-600">{a.authors[0]}{a.authors.length > 1 ? ' et al.' : ''} · {formatDate(a.publishedAt)}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  )
}
