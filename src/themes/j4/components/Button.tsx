import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

export type Variant = 'primary' | 'cta' | 'outline' | 'ghost' | 'onDark' | 'light'
const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-ctl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'
const variants: Record<Variant, string> = {
  primary: 'bg-abyss-900 text-white hover:bg-abyss-700',
  // Tertiary deep sky blue: the Submit Manuscript button (white on #0369A1 is 5.9:1).
  cta: 'bg-cobalt-700 text-white hover:bg-cobalt-800',
  outline: 'border border-abyss-300 bg-white text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700',
  ghost: 'text-cobalt-700 hover:bg-azure-50',
  onDark: 'border border-white/25 text-white hover:bg-white/10',
  light: 'bg-white text-abyss-900 hover:bg-azure-50',
}
export const buttonClass = (variant: Variant = 'primary', className?: string) => cx(base, variants[variant], className)

export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...rest} />
}

export function ButtonLink({ to, variant = 'primary', className, children, ...rest }: { to: string; variant?: Variant; className?: string; children: ReactNode; 'aria-label'?: string }) {
  return <AppLink to={to} className={buttonClass(variant, className)} {...rest}>{children}</AppLink>
}
