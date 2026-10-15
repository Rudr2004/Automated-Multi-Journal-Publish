// Journal 5 home page, in the order of the client's reference: hero (About card + Call for Papers plate), then an 8 / 4 grid (About, Aims and Scope,
// Official Journal Details, featured articles | right sidebar), the Journal Xplore query band and the Scholarly Recognition row.
// Receives its data and callbacks as props; loading lives in core/containers. The scrolling alerts bar, masthead and footer live in layouts/.
import type { HomeData } from '../../../core/types'
import { Container } from '../components/primitives'
import { AboutJournal, AimsScope, JournalDetails } from './home/AboutBlocks'
import { FeaturedArticles } from './home/FeaturedArticles'
import { Hero } from './home/Hero'
import { Sidebar } from './home/Sidebar'

export function HomePage({ data }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  return (
    <>
      <Hero cfp={data.callForPapers} />
      <Container className="py-10">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="min-w-0 space-y-10 lg:col-span-8">
            <AboutJournal />
            <AimsScope />
            <JournalDetails />
            <FeaturedArticles data={data} />
          </div>
          <Sidebar cfp={data.callForPapers} notices={data.notices} />
        </div>
      </Container>
    </>
  )
}
