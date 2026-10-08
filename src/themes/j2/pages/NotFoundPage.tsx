import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  return (
    <Container className="py-20 text-center">
      <p className="font-display text-6xl font-extrabold text-brand-800">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-graphite-800">We couldn’t find that {what}</h1>
      <p className="mx-auto mt-2 max-w-md text-graphite-600">The link may be outdated or mistyped. Try one of these instead.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <ButtonLink to={paths.home}>Back to Home</ButtonLink>
        <ButtonLink to={paths.currentIssue} variant="outline">Current Issue</ButtonLink>
        <ButtonLink to={paths.search('')} variant="outline">Search</ButtonLink>
      </div>
    </Container>
  )
}
