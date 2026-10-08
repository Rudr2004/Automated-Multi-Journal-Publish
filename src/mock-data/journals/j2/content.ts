// Journal 2 subject profiles; the article builder itself is shared (mock-data/shared/buildFull).
import { createBuildFull, type Profile } from '../../shared/buildFull'
import { INSTITUTIONS, SUBJECTS, allArticles } from './articles'

const [ENG, COMP, LIFE, ENV, PHYS, SOC, BUS, AGR] = SUBJECTS

const P: Record<string, Profile> = {
  [ENG]: {
    field: 'civil and mechanical engineering', problem: 'the need for safer, cheaper and longer-lasting infrastructure', gap: 'few field validations of low-cost monitoring methods',
    approach: 'an instrumented prototype tested in the laboratory and on a live structure', setup: 'sensors were mounted at fixed locations and data were logged at 200 Hz for six weeks',
    metric: 'detection accuracy', unit: '%', groups: ['Reference', 'Sensor set A', 'Sensor set B', 'Combined', 'Optimised'],
    keywords: ['structural health monitoring', 'low-cost sensors', 'infrastructure', 'signal processing', 'reliability'],
    refJournals: ['Engineering Structures', 'Mechanical Systems and Signal Processing', 'Automation in Construction', 'Construction and Building Materials'],
    params: [['Sampling rate', '200 Hz', 'Continuous logging'], ['Sensors', '12 MEMS units', 'Calibrated before use'], ['Duration', '6 weeks', 'Including a load test'], ['Reference', 'Reference accelerometers', 'Laboratory grade']],
  },
  [COMP]: {
    field: 'applied machine learning', problem: 'the demand for accurate yet efficient and trustworthy models', gap: 'a lack of fair comparisons on constrained hardware',
    approach: 'a compact architecture evaluated under a unified protocol', setup: 'all models were trained with three random seeds and evaluated on held-out data and an on-device test',
    metric: 'F1 score', unit: '%', groups: ['Baseline', 'Variant A', 'Variant B', 'Variant C', 'Proposed'],
    keywords: ['machine learning', 'on-device inference', 'benchmarking', 'language models', 'reproducibility'],
    refJournals: ['IEEE Transactions on Neural Networks and Learning Systems', 'Pattern Recognition', 'ACM Computing Surveys', 'Journal of Machine Learning Research'],
    params: [['Optimiser', 'AdamW', 'Cosine schedule'], ['Batch size', '64', 'Mixed precision'], ['Seeds', '3', 'Mean ± SD reported'], ['Hardware', '1 × GPU, 1 × phone', 'On-device latency measured']],
  },
  [LIFE]: {
    field: 'translational life sciences', problem: 'the need for affordable diagnostics and nutrition-based prevention', gap: 'limited evidence from community settings outside hospitals',
    approach: 'a community-based study with standardised laboratory assays', setup: 'participants gave informed consent and were assessed at baseline and after eight weeks',
    metric: 'assay sensitivity', unit: '%', groups: ['Control', 'Group 1', 'Group 2', 'Group 3', 'Combined'],
    keywords: ['translational research', 'diagnostics', 'nutrition', 'community health', 'validation'],
    refJournals: ['Nature Communications', 'The Lancet Digital Health', 'Biosensors and Bioelectronics', 'BMC Medicine'],
    params: [['Design', 'Prospective cohort', 'Eight-week follow-up'], ['Sample size', 'n = 240', '80% power'], ['Assay', 'Validated panel', 'Run in duplicate'], ['Ethics', 'Approved by IRB', 'Consent obtained']],
  },
  [ENV]: {
    field: 'environmental science', problem: 'rising pressure on water, air and coastal resources', gap: 'sparse neighbourhood-scale data for planning',
    approach: 'field sampling combined with geospatial modelling', setup: 'samples were collected across wet and dry seasons at 24 sites and analysed within 48 hours',
    metric: 'indicator concentration', unit: 'mg/L', groups: ['Site A', 'Site B', 'Site C', 'Site D', 'Site E'],
    keywords: ['environmental monitoring', 'geospatial analysis', 'water resources', 'climate adaptation', 'sustainability'],
    refJournals: ['Environmental Science & Technology', 'Science of the Total Environment', 'Remote Sensing of Environment', 'Water Research'],
    params: [['Sampling period', '12 months', 'Wet and dry seasons'], ['Sites', '24', 'Stratified by land use'], ['Analysis', 'ICP-MS and IC', 'Certified standards'], ['Imagery', '10 m multispectral', 'Cloud-masked composites']],
  },
  [PHYS]: {
    field: 'materials and physical sciences', problem: 'the demand for durable, low-carbon materials', gap: 'limited long-term data under realistic service conditions',
    approach: 'a controlled synthesis and characterisation workflow', setup: 'specimens were prepared in batches of five and cured at 23 °C and 50% relative humidity',
    metric: 'compressive strength', unit: 'MPa', groups: ['Control', '2 wt%', '5 wt%', '8 wt%', '10 wt%'],
    keywords: ['advanced materials', 'mechanical properties', 'characterisation', 'embodied carbon', 'durability'],
    refJournals: ['Journal of Materials Chemistry A', 'Cement and Concrete Composites', 'Acta Materialia', 'Materials & Design'],
    params: [['Specimen size', '50 mm cubes', 'Cast in triplicate'], ['Curing', '28 days', '23 °C, 50% RH'], ['Replicates', 'n = 5', 'Per mix'], ['Imaging', 'SEM at 10 kV', 'Fracture surfaces']],
  },
  [SOC]: {
    field: 'education and social research', problem: 'persistent gaps in access, skills and learning outcomes', gap: 'few multi-site studies in rural and low-resource settings',
    approach: 'a mixed-methods design combining surveys, records and interviews', setup: 'schools were sampled across three states and respondents gave informed consent',
    metric: 'outcome score', unit: 'points', groups: ['Comparison', 'Group 1', 'Group 2', 'Group 3', 'Combined'],
    keywords: ['education', 'digital skills', 'mixed methods', 'equity', 'rural development'],
    refJournals: ['Computers & Education', 'Educational Researcher', 'World Development', 'Social Science & Medicine'],
    params: [['Design', 'Stratified sample', 'By district'], ['Sample size', 'n = 1,860', 'Across 96 schools'], ['Instrument', 'Validated scale', 'Pilot-tested'], ['Ethics', 'Approved by IRB', 'Consent obtained']],
  },
  [BUS]: {
    field: 'business and economics', problem: 'the constraints faced by small firms and new ventures', gap: 'scarce panel evidence from emerging markets',
    approach: 'a firm-level panel analysis supported by interviews', setup: 'data covered 1,420 firms over four years and models controlled for sector and size',
    metric: 'efficiency index', unit: 'index', groups: ['Non-adopters', 'Early', 'Mid', 'Late', 'Full adopters'],
    keywords: ['small enterprises', 'digital payments', 'panel data', 'working capital', 'emerging markets'],
    refJournals: ['Journal of Business Venturing', 'World Development', 'Journal of Banking & Finance', 'Small Business Economics'],
    params: [['Panel', '4 years', 'Annual observations'], ['Firms', '1,420', 'Micro and small'], ['Estimator', 'Fixed effects', 'Clustered errors'], ['Controls', 'Sector, size, age', 'Region effects']],
  },
  [AGR]: {
    field: 'agriculture and food systems', problem: 'the need for resilient, affordable farming technologies', gap: 'few multi-season trials on smallholder farms',
    approach: 'multi-season field trials managed together with farmers', setup: 'plots were laid out in randomised blocks at four sites and monitored through two seasons',
    metric: 'grain yield', unit: 't/ha', groups: ['Control', 'Treatment 1', 'Treatment 2', 'Treatment 3', 'Integrated'],
    keywords: ['smallholder agriculture', 'precision farming', 'food systems', 'soil health', 'field trials'],
    refJournals: ['Field Crops Research', 'Agricultural Systems', 'Agronomy for Sustainable Development', 'Food Policy'],
    params: [['Design', 'Randomised blocks', '4 replicates'], ['Sites', '4', 'Contrasting soils'], ['Seasons', '2', 'Kharif and rabi'], ['Sensing', 'Multispectral drone', '5 cm resolution']],
  },
}

export const KEYWORDS: string[] = [...new Set(Object.values(P).flatMap((p) => p.keywords))]

export const buildFull = createBuildFull(P, INSTITUTIONS, () => allArticles)
