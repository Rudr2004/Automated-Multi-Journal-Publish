// Journal 2 demo papers; stage logic is shared (mock-data/shared/createTracking).
import { journal } from '../../../config/journals/j2'
import { createTracking, DEMO_EMAIL } from '../../shared/createTracking'

/** Demo papers covering every stage and payment state. Email must match to view. */
export const { trackedPapers, findPaper, newSubmission } = createTracking(journal, (make) => [
  make({ id: 'JIMRT2026000201', email: 'kavya.reddy@example.com', title: 'Sensor Fusion for Early Detection of Fatigue Cracks in Steel Bridges', stage: 1, authors: ['Kavya Reddy', 'Rajesh Pillai'], start: '2026-09-28', referral: { code: 'KAVYA-JIMRT', credits: 0, referred: 0 } }),
  make({ id: 'JIMRT2026000202', email: 'pranav.joshi@example.com', title: 'Low-Cost Turbidity Sensing for Rural Water Supply Schemes', stage: 4, authors: ['Pranav Joshi', 'Radhika Pillai', 'Joseph Okonkwo'], start: '2026-08-30', referral: { code: 'PRANAV-JIMRT', credits: 1, referred: 2 } }),
  make({ id: 'JIMRT2026000203', email: 'grace.mwangi@example.com', title: 'Mobile Learning Circles and Foundational Numeracy in Primary Grades', stage: 7, authors: ['Grace Mwangi', 'Divya Menon'], start: '2026-07-01', referral: { code: 'GRACE-JIMRT', credits: 2, referred: 3 } }),
  // One demo paper per remaining stage (email: demo@example.com).
  make({ id: 'JIMRT2026000204', email: DEMO_EMAIL, title: 'Urban Heat Mitigation through Cool Roof Coatings in Dense Neighbourhoods', stage: 0, authors: ['Helena Novak'], start: '2026-10-05' }),
  make({ id: 'JIMRT2026000205', email: DEMO_EMAIL, title: 'Federated Anomaly Detection in Hospital Equipment Logs', stage: 2, authors: ['Neil Thompson', 'Tanvi Kapoor'], start: '2026-09-10' }),
  make({ id: 'JIMRT2026000206', email: DEMO_EMAIL, title: 'Seaweed-Based Biodegradable Films for Fresh Produce Packaging', stage: 3, authors: ['Yuki Tanaka', 'Diego Alvarez'], start: '2026-08-25' }),
  make({ id: 'JIMRT2026000209', email: DEMO_EMAIL, title: 'Solar Dryers and Post-Harvest Losses in Spice Cooperatives', stage: 4, authors: ['Shreya Agarwal', 'Ravi Teja'], start: '2026-08-20', payment: 'verifying' }),
  make({ id: 'JIMRT2026000207', email: DEMO_EMAIL, title: 'Language-Model Feedback on Student Lab Reports: A Controlled Trial', stage: 5, authors: ['Mateo Fernandez', 'Zainab Hussain'], start: '2026-08-10' }),
  make({ id: 'JIMRT2026000208', email: DEMO_EMAIL, title: 'Women Farmer Collectives and Access to Input Credit', stage: 6, authors: ['Lucia Romano', 'Anand Narayan', 'Maya Krishnan'], start: '2026-08-01' }),
])
