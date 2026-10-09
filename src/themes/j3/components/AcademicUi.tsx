// Academic Prestige building blocks used by the Board, Search, Verify and 404 pages: sharp corners, hairline rules, navy actions.
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

const btn = 'inline-flex items-center justify-center gap-2 whitespace-nowrap border px-6 py-3 font-inter text-xs font-semibold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-60'
const tones = {
  primary: 'border-iris-700 bg-iris-700 text-white hover:border-iris-600 hover:bg-iris-600',
  outline: 'border-iris-700 bg-transparent text-iris-700 hover:bg-iris-700 hover:text-white',
  amber: 'border-ember-700 bg-ember-700 text-white hover:bg-[#92400E]',
} as const
export type AcademicTone = keyof typeof tones
export const acBtn = (tone: AcademicTone = 'primary', className?: string) => cx(btn, tones[tone], className)

export function AcButton({ tone = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: AcademicTone }) {
  return <button type="button" className={acBtn(tone, className)} {...rest} />
}
export function AcLink({ to, tone = 'primary', className, children }: { to: string; tone?: AcademicTone; className?: string; children: ReactNode }) {
  return <AppLink to={to} className={acBtn(tone, className)}>{children}</AppLink>
}

/** Small uppercase metadata label. */
export const AcLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cx('font-inter text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600', className)}>{children}</p>
)

/** Section heading with a navy rule, as in the reference ("Executive editorial leadership"). */
export function AcSectionHead({ id, title, note }: { id?: string; title: string; note?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2 border-b-2 border-iris-700 pb-3">
      <h2 id={id} className="font-jakarta text-[1.5rem] font-semibold uppercase leading-tight tracking-[0.02em] text-iris-700 sm:text-[1.75rem]">{title}</h2>
      {note && <p className="font-inter text-sm text-mauve-600">{note}</p>}
    </div>
  )
}

/** Hairline-bordered panel on the paper colour. */
export const AcPanel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('border border-mauve-100 bg-white p-5 sm:p-6', className)}>{children}</div>
)

/** Rectangular tag (never a pill). */
export const AcTag = ({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'green' | 'amber' }) => (
  <span className={cx('inline-flex items-center gap-1 border px-2 py-0.5 font-inter text-xs font-semibold',
    tone === 'green' ? 'border-[#047857]/30 bg-[#ECFDF5] text-[#047857]' : tone === 'amber' ? 'border-ember-700/30 bg-[#FFF7ED] text-ember-700' : 'border-mauve-100 bg-[#F8FAFC] text-mauve-700')}>{children}</span>
)

export const acInput = 'block w-full border border-mauve-300 bg-white px-4 py-3 font-inter text-base text-night-700 placeholder:text-mauve-500 hover:border-iris-700 focus:border-iris-700 focus:ring-2 focus:ring-iris-700/25 focus-visible:!outline-none'
