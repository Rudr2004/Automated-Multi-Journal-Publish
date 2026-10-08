// Deterministic mock catalogue: 4 volumes (2023–2026), monthly issues, ≥8 articles in the current issue.
import type { ArticleSummary, ArticleType, IssueSummary } from '../../../core/types'

import { rnd } from '../../shared/rnd'
export { rnd }
const pad = (n: number, w = 2) => String(n).padStart(w, '0')

export const SUBJECTS = ['Materials Science', 'Environmental Science', 'Computer Science', 'Biotechnology', 'Energy Systems', 'Public Health'] as const
export type Subject = (typeof SUBJECTS)[number]

export const AUTHOR_POOL = [
  'Ananya Iyer', 'Rahul Menon', 'Elena Petrova', 'Priya Nair', 'Thomas Becker', 'Vikram Desai', 'Mei Lin Tan', 'Arjun Kapoor',
  'Sneha Kulkarni', 'Daniel Okafor', 'Karthik Raman', 'Fatima Al-Mansoori', 'Sofia Lindqvist', 'Meera Joshi', 'Ritu Sharma',
  'James Whitfield', 'Nikhil Bhatia', 'Amara Nwosu', 'Lars Eriksen', 'Debasish Roy', 'Hannah Clarke', 'Sunita Verma',
  'Marcus Hoffmann', 'Chinwe Eze',
]
export const INSTITUTIONS = [
  'Indian Institute of Technology Delhi, New Delhi, India', 'Indian Institute of Science, Bengaluru, India',
  'Technical University of Munich, Munich, Germany', 'University of Cambridge, Cambridge, United Kingdom',
  'National University of Singapore, Singapore', 'University of Nigeria, Nsukka, Nigeria',
  'Lund University, Lund, Sweden', 'Jawaharlal Nehru University, New Delhi, India',
  'University of Toronto, Toronto, Canada', 'Khalifa University, Abu Dhabi, United Arab Emirates',
]

const STEMS: Record<Subject, string[]> = {
  'Materials Science': [
    'Perovskite Solar Absorbers with Improved Moisture Stability', 'Bio-Based Aerogels for Thermal Insulation in Buildings',
    'Corrosion Behaviour of Additively Manufactured Stainless Steel in Marine Environments',
    'Nanocellulose Films as Biodegradable Barrier Coatings', 'Fatigue Life of Hybrid Carbon–Glass Fibre Laminates',
  ],
  'Environmental Science': [
    'Satellite-Based Estimation of Urban Heat Island Intensity in Indian Metropolises', 'Constructed Wetlands for Greywater Treatment in Peri-Urban Settlements',
    'Soil Carbon Dynamics under Conservation Agriculture', 'Groundwater Nitrate Trends in the Indo-Gangetic Plain',
    'Air Quality Co-Benefits of Low-Emission Zones',
  ],
  'Computer Science': [
    'Privacy-Preserving Recommendation with Federated Matrix Factorisation', 'Graph Neural Networks for Fraud Detection in Digital Payments',
    'Explainable Anomaly Detection in Industrial Sensor Streams', 'Low-Resource Machine Translation for Indic Languages',
    'Energy-Aware Scheduling for Containerised Workloads',
  ],
  Biotechnology: [
    'Engineered Yeast for Low-Cost Production of Plant-Derived Antimalarials', 'Phage Cocktails against Multidrug-Resistant Klebsiella pneumoniae',
    'Enzymatic Hydrolysis of Agricultural Residues for Bioethanol', 'Algal Biofilters for Aquaculture Effluent',
    'Cell-Free Biosensors for Heavy Metal Detection in Water',
  ],
  'Energy Systems': [
    'Demand Response Potential of Residential Air Conditioning in South Asia', 'Hydrogen Blending in Existing Natural Gas Networks: A Safety Assessment',
    'Model Predictive Control of Hybrid Microgrids with Variable Renewables', 'Life-Cycle Emissions of Second-Life EV Battery Storage',
    'Wind Resource Assessment Using Mesoscale Reanalysis Data',
  ],
  'Public Health': [
    'Digital Adherence Tools and Tuberculosis Treatment Outcomes', 'Household Air Pollution and Childhood Respiratory Illness in Rural India',
    'Vaccine Hesitancy and Information Sources among Young Adults', 'Cost-Effectiveness of Community Screening for Hypertension',
    'Mental Health Service Access in Urban Informal Settlements',
  ],
}
const VARIANTS = ['', ': A Multi-Centre Study', ' in Low-Resource Settings', ': Evidence from a Five-Year Cohort']
const ABSTRACT_BITS: Record<Subject, [string, string, string]> = {
  'Materials Science': ['Developing durable, lightweight materials remains a central challenge for sustainable manufacturing', 'specimens were fabricated and characterised using electron microscopy, X-ray diffraction and mechanical testing', 'tensile strength and thermal stability improved over the reference material'],
  'Environmental Science': ['Reliable environmental monitoring is essential for evidence-based policy', 'field measurements were combined with remote sensing and statistical modelling across multiple sites', 'significant spatial and seasonal variation was observed in the key indicators'],
  'Computer Science': ['Modern learning systems must balance accuracy with privacy, efficiency and transparency', 'we propose a lightweight architecture and evaluate it on public benchmarks and a real-world dataset', 'the approach matched or exceeded strong baselines while reducing computational cost'],
  Biotechnology: ['Accessible biotechnological tools can transform healthcare and sustainable production', 'strains and assays were designed, validated in triplicate and compared with standard protocols', 'sensitivity and yield improved while keeping reagent costs low'],
  'Energy Systems': ['Decarbonising energy supply requires solutions that are technically sound and economically viable', 'we developed a simulation model, calibrated it with measured data and ran scenario analyses', 'the proposed configuration reduced cost and emissions under realistic operating conditions'],
  'Public Health': ['Effective public health programmes depend on robust evidence from the communities they serve', 'a mixed-methods design combined survey data, routine records and structured interviews', 'meaningful differences in outcomes were associated with access and awareness'],
}

