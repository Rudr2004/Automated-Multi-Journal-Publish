// Journal 4 home page, in the reference's reordered sequence: hero with the Call for Papers card, four key-feature cards, then an 8/4 grid
// (Aims & Scope, journal specifications, recently published articles beside the author-tools sidebar), the pre-footer banner and the highlights / learning resources section.
// Receives its data and callbacks as props; loading lives in core/containers.
import type { HomeData } from '../../../core/types'
import { Container } from '../components/primitives'
import { AimsScope } from './home/AimsScope'
import { ArticleTabs } from './home/ArticleTabs'
import { PreFooter } from './home/Closing'
import { Features } from './home/Features'
import { Hero } from './home/Hero'
import { Honors } from './home/Honors'
import { RightRail } from './home/Rails'
import { Specs } from './home/Specs'

export function HomePage({ data, onSubscribe }: { data: HomeData; onSubscribe: (email: string) => Promise<void> }) {
  const top = [...data.latest].sort((a, b) => b.views - a.views)[0]
  return (
    <Container className="space-y-6 py-6">
      <Hero cfp={data.callForPapers} />
      <Features />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <div className="min-w-0 space-y-6 lg:col-span-8">
          <AimsScope />
          <Specs />
          <ArticleTabs data={data} />
        </div>
        <div className="min-w-0 lg:col-span-4"><RightRail notices={data.notices} cfp={data.callForPapers} issue={data.currentIssue} articles={data.latest} /></div>
      </div>
      <div className="pt-4"><PreFooter onSubscribe={onSubscribe} /></div>
      <Honors top={top} lead={data.leadership.find((e) => e.role === 'Editor-in-Chief') ?? data.leadership[0]} />
    </Container>
  )
}
