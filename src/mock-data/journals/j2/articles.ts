// Journal 2 (JIMRT) mock catalogue: Volume 1 (2025) and Volume 2 (2026), one issue a month. It is a new journal, so counts are modest.
import type { ArticleSummary, ArticleType, IssueSummary } from '../../../core/types'
import { j2Disciplines } from '../../../config/journals/j2'
import { rnd } from '../../shared/rnd'

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

export const SUBJECTS = j2Disciplines.map((d) => d.name)
export type Subject = (typeof SUBJECTS)[number]

const [ENG, COMP, LIFE, ENV, PHYS, SOC, BUS, AGR] = SUBJECTS

export const AUTHOR_POOL = [
  'Aditi Banerjee', 'Arvind Subramanian', 'Leila Haddad', 'Mateo Fernandez', 'Ingrid Solberg', 'Sanjay Gupta', 'Naomi Adeyemi', 'Oliver Grant',
  'Ishita Chandra', 'Kenji Watanabe', 'Camila Torres', 'Rajesh Pillai', 'Yuki Tanaka', 'Ahmed Mansour', 'Radhika Pillai', 'Pranav Joshi',
  'Zainab Hussain', 'Samuel Adeyemi', 'Olivia Bennett', 'Ethan Collins', 'Kavya Reddy', 'Vivek Chatterjee', 'Maya Krishnan', 'Lukas Weber',
  'Beatriz Santos', 'Imran Qureshi', 'Shreya Agarwal', 'Harsh Vardhan', 'Nadia Volkova', 'Tobias Lindgren', 'Grace Mwangi', 'Anand Narayan',
  'Tanvi Kapoor', 'Joseph Okonkwo', 'Lucia Romano', 'Ravi Teja', 'Divya Menon', 'Diego Alvarez', 'Helena Novak', 'Neil Thompson',
]
export const INSTITUTIONS = [
  'Indian Institute of Technology Madras, Chennai, India', 'University of Cape Town, Cape Town, South Africa',
  'Delft University of Technology, Delft, Netherlands', 'University of Melbourne, Melbourne, Australia',
  'Indian Institute of Science, Bengaluru, India', 'University of São Paulo, São Paulo, Brazil',
  'Kyoto University, Kyoto, Japan', 'University of Nairobi, Nairobi, Kenya',
  'University of Edinburgh, Edinburgh, United Kingdom', 'Amrita Vishwa Vidyapeetham, Coimbatore, India',
]

