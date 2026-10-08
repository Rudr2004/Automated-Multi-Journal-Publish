// Journal 3 home page. Receives its data and callbacks as props; loading lives in core/containers.
import type { ArticleSummary, HomeData } from '../../../core/types'
import { CallStrip } from './home/CallStrip'
import { EditorsNote } from './home/EditorsNote'
import { Hero } from './home/Hero'
import { InsideJournal } from './home/InsideJournal'
import { PullQuote } from './home/PullQuote'
import { Shelves } from './home/Shelves'
import { StatsStrip } from './home/StatsStrip'
import { ThisIssue } from './home/ThisIssue'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  // The cover story is the first editor's pick; shelves draw on every article the home data carries.
  const story = data.editorsChoice[0] ?? data.latest[0]
  const all = [...data.latest, ...data.mostRead, ...data.editorsChoice].filter((a, i, arr) => arr.findIndex((x) => x.paperId === a.paperId) === i)
  const quote = data.testimonials[0]
  const quoted: ArticleSummary | undefined = quote ? all.find((a) => a.title === quote.role) : undefined
  const issueTiles = data.latest.filter((a) => a.paperId !== story?.paperId)
  return (
    <>
      <Hero issue={data.currentIssue} story={story} />
      <StatsStrip />
      <ThisIssue issue={data.currentIssue} articles={issueTiles} />
      <Shelves articles={all} />
      {quote && <PullQuote quote={quote} article={quoted} />}
      <CallStrip cfp={data.callForPapers} />
      <InsideJournal />
      {data.perspectives[0] && <EditorsNote note={data.perspectives[0]} editor={data.leadership[0]} />}
    </>
  )
}
