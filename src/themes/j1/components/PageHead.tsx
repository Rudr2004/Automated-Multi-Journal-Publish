import type { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { Container } from './primitives'

/**
 * Hairline-ruled page title block used by the board, search, verification and error pages:
 * breadcrumb, small caps eyebrow, serif H1 and a short standfirst on white, closed by a 1px rule.
 */
export function PageHead({ crumbs, eyebrow, title, subtitle, children, aside }: {
  crumbs: { label: string; to?: string }[]; eyebrow?: string; title: string; subtitle?: ReactNode; children?: ReactNode
  /** Optional right-aligned slot (e.g. a count) on wide screens. */
  aside?: ReactNode
}) {
  return (
    <div className="border-b border-line bg-white">
      <Container className="pb-6">
        <Breadcrumbs items={crumbs} />
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div className="min-w-0 max-w-3xl">
            {eyebrow && <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-scholar">{eyebrow}</p>}
            <h1 className="font-serif text-[1.75rem] font-semibold leading-tight tracking-tight text-navy sm:text-[2.125rem]">{title}</h1>
            {subtitle && <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-muted">{subtitle}</p>}
          </div>
          {aside}
        </div>
        {children}
      </Container>
    </div>
  )
}

/** Small-caps label above a group of fields or links in a side rail. */
export const RailTitle = ({ children, id }: { children: ReactNode; id?: string }) => (
  <h2 id={id} className="border-b border-line pb-2 font-serif text-[1.0625rem] font-semibold text-navy">{children}</h2>
)
