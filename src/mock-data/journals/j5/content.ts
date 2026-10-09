// IJFRD research-area profiles and hand-written full text for the editorial and the featured paper; the generic article builder is shared (mock-data/shared/buildFull).
import type { ArticleFull, ArticleSection, Reference } from '../../../core/types'
import { createBuildFull, type Profile } from '../../shared/buildFull'
import { INSTITUTIONS, SUBJECTS, allArticles } from './articles'

const [PHY, CHM, MAT, LIF, ERT, MTH, CMP, ENG, DEV] = SUBJECTS

const P: Record<string, Profile> = {
  [PHY]: {
    field: 'physics and astronomy', problem: 'the need to know how energy is stored, transported and lost in physical systems', gap: 'few measurements that cover the full range of temperature and frequency needed to test competing models',
    approach: 'controlled low-temperature or high-sensitivity measurement with model fitting', setup: 'samples were measured over a wide range of frequency and temperature, and the complete data set was fitted to a model with as few free parameters as possible',
    metric: 'fitted loss rate', unit: '10⁻⁴', groups: ['Thinnest sample', 'Thin sample', 'Intermediate sample', 'Thick sample', 'Bulk reference'],
    keywords: ['condensed matter physics', 'magnetic resonance', 'quantum coherence', 'observational astronomy', 'scaling theory'],
    refJournals: ['Physical Review B', 'Physical Review Letters', 'Reviews of Modern Physics', 'The Astrophysical Journal'],
    params: [['Samples', '5 thicknesses', 'Grown in one campaign'], ['Frequency range', '2–40 GHz', 'Swept at fixed field'], ['Temperature', '10–300 K', 'Cryostat with ±0.1 K stability'], ['Analysis', 'Nonlinear least squares', 'Uncertainties from bootstrap']],
  },
  [CHM]: {
    field: 'chemistry and chemical sciences', problem: 'the need to understand why reactions proceed and how fast, so that cleaner and more selective processes can be designed', gap: 'little direct evidence for intermediates under the conditions in which the reactions are actually run',
    approach: 'kinetic experiments combined with electronic-structure calculations', setup: 'reaction rates were measured by spectroscopy under varied concentration, temperature and solvent, and the observed trends were compared with computed energy profiles',
    metric: 'rate constant', unit: 's⁻¹', groups: ['Uncatalysed', 'Low loading', 'Medium loading', 'High loading', 'Optimised conditions'],
    keywords: ['reaction kinetics', 'catalysis', 'physical organic chemistry', 'computational chemistry', 'green chemistry'],
    refJournals: ['Journal of the American Chemical Society', 'Chemical Science', 'The Journal of Physical Chemistry A', 'Angewandte Chemie International Edition'],
    params: [['Reagents', 'Analytical grade', 'Purified before use'], ['Temperature', '278–323 K', 'Thermostatted cell'], ['Monitoring', 'UV–visible and NMR', 'Time-resolved'], ['Theory', 'Density functional theory', 'Solvent modelled implicitly']],
  },
  [MAT]: {
    field: 'materials science and nanotechnology', problem: 'the need to link structure at the nanometre scale to conduction, strength and stability', gap: 'few studies that vary structure systematically in a single, well-controlled sample series',
    approach: 'synthesis of a graded sample series with structural and property characterisation', setup: 'samples were prepared with systematically varied composition or size, characterised by diffraction and electron microscopy and then measured for the property of interest',
    metric: 'property value', unit: 'GPa', groups: ['Pristine sample', 'Low dopant', 'Medium dopant', 'High dopant', 'Annealed sample'],
    keywords: ['nanomaterials', 'thin films', 'microstructure', 'grain boundaries', 'electron microscopy'],
    refJournals: ['Acta Materialia', 'Nano Letters', 'Advanced Materials', 'Journal of Applied Physics'],
    params: [['Samples', '5 compositions', 'Deposited in one chamber'], ['Structure', 'XRD and TEM', 'Grain size from 200 grains'], ['Property tests', 'Indentation and transport', 'Five repeats per sample'], ['Annealing', '400–600 °C', 'One hour in vacuum']],
  },
  [LIF]: {
    field: 'life sciences and biotechnology', problem: 'the need to connect molecular mechanisms to the behaviour of whole organisms', gap: 'few replicated studies that pair molecular assays with a sufficiently large number of independent samples',
    approach: 'molecular assays and sequencing on replicated biological samples', setup: 'biological replicates were grown under defined conditions, sampled at fixed time points and analysed by sequencing or assay, with independent replicates held back for confirmation',
    metric: 'relative expression', unit: 'fold', groups: ['Control', 'Mild treatment', 'Moderate treatment', 'Strong treatment', 'Recovery'],
    keywords: ['molecular biology', 'gene expression', 'protein structure', 'microbiology', 'biotechnology'],
    refJournals: ['Nature Communications', 'Nucleic Acids Research', 'Proceedings of the National Academy of Sciences', 'PLOS Biology'],
    params: [['Replicates', '4 biological replicates', 'Independent cultures'], ['Sequencing', 'Paired-end reads', 'Depth above 20 million'], ['Controls', 'Untreated and vehicle', 'Run on every plate'], ['Statistics', 'Mixed-effects models', 'FDR at 5%']],
  },
  [ERT]: {
    field: 'earth and environmental sciences', problem: 'the need for reliable records of how water, carbon and sediment move through landscapes', gap: 'sparse field measurements that can anchor models and regional records',
    approach: 'field sampling with laboratory geochemical analysis', setup: 'samples were collected along defined transects, dated or classified in the laboratory and compared with independent regional records',
    metric: 'recharge fraction', unit: '%', groups: ['Upland site', 'Midslope site', 'Lowland site', 'Floodplain site', 'Delta site'],
    keywords: ['hydrogeology', 'geochemistry', 'stable isotopes', 'paleoclimate', 'sediment transport'],
    refJournals: ['Earth and Planetary Science Letters', 'Water Resources Research', 'Geochimica et Cosmochimica Acta', 'Quaternary Science Reviews'],
    params: [['Sites', '12 sampling locations', 'Along three transects'], ['Samples', '210 samples', 'Collected over two seasons'], ['Analysis', 'ICP-MS and isotope ratio MS', 'Certified reference materials'], ['Dating', 'Radiocarbon', 'Calibrated ages']],
  },
  [MTH]: {
    field: 'mathematics and statistics', problem: 'the need to know when a method works, how fast it converges and when no method can do better', gap: 'results that hold only under assumptions too strong to check in practice',
    approach: 'rigorous analysis supported by numerical experiments', setup: 'the main statements were proved under clearly stated assumptions, and their sharpness was probed by numerical examples chosen to sit near the boundary of those assumptions',
    metric: 'observed convergence order', unit: '', groups: ['Smooth data', 'Mildly singular data', 'Singular data', 'Rough data', 'Worst case'],
    keywords: ['numerical analysis', 'probability', 'nonparametric statistics', 'fractional calculus', 'random matrices'],
    refJournals: ['SIAM Journal on Numerical Analysis', 'Annals of Statistics', 'Journal of Functional Analysis', 'Probability Theory and Related Fields'],
    params: [['Domain', 'Bounded interval', 'Homogeneous boundary values'], ['Test cases', '8 problems', 'Exact solutions known'], ['Mesh', 'Graded in time', 'Refined by factors of two'], ['Software', 'Open-source scientific libraries', 'Double precision']],
  },
  [CMP]: {
    field: 'computational science and data analysis', problem: 'the fact that large simulations and data analyses now sit alongside experiment, so their accuracy and reproducibility matter as much as speed', gap: 'few comparisons on shared benchmark problems with cost and error reported together',
    approach: 'implementation in open software with benchmark testing', setup: 'the method was implemented in open software, tested against analytical solutions and standard benchmarks, and its cost and error were measured as problem size increased',
    metric: 'relative error', unit: '%', groups: ['Reference scheme', 'Baseline surrogate', 'Tuned baseline', 'Proposed method', 'Proposed with refinement'],
    keywords: ['scientific computing', 'machine learning', 'numerical simulation', 'uncertainty quantification', 'reproducible research'],
    refJournals: ['Journal of Computational Physics', 'SIAM Journal on Scientific Computing', 'Computer Physics Communications', 'Nature Computational Science'],
    params: [['Benchmarks', '6 standard problems', 'With reference solutions'], ['Hardware', 'GPU workstation', 'Single node'], ['Repeats', '10 random seeds', 'Mean reported'], ['Code', 'Open repository', 'Archived with a DOI']],
  },
  [ENG]: {
    field: 'engineering fundamentals', problem: 'the need to predict how engineered components carry load, heat and flow from first principles', gap: 'limited validation of mechanics-based models against controlled laboratory data over a wide parameter range',
    approach: 'mechanics-based modelling validated by laboratory tests', setup: 'a model was derived from conservation laws and constitutive assumptions, solved numerically and compared with controlled laboratory measurements and with accepted correlations',
    metric: 'prediction error', unit: '%', groups: ['Simple correlation', 'Empirical fit', 'Reduced model', 'Full model', 'Full model with calibration'],
    keywords: ['fluid mechanics', 'heat transfer', 'solid mechanics', 'fatigue and fracture', 'thermodynamics'],
    refJournals: ['Journal of Fluid Mechanics', 'International Journal of Heat and Mass Transfer', 'Journal of the Mechanics and Physics of Solids', 'International Journal of Fatigue'],
    params: [['Test rig', 'Laboratory flow or load frame', 'Instrumented and calibrated'], ['Range', '5 parameter levels', 'Full factorial'], ['Model', 'Finite-volume or finite-element', 'Mesh independence checked'], ['Uncertainty', 'Propagated from instruments', '95% confidence']],
  },
  [DEV]: {
    field: 'technology, policy and development', problem: 'the need for evidence on how research becomes useful technology and who benefits from it', gap: 'little systematic data linking specific policy and funding choices to measured outcomes',
    approach: 'statistical analysis of institutional or household records with interviews', setup: 'records were assembled from institutions or households over several years, analysed with transparent regression methods and interpreted with the help of interviews',
    metric: 'outcome index', unit: 'index', groups: ['Lowest quartile', 'Second quartile', 'Third quartile', 'Highest quartile', 'Highest with support office'],
    keywords: ['science and technology policy', 'technology transfer', 'innovation systems', 'energy access', 'development economics'],
    refJournals: ['Research Policy', 'World Development', 'Technological Forecasting and Social Change', 'Energy Policy'],
    params: [['Units', '58 institutions', 'Six-year panel'], ['Sources', 'Annual reports and registries', 'Cross-checked'], ['Interviews', '18 respondents', 'Semi-structured'], ['Model', 'Fixed-effects regression', 'Clustered standard errors']],
  },
}

