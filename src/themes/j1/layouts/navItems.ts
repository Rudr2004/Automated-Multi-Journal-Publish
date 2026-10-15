// J1's main navigation, following the client's "Header" sheet (every column and every drop-down entry, in the same order):
//   Home · Current Issue · Archives · Articles in Press · Conferences ▾ · For Author ▾ · Policies ▾ · For Reviewers ▾ ·
//   For Guide/Institution ▾ · APC Payment · Editorial Board · Contact Us · Track Paper / Dashboard
// Entries that already have a page link to it. Entries whose page is not built yet link to a "coming soon" page (see j1Placeholders),
// so every menu item works today and only its destination needs filling in later.
import { BASE, paths } from '../../../config/routes'
import type { NavItem } from '../../../config/navigation'

const route = {
  articlesInPress: `${BASE}/articles-in-press`,
  conferenceCollaboration: `${BASE}/conferences/collaboration`,
  conferenceProposal: `${BASE}/conferences/submit-proposal`,
  recentConferences: `${BASE}/conferences/recent`,
  callForPapers: paths.forAuthors('call-for-papers'),
  faq: paths.forAuthors('faq'),
  bestPaperAward: paths.policy('best-paper-award'),
  bestMentorAward: paths.policy('best-research-mentor-award'),
  terms: paths.policy('terms-and-conditions'),
  reviewerAcknowledgement: `${BASE}/for-reviewers/acknowledgement`,
}

/** Pages that are in the menu but not built yet: [path relative to the journal address, title]. Rendered by the shared ComingSoon page. */
export const j1Placeholders: [path: string, title: string][] = [
  ['articles-in-press', 'Articles in Press'],
  ['conferences/collaboration', 'Conference Collaboration'],
  ['conferences/submit-proposal', 'Submit Conference Proposal'],
  ['conferences/recent', 'Recent Conferences'],
  ['for-authors/call-for-papers', 'Call for Papers'],
  ['for-authors/faq', 'FAQ'],
  ['policies/best-paper-award', 'Best Paper Award Policy'],
  ['policies/best-research-mentor-award', 'Best Research Mentor Award Policy'],
  ['policies/terms-and-conditions', 'Terms and Conditions'],
  ['for-reviewers/acknowledgement', 'Reviewer Acknowledgement'],
  ['reviewer-login', 'Reviewer Login'],
]

// A page belongs to ONE top-level item (the first rule below that claims it), so exactly one item is highlighted.
const authorPaths = [
  paths.policy('author-guidelines'), paths.forAuthors('submission-process'), paths.about('aims-scope'), route.callForPapers, route.faq,
]
const reviewerPaths = [paths.policy('reviewer-guidelines'), paths.forAuthors('become-a-reviewer'), route.reviewerAcknowledgement]
const institutionPaths = [route.terms]

export const j1Nav: NavItem[] = [
  { label: 'Home', to: paths.home, match: (p) => p === paths.home },
  { label: 'Current Issue', to: paths.currentIssue },
  { label: 'Archives', to: paths.pastIssues, match: (p) => p.startsWith(paths.pastIssues) || p.startsWith(`${BASE}/issue/`) },
  { label: 'Articles in Press', to: route.articlesInPress },
  {
    label: 'Conferences', to: route.conferenceCollaboration, match: (p) => p.startsWith(`${BASE}/conferences`),
    children: [
      { label: 'Conference Collaboration', to: route.conferenceCollaboration },
      { label: 'Submit Conference Proposal (Contact Form)', to: route.conferenceProposal },
      { label: 'Recent Conferences', to: route.recentConferences },
    ],
  },
  {
    label: 'For Authors', to: paths.policy('author-guidelines'), match: (p) => authorPaths.includes(p),
    children: [
      { label: 'Guidelines', to: paths.policy('author-guidelines') },
      { label: 'Article Processing Charges', to: paths.policy('publication-charges') },
      { label: 'Publication Procedure', to: paths.forAuthors('submission-process') },
      { label: 'Research Topics', to: paths.about('aims-scope') },
      { label: 'Publication Ethics', to: paths.policy('publication-ethics') },
      { label: 'Copyright Infringement', to: paths.policy('copyright-licensing') },
      { label: 'Call for Papers', to: route.callForPapers },
      { label: 'FAQ', to: route.faq },
    ],
  },
  {
    label: 'Policies', to: paths.policy('peer-review'),
    match: (p) => p.startsWith(`${BASE}/policies`) && !authorPaths.includes(p) && !reviewerPaths.includes(p) && !institutionPaths.includes(p),
    children: [
      { label: 'Peer Review Policy', to: paths.policy('peer-review') },
      { label: 'Refund and Cancellation Policy', to: paths.policy('refund') },
      { label: 'Privacy Policy', to: paths.policy('privacy') },
      { label: 'Publication Ethics and Malpractice Statement', to: paths.policy('publication-ethics') },
      { label: 'Data Availability and Research Integrity Policy', to: paths.policy('data') },
      { label: 'Fee Policy', to: paths.policy('publication-charges') },
      { label: 'Conflict of Interest Policy', to: paths.policy('conflict-of-interest') },
      { label: 'Retraction, Correction, and Expression of Concern Policy', to: paths.policy('retraction') },
      { label: 'Open Access Policy', to: paths.policy('open-access') },
      { label: 'Digital Preservation Policy', to: paths.policy('archiving') },
      { label: 'Plagiarism Policy', to: paths.policy('plagiarism') },
      { label: 'AI Policy', to: paths.policy('ai-policy') },
      { label: 'Best Paper Award Policy', to: route.bestPaperAward },
      { label: 'Best Research Mentor Award Policy', to: route.bestMentorAward },
    ],
  },
  {
    label: 'For Reviewers', to: paths.policy('reviewer-guidelines'), match: (p) => reviewerPaths.includes(p),
    children: [
      { label: 'Reviewers Guidelines', to: paths.policy('reviewer-guidelines') },
      { label: 'Review Process', to: paths.policy('peer-review') },
      { label: 'Become a Reviewer', to: paths.forAuthors('become-a-reviewer') },
      { label: 'Reviewer Acknowledgement', to: route.reviewerAcknowledgement },
    ],
  },
  {
    label: 'For Guide/Institution', to: route.conferenceCollaboration, match: (p) => institutionPaths.includes(p),
    children: [
      { label: 'Conference Collaboration', to: route.conferenceCollaboration },
      { label: 'Terms and Conditions', to: route.terms },
    ],
  },
  { label: 'APC Payment', to: paths.forAuthors('apc-payment'), match: (p) => p === paths.forAuthors('apc-payment') },
  { label: 'Editorial Board', to: paths.editorialBoard },
  { label: 'Contact Us', to: paths.about('contact'), match: (p) => p === paths.about('contact') },
  { label: 'Track Paper / Dashboard', to: paths.track },
]
