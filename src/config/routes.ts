// Every URL in the journal site is built here, so pages and components never hard-code paths.
import type { StaticGroup } from '../core/types'
import { activeSlug } from './journals/ids'

/** The journal's public address is based on its short name: /<slug>/... (on its own domain this prefix is dropped). */
export const JOURNAL_SLUG = activeSlug
export const BASE = `/${JOURNAL_SLUG}`

export const paths = {
  home: BASE,
  currentIssue: `${BASE}/current-issue`,
  pastIssues: `${BASE}/past-issues`,
  editorialBoard: `${BASE}/editorial-board`,
  submit: `${BASE}/submit`,
  track: `${BASE}/track`,
  pay: `${BASE}/track?pay=1`,
  apc: `${BASE}#apc-payment`,
  editorialLogin: `${BASE}/editorial-login`,
  article: (id: string) => `${BASE}/article/${id}`,
  /** Public PDF address of an article (the URL given to Google Scholar as citation_pdf_url). */
  pdf: (id: string) => `/pdf/${id}.pdf`,
  issue: (volume: number, issue: number) => `${BASE}/issue/${volume}/${issue}`,
  search: (q: string) => `${BASE}/search?q=${encodeURIComponent(q)}`,
  verify: (id = '') => `${BASE}/verify-certificate${id ? `?id=${encodeURIComponent(id)}` : ''}`,
  policy: (slug: string) => `${BASE}/policies/${slug}`,
  forAuthors: (slug: string) => `${BASE}/for-authors/${slug}`,
  about: (slug: string) => `${BASE}/about/${slug}`,
}

/** Path of a static page, given its group and slug. */
export const staticPath = (group: StaticGroup, slug: string) =>
  group === 'policies' ? paths.policy(slug) : group === 'for-authors' ? paths.forAuthors(slug) : paths.about(slug)

/** Landing page for each static group (used by breadcrumbs). */
export const staticGroups: Record<StaticGroup, { label: string; to: string }> = {
  policies: { label: 'Policies', to: paths.policy('publication-ethics') },
  'for-authors': { label: 'For Authors', to: paths.policy('author-guidelines') },
  about: { label: 'About', to: paths.about('aims-scope') },
}