export const KEYWORDS: string[] = [...new Set(Object.values(P).flatMap((p) => p.keywords))]

const baseBuild = createBuildFull(P, INSTITUTIONS, () => allArticles)

interface Custom {
  keywords: string[]
  affiliations: string[]
  authorAff: number[][]
  sections?: ArticleSection[]
  references?: Reference[]
}

const TIFR = 'Tata Institute of Fundamental Research, Mumbai, India'
const IISC = 'Indian Institute of Science, Bengaluru, India'
const MPI = 'Max Planck Institute for Solid State Research, Stuttgart, Germany'
const KYOTO = 'Kyoto University, Kyoto, Japan'

const featuredSections: ArticleSection[] = [
  {
    id: 'introduction', title: 'Introduction',
    paragraphs: [
      'Yttrium iron garnet (YIG) has the lowest known magnetic damping of any material at room temperature, which is why it is the standard medium for studying spin waves and for proposals to use them as information carriers [1–3]. In single crystals the Gilbert damping parameter is of order 10⁻⁵, but thin films grown for devices are usually an order of magnitude worse, and the reasons are only partly understood [4,5].',
      'Two explanations compete. In the first, damping in thin films is raised by losses at the film surfaces and at the interface with the substrate, so it should decrease steadily as the film gets thicker. In the second, the extra damping comes from extrinsic mechanisms such as two-magnon scattering from roughness or from magnetic impurities in the substrate, and it should depend on how the film was grown and measured more than on thickness [6,7].',
      'Separating these explanations needs one series of films grown in a single campaign and measured over a wide range of frequency and temperature, so that growth variations do not masquerade as thickness effects. Here we report such a series. Our aims are to extract the intrinsic Gilbert damping and the inhomogeneous broadening for each thickness, to test directly for two-magnon scattering, and to find out whether a single surface-loss parameter can account for the thickness dependence.',
    ],
  },
  {
    id: 'methods', title: 'Methods',
    paragraphs: [
      'Epitaxial YIG films of nominal thickness 8, 12, 20, 35 and 60 nm were grown by pulsed laser deposition on (111)-oriented gadolinium gallium garnet substrates at 750 °C in an oxygen pressure of 0.2 mbar, then cooled slowly in oxygen [8]. Thicknesses were confirmed by X-ray reflectivity and crystalline quality by rocking-curve widths below 0.02°. Surface roughness measured by atomic force microscopy was below 0.2 nm in every film. All films were grown in one campaign from the same target.',
      'Ferromagnetic resonance was measured with a vector network analyser and a coplanar waveguide, sweeping the applied magnetic field at fixed microwave frequencies between 2 and 40 GHz. Spectra were fitted with the derivative of a Lorentzian to obtain the resonance field and the full width at half maximum. The linewidth was then fitted as a linear function of frequency, ΔH = ΔH₀ + (4πα/γ) f, where α is the Gilbert damping, γ the gyromagnetic ratio and ΔH₀ the inhomogeneous broadening [9,10].',
      'To test for two-magnon scattering the same measurement was repeated with the field rotated from the film plane to the film normal at 20 GHz; scattering of this type vanishes when the magnetisation is perpendicular to the film. Temperature was varied from 300 K down to 10 K in a closed-cycle cryostat. Table 1 summarises the main settings. Uncertainties are 95 percent intervals from bootstrap resampling of the fit.',
    ],
    table: { caption: 'Table 1. Film series and measurement settings.', head: ['Quantity', 'Setting', 'Notes'], rows: [
      ['Film thickness', '8, 12, 20, 35, 60 nm', 'Confirmed by X-ray reflectivity'],
      ['Substrate', '(111) gadolinium gallium garnet', 'Same batch for all films'],
      ['Frequency range', '2–40 GHz', 'Eighteen frequencies per film'],
      ['Temperature range', '10–300 K', 'Closed-cycle cryostat'],
      ['Field geometry', 'In-plane and out-of-plane', 'Out-of-plane tested at 20 GHz'],
    ] },
  },
  {
    id: 'results', title: 'Results',
    paragraphs: [
      'The resonance linewidth rose linearly with frequency in every film, and the intercept ΔH₀ stayed below 0.4 mT, which indicates uniform films with little inhomogeneous broadening. Table 2 and Figure 1 show the extracted Gilbert damping at room temperature. It decreases monotonically with thickness, from 4.8 × 10⁻⁴ in the 8 nm film to 1.7 × 10⁻⁴ in the 60 nm film.',
      'Rotating the field to the film normal reduced the linewidth by less than 5 percent in all films, so two-magnon scattering contributes little at room temperature. On cooling, the damping of all films fell until about 120 K and then rose to a peak near 40 K before decreasing again. The peak had the same height in every film regardless of thickness, which is the signature of a loss mechanism in the substrate rather than in the film, consistent with slowly relaxing rare-earth impurities in the garnet.',
      'A surface-loss model in which the damping is α(d) = α_bulk + β/d, with α_bulk fixed at the single-crystal value, reproduces the thickness dependence with one fitted parameter β = 3.1 × 10⁻³ nm. Residuals were within the experimental uncertainty for all five thicknesses. Using the measured damping and the calculated group velocity of the lowest backward-volume mode, spin-wave propagation lengths exceed 20 µm for films thicker than 20 nm.',
    ],
    table: { caption: 'Table 2. Room-temperature Gilbert damping and inhomogeneous broadening for each film.', head: ['Thickness (nm)', 'α (10⁻⁴)', '95% interval (10⁻⁴)', 'ΔH₀ (mT)', 'Propagation length (µm)'], rows: [
      ['8', '4.8', '4.5–5.1', '0.38', '8'],
      ['12', '3.1', '2.9–3.3', '0.31', '14'],
      ['20', '2.4', '2.3–2.5', '0.27', '21'],
      ['35', '1.9', '1.8–2.0', '0.22', '31'],
      ['60', '1.7', '1.6–1.8', '0.19', '39'],
    ] },
    figure: {
      caption: 'Figure 1. Room-temperature Gilbert damping α (10⁻⁴) of YIG films as a function of thickness. Bars show fitted values.',
      xLabel: 'Film thickness', yLabel: 'Gilbert damping α (10⁻⁴)', labels: ['8 nm', '12 nm', '20 nm', '35 nm', '60 nm'], values: [4.8, 3.1, 2.4, 1.9, 1.7],
    },
  },
  {
    id: 'discussion', title: 'Discussion',
    paragraphs: [
      'Our results favour the first explanation at room temperature: damping rises as the film becomes thinner, two-magnon scattering is small, and a single surface parameter describes the trend. The value of β implies a surface contribution equal to the bulk damping at a thickness of about 17 nm for α_bulk of this size, which matches where the curve in Figure 1 begins to flatten. The low-temperature peak, by contrast, is a property of the substrate and should be separated from film properties in any study that extends below 100 K [4,11].',
      'Several limitations should be noted. All films share one substrate and growth method, so we cannot say whether the surface parameter would change with a different substrate or with post-growth annealing. The propagation lengths are calculated, not measured, and real devices will add scattering at patterned edges. Finally, the bulk value used in the model is taken from the literature and not from our own crystals.',
      'The practical message is that films of 20 nm and above can already deliver damping close to what spin-wave devices need, and that further gains will come from the surface and the substrate rather than from the interior of the film. Experiments with surface passivation layers and with non-magnetic garnet substrates of higher purity are the obvious next steps [12].',
    ],
  },
  {
    id: 'conclusion', title: 'Conclusion',
    paragraphs: [
      'Broadband ferromagnetic resonance on a single series of epitaxial YIG films shows that room-temperature Gilbert damping falls from 4.8 × 10⁻⁴ to 1.7 × 10⁻⁴ as thickness increases from 8 to 60 nm, that two-magnon scattering is negligible, and that a one-parameter surface-loss model fits the data. A low-temperature damping peak common to all films points to the substrate. The raw spectra, fitting scripts and growth logs are available from the corresponding author on reasonable request and have been deposited in an open repository.',
    ],
  },
]

