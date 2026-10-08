// Journal 4 submission: a dark title band, then a sticky manuscript checklist beside one long numbered form, then a success screen.
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { clearDraft, isPristine, loadDraft, useAutosave, type Draft } from '../../../core/lib/draft'
import { formatDate } from '../../../core/lib/format'
import { initialForm, validateStep, type SubmissionForm } from '../../../core/lib/submission'
import { useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { Button } from '../components/Button'
import { Container, Label } from '../components/primitives'
import { useToast } from '../components/Toast'
import { History } from '../icons'
import { AuthorsSection } from './submit/AuthorsSection'
import { Checklist } from './submit/Checklist'
import { DetailsSection } from './submit/DetailsSection'
import { DeclarationsSection, FilesSection } from './submit/FilesSections'
import { ReviewSection } from './submit/ReviewSection'
import { errorCounts, type SectionId } from './submit/shared'
import { Success } from './submit/Success'

const allErrors = (f: SubmissionForm) => ({ ...validateStep(0, f), ...validateStep(1, f), ...validateStep(2, f) })
const clock = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

/** Focus the first invalid control in page order (not validation order). */
function focusFirstInvalid(root: HTMLElement | null, keys: string[]) {
  if (!root) return
  const els = keys.map((k) => root.querySelector<HTMLElement>(`[name="${CSS.escape(k)}"]`)).filter((e): e is HTMLElement => !!e)
  els.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
  els[0]?.focus()
}

export function SubmitPage({ onSubmit, initialPaperId = null }: {
  onSubmit: (form: SubmissionForm) => Promise<{ paperId: string }>
  initialPaperId?: string | null
}) {
  const toast = useToast()
  const [form, setForm] = useState<SubmissionForm>(initialForm)
  const [pendingDraft, setPendingDraft] = useState<Draft | null>(() => (initialPaperId ? null : loadDraft()))
  const [paperId, setPaperId] = useState<string | null>(initialPaperId)
  const [busy, setBusy] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [announce, setAnnounce] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const submittedEmail = useRef('')

  const savedAt = useAutosave(form, 0, !pendingDraft && !paperId)

  useEffect(() => {
    if (paperId || isPristine(form)) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [form, paperId])

  const all = useMemo(() => allErrors(form), [form])
  const { errors, onBlur, attempt } = useVisibleErrors(all)
  const counts = useMemo(() => errorCounts(all), [all])
  const missing = Object.keys(all).length

  const jump = (id: SectionId) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const el = document.getElementById(`sec-${id}`)
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    el?.querySelector<HTMLElement>('input,select,textarea,button')?.focus({ preventScroll: true })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (busy) return
    if (!attempt()) {
      setAnnounce(`${missing} required item${missing === 1 ? '' : 's'} need attention.`)
      toast('Some required items need attention. Taking you to the first one.', 'error')
      focusFirstInvalid(formRef.current, Object.keys(all))
      return
    }
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

  const resume = () => {
    if (!pendingDraft) return
    setForm(pendingDraft.form); setPendingDraft(null)
    toast('Draft restored. Please confirm the declarations again.')
  }
  const discard = () => { clearDraft(); setPendingDraft(null) }

  if (paperId) return <Success paperId={paperId} email={submittedEmail.current || form.author.email || 'your email address'} title={form.title} />

  const props = { form, errors, setForm }
  return (
    <div>
      <section aria-labelledby="submit-h" className="relative isolate bg-abyss-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_75%)]" />
        <Container className="py-10 sm:py-14">
          <Label className="text-azure-300">Submit manuscript</Label>
          <h1 id="submit-h" className="mt-2 max-w-3xl font-serif4 font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(34px,3.8vw,54px)' }}>Submit your paper to {journal.shortName}</h1>
          <p className="mt-3 max-w-2xl text-base text-abyss-200 sm:text-[1.0625rem]">Five short sections, about ten minutes. No account is needed: you receive a Paper ID by email, SMS and WhatsApp, and track the paper with it.</p>
        </Container>
      </section>

      <div className="bg-abyss-50 py-8 sm:py-12">
        <Container>
          {pendingDraft && (
            <div role="region" aria-label="Saved draft" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-pane border border-azure-200 bg-white p-4 shadow-hair">
              <p className="flex items-start gap-2 text-[15px] text-abyss-900">
                <History className="mt-0.5 h-5 w-5 shrink-0 text-cobalt-700" aria-hidden="true" />
                <span>A draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong> was found{pendingDraft.form.title && <>: “{pendingDraft.form.title}”</>}.</span>
              </p>
              <div className="flex flex-wrap gap-2"><Button variant="cta" className="min-h-[44px]" onClick={resume}>Restore draft</Button><Button variant="outline" className="min-h-[44px]" onClick={discard}>Start fresh</Button></div>
            </div>
          )}
          <div className="grid items-start gap-6 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-8">
            <Checklist counts={counts} onJump={jump} savedLabel={savedAt ? `Draft saved at ${clock(savedAt)}` : 'Autosave is on for this device'} />
            <form ref={formRef} noValidate onSubmit={submit} onBlur={onBlur} aria-label="Manuscript submission" className="min-w-0 space-y-6">
              <DetailsSection {...props} />
              <AuthorsSection {...props} />
              <FilesSection {...props} />
              <DeclarationsSection {...props} />
              <ReviewSection form={form} missing={missing} busy={busy} submitError={submitError} onJump={jump} />
              <p role="status" className="sr-only">{announce}</p>
            </form>
          </div>
        </Container>
      </div>
    </div>
  )
}
