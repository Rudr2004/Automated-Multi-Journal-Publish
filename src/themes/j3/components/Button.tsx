import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

export type Variant = 'primary' | 'inverted' | 'outline' | 'cta' | 'ghost' | 'light'
const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-jakarta text-sm font-bold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60'
const variants: Record<Variant, string> = {
  primary: 'bg-iris-700 text-white hover:bg-iris-800',
  inverted: 'bg-night-900 text-white hover:bg-night-700',
  outline: 'border-2 border-night-900 text-night-900 hover:bg-night-900 hover:text-white',
  // Tertiary orange. White text on #F26B3A is only 3.0:1, so orange buttons carry dark indigo text (5.8:1).
  cta: 'bg-ember-500 text-night-900 hover:bg-ember-400',
  ghost: 'text-iris-700 hover:bg-iris-100',
  light: 'bg-white text-iris-800 hover:bg-iris-50',
}
export const buttonClass = (variant: Variant = 'primary', className?: string) => cx(base, variants[variant], className)

export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...rest} />
}

export function ButtonLink({ to, variant = 'primary', className, children, ...rest }: { to: string; variant?: Variant; className?: string; children: ReactNode; 'aria-label'?: string }) {
  return <AppLink to={to} className={buttonClass(variant, className)} {...rest}>{children}</AppLink>
}
