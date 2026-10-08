// Journal 4 demo papers; stage logic is shared (mock-data/shared/createTracking).
import { journal } from '../../../config/journals/j4'
import { createTracking, DEMO_EMAIL } from '../../shared/createTracking'

/** Demo papers covering every stage and payment state. Email must match to view. */
export const { trackedPapers, findPaper, newSubmission } = createTracking(journal, (make) => [
  make({ id: 'IJECM2026000201', email: 'arnav.saxena@example.com', title: 'Temperature Compensation of Vibrating-Wire Strain Gauges in Mass Concrete Pours', stage: 1, authors: ['Arnav Saxena', 'Marta Kowalska'], start: '2026-09-28', referral: { code: 'ARNAV-IJECM', credits: 0, referred: 0 } }),
  make({ id: 'IJECM2026000202', email: 'lucas.ferreira@example.com', title: 'Rooftop Solar Hosting Capacity of Low-Voltage Feeders in Mid-Sized Indian Cities', stage: 4, authors: ['Lucas Ferreira', 'Divya Prakash', 'Naresh Gowda'], start: '2026-08-30', referral: { code: 'LUCAS-IJECM', credits: 1, referred: 2 } }),
  make({ id: 'IJECM2026000203', email: 'ngozi.adebayo@example.com', title: 'Cost Overrun Drivers in Road Construction Packages: Evidence from West Africa', stage: 7, authors: ['Ngozi Adebayo', 'Kwabena Asante'], start: '2026-07-01', referral: { code: 'NGOZI-IJECM', credits: 2, referred: 3 } }),
  // One demo paper per remaining stage (email: demo@example.com).
  make({ id: 'IJECM2026000204', email: DEMO_EMAIL, title: 'Vibration Isolation of Precision Machine Tools Using Passive Elastomeric Mounts', stage: 0, authors: ['Rekha Bhattacharjee'], start: '2026-10-05' }),
  make({ id: 'IJECM2026000205', email: DEMO_EMAIL, title: 'Digital Twin Calibration for a Bottling Line Using Sparse Sensor Data', stage: 2, authors: ['Anika Schmidt', 'Jun-ho Park'], start: '2026-09-10' }),
  make({ id: 'IJECM2026000206', email: DEMO_EMAIL, title: 'Order Batching and Picker Routing in a Mid-Sized E-Commerce Warehouse', stage: 3, authors: ['Samir Khanna', 'Elisa Romano'], start: '2026-08-25' }),
  make({ id: 'IJECM2026000209', email: DEMO_EMAIL, title: 'Fly Ash Blended Geopolymer Mortars for Repair of Marine Concrete', stage: 4, authors: ['Swati Choudhury', 'Tobias Hartmann'], start: '2026-08-20', payment: 'verifying' }),
  make({ id: 'IJECM2026000207', email: DEMO_EMAIL, title: 'Fault Ride-Through Behaviour of Grid-Following Inverters in Weak Grids', stage: 5, authors: ['Ibrahim Yusuf', 'Fiona McAllister'], start: '2026-08-10' }),
  make({ id: 'IJECM2026000208', email: DEMO_EMAIL, title: 'Stakeholder Communication and Delay Recovery in Hospital Construction Projects', stage: 6, authors: ['Leena Thomas', 'Pradeep Menon', 'Sakura Ito'], start: '2026-08-01' }),
])
