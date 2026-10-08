// Result of a successful lookup: ring + timeline, current-stage panel, documents, payment, actions and referral.
import { journal } from '../../../../config/journals'
import { type PaperDocument, type PaymentStatus, type TrackedPaper } from '../../../../core/types'
import { Button } from '../../components/Button'
import { CopyChip } from '../../components/CopyChip'
import { Bank, Card, Edit, Gift, Note, Sign } from '../../components/pageIcons'
import { Tag } from '../../components/primitives'
import { Award, Check, Download, Verified } from '../../icons'
import type { PayMode } from './TrackDialogs'
import { ProgressRing, StagePanel, StageTimeline } from './TimelineParts'

export interface PaperActions {
  onPay: (mode: PayMode) => void
  onSign: () => void
  onEdit: () => void
  onDownload: (doc: PaperDocument) => void
}

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })

const PAY_TEXT: Record<PaymentStatus, { tag: 'neutral' | 'accent' | 'brand'; label: string; text: string }> = {
  'not-due': { tag: 'neutral', label: 'Not due yet', text: 'The article processing charge opens once your paper is accepted. Nothing is payable now.' },
  due: { tag: 'accent', label: 'Payment due', text: 'Pay online or upload your UPI or bank proof. Reminders continue until the payment is confirmed.' },
  verifying: { tag: 'accent', label: 'Verifying proof', text: 'Your proof is with the editor, usually verified within one working day. Reminders are paused.' },
  paid: { tag: 'brand', label: 'Paid', text: 'Payment confirmed. Your GST invoice is in the documents list.' },
}

function PaymentCard({ paper, onPay }: { paper: TrackedPaper; onPay: (m: PayMode) => void }) {
  const s = PAY_TEXT[paper.payment]
  return (
    <section aria-labelledby="pay-h" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card">
      <div className="flex items-center justify-between gap-2">
        <h3 id="pay-h" className="font-display text-base font-bold text-graphite-800">Payment</h3>
        <Tag tone={s.tag} icon={paper.payment === 'paid' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : undefined}>{s.label}</Tag>
      </div>
      <p className="mt-2 text-sm text-graphite-600">{s.text}</p>
      {paper.payment !== 'paid' && <p className="mt-2 text-xs text-graphite-600">APC {inr.format(journal.apc.inr)} + {journal.apc.gstPercent}% GST (Indian authors) or US${journal.apc.usd}.</p>}
      {paper.payment === 'due' && (
        <div className="mt-4 grid gap-2">
          <Button onClick={() => onPay('online')}><Card className="h-4 w-4" aria-hidden="true" />Pay online</Button>
          <Button variant="outline" onClick={() => onPay('proof')}><Bank className="h-4 w-4" aria-hidden="true" />Upload UPI / bank proof</Button>
        </div>
      )}
    </section>
  )
}

export function PaperResult({ paper, actions }: { paper: TrackedPaper; actions: PaperActions }) {
  const canSign = paper.stageIndex >= 3 && !paper.copyrightSigned
  return (
    <div className="space-y-6">
      <section aria-labelledby="paper-h" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">{paper.journalName}</p>
        <h2 id="paper-h" className="mt-1 font-display text-xl font-bold leading-snug text-graphite-800 sm:text-2xl">{paper.title}</h2>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-graphite-600">Paper ID <strong className="text-graphite-800">{paper.paperId}</strong><CopyChip text={paper.paperId} label="Copy" done="Paper ID copied" /></p>
        <p className="mt-1 text-sm text-graphite-600">{paper.authors.join(', ')}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <section aria-labelledby="prog-h" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:p-6">
            <h3 id="prog-h" className="font-display text-base font-bold text-graphite-800">Progress</h3>
            <div className="mt-4 grid items-start gap-6 sm:grid-cols-[10rem_1fr]">
              <div className="flex justify-center sm:block"><ProgressRing paper={paper} /></div>
              <StageTimeline paper={paper} />
            </div>
          </section>
          <StagePanel paper={paper} />
          {paper.decisionNote && (
            <aside aria-label="Editor’s note" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card">
              <p className="flex items-center gap-2 text-sm font-semibold text-graphite-800"><Note className="h-5 w-5 text-accent-700" aria-hidden="true" />Editor’s note</p>
              <p className="mt-1.5 text-sm leading-relaxed text-graphite-700">{paper.decisionNote}</p>
              <p className="mt-2 text-xs text-graphite-600">Every decision is logged with its reason. The full comments are in the review report.</p>
            </aside>
          )}
          <section aria-labelledby="docs-h" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:p-6">
            <h3 id="docs-h" className="font-display text-base font-bold text-graphite-800">Documents</h3>
            <ul className="mt-2 divide-y divide-graphite-100">
              {paper.documents.map((d) => (
                <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0"><p className="text-sm font-medium text-graphite-800">{d.label}</p>{d.note && <p className="text-xs text-graphite-600">{d.note}</p>}{!d.available && !d.note && <p className="text-xs text-graphite-600">Not available yet</p>}</div>
                  <Button variant={d.available ? 'outline' : 'ghost'} disabled={!d.available} onClick={() => actions.onDownload(d)} aria-label={`${d.id === 'cert' ? 'View' : 'Download'} ${d.label}`}>
                    {d.id === 'cert' ? <Verified className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}{d.id === 'cert' ? 'View' : 'Download'}
                  </Button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="min-w-0 space-y-6">
          <PaymentCard paper={paper} onPay={actions.onPay} />
          <section aria-labelledby="act-h" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card">
            <h3 id="act-h" className="font-display text-base font-bold text-graphite-800">Actions</h3>
            <div className="mt-3 grid gap-2">
              <Button variant="outline" disabled={!canSign} onClick={actions.onSign}><Sign className="h-4 w-4" aria-hidden="true" />{paper.copyrightSigned ? 'Copyright form signed' : 'Sign copyright form'}</Button>
              <Button variant="outline" disabled={!paper.editable} onClick={actions.onEdit}><Edit className="h-4 w-4" aria-hidden="true" />Edit submission</Button>
              {paper.stageIndex >= 6 && <Button variant="secondary" onClick={() => actions.onDownload({ id: 'cert', label: 'Author certificate', available: true })}><Award className="h-4 w-4" aria-hidden="true" />View certificate</Button>}
            </div>
            <p className="mt-3 text-xs text-graphite-600">Signing, editing, paying and certificates need an email OTP. A paper can be edited only before the decision.</p>
          </section>
          <section aria-labelledby="ref-h" className="rounded-panel bg-brand-800 p-5 text-white shadow-soft">
            <h3 id="ref-h" className="flex items-center gap-2 font-display text-base font-bold"><Gift className="h-5 w-5 text-brand-200" aria-hidden="true" />Referral credits</h3>
            <p className="mt-2 font-display text-3xl font-extrabold">{paper.referral.credits}<span className="ml-1 text-sm font-medium text-brand-200">{paper.referral.credits === 1 ? 'credit' : 'credits'}</span></p>
            <p className="text-sm text-brand-100">{paper.referral.referred} colleague{paper.referral.referred === 1 ? '' : 's'} referred</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">Your code <strong className="rounded-chip bg-white/10 px-2 py-0.5 tracking-wide">{paper.referral.code}</strong>
              <CopyChip text={paper.referral.code} label="Copy" done="Code copied" />
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
