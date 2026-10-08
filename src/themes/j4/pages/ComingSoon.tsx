// Placeholder for pages that are built in a later phase, and for the editorial login (outside the public site's scope).
import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'

export function ComingSoon({ title }: { title: string }) {
  return (
    <Container className="py-24 text-center">
      <h1 className="font-serif4 text-[2rem] font-semibold text-abyss-900">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-steel-600">This page is not available in the prototype yet.</p>
      <div className="mt-8"><ButtonLink to={paths.home}>Back to Home</ButtonLink></div>
    </Container>
  )
}

/** Builds a page component that shows `ComingSoon`, for theme pages that are not designed yet. */
export const pendingPage = (title: string) => function PendingPage() { return <ComingSoon title={title} /> }
