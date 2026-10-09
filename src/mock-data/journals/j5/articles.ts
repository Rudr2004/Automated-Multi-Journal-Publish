// IJFRD mock catalogue: Volume 1 (2026), one issue a month, Issues 1–9 (Jan–Sep). A new journal, so counts are modest.
import type { ArticleSummary, ArticleType, IssueSummary } from '../../../core/types'
import { j5Areas } from '../../../config/journals/j5'
import { rnd } from '../../shared/rnd'

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

export const SUBJECTS = j5Areas.map((d) => d.name)
export type Subject = (typeof SUBJECTS)[number]

const [PHY, CHM, MAT, LIF, ERT, MTH, CMP, ENG, DEV] = SUBJECTS

export const AUTHOR_POOL = [
  'Ritika Bhandari', 'Karan Oberoi', 'Mikhail Sorokin', 'Aiko Hasegawa', 'Emmanuel Tetteh', 'Elodie Marchand', 'Vishal Hegde', 'Sana Qureshi',
  'Pieter van der Meer', 'Adaeze Okeke', 'Gaurav Mittal', 'Nadiya Kovalenko', 'Hamza Idrissi', 'Lakshmi Ranganathan', 'Rafael Bianchi', 'Ingeborg Dahl',
  'Tomasz Zielinski', 'Farah Siddiqi', 'Siddharth Venkatesan', 'Marisol Vega', 'Daichi Yamamoto', 'Tanuja Phadke', 'Julien Moreau', 'Chinedu Obiora',
]
export const INSTITUTIONS = [
  'Indian Institute of Science, Bengaluru, India', 'Tata Institute of Fundamental Research, Mumbai, India',
  'Indian Institute of Science Education and Research, Pune, India', 'University of Oslo, Oslo, Norway',
  'ETH Zurich, Zurich, Switzerland', 'Nanyang Technological University, Singapore',
  'University of Bologna, Bologna, Italy', 'Kyoto University, Kyoto, Japan',
  'University of Cape Town, Cape Town, South Africa', 'Max Planck Institute for Solid State Research, Stuttgart, Germany',
  'University of Melbourne, Melbourne, Australia', 'Seoul National University, Seoul, South Korea',
]

