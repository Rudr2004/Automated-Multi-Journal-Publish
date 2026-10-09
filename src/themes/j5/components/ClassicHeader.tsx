// Classical page header shared by the J5 utility pages (board, verify, track, submit, static): bordeaux band with an orbit
// drawing, breadcrumb, dateline, kicker, serif title, ornament rule, intro, and double hairline rules top and bottom.
import type { ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { Container } from './primitives'
import { Kicker, OrnamentRule } from './signature'

export interface Crumb { label: string; to?: string }

/** Parchment page surface and card classes used by the J5 utility pages. */
export const PARCHMENT = 'bg-[#FBF8F4]'
export const CARD = 'rounded border border-[#E6DCD0] bg-white'

export function Dateline({ className = '' }: { className?: string }) {
  return <p className={`font-work text-[11px] font-medium uppercase tracking-[0.12em] tabular-nums text-wine-200 ${className}`}>{journal.shortName} · Volume 1 · 2026 · ISSN {journal.issnOnline}</p>
}

export function ClassicHeader({ crumbs, kicker, title, intro, children, aside, id }: { crumbs: Crumb[]; kicker: string; title: ReactNode; intro?: ReactNode; children?: ReactNode; aside?: ReactNode; id?: string }) {
  return (
    <header className="relative isolate bg-bordeaux-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_88%_0%,rgba(112,26,30,0.8),transparent_62%),radial-gradient(ellipse_at_0%_100%,rgba(180,83,9,0.14),transparent_55%)]" />
        <img src="/journals/j5/images/orbits.svg" alt="" className="absolute -right-24 top-1/2 hidden h-[135%] w-auto max-w-none -translate-y-1/2 opacity-60 md:block" />
      </div>
      <div aria-hidden="true" className="h-[3px] bg-ochre-700" />
      <div aria-hidden="true" className="mt-[3px] h-px bg-ochre-300/40" />
      <Container className="pb-10 pt-6 sm:pb-12">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1">
          <nav aria-label="Breadcrumb"><ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-wine-200">
            <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li>
            {crumbs.map((c, i) => {
              const last = i === crumbs.length - 1
              return <li key={c.label} className="flex items-center gap-2"><span aria-hidden="true">/</span>{c.to && !last ? <AppLink to={c.to} className="hover:text-white hover:underline">{c.label}</AppLink> : <span aria-current={last ? 'page' : undefined} className={last ? 'font-medium text-white' : ''}>{c.label}</span>}</li>
            })}
          </ol></nav>
          <Dateline className="hidden sm:block" />
        </div>
        <div className="mt-7 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <Kicker tone="dark">{kicker}</Kicker>
            <h1 id={id} className="mt-3 max-w-3xl break-words font-newsreader font-semibold leading-[1.08] tracking-tight" style={{ fontSize: 'clamp(2rem,3.8vw,3.25rem)' }}>{title}</h1>
            <OrnamentRule tone="dark" className="mt-5 max-w-xs" />
            {intro && <p className="mt-5 max-w-2xl font-serif4 text-base leading-relaxed text-wine-100 sm:text-[1.0625rem]">{intro}</p>}
            {children}
          </div>
          {aside}
        </div>
      </Container>
      <div aria-hidden="true" className="h-px bg-ochre-300/40" />
      <div aria-hidden="true" className="mt-[3px] h-[3px] bg-ochre-700" />
    </header>
  )
}
