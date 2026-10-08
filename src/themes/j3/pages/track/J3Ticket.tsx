// Result of a successful lookup in Journal 3: a ticket card (notched edges, segmented progress), the activity log, documents, payment and referral.
import { useEffect, useState } from 'react'
import { journal } from '../../../../config/journals'
import { formatDate } from '../../../../core/lib/format'
import { stageInfo } from '../../../../core/lib/stageInfo'
import { STAGES, type PaperDocument, type PaymentStatus, type TrackedPaper } from '../../../../core/types'
import { Button } from '../../components/Button'
import { J3Copy } from '../../components/J3Field'
import { Kicker, Pill, cx } from '../../components/primitives'
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
          <span key={s.id} aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-iris-100">
            <span className={cx('block h-full rounded-full motion-safe:transition-[width] motion-safe:duration-500 motion-safe:ease-out', filled ? 'bg-iris-700' : 'bg-iris-400', current && 'motion-safe:animate-pulse')}
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
    <article aria-labelledby="paper-h" className="relative grid rounded-sheet bg-white shadow-lift3 lg:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="min-w-0 p-6 sm:p-8 lg:p-10">
        <Kicker className="text-iris-700">{paper.journalName}</Kicker>
        <p className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-mauve-700">Paper ID</span>
          <strong className="break-all font-jakarta text-2xl font-extrabold tracking-wide text-night-900">{paper.paperId}</strong>
          <J3Copy text={paper.paperId} done="Paper ID copied" />
        </p>
        <h2 id="paper-h" className="mt-4 font-jakarta text-[1.625rem] font-extrabold leading-snug text-night-900 sm:text-[1.75rem]">{paper.title}</h2>
        <p className="mt-3 text-base text-mauve-700"><span className="sr-only">Authors: </span>{paper.authors.join(', ')}</p>

        <div className={cx('mt-6 rounded-block p-5', info.tone === 'action' ? 'bg-night-900 text-white' : 'bg-iris-50 text-night-900')}>
          {info.tone === 'action'
            ? <span className="inline-flex rounded-full bg-white px-3 py-1 font-jakarta text-xs font-bold tracking-wide text-night-900">{TONE_LABEL[info.tone]}</span>
            : <Pill tone="iris">{TONE_LABEL[info.tone]}</Pill>}
          <h3 className="mt-2 font-jakarta text-xl font-extrabold">{info.title}</h3>
          <p className={cx('mt-1 text-base', info.tone === 'action' ? 'text-iris-100' : 'text-mauve-700')}>{info.text}</p>
        </div>
      </div>

      <div className="relative min-w-0 border-t-2 border-dashed border-iris-200 p-6 sm:p-8 lg:border-l-2 lg:border-t-0">
        <span aria-hidden="true" className="absolute -left-3.5 -top-3.5 h-7 w-7 rounded-full bg-iris-50" />
        <span aria-hidden="true" className="absolute -right-3.5 -top-3.5 h-7 w-7 rounded-full bg-iris-50 lg:hidden" />
        <span aria-hidden="true" className="absolute -bottom-3.5 -left-3.5 hidden h-7 w-7 rounded-full bg-iris-50 lg:block" />
        <Kicker className="text-iris-700">Current stage</Kicker>
        <p className="mt-2 font-jakarta text-[1.75rem] font-extrabold leading-none text-night-900">{STAGES[paper.stageIndex].label}</p>
        <p className="mt-2 text-sm font-semibold text-mauve-700">Stage {paper.stageIndex + 1} of {STAGES.length}</p>
        <div className="mt-5"><SegmentBar stageIndex={paper.stageIndex} done={done} /></div>
        <p className="mt-5 text-sm text-mauve-700">{journal.shortName} · {journal.paperIdPrefix} series</p>
        <div aria-hidden="true" className="mt-4 h-9 w-full rounded-tile opacity-80 [background:repeating-linear-gradient(90deg,#1B1430_0_2px,transparent_2px_5px,#1B1430_5px_6px,transparent_6px_10px)]" />
      </div>
    </article>
  )
}

