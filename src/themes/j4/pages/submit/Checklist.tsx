// Sticky left pane of the submission page: manuscript checklist with live completeness, APC note and what happens next.
import { journal } from '../../../../config/journals'
import { cx } from '../../components/primitives'
import { Check } from '../../icons'
import { SECTIONS, type SectionId } from './shared'

const NEXT = [
  'Paper ID is sent by email, SMS and WhatsApp.',
  'An editor screens scope, completeness and similarity.',
  'Peer review, then a decision with written reasons.',
  'If accepted: sign the copyright form, then pay the APC.',
]

export function Checklist({ counts, savedLabel, onJump }: { counts: Record<SectionId, number>; savedLabel: string; onJump: (id: SectionId) => void }) {
  const required = SECTIONS.filter((s) => s.id !== 'review')
  const done = required.filter((s) => counts[s.id] === 0).length
  const pct = Math.round((done / required.length) * 100)
  return (
    <aside aria-label="Manuscript checklist" className="space-y-4 lg:sticky lg:top-24">
      <div className="rounded-pane border border-abyss-200 bg-white shadow-hair">
        <div className="border-b border-abyss-200 bg-abyss-900 px-4 py-3 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-azure-300">Manuscript checklist</p>
          <p className="mt-1 flex items-baseline justify-between gap-3"><span className="font-serif4 text-lg font-semibold">{done} of {required.length} sections complete</span><span className="text-sm tabular-nums text-abyss-300">{pct}%</span></p>
          <div role="progressbar" aria-label="Form completeness" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
            <div className="h-full bg-azure-400 motion-safe:transition-[width] motion-safe:duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <ol className="p-2">
          {SECTIONS.map((s, i) => {
            const n = s.id === 'review' ? 0 : counts[s.id]
            const ok = s.id !== 'review' && n === 0
            return (
              <li key={s.id}>
                <a href={`#sec-${s.id}`} onClick={(e) => { e.preventDefault(); onJump(s.id) }}
                  className="flex min-h-[44px] items-start gap-3 rounded-ctl px-2 py-2 hover:bg-abyss-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                  <span aria-hidden="true" className={cx('mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-ctl border text-xs font-semibold tabular-nums', ok ? 'border-cobalt-700 bg-cobalt-700 text-white' : 'border-abyss-300 bg-white text-steel-600')}>
                    {ok ? <Check className="h-4 w-4" /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-abyss-900">{s.label}</span>
                    <span className="block text-[13px] leading-snug text-steel-600">
                      {s.id === 'review' ? s.hint : ok ? 'Complete' : `${n} item${n === 1 ? '' : 's'} to complete`}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>
        <p className="border-t border-abyss-200 px-4 py-2.5 text-[13px] text-steel-600" aria-live="polite">{savedLabel}</p>
      </div>

      <div className="rounded-pane border border-abyss-200 bg-azure-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-cobalt-700">Article processing charge</p>
        <p className="mt-1 font-serif4 text-lg font-semibold text-abyss-900">No fee until acceptance</p>
        <p className="mt-1 text-[13px] leading-snug text-steel-700">Submitting and peer review are free. If accepted: {'₹'}{journal.apc.inr.toLocaleString('en-IN')} + {journal.apc.gstPercent}% GST (Indian authors) or US${journal.apc.usd}.</p>
      </div>

      <div className="hidden rounded-pane border border-abyss-200 bg-white p-4 lg:block">
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">What happens next</p>
        <ol className="mt-2 space-y-2">
          {NEXT.map((t, i) => <li key={t} className="flex gap-2.5 text-[13px] leading-snug text-steel-700"><span className="font-semibold tabular-nums text-abyss-900">{i + 1}.</span>{t}</li>)}
        </ol>
      </div>
    </aside>
  )
}
