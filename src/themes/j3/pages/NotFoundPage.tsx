import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AcLabel, AcLink, AcMarker } from '../components/AcademicUi'
import { Container } from '../components/primitives'

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl rounded-[2px] border border-j3paper-rule bg-j3paper-cool p-6 sm:p-8">
        <AcLabel className="flex items-center gap-2 !text-night-900"><AcMarker />Error 404 · {journal.shortName}</AcLabel>
        <h1 className="mt-3 font-jakarta text-[clamp(1.75rem,3.2vw,2.375rem)] font-bold leading-[1.15] tracking-tight text-night-900">We couldn’t find that {what}</h1>
        <p className="mt-3 font-inter text-[1.0625rem] leading-[1.65] text-mauve-700">The link may be outdated or mistyped. These places will get you back to the journal’s published work.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <AcLink to={paths.home}>Back to Home</AcLink>
          <AcLink to={paths.currentIssue} tone="outline">Current Issue</AcLink>
          <AcLink to={paths.search('')} tone="outline">Search</AcLink>
        </div>
      </div>
    </Container>
  )
}
