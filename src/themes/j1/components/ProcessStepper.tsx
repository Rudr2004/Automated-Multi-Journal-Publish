import { useRef, useState, type KeyboardEvent } from 'react'
import { TrustIcon } from './icons'

const STEPS = [
  { icon: 'send', label: 'Submission', who: 'Author', timing: 'Instant', text: 'Submit on the website or on WhatsApp. No account is needed. Your Paper ID arrives by email, SMS and WhatsApp within seconds.' },
  { icon: 'users', label: 'Review', who: 'Editor', timing: '2–3 days screening', text: 'The editor screens scope, quality and plagiarism. An external reviewer is consulted only if the editor needs one (typically 7–10 more days).' },
  { icon: 'gavel', label: 'Decision', who: 'Editor', timing: 'Daily at 08:45 IST', text: 'The editor approves, asks for changes or rejects, and the reason is logged. Decisions go out together in one daily batch.' },
  { icon: 'badge-check', label: 'Acceptance', who: 'Author', timing: 'Same day', text: 'You receive the acceptance letter, the copyright form to sign with an email OTP, and your payment link.' },
  { icon: 'credit-card', label: 'Payment', who: 'Author', timing: 'Confirmed in ~1 working day', text: 'Pay online in INR or USD, or upload a UPI or bank proof for the editor to verify. A GST invoice follows and reminders stop.' },
  { icon: 'file-text', label: 'Production', who: 'System + editor', timing: '3–5 days', text: 'The associate editor checks content and metadata while your Word file is converted into the web article.' },
  { icon: 'rocket', label: 'Publication', who: 'Editor', timing: 'Within 24 hours', text: 'After final approval your article is published with its DOI, and certificates with QR codes are emailed to every author.' },
  { icon: 'globe', label: 'Indexing', who: 'System', timing: 'Weekly check', text: 'We check Google Scholar every week and email you as soon as your article is indexed.' },
] as const

/** Eight-stage publication stepper. Click (or use the arrow keys on) a stage to see what happens and how long it takes. */
export function ProcessStepper() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const step = STEPS[active]

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = STEPS.length - 1
    const next = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1) : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (next < 0) return
    e.preventDefault()
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Publication stages" className="grid grid-cols-4 border border-line sm:grid-cols-8">
        {STEPS.map((s, i) => (
          <button key={s.label} ref={(el) => { refs.current[i] = el }} role="tab" id={`stage-tab-${i}`} aria-selected={active === i} aria-controls="stage-panel" tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)} onKeyDown={(e) => onKey(e, i)}
            className={`flex flex-col items-center gap-1 border-b-2 px-1 py-3 text-center transition-colors [&:not(:last-child)]:border-r [&:not(:last-child)]:border-r-line ${active === i ? 'border-b-scholar bg-scholar-soft text-navy' : 'border-b-transparent bg-white text-ink-muted hover:bg-paper hover:text-navy'}`}>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${active === i ? 'bg-navy text-white' : 'bg-paper-200 text-ink-muted'}`}>{i + 1}</span>
            <span className="text-[11px] font-semibold leading-tight">{s.label}</span>
          </button>
        ))}
      </div>
      <div id="stage-panel" role="tabpanel" aria-labelledby={`stage-tab-${active}`} className="mt-3 grid gap-4 border border-line border-l-[3px] border-l-navy bg-paper p-4 sm:grid-cols-[auto_1fr_auto] sm:items-start">
        <span className="hidden h-11 w-11 items-center justify-center rounded bg-navy text-white sm:flex"><TrustIcon name={step.icon} className="h-6 w-6" aria-hidden /></span>
        <div>
          <p className="font-serif text-lg font-semibold text-navy">{active + 1}. {step.label}</p>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-ink">{step.text}</p>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-1 sm:text-right">
          <div><dt className="font-semibold uppercase tracking-wide text-ink-muted">Who acts</dt><dd className="font-semibold text-navy">{step.who}</dd></div>
          <div><dt className="font-semibold uppercase tracking-wide text-ink-muted">Typical timing</dt><dd className="font-semibold text-navy">{step.timing}</dd></div>
        </dl>
      </div>
    </div>
  )
}
