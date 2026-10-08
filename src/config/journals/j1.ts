// Single source of truth for the Journal 1 (IJMAT) public site: identity, charges, trust items, statistics and index logos.
// Routes live in ./routes and navigation in ./navigation. Bracketed comments mark client placeholders.
import { paths } from '../routes'
import type { IndexLogo, JournalConfig } from './types'

const DAY = 86400000

export const journal: JournalConfig = {
  id: 'j1',
  slug: 'ijmat',
  name: 'International Journal of Multidisciplinary Academic Research and Trends', // [IJMAT FULL NAME]
  shortName: 'IJMAT',
  tagline: 'Rigorous research with real-world reach',
  /** Small-caps line under the journal name in the header. */
  descriptor: 'Peer-reviewed · Open access refereed multidisciplinary journal',
  mission:
    'An open access journal publishing high-quality, peer-reviewed research that advances science and technology and benefits society.',
  publisher: 'EdTech Publishers (OPC) Private Limited',
  publisherCity: 'Bengaluru, India',
  paperIdPrefix: 'IJMAT', // [CODE] e.g. IJMAT2026000123
  issnOnline: '3139-6542', // [XXXX-XXXX]
  doiPrefix: '10.55041',
  domain: 'ijmat.org',
  frequency: 'Monthly',
  licence: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
  apc: { inr: 6500, usd: 120, gstPercent: 18 }, // [INR] / [USD]; GST for Indian authors only
  email: 'editor@ijmat.org', // [editor@ijmat.org]
  whatsapp: '+91 90000 00000',
  address: 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016',
  location: { lat: 13.0306, lng: 77.6593 }, // map pin for the editorial office (Horamavu, Bengaluru) — client to confirm
  subjects: [
    'Materials Science', 'Environmental Science', 'Computer Science', 'Biotechnology',
    'Energy Systems', 'Public Health',
  ], // [list]
  follow: [
    { id: 'rss', label: 'RSS feed', href: '#' },
    { id: 'mail', label: 'Email alerts', href: '#' },
    { id: 'web', label: 'Website', href: '#' },
  ],

  /** Rows of the "Journal Information" table (navy label column), as in the client's sample. */
  info: [
    ['Title', 'International Journal of Multidisciplinary Academic Research and Trends'],
    ['Frequency', 'Monthly'],
    ['Starting Year', '2023'],
    ['ISSN', '3139-6542'], // [XXXX-XXXX]
    ['Publisher', 'EdTech Publishers (OPC) Private Limited'],
    ['Subject', 'Multidisciplinary Subjects'],
    ['Language', 'English'],
    ['Publication Format', 'Online'],
    ['Email', 'editor@ijmat.org'],
    ['Website', 'ijmat.org'],
    ['Address', 'EdTech Publishers (OPC) Private Limited, 6/48, Near Chrysalis High School, Balaji Layout, Horamavu Agara, Horamavu, Bengaluru, Karnataka, India, PIN 560016'],
  ] as const,

  /** "Browse by subject" index shown in the footer. Each entry searches the archive. */
  subjectIndex: [
    'Area Studies', 'Arts', 'Behavioral Sciences', 'Bioscience', 'Built Environment', 'Communication Studies', 'Computer Science', 'Earth Sciences',
    'Economics, Finance, Business & Industry', 'Education', 'Engineering & Technology', 'Environment & Agriculture', 'Environment & Sustainability', 'Food Science & Technology', 'Geography', 'Global Development',
    'Health & Social Care', 'Humanities', 'Information Science', 'Language & Literature', 'Law', 'Mathematics, Statistics & Data Science', 'Medicine, Dentistry, Nursing & Allied Health', 'Museum & Heritage Studies',
    'Physical Sciences', 'Politics & International Relations', 'Social Sciences', 'Sports & Leisure', 'Tourism, Hospitality & Events', 'Urban Studies',
  ],

  /** Scrolling announcements in the top strip. `to` is a route path; the first (call for papers) also shows the live "closes in" text. */
  announcements: [
    { id: 'cfp', text: 'Call for Papers: Volume 4, Issue 10', to: paths.submit, live: true, highlight: false },
    { id: 'award', text: 'Best Paper Award 2026 nominations open', to: paths.currentIssue, live: false, highlight: true },
    { id: 'doi', text: 'Crossref DOI 10.55041 active for all current archive records', to: paths.about('indexing'), live: false, highlight: false },
    { id: 'editors', text: 'Three new Associate Editors join the editorial board', to: paths.editorialBoard, live: false, highlight: false },
  ],

  /** Next issue. The deadline is ~4 days out so the "last 5 days" countdown is visible in demos. */
  nextIssue: { label: 'Volume 4, Issue 10 — October 2026', deadline: new Date(Date.now() + 4 * DAY + 3 * 3600000).toISOString(), expectedPublication: '2026-10-15' },

  // ---- Trust badges. client to confirm: only show claims the journal can genuinely make. ----
  trustBadges: [
    { id: 'peer', label: 'Peer Reviewed', icon: 'shield-check', show: true },
    { id: 'oa', label: 'Open Access', icon: 'unlock', show: true },
    { id: 'doi', label: 'Crossref DOI', icon: 'link', show: true },
    { id: 'plag', label: 'Plagiarism Checked', icon: 'scan-search', show: true },
    { id: 'indexed', label: 'Indexed in Major Databases', icon: 'database', show: true }, // client to confirm
    { id: 'cope', label: 'COPE Compliant', icon: 'scale', show: true }, // client to confirm
  ],

  // ---- "Trust ledger": each row explains a commitment and links to the matching policy. ----
  trustLedger: [
    { id: 'peer', icon: 'shield-check', title: 'Peer Review', text: 'Every paper is screened by an editor, with expert reviewers called in when needed. Each decision is logged with its reason.', to: paths.policy('peer-review') },
    { id: 'oa', icon: 'unlock', title: 'Open Access', text: 'All articles are free to read, share and reuse under CC BY 4.0, with no subscription or pay-per-view barriers.', to: paths.policy('open-access') },
    { id: 'doi', icon: 'link', title: 'Crossref DOI', text: 'Every article gets a permanent DOI under 10.55041, registered with Crossref so citations never break.', to: paths.policy('archiving') },
    { id: 'cert', icon: 'award', title: 'Certificates with QR verification', text: 'Each author receives a certificate whose QR code anyone can scan to confirm it is genuine.', to: paths.verify() },
    { id: 'ethics', icon: 'scale', title: 'Publication Ethics', text: 'We follow COPE guidance on plagiarism, conflicts of interest, corrections and retractions.', to: paths.policy('publication-ethics') },
  ],

  // ---- Index and verification logos (from the "Verify index" folder). client to confirm each listing. ----
  logos: [
    { id: 'scholar', name: 'Google Scholar', file: 'google-scholar.png', verifyUrl: 'https://scholar.google.com/', show: true, description: 'Article pages carry Scholar-compatible metadata so papers can be found and cited.', meaning: 'Your article can be found by researchers searching Google Scholar, and its citations are tracked there.', status: 'Monitored weekly' },
    { id: 'openalex', name: 'OpenAlex', file: 'openalex.png', verifyUrl: 'https://openalex.org/', show: true, description: 'Open catalogue of scholarly works, authors and citations.', meaning: 'Your paper, its authors and its citations appear in an open research graph used by universities worldwide.', status: 'Listed' },
    { id: 'semantic', name: 'Semantic Scholar', file: 'semantic-scholar.png', verifyUrl: 'https://www.semanticscholar.org/', show: true, description: 'AI-assisted research discovery and citation tool.', meaning: 'Readers can discover your paper through AI-powered recommendations and citation graphs.', status: 'Listed' },
    { id: 'worldcat', name: 'WorldCat', file: 'worldcat.png', verifyUrl: 'https://search.worldcat.org/', show: true, description: 'The world’s largest library catalogue.', meaning: 'Libraries around the world can find and link to the journal.', status: 'Listed' },
    { id: 'zenodo', name: 'Zenodo', file: 'zenodo.png', verifyUrl: 'https://zenodo.org/', show: true, description: 'Open repository for long-term preservation of research.', meaning: 'A permanent, citable copy of your article is preserved in an open repository.', status: 'Archived' },
    { id: 'researchgate', name: 'ResearchGate', file: 'researchgate.png', verifyUrl: 'https://www.researchgate.net/', show: true, description: 'Professional network where researchers share work.', meaning: 'Your article can be added to your ResearchGate profile and shared with collaborators.', status: 'Listed' },
    { id: 'mendeley', name: 'Mendeley', file: 'mendeley.png', verifyUrl: 'https://www.mendeley.com/', show: true, description: 'Reference manager and research network.', meaning: 'Readers can import your reference with one click into Mendeley.', status: 'Listed' },
    { id: 'ssrn', name: 'Elsevier SSRN', file: 'ssrn.png', verifyUrl: 'https://www.ssrn.com/', show: true, description: 'Early-stage research sharing from Elsevier.', meaning: 'Your work can reach a wide audience of readers in the social and applied sciences.', status: 'Listed' },
    { id: 'ebsco', name: 'EBSCO', file: 'ebsco.png', verifyUrl: 'https://www.ebsco.com/', show: true, description: 'Research databases used by libraries and institutions.', meaning: 'University libraries using EBSCO can surface your article to students and staff.', status: 'Under evaluation' },
    { id: 'thomson', name: 'Thomson Reuters', file: 'thomson-reuters.jpg', verifyUrl: 'https://www.thomsonreuters.com/', show: true, description: 'Research identification and indexing services.', meaning: 'Author and article identifiers help your work be attributed correctly.', status: 'Under evaluation' },
    { id: 'issn', name: 'ISSN', file: 'issn.png', verifyUrl: 'https://portal.issn.org/', show: true, description: 'International Standard Serial Number registered for the journal.', meaning: 'The journal is uniquely identified worldwide, which libraries and indexes require.', status: 'Registered' },
    { id: 'sjif', name: 'SJIF', file: 'sjif.png', verifyUrl: 'https://sjifactor.com/', show: true, description: 'Scientific Journal Impact Factor rating.', meaning: 'A recognised journal-quality rating you can cite in applications and evaluations.', status: 'Under evaluation' },
    { id: 'iso', name: 'ISO 9001:2015', file: 'iso-9001.png', verifyUrl: 'https://www.iso.org/standard/62085.html', show: true, description: 'Quality management certification of the publishing process.', meaning: 'The publisher’s editorial and production workflow follows an audited quality standard.', status: 'Certified' },
  ],

  // ---- Hero / statistics. client to confirm: figures must be real before launch. ----
  heroStats: [
    { id: 'papers', label: 'Published Papers', value: '1,248', show: true },
    { id: 'countries', label: 'Countries', value: '42', show: true },
    { id: 'review', label: 'Avg. Review Time', value: '14 days', show: true },
    { id: 'oa', label: 'Open Access', value: 'CC BY 4.0', show: true },
  ],
  statsTable: [
    { id: 'papers', label: 'Published Papers', value: '1,248', show: true },
    { id: 'citations', label: 'Citations', value: '6,310', show: true }, // client to confirm
    { id: 'countries', label: 'Countries', value: '42', show: true },
    { id: 'acceptance', label: 'Acceptance Rate', value: '38%', show: true }, // client to confirm
    { id: 'review', label: 'Average Review Time', value: '14 days', show: true },
    { id: 'editors', label: 'Editorial Members', value: '64', show: true },
  ],
  branding: { pageTitle: 'IJMAT | International Journal of Multidisciplinary Academic Research and Trends', favicon: '/journals/j1/favicon-48.png', touchIcon: '/journals/j1/favicon-180.png', themeColor: '#14284B' },
  // Badges: only claims the journal can genuinely make. client to confirm.
  badges: { peerReviewed: true, openAccess: true, doubleBlind: false, cope: true },
}

/** DOI format is always {prefix}/{Paper ID}. */
export const doiFor = (paperId: string) => `${journal.doiPrefix}/${paperId}`

/** Logos that the client has switched on. */
export const visibleLogos = (): IndexLogo[] => journal.logos.filter((l) => l.show)

/** Public URL of a logo file (respects a sub-folder deployment). */
export const logoSrc = (file: string) => `${import.meta.env.BASE_URL}shared/indexing/${file}`