const STEMS: Record<string, string[]> = {
  [PHY]: [
    'Spin-Wave Propagation Losses in Ferrimagnetic Insulator Waveguides', 'Gravitational Lensing Signatures of Compact Dark-Matter Substructure in Galaxy Clusters',
    'Decoherence Mechanisms in Superconducting Transmon Qubits at Millikelvin Temperatures', 'Photometric Variability of Young Stellar Objects in Nearby Star-Forming Regions',
    'Critical Scaling near the Superfluid Transition in Confined Helium Films',
  ],
  [CHM]: [
    'Mechanistic Study of Palladium-Catalysed C–H Arylation under Mild Aqueous Conditions', 'Solvent Effects on Proton-Coupled Electron Transfer in Quinone Redox Couples',
    'Kinetics of Ozone Reactions with Aromatic Pollutants in Aqueous Media', 'Metal–Organic Framework Sorbents for Selective Capture of Carbon Dioxide from Humid Flue Gas',
    'Photophysical Properties of Donor–Acceptor Cyclometalated Iridium Complexes',
  ],
  [MAT]: [
    'Grain Growth Kinetics in Nanocrystalline Nickel–Tungsten Electrodeposits', 'Thermal Conductivity of Graphene–Polymer Nanocomposites across the Percolation Threshold',
    'Defect Chemistry and Ionic Conductivity of Doped Ceria Thin Films', 'Quantum Confinement Effects in Solution-Grown Perovskite Nanocrystals',
    'Fracture Toughness of Ultrahigh-Temperature Ceramic Composites at Elevated Temperature',
  ],
  [LIF]: [
    'Transcriptional Response of Rice Seedlings to Combined Heat and Drought Stress', 'Structural Basis of Substrate Recognition in a Bacterial ABC Transporter',
    'CRISPR Interference Screening of Essential Genes in Mycobacterial Cell-Wall Synthesis', 'Gut Microbiome Shifts during Early Weaning in Indigenous Cattle Breeds',
    'Directed Evolution of a Thermostable Cellulase for Lignocellulosic Hydrolysis',
  ],
  [ERT]: [
    'Chloride Mass Balance Estimates of Groundwater Recharge in a Semi-Arid Granitic Terrain', 'Stable Isotope Records of Monsoon Variability from Speleothems of Central India',
    'Microplastic Transport and Retention in a Tropical River Estuary', 'Soil Carbon Stabilisation under Contrasting Agroforestry Systems',
    'Seismic Velocity Structure of the Himalayan Foreland Basin from Ambient Noise Tomography',
  ],
  [MTH]: [
    'Spectral Gap Estimates for Random Walks on Cayley Graphs of Finite Groups', 'Existence and Uniqueness of Weak Solutions for a Class of Nonlinear Fractional Diffusion Equations',
    'Bayesian Changepoint Detection in Dependent Count Time Series', 'Asymptotic Distribution of Eigenvalues of Sparse Random Matrices',
    'Minimax Rates for Nonparametric Regression under Covariate Shift',
  ],
  [CMP]: [
    'Mixed-Precision Arithmetic in Iterative Solvers for Large Sparse Linear Systems', 'Graph Neural Network Surrogates for Molecular Dynamics Force Fields',
    'Lattice Boltzmann Simulation of Multiphase Flow in Porous Media on GPU Clusters', 'Uncertainty Quantification in Climate Emulators Using Gaussian Process Ensembles',
    'Reproducible Workflows for Large-Scale Genomic Data Analysis',
  ],
  [ENG]: [
    'Fatigue Crack Growth Thresholds in Additively Manufactured Titanium Alloys', 'Nonlinear Vibration of Thin Plates under Combined Thermal and Mechanical Loading',
    'Turbulent Boundary Layer Control Using Spanwise Wall Oscillation', 'Heat Transfer Enhancement in Pulsating Flow through Corrugated Channels',
    'Constitutive Modelling of Rate-Dependent Behaviour in Elastomeric Foams',
  ],
  [DEV]: [
    'Community Solar Microgrids and Energy Access: Evidence from Off-Grid Villages', 'Open Science Policies and Data-Sharing Practices among Early-Career Researchers',
    'Digital Public Infrastructure and Last-Mile Service Delivery in Rural Health Systems', 'Skills Pipelines and Industrial Upgrading in Emerging-Economy Manufacturing Clusters',
    'Regulatory Sandboxes for Emerging Technologies: A Comparative Policy Review',
  ],
}
const VARIANTS = ['', ': A Comparative Evaluation', ': New Experimental Evidence', ': A Unified Framework']

const ABSTRACT_BITS: Record<string, [bg: string, method: string, result: string, sample: string]> = {
  [PHY]: ['Precise measurements of how energy is stored, transported and lost in physical systems underpin both new theory and new devices', 'we combined controlled experiments at low temperature or high sensitivity with a model fitted to the full set of measurements', 'the observed scaling agrees with the theoretical prediction over the measured range and identifies the dominant loss channel', 'measurement runs and fitted spectra'],
  [CHM]: ['Understanding why a reaction proceeds, and how fast, is the starting point for cleaner and more selective chemistry', 'we measured reaction rates and intermediates under systematically varied conditions and interpreted them with electronic-structure calculations', 'the data support a stepwise pathway and show which step controls the rate under the conditions studied', 'kinetic experiments and calculated pathways'],
  [MAT]: ['The structure of a material at the nanometre scale sets how it conducts heat and charge and how it fails', 'we prepared a series of samples, characterised them by diffraction and electron microscopy and measured the relevant properties as the structure was varied', 'property changes followed microstructural features in a consistent way and point to a clear design rule for the next generation of samples', 'samples and characterisation scans'],
  [LIF]: ['Linking molecular mechanisms to whole-organism behaviour is central to biology and to the biotechnology that builds on it', 'we combined molecular assays, sequencing and structural or statistical analysis on replicated biological samples', 'a small set of genes or residues accounted for most of the observed effect, and the result held in an independent replicate', 'biological replicates and sequenced libraries'],
  [ERT]: ['Reliable records of how water, carbon and sediment move through landscapes are needed to interpret environmental change', 'we collected field samples across a defined study area, analysed them in the laboratory and compared the results with regional records', 'the measurements show a clear spatial pattern that agrees with independent evidence and constrains the rates involved', 'field samples and laboratory measurements'],
  [MTH]: ['Sharp mathematical and statistical results tell us when a method works, how fast, and when it cannot', 'we proved the main statements from clearly stated assumptions and checked their sharpness with numerical examples', 'the stated rates are attained under the assumptions and cannot be improved in general', 'numerical examples and simulated data sets'],
  [CMP]: ['Large simulations and data analyses now sit beside experiment, so their accuracy and reproducibility matter as much as their speed', 'we implemented the method in open software, tested it against analytical solutions and benchmark problems and measured cost and error systematically', 'the proposed approach matched reference solutions closely at a fraction of the cost and behaved predictably as problem size grew', 'benchmark problems and computational runs'],
  [ENG]: ['Predicting how engineered components carry load, heat and flow from first principles reduces the need for trial and error', 'we derived a mechanics-based model, validated it with laboratory tests and compared it with accepted correlations', 'the model reproduced the measured behaviour within experimental uncertainty and clarified which parameters govern the response', 'laboratory test runs and model evaluations'],
  [DEV]: ['Decisions about how research becomes useful technology, and who benefits, rest on evidence that is often thin', 'we assembled records from institutions or households and analysed them with transparent statistical methods, supported by interviews where needed', 'the results link specific policy and funding choices to differences in outcomes and suggest where intervention is most effective', 'institutions, households and interviews'],
}