export function ActivityLog({ paper }: { paper: TrackedPaper }) {
  const info = stageInfo(paper)
  return (
    <section aria-labelledby="log-h" className="rounded-sheet bg-white p-6 shadow-lift3 sm:p-8">
      <h3 id="log-h" className="font-jakarta text-[1.75rem] font-extrabold text-night-900">Activity log</h3>
      <ol className="mt-5 space-y-1">
        {STAGES.map((s, i) => {
          const past = i < paper.stageIndex
          const now = i === paper.stageIndex
          const status = past ? 'Completed' : now ? (info.tone === 'done' ? 'Completed' : info.tone === 'action' ? 'Action needed' : 'In progress') : 'Upcoming'
          const date = paper.stageDates[s.id]
          const finished = past || (now && info.tone === 'done')
          return (
            <li key={s.id} aria-current={now ? 'step' : undefined} className={cx('flex items-start gap-4 rounded-tile px-3 py-3', now && 'bg-iris-50')}>
              <span aria-hidden="true" className={cx('mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-jakarta text-xs font-extrabold', finished ? 'bg-iris-700 text-white' : now ? 'bg-night-900 text-white' : 'bg-white text-mauve-600 ring-2 ring-iris-200')}>
                {finished ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="font-jakarta text-base font-bold text-night-900">{s.label}</p>
                  <p className="text-sm text-mauve-700">{date ? formatDate(date) : 'Date to be set'}</p>
                </div>
                <p className={cx('text-sm font-semibold', status === 'Action needed' ? 'font-extrabold text-night-900' : status === 'Upcoming' ? 'text-mauve-600' : 'text-iris-800')}>{status}</p>
                {i === 2 && paper.decisionNote && (past || now) && <p className="mt-1 text-sm text-mauve-700">Editor’s note: {paper.decisionNote}</p>}
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
    <section aria-labelledby="docs-h" className="rounded-sheet bg-white p-6 shadow-lift3 sm:p-8">
      <h3 id="docs-h" className="font-jakarta text-[1.75rem] font-extrabold text-night-900">Documents</h3>
      <ul className="mt-3 divide-y divide-iris-100">
        {paper.documents.map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="font-jakarta text-base font-bold text-night-900">{d.label}</p>
              {d.note && <p className="text-sm text-mauve-700">{d.note}</p>}
              {!d.available && !d.note && <p className="text-sm text-mauve-700">Not available yet</p>}
            </div>
            <Button variant={d.available ? 'outline' : 'ghost'} disabled={!d.available} onClick={() => onDownload(d)} aria-label={`${d.id === 'cert' ? 'View' : 'Download'} ${d.label}`} className="shrink-0 px-4 py-2">
              {d.id === 'cert' ? <Verified className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}{d.id === 'cert' ? 'View' : 'Download'}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  )
}

const PAY_TEXT: Record<PaymentStatus, { tone: 'iris' | 'night' | 'plain'; label: string; text: string }> = {
  'not-due': { tone: 'plain', label: 'Not due yet', text: 'The article processing charge opens once your paper is accepted. Nothing is payable now.' },
  due: { tone: 'night', label: 'Payment due', text: 'Pay online or upload your UPI or bank proof. Reminders continue until the payment is confirmed.' },
  verifying: { tone: 'iris', label: 'Verifying proof', text: 'Your proof is with the editor, usually verified within one working day. Reminders are paused.' },
  paid: { tone: 'iris', label: 'Paid', text: 'Payment confirmed. Your GST invoice is in the documents list.' },
}

function PaymentCard({ paper, onPay }: { paper: TrackedPaper; onPay: (m: PayMode) => void }) {
  const s = PAY_TEXT[paper.payment]
  return (
    <section aria-labelledby="pay-h" className="rounded-sheet bg-white p-6 shadow-lift3">
      <div className="flex items-center justify-between gap-2">
        <h3 id="pay-h" className="font-jakarta text-xl font-extrabold text-night-900">Payment</h3>
        <Pill tone={s.tone} icon={paper.payment === 'paid' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : undefined}>{s.label}</Pill>
      </div>
      <p className="mt-3 text-base text-mauve-700">{s.text}</p>
      {paper.payment !== 'paid' && <p className="mt-2 text-sm text-mauve-700">APC {inr.format(journal.apc.inr)} + {journal.apc.gstPercent}% GST (Indian authors) or US${journal.apc.usd}.</p>}
      {paper.payment === 'due' && (
        <div className="mt-4 grid gap-2">
          <Button onClick={() => onPay('online')}>Pay online</Button>
          <Button variant="outline" onClick={() => onPay('proof')}>Upload UPI / bank proof</Button>
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
          <section aria-labelledby="act-h" className="rounded-sheet bg-white p-6 shadow-lift3">
            <h3 id="act-h" className="font-jakarta text-xl font-extrabold text-night-900">Actions</h3>
            <div className="mt-4 grid gap-2">
              <Button variant="outline" disabled={!canSign} onClick={actions.onSign}>{paper.copyrightSigned ? 'Copyright form signed' : 'Sign copyright form'}</Button>
              <Button variant="outline" disabled={!paper.editable} onClick={actions.onEdit}>Edit submission</Button>
              {paper.stageIndex >= 6 && <Button onClick={() => actions.onDownload({ id: 'cert', label: 'Author certificate', available: true })}><Award className="h-4 w-4" aria-hidden="true" />View certificate</Button>}
            </div>
            <p className="mt-3 text-sm text-mauve-700">Signing, editing, paying and certificates need an email OTP. A paper can be edited only before the decision.</p>
          </section>
          <section aria-labelledby="ref-h" className="rounded-sheet bg-night-900 p-6 text-white shadow-lift3">
            <h3 id="ref-h" className="font-jakarta text-xl font-extrabold">Referral credits</h3>
            <p className="mt-2 font-jakarta text-[2rem] font-extrabold">{paper.referral.credits}<span className="ml-2 text-base font-semibold text-iris-200">{paper.referral.credits === 1 ? 'credit' : 'credits'}</span></p>
            <p className="text-sm text-iris-100">{paper.referral.referred} colleague{paper.referral.referred === 1 ? '' : 's'} referred</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">Your code <strong className="rounded-full bg-white/15 px-3 py-1 tracking-wide">{paper.referral.code}</strong>
              <J3Copy tone="dark" text={paper.referral.code} done="Code copied" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