const STEMS: Record<string, string[]> = {
  [ENG]: [
    'Vibration-Based Damage Detection in Steel Footbridges Using Low-Cost Sensors', 'Thermal Performance of Hollow-Block Walls in Hot-Humid Climates',
    'Additive Manufacturing of Lattice Heat Sinks for Compact Electronics', 'Seismic Retrofit of Unreinforced Masonry with Textile-Reinforced Mortar',
    'Predictive Maintenance of Rotating Machinery Using Edge Analytics',
  ],
  [COMP]: [
    'Retrieval-Augmented Generation for Course Question Answering', 'Privacy-Preserving Learning on Wearable Health Data',
    'Code-Mixed Hindi–English Sentiment Analysis with Small Language Models', 'Energy-Efficient Neural Inference on Microcontrollers',
    'Detecting Synthetic Media with Frequency-Domain Features',
  ],
  [LIFE]: [
    'Gut Microbiome Profiles and Glycaemic Response to Millet-Based Meals', 'Point-of-Care Biosensors for Early Detection of Dengue',
    'Telemedicine Follow-Up and Medication Adherence in Chronic Kidney Disease', 'Antimicrobial Peptides from Marine Sediment Bacteria',
    'Sleep Duration and Cognitive Performance among University Students',
  ],
  [ENV]: [
    'Urban Rainwater Harvesting Potential Estimated from Building Footprints', 'Microplastic Load in Peri-Urban Lake Sediments',
    'Mangrove Restoration and Coastal Flood Attenuation', 'Low-Cost Sensor Networks for Neighbourhood Air Quality',
    'Carbon Footprint of Campus Food Systems',
  ],
  [PHYS]: [
    'Biochar-Modified Geopolymer Mortars: Strength and Embodied Carbon', 'Lead-Free Perovskite Thin Films Deposited by Spray Coating',
    'Graphene Oxide Membranes for Dye Removal from Textile Effluent', 'Phase-Change Materials for Passive Cooling of Photovoltaic Panels',
    'Quantum Dot Sensitised Photocatalysts for Hydrogen Evolution',
  ],
  [SOC]: [
    'Teacher Digital Fluency and Learning Outcomes in Rural Secondary Schools', 'Peer Tutoring and Mathematics Anxiety in Early Adolescence',
    'Gig Work and Perceived Job Security among Delivery Workers', 'Library Use and Reading Habits after Pandemic School Closures',
    'Community Radio and Civic Participation in Tribal Districts',
  ],
  [BUS]: [
    'UPI Adoption and Working-Capital Efficiency in Micro Enterprises', 'Green Bond Issuance and Firm Valuation in Emerging Markets',
    'Supply-Chain Resilience Practices in Small Manufacturers', 'Women-Led Start-Ups and Access to Early-Stage Finance',
    'Consumer Trust in Buy-Now-Pay-Later Services',
  ],
  [AGR]: [
    'Drone-Based Multispectral Mapping of Nitrogen Stress in Rice', 'Agroforestry and Soil Organic Carbon on Smallholder Farms',
    'Solar-Powered Cold Storage for Perishable Produce', 'Millet Value Chains and Farmer Incomes in Semi-Arid Regions',
    'Biofertiliser Consortia and Yield Stability in Chickpea',
  ],
}
const VARIANTS = ['', ': A Field Study', ' in Resource-Constrained Settings', ': Evidence from a Two-Year Trial']

const ABSTRACT_BITS: Record<string, [string, string, string]> = {
  [ENG]: ['Safer, more efficient infrastructure depends on affordable monitoring and design methods', 'prototypes were built, instrumented and tested under controlled and field conditions', 'the proposed approach tracked reference measurements closely while reducing cost'],
  [COMP]: ['Practical AI systems must be accurate, efficient and respectful of user privacy', 'we designed a compact model and evaluated it on public benchmarks and a newly collected dataset', 'the method matched stronger baselines while using far less memory and energy'],
  [LIFE]: ['Accessible diagnostics and nutrition research can improve everyday health outcomes', 'participants were recruited through community clinics and followed with standardised assays', 'clear differences between groups emerged and were consistent across sensitivity checks'],
  [ENV]: ['Reliable environmental data helps cities and communities plan for climate risk', 'field sampling was combined with geospatial analysis and statistical modelling', 'spatial and seasonal patterns were identified that can inform local policy'],
  [PHYS]: ['Durable, low-carbon materials are central to a sustainable built environment', 'samples were synthesised, characterised by microscopy and diffraction, and mechanically tested', 'the modified formulations improved performance while lowering embodied emissions'],
  [SOC]: ['Understanding how people learn and work is essential for fair and effective policy', 'a mixed-methods design combined surveys, administrative records and interviews', 'meaningful differences were associated with access, training and local context'],
  [BUS]: ['Small firms and new ventures face distinctive financial and operational constraints', 'we analysed firm-level panel data and complemented it with structured interviews', 'adoption was linked to measurable efficiency gains, with variation across sectors'],
  [AGR]: ['Resilient food systems rely on practical technologies that smallholders can afford', 'multi-season field trials were run across contrasting sites and managed with farmers', 'yields and incomes improved while input use and post-harvest losses fell'],
}

export function makeAbstract(subject: string, id: number) {
  const [bg, method, result] = ABSTRACT_BITS[subject]
  const pct = 6 + Math.floor(rnd(id) * 26)
  return `${bg}. In this study, ${method}. Results showed that ${result}, with an average improvement of ${pct}% relative to the baseline (p < 0.05). The findings are discussed in light of earlier work, and practical recommendations and directions for further research are outlined.`
}

