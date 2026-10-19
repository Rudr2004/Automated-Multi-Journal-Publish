// IJFRD status console: Manuscript ID + email lookup, six-stage tracker, activity log, APC panel and OTP-gated actions.
import { referralOn } from '../../../core/lib/referral'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import * as validate from '../../../core/lib/validators'
import type { TrackPageProps } from '../../../core/theme'
import type { PaperDocument, PaymentProof, TrackResult, TrackedPaper } from '../../../core/types'
import { ButtonLink } from '../components/Button'
import { Field, Spinner } from '../components/form/Field'
import { AppLink } from '../../../core/router'
import { Container, cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { Search, Track } from '../icons'
import { Chevron as ChevronRight } from './submit/mi'
import { inp } from './submit/shared'
import { KpiTiles, LogTable, PaperHeader } from './track/Console'
import { CertDialog, EditDialog } from './track/EditDialogs'
import { OtpDialog } from './track/OtpDialog'
import { PayDialog, type PayMode } from './track/PayDialog'
import { ActionsPanel, ApcPanel, DocsPanel, ReferralPanel } from './track/Side'
import { idExample, idMaxLength, normalizeId } from '../../../core/lib/manuscriptId'

type Gated = { kind: 'pay'; mode: PayMode } | { kind: 'sign' } | { kind: 'edit' } | { kind: 'cert' }
type Dialog = null | 'otp' | 'pay' | 'edit' | 'cert'
const today = () => new Date().toISOString().slice(0, 10)
const PURPOSE: Record<Gated['kind'], string> = { pay: 'pay your article processing charge', sign: 'sign the copyright form', edit: 'edit your submission', cert: 'view your author certificate' }

const DEMO = 'demo@example.com'
const id = (n: string) => `${journal.paperIdPrefix.toLowerCase()}.v1i1.${String(Number(n) - 200).padStart(3, '0')}`
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
      <div className="bg-[#F9F9FF] pt-6 sm:pt-10">
        <Container>
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 font-work text-xs text-[#564241]">
              <li><AppLink to={paths.home} className="transition-colors hover:text-wine-900">Home</AppLink></li>
              <li aria-hidden="true"><ChevronRight className="h-4 w-4 text-[#DCC0BE]" /></li>
              <li><AppLink to={paths.policy('author-guidelines')} className="transition-colors hover:text-wine-900">For Authors</AppLink></li>
              <li aria-hidden="true"><ChevronRight className="h-4 w-4 text-[#DCC0BE]" /></li>
              <li aria-current="page" className="font-semibold text-wine-900">Track My Paper</li>
            </ol>
          </nav>
          <div className="mt-4 flex flex-col gap-5 rounded-xl border border-[#DCC0BE]/40 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex max-w-2xl flex-col gap-2">
              <span className="inline-flex w-fit items-center gap-1.5 rounded border border-wine-800/20 bg-wine-800/10 px-2.5 py-0.5 font-work text-[11px] font-bold uppercase tracking-wider text-wine-900">
                <Track className="h-3.5 w-3.5" aria-hidden="true" />Status console
              </span>
              <h1 id="track-h" className="font-newsreader text-2xl font-bold leading-tight tracking-tight text-wine-900 sm:text-3xl">Where is my paper right now?</h1>
              <p className="font-serif4 text-sm leading-relaxed text-[#564241]">No account needed. Enter the Manuscript ID from your confirmation message and the email address you submitted with.</p>
            </div>
            <form ref={formRef} onSubmit={submit} noValidate aria-label="Find your paper" className="grid gap-4 border-t border-[#DCC0BE]/30 pt-4 md:grid-cols-[1fr_1fr_auto] md:items-start">
              <Field label="Manuscript ID" name="paperId" required error={errors.paperId}>
                <input className={inp(errors.paperId)} value={paperId} maxLength={idMaxLength} autoComplete="off" spellCheck={false} placeholder={`e.g. ${idExample}`}
                  onChange={(e) => { setPaperId(normalizeId(e.target.value)); setErrors((x) => ({ ...x, paperId: undefined })) }} />
              </Field>
              <Field label="Email" name="email" required error={errors.email}>
                <input type="email" className={inp(errors.email)} value={email} maxLength={120} autoComplete="email" placeholder="name@institution.edu"
                  onChange={(e) => { setEmail(e.target.value.replace(/\s/g, '')); setErrors((x) => ({ ...x, email: undefined })) }} onBlur={() => setEmail(email.trim().toLowerCase())} />
              </Field>
              <button type="submit" disabled={loading} aria-busy={loading}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-wine-800 px-6 font-work text-[13px] font-bold text-white shadow-sm transition-colors hover:bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800 focus-visible:ring-offset-2 disabled:opacity-60 md:mt-[1.75rem] md:w-auto">
                {loading ? <Spinner /> : <Search className="h-5 w-5" aria-hidden="true" />}{loading ? 'Searching…' : 'Track paper'}
              </button>
            </form>
          </div>
        </Container>
      </div>

      <div className="bg-[#F9F9FF] py-6 sm:py-8">
        <Container>
          <div aria-live="polite" aria-busy={loading}>
            {lookupError && <p role="alert" className="rounded border border-red-700 bg-red-50 p-4 text-[15px] font-semibold text-red-700">{lookupError}</p>}
            <div ref={resultRef} tabIndex={-1} className={cx("focus-visible:!outline-none", result && "scroll-mt-24")}>
              {result?.kind === 'found' && paper && (
                <div className="space-y-6">
                  <KpiTiles paper={paper} />
                  <PaperHeader paper={paper} />
                  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
                    <div className="min-w-0 space-y-6"><LogTable paper={paper} /><DocsPanel paper={paper} onDownload={download} /></div>
                    <div className="min-w-0 space-y-6">
                      <ApcPanel paper={paper} onPay={(mode) => request({ kind: 'pay', mode })} />
                      <ActionsPanel paper={paper} onSign={() => request({ kind: 'sign' })} onEdit={() => request({ kind: 'edit' })} onCert={() => request({ kind: 'cert' })} />
                      {referralOn() && <ReferralPanel paper={paper} />}
                    </div>
                  </div>
                </div>
              )}
              {result?.kind === 'other-journal' && (
                <div role="status" className="max-w-xl rounded-xl border border-[#DCC0BE]/40 bg-white shadow-sm p-6 ">
                  <h2 className="font-newsreader text-2xl font-bold text-wine-900">This Manuscript ID belongs to another journal</h2>
                  <p className="mt-2 text-[15px] text-obsidian-700">Manuscript IDs for {journal.shortName} look like <strong className="text-obsidian-900">{idExample}</strong>. IDs starting with <strong className="text-obsidian-900">{result.code}</strong> are tracked on that journal’s own page. Please check your confirmation email.</p>
                </div>
              )}
              {result?.kind === 'not-found' && (
                <div role="alert" className="max-w-xl rounded-xl border border-[#DCC0BE]/40 bg-white shadow-sm p-6 ">
                  <h2 className="font-newsreader text-2xl font-bold text-wine-900">We could not find that paper</h2>
                  <p className="mt-2 text-[15px] text-obsidian-700">Check the Manuscript ID and the email address you submitted with. Still stuck? Email <a className="font-semibold text-wine-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>.</p>
                  <div className="mt-4"><ButtonLink to={paths.about('contact')} variant="outline" className="min-h-[44px]">Contact the editorial office</ButtonLink></div>
                </div>
              )}
            </div>
          </div>

          <details className="mt-8 rounded-xl border border-[#DCC0BE]/40 bg-white shadow-sm ">
            <summary className="flex min-h-[44px] cursor-pointer items-center px-4 text-sm font-semibold text-wine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">Try a demo paper</summary>
            <div className="border-t border-[#DCC0BE]/40 p-4">
              <p className="text-sm text-obsidian-600">Select a row to fill the form, then press Track paper. Demo email codes are shown in the verification step.</p>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {DEMOS.map((d) => (
                  <li key={d.id}>
                    <button type="button" onClick={() => { setPaperId(d.id); setEmail(d.email); setErrors({}); formRef.current?.scrollIntoView({ block: 'center' }) }}
                      className="flex min-h-[44px] w-full flex-col items-start justify-center rounded border border-[#DCC0BE]/40 px-3 py-1.5 text-left hover:border-wine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">
                      <span className="text-sm font-semibold tabular-nums text-obsidian-900">{d.id}</span>
                      <span className="text-[13px] text-obsidian-600">{d.note}</span>
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
