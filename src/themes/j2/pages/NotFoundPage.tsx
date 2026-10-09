import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'
import { WithAwardsRail } from '../components/WithAwardsRail'
import { ArrowRight, Book, Search, Track } from '../icons'

const LINKS = [
  { to: paths.currentIssue, label: 'Current Issue', text: 'Read the latest published articles.', Icon: Book },
  { to: paths.search(''), label: 'Search articles', text: 'Find papers by title, author, DOI or Paper ID.', Icon: Search },
  { to: paths.track, label: 'Track Manuscript', text: 'Check the status of a submitted paper.', Icon: Track },
]

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  return (
    <Container className="py-10 sm:py-16">
<WithAwardsRail>
      <div className="mx-auto max-w-3xl rounded-sheet border border-brand-200 bg-gradient-to-br from-brand-50 via-accent-50 to-white p-6 text-center sm:p-10">
        <p className="font-display text-6xl font-extrabold tracking-tight text-brand-800 sm:text-7xl">404</p>
        <h1 className="mt-3 font-display text-2xl font-bold text-graphite-900 sm:text-3xl">We couldn’t find that {what}</h1>
        <p className="mx-auto mt-2 max-w-md text-graphite-700">The link may be outdated or mistyped. Try one of these instead.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to={paths.home}>Back to Home</ButtonLink>
          <ButtonLink to={paths.currentIssue} variant="outline">Current Issue</ButtonLink>
          <ButtonLink to={paths.search('')} variant="outline">Search</ButtonLink>
        </div>
      </div>
      <ul className="mx-auto mt-6 grid max-w-3xl gap-4 sm:grid-cols-3">
        {LINKS.map(({ to, label, text, Icon }) => (
          <li key={label}>
            <AppLink to={to} className="group flex h-full flex-col rounded-panel border border-graphite-200 bg-white p-4 shadow-card hover:border-accent-700 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">
              <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-soft bg-brand-50 text-brand-800"><Icon className="h-5 w-5" /></span>
              <span className="mt-3 flex items-center gap-1 font-display text-base font-bold text-graphite-900">{label}<ArrowRight className="h-4 w-4 text-accent-700 motion-safe:transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
              <span className="mt-1 text-sm text-graphite-600">{text}</span>
            </AppLink>
          </li>
        ))}
      </ul>
    </WithAwardsRail>
</Container>
  )
}
