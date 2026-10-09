// Journal 3 submission: a guided flow with one group of questions per screen, then review and a success screen.
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { clearDraft, isPristine, loadDraft, useAutosave, type Draft } from '../../../core/lib/draft'
import { formatDate } from '../../../core/lib/format'
import { initialForm, validateStep, type FormErrors, type SubmissionForm } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { AcButton } from '../components/AcButton'
import { J3Spinner } from '../components/J3Field'
import { Container, cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { ArrowRight, ChevronLeft, Enter, History } from '../icons'
import { StepAbstract, StepAuthors, StepFiles, StepReview, StepTheme, StepTitle } from './submit/J3SubmitSteps'
import { J3SubmitSuccess } from './submit/J3SubmitSuccess'

const pick = (e: FormErrors, keys: string[]): FormErrors => Object.fromEntries(Object.entries(e).filter(([k]) => keys.includes(k)))

/** Each guided screen owns a slice of the shared validation (which is defined per classic step). */
const STEPS = [
  { id: 'title', label: 'Title & type', title: 'What is your paper called?', text: 'Give the full title and pick the kind of article it is.', enter: true },
  { id: 'abstract', label: 'Abstract', title: 'Tell us what it is about.', text: 'Paste your abstract and add a few keywords so readers can find it.', enter: false },
  { id: 'theme', label: 'Theme', title: 'Where does it belong?', text: 'Choose the theme that fits best. Editors use it to route your paper.', enter: true },
  { id: 'authors', label: 'Authors', title: 'Who wrote it?', text: 'Start with the corresponding author, then add co-authors if any.', enter: true },
  { id: 'files', label: 'Files & declarations', title: 'Add your file and confirm.', text: 'Upload your Word file, add optional notes and confirm the declarations.', enter: false },
  { id: 'review', label: 'Review', title: 'Check everything, then submit.', text: 'Free to submit. The processing charge is payable only after acceptance.', enter: false },
] as const
const LAST = STEPS.length - 1

function stepErrors(i: number, f: SubmissionForm): FormErrors {
  switch (i) {
    case 0: return pick(validateStep(0, f), ['title', 'articleType'])
    case 1: return pick(validateStep(0, f), ['abstract', 'keywords'])
    case 2: return pick(validateStep(0, f), ['subject'])
    case 3: return validateStep(1, f)
    case 4: return { ...pick(validateStep(0, f), ['file']), ...validateStep(2, f) }
    default: return {}
  }
}
const firstBadStep = (f: SubmissionForm) => { for (let i = 0; i < LAST; i++) if (Object.keys(stepErrors(i, f)).length) return i; return -1 }
const countAll = (f: SubmissionForm) => { let n = 0; for (let i = 0; i < LAST; i++) n += Object.keys(stepErrors(i, f)).length; return n }
const clock = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

export function SubmitPage({ onSubmit, initialPaperId = null }: {
  onSubmit: (form: SubmissionForm) => Promise<{ paperId: string }>
  initialPaperId?: string | null
}) {
  const toast = useToast()
  const [form, setForm] = useState<SubmissionForm>(initialForm)
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(() => (initialPaperId ? null : loadDraft()))
  const [paperId, setPaperId] = useState<string | null>(initialPaperId)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [announce, setAnnounce] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const headRef = useRef<HTMLHeadingElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const submittedEmail = useRef('')
  const mounted = useRef(false)
  const attemptOnArrival = useRef(false)

  const savedAt = useAutosave(form, 0, !pendingDraft && !paperId)

  useEffect(() => {
    if (paperId || isPristine(form)) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [form, paperId])

  const current = useMemo(() => stepErrors(step, form), [step, form])
  const { errors, onBlur, attempt, reset } = useVisibleErrors(current)

  // On each new screen: clear touched state, move focus to the question and announce the step.
  useEffect(() => {
    reset()
    if (!mounted.current) { mounted.current = true; return }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    topRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    headRef.current?.focus({ preventScroll: true })
    setAnnounce(`Step ${step + 1} of ${STEPS.length}: ${STEPS[step].label}`)
    if (attemptOnArrival.current) {
      attemptOnArrival.current = false
      attempt()
      setTimeout(() => focusFirstError(formRef.current, stepErrors(step, form)), 60)
    }
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const goTo = (i: number, withErrors = false) => { attemptOnArrival.current = withErrors; setReached((r) => Math.max(r, i)); setStep(i) }

  const next = () => {
    if (!attempt()) {
      const n = Object.keys(current).length
      setAnnounce(`${n} field${n === 1 ? ' needs' : 's need'} attention.`)
      focusFirstError(formRef.current, current)
      return
    }
    goTo(Math.min(step + 1, LAST))
  }

  const submit = async () => {
    const bad = firstBadStep(form)
    if (bad >= 0) { toast('Some answers need attention. Taking you to the first one.', 'error'); goTo(bad, true); return }
    setSubmitError(''); setBusy(true)
    try {
      const res = await onSubmit(form)
      submittedEmail.current = form.author.email
      clearDraft(); setPaperId(res.paperId)
      window.scrollTo({ top: 0 })
    } catch {
      setSubmitError('Submission failed. Your data is safe on this device. Please try again.')
    } finally { setBusy(false) }
  }

  const onFormSubmit = (e: FormEvent) => { e.preventDefault(); if (busy) return; if (step === LAST) void submit(); else next() }

  const resume = () => {
    if (!pendingDraft) return
    const f = pendingDraft.form
    const bad = firstBadStep(f)
    setForm(f); setPendingDraft(null)
    const target = bad >= 0 ? bad : LAST
    setReached(target); setStep(target)
    toast('Draft restored. Please confirm the declarations again.')
  }
  const discard = () => { clearDraft(); setPendingDraft(null) }

  if (paperId) return <J3SubmitSuccess paperId={paperId} email={submittedEmail.current || form.author.email || 'your email address'} title={form.title} />

  const meta = STEPS[step]
  const props = { form, errors, setForm }
  const percent = ((step + 1) / STEPS.length) * 100

  return (
    <div className="bg-j3paper-cool pb-16 pt-6 sm:pb-24 sm:pt-10">
      <Container>
        <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-24">
          {pendingDraft && (
            <div role="region" aria-label="Saved draft" className="mb-6 flex flex-wrap items-center justify-between gap-3 border border-mauve-200 border-l-4 border-l-ember-700 bg-white p-4">
              <p className="flex items-start gap-2 font-inter text-base text-night-900">
                <History className="mt-0.5 h-5 w-5 shrink-0 text-ember-700" aria-hidden="true" />
                <span>We found a draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong>
                  {pendingDraft.form.title && <>: “{pendingDraft.form.title.slice(0, 60)}{pendingDraft.form.title.length > 60 ? '…' : ''}”</>}.</span>
              </p>
              <div className="flex gap-2"><AcButton onClick={resume}>Restore draft</AcButton><AcButton variant="outline" onClick={discard}>Start fresh</AcButton></div>
            </div>
          )}

          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="font-inter text-xs font-bold uppercase tracking-[0.08em] text-ember-700">Step {step + 1} of {STEPS.length} <span className="text-mauve-600">· {meta.label}</span></p>
            <p className="font-inter text-sm text-mauve-600" aria-live="polite">{savedAt ? `Saved at ${clock(savedAt)}` : 'Autosave is on'}</p>
          </div>
          <div role="progressbar" aria-label="Submission progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-valuetext={`Step ${step + 1} of ${STEPS.length}`}
            className="mt-2 h-1 w-full overflow-hidden bg-iris-100">
            <div className="h-full bg-iris-700 motion-safe:transition-[width] motion-safe:duration-300" style={{ width: `${percent}%` }} />
          </div>
          <nav aria-label="Submission steps" className="mt-3">
            <ol className="flex flex-wrap gap-x-1 gap-y-1 border-b border-mauve-200">
              {STEPS.map((s, i) => (
                <li key={s.id}>
                  <button type="button" disabled={i > reached} aria-current={i === step ? 'step' : undefined} onClick={() => goTo(i)}
                    className={cx('-mb-px inline-flex items-center gap-1.5 border-b-2 px-2.5 py-2 font-inter text-sm font-semibold disabled:cursor-not-allowed', i === step ? 'border-iris-700 text-iris-700' : i <= reached ? 'border-transparent text-mauve-700 hover:text-iris-700' : 'border-transparent text-mauve-400')}>
                    <span aria-hidden="true">{i + 1}</span><span className={i === step ? 'inline' : 'sr-only sm:not-sr-only'}>{s.label}</span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>

          <form ref={formRef} noValidate onSubmit={onFormSubmit} onBlur={onBlur} aria-label={`Manuscript submission: ${meta.label}`}
            className="mt-6 border border-mauve-200 bg-white p-5 sm:p-10">
            <div key={step} className="motion-safe:animate-fade-in">
              <h1 ref={headRef} tabIndex={-1} className="focus-visible:!outline-none font-jakarta text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-iris-700 focus:outline-none">{meta.title}</h1>
              <p className="mt-3 max-w-2xl font-jakarta text-lg leading-relaxed text-mauve-600">{meta.text}</p>
              <div className="mt-8">
                {step === 0 && <StepTitle {...props} />}
                {step === 1 && <StepAbstract {...props} />}
                {step === 2 && <StepTheme {...props} />}
                {step === 3 && <StepAuthors {...props} />}
                {step === 4 && <StepFiles {...props} />}
                {step === 5 && <StepReview form={form} missing={countAll(form)} onEdit={(i) => goTo(i)} />}
              </div>
              {submitError && <p role="alert" className="mt-6 border border-red-700 border-l-4 bg-red-50 p-3 font-inter text-base font-semibold text-red-700">{submitError}</p>}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-mauve-200 pt-6">
              {step > 0 ? (
                <button type="button" onClick={() => goTo(step - 1)} className="inline-flex items-center gap-1 rounded-none px-4 py-2.5 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-100">
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />Back
                </button>
              ) : <span />}
              <div className="flex flex-wrap items-center justify-end gap-4">
                {meta.enter && <p className="hidden items-center gap-1.5 font-inter text-sm text-mauve-600 sm:flex"><span>Press</span><Enter className="h-5 w-5" aria-hidden="true" /><span className="font-bold">Enter</span><span>to continue</span></p>}
                {step < LAST ? (
                  <AcButton type="submit" className="px-8 py-3">Continue<ArrowRight className="h-4 w-4" aria-hidden="true" /></AcButton>
                ) : (
                  <AcButton type="submit" variant="cta" className="w-full px-8 py-3 sm:w-auto" disabled={busy} aria-busy={busy}>
                    {busy && <J3Spinner />}{busy ? 'Submitting…' : 'Submit manuscript'}
                  </AcButton>
                )}
              </div>
            </div>
          </form>
          <p role="status" className="sr-only">{announce}</p>
        </div>
      </Container>
    </div>
  )
}
