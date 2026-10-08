// The contract between the shared logic (core) and a journal's design (themes/<id>).
// A theme supplies display-only pages that receive data and callbacks as props; core containers load the data.
import { createContext, useContext, type ComponentType, type ReactNode } from 'react'
import type { AsyncState } from '../lib/useAsync'
import type { SubmissionForm } from '../lib/submission'
import type {
  ArticleFull, ArticleSummary, CertificateResult, ContactTicketInput, EditorProfile, HomeData, IssueData, IssueSummary,
  PaymentProof, ReviewerApplicationInput, StaticPageData, TrackResult,
} from '../types'

export interface BlockActions {
  onContact: (v: ContactTicketInput) => Promise<{ ticketId: string }>
  onReviewer: (v: ReviewerApplicationInput) => Promise<{ reference: string }>
}

export interface TrackPageProps {
  onTrack: (paperId: string, email: string) => Promise<TrackResult>
  onSendOtp: (email: string) => Promise<unknown>
  onVerifyOtp: (code: string) => Promise<boolean>
  onPay: (paperId: string) => Promise<unknown>
  onPaymentProof: (paperId: string, proof: PaymentProof) => Promise<unknown>
  /** Pre-filled values; when both are present the search runs on load. */
  initial?: { paperId?: string; email?: string }
}

export interface ThemePages {
  Home: ComponentType<{ data: HomeData; onSubscribe: (email: string) => Promise<void> }>
  Issue: ComponentType<{ data: IssueData }>
  PastIssues: ComponentType<{ issues: IssueSummary[]; articles: ArticleSummary[] }>
  Article: ComponentType<{ article: ArticleFull }>
  EditorialBoard: ComponentType<{ editors: EditorProfile[] }>
  Submit: ComponentType<{ onSubmit: (form: SubmissionForm) => Promise<{ paperId: string }>; initialPaperId?: string | null }>
  Track: ComponentType<TrackPageProps>
  Verify: ComponentType<{ initialId?: string; initialResult?: CertificateResult | null; onVerify: (id: string) => Promise<CertificateResult> }>
  Search: ComponentType<{ query: string; results: ArticleSummary[] }>
  Static: ComponentType<{ page: StaticPageData; sidebar: StaticPageData[]; allPages: StaticPageData[]; actions: BlockActions }>
  NotFound: ComponentType<{ what?: string }>
}

export type AsyncViewComponent = <T>(props: {
  state: AsyncState<T | null>
  skeleton?: ReactNode
  notFound?: ReactNode
  children: (data: T) => ReactNode
}) => ReactNode

export interface Theme {
  pages: ThemePages
  AsyncView: AsyncViewComponent
  /** Rendered once on the home page, outside the page layout (e.g. J1's exit-intent prompt). */
  HomeExtras?: ComponentType
}

const Ctx = createContext<Theme | null>(null)
export const ThemeProvider = Ctx.Provider

export function useTheme(): Theme {
  const t = useContext(Ctx)
  if (!t) throw new Error('useTheme must be used inside a theme')
  return t
}
