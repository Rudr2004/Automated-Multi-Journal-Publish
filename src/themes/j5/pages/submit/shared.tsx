// Shared bits of the Journal 5 (IJFRD) submission form: section props, lettered section card, field wrapper, inputs and error grouping.
import { cloneElement, isValidElement, useId, type Dispatch, type ReactElement, type ReactNode, type SetStateAction } from 'react'
import type { FormErrors, SubmissionForm } from '../../../../core/lib/submission'
import { cx } from '../../components/primitives'

export interface SectionProps {
  form: SubmissionForm
  errors: FormErrors
  setForm: Dispatch<SetStateAction<SubmissionForm>>
}

/** The four steps shown in the step tiles; `review` is the summary and final bar. */
export const SECTIONS = [
  { id: 'details', label: 'Manuscript Details', hint: 'Title, Abstract & Scope' },
  { id: 'authors', label: 'Authors & Mentor', hint: 'Lead & Co-Author Data' },
  { id: 'files', label: 'Manuscript Upload', hint: 'Word File & Notes' },
  { id: 'declarations', label: 'Ethics & Referral', hint: 'Declarations & Referral Code' },
  { id: 'review', label: 'Review and submit', hint: 'Check, then send' },
] as const
export type SectionId = (typeof SECTIONS)[number]['id']

/** Which validation keys belong to which section (keys match the name attribute of each control). */
export const sectionOf = (key: string): SectionId => {
  if (['title', 'abstract', 'keywords', 'articleType', 'subject'].includes(key)) return 'details'
  if (key.startsWith('author.') || key.startsWith('co.') || key === 'mentor') return 'authors'
  if (['file', 'coverLetter'].includes(key)) return 'files'
  return 'declarations'
}

export function errorCounts(errors: FormErrors): Record<SectionId, number> {
  const out: Record<SectionId, number> = { details: 0, authors: 0, files: 0, declarations: 0, review: 0 }
  Object.keys(errors).forEach((k) => { out[sectionOf(k)]++ })
  return out
}

/** Input class from the reference: white fill, 8px radius, soft outline-variant border, primary focus ring. */
export const inp = (error?: string, extra?: string) =>
  cx('block min-h-[44px] w-full rounded-lg border bg-white px-3.5 py-2.5 font-serif4 text-[15px] leading-6 text-[#141B2B] shadow-sm placeholder:text-[#564241]/70 transition-colors focus-visible:outline-none focus-visible:ring-2',
    error ? 'border-red-700 bg-red-50 focus-visible:ring-red-700/30' : 'border-[#DCC0BE] hover:border-[#897270] focus-visible:border-wine-800 focus-visible:ring-wine-800/40', extra)

/** Label, hint, error and counter around one control (reference label: Work Sans, semibold, small tracking). */
export function Fld({ label, name, required, optional, error, hint, counter, children, className, icon, after }: {
  label: string; name: string; required?: boolean; optional?: boolean; error?: string; hint?: ReactNode; counter?: string; children: ReactElement<Record<string, unknown>>; className?: string; icon?: ReactNode; after?: ReactNode
}) {
  const uid = useId()
  const id = `${uid}-c`, hintId = `${uid}-h`, errId = `${uid}-e`
  const described = [hint ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-3">
        <label htmlFor={id} className="font-work text-[13px] font-semibold tracking-[0.02em] text-[#141B2B]">
          {label}{required && <span className="text-red-700" aria-hidden="true"> *</span>}{optional && <span className="font-normal text-[#564241]"> (Optional)</span>}
        </label>
        {counter && <span className="font-work text-xs tabular-nums text-[#564241]">{counter}</span>}
      </div>
      {(() => {
        const control = isValidElement(children) ? cloneElement(children, { id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': described, 'aria-required': required ? true : undefined }) : children
        if (!icon && !after) return control
        return <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start"><div className="relative min-w-0 flex-1">{icon}{control}</div>{after}</div>
      })()}
      {hint && <p id={hintId} className="font-work text-xs leading-[18px] text-[#564241]">{hint}</p>}
      {error && <p id={errId} role="alert" className="font-work text-[13px] font-semibold leading-snug text-red-700">{error}</p>}
    </div>
  )
}

/** Lettered section card: white 12px-radius card, lavender header bar with a round letter badge and a right-hand caption. */
export function Section({ letter, id, title, note, tone = 'primary', children }: { letter: string; id: string; title: string; note?: string; tone?: 'primary' | 'secondary'; children: ReactNode }) {
  return (
    <section id={`sec-${id}`} aria-labelledby={`sec-${id}-h`} className="flex scroll-mt-28 flex-col gap-6 rounded-xl border border-[#DCC0BE]/40 bg-white p-5 shadow-sm sm:p-8">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-lg bg-[#F1F3FF] px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-wine-900 font-work text-[11px] font-bold text-white">{letter}</span>
          <h2 id={`sec-${id}-h`} className="font-newsreader text-xl font-bold leading-7 text-wine-900">{title}</h2>
        </div>
        {note && <span className={cx('font-work text-xs', tone === 'secondary' ? 'font-bold text-ochre-700' : 'text-[#564241]')}>{note}</span>}
      </header>
      {children}
    </section>
  )
}

/** Declaration row from the reference: bare checkbox plus a bold lead-in; the whole row is the click target. */
export function Decl({ name, checked, onChange, error, children }: { name: string; checked: boolean; onChange: (v: boolean) => void; error?: string; children: ReactNode }) {
  const uid = useId()
  return (
    <div>
      <label htmlFor={uid} className={cx('flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg py-1.5 focus-within:ring-2 focus-within:ring-wine-800/30', error && 'bg-red-50 px-2')}>
        <input id={uid} name={name} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${uid}-e` : undefined}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded accent-wine-800" />
        <span className="font-serif4 text-[15px] leading-6 text-[#141B2B]">{children}</span>
      </label>
      {error && <p id={`${uid}-e`} role="alert" className="mt-1 pl-7 font-work text-[13px] font-semibold text-red-700">{error}</p>}
    </div>
  )
}

export const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
export const cleanEmail = (s: string) => s.replace(/\s/g, '')

/** Small action button in the reference's secondary look (lavender fill, primary text). */
export const softBtn = 'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#DCC0BE]/60 bg-[#E9EDFF] px-4 py-2.5 font-work text-[13px] font-bold text-wine-900 shadow-sm transition-colors hover:bg-[#E1E8FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-800 disabled:cursor-not-allowed disabled:opacity-60'
