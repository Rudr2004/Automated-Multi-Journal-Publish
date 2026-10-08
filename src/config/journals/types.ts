// Shape of a journal's configuration. Every journal (j1 … j5) provides one of these in src/config/journals/<id>.ts.

export type JournalId = 'j1' | 'j2' | 'j3' | 'j4'

/** An indexing / verification logo from /public/shared/indexing. Only entries with `show: true` appear on the site. */
export interface IndexLogo {
  id: string
  name: string
  /** File in /public/shared/indexing — used as supplied (never recoloured, stretched or cropped). */
  file: string
  /** Where authors can check the listing themselves. */
  verifyUrl: string
  /** client to confirm: set to false until the journal is genuinely listed. */
  show: boolean
  /** One-line description for the Indexing page. */
  description: string
  /** What the listing means for authors (shown in the verify popover). */
  meaning: string
  /** The journal's listing status, as stated in the popover. */
  status: string
}

export interface TrustItem { id: string; icon: string; title: string; text: string; to: string }
export interface Stat { id: string; label: string; value: string; show: boolean; /** Short line under the label. */ caption?: string }

/** A subject area / discipline with its display colour (used by themes that browse by discipline). */
export interface Discipline { id: string; name: string; icon: string; color: string }

/** Optional badges a journal can claim. client to confirm: keep a badge off until it is genuinely true. */
export interface BadgeFlags {
  peerReviewed: boolean
  openAccess: boolean
  doubleBlind: boolean
  cope: boolean
}

export interface JournalConfig {
  id: JournalId
  /** First part of every public URL, e.g. "ijmat" → /ijmat/article/… */
  slug: string
  name: string
  shortName: string
  tagline: string
  /** Small line under the journal name in the header. */
  descriptor: string
  mission: string
  publisher: string
  publisherCity: string
  /** Prefix of every Paper ID, e.g. "IJMAT" → IJMAT2026000123. */
  paperIdPrefix: string
  issnOnline: string
  doiPrefix: string
  domain: string
  frequency: string
  licence: { name: string; url: string }
  apc: { inr: number; usd: number; gstPercent: number }
  email: string
  whatsapp: string
  address: string
  location: { lat: number; lng: number }
  subjects: readonly string[]
  follow: readonly { id: string; label: string; href: string }[]
  /** Scrolling announcements; `live` adds the "closes in …" text. */
  announcements: readonly { id: string; text: string; to: string; live: boolean; highlight: boolean }[]
  /** Rows of the "Journal Information" table. */
  info: readonly (readonly [string, string])[]
  /** "Browse by subject" index. */
  subjectIndex: readonly string[]
  nextIssue: { label: string; deadline: string; expectedPublication: string }
  trustBadges: readonly { id: string; label: string; icon: string; show: boolean }[]
  trustLedger: readonly TrustItem[]
  logos: readonly IndexLogo[]
  heroStats: readonly Stat[]
  statsTable: readonly Stat[]
  /** Browser tab: title, favicon (path under /public) and the mobile browser colour. */
  branding: { pageTitle: string; favicon: string; /** Optional 180px icon for phone home screens. */ touchIcon?: string; themeColor: string }
  /** Badge toggles; themes read these instead of hard-coding claims. */
  badges: BadgeFlags
  /** Disciplines for themes that browse by discipline. */
  disciplines?: readonly Discipline[]
}
