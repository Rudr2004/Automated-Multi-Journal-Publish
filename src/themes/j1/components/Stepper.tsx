import { Check } from './uiIcons'

const HINTS: Record<string, string> = {
  manuscript: 'Title, abstract & file', authors: 'Affiliations & contacts', additional: 'Cover letter & declarations', review: 'Check & submit',
}

/** Section selector for multi-step forms: a bordered panel of numbered cards. Completed sections can be clicked to go back. */
export function Stepper({ steps, current, onSelect }: { steps: readonly { id: string; label: string }[]; current: number; onSelect?: (i: number) => void }) {
  return (
    <div className="border border-line bg-white p-3 sm:p-4">
      <ol className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Progress">
        {steps.map((s, i) => {
          const done = i < current, on = i === current
          return (
            <li key={s.id} aria-current={on ? 'step' : undefined} className="min-w-0">
              <button type="button" disabled={!done || !onSelect} onClick={() => onSelect?.(i)}
                className={`flex h-full w-full items-center gap-2.5 rounded border p-2 text-left disabled:cursor-default sm:gap-3 ${on ? 'border-scholar/40 bg-scholar-soft' : 'border-line bg-white'} ${done ? 'hover:border-scholar' : ''}`}>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ${done ? 'bg-oa text-white' : on ? 'bg-navy text-white' : 'bg-paper-200 text-ink-muted'}`}>
                  {done ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
                </span>
                <span className="hidden min-w-0 sm:block">
                  <span className="block truncate text-[13px] font-bold leading-tight text-navy">{s.label}</span>
                  <span className={`block truncate text-[11px] ${on ? 'font-semibold text-scholar' : 'text-ink-muted'}`}>{HINTS[s.id] ?? ''}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
      <p className="mt-2 text-xs font-semibold text-navy sm:hidden" aria-hidden>{steps[current]?.label}</p>
    </div>
  )
}
