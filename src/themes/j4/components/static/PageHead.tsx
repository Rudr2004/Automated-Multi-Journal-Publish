// Journal 4 page opener used by search, board and verify: breadcrumb on the canvas, then a white hairline title card
// (eyebrow pill, navy serif title, intro) in the same language as the static policy pages.
import type { ReactNode } from 'react'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { Container } from '../primitives'

export function PageHead({ crumbs, eyebrow, title, intro, children }: {
  crumbs: { label: string; to?: string }[]
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  children?: ReactNode
}) {
  return (
    <Container className="pt-6 sm:pt-8">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-steel-600">
          <li><AppLink to={paths.home} className="hover:text-cobalt-700 hover:underline">Home</AppLink></li>
          {crumbs.map((c, i) => (
            <li key={c.label} className="flex items-center gap-2" {...(i === crumbs.length - 1 ? { 'aria-current': 'page' as const } : {})}>
              <span aria-hidden="true">/</span>
              {c.to && i < crumbs.length - 1 ? <AppLink to={c.to} className="hover:text-cobalt-700 hover:underline">{c.label}</AppLink> : <span className="font-semibold text-abyss-900">{c.label}</span>}
            </li>
          ))}
        </ol>
      </nav>
      <div className="relative isolate mt-4 overflow-hidden rounded-pane border border-abyss-200 bg-white p-5 shadow-hair sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-bl-full bg-azure-50 opacity-70" />
        <span className="inline-flex items-center rounded-ctl border border-azure-200 bg-azure-50 px-2.5 py-1 text-xs font-semibold text-[#0b2545]">{eyebrow}</span>
        <h1 className="mt-3 max-w-3xl break-words font-serif4 text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-[#0b2545]">{title}</h1>
        {intro && <p className="mt-3 max-w-3xl text-[0.9375rem] leading-relaxed text-steel-700 sm:text-base">{intro}</p>}
        {children}
      </div>
    </Container>
  )
}
