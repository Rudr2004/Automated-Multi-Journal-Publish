import { SearchX } from '../components/uiIcons'
import { useEffect, useState, type FormEvent } from 'react'
import type { PaperDocument, TrackResult, TrackedPaper } from '../../../mock-data/journals/j1'
import { Button, ButtonLink } from '../components/Button'
import { CertificateModal } from '../components/CertificateModal'
import { Field, inputClass } from '../components/form'
import { OtpModal } from '../components/OtpModal'
import { PageHeader } from '../components/PageHeader'
import { Container } from '../components/primitives'
import { useToast } from '../components/Toast'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import { PayModal, type PaymentProof } from './track/PayModal'
import { PaperResult } from './track/PaperResult'

export interface TrackPageProps {
  onTrack: (paperId: string, email: string) => Promise<TrackResult>
  onSendOtp: (email: string) => Promise<unknown>
  onVerifyOtp: (code: string) => Promise<boolean>
  onPay: (paperId: string) => Promise<unknown>
  onPaymentProof: (paperId: string, proof: PaymentProof) => Promise<unknown>
  /** Pre-filled values; when both are present the search runs on load. */
  initial?: { paperId?: string; email?: string }
}

type Dialog = null | 'pay' | 'sign' | 'edit' | 'cert'
const today = () => new Date().toISOString().slice(0, 10)

