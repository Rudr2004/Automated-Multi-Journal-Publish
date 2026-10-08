// Shared bits of the Journal 4 submission form: section props, numbered section shell and error grouping.
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { FormErrors, SubmissionForm } from '../../../../core/lib/submission'
import { cx } from '../../components/primitives'

export interface SectionProps {
  form: SubmissionForm
  errors: FormErrors
  setForm: Dispatch<SetStateAction<SubmissionForm>>
}

export const SECTIONS = [
  { id: 'details', label: 'Article details', hint: 'Title, type, area, abstract, keywords' },
  { id: 'authors', label: 'Authors', hint: 'Corresponding author and co-authors' },
  { id: 'files', label: 'Manuscript file', hint: 'Word file and optional notes' },
  { id: 'declarations', label: 'Declarations', hint: 'Originality and consent' },
  { id: 'review', label: 'Review and submit', hint: 'Check, then send' },
] as const
export type SectionId = (typeof SECTIONS)[number]['id']

/** Which validation keys belong to which section (keys match the name attribute of each control). */
export const sectionOf = (key: string): SectionId => {
  if (['title', 'abstract', 'keywords', 'articleType', 'subject'].includes(key)) return 'details'
  if (key.startsWith('author.') || key.startsWith('co.')) return 'authors'
  if (['file', 'mentor', 'referralCode', 'coverLetter'].includes(key)) return 'files'
  return 'declarations'
}

export function errorCounts(errors: FormErrors): Record<SectionId, number> {
  const out: Record<SectionId, number> = { details: 0, authors: 0, files: 0, declarations: 0, review: 0 }
  Object.keys(errors).forEach((k) => { out[sectionOf(k)]++ })
  return out
}

export function Section({ n, id, title, text, children }: { n: number; id: string; title: string; text?: string; children: ReactNode }) {
  return (
    <section id={`sec-${id}`} aria-labelledby={`sec-${id}-h`} className="scroll-mt-24 rounded-pane border border-abyss-200 bg-white shadow-hair">
      <header className="flex items-start gap-4 border-b border-abyss-200 bg-abyss-50 px-5 py-4 sm:px-7">
        <span aria-hidden="true" className="flex h-9 min-w-9 items-center justify-center rounded-ctl bg-abyss-900 px-2 text-sm font-semibold tabular-nums text-white">{String(n).padStart(2, '0')}</span>
        <div>
          <h2 id={`sec-${id}-h`} className="font-serif4 text-[1.375rem] font-semibold leading-tight text-abyss-900">{title}</h2>
          {text && <p className="mt-1 text-sm text-steel-600">{text}</p>}
        </div>
      </header>
      <div className="space-y-6 p-5 sm:p-7">{children}</div>
    </section>
  )
}

export const cleanName = (s: string) => s.replace(/[^\p{L}\s.'’-]/gu, '').replace(/\s{2,}/g, ' ')
export const cleanEmail = (s: string) => s.replace(/\s/g, '')

export const Sub = ({ children, className }: { children: ReactNode; className?: string }) => (
  <h3 className={cx('font-serif4 text-lg font-semibold text-abyss-900', className)}>{children}</h3>
)
