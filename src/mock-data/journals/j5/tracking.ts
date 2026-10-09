// IJFRD demo papers; stage logic is shared (mock-data/shared/createTracking).
import { journal } from '../../../config/journals/j5'
import { createTracking, DEMO_EMAIL } from '../../shared/createTracking'

/** Demo papers covering every stage and payment state. Email must match to view. */
export const { trackedPapers, findPaper, newSubmission } = createTracking(journal, (make) => [
  make({ id: 'IJFRD2026000201', email: 'daichi.yamamoto@example.com', title: 'Temperature Dependence of Ferromagnetic Resonance Linewidth in Ultrathin Permalloy Films', stage: 1, authors: ['Daichi Yamamoto', 'Tanuja Phadke'], start: '2026-09-28', referral: { code: 'DAICHI-IJFRD', credits: 0, referred: 0 } }),
  make({ id: 'IJFRD2026000202', email: 'julien.moreau@example.com', title: 'Enantioselective Organocatalytic Michael Addition in Water: Catalyst Loading and Reaction Kinetics', stage: 4, authors: ['Julien Moreau', 'Farah Siddiqi', 'Gaurav Mittal'], start: '2026-08-30', referral: { code: 'JULIEN-IJFRD', credits: 1, referred: 2 } }),
  make({ id: 'IJFRD2026000203', email: 'chinedu.obiora@example.com', title: 'Pedogenic Carbonate Formation and Soil Carbon Turnover in Semi-Arid Alluvial Plains', stage: 7, authors: ['Chinedu Obiora', 'Emmanuel Tetteh'], start: '2026-07-01', referral: { code: 'CHINEDU-IJFRD', credits: 2, referred: 3 } }),
  // One demo paper per remaining stage (email: demo@example.com).
  make({ id: 'IJFRD2026000204', email: DEMO_EMAIL, title: 'Percolation Thresholds in Conductive Polymer Nanocomposites with Anisotropic Fillers', stage: 0, authors: ['Marisol Vega'], start: '2026-10-05' }),
  make({ id: 'IJFRD2026000205', email: DEMO_EMAIL, title: 'Bayesian Inference of Transmission Parameters in Stochastic Epidemic Models with Sparse Data', stage: 2, authors: ['Ingeborg Dahl', 'Aaron Feldman'], start: '2026-09-10' }),
  make({ id: 'IJFRD2026000206', email: DEMO_EMAIL, title: 'Adaptive Mesh Refinement for Phase-Field Models of Dendritic Solidification', stage: 3, authors: ['Vishal Hegde', 'Elodie Marchand'], start: '2026-08-25' }),
  make({ id: 'IJFRD2026000209', email: DEMO_EMAIL, title: 'Adsorption of Heavy Metals on Biochar-Supported Layered Double Hydroxides', stage: 4, authors: ['Sandeep Raghuvanshi', 'Joanna Wierzbicka'], start: '2026-08-20', payment: 'verifying' }),
  make({ id: 'IJFRD2026000207', email: DEMO_EMAIL, title: 'Nanoindentation Size Effects in Single-Crystal Magnesium Oxide', stage: 5, authors: ['Rafael Bianchi', 'Hamza Idrissi'], start: '2026-08-10' }),
  make({ id: 'IJFRD2026000208', email: DEMO_EMAIL, title: 'Mobile Health Platforms and Maternal Care Access in Rural Districts: A Quasi-Experimental Study', stage: 6, authors: ['Siddharth Venkatesan', 'Nadiya Kovalenko', 'Dhruv Khurana'], start: '2026-08-01' }),
])
