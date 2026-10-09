// KPI cards. Every figure comes from the journal config or the home data; nothing is invented (a new journal has no impact metrics).
import { journal } from '../../../../config/journals'
import { CountUp } from '../../components/CountUp'
import type { CallForPapers, IssueSummary } from '../../../../core/types'

export function KpiStrip({ issue, cfp }: { issue: IssueSummary; cfp: CallForPapers }) {
  const cards: { label: string; value: string; note: string; count?: boolean }[] = [
    { label: 'Current Issue', value: `${issue.articleCount} Articles`, note: `Volume ${issue.volume}, Issue ${issue.issue}`, count: true },
    { label: 'First Decision', value: `~${cfp.avgReviewDays} Days`, note: 'Average peer-review time', count: true },
    { label: 'Crossref DOI', value: journal.doiPrefix, note: 'Permanent DOI for every article' },
    { label: 'Open Access', value: journal.licence.name, note: 'Free to read, share and reuse' },
    { label: 'Publication', value: journal.frequency, note: 'A new issue every month' },
  ]
  return (
    <ul aria-label="Journal at a glance" className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((c, i) => (
        <li key={c.label} className={`rounded-panel border border-graphite-200 bg-white p-3.5 shadow-card transition-colors hover:border-accent-700 ${i === cards.length - 1 ? 'col-span-2 md:col-span-1' : ''}`}>
          <p className="text-[11px] font-medium text-graphite-600">{c.label}</p>
          <p className="mt-0.5 font-display text-2xl font-bold text-brand-800">{c.count ? <CountUp value={c.value} /> : c.value}</p>
          <p className="mt-0.5 text-[11px] text-graphite-600">{c.note}</p>
        </li>
      ))}
    </ul>
  )
}
