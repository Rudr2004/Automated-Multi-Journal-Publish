import { CheckCircle2, Circle, CloudCheck, Loader2 } from '../../components/uiIcons'
import { STEPS, validateStep, type SubmissionForm } from '../../../../core/lib/submission'

const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

/** Live completion status of each section + autosave indicator. */
export function ProgressCard({ form, current, savedAt }: { form: SubmissionForm; current: number; savedAt: string | null }) {
  const done = ([0, 1, 2] as const).map((i) => Object.keys(validateStep(i, form)).length === 0)
  const pct = Math.round((done.filter(Boolean).length / 3) * 100)
  return (
    <section aria-label="Your progress" className="rounded-card border border-line bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-semibold text-navy">Your progress</h2>
        <span className="text-sm font-semibold text-navy-500">{pct}%</span>
      </div>
      <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Submission completion" className="mt-2 h-2 overflow-hidden rounded-sm bg-mist-200">
        <div className="h-full rounded-sm bg-navy-500 transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {STEPS.slice(0, 3).map((s, i) => (
          <li key={s.id} className={`flex items-center gap-2 ${current === i ? 'font-semibold text-navy' : ''}`}>
            {done[i] ? <CheckCircle2 className="h-4 w-4 text-oa" aria-hidden /> : <Circle className="h-4 w-4 text-ink-muted" aria-hidden />}
            {s.label}<span className="sr-only">{done[i] ? ' complete' : ' incomplete'}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-muted" aria-live="polite">
        {savedAt ? <><CloudCheck className="h-4 w-4 text-oa" aria-hidden />Draft saved at {timeLabel(savedAt)}</>
          : <><Loader2 className="h-4 w-4" aria-hidden />Your progress is saved automatically on this device.</>}
      </p>
    </section>
  )
}
