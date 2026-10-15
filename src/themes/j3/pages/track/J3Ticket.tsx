// Result of a successful lookup in Journal 3: a ticket card (notched edges, segmented progress), the activity log, documents, payment and referral.
import { useEffect, useState } from 'react'
import { journal } from '../../../../config/journals'
import { formatDate } from '../../../../core/lib/format'
import { stageInfo } from '../../../../core/lib/stageInfo'
import { STAGES, type PaperDocument, type PaymentStatus, type TrackedPaper } from '../../../../core/types'
import { AcButton, AcTag } from '../../components/AcButton'
import { J3Copy } from '../../components/J3Field'
import { cx } from '../../components/primitives'
import { Award, Check, Download, Verified } from '../../icons'
import type { PayMode } from './J3TrackDialogs'

export interface PaperActions {
  onPay: (mode: PayMode) => void
  onSign: () => void
  onEdit: () => void
  onDownload: (doc: PaperDocument) => void
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

/** Eight segments, one per stage. Segments fill left to right (staggered) when the ticket appears or the stage changes. */
function SegmentBar({ stageIndex, done }: { stageIndex: number; done: boolean }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const r = requestAnimationFrame(() => setOn(true)); return () => cancelAnimationFrame(r) }, [])
  const label = `${STAGES[stageIndex].label}, stage ${stageIndex + 1} of ${STAGES.length}`
  return (
    <div role="progressbar" aria-label="Paper progress" aria-valuemin={1} aria-valuemax={STAGES.length} aria-valuenow={stageIndex + 1} aria-valuetext={label} className="grid grid-cols-8 gap-1.5">
      {STAGES.map((s, i) => {
        const filled = i < stageIndex || (i === stageIndex && done)
        const current = i === stageIndex && !done
        return (
          <span key={s.id} aria-hidden="true" className="h-2 overflow-hidden bg-iris-100">
            <span className={cx('block h-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out', filled ? 'bg-j3valid-700' : 'bg-ember-500', current && 'motion-safe:animate-pulse')}
              style={{ width: on && (filled || current) ? '100%' : '0%', transitionDelay: `${i * 90}ms` }} />
          </span>
        )
      })}
    </div>
  )
}

const TONE_LABEL = { wait: 'In progress', action: 'Action needed', done: 'Completed' } as const

export function TicketCard({ paper }: { paper: TrackedPaper }) {
  const info = stageInfo(paper)
  const done = info.tone === 'done' && paper.stageIndex === STAGES.length - 1
  return (
    <article aria-labelledby="paper-h" className="overflow-hidden border-b-4 border-ember-500 bg-gradient-to-br from-night-900 via-[#2A1A5E] to-iris-700 text-white">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:p-10">
        <div className="min-w-0">
          <p className="font-inter text-[11px] font-bold uppercase tracking-[0.1em] text-iris-100">{paper.journalName}</p>
          <p className="mt-3 flex flex-wrap items-center gap-3">
            <span className="font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-100">Paper ID</span>
            <strong className="break-all rounded-tile bg-white/10 px-3 py-1 font-mono text-xl font-bold tracking-wide">{paper.paperId}</strong>
            <J3Copy tone="dark" text={paper.paperId} done="Paper ID copied" />
          </p>
          <h2 id="paper-h" className="mt-4 font-jakarta text-[1.5rem] font-bold leading-snug sm:text-[1.875rem]">{paper.title}</h2>
          <p className="mt-2 font-inter text-sm text-iris-100"><span className="sr-only">Authors: </span>{paper.authors.join(', ')}</p>
        </div>
        <div className="border border-white/20 bg-white/10 p-5">
          <p className="font-inter text-[11px] font-bold uppercase tracking-[0.1em] text-iris-100">Current stage</p>
          <p className="mt-1.5 font-jakarta text-2xl font-bold leading-none text-ember-400">{STAGES[paper.stageIndex].label}</p>
          <p className="mt-2 font-inter text-xs font-semibold text-iris-100">Stage {paper.stageIndex + 1} of {STAGES.length}</p>
          <p className="mt-3 inline-block bg-white px-2 py-0.5 font-inter text-[11px] font-bold uppercase tracking-[0.06em] text-night-900">{TONE_LABEL[info.tone]}</p>
        </div>
      </div>
      <div className="border-t border-white/15 bg-black/20 px-6 py-5 sm:px-8 lg:px-10">
        <SegmentBar stageIndex={paper.stageIndex} done={done} />
        <ol className="mt-2 hidden grid-cols-8 gap-1.5 font-inter text-[10px] font-semibold uppercase tracking-[0.04em] text-iris-100 md:grid">
          {STAGES.map((st, i) => <li key={st.id} className={i === paper.stageIndex ? 'text-white' : undefined}>{st.label}</li>)}
        </ol>
      </div>
      <div className={cx('border-l-4 px-6 py-5 text-night-900 sm:px-8 lg:px-10', info.tone === 'action' ? 'border-ember-500 bg-ember-50' : info.tone === 'done' ? 'border-j3valid-700 bg-j3valid-50' : 'border-iris-700 bg-white')}>
        <h3 className="font-jakarta text-lg font-bold text-iris-700">{info.title}</h3>
        <p className="mt-1 font-inter text-[15px] text-mauve-700">{info.text}</p>
      </div>
    </article>
  )
}

