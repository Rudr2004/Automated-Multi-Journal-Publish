// Small building blocks shared by every Journal 3 page. Design only: no data loading here.
import type { ReactNode } from 'react'
import { ErrorIcon, Refresh } from '../icons'

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')

/** Page width and side gutters (16px on phones). */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cx('mx-auto w-full max-w-[1280px] px-4 sm:px-6', className)}>{children}</div>
}

export const Skeleton = ({ className }: { className?: string }) => (
  <div aria-hidden="true" className={cx('animate-pulse rounded-tile bg-mauve-100', className)} />
)

export function ErrorState({ message = 'Something went wrong while loading this page.', onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="mx-auto max-w-md rounded-block bg-iris-50 p-8 text-center">
      <ErrorIcon className="mx-auto h-9 w-9 text-ember-700" aria-hidden="true" />
      <p className="mt-3 font-jakarta text-lg font-bold text-night-900">Couldn’t load this</p>
      <p className="mt-1 text-sm text-mauve-700">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-full border-2 border-iris-700 px-5 py-2 font-jakarta text-sm font-bold text-iris-700 hover:bg-iris-100">
          <Refresh className="h-4 w-4" aria-hidden="true" /> Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="rounded-block bg-iris-50 p-10 text-center">
      <p className="font-jakarta text-lg font-bold text-night-900">{title}</p>
      {text && <p className="mt-1 text-sm text-mauve-700">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

/** Pill-shaped label. */
export function Pill({ children, tone = 'iris', icon }: { children: ReactNode; tone?: 'iris' | 'night' | 'ember' | 'plain'; icon?: ReactNode }) {
  const tones = {
    iris: 'bg-iris-100 text-iris-800',
    night: 'bg-night-900 text-white',
    ember: 'bg-ember-500 text-night-900',
    plain: 'bg-mauve-100 text-mauve-800',
  }
  return <span className={cx('inline-flex items-center gap-1 rounded-full px-3 py-1 font-jakarta text-xs font-bold tracking-wide', tones[tone])}>{icon}{children}</span>
}

/** Small-caps label used above titles (theme names, section kickers). */
export const Kicker = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={cx('font-jakarta text-xs font-extrabold uppercase tracking-[0.08em]', className)}>{children}</p>
)

export function SectionTitle({ kicker, title, action, tone = 'dark', id }: { kicker?: string; title: string; action?: ReactNode; tone?: 'dark' | 'light'; id?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {kicker && <Kicker className={tone === 'light' ? 'text-ember-400' : 'text-iris-700'}>{kicker}</Kicker>}
        <h2 id={id} className={cx('mt-2 font-jakarta text-[1.75rem] font-extrabold leading-[1.1] tracking-tight sm:text-[2.125rem]', tone === 'light' ? 'text-white' : 'text-night-900')}>{title}</h2>
      </div>
      {action}
    </div>
  )
}
