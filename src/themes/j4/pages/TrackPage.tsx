// Journal 4 status console: Paper ID + email lookup, six-stage tracker, activity log, APC panel and OTP-gated actions.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import type { TrackPageProps } from '../../../core/theme'
import type { PaperDocument, PaymentProof, TrackResult, TrackedPaper } from '../../../core/types'
import { ButtonLink } from '../components/Button'
import { Spinner } from '../components/form/Field'
import { RField, refInput } from './submit/shared'
import { AppLink } from '../../../core/router'
import { Container, cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Search } from '../icons'
import { SubmitAside } from './submit/Aside'
import { UploadFile } from './submit/mi'
import { KpiTiles, LogTable, PaperHeader } from './track/Console'
import { CertDialog, EditDialog } from './track/EditDialogs'
import { OtpDialog } from './track/OtpDialog'
import { PayDialog, type PayMode } from './track/PayDialog'
import { ActionsPanel, ApcPanel, DocsPanel, ReferralPanel } from './track/Side'

type Gated = { kind: 'pay'; mode: PayMode } | { kind: 'sign' } | { kind: 'edit' } | { kind: 'cert' }
type Dialog = null | 'otp' | 'pay' | 'edit' | 'cert'
const today = () => new Date().toISOString().slice(0, 10)
const PURPOSE: Record<Gated['kind'], string> = { pay: 'pay your article processing charge', sign: 'sign the copyright form', edit: 'edit your submission', cert: 'view your author certificate' }

const DEMO = 'demo@example.com'
const id = (n: string) => `${journal.paperIdPrefix}2026000${n}`
const DEMOS: { id: string; email: string; note: string }[] = [
  { id: id('204'), email: DEMO, note: 'Just submitted' }, { id: id('201'), email: 'arnav.saxena@example.com', note: 'In review' },
  { id: id('205'), email: DEMO, note: 'Decision made' }, { id: id('206'), email: DEMO, note: 'Accepted, sign form' },
  { id: id('202'), email: 'lucas.ferreira@example.com', note: 'Payment due' }, { id: id('209'), email: DEMO, note: 'Proof verifying' },
  { id: id('207'), email: DEMO, note: 'In production' }, { id: id('208'), email: DEMO, note: 'Published' }, { id: id('203'), email: 'ngozi.adebayo@example.com', note: 'Indexed' },
]

