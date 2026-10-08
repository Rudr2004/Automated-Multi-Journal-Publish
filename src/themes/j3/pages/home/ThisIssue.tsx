// "This issue": an asymmetric grid of one large, two medium and three small tiles.
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../../core/types'
import { ArticleTile } from '../../components/ArticleTile'
import { Container, SectionTitle } from '../../components/primitives'
import { ArrowRight } from '../../icons'

export function ThisIssue({ issue, articles }: { issue: IssueSummary; articles: ArticleSummary[] }) {
  const [a, b, c, ...rest] = articles
  if (!a) return null
  return (
    <section aria-labelledby="issue-title" className="py-16 sm:py-24">
      <Container>
        <SectionTitle id="issue-title" kicker={`Vol. ${issue.volume} · Issue ${issue.issue} · ${formatMonthYear(issue.publishedAt)}`} title="This issue"
          action={<AppLink to={paths.currentIssue} className="inline-flex items-center gap-2 font-jakarta text-sm font-bold text-iris-700 hover:underline">Table of contents <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>} />
        <div className="grid gap-4 lg:grid-cols-12">
          <ArticleTile article={a} size="large" surface={0} className="min-h-[24rem] lg:col-span-7 lg:row-span-2" />
          {b && <ArticleTile article={b} size="medium" surface={3} className="min-h-[14rem] lg:col-span-5" />}
          {c && <ArticleTile article={c} size="medium" surface={1} className="min-h-[14rem] lg:col-span-5" />}
          {rest.slice(0, 3).map((x, i) => <ArticleTile key={x.paperId} article={x} size="small" surface={[2, 1, 0][i]} className="min-h-[11rem] lg:col-span-4" />)}
        </div>
      </Container>
    </section>
  )
}
