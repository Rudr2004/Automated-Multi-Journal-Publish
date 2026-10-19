// Journal 3 submission: one page with five ruled sections and a right rail (reference: "Academic Manuscript Submission Form").
// Validation, draft autosave and the success screen are unchanged; every section is validated together when Submit is pressed.
import { referralOn } from '../../../core/lib/referral'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { MdOutlineBolt, MdOutlineGavel, MdOutlineDescription, MdOutlineLockOpen, MdOutlinePaid, MdOutlineSend, MdOutlineVerified } from 'react-icons/md'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { clearDraft, isPristine, loadDraft, saveDraftNow, useAutosave, type Draft } from '../../../core/lib/draft'
import { formatDate } from '../../../core/lib/format'
import { ACCEPTED_EXT, MAX_FILE_MB, initialForm, validateStep, type FormErrors, type SubmissionForm } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { AppLink } from '../../../core/router'
import { AcButton } from '../components/AcButton'
import { J3Spinner } from '../components/J3Field'
import { Container, cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { History } from '../icons'
import { J3SubmitAside } from './submit/J3SubmitAside'
import { ReadinessNote, ReferralCard, SectionAuthor, SectionClassification, SectionDeclarations, SectionFile, SectionPeople } from './submit/J3SubmitSteps'
import { J3SubmitSuccess } from './submit/J3SubmitSuccess'

/** The shared validation is defined per classic step; the single-page form needs all of it at once. */
const allErrors = (f: SubmissionForm): FormErrors => ({ ...validateStep(0, f), ...validateStep(1, f), ...validateStep(2, f) })
const clock = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

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
  const [manualSave, setManualSave] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const submittedEmail = useRef('')

  const autoSaved = useAutosave(form, 0, !pendingDraft && !paperId)
  const savedAt = manualSave && (!autoSaved || manualSave > autoSaved) ? manualSave : autoSaved

  useEffect(() => {
    if (paperId || isPristine(form)) return
    const warn = (e: BeforeUnloadEvent) => { e.preventDefault() }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [form, paperId])

  const current = useMemo(() => allErrors(form), [form])
  const { errors, onBlur, attempt } = useVisibleErrors(current)

  const submit = async () => {
    if (!attempt()) {
      const n = Object.keys(current).length
      setAnnounce(`${n} field${n === 1 ? ' needs' : 's need'} attention.`)
      toast('Some answers need attention. Taking you to the first one.', 'error')
      focusFirstError(formRef.current, current)
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

  const onFormSubmit = (e: FormEvent) => { e.preventDefault(); if (!busy) void submit() }

  const saveNow = () => {
    const at = saveDraftNow(form, 0)
    if (at) { setManualSave(at); toast('Draft saved on this device.') } else toast('Saving is not available in this browser.', 'error')
  }
  const resume = () => {
    if (!pendingDraft) return
    setForm(pendingDraft.form); setPendingDraft(null)
    toast('Draft restored. Please confirm the declarations again.')
  }
  const discard = () => { clearDraft(); setPendingDraft(null) }

  if (paperId) return <J3SubmitSuccess paperId={paperId} email={submittedEmail.current || form.author.email || 'your email address'} title={form.title} />

  const props = { form, errors, setForm }
  const missing = Object.keys(current).length
  const tags: [string, string][] = [
    ['bg-iris-700 text-white', 'Submission desk open'],
    ['bg-j3valid-50 text-j3valid-800', 'Peer reviewed'],
    ['bg-j3paper-deep text-iris-700', `Open access ${journal.licence.name}`],
    ['bg-ember-50 text-ember-900', 'Free to submit'],
  ]
  const tiles = [
    { icon: MdOutlineDescription, k: 'Accepted file formats', v: `Word (${ACCEPTED_EXT.join(', ')})`, tone: '' },
    { icon: MdOutlineLockOpen, k: 'Document upload limit', v: `Up to ${MAX_FILE_MB} MB per submission`, tone: '' },
    { icon: MdOutlinePaid, k: 'Author processing charges', v: 'Free to submit; charge applies only after acceptance', tone: 'text-j3valid-700' },
  ]

  return (
    <div className="bg-white pb-16 pt-5 sm:pb-24">
      <Container>
        <nav aria-label="Breadcrumb" className="font-inter text-[13px] text-mauve-600">
          <ol className="flex flex-wrap items-center gap-x-2">
            <li><AppLink to={paths.home} className="hover:text-iris-700 hover:underline">Home</AppLink></li><li aria-hidden="true">›</li>
            <li><AppLink to={paths.policy('author-guidelines')} className="hover:text-iris-700 hover:underline">For Authors</AppLink></li><li aria-hidden="true">›</li>
            <li aria-current="page" className="font-semibold text-night-900">Submit Manuscript</li>
          </ol>
        </nav>

        <header className="mt-4 rounded-tile border border-j3paper-rule bg-j3paper-cool p-5 sm:p-6">
          <ul className="flex flex-wrap gap-2" aria-label="Submission highlights">
            {tags.map(([c, t]) => <li key={t} className={cx('inline-flex items-center gap-1 rounded-tile px-2 py-1 font-inter text-[11px] font-bold uppercase tracking-[0.06em]', c)}>{t}</li>)}
          </ul>
          <h1 className="mt-4 font-jakarta text-[clamp(1.75rem,3.4vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight text-night-900">Submit Manuscript for Peer Review</h1>
          <p className="mt-3 max-w-3xl font-inter text-base leading-relaxed text-mauve-700">Welcome to the {journal.shortName} submission desk. Complete the details below, upload your Word file and confirm the declarations. You will get a Paper ID by email, SMS and WhatsApp, and you can follow your paper with it at any time.</p>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {tiles.map((t) => (
              <li key={t.k} className="flex items-center gap-3 rounded-tile border border-j3paper-rule bg-white p-3.5">
                <t.icon className="h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" />
                <div><p className="font-jakarta text-[13px] font-bold text-night-900">{t.k}</p><p className={cx('font-inter text-xs text-mauve-600', t.tone)}>{t.v}</p></div>
              </li>
            ))}
          </ul>
        </header>

        {pendingDraft && (
          <div role="region" aria-label="Saved draft" className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-tile border border-j3paper-rule border-l-4 border-l-ember-500 bg-j3paper-deep p-4">
            <p className="flex items-start gap-2 font-inter text-[15px] text-night-900">
              <History className="mt-0.5 h-5 w-5 shrink-0 text-iris-700" aria-hidden="true" />
              <span>We found a draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong>
                {pendingDraft.form.title && <>: “{pendingDraft.form.title.slice(0, 60)}{pendingDraft.form.title.length > 60 ? '…' : ''}”</>}.</span>
            </p>
            <div className="flex gap-2"><AcButton onClick={resume}>Restore draft</AcButton><AcButton variant="outline" onClick={discard}>Start fresh</AcButton></div>
          </div>
        )}

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-12">
          <form ref={formRef} noValidate onSubmit={onFormSubmit} onBlur={onBlur} aria-label="Manuscript submission" className="space-y-6 lg:col-span-8">
            <SectionClassification {...props} />
            <SectionAuthor {...props} />
            <SectionPeople {...props} />
            <SectionFile {...props} />
            <SectionDeclarations {...props} />
            {referralOn() && <ReferralCard {...props} />}

            <section aria-label="Review and ethics" className="grid gap-4 sm:grid-cols-2">
              <div className="flex gap-4 rounded-tile border border-j3paper-rule bg-white p-5">
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center bg-iris-700 text-white"><MdOutlineBolt className="h-6 w-6" /></span>
                <div>
                  <h2 className="font-jakarta text-sm font-bold uppercase tracking-[0.05em] text-night-900">Fast track review</h2>
                  <p className="mt-1 font-inter text-sm leading-relaxed text-mauve-700">Editor screening within 1 to 2 working days, then peer review with a decision and written reasons.</p>
                </div>
              </div>
              <div className="flex gap-4 rounded-tile border border-j3paper-rule bg-white p-5">
                <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center bg-iris-700 text-white"><MdOutlineGavel className="h-6 w-6" /></span>
                <div>
                  <h2 className="font-jakarta text-sm font-bold uppercase tracking-[0.05em] text-night-900">COPE ethics guidelines</h2>
                  <p className="mt-1 font-inter text-sm leading-relaxed text-mauve-700">Publication ethics and similarity screening for every submission. <AppLink to={paths.policy('publication-ethics')} className="font-semibold text-iris-700 underline">Read the ethics policy</AppLink>.</p>
                </div>
              </div>
            </section>

            <div className="space-y-3 rounded-tile border border-j3paper-rule bg-j3paper-deep p-5">
              <ReadinessNote missing={missing} />
              {submitError && <p role="alert" className="rounded-tile border border-red-700 border-l-4 bg-red-50 p-3 font-inter text-sm font-semibold text-red-700">{submitError}</p>}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 font-jakarta text-sm font-bold text-iris-700"><MdOutlineVerified className="h-4 w-4 text-ember-700" aria-hidden="true" />Zero Submission Fee (Diamond Open Access)</p>
                  <p className="font-inter text-xs text-mauve-700" aria-live="polite">{savedAt ? `Draft saved at ${clock(savedAt)}` : 'Autosave is on. Your draft stays on this device.'}</p>
                </div>
                <div className="flex w-full flex-wrap gap-3 sm:w-auto">
                  <button type="button" onClick={saveNow} className="inline-flex flex-1 items-center justify-center rounded-tile border border-j3paper-rule bg-white px-5 py-2.5 font-inter text-sm font-semibold text-night-900 transition-colors hover:border-iris-700 hover:bg-j3paper-cool sm:flex-none">Save draft</button>
                  <button type="submit" disabled={busy} aria-busy={busy}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-tile bg-ember-500 px-6 py-2.5 font-jakarta text-sm font-bold text-night-900 transition-colors hover:bg-ember-400 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none">
                    {busy ? <J3Spinner /> : <MdOutlineSend className="h-4 w-4" aria-hidden="true" />}{busy ? 'Submitting…' : 'Submit manuscript'}
                  </button>
                </div>
              </div>
            </div>
          </form>
          <div className="lg:col-span-4"><J3SubmitAside /></div>
        </div>
        <p role="status" className="sr-only">{announce}</p>
      </Container>
    </div>
  )
}
