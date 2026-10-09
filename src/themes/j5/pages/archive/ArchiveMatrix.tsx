// Archive matrix as "volume plates": one engraved-looking plate per volume (double frame, large volume numeral, ornament rule)
// with issues 1 to 12 as cells. Published issues link to their contents; the rest are greyed out.
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { Kicker, OrnamentRule } from '../../components/signature'

const SLOTS = Array.from({ length: 12 }, (_, i) => i + 1)

export interface VolumeRow { volume: number; year: string; issues: IssueSummary[]; articles: number }

export function ArchiveMatrix({ rows }: { rows: VolumeRow[] }) {
  return (
    <div className="space-y-8">
      {rows.map((r) => {
        const byNo = new Map(r.issues.map((i) => [i.issue, i]))
        return (
          <section key={r.volume} aria-labelledby={`vol-${r.volume}`} className="scroll-mt-32 rounded-sm border border-wine-800/35 bg-white p-1.5">
            <div className="rounded-sm border border-wine-800/20 p-4 sm:p-6">
              <header className="grid items-center gap-x-8 gap-y-3 sm:grid-cols-[auto_minmax(0,1fr)]">
                <div className="flex items-baseline gap-3">
                  <span aria-hidden="true" className="font-newsreader text-[3.5rem] font-semibold leading-none text-wine-800 sm:text-[4.25rem]">{r.volume}</span>
                  <div>
                    <Kicker>Volume</Kicker>
                    <h3 id={`vol-${r.volume}`} className="mt-1 scroll-mt-32 font-newsreader text-2xl font-semibold text-obsidian-900"><span className="sr-only">Volume {r.volume}, </span>{r.year}</h3>
                  </div>
                </div>
                <p className="font-work text-sm tabular-nums text-obsidian-600 sm:text-right">{r.issues.length} of 12 issues published<span aria-hidden="true"> · </span><br className="sm:hidden" />{r.articles} articles</p>
              </header>
              <OrnamentRule className="my-5" />
              <ol className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
                {SLOTS.map((n) => {
                  const i = byNo.get(n)
                  const inner = (
                    <>
                      <span className="flex items-center justify-between gap-1 font-work text-[11px] font-semibold uppercase tracking-[0.08em]"><span>Issue {n}</span>{i?.isCurrent && <span className="rounded-sm bg-ochre-700 px-1 py-px text-[9px] tracking-[0.06em] text-white">Current</span>}</span>
                      <span className="mt-1 block font-newsreader text-2xl font-semibold tabular-nums">{i ? i.articleCount : '–'}</span>
                      <span className="block font-work text-xs">{i ? new Date(`${i.month}-01T00:00:00`).toLocaleString('en-US', { month: 'short' }) : 'Not published'}</span>
                    </>
                  )
                  return (
                    <li key={n}>
                      {i ? (
                        <AppLink to={paths.issue(i.volume, i.issue)} aria-label={`Volume ${i.volume}, Issue ${i.issue}, ${formatMonthYear(i.month)}, ${i.articleCount} articles${i.isCurrent ? ', current issue' : ''}`}
                          className={cx('block min-h-[92px] rounded-sm border p-3 text-obsidian-900 transition-[border-color,transform,background-color] duration-150 motion-safe:hover:-translate-y-px motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700',
                            i.isCurrent ? 'border-ochre-700 bg-ochre-50 hover:bg-ochre-100' : 'border-wine-800/25 bg-[#FBF8F4] hover:border-wine-800 hover:text-wine-800')}>{inner}</AppLink>
                      ) : (
                        <div aria-label={`Issue ${n}, not yet published`} role="group" className="min-h-[92px] rounded-sm border border-dashed border-obsidian-200 bg-obsidian-50 p-3 text-obsidian-500">{inner}</div>
                      )}
                    </li>
                  )
                })}
              </ol>
              <p className="mt-4 font-work text-xs text-obsidian-600">Cell figures are the number of articles in each issue.</p>
            </div>
          </section>
        )
      })}
    </div>
  )
}
