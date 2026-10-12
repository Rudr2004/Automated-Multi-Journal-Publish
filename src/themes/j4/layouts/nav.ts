// Journal 4 navigation. Routes come from config/routes; policy slugs are shared by every journal.
import { policyLinks } from '../../../config/navigation'
import { paths } from '../../../config/routes'

export interface NavLinkItem { label: string; to: string; note?: string }
export interface NavMenu { id: 'authors' | 'policies'; label: string; links: NavLinkItem[] }

export const homeLink: NavLinkItem = { label: 'Home', to: paths.home }
/** Links between Home and the dropdowns, in the reference's order (Journal Details, Current Issue, APC Payment, Aims & Scope, Archives). */
export const primaryLinks: NavLinkItem[] = [
  { label: 'Journal Details', to: paths.about('journal-information') },
  { label: 'Current Issue', to: paths.currentIssue },
  { label: 'APC Payment', to: paths.forAuthors('apc-payment') },
  { label: 'Aims & Scope', to: paths.about('aims-scope') },
  { label: 'Archives', to: paths.pastIssues },
]
/** Links after the dropdowns: Join Editorial Board, Editorial Board, Contact Us. */
export const tailLinks: NavLinkItem[] = [
  { label: 'Join Editorial Board', to: paths.forAuthors('become-a-reviewer') },
  { label: 'Editorial Board', to: paths.editorialBoard },
  { label: 'Contact Us', to: paths.about('contact') },
]
export const editorialLink = tailLinks[1]

const feature = ['peer-review', 'publication-ethics', 'open-access', 'copyright-licensing', 'plagiarism']

/** Dropdowns, in the order they appear in the bar: For Authors, then Policies. */
export const menus: NavMenu[] = [
  {
    id: 'authors', label: 'For Authors',
    links: [
      { label: 'Submission Process', to: paths.forAuthors('submission-process') },
      { label: 'Author Guidelines', to: paths.policy('author-guidelines') },
      { label: 'Article Templates', to: paths.forAuthors('templates') },
      { label: 'APC & Payment', to: paths.forAuthors('apc-payment') },
      { label: 'Verify a Certificate', to: paths.verify() },
    ],
  },
  {
    id: 'policies', label: 'Policies',
    links: feature.map((s) => policyLinks.find((p) => p.slug === s)!).map((p) => ({ label: p.label, to: p.to })),
  },
]
