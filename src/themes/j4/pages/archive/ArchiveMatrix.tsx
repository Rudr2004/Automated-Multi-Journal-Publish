// Archive: one block per volume (newest first) with a card for every PUBLISHED issue (cover, month, article count, link). Unpublished slots are not shown.
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { IssueCover } from '../../components/IssueCover'
import { cx } from '../../components/primitives'
import { ArrowRight } from '../../icons'

export interface VolumeRow { volume: number; year: string; issues: IssueSummary[]; articles: number }

export function ArchiveMatrix({ rows }: { rows: VolumeRow[] }) {
  return (
    <div className="space-y-8">
      {rows.map((r) => (
        <section key={r.volume} aria-labelledby={`vol-${r.volume}`} className="scroll-mt-32">
          <h3 id={`vol-${r.volume}`} className="mb-4 flex items-baseline gap-3 border-b-2 border-[#0b2545] pb-2 font-serif4 text-2xl font-bold text-[#0b2545]">Volume {r.volume} <span className="text-base font-normal text-steel-600">{r.year}</span></h3>
          <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...r.issues].sort((a, b) => b.issue - a.issue).map((i) => (
              <li key={i.issue}>
                <AppLink to={paths.issue(i.volume, i.issue)} aria-label={`Volume ${i.volume}, Issue ${i.issue}, ${formatMonthYear(i.month)}${i.isCurrent ? ', current issue' : ''}`}
                  className={cx('group flex h-full items-center gap-4 rounded-pane border bg-white p-3 shadow-hair transition hover:-translate-y-0.5 hover:border-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600',
                    i.isCurrent ? 'border-azure-600' : 'border-abyss-200')}>
                  <span className="block w-20 shrink-0"><IssueCover issue={i} /></span>
                  <span className="min-w-0">
                    {i.isCurrent && <span className="mb-1 inline-block rounded bg-azure-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cobalt-700">Current issue</span>}
                    <span className="block font-serif4 text-lg font-bold leading-tight text-[#0b2545]">Issue {i.issue}</span>
                    <span className="block text-sm text-steel-700">{formatMonthYear(i.month)}</span>
                    <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-cobalt-700 group-hover:underline">Open issue <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  </span>
                </AppLink>
              </li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}