const featuredRefs: Reference[] = [
  { text: 'Cherepanov, V., Kolokolov, I., & L’vov, V. (1993). The saga of YIG: spectra, thermodynamics, interaction and relaxation of magnons in a complex magnet. Physics Reports, 229(3), 81–144.', doi: '10.1016/0370-1573(93)90107-O' },
  { text: 'Serga, A. A., Chumak, A. V., & Hillebrands, B. (2010). YIG magnonics. Journal of Physics D: Applied Physics, 43(26), 264002.', doi: '10.1088/0022-3727/43/26/264002' },
  { text: 'Chumak, A. V., Vasyuchka, V. I., Serga, A. A., & Hillebrands, B. (2015). Magnon spintronics. Nature Physics, 11(6), 453–461.', doi: '10.1038/nphys3347' },
  { text: 'Onbasli, M. C., Kehlberger, A., Kim, D. H., Jakob, G., Kläui, M., Chumak, A. V., Hillebrands, B., & Ross, C. A. (2014). Pulsed laser deposition of epitaxial yttrium iron garnet films with low Gilbert damping and bulk-like magnetization. APL Materials, 2(10), 106102.', doi: '10.1063/1.4896756' },
  { text: 'Heinrich, B., Burrowes, C., Montoya, E., Kardasz, B., Girt, E., Song, Y.-Y., Sun, Y., & Wu, M. (2011). Spin pumping at the magnetic insulator (YIG)/normal metal (Au) interfaces. Physical Review Letters, 107(6), 066604.', doi: '10.1103/PhysRevLett.107.066604' },
  { text: 'Tserkovnyak, Y., Brataas, A., Bauer, G. E. W., & Halperin, B. I. (2005). Nonlocal magnetization dynamics in ferromagnetic heterostructures. Reviews of Modern Physics, 77(4), 1375–1421.', doi: '10.1103/RevModPhys.77.1375' },
  { text: 'Kalarickal, S. S., Krivosik, P., Wu, M., Patton, C. E., Schneider, M. L., Kabos, P., Silva, T. J., & Nibarger, J. P. (2006). Ferromagnetic resonance linewidth in metallic thin films: comparison of measurement methods. Journal of Applied Physics, 99(9), 093909.', doi: '10.1063/1.2197087' },
  { text: 'Kittel, C. (1948). On the theory of ferromagnetic resonance absorption. Physical Review, 73(2), 155–161.', doi: '10.1103/PhysRev.73.155' },
  { text: 'Gilbert, T. L. (2004). A phenomenological theory of damping in ferromagnetic materials. IEEE Transactions on Magnetics, 40(6), 3443–3449.', doi: '10.1109/TMAG.2004.836740' },
  { text: 'Stancil, D. D., & Prabhakar, A. (2009). Spin Waves: Theory and Applications. Springer, New York.', doi: '10.1007/978-0-387-77865-5' },
  { text: 'Barman, A., Gubbiotti, G., Ladak, S., et al. (2021). The 2021 magnonics roadmap. Journal of Physics: Condensed Matter, 33(41), 413001.', doi: '10.1088/1361-648X/abec1a' },
  { text: 'Gurevich, A. G., & Melkov, G. A. (1996). Magnetization Oscillations and Waves. CRC Press, Boca Raton.' },
]

