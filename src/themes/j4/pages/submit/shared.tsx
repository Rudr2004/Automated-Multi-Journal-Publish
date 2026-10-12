// Shared bits of the Journal 4 submission form: section props, lettered section card (reference layout), compact fields and error grouping.
import { cloneElement, isValidElement, useId, type Dispatch, type ReactElement, type ReactNode, type SetStateAction } from 'react'
import type { FormErrors, SubmissionForm } from '../../../../core/lib/submission'
import { cx } from '../../components/primitives'

export interface SectionProps {
  form: SubmissionForm
  errors: FormErrors
  setForm: Dispatch<SetStateAction<SubmissionForm>>
}

/** Sections in page order. `review` is the action bar at the end; the stepper shows the first four. */
export const SECTIONS = [
  { id: 'details', label: 'Track & Metadata', hint: 'Subject and core details' },
  { id: 'authors', label: 'Research Team', hint: 'Authors & Mentors' },
  { id: 'files', label: 'Document Upload', hint: 'Manuscript & Data' },
  { id: 'declarations', label: 'Ethics & Declarations', hint: 'Originality & consent' },
  { id: 'referral', label: 'Referral Code', hint: 'Optional' },
  { id: 'review', label: 'Review and submit', hint: 'Check, then send' },
] as const
export type SectionId = (typeof SECTIONS)[number]['id']
export const STEPS = SECTIONS.slice(0, 4)

/** Which validation keys belong to which section (keys match the name attribute of each control). */
export const sectionOf = (key: string): SectionId => {
  if (['title', 'abstract', 'keywords', 'articleType', 'subject', 'branch'].includes(key)) return 'details'
  if (key.startsWith('author.') || key.startsWith('co.') || ['mentor', 'mentorEmail', 'mentorInstitution'].includes(key)) return 'authors'
  if (['file', 'coverLetter'].includes(key)) return 'files'
  if (key === 'referralCode') return 'referral'
  return 'declarations'
}

export function errorCounts(errors: FormErrors): Record<SectionId, number> {
  const out: Record<SectionId, number> = { details: 0, authors: 0, files: 0, declarations: 0, referral: 0, review: 0 }
  Object.keys(errors).forEach((k) => { out[sectionOf(k)]++ })
  return out
}

/** Reference card: white, 12px radius, lettered tile + serif title + subtitle, "Step n of 4" chip on the right. */
export function Section({ letter, id, title, titleNote, text, chip, chipTone = 'sky', children }: {
  letter: string; id: string; title: string; titleNote?: string; text?: string; chip?: ReactNode; chipTone?: 'sky' | 'slate' | 'emerald'; children: ReactNode
}) {
  const tone = { sky: 'border-sky-200 bg-sky-50 text-sky-700', slate: 'border-slate-200 bg-slate-100 text-slate-600', emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700' }[chipTone]
  return (
    <section id={`sec-${id}`} aria-labelledby={`sec-${id}-h`} className="scroll-mt-24 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <header className="flex flex-col justify-between gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-[#e0effe] text-xs font-bold text-sky-700">{letter}</span>
          <div>
            <h2 id={`sec-${id}-h`} className="font-serif4 text-base font-bold text-[#0b2545]">{title}{titleNote && <> <span className="font-work text-xs font-normal text-slate-500">{titleNote}</span></>}</h2>
            {text && <p className="text-[11px] text-slate-500">{text}</p>}
          </div>
        </div>
        {chip && <span className={cx('hidden shrink-0 self-start rounded border px-2 py-0.5 font-mono text-[11px] sm:inline sm:self-auto', tone)}>{chip}</span>}
      </header>
      {children}
    </section>
  )
}

/** Compact control class from the reference (text-xs, 6px radius, sky focus border); full size on phones for touch and zoom safety. */
export const refInput = (error?: string, extra?: string) =>
  cx('block w-full min-h-[44px] rounded-md border bg-slate-50 px-3 py-2 text-base text-slate-800 placeholder:text-slate-400 transition-colors focus:bg-white focus:outline-none focus-visible:ring-2 sm:min-h-0 sm:py-1.5 sm:text-xs',
    error ? 'border-red-700 bg-red-50 focus:border-red-700 focus-visible:ring-red-700/30' : 'border-slate-300 focus:border-sky-600 focus-visible:ring-sky-600/30', extra)

/** Label, hint and error around one control, in the reference's 11px label style. */
export function RField({ label, name, required, optional, error, hint, counter, icon, className, children }: {
  label: ReactNode; name: string; required?: boolean; optional?: boolean; error?: string; hint?: ReactNode; counter?: string; icon?: ReactNode; className?: string; children: ReactElement<Record<string, unknown>>
}) {
  const uid = useId()
  const id = `${uid}-c`, hintId = `${uid}-h`, errId = `${uid}-e`
  const described = [hint ? hintId : '', error ? errId : ''].filter(Boolean).join(' ') || undefined
  return (
    <div className={className}>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label htmlFor={id} className="flex items-center gap-1 text-xs font-semibold text-slate-700">
          {icon}{label}{required && <span className="text-red-600" aria-hidden="true"> *</span>}{optional && <span className="font-normal text-slate-500"> (Optional)</span>}
        </label>
        {counter && <span className="shrink-0 whitespace-nowrap font-mono text-[11px] text-slate-500">{counter}</span>}
      </div>
      {isValidElement(children) ? cloneElement(children, { id, name, 'aria-invalid': error ? true : undefined, 'aria-describedby': described, 'aria-required': required ? true : undefined }) : children}
      {hint && <p id={hintId} className="mt-1.5 text-[11px] italic text-slate-500">{hint}</p>}
      {error && <p id={errId} role="alert" className="mt-1.5 text-xs font-semibold text-red-700">{error}</p>}
    </div>
  )
}

export const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
export const cleanEmail = (s: string) => s.replace(/\s/g, '')

export const Sub = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={cx('font-serif4 text-base font-semibold text-[#0b2545]', className)}>{children}</h3>
)
