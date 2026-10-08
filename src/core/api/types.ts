// What every journal's data source must provide. The mock APIs implement it now; a real REST client can replace them later.
import type {
  ArticleFull, ArticleSummary, CertificateResult, ContactTicketInput, EditorProfile, HomeData, IssueData, IssueSummary, PaymentProof,
  ReviewerApplicationInput, SearchSuggestions, StaticGroup, StaticPageData, SubmissionInput, TrackResult, TrackedPaper,
} from '../types'

export interface JournalApi {
  getHome: () => Promise<HomeData>
  getCurrentIssue: () => Promise<IssueData>
  getIssue: (volume: number, issue: number) => Promise<IssueData | null>
  listArticles: () => Promise<ArticleSummary[]>
  listIssues: () => Promise<IssueSummary[]>
  getArticle: (id: string) => Promise<ArticleFull | null>
  searchArticles: (q: string) => Promise<ArticleSummary[]>
  suggest: (q: string) => Promise<SearchSuggestions>
  getStaticPage: (slug: string) => Promise<StaticPageData | null>
  listStaticPages: (group?: StaticGroup) => Promise<StaticPageData[]>
  listEditors: () => Promise<EditorProfile[]>
  submitTicket: (input: ContactTicketInput) => Promise<{ ticketId: string; email: string }>
  applyAsReviewer: (input: ReviewerApplicationInput) => Promise<{ reference: string }>
  subscribe: (email: string) => Promise<void>
  trackPaper: (paperId: string, email: string) => Promise<TrackResult>
  submitManuscript: (input: SubmissionInput) => Promise<TrackedPaper>
  sendOtp: (email: string) => Promise<unknown>
  verifyOtp: (code: string) => Promise<boolean>
  payApc: (paperId: string) => Promise<unknown>
  submitPaymentProof: (paperId: string, proof: PaymentProof) => Promise<unknown>
  verifyCertificate: (id: string) => Promise<CertificateResult>
}
