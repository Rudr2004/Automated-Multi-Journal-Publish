import { CreditCard, Download, FileSignature, Gift, Pencil, StickyNote2, VerifiedUser } from '../../components/uiIcons'
import { STAGES, type PaperDocument, type TrackedPaper } from '../../../../mock-data/journals/j1'
import { Button } from '../../components/Button'
import { CopyButton } from '../../components/ArticleParts'
import { Badge } from '../../components/primitives'
import { StageNow } from '../../components/StageNow'
import { StageTimeline } from '../../components/StageTimeline'
import { stageInfo } from '../../../../core/lib/stageInfo'

export interface PaperActions {
  onPay: () => void
  onSign: () => void
  onEdit: () => void
  onDownload: (doc: PaperDocument) => void
}

const tone = (i: number) => (i >= 6 ? 'oa' : i >= 3 ? 'navy' : 'neutral') as 'oa' | 'navy' | 'neutral'

const PAY_LABEL: Record<TrackedPaper['payment'], string> = {
  'not-due': 'Pay APC', due: 'Pay APC', verifying: 'Payment proof under review', paid: 'Payment confirmed',
}

/** Presentational result card for a tracked paper. */
export function PaperResult({ paper, actions }: { paper: TrackedPaper; actions: PaperActions }) {
  const canSign = paper.stageIndex >= 3 && !paper.copyrightSigned
  return (
    <div className="space-y-6">
      <section className="rounded-card border border-line bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-ink-muted">{paper.journalName}</p>
            <h2 className="mt-1 font-serif text-2xl font-semibold leading-snug text-navy">{paper.title}</h2>
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted">Paper ID <strong className="text-ink">{paper.paperId}</strong><CopyButton text={paper.paperId} label="Copy" /></p>
          </div>
          <Badge tone={tone(paper.stageIndex)}>{STAGES[paper.stageIndex].label}</Badge>
        </div>
        <div className="mt-8"><StageTimeline currentIndex={paper.stageIndex} dates={paper.stageDates} /></div>
        <StageNow info={stageInfo(paper)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <section aria-labelledby="docs-h" className="rounded-card border border-line bg-white p-5 sm:p-6">
          {paper.decisionNote && (
            <aside className="mb-5 rounded-card border border-navy-200 bg-navy-50 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy"><StickyNote2 className="h-5 w-5 text-navy-500" aria-hidden />Editor’s note</p>
              <p className="mt-1.5 text-sm leading-relaxed">{paper.decisionNote}</p>
              <p className="mt-2 text-xs text-ink-muted">Every decision is logged with its reason. The full comments are in the review report below.</p>
            </aside>
          )}
          <h3 id="docs-h" className="font-serif text-lg font-semibold text-navy">Documents</h3>
          <ul className="mt-3 divide-y divide-line">
            {paper.documents.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 py-3">
                <div><p className="text-sm font-medium">{d.label}</p>{d.note && <p className="text-xs text-ink-muted">{d.note}</p>}</div>
                <Button size="sm" variant={d.available ? 'secondary' : 'ghost'} disabled={!d.available} onClick={() => actions.onDownload(d)}>
                  {d.id === 'cert' ? <VerifiedUser className="h-4 w-4" aria-hidden /> : <Download className="h-4 w-4" aria-hidden />}{d.id === 'cert' ? 'View' : 'Download'}
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-6">
          <section aria-labelledby="act-h" className="rounded-card border border-line bg-white p-5">
            <h3 id="act-h" className="font-serif text-lg font-semibold text-navy">Actions</h3>
            <div className="mt-3 space-y-2.5">
              <Button className="w-full" disabled={paper.payment !== 'due'} onClick={actions.onPay}><CreditCard className="h-4 w-4" aria-hidden />{PAY_LABEL[paper.payment]}</Button>
              <Button className="w-full" variant="outline" disabled={!canSign} onClick={actions.onSign}><FileSignature className="h-4 w-4" aria-hidden />{paper.copyrightSigned ? 'Copyright form signed' : 'Sign Copyright Form'}</Button>
              <Button className="w-full" variant="outline" disabled={!paper.editable} onClick={actions.onEdit}><Pencil className="h-4 w-4" aria-hidden />Edit Paper</Button>
            </div>
            <p className="mt-3 text-xs text-ink-muted">
              {paper.payment === 'due' ? 'Payment reminders continue until the payment is confirmed. ' : ''}
              A paper can be edited only before the decision. Signing and editing need an email OTP.
            </p>
          </section>
          <section aria-labelledby="ref-h" className="rounded-card border border-line bg-mist p-5">
            <h3 id="ref-h" className="flex items-center gap-2 font-serif text-lg font-semibold text-navy"><Gift className="h-5 w-5 text-navy-500" aria-hidden />Referral credits</h3>
            <p className="mt-2 font-serif text-3xl font-semibold text-navy">₹{paper.referral.credits.toLocaleString('en-IN')}</p>
            <p className="text-sm text-ink-muted">{paper.referral.referred} colleague{paper.referral.referred === 1 ? '' : 's'} referred</p>
            <p className="mt-3 flex items-center gap-2 text-sm">Your code: <strong>{paper.referral.code}</strong><CopyButton text={paper.referral.code} label="Copy" /></p>
          </section>
        </div>
      </div>
    </div>
  )
}
