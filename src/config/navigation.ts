// Main navigation and policy list. Routes come from ./routes.
import { BASE, paths } from './routes'

export interface NavChild { label: string; to: string }
export interface MegaLink extends NavChild { description: string }
export interface MegaGroup { title: string; links: MegaLink[] }

export interface NavItem {
  label: string
  to: string
  /** Custom active-state rule; defaults to a path-prefix match. */
  match?: (pathname: string) => boolean
  children?: NavChild[]
  /** When set, the item opens a mega menu (desktop) made of these groups. */
  mega?: MegaGroup[]
}

export interface PolicyLink extends NavChild { slug: string }

const POLICIES: [label: string, slug: string][] = [
  ['Publication Ethics', 'publication-ethics'], ['Peer Review Process', 'peer-review'],
  ['Copyright and Licensing', 'copyright-licensing'], ['Open Access Policy', 'open-access'],
  ['Privacy Policy', 'privacy'], ['Plagiarism Policy', 'plagiarism'], ['AI Policy', 'ai-policy'],
  ['Conflict of Interest', 'conflict-of-interest'], ['Retraction Policy', 'retraction'],
  ['Corrections and Errata', 'corrections'], ['Archiving Policy', 'archiving'],
  ['Author Guidelines', 'author-guidelines'], ['Reviewer Guidelines', 'reviewer-guidelines'],
  ['Editorial Policy', 'editorial-policy'], ['Publication Charges', 'publication-charges'],
  ['Refund Policy', 'refund'], ['Complaints and Appeals', 'complaints'], ['Data Policy', 'data'],
]

export const policyLinks: PolicyLink[] = POLICIES.map(([label, slug]) => ({ label, slug, to: paths.policy(slug) }))

// These two policy pages are also reachable from the "For Authors" menu, so they count as that menu's active pages.
const authorPolicyPaths = [paths.policy('author-guidelines'), paths.policy('peer-review')]

const L = (label: string, to: string, description: string): MegaLink => ({ label, to, description })
const pol = (slug: string, description: string) => L(policyLinks.find((p) => p.slug === slug)!.label, paths.policy(slug), description)

const authorMega: MegaGroup[] = [
  { title: 'Prepare', links: [
    pol('author-guidelines', 'Article types, formatting and declarations.'),
    L('Article Templates', paths.forAuthors('templates'), 'Manuscript, cover letter and response templates.'),
  ] },
  { title: 'Submit and track', links: [
    L('Submission Process', paths.forAuthors('submission-process'), 'The eight stages from submission to indexing.'),
    L('Track My Paper', paths.track, 'Follow your paper with its Paper ID and email.'),
    L('APC & Payment', paths.forAuthors('apc-payment'), 'Charges, GST and how to pay.'),
  ] },
  { title: 'Review and recognition', links: [
    pol('peer-review', 'How editors and reviewers assess papers.'),
    L('Become a Reviewer', paths.forAuthors('become-a-reviewer'), 'Apply to review for the journal.'),
    L('Certificate Verification', paths.verify(), 'Check an author certificate by number or QR.'),
  ] },
]

const policyMega: MegaGroup[] = [
  { title: 'Integrity', links: [
    pol('publication-ethics', 'COPE-based standards for everyone.'), pol('plagiarism', 'Similarity checks and consequences.'),
    pol('ai-policy', 'Using AI tools responsibly.'), pol('conflict-of-interest', 'What to declare and when.'),
    pol('retraction', 'When and how articles are retracted.'), pol('corrections', 'Errata and corrigenda.'),
  ] },
  { title: 'Publishing', links: [
    pol('peer-review', 'Screening, review and decisions.'), pol('open-access', 'Free to read, share and reuse.'),
    pol('copyright-licensing', 'You keep copyright; CC BY 4.0.'), pol('archiving', 'Long-term preservation.'),
    pol('data', 'Data availability and sharing.'), pol('editorial-policy', 'Independence of editorial decisions.'),
  ] },
  { title: 'Authors and fees', links: [
    pol('author-guidelines', 'Before you submit.'), pol('reviewer-guidelines', 'For people who review.'),
    pol('publication-charges', 'The APC and what it covers.'), pol('refund', 'When refunds apply.'),
    pol('complaints', 'Appeals and complaints.'), pol('privacy', 'How we handle personal data.'),
  ] },
]

const flatten = (groups: MegaGroup[]): NavChild[] => groups.flatMap((g) => g.links.map(({ label, to }) => ({ label, to })))

export const nav: NavItem[] = [
  { label: 'Home', to: paths.home, match: (p) => p === paths.home },
  { label: 'Current Issue', to: paths.currentIssue },
  { label: 'Past Issues', to: paths.pastIssues, match: (p) => p.startsWith(paths.pastIssues) || p.startsWith(`${BASE}/issue/`) },
  { label: 'Editorial Board', to: paths.editorialBoard },
  {
    label: 'For Authors',
    to: paths.policy('author-guidelines'),
    match: (p) => p.startsWith(`${BASE}/for-authors`) || authorPolicyPaths.includes(p),
    mega: authorMega,
    children: flatten(authorMega),
  },
  {
    label: 'Policies',
    to: paths.policy('publication-ethics'),
    match: (p) => p.startsWith(`${BASE}/policies`) && !authorPolicyPaths.includes(p),
    mega: policyMega,
    children: flatten(policyMega),
  },
  {
    label: 'About',
    to: paths.about('aims-scope'),
    match: (p) => p.startsWith(`${BASE}/about`),
    children: [
      { label: 'Journal Information', to: paths.about('journal-information') },
      { label: 'Aims & Scope', to: paths.about('aims-scope') },
      { label: 'Indexing & Abstracting', to: paths.about('indexing') },
      { label: 'Contact', to: paths.about('contact') },
    ],
  },
]
