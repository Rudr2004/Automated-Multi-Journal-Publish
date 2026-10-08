// Compact emerald page title band used on the submit, track and verify pages.
import type { ReactNode } from 'react'
import { Container } from './primitives'

export function PageBand({ eyebrow, title, text, children }: { eyebrow: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-800 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(50rem_20rem_at_90%_-20%,rgba(15,118,110,0.6),transparent),radial-gradient(30rem_16rem_at_0%_120%,rgba(52,211,153,0.16),transparent)]" />
      <Container className="py-9 sm:py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-200">{eyebrow}</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-base text-brand-50">{text}</p>}
        {children}
      </Container>
    </section>
  )
}
