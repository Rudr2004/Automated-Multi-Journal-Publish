// Journal 2 navigation. Routes come from config/routes; policy slugs are shared by every journal.
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'

export interface NavLinkItem { label: string; to: string; note?: string }
export interface NavMenu { id: 'authors' | 'policies' | 'about'; label: string; groups: { title: string; links: NavLinkItem[] }[] }

export const homeLink: NavLinkItem = { label: 'Home', to: paths.home }

export const primaryLinks: NavLinkItem[] = [
  { label: 'Current Issue', to: paths.currentIssue },
  { label: 'Past Issues', to: paths.pastIssues },
]

export const editorialLink: NavLinkItem = { label: 'Editorial Board', to: paths.editorialBoard }
export const apcLink: NavLinkItem = { label: 'APC & Payment', to: paths.forAuthors('apc-payment') }

const feature = ['publication-ethics', 'peer-review', 'open-access', 'copyright-licensing', 'plagiarism', 'ai-policy']

export const menus: NavMenu[] = [
  {
    id: 'authors', label: 'For Authors',
    groups: [
      { title: 'Publish with us', links: [
        { label: 'Submission Process', to: paths.forAuthors('submission-process'), note: 'From upload to publication' },
        { label: 'Author Guidelines', to: paths.policy('author-guidelines'), note: 'Format and ethics checklist' },
        { label: 'Article Templates', to: paths.forAuthors('templates'), note: 'Word and LaTeX' },
        { label: 'APC & Payment', to: paths.forAuthors('apc-payment'), note: 'Charges, GST and receipts' },
      ] },
      { title: 'After you submit', links: [
        { label: 'Track My Paper', to: paths.track, note: 'No login needed' },
        { label: 'Verify a Certificate', to: paths.verify(), note: 'Scan or enter the ID' },
        { label: 'Become a Reviewer', to: paths.forAuthors('become-a-reviewer'), note: 'Join our reviewer pool' },
      ] },
    ],
  },
  {
    id: 'policies', label: 'Policies',
    groups: [
      { title: 'Core policies', links: [
        ...feature.map((s) => policyLinks.find((p) => p.slug === s)!).map((p) => ({ label: p.label, to: p.to })),
        { label: 'All policies', to: paths.policy('publication-ethics') },
      ] },
    ],
  },
  {
    id: 'about', label: 'About',
    groups: [
      { title: 'The journal', links: [
        { label: 'Aims & Scope', to: paths.about('aims-scope') },
        { label: 'Journal Information', to: paths.about('journal-information') },
        { label: 'Indexing', to: paths.about('indexing') },
        { label: 'Contact', to: paths.about('contact') },
      ] },
    ],
  },
]
