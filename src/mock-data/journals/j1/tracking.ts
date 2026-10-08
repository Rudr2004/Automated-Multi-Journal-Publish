// Journal 1 demo papers; stage logic is shared (mock-data/shared/createTracking).
import { journal } from '../../../config/journals/j1'
import { createTracking, DEMO_EMAIL } from '../../shared/createTracking'

/** Demo papers covering every stage and payment state. Email must match to view. */
export const { trackedPapers, findPaper, newSubmission } = createTracking(journal, (make) => [
  make({ id: 'IJMAT2026000201', email: 'priya.nair@example.com', title: 'Adaptive Control of Hybrid Microgrids Using Reinforcement Learning', stage: 1, authors: ['Priya Nair', 'Karthik Raman'], start: '2026-09-28', referral: { code: 'PRIYA-IJMAT', credits: 0, referred: 0 } }),
  make({ id: 'IJMAT2026000202', email: 'arjun.kapoor@example.com', title: 'Low-Cost Electrochemical Sensors for Heavy Metal Detection in Drinking Water', stage: 4, authors: ['Arjun Kapoor', 'Sneha Kulkarni', 'Daniel Okafor'], start: '2026-08-30', referral: { code: 'ARJUN-IJMAT', credits: 500, referred: 1 } }),
  make({ id: 'IJMAT2026000203', email: 'meera.joshi@example.com', title: 'Teleconsultation Uptake among Older Adults in Tier-3 Towns', stage: 7, authors: ['Meera Joshi', 'Sunita Verma'], start: '2026-07-01', referral: { code: 'MEERA-IJMAT', credits: 1500, referred: 3 } }),
  // One demo paper per remaining stage (email: demo@example.com).
  make({ id: 'IJMAT2026000204', email: DEMO_EMAIL, title: 'Satellite-Derived Estimates of Wetland Methane Fluxes', stage: 0, authors: ['Hannah Clarke'], start: '2026-10-05' }),
  make({ id: 'IJMAT2026000205', email: DEMO_EMAIL, title: 'Machine Learning for Early Detection of Soil Salinity', stage: 2, authors: ['Vikram Desai', 'Mei Lin Tan'], start: '2026-09-10' }),
  make({ id: 'IJMAT2026000206', email: DEMO_EMAIL, title: 'Biodegradable Packaging from Banana Pseudostem Fibre', stage: 3, authors: ['Ritu Sharma', 'James Whitfield'], start: '2026-08-25' }),
  make({ id: 'IJMAT2026000209', email: DEMO_EMAIL, title: 'Grid-Interactive Water Heaters for Peak Shaving', stage: 4, authors: ['Fatima Al-Mansoori', 'Sofia Lindqvist'], start: '2026-08-20', payment: 'verifying' }),
  make({ id: 'IJMAT2026000207', email: DEMO_EMAIL, title: 'Peak-Load Forecasting for Distribution Utilities Using Transformers', stage: 5, authors: ['Karthik Raman', 'Marcus Hoffmann'], start: '2026-08-10' }),
  make({ id: 'IJMAT2026000208', email: DEMO_EMAIL, title: 'Community Screening for Anaemia in Adolescent Girls', stage: 6, authors: ['Chinwe Eze', 'Amara Nwosu', 'Meera Joshi'], start: '2026-08-01' }),
])
