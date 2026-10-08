// Journal 4 (IJECM) mock catalogue: Volume 1 (2026), one issue a month, Issues 1–9 (Jan–Sep). A new journal, so counts are modest.
import type { ArticleSummary, ArticleType, IssueSummary } from '../../../core/types'
import { j4Areas } from '../../../config/journals/j4'
import { rnd } from '../../shared/rnd'

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

export const SUBJECTS = j4Areas.map((d) => d.name)
export type Subject = (typeof SUBJECTS)[number]

const [CIV, MEC, ELE, EMB, CMP, IND, OPS, PRJ, INF] = SUBJECTS

export const AUTHOR_POOL = [
  'Ashwin Krishnamurthy', 'Kavitha Subramanian', 'Rohit Bansal', 'Neha Agarwal', 'Dmitri Volkov', 'Elisa Romano', 'Samir Khanna', 'Swati Choudhury',
  'Tobias Hartmann', 'Ngozi Adebayo', 'Lucas Ferreira', 'Marta Kowalska', 'Naresh Gowda', 'Divya Prakash', 'Ibrahim Yusuf', 'Sakura Ito',
  'Pradeep Menon', 'Rekha Bhattacharjee', 'Jun-ho Park', 'Leena Thomas', 'Arnav Saxena', 'Anika Schmidt',
]
export const INSTITUTIONS = [
  'Indian Institute of Technology Madras, Chennai, India', 'KTH Royal Institute of Technology, Stockholm, Sweden',
  'National University of Singapore, Singapore', 'University of Warwick, Coventry, United Kingdom',
  'Technical University of Munich, Munich, Germany', 'Indian Institute of Technology Bombay, Mumbai, India',
  'Universidad Politécnica de Madrid, Madrid, Spain', 'University of Cape Town, Cape Town, South Africa',
  'National Institute of Technology Warangal, Warangal, India', 'Seoul National University, Seoul, South Korea',
]

const STEMS: Record<string, string[]> = {
  [CIV]: [
    'Fatigue Assessment of Welded Steel Girders under Variable Traffic Loading', 'Seismic Retrofitting of Mid-Rise Masonry-Infilled Frames with Fibre Wraps',
    'Behaviour of Geopolymer Concrete Beams under Sustained Load', 'Settlement Prediction for Pile Groups in Soft Marine Clay',
    'Wind-Induced Response of Slender Reinforced Concrete Chimneys',
  ],
  [MEC]: [
    'Lean Cell Redesign and Cycle-Time Reduction in Automotive Component Machining', 'Tool Wear Monitoring in High-Speed Milling of Titanium Alloys',
    'Thermal Management of Lithium-Ion Battery Packs Using Phase-Change Materials', 'Process Parameter Optimisation in Wire Arc Additive Manufacturing',
    'Total Productive Maintenance and Equipment Effectiveness in Small Foundries',
  ],
  [ELE]: [
    'Coordinated Droop Control for Islanded DC Microgrids with Mixed Storage', 'Short-Term Load Forecasting for Distribution Feeders with Rooftop Solar',
    'Fault Location in Medium-Voltage Cable Networks Using Travelling-Wave Signatures', 'Optimal Sizing of Hybrid Solar-Biomass Systems for Rural Electrification',
    'Voltage Regulation in Low-Voltage Networks with High Electric Vehicle Penetration',
  ],
  [EMB]: [
    'Low-Power Wireless Sensor Nodes for Structural Strain Monitoring', 'Firmware Update Reliability in Resource-Constrained IoT Devices',
    'Sensor Fusion on a Microcontroller for Low-Cost Attitude Estimation', 'Energy Harvesting from Ambient Vibration for Maintenance-Free Sensing',
    'Time Synchronisation in Distributed Embedded Data Acquisition Systems',
  ],
  [CMP]: [
    'Model Predictive Control of a Continuous Stirred Tank Reactor Using Neural Surrogates', 'PLC Program Verification for Batch Process Plants',
    'Digital Twin Architecture for a Packaging Line', 'Anomaly Detection in Industrial Control Networks Using Lightweight Classifiers',
    'Adaptive PID Tuning for Servo Drives under Varying Load',
  ],
  [IND]: [
    'Ergonomic Workstation Redesign and Assembly Line Balancing', 'Simulation-Based Capacity Planning for a Multi-Product Job Shop',
    'Reliability-Centred Maintenance Scheduling for Process Equipment', 'Human Reliability in Manual Inspection Tasks',
    'Value Stream Mapping in Make-to-Order Fabrication',
  ],
  [OPS]: [
    'Inventory Policy Optimisation for Perishable Goods under Demand Uncertainty', 'Supplier Selection Using Hybrid Multi-Criteria Decision Methods',
    'Last-Mile Delivery Routing with Time Windows in Congested Cities', 'Resilience of Pharmaceutical Supply Chains to Disruption',
    'Warehouse Order Picking Strategies with Zoned Storage',
  ],
  [PRJ]: [
    'Risk Allocation and Contract Performance in Public Infrastructure Projects', 'Earned Value Forecasting Accuracy in Construction Programmes',
    'Critical Chain Scheduling in Multi-Project Engineering Firms', 'Stakeholder Engagement and Delay Drivers in Metro Rail Construction',
    'Agile Practices in Hardware Product Development Teams',
  ],
  [INF]: [
    'Smart Water Metering and Leakage Detection in Urban Distribution Networks', 'Life-Cycle Assessment of Recycled Aggregate in Road Pavements',
    'Digital Twins for Building Energy Management in Campus Facilities', 'Resilient Design of Coastal Drainage Infrastructure under Sea-Level Rise',
    'Condition Monitoring of Rural Roads Using Smartphone Sensing',
  ],
}
const VARIANTS = ['', ': A Comparative Evaluation', ': Evidence from Field Data', ': A Practical Framework']

