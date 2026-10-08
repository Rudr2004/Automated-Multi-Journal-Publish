// Editorial board mock data (fictional people, placeholder institutions).
import { buildEditors, type EditorSeed } from '../../shared/buildEditors'

const SEEDS: EditorSeed[] = [
  ['Prof. Anjali Deshmukh', 'Editor-in-Chief', 'Professor of Materials Engineering', 'Indian Institute of Science', 'India', ['Advanced composites', 'Polymer science', 'Sustainable materials']],
  ['Dr. Rohan Mehta', 'Managing Editor', 'Senior Research Fellow', 'Jawaharlal Nehru University', 'India', ['Research publishing', 'Open science', 'Scientometrics']],
  ['Prof. Elena Fischer', 'Associate Editor', 'Professor of Environmental Chemistry', 'Technical University of Munich', 'Germany', ['Microplastics', 'Water quality', 'Analytical chemistry']],
  ['Dr. Kwame Boateng', 'Associate Editor', 'Associate Professor of Public Health', 'University of Ghana', 'Ghana', ['Community health', 'Epidemiology', 'Health systems']],
  ['Prof. Mei Ling Zhou', 'Associate Editor', 'Professor of Computer Science', 'National University of Singapore', 'Singapore', ['Machine learning', 'Edge computing', 'Federated learning']],
  ['Dr. Sofia Lindqvist', 'Associate Editor', 'Senior Lecturer in Energy Systems', 'Lund University', 'Sweden', ['Energy storage', 'Techno-economics', 'Microgrids']],
  ['Prof. Arjun Venkataraman', 'Editorial Board', 'Professor of Biotechnology', 'Indian Institute of Technology Delhi', 'India', ['Synthetic biology', 'Biosensors', 'Bioprocess engineering']],
  ['Dr. Hannah Clarke', 'Editorial Board', 'Reader in Remote Sensing', 'University of Cambridge', 'United Kingdom', ['Remote sensing', 'Carbon accounting', 'Coastal ecosystems']],
  ['Prof. Omar Al-Farsi', 'Editorial Board', 'Professor of Energy Engineering', 'Khalifa University', 'United Arab Emirates', ['Renewable energy', 'Hydrogen', 'Power systems']],
  ['Dr. Chinwe Eze', 'Editorial Board', 'Senior Lecturer in Public Health', 'University of Nigeria, Nsukka', 'Nigeria', ['Maternal health', 'Health policy', 'Mixed methods']],
  ['Prof. Daniel Whitfield', 'Editorial Board', 'Professor of Materials Science', 'University of Toronto', 'Canada', ['Thin films', 'Coatings', 'Nanomaterials']],
  ['Dr. Priyanka Rao', 'Editorial Board', 'Assistant Professor of Computer Science', 'Indian Institute of Technology Bombay', 'India', ['Natural language processing', 'Low-resource languages', 'Responsible AI']],
  ['Dr. Lars Eriksen', 'Review Board', 'Research Scientist', 'Lund University', 'Sweden', ['Bioenergy', 'Life-cycle assessment']],
  ['Dr. Amara Nwosu', 'Review Board', 'Lecturer in Computer Science', 'University of Lagos', 'Nigeria', ['Healthcare AI', 'Data privacy']],
  ['Dr. Ritu Sharma', 'Review Board', 'Assistant Professor of Chemistry', 'University of Delhi', 'India', ['Sol–gel chemistry', 'Photocatalysis']],
  ['Dr. Thomas Becker', 'Review Board', 'Postdoctoral Researcher', 'Technical University of Munich', 'Germany', ['Freshwater systems', 'Environmental modelling']],
  ['Dr. Fatima Al-Mansoori', 'Review Board', 'Assistant Professor of Energy Economics', 'Khalifa University', 'United Arab Emirates', ['Solar energy', 'Energy policy']],
  ['Dr. James Okoye', 'Review Board', 'Research Fellow', 'University of Cambridge', 'United Kingdom', ['Diagnostics', 'Global health technology']],
]

export const editors = buildEditors(SEEDS)
