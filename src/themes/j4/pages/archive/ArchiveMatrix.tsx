// Archive matrix: one block per volume with issues 1 to 12 as cells. Published issues link to their contents; the rest are greyed out.
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { cx } from '../../components/primitives'

const SLOTS = Array.from({ length: 12 }, (_, i) => i + 1)

export interface VolumeRow { volume: number; year: string; issues: IssueSummary[]; articles: number }

export function ArchiveMatrix({ rows }: { rows: VolumeRow[] }) {
  return (
    <div className="space-y-6">
      {rows.map((r) => {
        const byNo = new Map(r.issues.map((i) => [i.issue, i]))
        return (
          <section key={r.volume} aria-labelledby={`vol-${r.volume}`} className="scroll-mt-32 rounded-pane border border-abyss-200 bg-white p-4 shadow-hair sm:p-6">
            <header className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 id={`vol-${r.volume}`} className="scroll-mt-32 font-serif4 text-2xl font-semibold text-abyss-900">Volume {r.volume} <span className="font-normal text-steel-600">· {r.year}</span></h3>
              <p className="text-sm tabular-nums text-steel-600">{r.issues.length} of 12 issues published · {r.articles} articles</p>
            </header>
            <ol className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
              {SLOTS.map((n) => {
                const i = byNo.get(n)
                const inner = (
                  <>
                    <span className="text-xs font-semibold uppercase tracking-[0.06em]">Issue {n}</span>
                    <span className="mt-1 block text-lg font-semibold tabular-nums">{i ? i.articleCount : '–'}</span>
                    <span className="block text-xs">{i ? new Date(`${i.month}-01T00:00:00`).toLocaleString('en-US', { month: 'short' }) : 'Not published'}</span>
                  </>
                )
                return (
                  <li key={n}>
                    {i ? (
                      <AppLink to={paths.issue(i.volume, i.issue)} aria-label={`Volume ${i.volume}, Issue ${i.issue}, ${formatMonthYear(i.month)}, ${i.articleCount} articles${i.isCurrent ? ', current issue' : ''}`}
                        className={cx('block min-h-[84px] rounded-ctl border p-3 text-abyss-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600',
                          i.isCurrent ? 'border-azure-600 bg-azure-50 hover:bg-azure-100' : 'border-abyss-300 bg-white hover:border-cobalt-700 hover:text-cobalt-700')}>{inner}</AppLink>
                    ) : (
                      <div aria-label={`Issue ${n}, not yet published`} role="group" className="min-h-[84px] rounded-ctl border border-dashed border-abyss-200 bg-abyss-50 p-3 text-steel-500">{inner}</div>
                    )}
                  </li>
                )
              })}
            </ol>
            <p className="mt-3 text-xs text-steel-600">Cell figures are the number of articles in each issue.</p>
          </section>
        )
      })}
    </div>
  )
}
