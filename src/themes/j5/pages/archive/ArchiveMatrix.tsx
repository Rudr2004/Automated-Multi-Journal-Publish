// Archive: one block per volume (newest first) with a card for every PUBLISHED issue (month, article count, link). Unpublished slots are not shown.
import { paths } from '../../../../config/routes'
import { formatMonthYear } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { IssueSummary } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { ArrowRight } from '../../icons'

export interface VolumeRow { volume: number; year: string; issues: IssueSummary[]; articles: number }

export function ArchiveMatrix({ rows }: { rows: VolumeRow[] }) {
  return (
    <div className="space-y-10">
      {rows.map((r) => (
        <section key={r.volume} aria-labelledby={`vol-${r.volume}`} className="scroll-mt-32">
          <div aria-hidden="true" className="j5-double-rule mb-3" />
          <h3 id={`vol-${r.volume}`} className="mb-5 flex items-baseline gap-3 font-newsreader text-2xl font-semibold text-obsidian-900">Volume {r.volume} <span className="font-work text-sm font-normal text-obsidian-600">{r.year}</span></h3>
          <ol className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {[...r.issues].sort((a, b) => b.issue - a.issue).map((i) => (
              <li key={i.issue}>
                <AppLink to={paths.issue(i.volume, i.issue)} aria-label={`Volume ${i.volume}, Issue ${i.issue}, ${formatMonthYear(i.month)}${i.isCurrent ? ', current issue' : ''}`}
                  className={cx('group flex h-full flex-col justify-between gap-4 rounded border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800',
                    i.isCurrent ? 'border-[#9b4500]' : 'border-[#DCC0BE]')}>
                  <span>
                    {i.isCurrent && <span className="mb-2 inline-block rounded bg-[#9b4500] px-2 py-0.5 font-work text-[10px] font-bold uppercase tracking-wider text-white">Current issue</span>}
                    <span className="block font-work text-xs font-bold uppercase tracking-wider text-wine-800">Issue {i.issue}</span>
                    <span className="mt-1 block font-newsreader text-xl font-semibold text-obsidian-900">{formatMonthYear(i.month)}</span>
                  </span>
                  <span className="flex items-center justify-between border-t border-[#DCC0BE]/60 pt-3 font-work text-xs text-obsidian-600">
                    <span>{i.articleCount} {i.articleCount === 1 ? 'article' : 'articles'}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-wine-800 group-hover:underline">Open issue <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
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
