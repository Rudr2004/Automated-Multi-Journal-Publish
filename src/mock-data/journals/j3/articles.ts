// Journal 3 (IJCSD) mock catalogue: Volume 1 (2026), one issue a month, Issues 1–9 (Jan–Sep). A new journal, so counts are modest.
import type { ArticleSummary, ArticleType, IssueSummary } from '../../../core/types'
import { j3Themes } from '../../../config/journals/j3'
import { rnd } from '../../shared/rnd'

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

export const SUBJECTS = j3Themes.map((d) => d.name)
export type Subject = (typeof SUBJECTS)[number]

const [DES, EDU, MED, HER, IND, DIG, DEV, PER] = SUBJECTS

export const AUTHOR_POOL = [
  'Meenakshi Raghavan', 'Siddharth Rao', 'Charlotte Ashworth', 'Hiroshi Nakamura', 'Isabel Moreno', 'Kofi Mensah', 'Nandini Mukherjee', 'Matthias Brandt',
  'Mariam Khalil', 'Rafael Ortega', 'Freya Lindholm', 'Anirudh Bhattacharya', 'Aarohi Deshpande', 'Emeka Nwankwo', 'Hana Kobayashi', 'Jonas Berg',
  'Pooja Nambiar', 'Farid Benali', 'Sunaina Malhotra', 'Aarav Khanna', 'Amaka Obi', 'Tomas Kovac', 'Rhea Dasgupta', 'Kabir Malhotra',
  'Ayesha Siddiqui', 'Julian Ashford', 'Esther Mutua', 'Pedro Carvalho', 'Gauri Kulshreshtha', 'Sandeep Iyengar', 'Clara Dubois', 'Gautam Chakravarty',
  'Lakshmi Venkatesan', 'Stefan Moller', 'Noor Rahman', 'Ravindra Joshi', 'Simran Bhatia', 'Mohan Pillai', 'Tara Menezes', 'Alejandro Ruiz',
]
export const INSTITUTIONS = [
  'National Institute of Design, Ahmedabad, India', 'University of the Arts London, London, United Kingdom',
  'Tata Institute of Social Sciences, Mumbai, India', 'Aalto University, Helsinki, Finland',
  'University of Cape Town, Cape Town, South Africa', 'Tokyo University of the Arts, Tokyo, Japan',
  'Jawaharlal Nehru University, New Delhi, India', 'University of São Paulo, São Paulo, Brazil',
  'University of Melbourne, Melbourne, Australia', 'Ashoka University, Sonipat, India',
]

const STEMS: Record<string, string[]> = {
  [DES]: [
    'Typographic Identity in Multilingual Public Signage', 'Co-Design Workshops with Textile Artisans in Western India',
    'Colour, Memory and the Visual Language of Railway Posters', 'Inclusive Wayfinding Design in Metro Stations',
    'Material Experiments with Natural Dyes in Contemporary Fashion Studios',
  ],
  [EDU]: [
    'Studio-Based Learning and Creative Confidence in Secondary Schools', 'Teaching Folk Art in Higher Education Curricula',
    'Drawing as Inquiry in Primary Science Classrooms', 'Assessment Practices in Undergraduate Fine Art Programmes',
    'Music Education and Social-Emotional Learning in After-School Settings',
  ],
  [MED]: [
    'Podcasting as Community Storytelling in Regional Languages', 'Audience Reception of Documentary Film at Local Festivals',
    'Misinformation Memes and Visual Rhetoric on Messaging Platforms', 'Newsroom Creativity under Constrained Budgets',
    'Community Radio Archives and Local Memory',
  ],
  [HER]: [
    'Oral Histories and the Interpretation of Temple Towns', 'Digitising Palm-Leaf Manuscript Collections',
    'Visitor Engagement in Small Regional Museums', 'Intangible Heritage Inventories and Community Ownership',
    'Conservation Narratives in Heritage Walks',
  ],
  [IND]: [
    'Independent Game Studios and Local Creative Ecosystems', 'Freelance Illustrators and Platform Pricing Practices',
    'Craft Cooperatives and Market Access in Handicraft Clusters', 'Cultural Mapping of Creative Districts in Mid-Sized Cities',
    'Intellectual Property Awareness among Independent Musicians',
  ],
  [DIG]: [
    'Procedural Generation and Authorship in Interactive Fiction', 'Augmented Reality Trails for Cultural Learning',
    'Creative Coding Communities and Peer Feedback', 'Sound Design with Machine Learning Tools: Practitioner Perspectives',
    'Virtual Exhibition Design for Remote Audiences',
  ],
  [DEV]: [
    'Participatory Video for Climate Awareness in Coastal Villages', 'Arts-Based Methods in Community Development Projects',
    'Storytelling and Financial Literacy among Women Self-Help Groups', 'Creative Placemaking and Neighbourhood Wellbeing',
    'Youth Media Labs in Low-Income Urban Settlements',
  ],
  [PER]: [
    'Rehearsal Practices in Contemporary Dance Collectives', 'Audience Participation in Street Theatre Festivals',
    'Improvisation and Ensemble Trust in Jazz Education', 'Embodied Memory in Classical Dance Transmission',
    'Sound and Space in Site-Specific Performance',
  ],
}
const VARIANTS = ['', ': A Practice-Based Study', ' in Contemporary India', ': Perspectives from the Field']

