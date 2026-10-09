// Placeholder for pages that are built in a later phase, and for the editorial login (outside the public site's scope).
import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { Container, Label } from '../components/primitives'

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="bg-abyss-50">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-xl rounded-pane border border-abyss-200 border-l-4 border-l-azure-600 bg-white p-6 shadow-panel sm:p-8">
          <Label className="text-cobalt-700">Not available yet</Label>
          <h1 className="mt-2 font-serif4 text-[2rem] font-semibold leading-tight text-abyss-900">{title}</h1>
          <p className="mt-3 text-base text-steel-700">This page is not available in the prototype yet.</p>
          <div className="mt-6 flex flex-wrap gap-3"><ButtonLink to={paths.home}>Back to Home</ButtonLink><ButtonLink to={paths.currentIssue} variant="outline">Current Issue</ButtonLink></div>
        </div>
      </Container>
    </div>
  )
}

/** Builds a page component that shows `ComingSoon`, for theme pages that are not designed yet. */
export const pendingPage = (title: string) => function PendingPage() { return <ComingSoon title={title} /> }