interface Seed { id: string; type: ArticleType; subject: string; title: string; authors: string[]; vol: number; issue: number; date: string; views: number; downloads: number }
const S = (id: string, type: ArticleType, subject: string, title: string, authors: string[], vol: number, issue: number, date: string, views: number, downloads: number): Seed =>
  ({ id, type, subject, title, authors, vol, issue, date, views, downloads })

const RA = 'Research Article', RV = 'Review Article', SC = 'Short Communication', ED = 'Editorial'
const seeds: Seed[] = [
  S('JIMRT2026000041', RA, ENG, 'Vibration-Based Structural Health Monitoring of Reinforced Concrete Bridges Using Low-Cost MEMS Sensors', ['Aditi Banerjee', 'Arvind Subramanian', 'Lukas Weber'], 2, 9, '2026-09-15', 412, 158),
  S('JIMRT2026000042', RV, COMP, 'Retrieval-Augmented Generation in Education: A Review of Architectures, Evaluation and Risks', ['Mateo Fernandez', 'Ishita Chandra'], 2, 9, '2026-09-15', 636, 271),
  S('JIMRT2026000043', RA, LIFE, 'Gut Microbiome Signatures and Glycaemic Response to Millet-Based Diets in Adults with Prediabetes', ['Kavya Reddy', 'Rajesh Pillai', 'Olivia Bennett'], 2, 9, '2026-09-15', 388, 143),
  S('JIMRT2026000044', SC, ENV, 'Rooftop Rainwater Harvesting Potential Across Bengaluru Wards: A GIS-Based Estimate', ['Radhika Pillai', 'Pranav Joshi'], 2, 9, '2026-09-15', 297, 96),
  S('JIMRT2026000045', RA, PHYS, 'Biochar-Modified Geopolymer Mortars: Strength, Porosity and Embodied Carbon', ['Kenji Watanabe', 'Naomi Adeyemi', 'Sanjay Gupta'], 2, 9, '2026-09-15', 455, 187),
  S('JIMRT2026000046', RA, SOC, 'Teacher Digital Fluency and Learning Outcomes in Rural Secondary Schools: Evidence from Three States', ['Divya Menon', 'Grace Mwangi'], 2, 9, '2026-09-15', 341, 122),
  S('JIMRT2026000047', RA, BUS, 'UPI Adoption and Working-Capital Efficiency among Micro and Small Enterprises', ['Harsh Vardhan', 'Shreya Agarwal', 'Ethan Collins'], 2, 9, '2026-09-15', 279, 104),
  S('JIMRT2026000048', RA, AGR, 'Drone-Assisted Multispectral Mapping of Nitrogen Stress in Rice Paddies', ['Anand Narayan', 'Maya Krishnan', 'Tobias Lindgren'], 2, 9, '2026-09-15', 366, 139),
  S('JIMRT2026000049', ED, SOC, 'Why Multidisciplinary Research Needs Open Methods: Editorial', ['Ingrid Solberg'], 2, 9, '2026-09-15', 214, 61),
  S('JIMRT2026000038', RA, COMP, 'Lightweight Speech Recognition for Code-Mixed Hindi–English on Mobile Devices', ['Nadia Volkova', 'Vivek Chatterjee', 'Leila Haddad'], 2, 8, '2026-08-14', 744, 312),
  S('JIMRT2026000036', RA, ENV, 'Mangrove Restoration and Coastal Flood Attenuation along the Konkan Coast', ['Beatriz Santos', 'Joseph Okonkwo'], 2, 8, '2026-08-14', 612, 254),
  S('JIMRT2026000033', RV, LIFE, 'CRISPR Diagnostics for Neglected Tropical Diseases: Progress and Barriers', ['Camila Torres', 'Imran Qureshi', 'Yuki Tanaka'], 2, 7, '2026-07-15', 889, 401),
  S('JIMRT2025000060', RA, AGR, 'Agroforestry Systems and Soil Organic Carbon on Smallholder Farms in Kerala', ['Lucia Romano', 'Samuel Adeyemi', 'Divya Menon'], 1, 12, '2025-12-15', 951, 436),
]

