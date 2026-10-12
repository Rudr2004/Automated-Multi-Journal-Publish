// Journal 5 navigation. Routes come from config/routes; policy slugs are shared by every journal.
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'

export interface NavLinkItem { label: string; to: string; note?: string }
export interface NavMenu { id: 'authors' | 'about'; label: string; links: NavLinkItem[] }
export interface NavDropdown { id: string; label: string; links: NavLinkItem[] }

export const primaryLinks: NavLinkItem[] = [
  { label: 'Current Issue', to: paths.currentIssue },
  { label: 'Past Issues', to: paths.pastIssues },
]
export const editorialLink: NavLinkItem = { label: 'Editorial Board', to: paths.editorialBoard }


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
    ],
  },
]

/** Reviewer menu of the navigation bar (all pages already exist in the journal). */
export const reviewerMenu: NavDropdown = {
  id: 'reviewers', label: 'For Reviewers',
  links: [
    { label: 'Reviewer Guidelines', to: paths.policy('reviewer-guidelines') },
    { label: 'Peer Review Process', to: paths.policy('peer-review') },
    { label: 'Become a Reviewer', to: paths.forAuthors('become-a-reviewer') },
    { label: 'Conflict of Interest', to: paths.policy('conflict-of-interest') },
  ],
}

/** Policies menu: every policy page of the journal. */
export const policiesMenu: NavDropdown = { id: 'policies', label: 'Policies', links: policyLinks.map((p) => ({ label: p.label, to: p.to })) }

export const apcLink: NavLinkItem = { label: 'APC Payment', to: paths.forAuthors('apc-payment') }
export const contactLink: NavLinkItem = { label: 'Contact Us', to: paths.about('contact') }
