// Journal 1 data, served through the shared mock API (300–800ms latency). Swap for real fetch calls later.
import { createMockApi } from '../../shared/createMockApi'
import { allArticles, byId, currentIssue, issueArticles, issues, SUBJECTS } from './articles'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { buildFull, KEYWORDS } from './content'
import { editors } from './editorial'
import { portraitFor } from '../../shared/portraits'
import { staticPages } from './staticPages'
import type { PrototypeDemo } from '../../../prototype/demo'
import { findPaper, newSubmission, trackedPapers } from './tracking'
import type { J1HomeData } from '../../../core/types'

export * from '../../../core/types'
export { SUBJECTS } from './articles'
export { trackedPapers } from './tracking'

const current = issueArticles(currentIssue.volume, currentIssue.issue)
const body = current.filter((a) => a.type !== 'Editorial')

const home: J1HomeData = {
  currentIssue,
  recentIssues: [...issues].slice(-3).reverse(),
  notices: [
    { date: '2026-10-02', text: 'Crossref metadata deposit completed for Issue 8, with DOI resolution live for every article.' },
    { date: '2026-09-24', text: 'Three new Associate Editors appointed in computer science and energy systems.' },
    { date: '2026-09-18', text: 'August 2026 Best Paper and Best Research Mentor awards finalised by the Senior Editorial Committee.' },
  ],
  recentSubmissions: [
    { minutes: 18, subject: 'Computer Science', institution: 'IIT Madras', title: 'Federated Learning in Edge IoT Devices' },
    { minutes: 64, subject: 'Materials Science', institution: 'Stanford University', title: 'Grain-Boundary Engineering of Lightweight Magnesium Alloys' },
    { minutes: 185, subject: 'Energy Systems', institution: 'NIT Tiruchirappalli', title: 'Decentralised Microgrid Consensus Under Latency' },
    { minutes: 301, subject: 'Environmental Science', institution: 'TU Delft', title: 'Microplastic Transport in Estuarine Sediments' },
    { minutes: 425, subject: 'Public Health', institution: 'NUS Singapore', title: 'Community Screening Programmes for Hypertension in Urban Clinics' },
  ],
  submissionPool: [
    { subject: 'Biotechnology', institution: 'University of Cambridge' }, { subject: 'Computer Science', institution: 'IIIT Hyderabad' },
    { subject: 'Energy Systems', institution: 'Khalifa University' }, { subject: 'Materials Science', institution: 'University of Toronto' },
    { subject: 'Public Health', institution: 'University of Nigeria' }, { subject: 'Environmental Science', institution: 'Lund University' },
    { subject: 'Computer Science', institution: 'TU Munich' }, { subject: 'Biotechnology', institution: 'IISc Bengaluru' },
  ],

  awards: [
    { kind: 'Best Paper Award', period: 'August 2026', title: 'Sol–Gel Synthesis of Titanium Dioxide Thin Films for Self-Cleaning Coatings', recipient: 'Dr. Ritu Sharma and Dr. James Whitfield', reason: 'Selected for novelty, practical relevance and openly shared datasets.' },
    { kind: 'Best Research Mentor', period: 'August 2026', title: 'Doctoral Supervision Excellence Award', recipient: 'Prof. Elena Fischer (Technical University of Munich)', reason: 'Recognising outstanding mentoring of early-career researchers to published work.' },
  ],
  perspectives: [
    { tag: 'COPE briefing', title: 'Using generative AI in manuscript writing', text: 'Disclosure rules for AI-assisted drafting and editing.', to: paths.policy('ai-policy') },
    { tag: 'Metadata guide', title: 'DOI persistence and data citation', text: 'Linking datasets, Zenodo DOIs and ORCID iDs to your article.', to: paths.policy('data') },
    { tag: 'Writing impact', title: 'Structuring a paper for indexing and discovery', text: 'Titles, abstracts and keywords that help readers find your work.', to: paths.policy('author-guidelines') },
  ],
  leadership: editors.filter((e) => ['Editor-in-Chief', 'Managing Editor', 'Associate Editor'].includes(e.role)).slice(0, 4),
  latest: body.slice(0, 6),
  mostRead: [...allArticles].sort((a, b) => b.views - a.views).slice(0, 6),
  editorsChoice: ['IJMAT2026000122', 'IJMAT2026000125', 'IJMAT2026000115'].map((id) => byId(id)!),
  callForPapers: {
    issueName: journal.nextIssue.label,
    deadline: journal.nextIssue.deadline,
    expectedPublication: journal.nextIssue.expectedPublication,
    avgReviewDays: 14,
  },
  testimonials: [
    { quote: 'The review was fast and the comments were genuinely constructive. I had my Paper ID within seconds and tracked every stage without creating an account.', name: 'Dr. Sunita Verma', role: 'Associate Professor, Materials Engineering', institution: 'Indian Institute of Technology, Delhi', photo: portraitFor('Sunita Verma') },
    { quote: 'Transparent charges, a DOI on publication and a certificate for every co-author. Exactly what an early-career researcher needs.', name: 'Dr. Marcus Hoffmann', role: 'Postdoctoral Researcher, Energy Systems', institution: 'Technical University of Munich, Germany', photo: portraitFor('Marcus Hoffmann') },
    { quote: 'WhatsApp support resolved my payment query in minutes. A professional and responsive editorial office.', name: 'Dr. Chinwe Eze', role: 'Senior Lecturer, Public Health', institution: 'University of Nigeria, Nsukka', photo: portraitFor('Chinwe Eze') },
  ],

}

export const j1Api = createMockApi({
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

export const j1Demo: PrototypeDemo = {
  trackedPapers,
  articleIds: ['IJMAT2026000121', 'IJMAT2026000122', 'IJMAT2026000126'],
  pastIssue: [3, 5],
}
