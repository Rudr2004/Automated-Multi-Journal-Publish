// Journal 4 submission (reference layout): banner with stepper, then the lettered form cards (8 of 12) beside the helper sidebar (4 of 12), then a success screen.
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { clearDraft, isPristine, loadDraft, saveDraftNow, useAutosave, type Draft } from '../../../core/lib/draft'
import { formatDate } from '../../../core/lib/format'
import { initialForm, validateStep, type SubmissionForm } from '../../../core/lib/submission'
import { useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { api } from '../../../core/api'
import { Button } from '../components/Button'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { History } from '../icons'
import { PreFooter } from './home/Closing'
import { AuthorsSection } from './submit/AuthorsSection'
import { SubmitAside } from './submit/Aside'
import { SubmitHeader } from './submit/Header'
import { DetailsSection } from './submit/DetailsSection'
import { DeclarationsSection, FilesSection, ReferralSection } from './submit/FilesSections'
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

  const saveNow = () => {
    const at = saveDraftNow(form, 0)
    toast(at ? 'Draft saved on this device.' : 'Could not save a draft in this browser.', at ? 'success' : 'error')
  }

  const props = { form, errors, setForm }
  return (
    <div className="bg-slate-50 pb-8 pt-6 sm:pb-12">
      <Container>
        {pendingDraft && (
          <div role="region" aria-label="Saved draft" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-sky-200 bg-white p-4 shadow-sm">
            <p className="flex items-start gap-2 text-sm text-[#0b2545]">
              <History className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" aria-hidden="true" />
              <span>A draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong> was found{pendingDraft.form.title && <>: “{pendingDraft.form.title}”</>}.</span>
            </p>
            <div className="flex flex-wrap gap-2"><Button variant="cta" className="min-h-[44px]" onClick={resume}>Restore draft</Button><Button variant="outline" className="min-h-[44px]" onClick={discard}>Start fresh</Button></div>
          </div>
        )}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-8">
            <section aria-labelledby="submit-h"><SubmitHeader counts={counts} onJump={jump} /></section>
            <form ref={formRef} noValidate onSubmit={submit} onBlur={onBlur} aria-label="Manuscript submission" className="min-w-0 space-y-6">
              <DetailsSection {...props} />
              <AuthorsSection {...props} />
              <FilesSection {...props} />
              <DeclarationsSection {...props} />
              <ReferralSection {...props} />
              <ReviewSection form={form} missing={missing} busy={busy} submitError={submitError} onJump={jump} onSaveDraft={saveNow}
                savedLabel={savedAt ? `Draft saved at ${clock(savedAt)}` : 'Autosave is on for this device'} />
              <p role="status" className="sr-only">{announce}</p>
            </form>
          </div>
          <div className="min-w-0 lg:col-span-4"><SubmitAside /></div>
        </div>
        <div className="mt-10"><PreFooter onSubscribe={(email) => api.subscribe(email)} /></div>
      </Container>
    </div>
  )
}