const ABSTRACT_BITS: Record<string, [bg: string, method: string, result: string, sample: string]> = {
  [CIV]: ['Ageing and heavily loaded structures demand reliable ways to judge remaining capacity and to guide repair', 'we combined laboratory testing of scaled specimens with finite element modelling calibrated against measured responses', 'the proposed approach tracked measured behaviour closely and identified governing failure modes earlier than conventional design checks', 'test specimens and monitored members'],
  [MEC]: ['Manufacturers are under pressure to raise productivity and quality while keeping energy use and waste in check', 'we ran controlled machining and process trials, supported by shop-floor observation and statistical analysis of the results', 'selected process settings and layout changes delivered consistent gains in output and quality with no loss of reliability', 'production runs and test cycles'],
  [ELE]: ['Power networks are absorbing more renewable generation, storage and flexible loads, which strains traditional planning and control', 'we built a detailed simulation of the network, validated it against recorded feeder data and compared several control and sizing strategies', 'coordinated control improved voltage quality and renewable utilisation while keeping cost within practical limits', 'simulated operating scenarios and recorded load profiles'],
  [EMB]: ['Low-cost sensing and embedded computing are making dense, long-lived measurement feasible in places where it was once impractical', 'we designed and built prototype nodes, bench-tested them and then deployed them in the field for several weeks', 'the prototypes met accuracy and battery-life targets while cutting cost per node substantially against commercial units', 'bench tests and field deployments'],
  [CMP]: ['Modern plants depend on control software and data-driven models that must be dependable as well as accurate', 'we developed the controller or monitoring model, tested it in simulation and then evaluated it on a laboratory test bed', 'the approach reduced tracking error and false alarms relative to baseline schemes under varying operating conditions', 'experimental runs and logged signals'],
  [IND]: ['Industrial and systems engineers must balance productivity, quality, safety and cost across complex production systems', 'we combined time studies, discrete-event simulation and structured interviews with supervisors across several plants', 'redesigned workflows improved throughput and reduced waiting and rework, with the largest gains in the busiest stations', 'observed work cycles and simulation replications'],
  [OPS]: ['Operations and supply chain decisions must hold up under uncertain demand, variable lead times and occasional disruption', 'we formulated an optimisation model, solved it with a heuristic and tested it on industry data and generated instances', 'the proposed policy lowered total cost and improved service levels relative to rules commonly used in practice', 'real and synthetic problem instances'],
  [PRJ]: ['Engineering projects regularly overrun schedule and budget, and the causes are often organisational as much as technical', 'we surveyed project professionals and analysed records from completed projects, complemented by interviews with project managers', 'early risk identification, clear contract terms and regular stakeholder reviews were most strongly associated with better schedule and cost outcomes', 'projects and survey respondents'],
  [INF]: ['Cities and utilities are turning to sensing, data and low-carbon materials to make infrastructure more efficient and more resilient', 'we combined field measurements, life-cycle accounting and a calibrated model of the system under study', 'the data-driven approach cut losses and emissions while meeting the service requirements set by operators', 'monitoring sites and modelled scenarios'],
}

export function makeAbstract(subject: string, id: number) {
  const [bg, method, result, sample] = ABSTRACT_BITS[subject]
  const n = 12 + Math.floor(rnd(id) * 48)
  return `${bg}. In this study, ${method}. The analysis drew on ${n} ${sample} across multiple conditions. Findings suggest that ${result}. The article discusses implications for design, practice and management, and sets out directions for further engineering research.`
}

interface Seed { id: string; type: ArticleType; subject: string; title: string; authors: string[]; issue: number; date: string; views: number; downloads: number; abstract?: string; citations?: number }
const S = (id: string, type: ArticleType, subject: string, title: string, authors: string[], issue: number, date: string, views: number, downloads: number, abstract?: string, citations?: number): Seed =>
  ({ id, type, subject, title, authors, issue, date, views, downloads, abstract, citations })

