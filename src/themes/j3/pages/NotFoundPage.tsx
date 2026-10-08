import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  return (
    <Container className="py-24 text-center">
      <p className="font-jakarta text-6xl font-extrabold tracking-tight text-iris-700">404<span className="text-ember-500">.</span></p>
      <h1 className="mt-4 font-jakarta text-[1.625rem] font-extrabold text-night-900">We couldn’t find that {what}</h1>
      <p className="mx-auto mt-3 max-w-md text-mauve-700">The link may be outdated or mistyped. Try one of these instead.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink to={paths.home}>Back to Home</ButtonLink>
        <ButtonLink to={paths.currentIssue} variant="outline">Current Issue</ButtonLink>
        <ButtonLink to={paths.search('')} variant="outline">Search</ButtonLink>
      </div>
    </Container>
  )
}
