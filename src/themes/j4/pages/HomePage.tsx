// Journal 4 home page: a dense portal. Hero card + Official Journal Issue, KPI cards, then sticky left / right rails around the tabbed article lists,
// followed by the research-areas matrix, the six-step workflow diagram, the specification sheet, board highlights, alerts and a closing call to action.
// Receives its data and callbacks as props; loading lives in core/containers.
import type { HomeData } from '../../../core/types'
import { Container, Label } from '../components/primitives'
import { AtAGlance } from './home/AtAGlance'
import { ArticleTabs } from './home/ArticleTabs'
import { BoardRow } from './home/BoardRow'
import { FinalCta, SubscribeBand } from './home/Closing'
import { Hero } from './home/Hero'
import { KpiStrip } from './home/KpiStrip'
import { LeftRail, RightRail } from './home/Rails'
import { ResearchAreas } from './home/ResearchAreas'
import { Workflow } from './home/Workflow'

export function HomePage({ data, onSubscribe }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  // The areas matrix draws on every article the home data carries.
  const all = [...data.latest, ...data.mostRead, ...data.editorsChoice].filter((a, i, arr) => arr.findIndex((x) => x.paperId === a.paperId) === i)
  const note = data.perspectives[0]
  return (
    <>
      <div className="space-y-4 bg-abyss-50 pb-10 pt-4 sm:space-y-5 sm:pt-5">
        <Container><Hero issue={data.currentIssue} /></Container>
        <Container><KpiStrip issue={data.currentIssue} cfp={data.callForPapers} /></Container>
        <Container className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-[16.5rem_minmax(0,1fr)_17.5rem] xl:gap-5">
          <div className="min-w-0 space-y-4 max-xl:order-first lg:col-span-2 xl:order-none xl:col-span-1 xl:col-start-2 xl:row-start-1">
            <ArticleTabs data={data} />
            {note && (
              <section aria-labelledby="home-note" className="rounded-pane border border-abyss-200 border-l-[3px] border-l-azure-600 bg-white p-5 shadow-hair">
                <Label className="text-cobalt-700">{note.tag}</Label>
                <h2 id="home-note" className="mt-1.5 font-serif4 text-xl font-semibold text-abyss-900">{note.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-steel-700">{note.text}</p>
              </section>
            )}
          </div>
          <div className="min-w-0 xl:col-start-1 xl:row-start-1"><LeftRail cfp={data.callForPapers} notices={data.notices} /></div>
          <div className="min-w-0 xl:col-start-3 xl:row-start-1"><RightRail /></div>
        </Container>
      </div>
      <ResearchAreas articles={all} />
      <Workflow />
      <AtAGlance reviewDays={data.callForPapers.avgReviewDays} />
      <BoardRow editors={data.leadership} />
      <SubscribeBand onSubscribe={onSubscribe} />
      <FinalCta />
    </>
  )
}