const RA = 'Research Article', RV = 'Review Article', SC = 'Short Communication', ED = 'Editorial'
const seeds: Seed[] = [
  S('IJECM2026000110', ED, PRJ, 'From Components to Systems: Engineering Concepts and Management Practice under One Roof', ['Venkatesh Subramaniam'], 9, '2026-09-15', 241, 79,
    'This editorial introduces the ninth issue of the International Journal of Engineering Concepts and Management. It reflects on why structural, electrical, manufacturing and management questions increasingly need to be studied together, and outlines the threads that run through this month’s papers on bridge monitoring, microgrids, lean production, supply chains, project risk and smart infrastructure.'),
  S('IJECM2026000112', RA, CIV, 'Vibration-Based Structural Health Monitoring of a Prestressed Concrete Bridge Using Operational Modal Analysis', ['Ashwin Krishnamurthy', 'Deepa Narayanan', 'Samir Khanna', 'Pavel Novotny'], 9, '2026-09-15', 884, 331,
    'Early detection of stiffness loss in ageing bridges allows maintenance to be planned before damage becomes costly or unsafe. This article reports a seven-month vibration monitoring programme on a 62 m prestressed concrete girder bridge carrying mixed highway traffic. Wireless accelerometers recorded ambient response at twelve locations, and natural frequencies and mode shapes were identified with stochastic subspace identification and tracked after removing temperature effects. A calibrated finite element model was then used to relate frequency shifts to simulated stiffness loss at the bearings and in the mid-span girders. Frequency changes of about 1.5 percent were separated from temperature variation, and the method localised an introduced test damage case to within one girder segment. Peak accelerations stayed below 0.35 m/s² under normal traffic. We discuss sensor placement, data quality and how the approach can be turned into an inspection trigger for bridge owners.', 4),
  S('IJECM2026000113', RV, ELE, 'Control Strategies for Islanded and Grid-Connected Microgrids: A Review of Recent Developments', ['Henrik Johansson', 'Fiona McAllister', 'Kavitha Subramanian'], 9, '2026-09-15', 502, 214, undefined, 3),
  S('IJECM2026000114', RA, OPS, 'Robust Inventory Policies for Cold-Chain Distribution of Vaccines under Demand and Lead-Time Uncertainty', ['Shalini Mathur', 'Michael Thornton', 'Rohit Bansal'], 9, '2026-09-15', 417, 168),
  S('IJECM2026000115', SC, EMB, 'A Low-Cost Strain Sensing Node with Energy Harvesting for Long-Term Structural Monitoring', ['Pavel Novotny', 'Jun-ho Park'], 9, '2026-09-15', 289, 103),
  S('IJECM2026000116', RA, MEC, 'Lean Cell Conversion and Equipment Effectiveness in a Tier-2 Automotive Machining Plant', ['Rajiv Chaudhary', 'Neha Agarwal', 'Ibrahim Yusuf'], 9, '2026-09-15', 366, 141),
  S('IJECM2026000117', RA, PRJ, 'Early Risk Identification and Schedule Performance in Urban Metro Construction Packages', ['Sofia Andersson', 'Naveen Reddy', 'Leena Thomas'], 9, '2026-09-15', 348, 132),
  S('IJECM2026000118', RA, CMP, 'Lightweight Anomaly Detection for Programmable Logic Controller Networks in Batch Process Plants', ['Priyam Bose', 'Dmitri Volkov', 'Sakura Ito'], 9, '2026-09-15', 455, 187),
  S('IJECM2026000119', RA, INF, 'Pressure-Based Leakage Localisation in District Metered Water Networks Using Sparse Sensing', ['Kwabena Asante', 'Elisa Romano', 'Pradeep Menon'], 9, '2026-09-15', 394, 155),
  S('IJECM2026000120', RA, IND, 'Constraint-Based Job Shop Scheduling with Maintenance Windows in a Multi-Product Fabrication Plant', ['Ingrid Vogel', 'Tobias Hartmann', 'Swati Choudhury'], 9, '2026-09-15', 312, 119),
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
      views: s.views, downloads: s.downloads, citations: s.citations ?? Math.floor(rnd(m + i) * 3), abstract: s.abstract ?? makeAbstract(s.subject, m * 10 + i),
    }))
    while (list.length < target) {
      const k = stemCursor++
      const subject = SUBJECTS[k % SUBJECTS.length]
      const stemList = STEMS[subject]
      const cycle = Math.floor(k / SUBJECTS.length)
      const title = stemList[cycle % stemList.length] + VARIANTS[Math.floor(cycle / stemList.length) % VARIANTS.length]
      counter++
      let id = `IJECM${year}${pad(counter, 6)}`
      while (used.has(id)) { counter++; id = `IJECM${year}${pad(counter, 6)}` }
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
    issues.push({ volume: 1, issue: m, month, publishedAt: date, articleCount: list.length, doi: `10.55041/IJECM-V1I${m}`, isCurrent })
  }
  return { issues, articles }
}

const built = buildAll()
export const issues = built.issues // oldest → newest
export const allArticles = built.articles
export const currentIssue = issues[issues.length - 1]
export const byId = (id: string) => allArticles.find((a) => a.paperId === id)
export const issueArticles = (vol: number, issue: number) => allArticles.filter((a) => a.volume === vol && a.issue === issue)