const editorialSections: ArticleSection[] = [
  {
    id: 'foundations', title: 'Why foundations matter',
    paragraphs: [
      'A discovery rarely arrives as a product. The measurement that shows a material loses less energy than expected, the reaction mechanism that explains why a catalyst fails, the theorem that says an algorithm cannot converge faster than a stated rate: each of these is a foundation, and each needs a second, slower body of work before anyone outside the laboratory can build on it. That second body of work, on materials, methods, software and institutions, is what the word “development” in our title is meant to cover.',
      'The International Journal of Fundamental Research and Development was founded on the view that the two kinds of work should be read together and judged by the same standards: are the methods described well enough to be repeated, do the data support the claims, and are the limits stated plainly? Everything we publish is open access and carries a permanent DOI, so that a result and the work that follows from it stay within reach of the next reader.',
    ],
  },
  {
    id: 'this-issue', title: 'In this issue',
    paragraphs: [
      'Bhandari and colleagues open the issue with a careful study of damping in ultrathin yttrium iron garnet films, separating losses at the surface from losses in the substrate and releasing their raw spectra so that others can test the analysis. Marchand and co-authors review a decade of mechanochemical synthesis and ask a question the field has been slow to answer: how much energy actually reaches the reacting solid? Tetteh and colleagues show how a little tantalum keeps copper films nanocrystalline at 600 °C.',
      'In the life sciences, Ranganathan and van der Meer describe a plate-reader assay that tells membrane-active peptides from those that act in other ways. Phadke and co-authors read three delta cores for evidence of how the Godavari catchment responded to a weakening monsoon. Zielinski and colleagues prove sharp convergence rates for a fractional diffusion scheme, and Yamamoto and co-authors show how to train neural surrogates for stiff reaction systems so that their errors can be bounded.',
      'The last research papers look at engineering and policy. Obiora and colleagues use second-law analysis to place porous inserts in microchannel heat sinks, and Venkatesan and co-authors examine which public-university funding structures are associated with licensed technology. Together the nine papers span all nine areas of the journal, which is the range we hoped for.',
    ],
  },
  {
    id: 'ahead', title: 'Looking ahead',
    paragraphs: [
      'The journal is young, and we want it to earn trust through what it does and not through what it claims. We ask authors to report negative and null results, to deposit data and code where they can, and to say clearly when a conclusion depends on an assumption. We ask reviewers to read the methods as closely as the abstract. Submissions for Volume 1, Issue 10 are open, and we would be glad to hear from researchers who work where one discipline ends and the next begins.',
    ],
  },
]

