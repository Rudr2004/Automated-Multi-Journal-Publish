// KPI cards with count-up numbers. Every figure comes from the journal config or the home data; no impact metrics are invented.
import { journal } from '../../../../config/journals'
import type { CallForPapers, IssueSummary } from '../../../../core/types'
import { areas } from '../../components/areas'
import { CountUpJ4 } from '../../components/CountUpJ4'

export function KpiStrip({ issue, cfp }: { issue: IssueSummary; cfp: CallForPapers }) {
  const cards: { label: string; value: string; note: string; count?: boolean }[] = [
    { label: 'Current issue', value: `${issue.articleCount} articles`, note: `Volume ${issue.volume}, Issue ${issue.issue}`, count: true },
    { label: 'Research areas', value: `${areas.length} areas`, note: 'Engineering and management', count: true },
    { label: 'First decision', value: `~${cfp.avgReviewDays} days`, note: 'Target for first review', count: true },
    { label: 'Crossref DOI', value: journal.doiPrefix, note: 'Permanent DOI for every article' },
    { label: 'Open access', value: journal.licence.name, note: 'Free to read, share and reuse' },
  ]
  return (
    <ul aria-label="Journal at a glance" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((c, i) => (
        <li key={c.label} className={`rounded-pane border border-abyss-200 border-l-[3px] border-l-azure-600 bg-white p-3.5 shadow-hair ${i === cards.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}>
          <p className="text-xs font-semibold uppercase tracking-[0.06em] text-steel-600">{c.label}</p>
          <p className="mt-1 font-serif4 text-[1.625rem] font-semibold leading-tight text-abyss-900">{c.count ? <CountUpJ4 value={c.value} /> : <span className="tabular-nums">{c.value}</span>}</p>
          <p className="mt-0.5 text-xs text-steel-600">{c.note}</p>
        </li>
      ))}
    </ul>
  )
}
