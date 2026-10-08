// Journal 4 status console: Paper ID + email lookup, six-stage tracker, activity log, APC panel and OTP-gated actions.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import type { TrackPageProps } from '../../../core/theme'
import type { PaperDocument, PaymentProof, TrackResult, TrackedPaper } from '../../../core/types'
import { ButtonLink } from '../components/Button'
import { Field, Spinner, fieldInput } from '../components/form/Field'
import { Container, Label, cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Search } from '../icons'
import { LogTable, PaperHeader } from './track/Console'
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
      <section aria-labelledby="track-h" className="relative isolate bg-abyss-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_75%)]" />
        <Container className="py-10 sm:py-14">
          <Label className="text-azure-300">Status console</Label>
          <h1 id="track-h" className="mt-2 max-w-3xl font-serif4 font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(34px,3.8vw,54px)' }}>Where is my paper right now?</h1>
          <p className="mt-3 max-w-2xl text-base text-abyss-200 sm:text-[1.0625rem]">No account needed. Enter the Paper ID from your confirmation message and the email address you submitted with.</p>
          <form ref={formRef} onSubmit={submit} noValidate aria-label="Find your paper" className="mt-7 grid gap-4 rounded-pane border border-white/15 bg-abyss-800/80 p-4 sm:p-5 md:grid-cols-[1fr_1fr_auto] md:items-start [&_label]:text-white [&_p]:text-abyss-200 [&_p[role=alert]]:text-red-300">
            <Field label="Paper ID" name="paperId" required error={errors.paperId}>
              <input className={fieldInput(errors.paperId)} value={paperId} maxLength={15} autoComplete="off" spellCheck={false} placeholder={`e.g. ${journal.paperIdPrefix}2026000123`}
                onChange={(e) => { setPaperId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setErrors((x) => ({ ...x, paperId: undefined })) }} />
            </Field>
            <Field label="Email" name="email" required error={errors.email}>
              <input type="email" className={fieldInput(errors.email)} value={email} maxLength={120} autoComplete="email" placeholder="name@institution.edu"
                onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} onBlur={() => setEmail(email.trim().toLowerCase())} />
            </Field>
            <button type="submit" disabled={loading} aria-busy={loading}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-ctl bg-white px-6 text-sm font-semibold text-abyss-900 transition-colors hover:bg-azure-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-400 disabled:opacity-60 md:mt-[1.75rem] md:w-auto">
              {loading ? <Spinner dark /> : <Search className="h-5 w-5" aria-hidden="true" />}{loading ? 'Searching…' : 'Track paper'}
            </button>
          </form>
        </Container>
      </section>

      <div className="bg-abyss-50 py-8 sm:py-12">
        <Container>
          <div aria-live="polite" aria-busy={loading}>
            {lookupError && <p role="alert" className="rounded-ctl border border-red-700 bg-red-50 p-4 text-[15px] font-semibold text-red-700">{lookupError}</p>}
            <div ref={resultRef} tabIndex={-1} className={cx('focus:outline-none', result && 'scroll-mt-24')}>
              {result?.kind === 'found' && paper && (
                <div className="space-y-6">
                  <PaperHeader paper={paper} />
                  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
                    <div className="min-w-0 space-y-6"><LogTable paper={paper} /><DocsPanel paper={paper} onDownload={download} /></div>
                    <div className="min-w-0 space-y-6">
                      <ApcPanel paper={paper} onPay={(mode) => request({ kind: 'pay', mode })} />
                      <ActionsPanel paper={paper} onSign={() => request({ kind: 'sign' })} onEdit={() => request({ kind: 'edit' })} onCert={() => request({ kind: 'cert' })} />
                      <ReferralPanel paper={paper} />
                    </div>
                  </div>
                </div>
              )}
              {result?.kind === 'other-journal' && (
                <div role="status" className="max-w-xl rounded-pane border border-abyss-200 bg-white p-6 shadow-hair">
                  <h2 className="font-serif4 text-2xl font-semibold text-abyss-900">This Paper ID belongs to another journal</h2>
                  <p className="mt-2 text-[15px] text-steel-700">Paper IDs for {journal.shortName} start with <strong className="text-abyss-900">{journal.paperIdPrefix}</strong>. IDs starting with <strong className="text-abyss-900">{result.code}</strong> are tracked on that journal’s own page. Please check your confirmation email.</p>
                </div>
              )}
              {result?.kind === 'not-found' && (
                <div role="alert" className="max-w-xl rounded-pane border border-abyss-200 bg-white p-6 shadow-hair">
                  <h2 className="font-serif4 text-2xl font-semibold text-abyss-900">We could not find that paper</h2>
                  <p className="mt-2 text-[15px] text-steel-700">Check the Paper ID and the email address you submitted with. Still stuck? Email <a className="font-semibold text-cobalt-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>.</p>
                  <div className="mt-4"><ButtonLink to={paths.about('contact')} variant="outline" className="min-h-[44px]">Contact the editorial office</ButtonLink></div>
                </div>
              )}
            </div>
          </div>

          <details className="mt-8 rounded-pane border border-abyss-200 bg-white shadow-hair">
            <summary className="flex min-h-[44px] cursor-pointer items-center px-4 text-sm font-semibold text-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">Try a demo paper</summary>
            <div className="border-t border-abyss-200 p-4">
              <p className="text-sm text-steel-600">Select a row to fill the form, then press Track paper. Demo email codes are shown in the verification step.</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {DEMOS.map((d) => (
                  <li key={d.id}>
                    <button type="button" onClick={() => { setPaperId(d.id); setEmail(d.email); setErrors({}); formRef.current?.scrollIntoView({ block: 'center' }) }}
                      className="flex min-h-[44px] w-full flex-col items-start justify-center rounded-ctl border border-abyss-200 px-3 py-1.5 text-left hover:border-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                      <span className="text-sm font-semibold tabular-nums text-abyss-900">{d.id}</span>
                      <span className="text-[13px] text-steel-600">{d.note}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </details>
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
