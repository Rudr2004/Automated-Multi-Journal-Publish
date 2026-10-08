// "How to publish" timeline plus a compact APC note (charges come from the journal config).
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatNumber } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import { ButtonLink } from '../../components/Button'
import { Container, SectionHeading } from '../../components/primitives'
import { Book, Payments, Review, Submit, TaskDone, type IconProps } from '../../icons'
import type { ComponentType } from 'react'

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
    <section aria-labelledby="how-title" className="py-14 sm:py-20">
      <Container>
        <SectionHeading id="how-title" eyebrow="How to publish" title="From manuscript to published article in five steps" />
        <ol className="relative grid gap-6 md:grid-cols-5">
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-6 hidden h-0.5 bg-gradient-to-r from-brand-200 via-accent-300 to-brand-200 md:block" />
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex gap-4 md:flex-col md:items-center md:gap-3 md:text-center">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-800 text-white shadow-soft ring-4 ring-white"><Icon className="h-6 w-6" aria-hidden="true" /></span>
              <div>
                <p className="font-display text-base font-semibold text-graphite-800"><span className="text-accent-700">{i + 1}.</span> {title}</p>
                <p className="mt-1 text-sm text-graphite-600">{text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div id="apc-payment" className="mt-12 grid gap-6 rounded-sheet border border-graphite-200 bg-graphite-50 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h3 className="font-display text-xl font-bold text-graphite-800">Transparent publication charges</h3>
            <p className="mt-2 max-w-2xl text-graphite-700">There is no fee to submit or to be reviewed. If your paper is accepted, the article processing charge is <strong className="font-semibold text-graphite-900">₹{formatNumber(apc.inr)} + {apc.gstPercent}% GST</strong> for authors in India, or <strong className="font-semibold text-graphite-900">US${formatNumber(apc.usd)}</strong> for authors elsewhere (no GST).</p>
            <AppLink to={paths.forAuthors('apc-payment')} className="mt-3 inline-block text-sm font-semibold text-accent-700 hover:underline">See charges, payment options and receipts →</AppLink>
          </div>
          <ButtonLink to={paths.submit} variant="cta" className="px-6 py-3 text-base"><Submit className="h-5 w-5" aria-hidden="true" /> Submit Manuscript</ButtonLink>
        </div>
      </Container>
    </section>
  )
}