export function ActivityLog({ paper }: { paper: TrackedPaper }) {
  const info = stageInfo(paper)
  return (
    <section aria-labelledby="log-h" className="border border-j3paper-rule bg-white p-6 sm:p-8">
      <h3 id="log-h" className="border-b border-j3paper-rule pb-3 font-jakarta text-sm font-bold uppercase tracking-[0.05em] text-night-900 before:mr-2.5 before:inline-block before:h-2 before:w-2 before:bg-ember-500 before:align-middle before:content-['']">Activity log</h3>
      <ol className="mt-5 space-y-1">
        {STAGES.map((s, i) => {
          const past = i < paper.stageIndex
          const now = i === paper.stageIndex
          const status = past ? 'Completed' : now ? (info.tone === 'done' ? 'Completed' : info.tone === 'action' ? 'Action needed' : 'In progress') : 'Upcoming'
          const date = paper.stageDates[s.id]
          const finished = past || (now && info.tone === 'done')
          return (
            <li key={s.id} aria-current={now ? 'step' : undefined} className={cx('flex items-start gap-4 border-b border-j3paper-rule px-3 py-3 last:border-b-0', now && 'bg-iris-50')}>
              <span aria-hidden="true" className={cx('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-tile font-inter text-xs font-bold', finished ? 'bg-j3valid-700 text-white' : now ? 'bg-iris-700 text-white' : 'bg-white text-mauve-600 ring-1 ring-j3paper-rule')}>
                {finished ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-jakarta text-lg font-semibold text-iris-700">{s.label}</p>
                  <p className="font-inter text-sm text-mauve-600">{date ? formatDate(date) : 'Date to be set'}</p>
                </div>
                <p className={cx('font-inter text-xs font-bold uppercase tracking-[0.08em]', status === 'Action needed' ? 'text-ember-700' : status === 'Upcoming' ? 'text-mauve-600' : status === 'Completed' ? 'text-j3valid-700' : 'text-iris-700')}>{status}</p>
                {i === 2 && paper.decisionNote && (past || now) && <p className="mt-1 font-inter text-sm text-mauve-700">Editor’s note: {paper.decisionNote}</p>}
              </div>
            </li>
          )
        })}
      </ol>
    </section>
  )
}

function DocumentsCard({ paper, onDownload }: { paper: TrackedPaper; onDownload: (d: PaperDocument) => void }) {
  return (
    <section aria-labelledby="docs-h" className="border border-j3paper-rule bg-white p-6 sm:p-8">
      <h3 id="docs-h" className="border-b border-j3paper-rule pb-3 font-jakarta text-sm font-bold uppercase tracking-[0.05em] text-night-900 before:mr-2.5 before:inline-block before:h-2 before:w-2 before:bg-ember-500 before:align-middle before:content-['']">Documents</h3>
      <ul className="divide-y divide-j3paper-rule">
        {paper.documents.map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-jakarta text-lg font-semibold text-iris-700">{d.label}</p>
              {d.note && <p className="font-inter text-sm text-mauve-600">{d.note}</p>}
              {!d.available && !d.note && <p className="font-inter text-sm text-mauve-600">Not available yet</p>}
            </div>
            <AcButton variant={d.available ? 'outline' : 'ghost'} disabled={!d.available} onClick={() => onDownload(d)} aria-label={`${d.id === 'cert' ? 'View' : 'Download'} ${d.label}`} className="shrink-0 px-4 py-2">
              {d.id === 'cert' ? <Verified className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}{d.id === 'cert' ? 'View' : 'Download'}
            </AcButton>
          </li>
        ))}
      </ul>
    </section>
  )
}

