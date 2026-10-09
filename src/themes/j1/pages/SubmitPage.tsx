import { BellRing, CloudCheck, History, UserX } from '../components/uiIcons'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../components/Button'
import { CrumbBar } from '../components/CrumbBar'
import { Container } from '../components/primitives'
import { Stepper } from '../components/Stepper'
import { useToast } from '../components/Toast'
import { paths } from '../../../config/routes'
import { journal } from '../../../config/journals/j1'
import { clearDraft, isPristine, loadDraft, useAutosave, type Draft } from '../../../core/lib/draft'
import { STEPS, firstInvalidStep, initialForm, validateStep, type StepIndex, type SubmissionForm } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { formatDate } from '../../../core/lib/format'
import { HelpLeft, HelpRight } from './submit/HelpPanel'
import { StickyRail } from '../components/StickyRail'
import { ProgressCard } from './submit/ProgressCard'
import { StepAdditional } from './submit/StepAdditional'
import { StepAuthors } from './submit/StepAuthors'
import { StepManuscript } from './submit/StepManuscript'
import { StepReview } from './submit/StepReview'
import { SubmitProgress } from './submit/SubmitProgress'
import { SubmitSuccess } from './submit/SubmitSuccess'

const REASSURANCE = [
  { icon: UserX, text: 'No account needed' },
  { icon: BellRing, text: 'Paper ID sent instantly on email, SMS and WhatsApp' }
  // { icon: Fingerprint, text: 'Track anytime' },
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
    return (<><CrumbBar items={crumbs} /><Container className="py-10"><SubmitSuccess paperId={paperId} email={form.author.email || 'your email address'} title={form.title} /></Container></>)
  }

  const TITLES = ['Manuscript Details & Classification', 'Author, Co-author & Mentor Details', 'Cover Letter & Declarations', 'Review & Submit']
  const draftTime = savedAt ? new Date(savedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null

  return (
    <>
      <CrumbBar items={crumbs} />
      <Container className="py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 border-b border-line pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-navy sm:text-[2.5rem] sm:leading-tight">Submit Your Manuscript</h1>
            <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-base text-ink-muted">
              <span>Peer-reviewed</span><span aria-hidden className="text-line">•</span>
              <span className="font-medium text-[#8A4B00]">Open Access ({journal.licence.name})</span><span aria-hidden className="text-line">•</span>
              <span className="font-medium text-scholar">Free to submit; APC only after acceptance</span>
            </p>
          </div>
          <p className="inline-flex items-center gap-2 self-start border border-line bg-paper px-3 py-1.5 text-xs text-ink-muted md:self-auto" aria-live="polite">
            <CloudCheck className="h-4 w-4 text-scholar" aria-hidden />
            {draftTime ? <>Draft saved automatically at <strong className="tabular-nums text-ink">{draftTime}</strong></> : 'Drafts are saved automatically on this device'}
          </p>
        </div>

        <ul className="mb-6 flex flex-wrap gap-x-8 gap-y-2 border border-line bg-paper px-4 py-2.5 text-sm font-medium text-navy">
          {REASSURANCE.map(({ icon: Icon, text }) => <li key={text} className="inline-flex items-center gap-2"><Icon className="h-4 w-4 text-scholar" aria-hidden />{text}</li>)}
        </ul>

        {/* Three columns from xl: guidance on the left (4 cards), the form in the middle, live feed / achievements / tracking on the right (3 cards).
            Below xl the form comes first, then the right cards beside it from lg, and the left cards underneath. */}
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[290px_minmax(0,1fr)_320px]">
          <div ref={top} className="order-1 min-w-0 scroll-mt-24 space-y-6 lg:col-start-1 lg:row-start-1 xl:col-start-2">
            {pendingDraft && (
              <div role="region" aria-label="Saved draft" className="flex flex-wrap items-center justify-between gap-3 border border-[#C4D9EE] bg-scholar-soft p-4">
                <p className="flex items-center gap-2 text-sm"><History className="h-5 w-5 text-scholar" aria-hidden />
                  <span>We found a draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong>{pendingDraft.form.title && <> — “{pendingDraft.form.title.slice(0, 60)}{pendingDraft.form.title.length > 60 ? '…' : ''}”</>}.</span></p>
                <div className="flex gap-2"><Button size="sm" onClick={resume}>Resume draft</Button><Button size="sm" variant="outline" onClick={discard}>Start fresh</Button></div>
              </div>
            )}

            <Stepper steps={STEPS} current={step} onSelect={(i) => goTo(i as StepIndex)} />
            <form ref={formRef} noValidate onSubmit={(e) => e.preventDefault()} aria-labelledby="step-title"
              onBlur={onBlur}
              className="border border-line bg-white p-5 sm:p-6">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-2 border-b border-line pb-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-scholar">Section {step + 1} of {STEPS.length}</p>
                  <h2 id="step-title" className="font-serif text-2xl font-semibold text-navy">{TITLES[step]}</h2>
                </div>
                {step < 3 && <span className="text-xs italic text-ink-muted">* Mandatory fields</span>}
              </div>
              {step === 0 && <StepManuscript form={form} errors={errors} onChange={setForm} />}
              {step === 1 && <StepAuthors form={form} errors={errors} onChange={setForm} />}
              {step === 2 && <StepAdditional form={form} errors={errors} onChange={setForm} />}
              {step === 3 && <StepReview form={form} onEdit={goTo} submitError={submitError} />}
              {step === 3 && (
                <p className="mt-5 flex gap-3 border border-[#C4D9EE] bg-scholar-soft p-4 text-sm text-ink">
                  <BellRing className="mt-0.5 h-5 w-5 shrink-0 text-scholar" aria-hidden />
                  <span>On submitting, your <strong>Paper ID</strong> is generated instantly and sent by email, SMS and WhatsApp. You can edit the paper until the editor’s decision.</span>
                </p>
              )}
              <div className="sticky bottom-0 -mx-5 mt-8 flex items-center justify-between gap-3 border-t border-line bg-white/95 px-5 py-3 backdrop-blur sm:-mx-6 sm:px-6">
                <Button variant="outline" onClick={() => goTo((step - 1) as StepIndex)} disabled={step === 0 || busy}>Back</Button>
                {step < 3
                  ? <Button onClick={next}>Next: {STEPS[step + 1].label}</Button>
                  : <Button variant="submit" size="lg" onClick={submit} loading={busy}>{busy ? 'Submitting…' : 'Submit Manuscript'}</Button>}
              </div>
            </form>
          </div>
          <StickyRail as="aside" label="Submission status and tracking" minWidth={1280} className="order-2 space-y-4 lg:col-start-2 lg:row-start-1 xl:col-start-3"><HelpRight /></StickyRail>
          <StickyRail as="aside" label="Submission guidance" minWidth={1280} className="order-3 grid gap-4 md:grid-cols-2 lg:col-span-2 lg:row-start-2 xl:col-span-1 xl:col-start-1 xl:row-start-1 xl:block xl:space-y-4">
            <HelpLeft><ProgressCard form={form} current={step} savedAt={savedAt} /></HelpLeft>
          </StickyRail>
        </div>
      </Container>

      {busy && <SubmitProgress pct={progress ?? 0} />}
    </>
  )
}
