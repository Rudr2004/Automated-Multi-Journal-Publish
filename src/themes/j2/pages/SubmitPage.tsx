// Journal 2 submission page: one scrolling form with a sticky progress checklist (not a stepper).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { clearDraft, isPristine, loadDraft, useAutosave, type Draft } from '../../../core/lib/draft'
import { formatDate } from '../../../core/lib/format'
import { initialForm, validateStep, type FormErrors, type SubmissionForm } from '../../../core/lib/submission'
import { focusFirstError, useVisibleErrors } from '../../../core/lib/useVisibleErrors'
import { Button } from '../components/Button'
import { journal } from '../../../config/journals'
import { paths, staticGroups } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import * as I from '../icons'
import { CloudDone } from '../components/pageIcons'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { AutosaveNote, Checklist, Stepper, type ChecklistItem } from './submit/Checklist'
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

  const activeLabel = items.find((i) => i.id === active)?.label ?? items[0].label
  const activeNo = Math.max(1, items.findIndex((i) => i.id === active) + 1)
  const g = staticGroups['for-authors']
  const tiles = ['Retain copyright (CC BY 4.0)', 'Crossref DOI registration', 'Free to submit, APC only after acceptance', 'Track with your Paper ID, no login']

  return (
    <div className="bg-[#F4F9F7]">
      <header className="border-b border-brand-100 bg-gradient-to-b from-brand-50 to-[#F4F9F7]">
        <Container className="pb-8 pt-6 sm:pt-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-graphite-600">
              <li><AppLink to={paths.home} className="rounded-chip hover:text-accent-700 hover:underline">Home</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li><AppLink to={g.to} className="rounded-chip hover:text-accent-700 hover:underline">{g.label}</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li aria-current="page" className="font-semibold text-brand-800">Submit Manuscript</li>
            </ol>
          </nav>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-900"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-700" />Peer review portal</p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">Submit Your Manuscript</h1>
              <p className="mt-2 max-w-2xl text-base text-graphite-700 sm:text-lg">One page, about ten minutes. Free to submit, with no account needed. The APC is payable only after acceptance.</p>
            </div>
            <ul aria-label="Journal credentials" className="flex flex-wrap gap-2">
              {['Peer reviewed', 'Open access', 'Crossref DOI'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5 rounded-soft border border-accent-200 bg-white px-3 py-1.5 text-sm font-medium text-accent-900"><I.Verified className="h-4 w-4 text-accent-700" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((t) => (
              <li key={t} className="flex items-center gap-3 rounded-panel border border-brand-200 bg-white px-4 py-3 text-sm font-medium text-graphite-800"><I.TaskDone className="h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />{t}</li>
            ))}
          </ul>
        </Container>
      </header>

      <Container className="pb-16 pt-6">
        {pendingDraft && (
          <div role="region" aria-label="Saved draft" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-panel border border-accent-200 bg-accent-50 p-4">
            <p className="flex items-start gap-2 text-sm text-graphite-800">
              <I.History className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />
              <span>We found a draft saved on <strong>{formatDate(pendingDraft.savedAt.slice(0, 10))}</strong>
                {pendingDraft.form.title && <>: “{pendingDraft.form.title.slice(0, 60)}{pendingDraft.form.title.length > 60 ? '…' : ''}”</>}.</span>
            </p>
            <div className="flex gap-2"><Button onClick={resume}>Restore draft</Button><Button variant="outline" onClick={discard}>Start fresh</Button></div>
          </div>
        )}

        <div className="grid gap-x-8 gap-y-6 lg:grid-cols-[19rem_minmax(0,1fr)] xl:grid-cols-[21rem_minmax(0,1fr)]">
          <Checklist items={items} active={active} onGo={goTo} savedAt={savedAt} />

          <div className="min-w-0 rounded-sheet border border-graphite-200 bg-white p-4 shadow-card sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-accent-700">Manuscript submission workflow</p>
                <p className="mt-1 font-display text-2xl font-bold text-graphite-900">Step {activeNo}: {activeLabel}</p>
              </div>
              <AutosaveNote savedAt={savedAt} className="rounded-full border border-graphite-200 bg-graphite-50 px-3 py-1.5" />
            </div>
            <div className="mt-6 hidden border-b border-graphite-200 pb-6 sm:block"><Stepper items={items} active={active} onGo={goTo} /></div>

            <form ref={formRef} noValidate onSubmit={(e) => e.preventDefault()} onBlur={onBlur} aria-label="Manuscript submission form" className="mt-6 space-y-6">
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
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-graphite-200 pt-5">
                  <Button variant="outline" onClick={() => toast(savedAt ? 'Draft saved on this device. You can come back any time.' : 'Your draft saves automatically on this device as you type.')}><CloudDone className="h-4 w-4" aria-hidden="true" />Save draft</Button>
                  <div className="flex flex-wrap items-center gap-4">
                    <p className="text-xs text-graphite-600">By submitting you confirm the declarations above.</p>
                    <Button className="w-full px-8 py-3 text-base sm:w-auto" onClick={submit} disabled={busy} aria-busy={busy}>
                      {busy && <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" />}
                      {busy ? 'Submitting…' : 'Submit manuscript for review'}
                      {!busy && <I.ArrowRight className="h-4 w-4" aria-hidden="true" />}
                    </Button>
                  </div>
                </div>
              </SectionCard>
            </form>
          </div>
        </div>

        <section aria-labelledby="after-h" className="mt-10 overflow-hidden rounded-sheet bg-brand-800 p-6 text-white shadow-soft sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-200">{journal.shortName} open access network</p>
              <h2 id="after-h" className="mt-2 font-display text-2xl font-bold sm:text-3xl">What happens after you submit</h2>
              <p className="mt-3 text-brand-100">Follow every stage with your Paper ID and email. No account is needed, and you are emailed at each step.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <AppLink to={paths.track} className="inline-flex items-center gap-2 rounded-soft bg-white px-4 py-2.5 text-sm font-bold text-brand-900 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800"><I.Track className="h-4 w-4" aria-hidden="true" />Track existing submission</AppLink>
                <AppLink to={g.to} className="inline-flex items-center gap-2 rounded-soft border border-white/40 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800"><I.Book className="h-4 w-4" aria-hidden="true" />Read author guidelines</AppLink>
              </div>
            </div>
            <ol aria-label="Editorial milestones" className="space-y-3">
              {MILESTONES.map(([t, d], i) => (
                <li key={t} className="flex items-start gap-3">
                  <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-200 text-xs font-bold text-brand-900">{i + 1}</span>
                  <p className="text-sm text-brand-100"><strong className="block text-base font-semibold text-white">{t}</strong>{d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </Container>
    </div>
  )
}

const MILESTONES: [string, string][] = [
  ['Screening and editor check', 'The editor checks scope and basic requirements.'],
  ['Peer review', 'An external reviewer is consulted when needed.'],
  ['Editorial decision', 'Approve, request changes or reject, with the reason.'],
  ['Online publication', `Your article goes online with a permanent ${journal.shortName} DOI and author certificates.`],
]