const PAY_TEXT: Record<PaymentStatus, { tone: 'navy' | 'amber' | 'green' | 'plain'; label: string; text: string }> = {
  'not-due': { tone: 'plain', label: 'Not due yet', text: 'The article processing charge opens once your paper is accepted. Nothing is payable now.' },
  due: { tone: 'amber', label: 'Payment due', text: 'Pay online or upload your UPI or bank proof. Reminders continue until the payment is confirmed.' },
  verifying: { tone: 'navy', label: 'Verifying proof', text: 'Your proof is with the editor, usually verified within one working day. Reminders are paused.' },
  paid: { tone: 'green', label: 'Paid', text: 'Payment confirmed. Your GST invoice is in the documents list.' },
}

function PaymentCard({ paper, onPay }: { paper: TrackedPaper; onPay: (m: PayMode) => void }) {
  const s = PAY_TEXT[paper.payment]
  return (
    <section aria-labelledby="pay-h" className="border border-j3paper-rule bg-white p-6">
      <div className="flex items-center justify-between gap-2">
        <h3 id="pay-h" className="font-jakarta text-sm font-bold uppercase tracking-[0.05em] text-night-900 before:mr-2.5 before:inline-block before:h-2 before:w-2 before:bg-ember-500 before:align-middle before:content-['']">Payment</h3>
        <AcTag tone={s.tone} icon={paper.payment === 'paid' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : undefined}>{s.label}</AcTag>
      </div>
      <p className="mt-3 font-inter text-base text-mauve-600">{s.text}</p>
      {paper.payment !== 'paid' && <p className="mt-2 font-inter text-sm text-mauve-600">APC {inr.format(journal.apc.inr)} + {journal.apc.gstPercent}% GST (Indian authors) or US${journal.apc.usd}.</p>}
      {paper.payment === 'due' && (
        <div className="mt-4 grid gap-2">
          <AcButton onClick={() => onPay('online')}>Pay online</AcButton>
          <AcButton variant="outline" onClick={() => onPay('proof')}>Upload UPI / bank proof</AcButton>
        </div>
      )}
    </section>
  )
}

export function J3PaperResult({ paper, actions }: { paper: TrackedPaper; actions: PaperActions }) {
  const canSign = paper.stageIndex >= 3 && !paper.copyrightSigned
  return (
    <div className="space-y-8">
      <TicketCard paper={paper} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-8">
          <ActivityLog paper={paper} />
          <DocumentsCard paper={paper} onDownload={actions.onDownload} />
        </div>
        <div className="min-w-0 space-y-6">
          <PaymentCard paper={paper} onPay={actions.onPay} />
          <section aria-labelledby="act-h" className="border border-j3paper-rule bg-white p-6">
            <h3 id="act-h" className="font-jakarta text-sm font-bold uppercase tracking-[0.05em] text-night-900 before:mr-2.5 before:inline-block before:h-2 before:w-2 before:bg-ember-500 before:align-middle before:content-['']">Actions</h3>
            <div className="mt-4 grid gap-2">
              <AcButton variant="outline" disabled={!canSign} onClick={actions.onSign}>{paper.copyrightSigned ? 'Copyright form signed' : 'Sign copyright form'}</AcButton>
              <AcButton variant="outline" disabled={!paper.editable} onClick={actions.onEdit}>Edit submission</AcButton>
              {paper.stageIndex >= 6 && <AcButton onClick={() => actions.onDownload({ id: 'cert', label: 'Author certificate', available: true })}><Award className="h-4 w-4" aria-hidden="true" />View certificate</AcButton>}
            </div>
            <p className="mt-3 font-inter text-sm text-mauve-600">Signing, editing, paying and certificates need an email OTP. A paper can be edited only before the decision.</p>
          </section>
          <section aria-labelledby="ref-h" className="bg-iris-700 p-6 text-white">
            <h3 id="ref-h" className="font-jakarta text-xl font-semibold">Referral credits</h3>
            <p className="mt-2 font-jakarta text-[2rem] font-semibold">{paper.referral.credits}<span className="ml-2 text-base font-semibold text-iris-200">{paper.referral.credits === 1 ? 'credit' : 'credits'}</span></p>
            <p className="font-inter text-sm text-iris-100">{paper.referral.referred} colleague{paper.referral.referred === 1 ? '' : 's'} referred</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 font-inter text-sm">Your code <strong className="rounded-tile bg-white/15 px-3 py-1 tracking-wide">{paper.referral.code}</strong>
              <J3Copy tone="dark" text={paper.referral.code} done="Code copied" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
