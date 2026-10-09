// Journal 2 home page. Receives its data and callbacks as props; loading lives in core/containers.
import type { HomeData } from '../../../core/types'
import { Container } from '../components/primitives'
import { AboutJournal } from './home/AboutJournal'
import { ArticleTabs } from './home/ArticleTabs'
import { FinalCta } from './home/FinalCta'
import { Hero } from './home/Hero'
import { HowToPublish } from './home/HowToPublish'
import { KpiStrip } from './home/KpiStrip'
import { Sidebar } from './home/Sidebar'
import { Ticker } from './home/Ticker'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  return (
    <div className="space-y-6 bg-[#F8FAFC] pb-12 pt-3 sm:space-y-8">
      <Container><Ticker notices={data.notices} reviewDays={data.callForPapers.avgReviewDays} /></Container>
      <Container><Hero issue={data.currentIssue} featured={data.editorsChoice[0]} sample={data.latest[0]} /></Container>
      <Container><KpiStrip issue={data.currentIssue} cfp={data.callForPapers} /></Container>
      <Container className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_22.5rem]">
        <div className="min-w-0 space-y-6">
          <ArticleTabs data={data} />
          <AboutJournal />
        </div>
        <Sidebar cfp={data.callForPapers} editors={data.leadership} />
      </Container>
      <HowToPublish />
      <FinalCta />
    </div>
  )
}
