import { BellRing, Fingerprint, History, UserX } from '../components/uiIcons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { PageHeader } from '../components/PageHeader'
import { Container } from '../components/primitives'
import { Stepper } from '../components/Stepper'
import { useToast } from '../components/Toast'
import { paths } from '../../../config/routes'
import { clearDraft, isPristine, loadDraft, useAutosave, type Draft } from '../../../core/lib/draft'
import { STEPS, firstInvalidStep, initialForm, validateStep, type StepIndex, type SubmissionForm } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { formatDate } from '../../../core/lib/format'
import { HelpPanel } from './submit/HelpPanel'
import { ProgressCard } from './submit/ProgressCard'
import { StepAdditional } from './submit/StepAdditional'
import { StepAuthors } from './submit/StepAuthors'
import { StepManuscript } from './submit/StepManuscript'
import { StepReview } from './submit/StepReview'
import { SubmitProgress } from './submit/SubmitProgress'
import { SubmitSuccess } from './submit/SubmitSuccess'

const REASSURANCE = [
  { icon: UserX, text: 'No account needed' },
  { icon: BellRing, text: 'Paper ID sent instantly on email, SMS and WhatsApp' },
  { icon: Fingerprint, text: 'Track anytime' },
]

const MIN_PROCESSING_MS = 2600

export function SubmitPage({ onSubmit, initialPaperId = null }: {
  onSubmit: (form: SubmissionForm) => Promise<{ paperId: string }>
  /** Start on the success screen (used by the prototype index to show that state). */
  initialPaperId?: string | null
}) {
  const toast = useToast()
  const [form, setForm] = useState<SubmissionForm>(initialForm) // kept in memory across steps
  const [step, setStep] = useState<StepIndex>(0)
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(() => (initialPaperId ? null : loadDraft()))
  const [progress, setProgress] = useState<number | null>(null)
  const [submitError, setSubmitError] = useState('')
  const [paperId, setPaperId] = useState<string | null>(initialPaperId)
  const formRef = useRef<HTMLFormElement>(null)
  const top = useRef<HTMLDivElement>(null)
  const busy = progress !== null

  // Autosave stays paused while the "resume draft?" question is open.
  const savedAt = useAutosave(form, step, !pendingDraft && !paperId)

  // Warn before leaving with unsaved/unsubmitted work.
  useEffect(() => {
    if (paperId || isPristine(form)) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [form, paperId])

  const allErrors = useMemo(() => validateStep(step, form), [step, form])
  // Errors appear once a field was left, or for every field after a Next / Submit attempt.
  const { errors, onBlur, attempt, reset } = useVisibleErrors(allErrors)

  const goTo = (s: StepIndex) => {
    setStep(s); reset()
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const next = () => {
    if (!attempt()) {
      const n = Object.keys(allErrors).length
      toast(`Please fix ${n} highlighted field${n === 1 ? '' : 's'}.`, 'error')
      focusFirstError(formRef.current, allErrors)
      return
    }
    goTo((step + 1) as StepIndex)
  }

  const submit = async () => {
    const bad = firstInvalidStep(form)
    if (bad !== null) { goTo(bad); attempt(); toast('Some required information is missing.', 'error'); return }
    setSubmitError(''); setProgress(0)
    // Smoothly advance the progress bar to ~90% while the request runs, then complete it.
    const started = Date.now()
    const timer = setInterval(() => setProgress((p) => Math.min(90, (p ?? 0) + 3 + Math.random() * 4)), 160)
    try {
      const [res] = await Promise.all([onSubmit(form), new Promise((r) => setTimeout(r, MIN_PROCESSING_MS - Math.min(MIN_PROCESSING_MS, Date.now() - started)))])
      clearInterval(timer); setProgress(100)
      await new Promise((r) => setTimeout(r, 450))
      clearDraft(); setPaperId(res.paperId)
      top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } catch {
      clearInterval(timer)
      setSubmitError('Submission failed. Your data is safe — please try again.')
    } finally { setProgress(null) }
  }

  const resume = () => { if (pendingDraft) { setForm(pendingDraft.form); setStep(pendingDraft.step); setPendingDraft(null); toast('Draft restored. Please re-confirm the declarations.') } }
  const discard = () => { clearDraft(); setPendingDraft(null) }

  const crumbs = [{ label: 'Home', to: paths.home }, { label: 'Submit Manuscript' }]
  if (paperId) {
    return (<><PageHeader crumbs={crumbs} title="Submission complete" /><Container className="mt-10"><SubmitSuccess paperId={paperId} email={form.author.email || 'your email address'} title={form.title} /></Container></>)
  }

  return (
    <>
      <PageHeader crumbs={crumbs} title="Submit Manuscript" subtitle="Takes about ten minutes. Free to submit; the APC is payable only after acceptance." />
      <div className="border-b border-line bg-navy-50">
        <Container><ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 py-3 text-sm font-medium text-navy">
          {REASSURANCE.map(({ icon: Icon, text }) => <li key={text} className="inline-flex items-center gap-2"><Icon className="h-4 w-4" aria-hidden />{text}</li>)}
        </ul></Container>
      </div>

      <Container className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div ref={top} className="scroll-mt-24">
          {pendingDraft && (
            <div role="region" aria-label="Saved draft" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-card border border-navy-200 bg-navy-50 p-4">
              <p className="flex items-center gap-2 text-sm"><History className="h-5 w-5 text-navy-500" aria-hidden />
                <span>We found a draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong>{pendingDraft.form.title && <> — “{pendingDraft.form.title.slice(0, 60)}{pendingDraft.form.title.length > 60 ? '…' : ''}”</>}.</span></p>
              <div className="flex gap-2"><Button size="sm" onClick={resume}>Resume draft</Button><Button size="sm" variant="secondary" onClick={discard}>Start fresh</Button></div>
            </div>
          )}

          <Stepper steps={STEPS} current={step} onSelect={(i) => goTo(i as StepIndex)} />
          <form ref={formRef} noValidate onSubmit={(e) => e.preventDefault()} aria-labelledby="step-title"
            onBlur={onBlur}
            className="mt-6 rounded-card border border-line bg-white p-5 sm:p-8">
            <h2 id="step-title" className="mb-6 font-serif text-2xl font-semibold text-navy">Step {step + 1} of {STEPS.length}: {STEPS[step].label}</h2>
            {step === 0 && <StepManuscript form={form} errors={errors} onChange={setForm} />}
            {step === 1 && <StepAuthors form={form} errors={errors} onChange={setForm} />}
            {step === 2 && <StepAdditional form={form} errors={errors} onChange={setForm} />}
            {step === 3 && <StepReview form={form} onEdit={goTo} submitError={submitError} />}
            <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-between gap-3 border-t border-line bg-white/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8">
              <Button variant="ghost" onClick={() => goTo((step - 1) as StepIndex)} disabled={step === 0 || busy}>Back</Button>
              {step < 3
                ? <Button onClick={next}>Next: {STEPS[step + 1].label}</Button>
                : <Button variant="submit" size="lg" onClick={submit} loading={busy}>{busy ? 'Submitting…' : 'Submit Manuscript'}</Button>}
            </div>
          </form>
        </div>
        <HelpPanel><ProgressCard form={form} current={step} savedAt={savedAt} /></HelpPanel>
      </Container>

      {busy && <SubmitProgress pct={progress ?? 0} />}
    </>
  )
}
