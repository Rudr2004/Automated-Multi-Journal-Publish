import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

export type Variant = 'primary' | 'secondary' | 'outline' | 'cta' | 'ghost' | 'onDark'
const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-soft px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'
const variants: Record<Variant, string> = {
  primary: 'bg-brand-800 text-white hover:bg-brand-900',
  secondary: 'bg-accent-700 text-white hover:bg-accent-800',
  outline: 'border border-accent-700 bg-white text-accent-700 hover:bg-accent-50',
  // Tertiary amber. The background is amber-700 (5.0:1 with white); amber-600 would only reach 3.2:1.
  cta: 'bg-cta-700 text-white shadow-card hover:bg-cta-800',
  ghost: 'text-accent-700 hover:bg-accent-50',
  onDark: 'border border-white/40 text-white hover:bg-white/10',
}
export const buttonClass = (variant: Variant = 'primary', className?: string) => cx(base, variants[variant], className)

export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...rest} />
}

export function ButtonLink({ to, variant = 'primary', className, children, ...rest }: { to: string; variant?: Variant; className?: string; children: ReactNode; 'aria-label'?: string }) {
  return <AppLink to={to} className={buttonClass(variant, className)} {...rest}>{children}</AppLink>
}
