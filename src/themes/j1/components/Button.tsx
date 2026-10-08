import { Loader2 } from './uiIcons'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'

// Variants follow the design system: Primary, Secondary (tinted), Inverted, Outlined.
// 'submit' (Tertiary orange) is reserved for the main "Submit Manuscript" call to action.
export type ButtonVariant = 'submit' | 'primary' | 'secondary' | 'inverted' | 'outline' | 'outline-light' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

const variants: Record<ButtonVariant, string> = {
  submit: 'bg-gold text-navy-900 shadow-sm shadow-gold/30 hover:bg-gold-dark hover:text-white',
  primary: 'bg-navy text-white shadow-sm hover:bg-navy-900',
  secondary: 'bg-mist-200 text-navy hover:bg-navy-100',
  inverted: 'bg-ink text-white hover:bg-navy-900',
  outline: 'border border-navy/70 bg-white text-navy hover:bg-navy-50',
  'outline-light': 'border border-white/60 text-white hover:bg-white/10',
  ghost: 'text-navy hover:bg-navy-50',
}
const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export const btnClass = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', extra = '') =>
  `inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`

interface Common { variant?: ButtonVariant; size?: ButtonSize; className?: string; children: ReactNode }

/** `loading` shows a spinner and blocks clicks, so slow actions never look frozen or get double-submitted. */
export function Button({ variant, size, className = '', children, loading = false, disabled, ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button type="button" className={btnClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  )
}

export function ButtonLink({ to, variant, size, className = '', children }: Common & { to: string }) {
  return <AppLink to={to} className={btnClass(variant, size, className)}>{children}</AppLink>
}
