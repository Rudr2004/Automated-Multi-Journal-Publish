// Submission page banner (reference layout): breadcrumb + portal status, serif title with icon, intro and the four-step stepper with numbered circular nodes.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { cx } from '../../components/primitives'
import { Check } from '../../icons'
import { UploadFile } from './mi'
import { STEPS, type SectionId } from './shared'

export function SubmitHeader({ counts, onJump }: { counts: Record<SectionId, number>; onJump: (id: SectionId) => void }) {
  const [issue, month] = journal.nextIssue.label.split(' — ')
  return (
    <div className="space-y-4 rounded-xl border border-sky-200 bg-gradient-to-br from-[#eef7ff] via-white to-[#e0effe] p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-1.5 font-medium text-slate-500">
            <li><AppLink to={paths.home} className="hover:text-sky-700 hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
            <li><AppLink to={paths.forAuthors('author-guidelines')} className="hover:text-sky-700 hover:underline">For Authors</AppLink></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-semibold text-sky-700">Submit Manuscript</li>
          </ol>
        </nav>
        <span className="inline-flex items-center gap-1.5 rounded border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 font-mono text-[11px] font-medium text-emerald-800">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-500 motion-safe:animate-pulse" />Submissions Open: {issue.replace(', ', ' • ')}{month ? ` • ${month}` : ''}
        </span>
      </div>
      <div className="space-y-1.5">
        <h1 id="submit-h" className="flex items-center gap-2.5 font-serif4 text-2xl font-bold tracking-tight text-[#0b2545] sm:text-3xl">
          <UploadFile className="h-8 w-8 shrink-0 text-sky-600" aria-hidden="true" />Submit Your Manuscript
        </h1>
        <p className="max-w-2xl text-xs leading-relaxed text-slate-600 sm:text-sm">Fast-track peer-reviewed scholarly publishing with zero friction. Fill in essential metadata, add research team members with profile photos, upload your manuscript, and track progress online with your Manuscript ID.</p>
      </div>
      <div className="border-t border-sky-100 pt-3"><StepTracker counts={counts} onJump={onJump} /></div>
    </div>
  )
}

/** Four-step stepper: numbered circular nodes. Done = check, active = first incomplete step, the rest are muted. Each node jumps to its section. */
export function StepTracker({ counts, onJump }: { counts: Record<SectionId, number>; onJump: (id: SectionId) => void }) {
  const active = STEPS.findIndex((s) => counts[s.id] > 0)
  return (
    <nav aria-label="Submission steps">
      <ol className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        {STEPS.map((s, i) => {
          const done = counts[s.id] === 0
          const now = i === active
          const sub = now ? 'Active Step' : done ? 'Complete' : s.hint
          return (
            <li key={s.id}>
              <a href={`#sec-${s.id}`} onClick={(e) => { e.preventDefault(); onJump(s.id) }} aria-current={now ? 'step' : undefined}
                className={cx('flex min-h-[44px] items-center gap-2 rounded-lg border p-2.5 hover:border-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600',
                  now ? 'border-sky-600 bg-white shadow-sm' : done ? 'border-sky-200 bg-white' : 'border-slate-200 bg-slate-50/70')}>
                <span aria-hidden="true" className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums',
                  now ? 'bg-sky-600 text-white' : done ? 'border border-sky-300 bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-600')}>
                  {done && !now ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="min-w-0">
                  <span className={cx('block text-[11px] sm:truncate', now ? 'font-bold text-[#0b2545]' : done ? 'font-bold text-slate-800' : 'font-medium text-slate-700')}>{s.label}{done && <span className="sr-only"> (complete)</span>}</span>
                  <span className={cx('block text-[10px] sm:truncate', now ? 'font-medium text-sky-700' : done ? 'font-medium text-slate-600' : 'text-slate-500')}>{sub}</span>
                </span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
