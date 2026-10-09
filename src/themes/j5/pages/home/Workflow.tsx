// Publication workflow drawn as a horizontal process diagram: connected nodes along a line (a vertical list on phones).
import { AppLink } from '../../../../core/router'
import { paths } from '../../../../config/routes'
import { HomeSection } from './HomeHead'
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
    <HomeSection id="flow-title" label="Publication workflow" title="From submission to publication" text="Six stages, each visible to the author with the Paper ID." bg="bg-[#F6EFE6]"
          action={<AppLink to={paths.track} className="text-sm font-semibold text-wine-800 hover:underline">Track a paper →</AppLink>}>
        <ol className="relative grid gap-6 md:grid-cols-6 md:gap-3">
          <span aria-hidden="true" className="absolute left-[1.375rem] top-6 h-[calc(100%-3rem)] w-px bg-wine-800/30 md:left-[8%] md:top-[1.375rem] md:h-px md:w-[84%]" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex gap-4 md:flex-col md:gap-3">
              <span className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded border border-wine-800 bg-white text-wine-800"><Icon className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-xs font-semibold tabular-nums text-ochre-700">Step {i + 1}</p>
                <h3 className="font-newsreader text-lg font-semibold leading-snug text-obsidian-900">{title}</h3>
                <p className="mt-1 font-serif4 text-[15px] leading-relaxed text-obsidian-700">{text}</p>
              </div>
            </li>
          ))}
        </ol>
    </HomeSection>
  )
}
