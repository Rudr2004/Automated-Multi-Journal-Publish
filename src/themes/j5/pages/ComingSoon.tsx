// Placeholder for pages that are built in a later phase, and for the editorial login (outside the public site's scope).
import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { Container } from '../components/primitives'
import { Kicker, OrnamentRule } from '../components/signature'

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="bg-[#FBF8F4]">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-xl rounded border border-[#E6DCD0] border-t-4 border-t-wine-800 bg-white p-6 text-center sm:p-10">
          <Kicker className="justify-center">Not available yet</Kicker>
          <h1 className="mt-3 font-newsreader text-[2rem] font-semibold leading-tight text-obsidian-900">{title}</h1>
          <OrnamentRule className="mx-auto mt-4 max-w-[12rem]" />
          <p className="mt-4 font-serif4 text-lg text-obsidian-700">This page is not available in the prototype yet.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3"><ButtonLink to={paths.home}>Back to Home</ButtonLink><ButtonLink to={paths.currentIssue} variant="outline">Current Issue</ButtonLink></div>
        </div>
      </Container>
    </div>
  )
}

/** Builds a page component that shows `ComingSoon`, for theme pages that are not designed yet. */
export const pendingPage = (title: string) => function PendingPage() { return <ComingSoon title={title} /> }
