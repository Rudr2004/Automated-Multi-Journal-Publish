// "Academic Editorial & Press" building blocks used by the Board, Search, Verify and 404 pages: 2px radius, 1px hairline rules, purple actions,
// Mist surfaces, and orange limited to small markers (8px squares), status tags and the one urgent call to action.
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

const btn = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[2px] border px-5 py-2.5 font-jakarta text-[0.8125rem] font-bold tracking-[0.01em] transition-colors disabled:cursor-not-allowed disabled:opacity-60'
const tones = {
  /** Primary: solid purple, hover #3B237D. */
  primary: 'border-iris-700 bg-iris-700 text-white hover:border-iris-800 hover:bg-iris-800',
  /** Secondary: hairline-ruled, Mist and a purple border on hover. */
  outline: 'border-j3paper-rule bg-white text-iris-700 hover:border-iris-700 hover:bg-j3paper-cool',
  /** Orange accent (the one urgent action on a page): dark plum text, because white on #F26B3A fails contrast. */
  ember: 'border-ember-500 bg-ember-500 text-night-900 hover:border-ember-600 hover:bg-ember-600',
} as const
export type AcademicTone = keyof typeof tones | 'amber'
export const acBtn = (tone: AcademicTone = 'primary', className?: string) => cx(btn, tones[tone === 'amber' ? 'ember' : tone], className)

export function AcButton({ tone = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: AcademicTone }) {
  return <button type="button" className={acBtn(tone, className)} {...rest} />
}
export function AcLink({ to, tone = 'primary', className, children }: { to: string; tone?: AcademicTone; className?: string; children: ReactNode }) {
  return <AppLink to={to} className={acBtn(tone, className)}>{children}</AppLink>
}

/** Small uppercase metadata label. */
export const AcLabel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cx('font-jakarta text-xs font-bold uppercase tracking-[0.08em] text-mauve-600', className)}>{children}</p>
)

/** The 8x8 orange square that marks a section head. */
export const AcMarker = ({ className }: { className?: string }) => <span aria-hidden="true" className={cx('inline-block h-2 w-2 shrink-0 bg-ember-500', className)} />

/** Section heading: orange square marker, uppercase tracked Plus Jakarta, hairline rule below. */
export function AcSectionHead({ id, title, note }: { id?: string; title: string; note?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-2 border-b border-j3paper-rule pb-2.5">
      <h2 id={id} className="flex items-center gap-2.5 font-jakarta text-[0.9375rem] font-bold uppercase leading-tight tracking-[0.06em] text-night-900">
        <AcMarker />{title}
      </h2>
      {note && <p className="font-inter text-sm text-mauve-600">{note}</p>}
    </div>
  )
}

/** Hairline-bordered panel on white. */
export const AcPanel = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cx('rounded-[2px] border border-j3paper-rule bg-white p-5 sm:p-6', className)}>{children}</div>
)

/** Rectangular tag (never a pill). Orange tags carry dark plum text. */
export const AcTag = ({ children, tone = 'plain' }: { children: ReactNode; tone?: 'plain' | 'green' | 'amber' | 'purple' }) => (
  <span className={cx('inline-flex items-center gap-1 rounded-[2px] border px-2 py-0.5 font-jakarta text-[0.6875rem] font-bold uppercase tracking-[0.06em]',
    tone === 'green' ? 'border-j3valid-700/30 bg-j3valid-50 text-j3valid-700'
      : tone === 'amber' ? 'border-ember-500 bg-ember-500 text-night-900'
        : tone === 'purple' ? 'border-iris-700 bg-iris-700 text-white'
          : 'border-j3paper-rule bg-j3paper-deep text-iris-700')}>{children}</span>
)

export const acInput = 'block w-full rounded-[2px] border border-j3paper-rule bg-j3paper-deep px-4 py-3 font-inter text-base text-night-900 placeholder:text-mauve-500 hover:border-iris-700 focus:border-iris-700 focus:bg-white focus:ring-2 focus:ring-iris-700/25 focus-visible:!outline-none'
