// Journal 3 navigation. Routes come from config/routes; policy slugs are shared by every journal.
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'

export interface NavLinkItem { label: string; to: string; note?: string }
export interface NavMenu { id: 'authors' | 'about'; label: string; links: NavLinkItem[] }

export const primaryLinks: NavLinkItem[] = [
  { label: 'Current Issue', to: paths.currentIssue },
  { label: 'Past Issues', to: paths.pastIssues },
]

export const editorialLink: NavLinkItem = { label: 'Editorial Board', to: paths.editorialBoard }

const feature = ['publication-ethics', 'peer-review', 'open-access', 'copyright-licensing', 'plagiarism']

export const menus: NavMenu[] = [
  {
    id: 'authors', label: 'For Authors',
    links: [
      { label: 'Submission Process', to: paths.forAuthors('submission-process'), note: 'From upload to publication' },
      { label: 'Author Guidelines', to: paths.policy('author-guidelines'), note: 'Format and ethics checklist' },
      { label: 'Article Templates', to: paths.forAuthors('templates') },
      { label: 'APC & Payment', to: paths.forAuthors('apc-payment'), note: 'Charges, GST and receipts' },
      { label: 'Become a Reviewer', to: paths.forAuthors('become-a-reviewer') },
      { label: 'Verify a Certificate', to: paths.verify() },
    ],
  },
  {
    id: 'about', label: 'About',
    links: [
      { label: 'Aims & Scope', to: paths.about('aims-scope') },
      { label: 'Journal Information', to: paths.about('journal-information') },
      { label: 'Indexing', to: paths.about('indexing') },
      { label: 'Contact', to: paths.about('contact') },
      ...feature.map((s) => policyLinks.find((p) => p.slug === s)!).map((p) => ({ label: p.label, to: p.to })),
    ],
  },
]
