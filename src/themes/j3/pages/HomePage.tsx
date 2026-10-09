// Journal 3 home page, after the "Academic Prestige" reference: bulletin and archive search, the lead article with Editor's Choice, the current issue strip,
// then the article lists beside the journal desk sidebar. Receives its data and callbacks as props; loading lives in core/containers.
import { formatMonthYear } from '../../../core/lib/format'
import type { ArticleSummary, HomeData } from '../../../core/types'
import { wrapCls } from './home/bits'
import { IssueStrip } from './home/IssueStrip'
import { LatestList } from './home/LatestList'
import { LeadSection } from './home/LeadArticle'
import { SearchPanel } from './home/SearchPanel'
import { Sidebar } from './home/Sidebar'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  // The lead is the first editor's pick; the other picks fill the Editor's Choice cards beside it.
  const story = data.editorsChoice[0] ?? data.latest[0]
  const choices = data.editorsChoice.filter((a) => a.paperId !== story?.paperId).slice(0, 3)
  const all = [...data.latest, ...data.mostRead, ...data.editorsChoice].filter((a, i, arr) => arr.findIndex((x) => x.paperId === a.paperId) === i)
  const quote = data.testimonials[0]
  const quoted: ArticleSummary | undefined = quote ? all.find((a) => a.title === quote.role) : undefined
  const issue = data.currentIssue
  const previous = data.recentIssues.find((i) => !(i.volume === issue.volume && i.issue === issue.issue))
  return (
    <div className={`${wrapCls} pb-16`}>
      <SearchPanel issue={issue} />
      {story && <LeadSection story={story} choices={choices} volume={issue.volume} />}
      <IssueStrip issue={issue} previous={previous} note={data.perspectives[0]} editor={data.leadership[0]} />
      <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-10">
        <LatestList latest={data.latest} mostRead={data.mostRead} issueLabel={`Volume ${issue.volume}, Issue ${issue.issue} (${formatMonthYear(issue.publishedAt)})`} />
        <Sidebar cfp={data.callForPapers} quote={quote} quoted={quoted} />
      </div>
    </div>
  )
}
