// Fake REST API shared by every journal (300–800ms latency). Each journal passes in its own dataset; the behaviour
// (ranking, suggestions, tracking, OTP, payment, certificate checks) is identical. Swap for real fetch calls later.
import type { JournalApi } from '../../core/api/types'
import type {
  ArticleFull, ArticleSummary, ContactTicketInput, EditorProfile, HomeData, IssueData, IssueSummary, ReviewerApplicationInput,
  SearchSuggestions, StaticGroup, StaticPageData, SubmissionInput, TrackResult, TrackedPaper,
} from '../../core/types'
import type { JournalConfig } from '../../config/journals/types'
import { respond } from './latency'

export interface MockDataset {
  journal: JournalConfig
  home: HomeData
  articles: ArticleSummary[]
  issues: IssueSummary[] // oldest → newest
  currentIssue: IssueSummary
  byId: (id: string) => ArticleSummary | undefined
  issueArticles: (volume: number, issue: number) => ArticleSummary[]
  buildFull: (a: ArticleSummary) => ArticleFull
  /** Extra search terms offered as keyword suggestions. */
  keywords: string[]
  subjects: readonly string[]
  editors: EditorProfile[]
  staticPages: StaticPageData[]
  findPaper: (paperId: string, email: string) => TrackResult
  newSubmission: (title: string, email: string, authorName: string) => TrackedPaper
}

const norm = (s: string) => s.toLowerCase()
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export function createMockApi(d: MockDataset): JournalApi {
  const { journal } = d

  /** Every search word must match somewhere; title and ID/DOI matches rank highest, then authors, subject and abstract. */
  function rankArticles(q: string): ArticleSummary[] {
    const tokens = norm(q).split(/\s+/).filter(Boolean)
    if (!tokens.length) return []
    return d.articles
      .map((a) => {
        const fields: [string, number][] = [[a.title, 3], [`${a.paperId} ${journal.doiPrefix}/${a.paperId}`, 3], [a.authors.join(' '), 2], [a.subject, 2], [a.type, 1], [a.abstract, 1]]
        let score = 0
        for (const t of tokens) {
          const hit = fields.filter(([text]) => norm(text).includes(t)).map(([, w]) => w)
          if (!hit.length) return { a, score: 0 }
          score += Math.max(...hit)
        }
        return { a, score }
      })
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score || y.a.views - x.a.views)
      .map((x) => x.a)
  }

  function buildSuggestions(q: string): SearchSuggestions {
    const term = q.trim()
    const tokens = norm(term).split(/\s+/).filter(Boolean)
    const out: SearchSuggestions = { articles: rankArticles(term).slice(0, 4), authors: [], keywords: [] }

    // Exact DOI (10.55041/JIMRT2026000045) or Paper ID (JIMRT2026000045).
    const id = term.toUpperCase().replace(new RegExp(`^${escapeRe(journal.doiPrefix)}/`), '')
    if (new RegExp(`^${escapeRe(journal.paperIdPrefix)}\\d{10}$`).test(id)) {
      out.direct = { paperId: id, via: term.includes('/') ? 'doi' : 'paper-id', article: d.byId(id) }
    }

    const counts = new Map<string, number>()
    d.articles.forEach((a) => a.authors.forEach((name) => { if (tokens.every((t) => norm(name).includes(t))) counts.set(name, (counts.get(name) ?? 0) + 1) }))
    out.authors = [...counts.entries()].sort((x, y) => y[1] - x[1]).slice(0, 3).map(([name, count]) => ({ name, count }))
    out.keywords = [...d.keywords, ...d.subjects].filter((k) => tokens.every((t) => norm(k).includes(t))).slice(0, 4)
    return out
  }

  const certRe = new RegExp(`^${escapeRe(journal.paperIdPrefix)}-CERT-(${escapeRe(journal.paperIdPrefix)}\\d{10})(?:-A(\\d))?$`)

  return {
    getHome: () => respond(() => d.home),
    getCurrentIssue: () => respond<IssueData>(() => ({ issue: d.currentIssue, articles: d.issueArticles(d.currentIssue.volume, d.currentIssue.issue) })),
    getIssue: (volume, issue) =>
      respond<IssueData | null>(() => {
        const meta = d.issues.find((i) => i.volume === volume && i.issue === issue)
        return meta ? { issue: meta, articles: d.issueArticles(volume, issue) } : null
      }),
    listArticles: () => respond(() => d.articles),
    listIssues: () => respond(() => [...d.issues].reverse()),
    getArticle: (id) => respond<ArticleFull | null>(() => { const a = d.byId(id); return a ? d.buildFull(a) : null }),
    searchArticles: (q) => respond<ArticleSummary[]>(() => rankArticles(q)),
    /** Fast typeahead grouped as Articles, Authors and Keywords, with a direct hit for a DOI or Paper ID. */
    suggest: (q) => new Promise<SearchSuggestions>((resolve) => setTimeout(() => resolve(buildSuggestions(q)), 150)),
    getStaticPage: (slug) => respond(() => d.staticPages.find((p) => p.slug === slug) ?? null),
    listStaticPages: (group?: StaticGroup) => respond(() => (group ? d.staticPages.filter((p) => p.group === group) : d.staticPages)),
    listEditors: () => respond(() => d.editors),
    submitTicket: (input: ContactTicketInput) => respond(() => ({ ticketId: `TKT-${String(1000 + Math.floor(Math.random() * 9000))}`, email: input.email })),
    applyAsReviewer: (_input: ReviewerApplicationInput) => respond(() => ({ reference: `REV-${String(1000 + Math.floor(Math.random() * 9000))}` })),
    subscribe: (email) =>
      new Promise<void>((resolve, reject) =>
        setTimeout(() => (/^\S+@\S+\.\S+$/.test(email) ? resolve() : reject(new Error('Invalid email'))), 500),
      ),
    trackPaper: (paperId, email) => respond(() => d.findPaper(paperId, email)),
    submitManuscript: (input: SubmissionInput) => respond(() => d.newSubmission(input.title, input.email, input.authorName)),
    sendOtp: (_email) => respond(() => ({ sent: true })),
    verifyOtp: (code) => respond(() => code === '123456'),
    /** Online payment (Razorpay for INR, Stripe for USD in production). */
    payApc: (_paperId) => respond(() => ({ paid: true })),
    /** Author uploads a UPI / bank transfer proof; the editor verifies it. */
    submitPaymentProof: (_paperId, _proof) => respond(() => ({ status: 'verifying' as const })),
    verifyCertificate: (id) =>
      respond(() => {
        const m = id.trim().toUpperCase().match(certRe)
        const a = m && d.byId(m[1])
        return a ? { valid: true as const, article: a, author: a.authors[Math.max(0, Number(m![2] ?? 1) - 1)] ?? a.authors[0] } : { valid: false as const }
      }),
  }
}