export function makeAbstract(subject: Subject, id: number) {
  const [bg, method, result] = ABSTRACT_BITS[subject]
  const pct = 8 + Math.floor(rnd(id) * 30)
  return `${bg}. In this study, ${method}. Results showed that ${result}, with an average improvement of ${pct}% relative to the baseline (p < 0.05). These findings are discussed in the context of existing literature, and practical recommendations and directions for future work are outlined.`
}

interface Seed { id: string; type: ArticleType; subject: Subject; title: string; authors: string[]; vol: number; issue: number; date: string; views: number; downloads: number }
const S = (id: string, type: ArticleType, subject: Subject, title: string, authors: string[], vol: number, issue: number, date: string, views: number, downloads: number): Seed =>
  ({ id, type, subject, title, authors, vol, issue, date, views, downloads })

const RA = 'Research Article', RV = 'Review Article', SC = 'Short Communication', ED = 'Editorial'
const seeds: Seed[] = [
  S('IJMAT2026000121', RA, 'Materials Science', 'Graphene-Reinforced Polymer Composites for Lightweight Structural Applications', ['Ananya Iyer', 'Rahul Menon', 'Elena Petrova'], 4, 9, '2026-09-15', 3412, 1208),
  S('IJMAT2026000122', RV, 'Environmental Science', 'Microplastics in Freshwater Systems: A Review of Sources, Fate and Mitigation', ['Priya Nair', 'Thomas Becker'], 4, 9, '2026-09-15', 5120, 2231),
  S('IJMAT2026000123', RA, 'Computer Science', 'A Lightweight Transformer for Crop Disease Detection on Edge Devices', ['Vikram Desai', 'Mei Lin Tan', 'Arjun Kapoor'], 4, 9, '2026-09-15', 4388, 1675),
  S('IJMAT2026000124', SC, 'Biotechnology', 'CRISPR-Based Rapid Diagnostics for Waterborne Pathogens: A Pilot Study', ['Sneha Kulkarni', 'Daniel Okafor'], 4, 9, '2026-09-15', 1894, 702),
  S('IJMAT2026000125', RA, 'Energy Systems', 'Techno-Economic Assessment of Rooftop Solar with Battery Storage in Tier-2 Indian Cities', ['Karthik Raman', 'Fatima Al-Mansoori', 'Sofia Lindqvist'], 4, 9, '2026-09-15', 2976, 1344),
  S('IJMAT2026000126', ED, 'Public Health', 'Open Data Practices in Public Health Research: Editorial Perspective', ['Meera Joshi'], 4, 9, '2026-09-15', 1203, 411),
  S('IJMAT2026000127', RA, 'Public Health', 'Community Health Worker Interventions and Maternal Care Uptake in Rural Karnataka', ['Sunita Verma', 'Chinwe Eze', 'Hannah Clarke'], 4, 9, '2026-09-15', 2651, 980),
  S('IJMAT2026000128', RV, 'Biotechnology', 'Microbial Consortia for Sustainable Biofuel Production: Progress and Prospects', ['Nikhil Bhatia', 'Lars Eriksen'], 4, 9, '2026-09-15', 3305, 1422),
  S('IJMAT2026000129', SC, 'Computer Science', 'Benchmarking Quantised Language Models on Low-Cost Hardware', ['Arjun Kapoor', 'Amara Nwosu'], 4, 9, '2026-09-15', 4012, 1590),
  S('IJMAT2026000130', RA, 'Energy Systems', 'Grid-Scale Sodium-Ion Battery Degradation under Variable Duty Cycles', ['Debasish Roy', 'Marcus Hoffmann', 'Ritu Sharma'], 4, 9, '2026-09-15', 2240, 865),
  S('IJMAT2026000118', RA, 'Materials Science', 'Sol–Gel Synthesis of Titanium Dioxide Thin Films for Self-Cleaning Coatings', ['Ritu Sharma', 'James Whitfield'], 4, 8, '2026-08-14', 6120, 2890),
  S('IJMAT2026000115', RV, 'Computer Science', 'Federated Learning for Healthcare: Privacy, Fairness and Deployment Challenges', ['Nikhil Bhatia', 'Amara Nwosu', 'Lars Eriksen'], 4, 8, '2026-08-14', 7345, 3410),
  S('IJMAT2026000110', RA, 'Environmental Science', 'Remote Sensing of Mangrove Carbon Stocks along the Sundarbans Coast', ['Debasish Roy', 'Hannah Clarke'], 4, 7, '2026-07-13', 5560, 2102),
]

