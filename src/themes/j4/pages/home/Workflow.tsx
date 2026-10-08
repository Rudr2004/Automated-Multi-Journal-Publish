// Publication workflow drawn as a horizontal process diagram: connected nodes along a line (a vertical list on phones).
import { AppLink } from '../../../../core/router'
import { paths } from '../../../../config/routes'
import { Container, SectionHead } from '../../components/primitives'
import { Payments, Publish, Review, Shield, Submit, TaskDone, type IconProps } from '../../icons'
import type { ComponentType } from 'react'

const steps: { icon: ComponentType<IconProps>; title: string; text: string }[] = [
  { icon: Submit, title: 'Submit', text: 'Upload the manuscript. You receive a Paper ID by email; no account is needed.' },
  { icon: Shield, title: 'Screening', text: 'An editor checks scope, completeness, ethics statements and similarity.' },
  { icon: Review, title: 'Peer review', text: 'External reviewers assess the work against a published checklist.' },
  { icon: TaskDone, title: 'Decision', text: 'Accept, revise or reject, always with written reasons.' },
  { icon: Payments, title: 'Payment', text: 'The APC is due only after acceptance, online or by bank or UPI transfer.' },
  { icon: Publish, title: 'Publish', text: 'Layout, DOI registration, certificate and inclusion in the monthly issue.' },
]

export function Workflow() {
  return (
    <section aria-labelledby="flow-title" className="border-y border-abyss-200 bg-abyss-50 py-16 sm:py-24">
      <Container>
        <SectionHead id="flow-title" label="Publication workflow" title="From submission to publication" text="Six stages, each visible to the author with the Paper ID."
          action={<AppLink to={paths.track} className="text-sm font-semibold text-cobalt-700 hover:underline">Track a paper →</AppLink>} />
        <ol className="relative grid gap-6 md:grid-cols-6 md:gap-3">
          <span aria-hidden="true" className="absolute left-[1.375rem] top-6 h-[calc(100%-3rem)] w-px bg-abyss-300 md:left-[8%] md:top-[1.375rem] md:h-px md:w-[84%]" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex gap-4 md:flex-col md:gap-3">
              <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-ctl border border-abyss-300 bg-white text-cobalt-700 shadow-hair"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-xs font-semibold tabular-nums text-steel-500">Step {i + 1}</p>
                <h3 className="font-serif4 text-lg font-semibold leading-snug text-abyss-900">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-steel-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
