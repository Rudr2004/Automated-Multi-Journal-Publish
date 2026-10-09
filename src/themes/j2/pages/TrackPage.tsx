// Journal 2 "Track My Paper": lookup form, result with progress ring and timeline, and OTP-gated actions.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import type { TrackPageProps } from '../../../core/theme'
import type { PaperDocument, PaymentProof, TrackResult, TrackedPaper } from '../../../core/types'
import { ButtonLink, Button } from '../components/Button'
import { CertificateDialog } from '../components/CertificatePaper'
import { Field, inputCls } from '../components/FieldKit'
import { PortalHeader } from '../components/PortalHeader'
import { SearchOff } from '../components/pageIcons'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Search } from '../icons'
import { PaperResult } from './track/PaperResult'
import { EditDialog, OtpDialog, PayDialog, type PayMode } from './track/TrackDialogs'

type Gated = { kind: 'pay'; mode: PayMode } | { kind: 'sign' } | { kind: 'edit' } | { kind: 'cert' }
type Dialog = null | 'otp' | 'pay' | 'edit' | 'cert'
const today = () => new Date().toISOString().slice(0, 10)
const PURPOSE: Record<Gated['kind'], string> = { pay: 'pay your article processing charge', sign: 'sign the copyright form', edit: 'edit your submission', cert: 'view your author certificate' }

const demo = (n: string, email: string) => ({ id: `${journal.paperIdPrefix}2026000${n}`, email })
const DEMOS = [demo('201', 'kavya.reddy@example.com'), demo('202', 'pranav.joshi@example.com'), demo('203', 'grace.mwangi@example.com')]

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

  const run = async (id: string, mail: string) => {
    const next: typeof errors = {}
    const a = validate.paperId(id), b = validate.email(mail)
    if (a) next.paperId = a
    if (b) next.email = b
    setErrors(next)
    if (Object.keys(next).length) { document.querySelector<HTMLElement>(next.paperId ? '[name="paperId"]' : '[name="email"]')?.focus(); return }
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
    <div className="bg-[#F4F9F7]">
      <PortalHeader trail={[{ label: 'For Authors', to: paths.policy('author-guidelines') }]} current="Track My Paper" chip="Manuscript status console" title="Where is my paper?" text="No login needed. Enter your Paper ID and the email address you used when submitting. Payment, copyright signing, edits and certificates are protected by an email OTP." />
      <Container className="py-8 sm:py-10">
        <form onSubmit={submit} noValidate aria-label="Find your paper" className="grid gap-4 rounded-sheet border border-graphite-200 bg-white p-5 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:items-start sm:p-8">
          <Field label="Paper ID" name="paperId" required error={errors.paperId}>
            <input className={inputCls(errors.paperId)} value={paperId} maxLength={15} autoComplete="off" spellCheck={false} placeholder={`e.g. ${journal.paperIdPrefix}2026000123`}
              onChange={(e) => { setPaperId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setErrors((x) => ({ ...x, paperId: undefined })) }} />
          </Field>
          <Field label="Email" name="email" required error={errors.email}>
            <input type="email" className={inputCls(errors.email)} value={email} maxLength={120} autoComplete="email" placeholder="name@institution.edu"
              onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} onBlur={() => setEmail(email.trim().toLowerCase())} />
          </Field>
          <Button type="submit" disabled={loading} aria-busy={loading} className="w-full px-6 py-2.5 sm:mt-[1.65rem] sm:w-auto">
            {loading ? <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" /> : <Search className="h-4 w-4" aria-hidden="true" />}
            {loading ? 'Searching…' : 'Track paper'}
          </Button>
        </form>

        <details className="mt-3 text-xs text-graphite-600">
          <summary className="cursor-pointer font-semibold text-accent-700">Try a demo paper</summary>
          <ul className="mt-2 flex flex-wrap gap-2">
            {DEMOS.map((d) => (
              <li key={d.id}><button type="button" onClick={() => { setPaperId(d.id); setEmail(d.email); setErrors({}) }} className="rounded-chip border border-graphite-300 bg-white px-2.5 py-1 font-medium text-graphite-700 hover:border-accent-700 hover:text-accent-700">{d.id}</button></li>
            ))}
          </ul>
        </details>

        <div className="mt-8" aria-live="polite">
          {lookupError && <p role="alert" className="rounded-soft border border-red-700/30 bg-red-50 p-4 text-sm font-medium text-red-700">{lookupError}</p>}
          <div ref={resultRef} tabIndex={-1} className="focus:outline-none">
            {result?.kind === 'found' && paper && (
              <PaperResult paper={paper} actions={{ onPay: (mode) => request({ kind: 'pay', mode }), onSign: () => request({ kind: 'sign' }), onEdit: () => request({ kind: 'edit' }), onDownload: download }} />
            )}
            {result?.kind === 'other-journal' && (
              <div role="status" className="mx-auto max-w-xl rounded-sheet border border-accent-200 bg-accent-50 p-8 text-center">
                <SearchOff className="mx-auto h-9 w-9 text-accent-700" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-bold text-graphite-800">This Paper ID belongs to another journal</h2>
                <p className="mt-2 text-sm text-graphite-700">Paper IDs for {journal.shortName} start with <strong>{journal.paperIdPrefix}</strong>. IDs starting with <strong>{result.code}</strong> are tracked on that journal’s own Track page. Please check the confirmation email you received.</p>
              </div>
            )}
            {result?.kind === 'not-found' && (
              <div role="alert" className="mx-auto max-w-xl rounded-sheet border border-red-700/25 bg-red-50 p-8 text-center">
                <SearchOff className="mx-auto h-9 w-9 text-red-700" aria-hidden="true" />
                <h2 className="mt-3 font-display text-xl font-bold text-graphite-800">We couldn’t find that paper</h2>
                <p className="mt-2 text-sm text-graphite-700">Check the Paper ID and the email address you submitted with. Still stuck? Email <a className="font-semibold text-accent-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>.</p>
                <ButtonLink to={paths.about('contact')} variant="outline" className="mt-4">Contact the editorial office</ButtonLink>
              </div>
            )}
          </div>
        </div>
      </Container>

      {paper && (
        <>
          <OtpDialog open={dialog === 'otp'} onClose={() => { setDialog(null); setPending(null) }} email={paper.email} purpose={pending ? PURPOSE[pending.kind] : 'continue'}
            onSendOtp={onSendOtp} onVerify={onVerifyOtp} onVerified={verified} />
          <PayDialog open={dialog === 'pay'} onClose={() => setDialog(null)} paperId={paper.paperId} initialMode={payMode} onPay={markPaid} onProof={markProof} />
          <EditDialog open={dialog === 'edit'} onClose={() => setDialog(null)} title={paper.title} onSave={saveEdit} />
          <CertificateDialog open={dialog === 'cert'} onClose={() => setDialog(null)}
            paper={{ paperId: paper.paperId, title: paper.title, authors: paper.authors, publishedAt: paper.stageDates.published ?? today() }} />
        </>
      )}
    </div>
  )
}
