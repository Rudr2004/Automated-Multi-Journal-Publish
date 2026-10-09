// J1's own main navigation, derived from the shared config so labels, mega menus and routes stay in sync.
// Added for the J1 fix pass: 'For Reviewers' dropdown and a top-level 'APC Payment' link, plus corrected active-state rules.
// Not added (no page exists): Articles in Press, Conferences, Recognition.
import { BASE, paths } from '../../../config/routes'
import { nav as baseNav, type NavItem } from '../../../config/navigation'

const item = (label: string) => baseNav.find((n) => n.label === label)!
const apc = paths.forAuthors('apc-payment')
const reviewer = paths.forAuthors('become-a-reviewer')

export const j1Nav: NavItem[] = [
  item('Home'),
  item('Current Issue'),
  { ...item('Past Issues'), match: (p) => p.startsWith(paths.pastIssues) || p.startsWith(`${BASE}/issue/`) },
  item('Editorial Board'),
  // Every /for-authors/* page except the two that have their own top-level entries.
  { ...item('For Authors'), match: (p) => p.startsWith(`${BASE}/for-authors`) && p !== apc && p !== reviewer },
  {
    label: 'For Reviewers', to: paths.policy('reviewer-guidelines'), match: (p) => p === reviewer,
    children: [{ label: 'Reviewer Guidelines', to: paths.policy('reviewer-guidelines') }, { label: 'Become a Reviewer', to: reviewer }],
  },
  { label: 'APC Payment', to: apc, match: (p) => p === apc },
  // All /policies/* routes (peer review, author guidelines, reviewer guidelines...) highlight 'Policies'.
  { ...item('Policies'), match: (p) => p.startsWith(`${BASE}/policies`) },
  { ...item('About'), match: (p) => p.startsWith(`${BASE}/about`) },
]
