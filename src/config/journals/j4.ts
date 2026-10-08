// Single source of truth for Journal 4 (IJECM): identity, charges, trust items, index logos, research areas and badge switches.
// Routes live in ../routes. Comments marked "client to confirm" are placeholders the client must verify before launch.
import { paths } from '../routes'
import type { Discipline, IndexLogo, JournalConfig } from './types'

const DAY = 86400000

/** Research areas ("areas") IJECM publishes under. Colours are used for small markers; each passes 3:1 against white. */
export const j4Areas: readonly Discipline[] = [
  { id: 'civil', name: 'Civil & Structural Engineering', icon: 'civil', color: '#0369A1' },
  { id: 'mechanical', name: 'Mechanical & Manufacturing', icon: 'mechanical', color: '#B45309' },
  { id: 'electrical', name: 'Electrical & Power Systems', icon: 'electrical', color: '#A16207' },
  { id: 'electronics', name: 'Electronics & Embedded Systems', icon: 'electronics', color: '#0F766E' },
  { id: 'computing', name: 'Computer & Control Engineering', icon: 'computing', color: '#4338CA' },
  { id: 'industrial', name: 'Industrial & Systems Engineering', icon: 'industrial', color: '#475569' },
  { id: 'operations', name: 'Operations & Supply Chain', icon: 'operations', color: '#15803D' },
  { id: 'project', name: 'Project & Engineering Management', icon: 'project', color: '#B91C1C' },
  { id: 'infrastructure', name: 'Smart & Sustainable Infrastructure', icon: 'infrastructure', color: '#0E7490' },
]

const logo = (id: string, name: string, file: string, verifyUrl: string, show: boolean, description: string, meaning: string, status: string): IndexLogo =>
  ({ id, name, file, verifyUrl, show, description, meaning, status })

export const journal: JournalConfig = {
  id: 'j4',
  slug: 'ijecm',
  name: 'International Journal of Engineering Concepts and Management',
  shortName: 'IJECM',
  tagline: 'Engineering research, precisely reported',
  descriptor: 'Peer-reviewed · Open access · Engineering and management',
  mission:
    'IJECM is a monthly open access journal for engineering research and engineering management, with structured peer review, permanent DOIs and verifiable author certificates.',
  publisher: 'EdTech Publishers (OPC) Private Limited',
  publisherCity: 'Bengaluru, India',
  paperIdPrefix: 'IJECM', // e.g. IJECM2026000112
  issnOnline: '1234-5678', // client to confirm
  doiPrefix: '10.55041',
  domain: 'ijecm.org', // client to confirm
  frequency: 'Monthly',
  licence: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  apc: { inr: 6000, usd: 110, gstPercent: 18 }, // [INR] / [USD] — client to confirm; GST for Indian authors only
  email: 'editor@ijecm.org', // client to confirm
  whatsapp: '+91 90000 00003', // client to confirm
  address: 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016',
  location: { lat: 13.0306, lng: 77.6593 },
  subjects: j4Areas.map((d) => d.name),
  follow: [
    { id: 'rss', label: 'RSS feed', href: '#' },
    { id: 'mail', label: 'Email alerts', href: '#' },
    { id: 'web', label: 'Website', href: '#' },
  ],

  info: [
    ['Title', 'International Journal of Engineering Concepts and Management'],
    ['Frequency', 'Monthly'],
    ['Starting Year', '2026'], // client to confirm
    ['ISSN (Online)', '1234-5678'], // client to confirm
    ['Publisher', 'EdTech Publishers (OPC) Private Limited'],
    ['Subject', 'Engineering and engineering management'],
    ['Language', 'English'],
    ['Publication Format', 'Online'],
    ['Licence', 'Open Access, CC BY 4.0'],
    ['Email', 'editor@ijecm.org'],
    ['Website', 'ijecm.org'],
    ['Address', 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016'],
  ],

  subjectIndex: j4Areas.map((d) => d.name),

  announcements: [
    { id: 'cfp', text: 'Call for Papers: Volume 1, Issue 10', to: paths.submit, live: true, highlight: false },
    { id: 'doi', text: 'Every IJECM article receives a permanent Crossref DOI', to: paths.about('indexing'), live: false, highlight: false },
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
    logo('crossref', 'Crossref', '', 'https://search.crossref.org/', true, 'DOI registration agency; every IJECM article has a Crossref DOI.', 'Your article gets a permanent, citable DOI that resolves to its page.', 'Active'),
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

  branding: { pageTitle: 'IJECM | International Journal of Engineering Concepts and Management', favicon: '/journals/j4/favicon-48.png', touchIcon: '/journals/j4/favicon-180.png', themeColor: '#0F172A' },
  // Badges are off until the client confirms the policy is real. Peer review and open access are true today.
  badges: { peerReviewed: true, openAccess: true, doubleBlind: false, cope: false },
  disciplines: j4Areas,
}