const ABSTRACT_BITS: Record<string, [string, string, string]> = {
  [DES]: ['Design practice increasingly depends on understanding how people read, use and remember visual and material forms', 'we combined studio-based making with observation, visual analysis and interviews with practitioners', 'recurring design choices shaped how users interpreted and valued the work, with clear differences across contexts'],
  [EDU]: ['Arts education is central to how learners build imagination, confidence and critical thinking', 'we followed classroom practice over a full term through observation, learner portfolios and teacher reflections', 'sustained studio-style activity was linked to richer participation and stronger self-reported creative confidence'],
  [MED]: ['Media and communication practices shape how communities see themselves and take part in public life', 'we analysed content and audience responses using interviews, focus groups and a short survey', 'audiences engaged most with locally grounded stories, and trust depended on familiar voices and formats'],
  [HER]: ['Cultural heritage is kept alive through the people and communities who interpret and care for it', 'we drew on archival sources, site visits and ethnographic conversations with custodians and visitors', 'community participation widened the narratives on display and strengthened local ownership of collections'],
  [IND]: ['Creative industries rely on fragile networks of small studios, freelancers and cooperatives', 'we used a mixed-methods design with a sector survey and in-depth case studies', 'access to markets, skills and fair pricing emerged as the main factors separating thriving from struggling creative enterprises'],
  [DIG]: ['Digital tools are changing how artists, designers and audiences create and share work', 'we ran a practice-led study combining prototype development, creator interviews and audience testing', 'the tools expanded creative options but also raised new questions about authorship, skill and access'],
  [DEV]: ['Creative and communicative methods can give communities a stronger voice in development work', 'we used participatory workshops, field observation and follow-up interviews across several sites', 'participants reported greater confidence and stronger collective action, while practical constraints shaped what could be sustained'],
  [PER]: ['Performing arts depend on shared practice, trust and the transmission of embodied knowledge', 'we documented rehearsals and performances, and interviewed performers, teachers and audiences', 'the findings highlight how repetition, improvisation and shared space build ensemble understanding over time'],
}

export function makeAbstract(subject: string, id: number) {
  const [bg, method, result] = ABSTRACT_BITS[subject]
  const n = 18 + Math.floor(rnd(id) * 40)
  return `${bg}. In this study, ${method}. The analysis drew on ${n} participants and practitioners across multiple sites. Findings suggest that ${result}. The article discusses implications for practice, policy and teaching, and sets out directions for further creative and interdisciplinary research.`
}

interface Seed { id: string; type: ArticleType; subject: string; title: string; authors: string[]; issue: number; date: string; views: number; downloads: number; abstract?: string }
const S = (id: string, type: ArticleType, subject: string, title: string, authors: string[], issue: number, date: string, views: number, downloads: number, abstract?: string): Seed =>
  ({ id, type, subject, title, authors, issue, date, views, downloads, abstract })

const RA = 'Research Article', RV = 'Review Article', SC = 'Short Communication', ED = 'Editorial'
const seeds: Seed[] = [
  S('IJCSD2026000070', ED, DES, 'Making, Meaning and Method: Why Creative Studies Needs Many Ways of Knowing', ['Meenakshi Raghavan'], 9, '2026-09-15', 238, 74,
    'This editorial introduces the ninth issue of the International Journal of Creative Studies and Development. It reflects on how practice-based, ethnographic and archival approaches can sit side by side, and outlines the questions that run through this month’s articles on craft, classrooms, media, museums and performance.'),
  S('IJCSD2026000071', RA, DES, 'Pattern, Process and Provenance: Practice-Based Research with Block-Printing Workshops in Rajasthan', ['Aarohi Deshpande', 'Siddharth Rao', 'Charlotte Ashworth'], 9, '2026-09-15', 412, 158),
  S('IJCSD2026000072', RV, EDU, 'Arts Integration in Primary Classrooms: A Review of Pedagogical Models and Learning Outcomes', ['Isabel Moreno', 'Pooja Nambiar'], 9, '2026-09-15', 355, 141),
  S('IJCSD2026000073', RA, MED, 'Short-Form Video and News Literacy among Young Adults in Urban India', ['Rhea Dasgupta', 'Aarav Khanna', 'Nandini Mukherjee'], 9, '2026-09-15', 521, 203),
  S('IJCSD2026000074', SC, HER, 'Community Curation at a Regional Museum in Kerala: A Short Report on Co-Produced Galleries', ['Lakshmi Venkatesan', 'Kofi Mensah'], 9, '2026-09-15', 267, 97),
  S('IJCSD2026000075', RA, IND, 'Craft Cluster Branding and Artisan Incomes in Handloom Districts', ['Sandeep Iyengar', 'Esther Mutua', 'Ravindra Joshi'], 9, '2026-09-15', 304, 122),
  S('IJCSD2026000076', RA, DIG, 'Generative Image Tools and Authorship in Student Design Studios', ['Hana Kobayashi', 'Jonas Berg', 'Clara Dubois'], 9, '2026-09-15', 486, 187),
  S('IJCSD2026000077', RA, DEV, 'Participatory Theatre for Health Communication in Rural Odisha', ['Gauri Kulshreshtha', 'Mariam Khalil', 'Mohan Pillai'], 9, '2026-09-15', 332, 129),
  S('IJCSD2026000078', RA, PER, 'Light, Shadow and Story: Reviving Tholpavakoothu Shadow Puppetry through Community Documentation', ['Tara Menezes', 'Anirudh Bhattacharya', 'Hiroshi Nakamura'], 9, '2026-09-15', 638, 246,
    'Tholpavakoothu, the shadow puppet theatre of Kerala’s Bhagavathi temples, is practised by a handful of hereditary families and is rarely documented as a living art. This article reports a community-led documentation project in which puppeteers, filmmakers and researchers recorded performances, workshops and oral histories over eighteen months. Drawing on interviews with twelve performers and audience observation at nine temple performances, we show how filming choices, shared editing and a small digital archive changed what the puppeteers chose to teach and perform. We argue that documentation can support renewal when it is designed with practitioners rather than for them, and we offer a set of practical principles for similar projects.'),
]

