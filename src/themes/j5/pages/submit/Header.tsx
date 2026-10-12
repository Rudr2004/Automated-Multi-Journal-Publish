// Submission page head: breadcrumb, then the title card with reassurance chips and the four step tiles (each jumps to its section).
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { cx } from '../../components/primitives'
import { Chevron, LockOpen, Paid, VerifiedI, Tick } from './mi'
import { SECTIONS, type SectionId } from './shared'

export function SubmitHeader({ counts, onJump, savedLabel }: { counts: Record<SectionId, number>; onJump: (id: SectionId) => void; savedLabel: string }) {
  const steps = SECTIONS.filter((s) => s.id !== 'review')
  const firstOpen = steps.findIndex((s) => counts[s.id] > 0)
  return (
    <div className="flex flex-col gap-4">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2 font-work text-xs text-[#564241]">
          <li><AppLink to={paths.home} className="transition-colors hover:text-wine-900">Home</AppLink></li>
          <li aria-hidden="true"><Chevron className="h-4 w-4 text-[#DCC0BE]" /></li>
          <li><AppLink to={paths.policy('author-guidelines')} className="transition-colors hover:text-wine-900">For Authors</AppLink></li>
          <li aria-hidden="true"><Chevron className="h-4 w-4 text-[#DCC0BE]" /></li>
          <li aria-current="page" className="font-semibold text-wine-900">Submit Manuscript</li>
        </ol>
      </nav>

      <div className="flex flex-col gap-5 rounded-xl border border-[#DCC0BE]/40 bg-white p-5 shadow-sm sm:p-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div className="flex max-w-2xl flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded border border-wine-800/20 bg-wine-800/10 px-2.5 py-0.5 font-work text-[11px] font-bold uppercase tracking-wider text-wine-900">
              <VerifiedI className="h-3.5 w-3.5" aria-hidden="true" />Scholarly workflow · {journal.shortName}
            </span>
            <h1 className="font-newsreader text-2xl font-bold leading-tight tracking-tight text-wine-900 sm:text-3xl">Online Manuscript Submission Portal</h1>
            <p className="font-serif4 text-sm leading-relaxed text-[#564241]">No account needed. Structured peer review, written decision reasons and a permanent Crossref DOI (10.55041) for every published article.</p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 lg:flex-col">
            <span className="flex items-center gap-1.5 rounded border border-ochre-200 bg-ochre-100 px-2.5 py-1 font-work text-xs font-bold text-ochre-800">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-ochre-700" />Volume 1 Submissions Open
            </span>
            <span className="flex items-center gap-1.5 rounded border border-ochre-700/30 bg-[#FFDBCA]/50 px-2.5 py-1 font-work text-xs font-semibold text-[#331200]">
              <LockOpen className="h-4 w-4 text-ochre-700" aria-hidden="true" />Open Access ({journal.licence.name})
            </span>
            <span className="flex items-center gap-1.5 rounded border border-[#DCC0BE]/40 bg-[#E9EDFF] px-2.5 py-1 font-work text-xs font-semibold text-wine-900">
              <Paid className="h-4 w-4" aria-hidden="true" />No Fee Until Acceptance
            </span>
          </div>
        </div>

        <nav aria-label="Submission steps" className="border-t border-[#DCC0BE]/30 pt-3">
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const ok = counts[s.id] === 0
              const active = firstOpen === i || (firstOpen === -1 && i === 0)
              return (
                <li key={s.id}>
                  <a href={`#sec-${s.id}`} onClick={(e) => { e.preventDefault(); onJump(s.id) }} aria-current={active ? 'step' : undefined}
                    className={cx('flex min-h-[44px] items-center gap-2.5 rounded-lg border p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800',
                      active ? 'border-wine-800/30 bg-wine-800/10' : 'border-[#DCC0BE]/30 bg-[#F1F3FF] hover:bg-[#E9EDFF]')}>
                    <span aria-hidden="true" className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-work text-xs font-bold',
                      active || ok ? 'bg-wine-900 text-white' : 'bg-[#E1E8FD] text-[#141B2B]')}>{ok ? <Tick className="h-4 w-4" /> : i + 1}</span>
                    <span className="flex min-w-0 flex-col">
                      <span className={cx('truncate font-work text-xs text-[#141B2B]', active ? 'font-bold text-wine-900' : 'font-semibold')}>{s.label}{ok && <span className="sr-only"> (complete)</span>}</span>
                      <span className="truncate font-work text-[11px] text-[#564241]">{ok ? 'Complete' : s.hint}</span>
                    </span>
                  </a>
                </li>
              )
            })}
          </ol>
          <p className="mt-3 font-work text-xs text-[#564241]" aria-live="polite">{savedLabel}</p>
        </nav>
      </div>
    </div>
  )
}
