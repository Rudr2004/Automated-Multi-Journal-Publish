// Light "portal" page header: breadcrumb, tag pill, title and intro inside a soft-mint rounded card (reference look).
import type { ReactNode } from 'react'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { ChevronRight } from '../icons'
import { Container, cx } from './primitives'

export function PageHeader({ crumbs, tag, title, text, children, aside }: {
  crumbs: string[]; tag?: ReactNode; title: string; text?: ReactNode; children?: ReactNode; aside?: ReactNode
}) {
  return (
    <Container className="pt-5 sm:pt-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-graphite-600">
          <li><AppLink to={paths.home} className="rounded-chip hover:text-accent-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">Home</AppLink></li>
          {crumbs.map((c, i) => (
            <li key={c} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
              {i === crumbs.length - 1 ? <span aria-current="page" className="font-semibold text-graphite-800">{c}</span> : <span>{c}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className={cx('mt-3 rounded-sheet border border-brand-200 bg-gradient-to-br from-brand-50 via-accent-50 to-white p-5 sm:p-8', aside ? 'grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end' : '')}>
        <div className="min-w-0">
          {tag && <div className="mb-3 flex flex-wrap items-center gap-2">{tag}</div>}
          <h1 className="font-display text-3xl font-bold tracking-tight text-brand-800 sm:text-4xl">{title}</h1>
          {text && <p className="mt-3 max-w-3xl text-base leading-relaxed text-graphite-700 sm:text-lg">{text}</p>}
          {children}
        </div>
        {aside}
      </div>
    </Container>
  )
}

/** Uppercase mint pill used for page and paper tags in the reference. */
export function PillTag({ children, icon, className }: { children: ReactNode; icon?: ReactNode; className?: string }) {
  return <span className={cx('inline-flex items-center gap-1 rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-900', className)}>{icon}{children}</span>
}
