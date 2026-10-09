// Single source of truth for Journal 5 (IJFRD): identity, charges, trust items, index logos, research areas and badge switches.
// Routes live in ../routes. Comments marked "client to confirm" are placeholders the client must verify before launch.
import { paths } from '../routes'
import type { Discipline, IndexLogo, JournalConfig } from './types'

const DAY = 86400000

/** Research areas ("areas") IJFRD publishes under. Colours are used for small markers; each passes 3:1 against white. */
export const j5Areas: readonly Discipline[] = [
  { id: 'physics', name: 'Physics & Astronomy', icon: 'physics', color: '#701A1E' },
  { id: 'chemistry', name: 'Chemistry & Chemical Sciences', icon: 'chemistry', color: '#B45309' },
  { id: 'materials', name: 'Materials Science & Nanotechnology', icon: 'materials', color: '#0F766E' },
  { id: 'life', name: 'Life Sciences & Biotechnology', icon: 'life', color: '#15803D' },
  { id: 'earth', name: 'Earth & Environmental Sciences', icon: 'earth', color: '#0369A1' },
  { id: 'math', name: 'Mathematics & Statistics', icon: 'math', color: '#4338CA' },
  { id: 'computational', name: 'Computational Science & Data', icon: 'computational', color: '#6D28D9' },
  { id: 'engineering', name: 'Engineering Fundamentals', icon: 'engineering', color: '#475569' },
  { id: 'development', name: 'Technology, Policy & Development', icon: 'development', color: '#9D174D' },
]

const logo = (id: string, name: string, file: string, verifyUrl: string, show: boolean, description: string, meaning: string, status: string): IndexLogo =>
  ({ id, name, file, verifyUrl, show, description, meaning, status })

