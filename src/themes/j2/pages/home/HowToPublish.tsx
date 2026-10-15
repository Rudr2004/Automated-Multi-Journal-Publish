// "Author Journey Roadmap": five steps from submission to a published, indexed article, plus the APC note (charges come from the journal config).
import type { ComponentType } from 'react'
import { Container } from '../../components/primitives'
import { Book, Payments, Review, Submit, TaskDone, type IconProps } from '../../icons'

const steps: { icon: ComponentType<IconProps>; title: string; text: string }[] = [
  { icon: Submit, title: 'Submit', text: 'Upload your manuscript and receive a Paper ID by email, with no account needed.' },
  { icon: Review, title: 'Peer review', text: 'An editor screens the paper and experts review it. Decisions come with written reasons.' },
  { icon: TaskDone, title: 'Acceptance', text: 'Accepted papers move to copyright, language and layout checks.' },
  { icon: Payments, title: 'Pay the APC', text: 'Pay only after acceptance, online or by bank or UPI transfer.' },
  { icon: Book, title: 'Publish & index', text: 'Your article gets a DOI and certificate, and appears in the next monthly issue.' },
]

export function HowToPublish() {
  return (
    <section aria-labelledby="how-title">
      <Container>
        <div className="rounded-sheet border border-graphite-200 bg-white p-5 shadow-card sm:p-6">
          <h2 id="how-title" className="font-display text-2xl font-bold text-graphite-900">Author Journey Roadmap</h2>
          <p className="mt-1 text-sm text-graphite-700">Transparent milestones from manuscript receipt to a permanent DOI:</p>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="rounded-panel border border-brand-200 bg-brand-50 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-sm font-bold text-white"><span className="sr-only">Step </span>{i + 1}</span>
                <p className="mt-3 flex items-center gap-1.5 font-display text-sm font-bold text-graphite-900"><Icon className="h-4 w-4 text-accent-700" aria-hidden="true" /> {title}</p>
                <p className="mt-1 text-xs leading-relaxed text-graphite-700">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  )
}