export function TrackPage({ onTrack, onSendOtp, onVerifyOtp, onPay, onPaymentProof, initial }: TrackPageProps) {
  const toast = useToast()
  const [paperId, setPaperId] = useState(initial?.paperId ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [errors, setErrors] = useState<{ paperId?: string; email?: string }>({})
  const [loading, setLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [result, setResult] = useState<TrackResult | null>(null)
  const [paper, setPaper] = useState<TrackedPaper | null>(null)
  const [dialog, setDialog] = useState<Dialog>(null)
  const [unlocked, setUnlocked] = useState(false)
  const [pending, setPending] = useState<Gated | null>(null)
  const [payMode, setPayMode] = useState<PayMode>('online')
  const resultRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const run = async (pid: string, mail: string) => {
    const next: typeof errors = {}
    const a = validate.paperId(pid), b = validate.email(mail)
    if (a) next.paperId = a
    if (b) next.email = b
    setErrors(next)
    if (Object.keys(next).length) { formRef.current?.querySelector<HTMLElement>(next.paperId ? '[name="paperId"]' : '[name="email"]')?.focus(); return }
    setLoading(true); setLookupError('')
    try {
      const r = await onTrack(pid.trim().toUpperCase(), mail.trim())
      setResult(r)
      setPaper(r.kind === 'found' ? r.paper : null)
      setUnlocked(false)
      setTimeout(() => resultRef.current?.focus(), 50)
    } catch {
      setLookupError('We could not reach the tracking service. Please try again in a moment.')
    } finally { setLoading(false) }
  }
  const submit = (e: FormEvent) => { e.preventDefault(); void run(paperId, email) }
  useEffect(() => { if (initial?.paperId && initial.email) void run(initial.paperId, initial.email) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (fn: (p: TrackedPaper) => TrackedPaper) => setPaper((p) => (p ? fn(p) : p))

  const perform = (g: Gated) => {
    if (g.kind === 'pay') { setPayMode(g.mode); setDialog('pay') }
    else if (g.kind === 'edit') setDialog('edit')
    else if (g.kind === 'cert') setDialog('cert')
    else {
      patch((p) => ({ ...p, copyrightSigned: true, documents: p.documents.map((d) => (d.id === 'copyright' ? { ...d, note: 'Signed' } : d)) }))
      setDialog(null); toast('Copyright form signed.')
    }
  }
  const request = (g: Gated) => { if (unlocked) perform(g); else { setPending(g); setDialog('otp') } }
  const verified = () => { setUnlocked(true); const g = pending; setPending(null); if (g) perform(g); else setDialog(null) }

  const markPaid = async () => {
    if (!paper) return
    await onPay(paper.paperId)
    patch((p) => ({
      ...p, payment: 'paid', stageIndex: Math.max(p.stageIndex, 5), stageDates: { ...p.stageDates, payment: p.stageDates.payment ?? today(), 'in-press': today() },
      documents: p.documents.map((d) => (d.id === 'invoice' ? { ...d, available: true, note: undefined } : d)),
    }))
    setDialog(null); toast('Payment received. The GST invoice is now available and reminders have stopped.')
  }
  const markProof = async (proof: PaymentProof) => {
    if (!paper) return
    await onPaymentProof(paper.paperId, proof)
    patch((p) => ({ ...p, payment: 'verifying', stageIndex: Math.max(p.stageIndex, 4), stageDates: { ...p.stageDates, payment: p.stageDates.payment ?? today() } }))
    setDialog(null); toast('Proof uploaded. The editor will verify it, usually within one working day.')
  }
  const saveEdit = async (title: string) => {
    await new Promise((r) => setTimeout(r, 400))
    patch((p) => ({ ...p, title }))
    setDialog(null); toast('Your changes were saved.')
  }
  const download = (d: PaperDocument) => { if (d.id === 'cert') request({ kind: 'cert' }); else toast(`${d.label} downloaded.`) }

  return (
    <div>
      <div className="bg-slate-50 pb-8 pt-6 sm:pb-12">
        <Container>
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <div className="min-w-0 space-y-6 lg:col-span-8">
              <section aria-labelledby="track-h" className="space-y-4 rounded-xl border border-sky-200 bg-gradient-to-br from-[#eef7ff] via-white to-[#e0effe] p-6 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <nav aria-label="Breadcrumb"><ol className="flex flex-wrap items-center gap-x-1.5 font-medium text-slate-500"><li><AppLink to={paths.home} className="hover:text-sky-700 hover:underline">Home</AppLink></li><li aria-hidden="true">/</li><li><AppLink to={paths.forAuthors('author-guidelines')} className="hover:text-sky-700 hover:underline">For Authors</AppLink></li><li aria-hidden="true">/</li><li aria-current="page" className="font-semibold text-sky-700">Track My Paper</li></ol></nav>
                  <AppLink to={paths.submit} className="inline-flex min-h-[44px] items-center gap-1.5 rounded border border-sky-200 bg-sky-50 px-2.5 text-[11px] font-semibold text-sky-700 hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 sm:min-h-0 sm:py-0.5"><UploadFile className="h-3.5 w-3.5" aria-hidden="true" />Submit Manuscript</AppLink>
                </div>
                <div className="space-y-1.5">
                  <h1 id="track-h" className="flex items-center gap-2.5 font-serif4 text-2xl font-bold tracking-tight text-[#0b2545] sm:text-3xl"><Search className="h-8 w-8 shrink-0 text-sky-600" aria-hidden="true" />Where is my paper right now?</h1>
                  <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">No account needed. Enter the Paper ID from your confirmation message and the email address you submitted with.</p>
                </div>
                <form ref={formRef} onSubmit={submit} noValidate aria-label="Find your paper" className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
                  <RField label="Paper ID" name="paperId" required error={errors.paperId}>
                    <input className={refInput(errors.paperId, 'font-mono')} value={paperId} maxLength={15} autoComplete="off" spellCheck={false} placeholder={`e.g. ${journal.paperIdPrefix}2026000123`}
                      onChange={(e) => { setPaperId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setErrors((x) => ({ ...x, paperId: undefined })) }} />
                  </RField>
                  <RField label="Email" name="email" required error={errors.email}>
                    <input type="email" className={refInput(errors.email)} value={email} maxLength={120} autoComplete="email" placeholder="name@institution.edu"
                      onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} onBlur={() => setEmail(email.trim().toLowerCase())} />
                  </RField>
                  <button type="submit" disabled={loading} aria-busy={loading}
                    className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded bg-sky-600 px-6 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:opacity-60 md:mt-[1.625rem] md:w-auto">
                    {loading ? <Spinner /> : <Search className="h-4 w-4" aria-hidden="true" />}{loading ? 'Searching…' : 'Track paper'}
                  </button>
                </form>
              </section>

              <div aria-live="polite" aria-busy={loading}>
                {lookupError && <p role="alert" className="rounded border border-red-700 bg-red-50 p-4 text-sm font-semibold text-red-700">{lookupError}</p>}
                <div ref={resultRef} tabIndex={-1} className={cx('focus:outline-none focus-visible:!outline-none', result && 'scroll-mt-24')}>
                  {result?.kind === 'found' && paper && (
                    <div className="space-y-6">
                      <KpiTiles paper={paper} />
                      <PaperHeader paper={paper} />
                      <LogTable paper={paper} />
                      <DocsPanel paper={paper} onDownload={download} />
                    </div>
                  )}
                  {result?.kind === 'other-journal' && (
                    <div role="status" className="max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h2 className="font-serif4 text-2xl font-bold text-[#0b2545]">This Paper ID belongs to another journal</h2>
                      <p className="mt-2 text-sm text-slate-700">Paper IDs for {journal.shortName} start with <strong className="text-slate-900">{journal.paperIdPrefix}</strong>. IDs starting with <strong className="text-slate-900">{result.code}</strong> are tracked on that journal’s own page. Please check your confirmation email.</p>
                    </div>
                  )}
                  {result?.kind === 'not-found' && (
                    <div role="alert" className="max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                      <h2 className="font-serif4 text-2xl font-bold text-[#0b2545]">We could not find that paper</h2>
                      <p className="mt-2 text-sm text-slate-700">Check the Paper ID and the email address you submitted with. Still stuck? Email <a className="font-semibold text-sky-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>.</p>
                      <div className="mt-4"><ButtonLink to={paths.about('contact')} variant="outline" className="min-h-[44px]">Contact the editorial office</ButtonLink></div>
                    </div>
                  )}
                </div>
              </div>

              <details className="rounded-xl border border-slate-200 bg-white shadow-sm">
                <summary className="flex min-h-[44px] cursor-pointer items-center px-4 text-xs font-semibold text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600">Try a demo paper</summary>
                <div className="border-t border-slate-100 p-4">
                  <p className="text-xs text-slate-600">Select a row to fill the form, then press Track paper. Demo email codes are shown in the verification step.</p>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {DEMOS.map((d) => (
                      <li key={d.id}>
                        <button type="button" onClick={() => { setPaperId(d.id); setEmail(d.email); setErrors({}); formRef.current?.scrollIntoView({ block: 'center' }) }}
                          className="flex min-h-[44px] w-full flex-col items-start justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-left hover:border-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600">
                          <span className="font-mono text-xs font-semibold text-slate-900">{d.id}</span>
                          <span className="text-[11px] text-slate-600">{d.note}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            </div>
            <div className="min-w-0 lg:col-span-4">
              <SubmitAside hideTrack>
                {result?.kind === 'found' && paper && (
                  <>
                    <ApcPanel paper={paper} onPay={(mode) => request({ kind: 'pay', mode })} />
                    <ActionsPanel paper={paper} onSign={() => request({ kind: 'sign' })} onEdit={() => request({ kind: 'edit' })} onCert={() => request({ kind: 'cert' })} />
                    <ReferralPanel paper={paper} />
                  </>
                )}
              </SubmitAside>
            </div>
          </div>
        </Container>
      </div>

      {paper && (
        <>
          <OtpDialog open={dialog === 'otp'} onClose={() => { setDialog(null); setPending(null) }} email={paper.email} purpose={pending ? PURPOSE[pending.kind] : 'continue'}
            onSendOtp={onSendOtp} onVerify={onVerifyOtp} onVerified={verified} />
          <PayDialog open={dialog === 'pay'} onClose={() => setDialog(null)} paperId={paper.paperId} initialMode={payMode} onPay={markPaid} onProof={markProof} />
          <EditDialog open={dialog === 'edit'} onClose={() => setDialog(null)} title={paper.title} onSave={saveEdit} />
          <CertDialog open={dialog === 'cert'} onClose={() => setDialog(null)} paperId={paper.paperId} title={paper.title} authors={paper.authors} publishedAt={paper.stageDates.published ?? today()} />
        </>
      )}
    </div>
  )
}
