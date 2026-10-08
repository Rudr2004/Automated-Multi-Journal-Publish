// Call for Papers: an orange panel with the issue name, three deadline facts and the Submit call to action.
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import type { CallForPapers } from '../../../../core/types'
import { Artwork } from '../../components/Artwork'
import { ButtonLink } from '../../components/Button'
import { Container, Kicker } from '../../components/primitives'
import { Submit } from '../../icons'

const daysLeft = (iso: string) => Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000))

export function CallStrip({ cfp }: { cfp: CallForPapers }) {
  const left = daysLeft(cfp.deadline)
  const facts = [
    { label: left === 1 ? 'Day left' : 'Days left', value: String(left) },
    { label: 'Submission deadline', value: formatDate(cfp.deadline.slice(0, 10)) },
    { label: 'Publication', value: formatDate(cfp.expectedPublication) },
  ]
  return (
    <section aria-labelledby="cfp-title" className="pb-14 sm:pb-20">
      <Container>
        <div className="relative isolate overflow-hidden rounded-sheet bg-ember-500 text-night-900">
          <Artwork seed={cfp.issueName} palette={0} className="pointer-events-none absolute -right-20 -top-20 -z-10 hidden h-72 w-72 rotate-12 rounded-sheet opacity-20 md:block" />
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:p-12">
            <div>
              <Kicker className="text-night-900">Call for papers</Kicker>
              <h2 id="cfp-title" className="mt-2 font-jakarta text-[1.625rem] font-extrabold leading-[1.15] tracking-tight sm:text-[2rem]">{cfp.issueName}</h2>
              <p className="mt-3 max-w-xl text-base font-medium sm:text-[1.0625rem]">We welcome research articles, reviews and short communications on design, the arts, media, culture and development.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink to={paths.submit} variant="inverted"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
                <ButtonLink to={paths.policy('author-guidelines')} variant="outline" className="border-night-900">Author guidelines</ButtonLink>
              </div>
            </div>
            <dl className="grid grid-cols-3 gap-3 lg:w-[26rem]">
              {facts.map((f, i) => (
                <div key={f.label} className={i === 0 ? 'rounded-tile bg-night-900 p-4 text-white' : 'rounded-tile bg-white/35 p-4'}>
                  <dd className={i === 0 ? 'font-jakarta text-[2rem] font-extrabold leading-none text-ember-400' : 'font-jakarta text-base font-extrabold leading-tight'}>{f.value}</dd>
                  <dt className={i === 0 ? 'mt-1 text-xs font-semibold text-night-100' : 'mt-1 text-xs font-semibold'}>{f.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Container>
    </section>
  )
}
