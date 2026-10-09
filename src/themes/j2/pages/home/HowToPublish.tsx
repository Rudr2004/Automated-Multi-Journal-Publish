// "Author Journey Roadmap": five steps from submission to a published, indexed article, plus the APC note (charges come from the journal config).
import type { ComponentType } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import { ButtonLink } from '../../components/Button'
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
  const { apc } = journal
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

          <div id="apc-payment" className="mt-6 grid scroll-mt-24 gap-5 rounded-panel border border-graphite-200 bg-graphite-50 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h3 className="font-display text-lg font-bold text-graphite-900">Transparent publication charges</h3>
              <p className="mt-1.5 max-w-3xl text-sm text-graphite-700">There is no fee to submit or to be reviewed. If your paper is accepted, the article processing charge is <strong className="font-semibold text-graphite-900">₹{formatNumber(apc.inr)} + {apc.gstPercent}% GST</strong> for authors in India, or <strong className="font-semibold text-graphite-900">US${formatNumber(apc.usd)}</strong> for authors elsewhere (no GST).</p>
              <AppLink to={paths.forAuthors('apc-payment')} className="mt-2 inline-block text-sm font-semibold text-accent-700 hover:underline">See charges, payment options and receipts →</AppLink>
            </div>
            <ButtonLink to={paths.submit} variant="primary" className="px-6 py-3"><Submit className="h-5 w-5" aria-hidden="true" /> Submit Manuscript</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  )
}
