// Call for Papers banner for the next issue, with days left and the key Submit call to action.
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import type { CallForPapers as Cfp } from '../../../../core/types'
import { ButtonLink } from '../../components/Button'
import { Container } from '../../components/primitives'
import { Calendar, Submit, Timer } from '../../icons'

const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000))

export function CallForPapers({ cfp }: { cfp: Cfp }) {
  const left = daysLeft(cfp.deadline)
  return (
    <section aria-labelledby="cfp-title" className="py-6 sm:py-10">
      <Container>
        <div className="relative overflow-hidden rounded-sheet bg-brand-50 ring-1 ring-inset ring-brand-200">
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-200/60" />
          <div aria-hidden="true" className="absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-accent-100/70" />
          <div className="relative grid gap-6 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent-700">Call for papers</p>
              <h2 id="cfp-title" className="mt-1 font-display text-2xl font-bold text-brand-900 sm:text-3xl">{cfp.issueName}</h2>
              <p className="mt-2 max-w-2xl text-graphite-700">We welcome original research, review articles and short communications from every discipline. Submit by the deadline to be considered for this issue.</p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-graphite-800">
                <li className="inline-flex items-center gap-2"><Timer className="h-5 w-5 text-accent-700" aria-hidden="true" /> {left === 0 ? 'Closing today' : `${left} day${left === 1 ? '' : 's'} left`} · deadline {formatDate(cfp.deadline.slice(0, 10))}</li>
                <li className="inline-flex items-center gap-2"><Calendar className="h-5 w-5 text-accent-700" aria-hidden="true" /> Publication {formatDate(cfp.expectedPublication)}</li>
              </ul>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink to={paths.submit} variant="cta" className="px-6 py-3 text-base"><Submit className="h-5 w-5" aria-hidden="true" /> Submit Manuscript</ButtonLink>
              <ButtonLink to={paths.policy('author-guidelines')} variant="outline" className="px-6 py-3 text-base">Author guidelines</ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
