import { AlertTriangle, Inbox } from './uiIcons'
import type { ReactNode } from 'react'
import { Button } from './Button'
import { AppLink } from '../../../core/router'
import { TrustIcon } from './icons'

export const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>
)

// Badge tones follow the design system: Open Access = orange tint, Peer Reviewed / article type = blue tint,
// index tags = warm paper (uppercase, small). `success` is for confirmations only.
type BadgeTone = 'open' | 'blue' | 'index' | 'success' | 'oa' | 'navy' | 'neutral'
const tones: Record<BadgeTone, string> = {
  open: 'bg-gold-soft text-gold-dark',
  blue: 'border border-[#C4D9EE] bg-scholar-soft text-scholar',
  index: 'bg-paper text-ink-muted uppercase tracking-wide text-[11px] border border-line',
  success: 'bg-oa-soft text-oa',
  oa: 'bg-oa-soft text-oa',
  navy: 'bg-scholar-soft text-scholar',
  neutral: 'bg-mist-200 text-ink-muted',
}
export const Badge = ({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) => (
  <span className={`inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-semibold ${tones[tone]}`}>{children}</span>
)

export function SectionHeader({ title, subtitle, eyebrow, href, linkLabel = 'View all', id, centered = false }: {
  title: string; subtitle?: string; eyebrow?: string; href?: string; linkLabel?: string; id?: string
  /** Centre the heading block (for stand-alone sections like testimonials). */
  centered?: boolean
}) {
  return (
    <div className={`mb-7 flex flex-wrap items-end gap-3 ${centered ? 'justify-center text-center' : 'justify-between'}`}>
      <div className={centered ? 'flex flex-col items-center' : undefined}>
        {eyebrow && (
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-navy-500">
            <span aria-hidden className="h-0.5 w-6 rounded bg-navy-500" />{eyebrow}
          </p>
        )}
        <h2 id={id} className="font-serif text-2xl font-semibold text-navy sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1.5 max-w-2xl text-ink-muted">{subtitle}</p>}
      </div>
      {href && (
        <AppLink to={href} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-semibold text-navy-500 hover:bg-navy-50">{linkLabel} →</AppLink>
      )}
    </div>
  )
}

/** Full-width tinted band that gives long pages visual rhythm. */
export const Band = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`mt-16 border-y border-line bg-mist py-14 ${className}`}>{children}</div>
)

export const StatBlock = ({ label, value, tone = 'light' }: { label: string; value: string; tone?: 'light' | 'dark' }) => (
  <div>
    <div className={`font-serif text-3xl font-semibold ${tone === 'dark' ? 'text-white' : 'text-navy'}`}>{value}</div>
    <div className={`mt-1 text-xs uppercase tracking-wide ${tone === 'dark' ? 'text-navy-200' : 'text-ink-muted'}`}>{label}</div>
  </div>
)

export const TrustBadge = ({ label, icon }: { label: string; icon: string }) => (
  <div className="flex items-center gap-3">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy">
      <TrustIcon name={icon} className="h-5 w-5" aria-hidden />
    </span>
    <span className="text-sm font-medium text-ink">{label}</span>
  </div>
)

export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div aria-hidden className={`animate-pulse rounded bg-mist-200 ${className}`} />
)

export const EmptyState = ({ title, hint }: { title: string; hint?: string }) => (
  <div className="rounded-card border border-dashed border-line bg-mist p-10 text-center">
    <Inbox className="mx-auto h-8 w-8 text-ink-muted" aria-hidden />
    <p className="mt-3 font-semibold text-ink">{title}</p>
    {hint && <p className="mt-1 text-sm text-ink-muted">{hint}</p>}
  </div>
)

export const ErrorState = ({ message = 'Something went wrong while loading this section.', onRetry }: { message?: string; onRetry?: () => void }) => (
  <div role="alert" className="rounded-card border border-danger/30 bg-red-50 p-8 text-center">
    <AlertTriangle className="mx-auto h-8 w-8 text-danger" aria-hidden />
    <p className="mt-3 font-semibold text-ink">{message}</p>
    {onRetry && <Button className="mt-4" variant="outline" onClick={onRetry}>Try again</Button>}
  </div>
)

/** Flat bordered panel used in sidebars and portal sections: serif title, optional side label, hairline rule. */
export function Panel({ title, aside, children, className = '', tone = 'white' }: {
  title: string; aside?: ReactNode; children: ReactNode; className?: string; tone?: 'white' | 'paper'
}) {
  return (
    <section className={`border border-line ${tone === 'paper' ? 'bg-paper' : 'bg-white'} ${className}`}>
      <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
        <h3 className="font-serif text-[1.0625rem] font-semibold leading-snug text-navy">{title}</h3>
        {aside && <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{aside}</span>}
      </header>
      <div className="p-4">{children}</div>
    </section>
  )
}

/** "LIVE" status tag with a softly pulsing dot (the pulse stops for visitors who prefer reduced motion). */
export const LiveBadge = ({ label = 'Live' }: { label?: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#F2C4C1] bg-[#FDECEA] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-danger">
    <span aria-hidden className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-danger opacity-60 motion-reduce:animate-none" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
    </span>
    {label}
  </span>
)
