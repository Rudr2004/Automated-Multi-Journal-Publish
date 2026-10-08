// Journal 2 submission page: one scrolling form with a sticky progress checklist (not a stepper).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { clearDraft, isPristine, loadDraft, useAutosave, type Draft } from '../../../core/lib/draft'
import { formatDate } from '../../../core/lib/format'
import { initialForm, validateStep, type FormErrors, type SubmissionForm } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { Button } from '../components/Button'
import { PageBand } from '../components/PageBand'
import { History } from '../icons'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Checklist, type ChecklistItem } from './submit/Checklist'
import { AuthorsSection, FilesSection, ManuscriptSection, SectionCard } from './submit/FormSections'
import { ReviewSummary, SubmitSuccess } from './submit/ReviewAndSuccess'

const MANUSCRIPT_KEYS = ['title', 'abstract', 'keywords', 'articleType', 'subject']

/** All errors in the order the controls appear on the page, so "focus first error" lands on the right one. */
function allErrorsOf(form: SubmissionForm): FormErrors {
  const { file, ...manuscript } = validateStep(0, form)
  return { ...manuscript, ...validateStep(1, form), ...(file ? { file } : {}), ...validateStep(2, form) }
}

const SECTIONS = [
  { id: 'sec-manuscript', label: 'Manuscript details', short: 'Details' },
  { id: 'sec-authors', label: 'Authors', short: 'Authors' },
  { id: 'sec-files', label: 'Files & declarations', short: 'Files' },
  { id: 'sec-review', label: 'Review & submit', short: 'Review' },
] as const

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
  const [active, setActive] = useState<string>(SECTIONS[0].id)
  const formRef = useRef<HTMLFormElement>(null)
  const submittedEmail = useRef('')

  const savedAt = useAutosave(form, 0, !pendingDraft && !paperId)

  useEffect(() => {
    if (paperId || isPristine(form)) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [form, paperId])

  const all = useMemo(() => allErrorsOf(form), [form])
  const { errors, onBlur, attempt } = useVisibleErrors(all)

  // A section ticks green once none of its fields has an error (and the form has been started).
  const items: ChecklistItem[] = useMemo(() => {
    const started = !isPristine(form)
    const has = (pred: (k: string) => boolean) => !Object.keys(all).some(pred)
    const manuscript = started && has((k) => MANUSCRIPT_KEYS.includes(k))
    const authors = started && has((k) => k.startsWith('author.') || k.startsWith('co.'))
    const files = started && has((k) => !MANUSCRIPT_KEYS.includes(k) && !k.startsWith('author.') && !k.startsWith('co.'))
    const flags = [manuscript, authors, files, manuscript && authors && files]
    return SECTIONS.map((s, i) => ({ ...s, done: flags[i] }))
  }, [all, form])

  // Highlight the section nearest the top of the viewport.
  useEffect(() => {
    if (paperId || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (hit) setActive(hit.target.id)
    }, { rootMargin: '-160px 0px -55% 0px' })
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [paperId])

  const goTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' })
    el.querySelector<HTMLElement>('h2')?.focus({ preventScroll: true })
    setActive(id)
  }, [])

  const submit = async () => {
    if (!attempt()) {
      const n = Object.keys(all).length
      toast(`Please fix ${n} highlighted field${n === 1 ? '' : 's'}.`, 'error')
      focusFirstError(formRef.current, all)
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

  const resume = () => { if (pendingDraft) { setForm(pendingDraft.form); setPendingDraft(null); toast('Draft restored. Please confirm the declarations again.') } }
  const discard = () => { clearDraft(); setPendingDraft(null) }

  if (paperId) return <SubmitSuccess paperId={paperId} email={submittedEmail.current || form.author.email || 'your email address'} title={form.title} />

  const missing = Object.keys(all).length
  const doneAll = items[3].done
  const sectionProps = { form, errors, setForm }

  return (
    <>
      <PageBand eyebrow="Submit manuscript" title="Submit your manuscript" text="One page, about ten minutes. Free to submit, with no account needed. The APC is payable only after acceptance." />
      <Container className="pb-16">
        {pendingDraft && (
          <div role="region" aria-label="Saved draft" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-accent-200 bg-accent-50 p-4">
            <p className="flex items-start gap-2 text-sm text-graphite-800">
              <History className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />
              <span>We found a draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong>
                {pendingDraft.form.title && <>: “{pendingDraft.form.title.slice(0, 60)}{pendingDraft.form.title.length > 60 ? '…' : ''}”</>}.</span>
            </p>
            <div className="flex gap-2"><Button onClick={resume}>Restore draft</Button><Button variant="outline" onClick={discard}>Start fresh</Button></div>
          </div>
        )}

        <div className="grid gap-x-8 gap-y-6 lg:grid-cols-[16.5rem_minmax(0,1fr)]">
          <Checklist items={items} active={active} onGo={goTo} savedAt={savedAt} />

          <form ref={formRef} noValidate onSubmit={(e) => e.preventDefault()} onBlur={onBlur} aria-label="Manuscript submission form" className="min-w-0 space-y-6 pt-0 lg:pt-6">
            <SectionCard id="sec-manuscript" n={1} title="Manuscript details" text="Title, abstract, keywords and where your paper fits." done={items[0].done}>
              <ManuscriptSection {...sectionProps} />
            </SectionCard>
            <SectionCard id="sec-authors" n={2} title="Authors" text="Who wrote it, and how we reach the corresponding author." done={items[1].done}>
              <AuthorsSection {...sectionProps} />
            </SectionCard>
            <SectionCard id="sec-files" n={3} title="Files & declarations" text="Upload your Word file, add optional notes and confirm the declarations." done={items[2].done}>
              <FilesSection {...sectionProps} />
            </SectionCard>
            <SectionCard id="sec-review" n={4} title="Review & submit" text="Check your details one last time." done={doneAll}>
              <ReviewSummary form={form} missing={missing} />
              {submitError && <p role="alert" className="mt-4 rounded-soft border border-red-700/30 bg-red-50 p-3 text-sm font-medium text-red-700">{submitError}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button variant="cta" className="w-full px-8 py-3 text-base sm:w-auto" onClick={submit} disabled={busy} aria-busy={busy}>
                  {busy && <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" />}
                  {busy ? 'Submitting…' : 'Submit manuscript'}
                </Button>
                <p className="text-xs text-graphite-600">By submitting you confirm the declarations above.</p>
              </div>
            </SectionCard>
          </form>
        </div>
      </Container>
    </>
  )
}
