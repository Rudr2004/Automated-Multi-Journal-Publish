// Journal 2 (JIMRT) data, served through the shared mock API (300–800ms latency). Swap for real fetch calls later.
import { journal } from '../../../config/journals/j2'
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
    { date: '2026-09-22', text: 'Two new Associate Editors join the board for engineering and life sciences.' },
    { date: '2026-09-10', text: 'The author certificate now carries a QR code that anyone can scan to verify it.' },
  ],
  recentSubmissions: [],
  submissionPool: [],
  awards: [
    { kind: 'Best Paper Award', period: 'September 2026', title: 'Vibration-Based Structural Health Monitoring of Reinforced Concrete Bridges Using Low-Cost MEMS Sensors', recipient: 'Aditi Banerjee and Lukas Weber', reason: 'Selected for practical relevance, low-cost instrumentation and a clearly reported method.' },
    { kind: 'Best Research Mentor', period: 'September 2026', title: 'Early-Career Mentoring Excellence Award', recipient: 'Prof. Divya Menon (Tata Institute of Social Sciences)', reason: 'Recognising mentoring of early-career researchers through to published work.' },
  ],
  perspectives: [],
  leadership: editors.filter((e) => ['Editor-in-Chief', 'Managing Editor', 'Associate Editor'].includes(e.role)).slice(0, 6),
  latest: body.slice(0, 8),
  mostRead: [...allArticles].sort((a, b) => b.views - a.views).slice(0, 6),
  editorsChoice: ['JIMRT2026000038', 'JIMRT2026000045', 'JIMRT2026000033', 'JIMRT2025000060'].map((id) => byId(id)!),
  callForPapers: {
    issueName: journal.nextIssue.label,
    deadline: journal.nextIssue.deadline,
    expectedPublication: journal.nextIssue.expectedPublication,
    avgReviewDays: 14,
  },
  testimonials: [],
}

export const j2Api = createMockApi({
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

export const j2Demo: PrototypeDemo = {
  trackedPapers,
  articleIds: ['JIMRT2026000045', 'JIMRT2026000042', 'JIMRT2026000049'],
  pastIssue: [2, 5],
}
