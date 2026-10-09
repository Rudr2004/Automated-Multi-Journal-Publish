// Sticky progress checklist: a left rail on large screens, a compact progress bar on phones.
import { journal } from '../../../../config/journals'
import { Circle, CloudDone } from '../../components/pageIcons'
import { cx } from '../../components/primitives'
import { ABSTRACT_MAX_WORDS, ABSTRACT_MIN_WORDS, ACCEPTED_EXT, MAX_FILE_MB } from '../../../../core/lib/submission'
import { Check, FactCheck } from '../../icons'

export interface ChecklistItem { id: string; label: string; short: string; done: boolean }

const BEFORE: [string, string][] = [
  ['File format', `One Word file (${ACCEPTED_EXT.join(', ')}), up to ${MAX_FILE_MB} MB.`],
  ['Abstract', `${ABSTRACT_MIN_WORDS} to ${ABSTRACT_MAX_WORDS} words.`],
  ['Authorship', 'Every co-author has approved the manuscript.'],
  ['Originality', 'Not published, and not under review elsewhere.'],
]

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

export function AutosaveNote({ savedAt, className }: { savedAt: string | null; className?: string }) {
  return (
    <p role="status" className={cx('flex items-center gap-1.5 text-xs text-graphite-600', className)}>
      <CloudDone className="h-4 w-4 text-accent-700" aria-hidden="true" />
      {savedAt ? `Autosaved at ${timeOf(savedAt)}` : 'Drafts autosave on this device'}
    </p>
  )
}

export function Checklist({ items, active, onGo, savedAt }: { items: ChecklistItem[]; active: string; onGo: (id: string) => void; savedAt: string | null }) {
  const doneCount = items.filter((i) => i.done).length
  const pct = Math.round((doneCount / items.length) * 100)
  return (
    <>
      {/* Phones and tablets: compact bar pinned under the site header. */}
      <div className="sticky top-16 xl:top-[52px] z-30 -mx-4 border-b border-graphite-200 bg-white/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between gap-3 text-xs">
          <p className="font-semibold text-graphite-800">{doneCount} of {items.length} sections complete</p>
          <AutosaveNote savedAt={savedAt} />
        </div>
        <div role="progressbar" aria-label="Submission progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="mt-2 h-1.5 overflow-hidden rounded-full bg-graphite-200">
          <div className="h-full rounded-full bg-brand-600 transition-[width] motion-reduce:transition-none" style={{ width: `${pct}%` }} />
        </div>
        <nav aria-label="Form sections" className="mt-2 grid grid-cols-4 gap-1">
          {items.map((it) => (
            <button key={it.id} type="button" onClick={() => onGo(it.id)} aria-current={active === it.id ? 'step' : undefined}
              className={cx('flex min-w-0 items-center justify-center gap-1 rounded-chip px-1 py-1.5 text-[11px] font-semibold', active === it.id ? 'bg-accent-50 text-accent-800' : 'text-graphite-600')}>
              {it.done ? <Check className="h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" /> : <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
              <span className="truncate">{it.short}</span>{it.done && <span className="sr-only"> (complete)</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Large screens: sticky left rail. */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <nav aria-label="Form sections" className="rounded-sheet border border-graphite-200 bg-white p-5 shadow-card">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-800"><Check className="h-4 w-4" aria-hidden="true" />Your progress</h2>
              <span className="text-xs font-semibold tabular-nums text-accent-700">{doneCount}/{items.length}</span>
            </div>
            <div role="progressbar" aria-label="Submission progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} className="mb-3 h-1.5 overflow-hidden rounded-full bg-graphite-200">
              <div className="h-full rounded-full bg-brand-600 transition-[width] motion-reduce:transition-none" style={{ width: `${pct}%` }} />
            </div>
            <ol className="space-y-1">
              {items.map((it, i) => (
                <li key={it.id}>
                  <button type="button" onClick={() => onGo(it.id)} aria-current={active === it.id ? 'step' : undefined}
                    className={cx('flex w-full items-center gap-3 rounded-soft px-2.5 py-2 text-left text-sm font-medium transition-colors', active === it.id ? 'bg-accent-50 text-accent-800' : 'text-graphite-700 hover:bg-graphite-50')}>
                    <span aria-hidden="true" className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold', it.done ? 'bg-brand-800 text-white' : 'bg-graphite-100 text-graphite-700')}>
                      {it.done ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span>{it.label}{it.done && <span className="sr-only"> (complete)</span>}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="mt-3 border-t border-graphite-100 pt-3"><AutosaveNote savedAt={savedAt} /></div>
          </nav>
          <section aria-labelledby="before-h" className="rounded-sheet border border-graphite-200 bg-white p-5 shadow-card">
            <h2 id="before-h" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-800"><FactCheck className="h-4 w-4" aria-hidden="true" />Before you submit</h2>
            <ul className="mt-3 space-y-2 text-sm text-graphite-700">
              {BEFORE.map(([k, v]) => <li key={k} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" /><span><strong className="font-semibold text-graphite-800">{k}:</strong> {v}</span></li>)}
            </ul>
          </section>
          <div className="rounded-sheet border border-accent-200 bg-accent-50 p-5 text-sm text-graphite-700">
            <p className="font-display font-bold text-accent-900">Free to submit</p>
            <p className="mt-1">The article processing charge is payable only after acceptance. Questions? Email <a className="font-semibold text-accent-800 underline" href={`mailto:${journal.email}`}>{journal.email}</a> or WhatsApp {journal.whatsapp}.</p>
          </div>
        </div>
      </aside>
    </>
  )
}

/** Horizontal step tracker at the top of the form card (the sections are one scrolling page, so each step jumps to its section). */
export function Stepper({ items, active, onGo }: { items: ChecklistItem[]; active: string; onGo: (id: string) => void }) {
  return (
    <ol aria-label="Submission steps" className="grid grid-cols-4 gap-1">
      {items.map((it, i) => {
        const on = active === it.id
        return (
          <li key={it.id} className="relative flex justify-center">
            {i > 0 && <span aria-hidden="true" className={cx('absolute right-1/2 top-[18px] -z-0 h-0.5 w-full', items[i - 1].done ? 'bg-brand-700' : 'bg-graphite-200')} />}
            <button type="button" onClick={() => onGo(it.id)} aria-current={on ? 'step' : undefined}
              className="relative z-10 flex flex-col items-center gap-1.5 rounded-soft px-1 py-1 text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">
              <span aria-hidden="true" className={cx('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ring-4 ring-white',
                it.done ? 'bg-brand-800 text-white' : on ? 'bg-brand-800 text-white shadow-soft' : 'border border-graphite-300 bg-white text-graphite-600')}>
                {it.done ? <Check className="h-5 w-5" /> : i + 1}
              </span>
              <span className={cx('text-xs font-semibold sm:text-sm', on ? 'text-brand-800' : 'text-graphite-700')}>{it.short}{it.done && <span className="sr-only"> (complete)</span>}</span>
              <span aria-hidden="true" className={cx('hidden text-[11px] font-bold uppercase tracking-wider sm:block', it.done ? 'text-brand-700' : on ? 'text-accent-700' : 'text-graphite-500')}>{it.done ? 'Completed' : on ? 'Active' : 'Pending'}</span>
            </button>
          </li>
        )
      })}
    </ol>
  )
}
