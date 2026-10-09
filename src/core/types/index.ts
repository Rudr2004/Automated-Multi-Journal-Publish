export type ArticleType = 'Research Article' | 'Review Article' | 'Short Communication' | 'Editorial'
export const ARTICLE_TYPES: ArticleType[] = ['Research Article', 'Review Article', 'Short Communication', 'Editorial']

export interface ArticleSummary {
  paperId: string // also used as the URL slug: /ijmat/article/:paperId
  type: ArticleType
  subject: string
  title: string
  authors: string[]
  volume: number
  issue: number
  pages: string
  publishedAt: string // issue date, ISO yyyy-mm-dd
  views: number
  downloads: number
  citations: number
  abstract: string
}

export interface IssueSummary {
  volume: number
  issue: number
  month: string // ISO yyyy-mm
  publishedAt: string
  articleCount: number
  doi: string
  isCurrent: boolean
}

export interface CallForPapers {
  issueName: string
  deadline: string
  expectedPublication: string
  avgReviewDays: number
}

export interface Testimonial { quote: string; name: string; role: string; institution: string; photo?: string }

export interface J1HomeData {
  currentIssue: IssueSummary
  /** The current issue and the two before it (for the cover stack). */
  recentIssues: IssueSummary[]
  notices: { date: string; text: string }[]
  /** `title` is the working title of the new submission (shown in the Recent submissions card); `subject` is the discipline. */
  recentSubmissions: { minutes: number; subject: string; institution: string; title?: string }[]
  /** Pool the live "Recent Submissions" feed draws new entries from. */
  submissionPool: { subject: string; institution: string }[]
  awards: { kind: string; period: string; title: string; recipient: string; reason: string }[]
  perspectives: { tag: string; title: string; text: string; to: string }[]
  leadership: EditorProfile[]
  latest: ArticleSummary[]
  mostRead: ArticleSummary[]
  editorsChoice: ArticleSummary[]
  callForPapers: CallForPapers
  testimonials: Testimonial[]
}

export interface AuthorDetail {
  name: string
  photo?: string
  affiliations: number[] // 1-based indexes into ArticleFull.affiliations
  corresponding?: boolean
  email?: string
  orcid?: string
}

export interface ArticleTable { caption: string; head: string[]; rows: string[][] }
export interface ArticleFigure { caption: string; xLabel: string; yLabel: string; labels: string[]; values: number[] }
export interface ArticleSection {
  id: string
  title: string
  paragraphs: string[]
  table?: ArticleTable
  figure?: ArticleFigure
}
export interface Reference { text: string; doi?: string }

export interface ArticleFull extends ArticleSummary {
  received: string
  accepted: string
  publishedOnline: string
  authorDetails: AuthorDetail[]
  affiliations: string[]
  keywords: string[]
  sections: ArticleSection[]
  references: Reference[]
  related: ArticleSummary[]
}

export interface IssueData { issue: IssueSummary; articles: ArticleSummary[] }

// ---- Tracking ----
export type PaperStage = 'submitted' | 'under-review' | 'decision' | 'accepted' | 'payment' | 'in-press' | 'published' | 'indexed'
// The 8 stages of a paper, named as in the platform architecture ("Production" = in press, "Indexing" = Google Scholar check).
export const STAGES: { id: PaperStage; label: string }[] = [
  { id: 'submitted', label: 'Submission' }, { id: 'under-review', label: 'Review' }, { id: 'decision', label: 'Decision' },
  { id: 'accepted', label: 'Acceptance' }, { id: 'payment', label: 'Payment' }, { id: 'in-press', label: 'Production' },
  { id: 'published', label: 'Publication' }, { id: 'indexed', label: 'Indexing' },
]

export interface PaperDocument { id: string; label: string; available: boolean; note?: string }

export type PaymentStatus = 'not-due' | 'due' | 'verifying' | 'paid'

export interface TrackedPaper {
  paperId: string
  email: string
  title: string
  journalName: string
  stageIndex: number // index into STAGES of the current stage
  stageDates: Partial<Record<PaperStage, string>>
  documents: PaperDocument[]
  editable: boolean
  authors: string[]
  /** not-due: before acceptance · due: waiting for the author · verifying: UPI/bank proof uploaded, editor checking · paid: confirmed */
  payment: PaymentStatus
  /** Editor's reason for the decision (decisions are logged with a reason). */
  decisionNote?: string
  /** Date the weekly Google Scholar check found the article. */
  indexedOn?: string
  copyrightSigned: boolean
  referral: { code: string; credits: number; referred: number }
}