const COUNTS_2025 = [3, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 7]

function buildAll() {
  const issues: IssueSummary[] = []
  const articles: ArticleSummary[] = []
  const used = new Set(seeds.map((s) => s.id))
  const counters: Record<number, number> = {}
  let stemCursor = 0

  for (let year = 2025; year <= 2026; year++) {
    const vol = year - 2024
    const months = year === 2026 ? 9 : 12
    for (let m = 1; m <= months; m++) {
      const month = `${year}-${pad(m)}`
      const date = `${month}-15`
      const fixed = seeds.filter((s) => s.vol === vol && s.issue === m)
      const isCurrent = year === 2026 && m === 9
      const planned = year === 2025 ? COUNTS_2025[m - 1] : 6 + ((m * 5) % 3)
      const target = isCurrent ? fixed.length : Math.max(fixed.length, planned)
      const list: ArticleSummary[] = fixed.map((s, i) => ({
        paperId: s.id, type: s.type, subject: s.subject, title: s.title, authors: s.authors, volume: vol, issue: m, pages: '', publishedAt: s.date,
        views: s.views, downloads: s.downloads, citations: Math.floor(rnd(vol * 7 + m + i) * 3), abstract: makeAbstract(s.subject, vol * 100 + m * 10 + i),
      }))
      while (list.length < target) {
        const k = stemCursor++
        const subject = SUBJECTS[k % SUBJECTS.length]
        const stemList = STEMS[subject]
        const cycle = Math.floor(k / SUBJECTS.length)
        const title = stemList[cycle % stemList.length] + VARIANTS[Math.floor(cycle / stemList.length) % VARIANTS.length]
        counters[year] = (counters[year] ?? 0) + 1
        let id = `JIMRT${year}${pad(counters[year], 6)}`
        while (used.has(id)) { counters[year]++; id = `JIMRT${year}${pad(counters[year], 6)}` }
        used.add(id)
        const n = 2 + Math.floor(rnd(k + 3) * 3)
        const authors = Array.from({ length: n }, (_, j) => AUTHOR_POOL[(k * 3 + j * 7) % AUTHOR_POOL.length])
        const type: ArticleType = k % 9 === 4 ? 'Review Article' : k % 7 === 3 ? 'Short Communication' : 'Research Article'
        const ageDays = Math.max(20, (2026 - year) * 365 + (9 - m) * 30)
        list.push({
          paperId: id, type, subject, title, authors: [...new Set(authors)], volume: vol, issue: m, pages: '', publishedAt: date,
          views: Math.floor(90 + rnd(k + 9) * Math.min(820, ageDays * 2.1)), downloads: Math.floor(30 + rnd(k + 17) * Math.min(360, ageDays * 0.9)),
          citations: Math.floor(rnd(k + 23) * Math.min(4, ageDays / 90)),
          abstract: makeAbstract(subject, k + 400),
        })
      }
      // Editorials first, then sequential page ranges.
      list.sort((a, b) => Number(b.type === 'Editorial') - Number(a.type === 'Editorial'))
      let start = 1
      list.forEach((a, i) => {
        if (a.type === 'Editorial') { a.pages = 'i–iv'; return }
        const len = 7 + Math.floor(rnd(vol * 50 + m * 7 + i) * 16)
        a.pages = `${start}–${start + len - 1}`
        start += len
      })
      articles.push(...list)
      issues.push({ volume: vol, issue: m, month, publishedAt: date, articleCount: list.length, doi: `10.55041/JIMRT-V${vol}I${m}`, isCurrent })
    }
  }
  return { issues, articles }
}

const built = buildAll()
export const issues = built.issues // oldest → newest
export const allArticles = built.articles
export const currentIssue = issues[issues.length - 1]
export const byId = (id: string) => allArticles.find((a) => a.paperId === id)
export const issueArticles = (vol: number, issue: number) => allArticles.filter((a) => a.volume === vol && a.issue === issue)