export function makeAbstract(subject: string, id: number) {
  const [bg, method, result, sample] = ABSTRACT_BITS[subject]
  const n = 12 + Math.floor(rnd(id) * 48)
  return `${bg}. In this study, ${method}. The analysis drew on ${n} ${sample} across multiple conditions. Findings suggest that ${result}. The article discusses implications for theory and for later development, and sets out open questions for further research.`
}

interface Seed { id: string; type: ArticleType; subject: string; title: string; authors: string[]; issue: number; date: string; views: number; downloads: number; abstract?: string; citations?: number }
const S = (id: string, type: ArticleType, subject: string, title: string, authors: string[], issue: number, date: string, views: number, downloads: number, abstract?: string, citations?: number): Seed =>
  ({ id, type, subject, title, authors, issue, date, views, downloads, abstract, citations })

const RA = 'Research Article', RV = 'Review Article', SC = 'Short Communication', ED = 'Editorial'
const seeds: Seed[] = [
  S('IJFRD2026000110', ED, DEV, 'Foundations First: Why Fundamental Research and Its Development Belong Together', ['Rajendra Varadarajan'], 9, '2026-09-15', 241, 79,
    'This editorial introduces the ninth issue of the International Journal of Fundamental Research and Development. It argues that discoveries in physics, chemistry, the life sciences and mathematics seldom become useful without a second, slower body of work on materials, methods and institutions, and it follows that thread through this month’s papers on spin-wave damping, mechanochemistry, nanocrystalline alloys, antimicrobial peptides, delta sediments, fractional diffusion, neural surrogates, microchannel heat sinks and university technology transfer.'),
  S('IJFRD2026000112', RA, PHY, 'Gilbert Damping and Surface Losses in Ultrathin Yttrium Iron Garnet Films Measured by Broadband Ferromagnetic Resonance', ['Ritika Bhandari', 'Mikhail Sorokin', 'Aiko Hasegawa', 'Karan Oberoi'], 9, '2026-09-15', 884, 331,
    'Low magnetic damping is the central requirement for using spin waves to carry and process information, yet the damping of ultrathin ferrimagnetic insulator films is often several times larger than that of bulk crystals. This article reports broadband ferromagnetic resonance measurements on epitaxial yttrium iron garnet (YIG) films 8 to 60 nm thick, grown by pulsed laser deposition on gadolinium gallium garnet substrates and measured between 2 and 40 GHz at temperatures from 10 to 300 K. Gilbert damping and inhomogeneous linewidth were separated by fitting the frequency dependence of the resonance linewidth, and the contribution of two-magnon scattering was tested by rotating the applied field out of the film plane. At room temperature the damping fell from 4.8 × 10⁻⁴ in the thinnest film to 1.7 × 10⁻⁴ in the 60 nm film, while inhomogeneous broadening stayed below 0.4 mT in every sample. Below 50 K a pronounced peak in the damping appeared, which we associate with slowly relaxing rare-earth impurities in the substrate rather than with the film itself. A simple surface-loss model with a single fitted surface parameter reproduces the thickness dependence to within the measurement uncertainty, and spin-wave propagation lengths calculated from the measured damping exceed 20 µm in films thicker than 20 nm. We discuss how interface roughness, annealing and substrate choice limit further reductions, and we provide the raw spectra and fitting scripts so that the analysis can be repeated independently.', 4),
  S('IJFRD2026000113', RV, CHM, 'Mechanochemical Synthesis of Organic and Inorganic Solids: Mechanisms, Scale-Up and Open Questions', ['Elodie Marchand', 'Gaurav Mittal', 'Sana Qureshi'], 9, '2026-09-15', 502, 214,
    'Grinding and milling can drive chemical reactions without bulk solvent, and the approach has moved from curiosity to a serious route to pharmaceuticals, framework materials and battery precursors. This review surveys work from the past decade on ball-mill and twin-screw reactions, covering how mechanical energy reaches the reacting particles, what is known about local heating and defect formation, and how in situ diffraction and Raman monitoring have exposed intermediate phases. We compare reaction outcomes across mill geometries, compile the few quantitative scale-up studies and identify where reports cannot be compared because energy input is not stated. We close with five open questions that we believe will decide whether mechanochemistry becomes a predictive science.', 3),
  S('IJFRD2026000114', RA, MAT, 'Grain-Boundary Segregation and Hardness in Nanocrystalline Copper–Tantalum Thin Films', ['Emmanuel Tetteh', 'Adaeze Okeke', 'Vishal Hegde'], 9, '2026-09-15', 417, 168,
    'Nanocrystalline metals are strong but usually coarsen when heated, which limits their use. We co-sputtered copper films containing 2 to 10 atomic percent tantalum and followed grain size, tantalum distribution and nanoindentation hardness before and after annealing for one hour at 400 and 600 °C. Atom probe tomography showed tantalum segregating to grain boundaries and forming clusters of about 2 nm above 6 atomic percent. Films with 6 percent or more tantalum kept grains below 30 nm after the 600 °C anneal, while pure copper coarsened beyond 200 nm, and hardness remained above 4.5 GPa in the stable films. A boundary-energy argument based on the measured segregation reproduces the observed stability window.'),
  S('IJFRD2026000115', SC, LIF, 'A Fluorescent Reporter Assay for Rapid Screening of Antimicrobial Peptide Activity at Bacterial Membranes', ['Lakshmi Ranganathan', 'Pieter van der Meer'], 9, '2026-09-15', 289, 103,
    'Screening antimicrobial peptides by growth inhibition is slow and cannot say whether a peptide disrupts the membrane. We describe a microplate assay in which Escherichia coli carries a membrane-potential-sensitive fluorescent reporter, so that depolarisation is read out within ten minutes of peptide addition. Tested on a panel of 24 synthetic peptides, the assay ranked membrane-active peptides consistently with minimum inhibitory concentrations and flagged three peptides whose growth inhibition did not involve the membrane. The protocol uses commercial reagents and a standard plate reader, and the peptide sequences and raw traces are provided.'),
  S('IJFRD2026000116', RA, ERT, 'Sediment Provenance and Weathering Intensity in the Godavari Delta since the Mid-Holocene', ['Tanuja Phadke', 'Rafael Bianchi', 'Ingeborg Dahl'], 9, '2026-09-15', 366, 141,
    'Delta sediments record how river catchments and climate have changed. We analysed three cores from the Godavari delta, dated by radiocarbon, using bulk geochemistry, clay mineralogy and neodymium isotopes. The isotopic signature shows that sediment came mainly from the Deccan basalts and the Eastern Ghats throughout the record, with a shift toward more basaltic input after about 4,200 years before present. The chemical index of alteration falls over the same interval, indicating weaker chemical weathering as monsoon rainfall declined. The agreement among three independent proxies supports a catchment-wide response to changing monsoon strength.'),
  S('IJFRD2026000117', RA, MTH, 'Convergence Analysis of a Spectral Collocation Scheme for Time-Fractional Diffusion on Bounded Domains', ['Tomasz Zielinski', 'Nadiya Kovalenko', 'Dhruv Khurana'], 9, '2026-09-15', 348, 132,
    'Fractional diffusion equations describe transport in media with memory, but their numerical solution is expensive and its accuracy depends delicately on solution regularity. We analyse a spectral collocation method in space combined with a graded finite-difference scheme in time for the Caputo time-fractional diffusion equation on an interval. We prove an error bound that is spectrally accurate in space for smooth data and of order 2 − α in time on suitably graded meshes, and we show that the temporal rate cannot be improved on uniform meshes when the solution has a weak singularity at the initial time. Numerical experiments for orders α between 0.2 and 0.9 confirm the predicted rates.'),
  S('IJFRD2026000118', RA, CMP, 'Physics-Informed Neural Surrogates for Stiff Reaction–Diffusion Systems: Training Stability and Error Bounds', ['Daichi Yamamoto', 'Julien Moreau', 'Farah Siddiqi'], 9, '2026-09-15', 455, 187,
    'Physics-informed neural networks often fail on stiff reaction–diffusion problems because the residual loss is dominated by fast reaction terms. We propose a sequence-to-sequence training strategy that advances the surrogate in short time windows with a stiffness-aware loss weighting, and we derive an a posteriori error bound in terms of the final residual and the Lipschitz constant of the reaction term. On the Gray–Scott and Brusselator benchmarks the method reached relative errors below 2 percent where a standard network reached 40 percent or more, using about one fifth of the training time. Code and trained models are released under an open licence.', 5),
  S('IJFRD2026000119', RA, ENG, 'Second-Law Analysis of Laminar Convective Heat Transfer in Microchannel Heat Sinks with Porous Inserts', ['Chinedu Obiora', 'Marisol Vega', 'Aaron Feldman'], 9, '2026-09-15', 394, 155,
    'Porous inserts raise heat transfer in microchannels but also increase pressure drop, and the trade-off is usually judged by pumping power alone. We solve the laminar flow and conjugate heat transfer in a rectangular microchannel with a partially filled porous insert and compute entropy generation from heat conduction and viscous dissipation. For Reynolds numbers between 50 and 400, the entropy-generation number has a minimum at an insert height of about 40 percent of the channel depth, with permeability and thermal conductivity ratio setting its position. The numerical model agrees with published experiments to within 6 percent for Nusselt number and 9 percent for pressure drop.'),
  S('IJFRD2026000120', RA, DEV, 'Research Funding Structures and Technology Transfer Outcomes in Indian Public Universities: A Panel Analysis', ['Siddharth Venkatesan', 'Joanna Wierzbicka', 'Sandeep Raghuvanshi'], 9, '2026-09-15', 312, 119,
    'Public universities generate much of the country’s basic research, yet the route from laboratory to licensed technology is uneven. Using a six-year panel of 58 public universities built from annual reports and patent records, we relate the mix of block, project and industry funding to licences and patent applications per researcher. Institutions with a larger share of multi-year project funding and a staffed technology transfer office filed more applications and signed more licences, while the share of industry funding alone showed no association after controlling for size and discipline mix. We discuss limits of the data and implications for funding design.'),
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
      let id = `IJFRD${year}${pad(counter, 6)}`
      while (used.has(id)) { counter++; id = `IJFRD${year}${pad(counter, 6)}` }
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
    issues.push({ volume: 1, issue: m, month, publishedAt: date, articleCount: list.length, doi: `10.55041/IJFRD-V1I${m}`, isCurrent })
  }
  return { issues, articles }
}

const built = buildAll()
export const issues = built.issues // oldest → newest
export const allArticles = built.articles
export const currentIssue = issues[issues.length - 1]
export const byId = (id: string) => allArticles.find((a) => a.paperId === id)
export const issueArticles = (vol: number, issue: number) => allArticles.filter((a) => a.volume === vol && a.issue === issue)
