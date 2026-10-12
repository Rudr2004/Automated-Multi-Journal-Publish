// Placeholder for pages that are built in a later phase, and for the editorial login (outside the public site's scope).
import { paths } from '../../../config/routes'
import { AcLink } from '../components/AcademicUi'
import { Container } from '../components/primitives'

export function ComingSoon({ title }: { title: string }) {
  return (
    <Container className="py-16 sm:py-24">
      <div className="mx-auto max-w-xl rounded-[2px] border border-j3paper-rule bg-j3paper-cool p-8 text-center">
        <h1 className="font-jakarta text-[1.75rem] font-bold leading-tight tracking-tight text-night-900">{title}</h1>
        <p className="mx-auto mt-3 max-w-md font-inter text-base text-mauve-700">This page is not available in the prototype yet.</p>
        <div className="mt-6"><AcLink to={paths.home}>Back to Home</AcLink></div>
      </div>
    </Container>
  )
}

/** Builds a page component that shows `ComingSoon`, for theme pages that are not designed yet. */
export const pendingPage = (title: string) => function PendingPage() { return <ComingSoon title={title} /> }
