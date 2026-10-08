// Small building blocks shared by every Journal 2 page. Design only: no data loading here.
import type { ReactNode } from 'react'
import { ErrorIcon, Refresh } from '../icons'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Page width and side gutters (16px on phones). */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-site px-4 sm:px-6 lg:px-8', className)}>{children}</div>
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cx('animate-pulse rounded-soft bg-graphite-200/70', className)} />
)

export function ErrorState({ message = 'Something went wrong while loading this page.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-panel border border-graphite-200 bg-white p-8 text-center shadow-card">
      <ErrorIcon className="mx-auto h-9 w-9 text-cta-700" aria-hidden="true" />
      <p className="mt-3 font-display text-lg font-semibold text-graphite-800">Couldn’t load this</p>
      <p className="mt-1 text-sm text-graphite-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-soft border border-accent-700 px-4 py-2 text-sm font-semibold text-accent-700 hover:bg-accent-50">
          <Refresh className="h-4 w-4" aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-panel border border-dashed border-graphite-300 bg-white p-10 text-center">
      <p className="font-display text-lg font-semibold text-graphite-800">{title}</p>
      {text && <p className="mt-1 text-sm text-graphite-600">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Small label chip. `tone` picks the colour family; text always passes 4.5:1 on its tint. */
export function Tag({ children, tone = 'accent', icon }: { children: ReactNode; tone?: 'accent' | 'brand' | 'neutral'; icon?: ReactNode }) {
  const tones = {
    accent: 'bg-accent-50 text-accent-800 ring-accent-200',
    brand: 'bg-brand-50 text-brand-800 ring-brand-200',
    neutral: 'bg-graphite-100 text-graphite-700 ring-graphite-200',
  }
  return <span className={cx('inline-flex items-center gap-1 rounded-chip px-2 py-0.5 text-xs font-medium ring-1 ring-inset', tones[tone])}>{icon}{children}</span>
}

export function SectionHeading({ eyebrow, title, text, action, id }: { eyebrow?: string; title: string; text?: string; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
      <div className="max-w-3xl">
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">{eyebrow}</p>}
        <h2 id={id} className="mt-1 font-display text-2xl font-bold tracking-tight text-graphite-800 sm:text-3xl">{title}</h2>
        {text && <p className="mt-2 text-base text-graphite-600">{text}</p>}
      </div>
      {action}
    </div>
  )
}
