// Journal 3 home page, after the "Academic Editorial & Press" reference: hero with the journal profile and Call for Papers, the three article columns, the index strip,
// then a left rail (announcements, awards, subjects, facts, author assets) beside the main column (aims, recent articles, timeline, principles, editorial board),
// and the Author's desk, directories, appointment calls and closing call to action. Receives its data as props; loading lives in core/containers.
import { journal } from '../../../config/journals'
import { formatMonthYear } from '../../../core/lib/format'
import type { HomeData } from '../../../core/types'
import { wrapCls } from './home/bits'
import { ArticleColumns } from './home/ArticleColumns'
import { Appointments, Directories, SubmitBand } from './home/Desk'
import { Hero } from './home/Hero'
import { IndexStrip } from './home/IndexStrip'
import { LatestList } from './home/LatestList'
import { Aims, Board, Principles, Timeline } from './home/MainSections'
import { Sidebar } from './home/Sidebar'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  const issue = data.currentIssue
  const pool = [...data.latest, ...data.mostRead, ...data.editorsChoice].filter((a, i, arr) => arr.findIndex((x) => x.paperId === a.paperId) === i)
  return (
    <>
      <div className={wrapCls}>
        <Hero cfp={data.callForPapers} />
        <ArticleColumns latest={data.latest} mostRead={data.mostRead} pool={pool} issueLabel={`Vol. ${issue.volume}, Issue ${issue.issue} \u2022 ${formatMonthYear(issue.publishedAt)}`} />
      </div>
      <IndexStrip />
      <div className={`${wrapCls} mt-12 grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12`}>
        <div className="order-2 lg:order-1"><Sidebar data={data} pool={pool} /></div>
        <div className="order-1 flex min-w-0 flex-col gap-12 lg:order-2">
          <Aims />
          <LatestList latest={data.latest} mostRead={data.mostRead} pool={pool} choiceIds={data.editorsChoice.map((a) => a.paperId)} openAccess={journal.badges.openAccess} />
          <Timeline />
          <Principles />
          <Board editors={data.leadership} />
        </div>
      </div>
      <Directories />
      <Appointments />
      <SubmitBand />
    </>
  )
}
