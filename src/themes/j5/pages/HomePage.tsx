// Journal 5 home page: a dense portal. Hero card + Official Journal Issue, KPI cards, then sticky left / right rails around the tabbed article lists,
// followed by the research-areas matrix, the six-step workflow diagram, the specification sheet, board highlights, alerts and a closing call to action.
// Receives its data and callbacks as props; loading lives in core/containers.
import type { HomeData } from '../../../core/types'
import { Container } from '../components/primitives'
import { AimsScope } from './home/AimsScope'
import { ApcCalculator } from './home/ApcCalculator'
import { AtAGlance } from './home/AtAGlance'
import { Guidelines } from './home/Guidelines'
import { Masthead } from './home/Masthead'
import { TrustLedger } from './home/TrustLedger'
import { ArticleTabs } from './home/ArticleTabs'
import { BoardRow } from './home/BoardRow'
import { FinalCta } from './home/Closing'
import { Hero } from './home/Hero'
import { KpiStrip } from './home/KpiStrip'
import { LeftRail, RightRail } from './home/Rails'
import { ResearchAreas } from './home/ResearchAreas'
import { Workflow } from './home/Workflow'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  // The areas matrix draws on every article the home data carries.
  const all = [...data.latest, ...data.mostRead, ...data.editorsChoice].filter((a, i, arr) => arr.findIndex((x) => x.paperId === a.paperId) === i)
  return (
    <>
      <div className="space-y-4 bg-[#FBF8F4] pb-10 pt-4 sm:space-y-5 sm:pt-5">
        <Masthead issue={data.currentIssue} />
        <Container><Hero issue={data.currentIssue} /></Container>
        <Container><KpiStrip issue={data.currentIssue} cfp={data.callForPapers} /></Container>
        <Container className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-[16.5rem_minmax(0,1fr)_17.5rem] xl:gap-5">
          <div className="min-w-0 space-y-4 max-xl:order-first lg:col-span-2 xl:order-none xl:col-span-1 xl:col-start-2 xl:row-start-1">
            <ArticleTabs data={data} />
          </div>
          <div className="min-w-0 xl:col-start-1 xl:row-start-1"><LeftRail cfp={data.callForPapers} notices={data.notices} /></div>
          <div className="min-w-0 xl:col-start-3 xl:row-start-1"><RightRail /></div>
        </Container>
      </div>
      <ResearchAreas articles={all} />
      <AimsScope />
      <TrustLedger />
      <Workflow />
      <AtAGlance reviewDays={data.callForPapers.avgReviewDays} />
      <Guidelines perspectives={data.perspectives} />
      <ApcCalculator />
      <BoardRow editors={data.leadership} />
      <FinalCta />
    </>
  )
}
