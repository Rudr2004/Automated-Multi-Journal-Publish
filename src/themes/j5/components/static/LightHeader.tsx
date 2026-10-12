// Light page header for Journal 5: breadcrumb plus a white card with a double rule, badge, title, intro and free content (the publication-ethics reference language).
import type { ReactNode } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { DoubleRule } from '../PageBand'
import { Container } from '../primitives'
import { Verified } from '../../icons'

export interface LightCrumb { label: string; to?: string }

export function LightHeader({ crumbs, badge, title, intro, meta, children, id }: { crumbs: LightCrumb[]; badge: string; title: ReactNode; intro?: ReactNode; meta?: ReactNode; children?: ReactNode; id?: string }) {
  return (
    <div className="bg-[#FBF8F4]">
      <Container className="pt-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 border-b border-[#E6DCD0] pb-2 font-work text-xs text-obsidian-600">
          <AppLink to={paths.home} className="hover:text-wine-800">Home</AppLink>
          {crumbs.map((c, i) => {
            const last = i === crumbs.length - 1
            return <span key={c.label} className="flex items-center gap-2"><span aria-hidden="true" className="text-obsidian-400">/</span>{c.to && !last ? <AppLink to={c.to} className="hover:text-wine-800">{c.label}</AppLink> : <span aria-current={last ? 'page' : undefined} className="font-medium text-wine-800">{c.label}</span>}</span>
          })}
        </nav>
        <header className="rounded border border-[#E6DCD0] bg-white p-6 shadow-sm sm:p-8">
          <DoubleRule tone="light" className="mb-3" />
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded border border-wine-800/20 bg-wine-800/10 px-2.5 py-1 font-work text-[11px] font-bold uppercase tracking-wider text-wine-800"><Verified className="h-4 w-4" aria-hidden="true" />{badge}</span>
            <span className="font-work text-xs text-obsidian-600">{journal.shortName} · ISSN {journal.issnOnline}</span>
          </div>
          <h1 id={id} className="mb-3 break-words font-newsreader text-2xl font-bold leading-tight tracking-tight text-wine-800 sm:text-3xl lg:text-4xl">{title}</h1>
          {intro && <p className="max-w-3xl font-serif4 text-sm leading-relaxed text-obsidian-600 sm:text-base">{intro}</p>}
          {children}
          {meta}
        </header>
      </Container>
    </div>
  )
}