function buildAll() {
  const issues: IssueSummary[] = []
  const articles: ArticleSummary[] = []
  const used = new Set(seeds.map((s) => s.id))
  const counters: Record<number, number> = {}
  let stemCursor = 0

  for (let year = 2023; year <= 2026; year++) {
    const vol = year - 2022
    const months = year === 2026 ? 9 : 12
    for (let m = 1; m <= months; m++) {
      const month = `${year}-${pad(m)}`
      const date = `${month}-15`
      const fixed = seeds.filter((s) => s.vol === vol && s.issue === m)
      const isCurrent = year === 2026 && m === 9
      const target = isCurrent ? fixed.length : Math.max(fixed.length, 5 + ((vol * 3 + m) % 4))
      const list: ArticleSummary[] = fixed.map((s, i) => ({
        paperId: s.id, type: s.type, subject: s.subject, title: s.title, authors: s.authors, volume: vol, issue: m, pages: '', publishedAt: s.date,
        views: s.views, downloads: s.downloads, citations: Math.round(s.views / 380 + rnd(vol * 7 + m + i) * 9), abstract: makeAbstract(s.subject, vol * 100 + m * 10 + i),
      }))
      while (list.length < target) {
        const k = stemCursor++
        const subject = SUBJECTS[k % SUBJECTS.length]
        const stemList = STEMS[subject]
        const cycle = Math.floor(k / SUBJECTS.length)
        const title = stemList[cycle % stemList.length] + VARIANTS[Math.floor(cycle / stemList.length) % VARIANTS.length]
        counters[year] = (counters[year] ?? 0) + 1
        let id = `IJMAT${year}${pad(counters[year], 6)}`
        while (used.has(id)) { counters[year]++; id = `IJMAT${year}${pad(counters[year], 6)}` }
        used.add(id)
        const n = 2 + Math.floor(rnd(k + 3) * 3)
        const authors = Array.from({ length: n }, (_, j) => AUTHOR_POOL[(k * 3 + j * 5) % AUTHOR_POOL.length])
        const type: ArticleType = k % 9 === 4 ? 'Review Article' : k % 7 === 3 ? 'Short Communication' : 'Research Article'
        const ageDays = Math.max(20, (2026 - year) * 365 + (9 - m) * 30)
        list.push({
          paperId: id, type, subject, title, authors: [...new Set(authors)], volume: vol, issue: m, pages: '', publishedAt: date,
          views: Math.floor(300 + rnd(k + 9) * Math.min(5200, ageDays * 4)), downloads: Math.floor(120 + rnd(k + 17) * Math.min(2100, ageDays * 1.6)),
          citations: Math.floor(rnd(k + 23) * Math.min(24, ageDays / 20)),
          abstract: makeAbstract(subject, k + 400),
        })
      }
      // Editorials first, then sequential page ranges.
      list.sort((a, b) => Number(b.type === 'Editorial') - Number(a.type === 'Editorial'))
      let start = 1
      list.forEach((a, i) => {
        if (a.type === 'Editorial') { a.pages = 'i–iv'; return }
        const len = 7 + Math.floor(rnd(vol * 50 + m * 7 + i) * 18)
        a.pages = `${start}–${start + len - 1}`
        start += len
      })
      articles.push(...list)
      issues.push({ volume: vol, issue: m, month, publishedAt: date, articleCount: list.length, doi: `10.55041/IJMAT-V${vol}I${m}`, isCurrent })
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
