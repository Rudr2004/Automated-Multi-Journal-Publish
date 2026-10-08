// Journal 1 subject profiles; the article builder itself is shared (mock-data/shared/buildFull).
import { createBuildFull, type Profile } from '../../shared/buildFull'
import { INSTITUTIONS, allArticles } from './articles'

const P: Record<string, Profile> = {
  'Materials Science': {
    field: 'advanced materials', problem: 'the demand for lighter, stronger and more durable materials', gap: 'limited long-term data under realistic service conditions',
    approach: 'a controlled synthesis and characterisation workflow', setup: 'specimens were prepared in batches of five and conditioned at 23 °C and 50% relative humidity',
    metric: 'tensile strength', unit: 'MPa', groups: ['Control', '0.5 wt%', '1.0 wt%', '2.0 wt%', '3.0 wt%'],
    keywords: ['composite materials', 'mechanical properties', 'characterisation', 'sustainability', 'thermal stability'],
    refJournals: ['Journal of Materials Chemistry A', 'Composites Science and Technology', 'Acta Materialia', 'Materials & Design'],
    params: [['Specimen geometry', 'ASTM D638 Type V', 'Dog-bone coupons'], ['Test speed', '5 mm/min', 'Room temperature'], ['Replicates', 'n = 5', 'Per condition'], ['Imaging', 'SEM at 10 kV', 'Fracture surfaces']],
  },
  'Environmental Science': {
    field: 'environmental monitoring', problem: 'accelerating pressure on air, water and soil resources', gap: 'sparse ground-truth data at regional scale',
    approach: 'a multi-site sampling campaign combined with remote sensing', setup: 'samples were collected seasonally over 24 months at 18 sites and analysed within 48 hours',
    metric: 'indicator concentration', unit: 'mg/L', groups: ['Site A', 'Site B', 'Site C', 'Site D', 'Site E'],
    keywords: ['environmental monitoring', 'remote sensing', 'water quality', 'climate adaptation', 'spatial analysis'],
    refJournals: ['Environmental Science & Technology', 'Science of the Total Environment', 'Remote Sensing of Environment', 'Water Research'],
    params: [['Sampling period', '24 months', 'Seasonal campaigns'], ['Sites', '18', 'Stratified by land use'], ['Analysis', 'ICP-MS and IC', 'Certified standards'], ['Imagery', '10 m multispectral', 'Cloud-masked composites']],
  },
  'Computer Science': {
    field: 'machine learning systems', problem: 'the need for accurate yet efficient and trustworthy models', gap: 'a lack of fair comparisons on constrained hardware',
    approach: 'a lightweight architecture evaluated under a unified protocol', setup: 'all models were trained with three random seeds on a single GPU and evaluated on held-out data',
    metric: 'F1 score', unit: '%', groups: ['Baseline', 'Variant A', 'Variant B', 'Variant C', 'Proposed'],
    keywords: ['machine learning', 'efficiency', 'benchmarking', 'edge computing', 'reproducibility'],
    refJournals: ['IEEE Transactions on Neural Networks and Learning Systems', 'Pattern Recognition', 'ACM Computing Surveys', 'Journal of Machine Learning Research'],
    params: [['Optimiser', 'AdamW', 'Cosine schedule'], ['Batch size', '64', 'Mixed precision'], ['Seeds', '3', 'Mean ± SD reported'], ['Hardware', '1 × 16 GB GPU', 'Plus edge device test']],
  },
  Biotechnology: {
    field: 'applied biotechnology', problem: 'the need for affordable, scalable biological solutions', gap: 'limited validation outside laboratory conditions',
    approach: 'an engineered biological system validated against standard assays', setup: 'cultures were grown in triplicate at 30 °C and assays were run in blinded order',
    metric: 'assay sensitivity', unit: '%', groups: ['Reference', 'Protocol 1', 'Protocol 2', 'Protocol 3', 'Optimised'],
    keywords: ['biotechnology', 'assay development', 'synthetic biology', 'low-cost diagnostics', 'validation'],
    refJournals: ['Nature Biotechnology', 'Biotechnology Advances', 'Biosensors and Bioelectronics', 'Metabolic Engineering'],
    params: [['Culture temperature', '30 °C', '200 rpm'], ['Replicates', 'n = 3', 'Independent runs'], ['Detection', 'Fluorescence', 'Plate reader'], ['Controls', 'Positive and negative', 'Each plate']],
  },
  'Energy Systems': {
    field: 'sustainable energy systems', problem: 'the transition to affordable and reliable low-carbon energy', gap: 'few studies reflect local tariffs, climate and usage patterns',
    approach: 'a calibrated simulation model with scenario analysis', setup: 'hourly data for a full year were used and the model was calibrated against measured load profiles',
    metric: 'levelised cost', unit: '₹/kWh', groups: ['Grid only', 'Solar', 'Solar + storage', 'Hybrid', 'Optimised'],
    keywords: ['renewable energy', 'techno-economics', 'energy storage', 'simulation', 'decarbonisation'],
    refJournals: ['Applied Energy', 'Energy', 'Renewable and Sustainable Energy Reviews', 'Journal of Power Sources'],
    params: [['Time resolution', 'Hourly', '8,760 steps'], ['Discount rate', '8%', 'Sensitivity ±2%'], ['Project life', '25 years', 'Degradation included'], ['Data source', 'Metered + reanalysis', 'Quality-checked']],
  },
  'Public Health': {
    field: 'public health research', problem: 'persistent inequities in access to preventive and primary care', gap: 'few community-level evaluations in low-resource settings',
    approach: 'a mixed-methods design combining surveys, records and interviews', setup: 'participants were recruited through stratified sampling and gave written informed consent',
    metric: 'uptake rate', unit: '%', groups: ['Control', 'Arm 1', 'Arm 2', 'Arm 3', 'Combined'],
    keywords: ['public health', 'community interventions', 'health equity', 'mixed methods', 'primary care'],
    refJournals: ['The Lancet Global Health', 'BMJ Global Health', 'Social Science & Medicine', 'Bulletin of the World Health Organization'],
    params: [['Design', 'Cluster sample', 'Stratified by block'], ['Sample size', 'n = 1,240', '80% power'], ['Instrument', 'Validated questionnaire', 'Pilot-tested'], ['Ethics', 'Approved by IRB', 'Consent obtained']],
  },
}

export const KEYWORDS: string[] = [...new Set(Object.values(P).flatMap((p) => p.keywords))]

export const buildFull = createBuildFull(P, INSTITUTIONS, () => allArticles)
