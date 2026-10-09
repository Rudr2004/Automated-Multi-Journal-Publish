// Placeholder for pages that are built in a later phase, and for the editorial login (outside the public site's scope).
import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { PillTag } from '../components/PageHeader'
import { Container } from '../components/primitives'

export function ComingSoon({ title }: { title: string }) {
  return (
    <Container className="py-10 sm:py-16">
      <div className="mx-auto max-w-2xl rounded-sheet border border-brand-200 bg-gradient-to-br from-brand-50 via-accent-50 to-white p-6 text-center sm:p-10">
        <PillTag>Coming soon</PillTag>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-800">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-graphite-700">This page is not available in the prototype yet.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink to={paths.home}>Back to Home</ButtonLink>
          <ButtonLink to={paths.currentIssue} variant="outline">Current Issue</ButtonLink>
        </div>
      </div>
    </Container>
  )
}

/** Builds a page component that shows `ComingSoon`, for theme pages that are not designed yet. */
export const pendingPage = (title: string) => function PendingPage() { return <ComingSoon title={title} /> }
