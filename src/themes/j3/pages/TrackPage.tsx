// Journal 3 "Track My Paper": lookup form, ticket-card result with activity log, and OTP-gated actions.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import type { TrackPageProps } from '../../../core/theme'
import type { PaperDocument, PaymentProof, TrackResult, TrackedPaper } from '../../../core/types'
import { AcButton, AcButtonLink, AcKicker } from '../components/AcButton'
import { J3CertificateDialog } from '../components/J3Certificate'
import { J3Field, J3Spinner, j3Input } from '../components/J3Field'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Search } from '../icons'
import { J3PaperResult } from './track/J3Ticket'
import { J3EditDialog, J3OtpDialog, J3PayDialog, type PayMode } from './track/J3TrackDialogs'

type Gated = { kind: 'pay'; mode: PayMode } | { kind: 'sign' } | { kind: 'edit' } | { kind: 'cert' }
type Dialog = null | 'otp' | 'pay' | 'edit' | 'cert'
const today = () => new Date().toISOString().slice(0, 10)
const PURPOSE: Record<Gated['kind'], string> = { pay: 'pay your article processing charge', sign: 'sign the copyright form', edit: 'edit your submission', cert: 'view your author certificate' }

const demo = (n: string, email: string) => ({ id: `${journal.paperIdPrefix}2026000${n}`, email })
const DEMOS = [demo('201', 'sunaina.malhotra@example.com'), demo('202', 'kabir.malhotra@example.com'), demo('203', 'amaka.obi@example.com')]

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

  const run = async (id: string, mail: string) => {
    const next: typeof errors = {}
    const a = validate.paperId(id), b = validate.email(mail)
    if (a) next.paperId = a
    if (b) next.email = b
    setErrors(next)
    if (Object.keys(next).length) { formRef.current?.querySelector<HTMLElement>(next.paperId ? '[name="paperId"]' : '[name="email"]')?.focus(); return }
    setLoading(true); setLookupError('')
    try {
      const r = await onTrack(id.trim().toUpperCase(), mail.trim())
      setResult(r)
      setPaper(r.kind === 'found' ? r.paper : null)
      setUnlocked(false)
      setTimeout(() => resultRef.current?.focus({ preventScroll: false }), 50)
    } catch {
      setLookupError('We could not reach the tracking service. Please try again in a moment.')
    } finally { setLoading(false) }
  }
  const submit = (e: FormEvent) => { e.preventDefault(); void run(paperId, email) }
  useEffect(() => { if (initial?.paperId && initial.email) void run(initial.paperId, initial.email) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (fn: (p: TrackedPaper) => TrackedPaper) => setPaper((p) => (p ? fn(p) : p))

  // Execute a sensitive action (the OTP was already verified in this session).
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
    <div className="bg-j3paper-cool pb-20 pt-10 sm:pb-28 sm:pt-14">
      <Container>
        <header className="max-w-3xl">
          <AcKicker className="text-ember-700">Track my paper</AcKicker>
          <h1 className="mt-3 font-jakarta text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-iris-700">Where is my paper right now?</h1>
          <p className="mt-4 font-jakarta text-lg leading-relaxed text-mauve-600">No login needed. Enter your Paper ID and the email address you used when submitting.</p>
        </header>

        <form ref={formRef} onSubmit={submit} noValidate aria-label="Find your paper" className="mt-8 grid gap-4 border border-mauve-200 border-t-2 border-t-iris-700 bg-white p-5 sm:p-7 md:grid-cols-[1fr_1fr_auto] md:items-start">
          <J3Field label="Paper ID" name="paperId" required error={errors.paperId}>
            <input className={j3Input(errors.paperId, true)} value={paperId} maxLength={15} autoComplete="off" spellCheck={false} placeholder={`e.g. ${journal.paperIdPrefix}2026000123`}
              onChange={(e) => { setPaperId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setErrors((x) => ({ ...x, paperId: undefined })) }} />
          </J3Field>
          <J3Field label="Email" name="email" required error={errors.email}>
            <input type="email" className={j3Input(errors.email, true)} value={email} maxLength={120} autoComplete="email" placeholder="name@institution.edu"
              onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} onBlur={() => setEmail(email.trim().toLowerCase())} />
          </J3Field>
          <AcButton type="submit" disabled={loading} aria-busy={loading} className="w-full px-8 py-3.5 md:mt-[1.75rem] md:w-auto">
            {loading ? <J3Spinner /> : <Search className="h-5 w-5" aria-hidden="true" />}
            {loading ? 'Searching…' : 'Track paper'}
          </AcButton>
        </form>

        <details className="mt-4 font-inter text-sm text-mauve-600">
          <summary className="cursor-pointer font-inter font-semibold text-iris-700">Try a demo paper</summary>
          <ul className="mt-2 flex flex-wrap gap-2">
            {DEMOS.map((d) => (
              <li key={d.id}><button type="button" onClick={() => { setPaperId(d.id); setEmail(d.email); setErrors({}) }} className="rounded-none border border-mauve-200 bg-white px-3 py-1 font-inter text-sm font-semibold text-iris-700 hover:border-iris-700">{d.id}</button></li>
            ))}
          </ul>
        </details>

        <div className="mt-10" aria-live="polite" aria-busy={loading}>
          {lookupError && <p role="alert" className="border border-red-700 border-l-4 bg-red-50 p-4 font-inter text-base font-semibold text-red-700">{lookupError}</p>}
          <div ref={resultRef} tabIndex={-1} className="focus:outline-none">
            {result?.kind === 'found' && paper && (
              <J3PaperResult paper={paper} actions={{ onPay: (mode) => request({ kind: 'pay', mode }), onSign: () => request({ kind: 'sign' }), onEdit: () => request({ kind: 'edit' }), onDownload: download }} />
            )}
            {result?.kind === 'other-journal' && (
              <div role="status" className="mx-auto max-w-xl border border-mauve-200 border-t-2 border-t-ember-700 bg-white p-8 text-center">
                <h2 className="font-jakarta text-[1.625rem] font-semibold text-iris-700">This Paper ID belongs to another journal</h2>
                <p className="mt-3 font-inter text-base text-mauve-600">Paper IDs for {journal.shortName} start with <strong className="text-night-900">{journal.paperIdPrefix}</strong>. IDs starting with <strong className="text-night-900">{result.code}</strong> are tracked on that journal’s own Track page. Please check the confirmation email you received.</p>
              </div>
            )}
            {result?.kind === 'not-found' && (
              <div role="alert" className="mx-auto max-w-xl border border-mauve-200 border-t-2 border-t-ember-700 bg-white p-8 text-center">
                <h2 className="font-jakarta text-[1.625rem] font-semibold text-iris-700">We couldn’t find that paper</h2>
                <p className="mt-3 font-inter text-base text-mauve-600">Check the Paper ID and the email address you submitted with. Still stuck? Email <a className="font-bold text-iris-700 underline hover:text-ember-700" href={`mailto:${journal.email}`}>{journal.email}</a>.</p>
                <div className="mt-5"><AcButtonLink to={paths.about('contact')} variant="outline">Contact the editorial office</AcButtonLink></div>
              </div>
            )}
          </div>
        </div>
      </Container>

      {paper && (
        <>
          <J3OtpDialog open={dialog === 'otp'} onClose={() => { setDialog(null); setPending(null) }} email={paper.email} purpose={pending ? PURPOSE[pending.kind] : 'continue'}
            onSendOtp={onSendOtp} onVerify={onVerifyOtp} onVerified={verified} />
          <J3PayDialog open={dialog === 'pay'} onClose={() => setDialog(null)} paperId={paper.paperId} initialMode={payMode} onPay={markPaid} onProof={markProof} />
          <J3EditDialog open={dialog === 'edit'} onClose={() => setDialog(null)} title={paper.title} onSave={saveEdit} />
          <J3CertificateDialog open={dialog === 'cert'} onClose={() => setDialog(null)}
            paper={{ paperId: paper.paperId, title: paper.title, authors: paper.authors, publishedAt: paper.stageDates.published ?? today() }} />
        </>
      )}
    </div>
  )
}
