// Side panels of the status console: APC, documents, actions and referral credits.
import { journal } from '../../../../config/journals'
import type { PaperDocument, PaymentStatus, TrackedPaper } from '../../../../core/types'
import { Button } from '../../components/Button'
import { CopyButton } from '../../components/form/Field'
import { Tag } from '../../components/primitives'
import { Award, Check, Download, Verified } from '../../icons'
import { apcFor, type PayMode } from './PayDialog'

const PAY_TEXT: Record<PaymentStatus, { label: string; text: string }> = {
  'not-due': { label: 'Not due yet', text: 'The charge opens once your paper is accepted. Nothing is payable now.' },
  due: { label: 'Payment due', text: 'Pay online or upload your UPI or bank proof. Reminders continue until payment is confirmed.' },
  verifying: { label: 'Verifying proof', text: 'Your proof is with the editor, usually verified within one working day. Reminders are paused.' },
  paid: { label: 'Paid', text: 'Payment confirmed. Your GST invoice is in the documents list.' },
}

const Panel = ({ id, title, aside, children }: { id: string; title: string; aside?: React.ReactNode; children: React.ReactNode }) => (
  <section aria-labelledby={id} className="rounded-pane border border-abyss-200 bg-white shadow-hair">
    <div className="flex items-center justify-between gap-2 border-b border-abyss-200 bg-abyss-50 px-4 py-3"><h3 id={id} className="font-serif4 text-lg font-semibold text-abyss-900">{title}</h3>{aside}</div>
    <div className="p-4">{children}</div>
  </section>
)

export function ApcPanel({ paper, onPay }: { paper: TrackedPaper; onPay: (m: PayMode) => void }) {
  const s = PAY_TEXT[paper.payment]
  const i = apcFor(true), u = apcFor(false)
  return (
    <Panel id="apc-h" title="Article processing charge" aside={<Tag tone={paper.payment === 'due' ? 'azure' : 'plain'} icon={paper.payment === 'paid' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : undefined}>{s.label}</Tag>}>
      <p className="text-[15px] text-steel-700">{s.text}</p>
      <table className="mt-3 w-full text-sm tabular-nums">
        <caption className="sr-only">Charge by author category</caption>
        <thead><tr className="text-left text-xs uppercase tracking-[0.06em] text-steel-600"><th scope="col" className="pb-1 font-semibold" /><th scope="col" className="pb-1 text-right font-semibold">India (INR)</th><th scope="col" className="pb-1 text-right font-semibold">Other (USD)</th></tr></thead>
        <tbody className="[&_td]:py-1 [&_td]:text-right [&_th]:py-1 [&_th]:text-left [&_th]:font-normal [&_th]:text-steel-600">
          <tr><th scope="row">APC</th><td>{i.fmt(i.base)}</td><td>{u.fmt(u.base)}</td></tr>
          <tr><th scope="row">GST {journal.apc.gstPercent}%</th><td>{i.fmt(i.gst)}</td><td>n/a</td></tr>
          <tr className="border-t border-abyss-200 font-semibold text-abyss-900 [&_th]:font-semibold [&_th]:text-abyss-900"><th scope="row">Total</th><td>{i.fmt(i.total)}</td><td>{u.fmt(u.total)}</td></tr>
        </tbody>
      </table>
      {paper.payment === 'due' && (
        <div className="mt-4 grid gap-2">
          <Button variant="cta" className="min-h-[44px]" onClick={() => onPay('online')}>Pay online</Button>
          <Button variant="outline" className="min-h-[44px]" onClick={() => onPay('proof')}>Upload UPI or bank proof</Button>
        </div>
      )}
    </Panel>
  )
}

export function DocsPanel({ paper, onDownload }: { paper: TrackedPaper; onDownload: (d: PaperDocument) => void }) {
  return (
    <Panel id="docs-h" title="Documents">
      <ul className="divide-y divide-abyss-200">
        {paper.documents.map((d) => (
          <li key={d.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-abyss-900">{d.label}</p>
              <p className="text-[13px] text-steel-600">{d.note ?? (d.available ? 'Available' : 'Not available yet')}</p>
            </div>
            <Button variant="outline" disabled={!d.available} onClick={() => onDownload(d)} aria-label={`${d.id === 'cert' ? 'View' : 'Download'} ${d.label}`} className="min-h-[44px] shrink-0 px-3">
              {d.id === 'cert' ? <Verified className="h-4 w-4" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}{d.id === 'cert' ? 'View' : 'Get'}
            </Button>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

export function ActionsPanel({ paper, onSign, onEdit, onCert }: { paper: TrackedPaper; onSign: () => void; onEdit: () => void; onCert: () => void }) {
  const canSign = paper.stageIndex >= 3 && !paper.copyrightSigned
  return (
    <Panel id="act-h" title="Actions">
      <div className="grid gap-2">
        <Button variant="outline" className="min-h-[44px]" disabled={!canSign} onClick={onSign}>{paper.copyrightSigned ? 'Copyright form signed' : 'Sign copyright form'}</Button>
        <Button variant="outline" className="min-h-[44px]" disabled={!paper.editable} onClick={onEdit}>Edit submission</Button>
        {paper.stageIndex >= 6 && <Button variant="cta" className="min-h-[44px]" onClick={onCert}><Award className="h-4 w-4" aria-hidden="true" />View certificate</Button>}
      </div>
      <p className="mt-3 text-[13px] text-steel-600">Signing, editing, paying and certificates need an email code. A paper can be edited only before the decision.</p>
    </Panel>
  )
}

export function ReferralPanel({ paper }: { paper: TrackedPaper }) {
  const r = paper.referral
  return (
    <Panel id="ref-h" title="Referral credits">
      <p className="text-sm text-steel-700"><strong className="font-serif4 text-2xl font-semibold tabular-nums text-abyss-900">{r.credits}</strong> {r.credits === 1 ? 'credit' : 'credits'} · {r.referred} colleague{r.referred === 1 ? '' : 's'} referred</p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">Your code <strong className="rounded-ctl border border-abyss-200 bg-abyss-50 px-2 py-1 tabular-nums tracking-wide">{r.code}</strong><CopyButton text={r.code} done="Code copied" /></div>
    </Panel>
  )
}
