// Small building blocks shared by every Journal 4 page. Design only: no data loading here.
import type { HTMLAttributes, ReactNode } from 'react'
import { ErrorIcon, Refresh } from '../icons'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Page width and side gutters: 1280px wide with 16px gutters, as in the reference (max-w-7xl, px-4). */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-7xl px-4', className)}>{children}</div>
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cx('animate-pulse rounded-pane bg-abyss-200/70', className)} />
)

export function ErrorState({ message = 'Something went wrong while loading this page.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-pane border border-abyss-200 bg-white p-8 text-center shadow-hair">
      <ErrorIcon className="mx-auto h-9 w-9 text-red-700" aria-hidden="true" />
      <p className="mt-3 font-serif4 text-xl font-semibold text-abyss-900">Couldn’t load this</p>
      <p className="mt-1 text-sm text-steel-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-ctl border border-cobalt-700 px-4 py-2 text-sm font-semibold text-cobalt-700 hover:bg-azure-50">
          <Refresh className="h-4 w-4" aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-pane border border-dashed border-abyss-300 bg-abyss-50 p-10 text-center">
      <p className="font-serif4 text-lg font-semibold text-abyss-900">{title}</p>
      {text && <p className="mt-1 text-sm text-steel-600">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Short uppercase label (2 to 4 words, tracking at most 0.08em). */
export const Label = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cx('text-xs font-semibold uppercase tracking-[0.08em]', className)}>{children}</p>
)

/** Small outlined tag. */
export function Tag({ children, tone = 'plain', icon }: { children: ReactNode; tone?: 'plain' | 'azure' | 'dark'; icon?: ReactNode }) {
  const tones = {
    plain: 'border-abyss-200 bg-white text-steel-700',
    azure: 'border-azure-200 bg-azure-50 text-azure-800',
    dark: 'border-white/15 bg-white/5 text-abyss-100',
  }
  return <span className={cx('inline-flex items-center gap-1.5 rounded-ctl border px-2.5 py-1 text-xs font-medium', tones[tone])}>{icon}{children}</span>
}

/** Section heading: an uppercase label, a serif title and an optional right-hand action. */
export function SectionHead({ label, title, text, action, id }: { label?: string; title: string; text?: string; action?: ReactNode; id?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        {label && <Label className="text-cobalt-700">{label}</Label>}
        <h2 id={id} className="mt-2 font-serif4 text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-abyss-900 sm:text-[2.125rem]">{title}</h2>
        {text && <p className="mt-2 text-base text-steel-600">{text}</p>}
      </div>
      {action}
    </div>
  )
}

/** Hairline-bordered white card with a micro shadow (Academic Editorial Modern). `lift` adds the sky hover border. */
export function Card({ className, lift, children, ...rest }: { className?: string; lift?: boolean; children: ReactNode } & Omit<HTMLAttributes<HTMLElement>, 'className' | 'children'>) {
  return <section {...rest} className={cx('rounded-pane border border-abyss-200 bg-white shadow-hair', lift && 'transition duration-150 hover:-translate-y-px hover:border-azure-600 hover:shadow-panel motion-reduce:transition-none motion-reduce:hover:translate-y-0', className)}>{children}</section>
}

/** Card heading: serif title with an optional sky icon and a right-hand chip or link, over a hairline. */
export function CardHead({ title, id, icon, aside, text, className }: { title: string; id?: string; icon?: ReactNode; aside?: ReactNode; text?: string; className?: string }) {
  return (
    <div className={cx('flex flex-wrap items-start justify-between gap-x-3 gap-y-2 border-b border-abyss-100 pb-4', className)}>
      <div className="min-w-0">
        <h2 id={id} className="flex items-center gap-2 font-serif4 text-xl font-semibold leading-tight text-[#0b2545]">{icon}{title}</h2>
        {text && <p className="mt-1 text-xs text-steel-600">{text}</p>}
      </div>
      {aside}
    </div>
  )
}

/** Pill badge for categories and status. */
export function Pill({ children, tone = 'sky' }: { children: ReactNode; tone?: 'sky' | 'green' | 'slate' }) {
  const t = { sky: 'border-azure-200 bg-azure-50 text-azure-800', green: 'border-emerald-200 bg-emerald-50 text-emerald-800', slate: 'border-abyss-200 bg-abyss-100 text-abyss-700' }[tone]
  return <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', t)}>{children}</span>
}
