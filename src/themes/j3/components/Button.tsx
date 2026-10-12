import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

export type Variant = 'primary' | 'inverted' | 'outline' | 'cta' | 'ghost' | 'light'
const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-tile px-5 py-2.5 font-jakarta text-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60'
const variants: Record<Variant, string> = {
  primary: 'bg-iris-700 text-white hover:bg-iris-800',
  inverted: 'bg-night-900 text-white hover:bg-night-800',
  outline: 'border border-j3paper-rule bg-white text-night-900 hover:border-iris-700 hover:bg-j3paper-cool',
  // Tertiary orange. White text on #F26B3A is only 3.0:1, so orange buttons carry dark indigo text (5.8:1).
  cta: 'bg-ember-500 text-night-900 hover:bg-ember-400',
  ghost: 'text-iris-700 underline decoration-j3paper-rule underline-offset-4 hover:bg-j3paper-cool hover:decoration-iris-700',
  light: 'bg-white text-iris-800 hover:bg-j3paper-cool',
}
export const buttonClass = (variant: Variant = 'primary', className?: string) => cx(base, variants[variant], className)

export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...rest} />
}

export function ButtonLink({ to, variant = 'primary', className, children, ...rest }: { to: string; variant?: Variant; className?: string; children: ReactNode; 'aria-label'?: string }) {
  return <AppLink to={to} className={buttonClass(variant, className)} {...rest}>{children}</AppLink>
}
