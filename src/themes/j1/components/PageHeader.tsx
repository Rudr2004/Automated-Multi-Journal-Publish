import type { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import { Container } from './primitives'

/** Banner used at the top of every inner page: breadcrumb + serif title on a soft, patterned surface. */
export function PageHeader({ crumbs, title, subtitle, children }: {
  crumbs: { label: string; to?: string }[]; title: string; subtitle?: string; children?: ReactNode
}) {
  return (
    <div className="relative border-b border-line bg-gradient-to-b from-navy-50 to-white">
      <div aria-hidden className="absolute inset-0 opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #AFC1E3 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      <Container className="relative pb-8">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-serif text-3xl font-semibold leading-tight text-navy sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-ink-muted">{subtitle}</p>}
        {children}
      </Container>
    </div>
  )
}
