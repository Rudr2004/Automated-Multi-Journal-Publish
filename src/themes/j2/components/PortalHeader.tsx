// Light-mint page header with breadcrumbs, used by the J2 submit success and track pages (matches the reference portal pages).
import type { ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { ChevronRight } from '../icons'
import { Container } from './primitives'

export function PortalHeader({ trail, current, chip, title, text, children }: {
  trail: { label: string; to: string }[]; current: string; chip: string; title: string; text?: string; children?: ReactNode
}) {
  return (
    <header className="border-b border-brand-100 bg-gradient-to-b from-brand-50 to-[#F4F9F7]">
      <Container className="pb-8 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-graphite-600">
            {[{ label: 'Home', to: paths.home }, ...trail].map((t) => (
              <li key={t.to + t.label} className="flex items-center gap-1"><AppLink to={t.to} className="rounded-chip hover:text-accent-700 hover:underline">{t.label}</AppLink><ChevronRight className="h-4 w-4" aria-hidden="true" /></li>
            ))}
            <li aria-current="page" className="font-semibold text-brand-800">{current}</li>
          </ol>
        </nav>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand-100 px-3 py-1 text-sm font-semibold text-brand-900"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-brand-700" />{chip}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-4xl">{title}</h1>
            {text && <p className="mt-2 max-w-2xl text-base text-graphite-700 sm:text-lg">{text}</p>}
          </div>
          <ul aria-label="Journal credentials" className="flex flex-wrap gap-2 text-sm font-medium text-accent-900">
            <li className="rounded-soft border border-accent-200 bg-white px-3 py-1.5">{journal.shortName}</li>
            <li className="rounded-soft border border-accent-200 bg-white px-3 py-1.5">ISSN {journal.issnOnline}</li>
          </ul>
        </div>
        {children}
      </Container>
    </header>
  )
}
