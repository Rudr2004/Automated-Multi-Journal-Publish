// Home hero: a two-column section on a soft lavender gradient. Text, search and buttons on the left; the current issue card on the right.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import type { ArticleSummary, IssueSummary } from '../../../../core/types'
import { ButtonLink } from '../../components/Button'
import { HeroSearch } from '../../components/HeroSearch'
import { Container } from '../../components/primitives'
import { ArrowRight, Verified } from '../../icons'
import { IssueCard } from './IssueCard'

export function Hero({ issue, story }: { issue: IssueSummary; story?: ArticleSummary }) {
  return (
    <section aria-labelledby="hero-title" className="bg-gradient-to-b from-[#F5F2FF] to-white">
      <Container className="grid items-center gap-10 pb-10 pt-8 sm:pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,25.5rem)] lg:gap-12 lg:pb-14 lg:pt-12">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-jakarta text-xs font-bold text-iris-800 ring-1 ring-iris-100">
            <Verified className="h-4 w-4 text-iris-700" aria-hidden="true" /> Peer-reviewed · Open access · Creative studies
          </p>
          <h1 id="hero-title" className="mt-5 font-jakarta text-[clamp(2.125rem,3.6vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-night-900">
            Publish creative research.<br /><span className="text-iris-700">Shape what comes next.</span>
          </h1>
          <p className="mt-4 max-w-[560px] text-lg text-mauve-700">{journal.shortName} is a monthly open access journal for research in design, the arts, media, education and development, with fair review and a permanent DOI for every paper.</p>
          <HeroSearch className="mt-6 max-w-[560px]" />
          <div className="mt-5 flex flex-wrap gap-3">
            <ButtonLink to={paths.submit} variant="cta" className="px-7 py-3.5">Submit Manuscript <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
            <ButtonLink to={paths.currentIssue} variant="ghost" className="border-2 border-iris-700 px-7 py-3.5">Explore Current Issue</ButtonLink>
          </div>
        </div>
        <div><IssueCard issue={issue} story={story} /></div>
      </Container>
    </section>
  )
}