export type TrackResult =
  | { kind: 'found'; paper: TrackedPaper }
  | { kind: 'other-journal'; code: string }
  | { kind: 'not-found' }

// ---- Submission ----
export interface SubmissionInput {
  title: string
  email: string
  authorName: string
}

// ---- Static pages ----
export type StaticGroup = 'policies' | 'for-authors' | 'about'
export interface StaticSection {
  heading: string
  paragraphs?: string[]
  list?: string[]
  callout?: { tone: 'info' | 'warn' | 'note' | 'success'; title: string; text: string }
  /** Optional small label shown at the right of the heading (e.g. "14-day cycle"). */
  badge?: string
  /** Optional rich content (tables, card grids, step pipelines...) shown under the paragraphs. Themes may ignore it. */
  blocks?: StaticBlock[]
}
/** Rich blocks a static page can show below its text sections. */
export type StaticBlock =
  | { type: 'steps'; title: string; items: { title: string; text: string }[] }
  | { type: 'flow'; title: string; nodes: { label: string; note: string }[] }
  | { type: 'faq'; title: string; items: { q: string; a: string }[] }
  | { type: 'downloads'; title: string; items: { name: string; desc: string; format: string }[] }
  | { type: 'icon-grid'; title: string; items: { icon: string; title: string; text: string }[] }
  | { type: 'indexing-grid'; title: string }
  | { type: 'journal-info' }
  | { type: 'contact-details' }
  | { type: 'contact-form'; title: string }
  | { type: 'reviewer-form'; title: string }
  // Rich blocks (optional for themes: a theme that does not know a type simply renders nothing for it). `title` may be '' for none.
  | { type: 'table'; title: string; caption?: string; head: string[]; rows: string[][] }
  | { type: 'card-grid'; title: string; items: { icon?: string; tag?: string; mark?: string; title: string; text: string }[] }
  | { type: 'icon-list'; title: string; items: { icon: string; title: string; text: string }[] }
  | { type: 'ordered-steps'; title: string; layout?: 'row' | 'list'; items: { title: string; text?: string; meta?: string }[] }
  | { type: 'in-brief'; title: string; items: { title: string; text: string }[] }
  | { type: 'callout'; tone: 'info' | 'warn' | 'note' | 'success'; title: string; text: string }
  | { type: 'faq-accordion'; title: string; items: { q: string; a: string }[] }

export interface StaticPageData {
  slug: string
  group: StaticGroup
  title: string
  intro: string
  principles?: boolean // show "Our Ethical Principles" cards
  /** Title-card details: category label, policy reference, version, issuing authority and audience. */
  meta?: { category?: string; ref?: string; version?: string; authority?: string; appliesTo?: string }
  sections: StaticSection[]
  blocks?: StaticBlock[]
  updated: string
  related: string[] // slugs
}

// ---- Editorial board ----
export type EditorRole = 'Editor-in-Chief' | 'Managing Editor' | 'Associate Editor' | 'Editorial Board' | 'Review Board'
export const EDITOR_ROLES: EditorRole[] = ['Editor-in-Chief', 'Managing Editor', 'Associate Editor', 'Editorial Board', 'Review Board']

export interface EditorProfile {
  id: string
  name: string
  photo?: string
  role: EditorRole
  designation: string
  institution: string
  country: string
  shortBio: string
  fullBio: string
  areas: string[]
  links: { orcid?: string; scholar?: string; scopus?: string; wos?: string }
}

// ---- Support forms ----
export interface ContactTicketInput { name: string; email: string; topic: string; message: string }
export interface ReviewerApplicationInput { name: string; email: string; institution: string; country: string; areas: string; orcid: string; statement: string }

// ---- Smart search ----
export interface SearchSuggestions {
  /** Set when the text is an exact DOI or Paper ID. */
  direct?: { paperId: string; via: 'doi' | 'paper-id'; article?: ArticleSummary }
  articles: ArticleSummary[]
  authors: { name: string; count: number }[]
  keywords: string[]
}

// ---- Shared contract types (used by every theme and every mock API) ----

/** Home page data. Journals fill the fields their design needs. */
export type HomeData = J1HomeData

export interface PaymentProof { reference: string; fileName: string }

export type CertificateResult = { valid: true; article: ArticleSummary; author: string } | { valid: false }

export type SuggestFn = (q: string) => Promise<SearchSuggestions>
