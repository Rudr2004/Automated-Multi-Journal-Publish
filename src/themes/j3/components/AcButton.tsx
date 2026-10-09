// "Academic Prestige" buttons and tags for the J3 Static, Submit and Track pages: sharp corners, 12px uppercase tracked labels, no shadows.
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

export type AcVariant = 'primary' | 'outline' | 'cta' | 'ghost' | 'light' | 'soft'
const base = 'inline-flex items-center justify-center gap-2 rounded-none px-5 py-2.5 font-inter text-xs font-bold uppercase tracking-[0.08em] transition-colors disabled:cursor-not-allowed disabled:opacity-50'
const variants: Record<AcVariant, string> = {
  primary: 'bg-iris-700 text-white hover:bg-iris-600',
  outline: 'border border-iris-700 bg-white text-iris-700 hover:bg-iris-700 hover:text-white disabled:hover:bg-white disabled:hover:text-iris-700',
  cta: 'bg-ember-700 text-white hover:bg-ember-800',
  ghost: 'text-iris-700 hover:bg-iris-100',
  light: 'bg-white text-iris-700 hover:bg-iris-50',
  soft: 'bg-iris-100 text-iris-700 hover:bg-iris-200',
}
export const acButtonClass = (variant: AcVariant = 'primary', className?: string) => cx(base, variants[variant], className)

export function AcButton({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: AcVariant }) {
  return <button type="button" className={acButtonClass(variant, className)} {...rest} />
}

export function AcButtonLink({ to, variant = 'primary', className, children, ...rest }: { to: string; variant?: AcVariant; className?: string; children: ReactNode; 'aria-label'?: string }) {
  return <AppLink to={to} className={acButtonClass(variant, className)} {...rest}>{children}</AppLink>
}

/** Square label (status, section number, format). */
export function AcTag({ children, tone = 'navy', icon, className }: { children: ReactNode; tone?: 'navy' | 'green' | 'amber' | 'plain' | 'dark'; icon?: ReactNode; className?: string }) {
  const tones = {
    navy: 'bg-iris-100 text-iris-700',
    green: 'bg-j3valid-50 text-j3valid-700',
    amber: 'bg-ember-50 text-ember-800',
    plain: 'bg-mauve-100 text-mauve-700',
    dark: 'bg-iris-700 text-white',
  }
  return <span className={cx('inline-flex items-center gap-1 rounded-none px-2 py-0.5 font-inter text-xs font-bold uppercase tracking-[0.08em]', tones[tone], className)}>{icon}{children}</span>
}

/** Small uppercase metadata label. */
export const AcKicker = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cx('font-inter text-xs font-bold uppercase tracking-[0.08em]', className)}>{children}</p>
)
