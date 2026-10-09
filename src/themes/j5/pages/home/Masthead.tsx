// Classical masthead strip: dateline row between double hairline rules, then an ornament rule.
import { journal } from '../../../../config/journals'
import { formatMonthYear } from '../../../../core/lib/format'
import type { IssueSummary } from '../../../../core/types'
import { Container } from '../../components/primitives'
import { OrnamentRule } from '../../components/signature'

export function Masthead({ issue }: { issue: IssueSummary }) {
  return (
    <Container>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-y-[3px] border-double border-wine-800/40 py-2 font-newsreader text-[13px] font-semibold uppercase tracking-[0.12em] text-wine-900">
        <p className="tabular-nums">Volume {issue.volume} · Issue {issue.issue} · {formatMonthYear(issue.publishedAt)}</p>
        <p className="tabular-nums">ISSN {journal.issnOnline} · {journal.frequency} · Open access</p>
      </div>
      <OrnamentRule className="mt-3" />
    </Container>
  )
}
