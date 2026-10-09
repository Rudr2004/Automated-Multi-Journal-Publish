// Submission page header: dark bordeaux band with reassurance tiles, and the horizontal step tracker above the form.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { ClassicHeader } from '../../components/ClassicHeader'
import { cx } from '../../components/primitives'
import { Check, Email, FactCheck, History, Payments } from '../../icons'
import { SECTIONS, type SectionId } from './shared'

const TILES = [
  { icon: Check, title: 'No account needed', text: 'Submit with your email address only.' },
  { icon: Payments, title: 'Free until acceptance', text: 'No fee for submission or peer review.' },
  { icon: History, title: 'Draft saved on this device', text: 'Leave and come back; nothing is lost.' },
  { icon: Email, title: 'Paper ID in minutes', text: 'Sent by email, SMS and WhatsApp.' },
]

export function SubmitHeader() {
  return (
    <ClassicHeader id="submit-h" crumbs={[{ label: 'Submit manuscript' }]} kicker="Submit manuscript" title={<>Submit your paper to {journal.shortName}</>}
      intro="Five short sections, about ten minutes. No account is needed: you receive a Paper ID and track the paper with it."
      aside={<AppLink to={paths.track} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded border border-white/25 px-4 text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-400">Already submitted? Track My Paper</AppLink>}>
      <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3 rounded border border-ochre-300/30 bg-white/5 p-3.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-ochre-400 text-bordeaux-900"><Icon className="h-5 w-5" aria-hidden="true" /></span>
            <div className="min-w-0"><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-[13px] leading-snug text-bordeaux-200">{text}</p></div>
          </li>
        ))}
      </ul>
    </ClassicHeader>
  )
}

/** Five-step tracker: each step links to its section and shows complete / needs attention. */
export function StepTracker({ counts, onJump }: { counts: Record<SectionId, number>; onJump: (id: SectionId) => void }) {
  return (
    <nav aria-label="Submission steps" className="rounded border border-[#E6DCD0] bg-white p-3 ">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {SECTIONS.map((s, i) => {
          const ok = s.id !== 'review' && counts[s.id] === 0
          return (
            <li key={s.id}>
              <a href={`#sec-${s.id}`} onClick={(e) => { e.preventDefault(); onJump(s.id) }}
                className="flex min-h-[44px] items-center gap-2 rounded px-2 py-1.5 hover:bg-[#F4EEE6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">
                <span aria-hidden="true" className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded border text-xs font-semibold tabular-nums', ok ? 'border-wine-700 bg-wine-800 text-white' : 'border-obsidian-300 text-obsidian-600')}>
                  {ok ? <Check className="h-4 w-4" /> : i === SECTIONS.length - 1 ? <FactCheck className="h-4 w-4" /> : i + 1}
                </span>
                <span className="text-[13px] font-semibold leading-tight text-obsidian-900">{s.label}{ok && <span className="sr-only"> (complete)</span>}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
