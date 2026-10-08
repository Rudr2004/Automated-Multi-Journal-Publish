// Journal 4 home page. Receives its data and callbacks as props; loading lives in core/containers.
import type { HomeData } from '../../../core/types'
import { AtAGlance } from './home/AtAGlance'
import { BoardRow } from './home/BoardRow'
import { CallPanel } from './home/CallPanel'
import { Featured } from './home/Featured'
import { Hero } from './home/Hero'
import { LatestTable } from './home/LatestTable'
import { ResearchAreas } from './home/ResearchAreas'
import { Workflow } from './home/Workflow'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  // The featured paper is the first editor's pick. The areas matrix and the table draw on every article the home data carries.
  const featured = data.editorsChoice[0] ?? data.latest[0]
  const all = [...data.latest, ...data.mostRead, ...data.editorsChoice].filter((a, i, arr) => arr.findIndex((x) => x.paperId === a.paperId) === i)
  return (
    <>
      <Hero issue={data.currentIssue} />
      {featured && <Featured article={featured} />}
      <ResearchAreas articles={all} />
      <LatestTable articles={data.latest.length ? data.latest : all} />
      <AtAGlance reviewDays={data.callForPapers.avgReviewDays} />
      <Workflow />
      <CallPanel cfp={data.callForPapers} />
      <BoardRow editors={data.leadership} />
    </>
  )
}