export function TrackPage({ onTrack, onSendOtp, onVerifyOtp, onPay, onPaymentProof, initial }: TrackPageProps) {
  const toast = useToast()
  const [paperId, setPaperId] = useState(initial?.paperId ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [errors, setErrors] = useState<{ paperId?: string; email?: string }>({})
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [paper, setPaper] = useState<TrackedPaper | null>(null) // local copy so demo actions can update it
  const [dialog, setDialog] = useState<Dialog>(null)

  const run = async (id: string, mail: string) => {
    const next: typeof errors = {}
    const idError = validate.paperId(id)
    const mailError = validate.email(mail)
    if (idError) next.paperId = idError
    if (mailError) next.email = mailError
    setErrors(next)
    if (Object.keys(next).length) return
    setLoading(true)
    const r = await onTrack(id, mail)
    setResult(r)
    setPaper(r.kind === 'found' ? r.paper : null)
    setLoading(false)
  }
  const submit = (e: FormEvent) => { e.preventDefault(); void run(paperId, email) }

  // Deep links (e.g. from the prototype index) can pre-fill and run the search once.
  useEffect(() => { if (initial?.paperId && initial.email) void run(initial.paperId, initial.email) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const patch = (fn: (p: TrackedPaper) => TrackedPaper) => setPaper((p) => (p ? fn(p) : p))
  const markPaid = async () => {
    if (!paper) return
    await onPay(paper.paperId)
    // Confirmed payment: reminders stop, the GST invoice is emailed and the paper moves into production.
    patch((p) => ({
      ...p, payment: 'paid', stageIndex: Math.max(p.stageIndex, 5), stageDates: { ...p.stageDates, payment: p.stageDates.payment ?? today(), 'in-press': today() },
      documents: p.documents.map((d) => (d.id === 'invoice' ? { ...d, available: true, note: undefined } : d)),
    }))
    setDialog(null)
    toast('Payment received (simulated). The GST invoice is now available and reminders have stopped.')
  }
  const markProof = async (proof: PaymentProof) => {
    if (!paper) return
    await onPaymentProof(paper.paperId, proof)
    patch((p) => ({ ...p, payment: 'verifying', stageIndex: Math.max(p.stageIndex, 4), stageDates: { ...p.stageDates, payment: p.stageDates.payment ?? today() } }))
    setDialog(null)
    toast('Proof uploaded. The editor will verify it, usually within one working day.')
  }
  const download = (d: PaperDocument) => { if (d.id === 'cert') setDialog('cert'); else toast(`${d.label} downloaded (simulated).`) }
  const verified = () => {
    if (dialog === 'sign') {
      patch((p) => ({ ...p, copyrightSigned: true, documents: p.documents.map((d) => (d.id === 'copyright' ? { ...d, note: 'Signed' } : d)) }))
      toast('Copyright form signed.')
    } else toast('Edit mode unlocked (simulated). You can now update your manuscript.')
    setDialog(null)
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', to: paths.home }, { label: 'Track My Paper' }]} title="Track My Paper"
        subtitle="No login needed. Enter your Paper ID and the email address you used at submission." />
      <Container className="mt-8 pb-4">
        <form onSubmit={submit} noValidate className="grid gap-4 rounded-card border border-line bg-white p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end sm:p-6">
          <Field label="Paper ID" name="paperId" required error={errors.paperId}>
            <input className={inputClass(errors.paperId)} value={paperId} maxLength={15} autoComplete="off" spellCheck={false} placeholder="e.g. IJMAT2026000202"
              onChange={(e) => { setPaperId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setErrors((x) => ({ ...x, paperId: undefined })) }} />
          </Field>
          <Field label="Email" name="email" required error={errors.email}>
            <input type="email" className={inputClass(errors.email)} value={email} maxLength={120} autoComplete="email" placeholder="you@institution.edu"
              onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} onBlur={() => setEmail(email.trim().toLowerCase())} />
          </Field>
          <Button type="submit" size="lg" loading={loading} className="sm:mb-0">{loading ? 'Searching…' : 'Track'}</Button>
        </form>
        <p className="mt-2 text-xs text-ink-muted">Prototype demo papers: <code>IJMAT2026000201</code> / priya.nair@example.com · <code>IJMAT2026000202</code> / arjun.kapoor@example.com · <code>IJMAT2026000203</code> / meera.joshi@example.com.</p>

        <div className="mt-8" aria-live="polite">
          {result?.kind === 'found' && paper && (
            <PaperResult paper={paper} actions={{
              onPay: () => setDialog('pay'), onSign: () => setDialog('sign'), onEdit: () => setDialog('edit'),
              onDownload: download,
            }} />
          )}
          {result?.kind === 'other-journal' && (
            <div role="status" className="rounded-card border border-navy-200 bg-navy-50 p-8 text-center">
              <SearchX className="mx-auto h-9 w-9 text-navy-500" aria-hidden />
              <h2 className="mt-3 font-serif text-xl font-semibold text-navy">This Paper ID belongs to another journal</h2>
              <p className="mt-1 text-sm text-ink-muted">IDs starting with “{result.code}” are tracked on that journal’s own Track My Paper page. Please check the confirmation email you received.</p>
            </div>
          )}
          {result?.kind === 'not-found' && (
            <div role="alert" className="rounded-card border border-danger/30 bg-red-50 p-8 text-center">
              <SearchX className="mx-auto h-9 w-9 text-danger" aria-hidden />
              <h2 className="mt-3 font-serif text-xl font-semibold text-navy">We couldn’t find that paper</h2>
              <p className="mt-1 text-sm text-ink-muted">Check the Paper ID and email address. Still stuck? Contact the editorial office.</p>
              <ButtonLink to={paths.about('contact')} variant="outline" className="mt-4">Contact us</ButtonLink>
            </div>
          )}
        </div>
      </Container>

      {paper && (
        <>
          <PayModal open={dialog === 'pay'} onClose={() => setDialog(null)} paperId={paper.paperId} onPay={markPaid} onProof={markProof} />
          <CertificateModal open={dialog === 'cert'} onClose={() => setDialog(null)}
            paper={{ paperId: paper.paperId, title: paper.title, authors: paper.authors, publishedAt: paper.stageDates.published ?? today() }} />
          <OtpModal open={dialog === 'sign' || dialog === 'edit'} onClose={() => setDialog(null)} email={paper.email}
            purpose={dialog === 'sign' ? 'sign the copyright form' : 'edit your paper'} onSendOtp={onSendOtp} onVerify={onVerifyOtp} onVerified={verified} />
        </>
      )}
    </>
  )
}
