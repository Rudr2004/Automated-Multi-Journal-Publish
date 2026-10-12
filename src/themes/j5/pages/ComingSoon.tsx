// Placeholder for pages that are built in a later phase, and for the editorial login (outside the public site's scope).
import { paths } from '../../../config/routes'
import { ButtonLink } from '../components/Button'
import { AppLink } from '../../../core/router'
import { DoubleRule } from '../components/PageBand'
import { Container } from '../components/primitives'
import { Kicker, OrnamentRule } from '../components/signature'

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="bg-[#FBF8F4]">
      <Container className="py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mx-auto mb-6 flex max-w-xl flex-wrap items-center gap-2 border-b border-[#E6DCD0] pb-2 font-work text-xs text-obsidian-600">
          <AppLink to={paths.home} className="hover:text-wine-800">Home</AppLink><span aria-hidden="true" className="text-obsidian-400">/</span><span aria-current="page" className="font-medium text-wine-800">{title}</span>
        </nav>
        <div className="mx-auto max-w-xl rounded border border-[#E6DCD0] bg-white p-6 text-center shadow-sm sm:p-10">
          <DoubleRule tone="light" className="mb-5" />
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