const CUSTOM: Record<string, Custom> = {
  IJFRD2026000110: { keywords: ['fundamental research', 'research development', 'open access', 'peer review', 'technology transfer'], affiliations: [IISC], authorAff: [[1]], sections: editorialSections, references: [] },
  IJFRD2026000112: {
    keywords: ['yttrium iron garnet', 'Gilbert damping', 'ferromagnetic resonance', 'spin waves', 'magnonics'],
    affiliations: [TIFR, MPI, KYOTO], authorAff: [[1], [2], [3], [1, 3]],
    sections: featuredSections, references: featuredRefs,
  },
  IJFRD2026000113: { keywords: ['mechanochemistry', 'ball milling', 'solvent-free synthesis', 'in situ monitoring', 'scale-up'], affiliations: ['University of Bologna, Bologna, Italy', 'Indian Institute of Science Education and Research, Pune, India'], authorAff: [[1], [2], [1, 2]] },
  IJFRD2026000114: { keywords: ['nanocrystalline metals', 'grain-boundary segregation', 'thin films', 'atom probe tomography', 'nanoindentation'], affiliations: ['University of Cape Town, Cape Town, South Africa', 'Nanyang Technological University, Singapore'], authorAff: [[1], [1], [2]] },
  IJFRD2026000115: { keywords: ['antimicrobial peptides', 'membrane potential', 'fluorescent reporter', 'high-throughput screening'], affiliations: ['Indian Institute of Science, Bengaluru, India', 'Wageningen University & Research, Wageningen, Netherlands'], authorAff: [[1], [2]] },
  IJFRD2026000116: { keywords: ['Godavari delta', 'sediment provenance', 'neodymium isotopes', 'chemical weathering', 'Holocene monsoon'], affiliations: ['Indian Institute of Technology Kharagpur, Kharagpur, India', 'University of Bologna, Bologna, Italy', 'University of Oslo, Oslo, Norway'], authorAff: [[1], [2], [3]] },
  IJFRD2026000117: { keywords: ['fractional diffusion', 'spectral collocation', 'Caputo derivative', 'graded meshes', 'error analysis'], affiliations: ['ETH Zurich, Zurich, Switzerland', 'Uppsala University, Uppsala, Sweden'], authorAff: [[1], [2], [1]] },
  IJFRD2026000118: { keywords: ['physics-informed neural networks', 'stiff systems', 'reaction–diffusion', 'surrogate modelling', 'error bounds'], affiliations: [KYOTO, 'ETH Zurich, Zurich, Switzerland'], authorAff: [[1], [2], [1, 2]] },
  IJFRD2026000119: { keywords: ['entropy generation', 'microchannel heat sink', 'porous media', 'conjugate heat transfer', 'second-law analysis'], affiliations: ['University of Ibadan, Ibadan, Nigeria', 'University of Melbourne, Melbourne, Australia'], authorAff: [[1], [2], [2]] },
  IJFRD2026000120: { keywords: ['technology transfer', 'research funding', 'public universities', 'patents and licensing', 'innovation policy'], affiliations: ['Indian Institute of Science, Bengaluru, India', 'University of Cape Town, Cape Town, South Africa'], authorAff: [[1], [2], [1]] },
}

export function buildFull(a: Parameters<typeof baseBuild>[0]): ArticleFull {
  const full = baseBuild(a)
  const c = CUSTOM[a.paperId]
  if (!c) return full
  return {
    ...full,
    keywords: c.keywords,
    affiliations: c.affiliations,
    authorDetails: full.authorDetails.map((d, i) => ({ ...d, affiliations: c.authorAff[i] ?? [1] })),
    sections: c.sections ?? full.sections,
    references: c.references ?? full.references,
  }
}
