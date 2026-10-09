import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AcLabel, AcLink } from '../components/AcademicUi'
import { Container } from '../components/primitives'

export function NotFoundPage({ what = 'page' }: { what?: string }) {
  return (
    <div className="border-b border-mauve-100 bg-[#F8FAFC]">
      <Container className="py-20 sm:py-28">
        <div className="max-w-2xl border-l-2 border-ember-700 pl-6">
          <AcLabel className="!text-ember-700">Error 404 · {journal.shortName}</AcLabel>
          <h1 className="mt-3 font-jakarta text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-[1.1] text-iris-700">We couldn’t find that {what}</h1>
          <p className="mt-4 font-jakarta text-lg leading-relaxed text-night-700">The link may be outdated or mistyped. These places will get you back to the journal’s published work.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <AcLink to={paths.home}>Back to Home</AcLink>
            <AcLink to={paths.currentIssue} tone="outline">Current Issue</AcLink>
            <AcLink to={paths.search('')} tone="outline">Search</AcLink>
          </div>
        </div>
      </Container>
    </div>
  )
}
