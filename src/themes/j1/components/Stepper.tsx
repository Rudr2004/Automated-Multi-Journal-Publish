import { Check } from './uiIcons'

/** Progress indicator for multi-step forms. Completed steps can be clicked to go back. */
export function Stepper({ steps, current, onSelect }: { steps: readonly { id: string; label: string }[]; current: number; onSelect?: (i: number) => void }) {
  return (
    <ol className="grid grid-cols-4 gap-2" aria-label="Progress">
      {steps.map((s, i) => {
        const done = i < current, on = i === current
        return (
          <li key={s.id} aria-current={on ? 'step' : undefined} className="min-w-0">
            <button type="button" disabled={!done || !onSelect} onClick={() => onSelect?.(i)} className="group flex w-full flex-col gap-2 text-left disabled:cursor-default">
              <span className={`h-1.5 rounded-sm ${done || on ? 'bg-navy' : 'bg-mist-200'}`} />
              <span className="flex items-center gap-2">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? 'bg-oa text-white' : on ? 'bg-navy text-white' : 'bg-mist-200 text-ink-muted'}`}>
                  {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : i + 1}
                </span>
                <span className={`hidden truncate text-sm sm:block ${on ? 'font-semibold text-navy' : 'text-ink-muted'}`}>{s.label}</span>
              </span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
