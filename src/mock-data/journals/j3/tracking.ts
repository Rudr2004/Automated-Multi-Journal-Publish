// Journal 3 demo papers; stage logic is shared (mock-data/shared/createTracking).
import { journal } from '../../../config/journals/j3'
import { createTracking, DEMO_EMAIL } from '../../shared/createTracking'

/** Demo papers covering every stage and payment state. Email must match to view. */
export const { trackedPapers, findPaper, newSubmission } = createTracking(journal, (make) => [
  make({ id: 'IJCSD2026000201', email: 'sunaina.malhotra@example.com', title: 'Typographic Memory in Handpainted Shop Signage of Old Delhi', stage: 1, authors: ['Sunaina Malhotra', 'Gautam Chakravarty'], start: '2026-09-28', referral: { code: 'SUNAINA-IJCSD', credits: 0, referred: 0 } }),
  make({ id: 'IJCSD2026000202', email: 'kabir.malhotra@example.com', title: 'Neighbourhood Murals and Civic Pride in Mid-Sized Indian Cities', stage: 4, authors: ['Kabir Malhotra', 'Simran Bhatia', 'Pedro Carvalho'], start: '2026-08-30', referral: { code: 'KABIR-IJCSD', credits: 1, referred: 2 } }),
  make({ id: 'IJCSD2026000203', email: 'amaka.obi@example.com', title: 'Nollywood Costume Practices and Local Textile Markets', stage: 7, authors: ['Amaka Obi', 'Emeka Nwankwo'], start: '2026-07-01', referral: { code: 'AMAKA-IJCSD', credits: 2, referred: 3 } }),
  // One demo paper per remaining stage (email: demo@example.com).
  make({ id: 'IJCSD2026000204', email: DEMO_EMAIL, title: 'Folk Song Archives and Intergenerational Learning in Rajasthan', stage: 0, authors: ['Ayesha Siddiqui'], start: '2026-10-05' }),
  make({ id: 'IJCSD2026000205', email: DEMO_EMAIL, title: 'Wearable Light Installations and Audience Movement in Public Squares', stage: 2, authors: ['Tomas Kovac', 'Noor Rahman'], start: '2026-09-10' }),
  make({ id: 'IJCSD2026000206', email: DEMO_EMAIL, title: 'Rhythm Notation Apps and Tabla Learning among Beginners', stage: 3, authors: ['Stefan Moller', 'Alejandro Ruiz'], start: '2026-08-25' }),
  make({ id: 'IJCSD2026000209', email: DEMO_EMAIL, title: 'Women Weavers and Digital Storefronts in Assam Handloom Clusters', stage: 4, authors: ['Rhea Dasgupta', 'Julian Ashford'], start: '2026-08-20', payment: 'verifying' }),
  make({ id: 'IJCSD2026000207', email: DEMO_EMAIL, title: 'Museum Audio Guides in Local Languages: A Visitor Experience Study', stage: 5, authors: ['Clara Dubois', 'Farid Benali'], start: '2026-08-10' }),
  make({ id: 'IJCSD2026000208', email: DEMO_EMAIL, title: 'Street Theatre and Voter Awareness in Peri-Urban Wards', stage: 6, authors: ['Gauri Kulshreshtha', 'Ravindra Joshi', 'Mariam Khalil'], start: '2026-08-01' }),
])
