import { Check } from './uiIcons'
import { STAGES, type PaperStage } from '../../../mock-data/journals/j1'
import { formatDate } from '../../../core/lib/format'

/** Paper-progress timeline: vertical on small screens, horizontal from lg. */
export function StageTimeline({ currentIndex, dates }: { currentIndex: number; dates: Partial<Record<PaperStage, string>> }) {
  return (
    <ol className="flex flex-col gap-0 lg:flex-row" aria-label="Paper stages">
      {STAGES.map((s, i) => {
        const done = i < currentIndex, current = i === currentIndex
        const date = dates[s.id]
        return (
          <li key={s.id} aria-current={current ? 'step' : undefined} className="relative flex gap-3 pb-6 last:pb-0 lg:flex-1 lg:flex-col lg:items-center lg:gap-2 lg:pb-0 lg:text-center">
            {i < STAGES.length - 1 && (
              <span aria-hidden className={`absolute left-[15px] top-8 h-[calc(100%-2rem)] w-0.5 lg:left-1/2 lg:top-[15px] lg:h-0.5 lg:w-full ${done ? 'bg-oa' : 'bg-line'}`} />
            )}
            <span className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
              done ? 'border-oa bg-oa text-white' : current ? 'border-navy bg-navy text-white ring-4 ring-scholar-soft' : 'border-line bg-white text-ink-muted'}`}>
              {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </span>
            <span className="min-w-0">
              <span className={`block text-sm ${current ? 'font-semibold text-navy' : done ? 'font-medium' : 'text-ink-muted'}`}>{s.label}</span>
              <span className="block text-xs text-ink-muted">{date ? formatDate(date) : i > currentIndex ? 'Pending' : '—'}</span>
            </span>
          </li>
        )
      })}
    </ol>
  )
}