const COUNTS = [5, 5, 5, 6, 6, 6, 7, 7]

function buildAll() {
  const issues: IssueSummary[] = []
  const articles: ArticleSummary[] = []
  const used = new Set(seeds.map((s) => s.id))
  let counter = 0
  let stemCursor = 0
  const year = 2026

  for (let m = 1; m <= 9; m++) {
    const month = `${year}-${pad(m)}`
    const date = `${month}-15`
    const fixed = seeds.filter((s) => s.issue === m)
    const isCurrent = m === 9
    const target = isCurrent ? fixed.length : COUNTS[m - 1]
    const list: ArticleSummary[] = fixed.map((s, i) => ({
      paperId: s.id, type: s.type, subject: s.subject, title: s.title, authors: s.authors, volume: 1, issue: m, pages: '', publishedAt: s.date,
      views: s.views, downloads: s.downloads, citations: Math.floor(rnd(m + i) * 3), abstract: s.abstract ?? makeAbstract(s.subject, m * 10 + i),
    }))
    while (list.length < target) {
      const k = stemCursor++
      const subject = SUBJECTS[k % SUBJECTS.length]
      const stemList = STEMS[subject]
      const cycle = Math.floor(k / SUBJECTS.length)
      const title = stemList[cycle % stemList.length] + VARIANTS[Math.floor(cycle / stemList.length) % VARIANTS.length]
      counter++
      let id = `IJCSD${year}${pad(counter, 6)}`
      while (used.has(id)) { counter++; id = `IJCSD${year}${pad(counter, 6)}` }
      used.add(id)
      const n = 2 + Math.floor(rnd(k + 3) * 3)
      const authors = Array.from({ length: n }, (_, j) => AUTHOR_POOL[(k * 3 + j * 7) % AUTHOR_POOL.length])
      const type: ArticleType = k % 9 === 4 ? 'Review Article' : k % 7 === 3 ? 'Short Communication' : 'Research Article'
      const ageDays = Math.max(20, (9 - m) * 30)
      list.push({
        paperId: id, type, subject, title, authors: [...new Set(authors)], volume: 1, issue: m, pages: '', publishedAt: date,
        views: Math.floor(90 + rnd(k + 9) * Math.min(780, ageDays * 2.6)), downloads: Math.floor(30 + rnd(k + 17) * Math.min(320, ageDays * 1.1)),
        citations: Math.floor(rnd(k + 23) * Math.min(5, ageDays / 55)),
        abstract: makeAbstract(subject, k + 400),
      })
    }
    // Editorials first, then sequential page ranges.
    list.sort((a, b) => Number(b.type === 'Editorial') - Number(a.type === 'Editorial'))
    let start = 1
    list.forEach((a, i) => {
      if (a.type === 'Editorial') { a.pages = 'i–iv'; return }
      const len = 7 + Math.floor(rnd(m * 7 + i) * 16)
      a.pages = `${start}–${start + len - 1}`
      start += len
    })
    articles.push(...list)
    issues.push({ volume: 1, issue: m, month, publishedAt: date, articleCount: list.length, doi: `10.55041/IJCSD-V1I${m}`, isCurrent })
  }
  return { issues, articles }
}

const built = buildAll()
export const issues = built.issues // oldest → newest
export const allArticles = built.articles
export const currentIssue = issues[issues.length - 1]
export const byId = (id: string) => allArticles.find((a) => a.paperId === id)
export const issueArticles = (vol: number, issue: number) => allArticles.filter((a) => a.volume === vol && a.issue === issue)
