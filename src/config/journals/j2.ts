// Single source of truth for Journal 2 (JIMRT): identity, charges, trust items, index logos, disciplines and badge switches.
// Routes live in ../routes. Comments marked "client to confirm" are placeholders the client must verify before launch.
import { paths } from '../routes'
import type { Discipline, IndexLogo, JournalConfig } from './types'

const DAY = 86400000

/** Discipline colours are used as a thin strip on cards; each one passes 3:1 against white. */
export const j2Disciplines: readonly Discipline[] = [
  { id: 'engineering', name: 'Engineering & Technology', icon: 'engineering', color: '#0369A1' },
  { id: 'computing', name: 'Computer & Data Science', icon: 'computing', color: '#4F46E5' },
  { id: 'life', name: 'Life & Health Sciences', icon: 'life', color: '#BE185D' },
  { id: 'environment', name: 'Environment & Sustainability', icon: 'environment', color: '#15803D' },
  { id: 'physical', name: 'Physical Sciences & Materials', icon: 'physical', color: '#7C3AED' },
  { id: 'social', name: 'Social Sciences & Education', icon: 'social', color: '#B45309' },
  { id: 'business', name: 'Business & Economics', icon: 'business', color: '#0F766E' },
  { id: 'agriculture', name: 'Agriculture & Food', icon: 'agriculture', color: '#65A30D' },
]

const logo = (id: string, name: string, file: string, verifyUrl: string, show: boolean, description: string, meaning: string, status: string): IndexLogo =>
  ({ id, name, file, verifyUrl, show, description, meaning, status })

