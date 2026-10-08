// Journal 2 home page. Receives its data and callbacks as props; loading lives in core/containers.
import type { HomeData } from '../../../core/types'
import { BoardHighlights } from './home/BoardHighlights'
import { CallForPapers } from './home/CallForPapers'
import { DisciplineGrid } from './home/DisciplineGrid'
import { FeaturedPapers } from './home/FeaturedPapers'
import { FreshResearch } from './home/FreshResearch'
import { Hero } from './home/Hero'
import { HowToPublish } from './home/HowToPublish'
import { WhyJimrt } from './home/WhyJimrt'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  return (
    <>
      <Hero issue={data.currentIssue} />
      <FeaturedPapers articles={data.editorsChoice} />
      <DisciplineGrid />
      <FreshResearch articles={data.latest} />
      <CallForPapers cfp={data.callForPapers} />
      <WhyJimrt />
      <BoardHighlights editors={data.leadership} />
      <HowToPublish />
    </>
  )
}
