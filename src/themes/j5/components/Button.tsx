import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { AppLink } from '../../../core/router'
import { cx } from './primitives'

/**
 * Journal 5 button vocabulary.
 * primary = solid wine, secondary = light rose-lavender tint, inverted = dark slate, outlined = 1px border (wine on hover).
 * `cta` is the same wine primary (Submit Manuscript); `onDarkCta` is the ochre fill for dark bordeaux bands; `outline` is an alias of `outlined`.
 */
export type Variant = 'primary' | 'secondary' | 'inverted' | 'outlined' | 'outline' | 'cta' | 'onDarkCta' | 'ghost' | 'onDark' | 'light'
const base = 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded px-4 py-2.5 font-work text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60'
const outlined = 'border border-obsidian-300 bg-white text-obsidian-900 hover:border-wine-800 hover:text-wine-800'
const variants: Record<Variant, string> = {
  primary: 'bg-wine-800 text-white hover:bg-wine-900',
  cta: 'bg-wine-800 text-white hover:bg-wine-900',
  secondary: 'border border-[#E9D5DC] bg-[#F5E9EE] text-obsidian-900 hover:bg-[#EEDBE3]',
  inverted: 'bg-[#1F2937] text-white hover:bg-obsidian-900',
  outlined,
  outline: outlined,
  // Ochre fill with dark text (ochre-400 is a fill colour only): the Submit button on dark bordeaux bands.
  onDarkCta: 'bg-ochre-400 text-bordeaux-900 hover:bg-ochre-300',
  ghost: 'text-wine-800 hover:bg-wine-50',
  onDark: 'border border-white/30 text-white hover:bg-white/10',
  light: 'bg-white text-obsidian-900 hover:bg-wine-50',
}
export const buttonClass = (variant: Variant = 'primary', className?: string) => cx(base, variants[variant], className)

/** Small square icon chip button colours (wine / ochre / bordeaux / red). */
export const chipClass = (tone: 'wine' | 'ochre' | 'bordeaux' | 'red' = 'wine', className?: string) => cx(
  'inline-flex h-9 w-9 items-center justify-center rounded',
  { wine: 'bg-wine-800 text-white hover:bg-wine-900', ochre: 'bg-ochre-400 text-bordeaux-900 hover:bg-ochre-300', bordeaux: 'bg-bordeaux-900 text-white hover:bg-bordeaux-800', red: 'bg-red-700 text-white hover:bg-red-800' }[tone], className)

export function Button({ variant = 'primary', className, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={buttonClass(variant, className)} {...rest} />
}

export function ButtonLink({ to, variant = 'primary', className, children, ...rest }: { to: string; variant?: Variant; className?: string; children: ReactNode; 'aria-label'?: string }) {
  return <AppLink to={to} className={buttonClass(variant, className)} {...rest}>{children}</AppLink>
}
