// Journal 4 (IJECM) data, served through the shared mock API (300–800ms latency). Swap for real fetch calls later.
import { journal } from '../../../config/journals/j4'
import { paths } from '../../../config/routes'
import type { PrototypeDemo } from '../../../prototype/demo'
import type { HomeData } from '../../../core/types'
import { createMockApi } from '../../shared/createMockApi'
import { allArticles, byId, currentIssue, issueArticles, issues, SUBJECTS } from './articles'
import { buildFull, KEYWORDS } from './content'
import { editors } from './editorial'
import { staticPages } from './staticPages'
import { findPaper, newSubmission, trackedPapers } from './tracking'

export { SUBJECTS } from './articles'

const current = issueArticles(currentIssue.volume, currentIssue.issue)
const body = current.filter((a) => a.type !== 'Editorial')

const home: HomeData = {
  currentIssue,
  recentIssues: [...issues].slice(-3).reverse(),
  notices: [
    { date: '2026-10-02', text: 'Crossref DOIs registered for every article in Issue 9, resolving to the article pages.' },
    { date: '2026-09-24', text: 'Call for papers: a themed section on condition monitoring and digital twins for infrastructure opens for Issue 11.' },
    { date: '2026-09-12', text: 'Two new Associate Editors join the board for power systems and supply chain analytics.' },
  ],
  recentSubmissions: [],
  submissionPool: [],
  awards: [],
  perspectives: [
    {
      tag: 'Editors’ note',
      title: 'Components to systems',
      text: 'This issue places a monitored bridge, a vaccine cold chain, a microgrid review and a metro construction programme side by side. What connects them is the habit of measuring carefully and managing what the measurements reveal. We hope the range encourages you to read across areas.',
      to: paths.currentIssue,
    },
  ],
  leadership: editors.filter((e) => ['Editor-in-Chief', 'Managing Editor', 'Associate Editor'].includes(e.role)).slice(0, 6),
  latest: body,
  mostRead: [...allArticles].sort((a, b) => b.views - a.views).slice(0, 8),
  editorsChoice: ['IJECM2026000112', 'IJECM2026000113', 'IJECM2026000118', 'IJECM2026000114'].map((id) => byId(id)!),
  callForPapers: {
    issueName: journal.nextIssue.label,
    deadline: journal.nextIssue.deadline,
    expectedPublication: journal.nextIssue.expectedPublication,
    avgReviewDays: 14,
  },
  testimonials: [],
}

export const j4Api = createMockApi({
  journal,
  home,
  articles: allArticles,
  issues,
  currentIssue,
  byId,
  issueArticles,
  buildFull,
  keywords: KEYWORDS,
  subjects: SUBJECTS,
  editors,
  staticPages,
  findPaper,
  newSubmission,
})

export const j4Demo: PrototypeDemo = {
  trackedPapers,
  articleIds: ['IJECM2026000112', 'IJECM2026000113', 'IJECM2026000110'],
  pastIssue: [1, 5],
}
