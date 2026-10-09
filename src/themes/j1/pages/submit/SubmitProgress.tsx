import { CheckCircle2, Loader2 } from '../../components/uiIcons'

const STAGES = [
  { upto: 35, label: 'Uploading your manuscript' },
  { upto: 60, label: 'Checking file and format' },
  { upto: 85, label: 'Generating your Paper ID' },
  { upto: 101, label: 'Sending confirmation by email, SMS and WhatsApp' },
]

/** Full-screen progress shown while the (simulated) submission is processed. */
export function SubmitProgress({ pct }: { pct: number }) {
  const active = STAGES.findIndex((s) => pct < s.upto)
  return (
    <div role="alertdialog" aria-modal="true" aria-labelledby="sp-title" aria-describedby="sp-desc" className="fixed inset-0 z-[70] flex items-center justify-center bg-navy-900/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-card border border-line bg-white p-7 shadow-2xl">
        <h2 id="sp-title" className="font-serif text-2xl font-semibold text-navy">Submitting your manuscript</h2>
        <p id="sp-desc" className="mt-1 text-sm text-ink-muted">Please keep this page open. This takes a few seconds.</p>
        <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} className="mt-5 h-2.5 overflow-hidden rounded-sm bg-mist-200">
          <div className="h-full rounded-sm bg-scholar transition-[width] duration-200" style={{ width: `${pct}%` }} />
        </div>
        <ul className="mt-5 space-y-3 text-sm">
          {STAGES.map((s, i) => {
            const done = i < active || pct >= 100
            const on = i === active && pct < 100
            return (
              <li key={s.label} className={`flex items-center gap-2.5 ${done ? 'text-ink' : on ? 'font-semibold text-navy' : 'text-ink-muted'}`}>
                {done ? <CheckCircle2 className="h-5 w-5 text-oa" aria-hidden /> : on ? <Loader2 className="h-5 w-5 animate-spin text-scholar" aria-hidden /> : <span className="h-5 w-5 rounded border-2 border-line" aria-hidden />}
                {s.label}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
