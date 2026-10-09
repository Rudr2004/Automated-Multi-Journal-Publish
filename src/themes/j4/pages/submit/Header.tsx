// Submission page header: dark blueprint band with reassurance tiles, and the horizontal step tracker above the form.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { Container, cx, Label } from '../../components/primitives'
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
    <section aria-labelledby="submit-h" className="relative isolate bg-abyss-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_75%)]" />
      <Container className="py-8 sm:py-12">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 text-sm text-abyss-300">
            <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-white">Submit manuscript</li>
          </ol>
        </nav>
        <div className="mt-5 grid items-end gap-6 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <Label className="text-azure-300">Submit manuscript</Label>
            <h1 id="submit-h" className="mt-2 max-w-3xl font-serif4 font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(32px,3.6vw,50px)' }}>Submit your paper to {journal.shortName}</h1>
            <p className="mt-3 max-w-2xl text-base text-abyss-200 sm:text-[1.0625rem]">Five short sections, about ten minutes. No account is needed: you receive a Paper ID and track the paper with it.</p>
          </div>
          <AppLink to={paths.track} className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-ctl border border-white/25 px-4 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-400">Already submitted? Track My Paper</AppLink>
        </div>
        <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TILES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-3 rounded-pane border border-white/15 bg-white/5 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-ctl bg-white text-cobalt-700"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div className="min-w-0"><p className="text-sm font-semibold">{title}</p><p className="mt-0.5 text-[13px] leading-snug text-abyss-200">{text}</p></div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

/** Five-step tracker: each step links to its section and shows complete / needs attention. */
export function StepTracker({ counts, onJump }: { counts: Record<SectionId, number>; onJump: (id: SectionId) => void }) {
  return (
    <nav aria-label="Submission steps" className="rounded-pane border border-abyss-200 bg-white p-3 shadow-hair">
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {SECTIONS.map((s, i) => {
          const ok = s.id !== 'review' && counts[s.id] === 0
          return (
            <li key={s.id}>
              <a href={`#sec-${s.id}`} onClick={(e) => { e.preventDefault(); onJump(s.id) }}
                className="flex min-h-[44px] items-center gap-2 rounded-ctl px-2 py-1.5 hover:bg-abyss-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600">
                <span aria-hidden="true" className={cx('flex h-7 w-7 shrink-0 items-center justify-center rounded-ctl border text-xs font-semibold tabular-nums', ok ? 'border-cobalt-700 bg-cobalt-700 text-white' : 'border-abyss-300 text-steel-600')}>
                  {ok ? <Check className="h-4 w-4" /> : i === SECTIONS.length - 1 ? <FactCheck className="h-4 w-4" /> : i + 1}
                </span>
                <span className="text-[13px] font-semibold leading-tight text-abyss-900">{s.label}{ok && <span className="sr-only"> (complete)</span>}</span>
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