export const journal: JournalConfig = {
  id: 'j5',
  slug: 'ijfrd',
  name: 'International Journal of Fundamental Research and Development',
  shortName: 'IJFRD',
  tagline: 'Foundations first: research that others build on',
  descriptor: 'Peer-reviewed · Open access · Fundamental research and development',
  mission:
    'IJFRD is a monthly open access journal for fundamental research and the development that follows from it, with structured peer review, permanent DOIs and verifiable author certificates.',
  publisher: 'EdTech Publishers (OPC) Private Limited',
  publisherCity: 'Bengaluru, India',
  paperIdPrefix: 'IJFRD', // e.g. IJFRD2026000112
  issnOnline: '1234-5678', // client to confirm
  doiPrefix: '10.55041',
  domain: 'ijfrd.org', // client to confirm
  frequency: 'Monthly',
  licence: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  apc: { inr: 6000, usd: 110, gstPercent: 18 }, // [INR] / [USD] — client to confirm; GST for Indian authors only
  email: 'editor@ijfrd.org', // client to confirm
  whatsapp: '+91 90000 00005', // client to confirm
  address: 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016',
  location: { lat: 13.0306, lng: 77.6593 },
  subjects: j5Areas.map((d) => d.name),
  follow: [
    { id: 'rss', label: 'RSS feed', href: '#' },
    { id: 'mail', label: 'Email alerts', href: '#' },
    { id: 'web', label: 'Website', href: '#' },
  ],

  info: [
    ['Title', 'International Journal of Fundamental Research and Development'],
    ['Frequency', 'Monthly'],
    ['Starting Year', '2026'], // client to confirm
    ['ISSN (Online)', '1234-5678'], // client to confirm
    ['Publisher', 'EdTech Publishers (OPC) Private Limited'],
    ['Subject', 'Fundamental research and development'],
    ['Language', 'English'],
    ['Publication Format', 'Online'],
    ['Licence', 'Open Access, CC BY 4.0'],
    ['Email', 'editor@ijfrd.org'],
    ['Website', 'ijfrd.org'],
    ['Address', 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016'],
  ],

  subjectIndex: j5Areas.map((d) => d.name),

  announcements: [
    { id: 'cfp', text: 'Call for Papers: Volume 1, Issue 10', to: paths.submit, live: true, highlight: false },
    { id: 'doi', text: 'Every IJFRD article receives a permanent Crossref DOI', to: paths.about('indexing'), live: false, highlight: false },
  ],

  nextIssue: { label: 'Volume 1, Issue 10 — October 2026', deadline: new Date(Date.now() + 12 * DAY).toISOString(), expectedPublication: '2026-10-30' },

  trustBadges: [
    { id: 'peer', label: 'Peer Reviewed', icon: 'shield-check', show: true },
    { id: 'oa', label: 'Open Access', icon: 'unlock', show: true },
    { id: 'doi', label: 'Crossref DOI', icon: 'link', show: true },
  ],

  trustLedger: [
    { id: 'review', icon: 'shield-check', title: 'Structured peer review', text: 'Every paper is screened by an editor and reviewed by experts against a published checklist. Decisions come with written reasons.', to: paths.policy('peer-review') },
    { id: 'oa', icon: 'unlock', title: 'Open access', text: 'Every article is free to read, share and reuse under CC BY 4.0. Authors keep their copyright.', to: paths.policy('open-access') },
    { id: 'doi', icon: 'link', title: 'A permanent DOI', text: 'Each article gets a DOI under 10.55041, registered with Crossref.', to: paths.policy('archiving') },
    { id: 'cert', icon: 'award', title: 'Verifiable certificates', text: 'Every author certificate carries a QR code that anyone can scan to confirm it is genuine.', to: paths.verify() },
  ],

  // Only Crossref and Google Scholar are switched on; the rest stay off until the client confirms each listing.
  logos: [
    logo('crossref', 'Crossref', '', 'https://search.crossref.org/', true, 'DOI registration agency; every IJFRD article has a Crossref DOI.', 'Your article gets a permanent, citable DOI that resolves to its page.', 'Active'),
    logo('scholar', 'Google Scholar', 'google-scholar.png', 'https://scholar.google.com/', true, 'Article pages carry Scholar-compatible metadata so papers can be found and cited.', 'Your article can be found by researchers searching Google Scholar.', 'Monitored'),
    logo('openalex', 'OpenAlex', 'openalex.png', 'https://openalex.org/', false, 'Open catalogue of scholarly works, authors and citations.', 'Your paper appears in an open research graph.', 'Not yet listed'),
    logo('semantic', 'Semantic Scholar', 'semantic-scholar.png', 'https://www.semanticscholar.org/', false, 'AI-assisted research discovery tool.', 'Readers can discover your paper through recommendations.', 'Not yet listed'),
    logo('worldcat', 'WorldCat', 'worldcat.png', 'https://search.worldcat.org/', false, 'The world’s largest library catalogue.', 'Libraries can find and link to the journal.', 'Not yet listed'),
    logo('zenodo', 'Zenodo', 'zenodo.png', 'https://zenodo.org/', false, 'Open repository for long-term preservation.', 'A permanent copy of your article is preserved.', 'Not yet listed'),
    logo('researchgate', 'ResearchGate', 'researchgate.png', 'https://www.researchgate.net/', false, 'Professional network where researchers share work.', 'Add your article to your profile.', 'Not yet listed'),
    logo('mendeley', 'Mendeley', 'mendeley.png', 'https://www.mendeley.com/', false, 'Reference manager and research network.', 'Import references with one click.', 'Not yet listed'),
    logo('ssrn', 'Elsevier SSRN', 'ssrn.png', 'https://www.ssrn.com/', false, 'Early-stage research sharing.', 'Reach readers in applied fields.', 'Not yet listed'),
    logo('ebsco', 'EBSCO', 'ebsco.png', 'https://www.ebsco.com/', false, 'Research databases used by libraries.', 'Libraries can surface your article.', 'Not yet listed'),
    logo('thomson', 'Thomson Reuters', 'thomson-reuters.jpg', 'https://www.thomsonreuters.com/', false, 'Research identification services.', 'Identifiers help attribute your work.', 'Not yet listed'),
    logo('issn', 'ISSN', 'issn.png', 'https://portal.issn.org/', false, 'International Standard Serial Number.', 'The journal is uniquely identified worldwide.', 'Not yet registered'),
    logo('sjif', 'SJIF', 'sjif.png', 'https://sjifactor.com/', false, 'Scientific Journal Impact Factor rating.', 'A recognised journal-quality rating.', 'Not yet rated'),
    logo('iso', 'ISO 9001:2015', 'iso-9001.png', 'https://www.iso.org/standard/62085.html', false, 'Quality management certification.', 'Audited publishing workflow.', 'Not certified'),
  ],

  // A new journal: no impact figures. Anything the client has not provided stays hidden.
  heroStats: [],
  statsTable: [],

  branding: { pageTitle: 'IJFRD | International Journal of Fundamental Research and Development', favicon: '/journals/j5/favicon-48.png', touchIcon: '/journals/j5/favicon-180.png', themeColor: '#701A1E' },
  // Badges are off until the client confirms the policy is real. Peer review and open access are true today.
  badges: { peerReviewed: true, openAccess: true, doubleBlind: false, cope: false },
  disciplines: j5Areas,
}
