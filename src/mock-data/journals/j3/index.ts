// Journal 3 (IJCSD) data, served through the shared mock API (300–800ms latency). Swap for real fetch calls later.
import { journal } from '../../../config/journals/j3'
import { paths } from '../../../config/routes'
import type { PrototypeDemo } from '../../../prototype/demo'
import type { HomeData } from '../../../core/types'
import { createMockApi } from '../../shared/createMockApi'
import { portraitFor } from '../../shared/portraits'
import { allArticles, byId, currentIssue, issueArticles, issues, SUBJECTS } from './articles'
import { buildFull, KEYWORDS } from './content'
import { editors } from './editorial'
import { staticPages } from './staticPages'
import { findPaper, newSubmission, trackedPapers } from './tracking'

export { SUBJECTS } from './articles'

const current = issueArticles(currentIssue.volume, currentIssue.issue)
const body = current.filter((a) => a.type !== 'Editorial')

const quoted = byId('IJCSD2026000078')!
const quotedAuthor = quoted.authors[0]
const quotedInstitution = buildFull(quoted).affiliations[0]

const home: HomeData = {
  currentIssue,
  recentIssues: [...issues].slice(-3).reverse(),
  notices: [
    { date: '2026-10-02', text: 'Crossref DOIs registered for every article in Issue 9, resolving to the article pages.' },
    { date: '2026-09-24', text: 'Call for papers: a themed section on community archives and living heritage opens for Issue 11.' },
    { date: '2026-09-12', text: 'Two new Associate Editors join the board for media studies and cultural heritage.' },
  ],
  recentSubmissions: [],
  submissionPool: [],
  awards: [],
  perspectives: [
    {
      tag: 'Editors’ note',
      title: 'Many ways of knowing',
      text: 'This issue brings a shadow-puppet archive, a block-printing studio, a classroom and a village stage into the same conversation. What connects them is a commitment to research done with practitioners rather than about them. We hope the range encourages you to read across themes.',
      to: paths.currentIssue,
    },
  ],
  leadership: editors.filter((e) => ['Editor-in-Chief', 'Managing Editor', 'Associate Editor'].includes(e.role)).slice(0, 6),
  latest: body,
  mostRead: [...allArticles].sort((a, b) => b.views - a.views).slice(0, 8),
  editorsChoice: ['IJCSD2026000078', 'IJCSD2026000076', 'IJCSD2026000071', 'IJCSD2026000073'].map((id) => byId(id)!),
  callForPapers: {
    issueName: journal.nextIssue.label,
    deadline: journal.nextIssue.deadline,
    expectedPublication: journal.nextIssue.expectedPublication,
    avgReviewDays: 14,
  },
  testimonials: [
    {
      quote: 'Documentation can support renewal, but only when it is designed with practitioners rather than for them.',
      name: quotedAuthor,
      role: quoted.title,
      institution: quotedInstitution,
      photo: portraitFor(quotedAuthor),
    },
  ],
}

export const j3Api = createMockApi({
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

export const j3Demo: PrototypeDemo = {
  trackedPapers,
  articleIds: ['IJCSD2026000078', 'IJCSD2026000072', 'IJCSD2026000070'],
  pastIssue: [1, 5],
}