export const journal: JournalConfig = {
  id: 'j2',
  slug: 'jimrt',
  name: 'Journal of Innovation in Multidisciplinary Research and Technology',
  shortName: 'JIMRT',
  tagline: 'Open research that crosses disciplines',
  descriptor: 'Peer-reviewed · Open access · Multidisciplinary',
  mission:
    'JIMRT is a monthly open access journal that publishes rigorous research and technology papers from every discipline, with fast, fair peer review and permanent DOIs.',
  publisher: 'EdTech Publishers (OPC) Private Limited',
  publisherCity: 'Bengaluru, India',
  paperIdPrefix: 'JIMRT', // e.g. JIMRT2026000045
  issnOnline: '3139-6526',
  doiPrefix: '10.55041',
  domain: 'jimrt.org',
  frequency: 'Monthly',
  licence: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  apc: { inr: 6000, usd: 110, gstPercent: 18 }, // [INR] / [USD] — client to confirm; GST for Indian authors only
  email: 'editor@jimrt.org',
  whatsapp: '+91 90000 00001', // client to confirm
  address: 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016',
  location: { lat: 13.0306, lng: 77.6593 },
  subjects: j2Disciplines.map((d) => d.name),
  follow: [
    { id: 'rss', label: 'RSS feed', href: '#' },
    { id: 'mail', label: 'Email alerts', href: '#' },
    { id: 'web', label: 'Website', href: '#' },
  ],

  info: [
    ['Title', 'Journal of Innovation in Multidisciplinary Research and Technology'],
    ['Frequency', 'Monthly'],
    ['Starting Year', '2025'],
    ['ISSN (Online)', '3139-6526'],
    ['Publisher', 'EdTech Publishers (OPC) Private Limited'],
    ['Subject', 'Multidisciplinary'],
    ['Language', 'English'],
    ['Publication Format', 'Online'],
    ['Licence', 'Open Access, CC BY 4.0'],
    ['Email', 'editor@jimrt.org'],
    ['Website', 'jimrt.org'],
    ['Address', 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016'],
  ],

  subjectIndex: j2Disciplines.map((d) => d.name),

  announcements: [
    { id: 'cfp', text: 'Call for Papers: Volume 2, Issue 10', to: paths.submit, live: true, highlight: false },
    { id: 'doi', text: 'Every JIMRT article receives a permanent Crossref DOI', to: paths.about('indexing'), live: false, highlight: false },
  ],

  nextIssue: { label: 'Volume 2, Issue 10 — October 2026', deadline: new Date(Date.now() + 9 * DAY).toISOString(), expectedPublication: '2026-10-28' },

  trustBadges: [
    { id: 'peer', label: 'Peer Reviewed', icon: 'shield-check', show: true },
    { id: 'oa', label: 'Open Access', icon: 'unlock', show: true },
    { id: 'doi', label: 'Crossref DOI', icon: 'link', show: true },
  ],

  trustLedger: [
    { id: 'review', icon: 'shield-check', title: 'Fast, fair review', text: 'Every paper is screened by an editor and sent to expert reviewers; you can follow each step with your Paper ID.', to: paths.policy('peer-review') },
    { id: 'oa', icon: 'unlock', title: 'Open access', text: 'All articles are free to read, share and reuse under CC BY 4.0.', to: paths.policy('open-access') },
    { id: 'doi', icon: 'link', title: 'Permanent DOI', text: 'Each article gets a DOI under 10.55041, registered with Crossref.', to: paths.policy('archiving') },
    { id: 'cert', icon: 'award', title: 'Verifiable certificates', text: 'Every author certificate carries a QR code anyone can scan to confirm it is genuine.', to: paths.verify() },
  ],

  // Only Crossref and Google Scholar are switched on; the rest stay off until the client confirms each listing.
  logos: [
    logo('crossref', 'Crossref', '', 'https://search.crossref.org/', true, 'DOI registration agency; every JIMRT article has a Crossref DOI.', 'Your article gets a permanent, citable DOI that resolves to its page.', 'Active'),
    logo('scholar', 'Google Scholar', 'google-scholar.png', 'https://scholar.google.com/', true, 'Article pages carry Scholar-compatible metadata so papers can be found and cited.', 'Your article can be found by researchers searching Google Scholar.', 'Monitored'),
    logo('openalex', 'OpenAlex', 'openalex.png', 'https://openalex.org/', false, 'Open catalogue of scholarly works, authors and citations.', 'Your paper appears in an open research graph.', 'Not yet listed'),
    logo('semantic', 'Semantic Scholar', 'semantic-scholar.png', 'https://www.semanticscholar.org/', false, 'AI-assisted research discovery tool.', 'Readers can discover your paper through recommendations.', 'Not yet listed'),
    logo('worldcat', 'WorldCat', 'worldcat.png', 'https://search.worldcat.org/', false, 'The world’s largest library catalogue.', 'Libraries can find and link to the journal.', 'Not yet listed'),
    logo('zenodo', 'Zenodo', 'zenodo.png', 'https://zenodo.org/', false, 'Open repository for long-term preservation.', 'A permanent copy of your article is preserved.', 'Not yet listed'),
    logo('researchgate', 'ResearchGate', 'researchgate.png', 'https://www.researchgate.net/', false, 'Professional network where researchers share work.', 'Add your article to your profile.', 'Not yet listed'),
    logo('mendeley', 'Mendeley', 'mendeley.png', 'https://www.mendeley.com/', false, 'Reference manager and research network.', 'Import references with one click.', 'Not yet listed'),
    logo('ssrn', 'Elsevier SSRN', 'ssrn.png', 'https://www.ssrn.com/', false, 'Early-stage research sharing.', 'Reach readers in applied sciences.', 'Not yet listed'),
    logo('ebsco', 'EBSCO', 'ebsco.png', 'https://www.ebsco.com/', false, 'Research databases used by libraries.', 'Libraries can surface your article.', 'Not yet listed'),
    logo('thomson', 'Thomson Reuters', 'thomson-reuters.jpg', 'https://www.thomsonreuters.com/', false, 'Research identification services.', 'Identifiers help attribute your work.', 'Not yet listed'),
    logo('issn', 'ISSN', 'issn.png', 'https://portal.issn.org/', false, 'International Standard Serial Number.', 'The journal is uniquely identified worldwide.', 'Registered'),
    logo('sjif', 'SJIF', 'sjif.png', 'https://sjifactor.com/', false, 'Scientific Journal Impact Factor rating.', 'A recognised journal-quality rating.', 'Not yet rated'),
    logo('iso', 'ISO 9001:2015', 'iso-9001.png', 'https://www.iso.org/standard/62085.html', false, 'Quality management certification.', 'Audited publishing workflow.', 'Not certified'),
  ],

  // A new journal: no headline statistics.
  heroStats: [],
  statsTable: [],

  branding: { pageTitle: 'JIMRT | Journal of Innovation in Multidisciplinary Research and Technology', favicon: '/journals/j2/favicon-48.png', touchIcon: '/journals/j2/favicon-180.png', themeColor: '#065F46' },
  // Badges are off until the client confirms the policy is real. Peer review and open access are true today.
  badges: { peerReviewed: true, openAccess: true, doubleBlind: false, cope: false },
  disciplines: j2Disciplines,
}
