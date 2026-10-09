// IJFRD editorial board mock data (fictional people, placeholder institutions).
import { buildEditors, type EditorSeed } from '../../shared/buildEditors'

const SEEDS: EditorSeed[] = [
  ['Prof. Rajendra Varadarajan', 'Editor-in-Chief', 'Professor of Theoretical Physics', 'Indian Institute of Science', 'India', ['Condensed matter theory', 'Quantum many-body physics', 'Research evaluation']],
  ['Dr. Madhavi Kasturirangan', 'Managing Editor', 'Associate Professor of Science and Technology Studies', 'National Institute of Advanced Studies', 'India', ['Science policy', 'Research publishing', 'Technology transfer']],
  ['Prof. Astrid Halvorsen', 'Associate Editor', 'Professor of Astrophysics', 'University of Oslo', 'Norway', ['Observational cosmology', 'Galaxy clusters', 'Astronomical instrumentation']],
  ['Prof. Yusuf Demirci', 'Associate Editor', 'Professor of Physical Chemistry', 'Middle East Technical University', 'Türkiye', ['Reaction kinetics', 'Photochemistry', 'Catalysis']],
  ['Prof. Haoran Liu', 'Associate Editor', 'Professor of Materials Science and Engineering', 'Nanyang Technological University', 'Singapore', ['Nanomaterials', 'Thin films', 'Electron microscopy']],
  ['Prof. Isabella Conti', 'Associate Editor', 'Professor of Molecular Biology', 'University of Bologna', 'Italy', ['Protein structure', 'Gene regulation', 'Synthetic biology']],
  ['Prof. Oluwaseun Adewale', 'Associate Editor', 'Professor of Environmental Geochemistry', 'University of Ibadan', 'Nigeria', ['Aqueous geochemistry', 'Soil carbon', 'Environmental isotopes']],
  ['Prof. Sudha Ramanujam', 'Editorial Board', 'Professor of Mathematics', 'Chennai Mathematical Institute', 'India', ['Analysis', 'Partial differential equations', 'Fractional calculus']],
  ['Prof. Jonas Eklund', 'Editorial Board', 'Professor of Statistics', 'Uppsala University', 'Sweden', ['Nonparametric statistics', 'Time series', 'Bayesian methods']],
  ['Dr. Paloma Herrera', 'Editorial Board', 'Associate Professor of Computational Science', 'Universitat Politècnica de Catalunya', 'Spain', ['Numerical simulation', 'High-performance computing', 'Scientific machine learning']],
  ['Prof. Anton Gruber', 'Editorial Board', 'Professor of Mechanics', 'ETH Zurich', 'Switzerland', ['Solid mechanics', 'Fatigue and fracture', 'Heat transfer']],
  ['Dr. Nomvula Dlamini', 'Editorial Board', 'Associate Professor of Science and Technology Policy', 'University of Cape Town', 'South Africa', ['Innovation systems', 'Development policy', 'Open science']],
  ['Dr. Takashi Morimoto', 'Review Board', 'Assistant Professor of Quantum Optics', 'Kyoto University', 'Japan', ['Quantum optics', 'Precision measurement']],
  ['Dr. Gayatri Venkataraman', 'Review Board', 'Assistant Professor of Organic Chemistry', 'Indian Institute of Science Education and Research, Pune', 'India', ['Organocatalysis', 'Reaction mechanisms']],
  ['Dr. Felix Mbeki', 'Review Board', 'Senior Lecturer in Nanomaterials', 'University of the Witwatersrand', 'South Africa', ['Nanocomposites', 'Carbon materials']],
  ['Dr. Camille Rousseau', 'Review Board', 'Researcher in Plant Genomics', 'Wageningen University & Research', 'Netherlands', ['Plant stress genomics', 'Crop biotechnology']],
  ['Dr. Arvind Chandrasekhar', 'Review Board', 'Assistant Professor of Geophysics', 'Indian Institute of Technology Kharagpur', 'India', ['Seismology', 'Ambient noise tomography']],
  ['Dr. Hye-jin Seo', 'Review Board', 'Assistant Professor of Applied Mathematics', 'Korea Advanced Institute of Science and Technology', 'South Korea', ['Numerical analysis', 'Random matrices']],
]

export const editors = buildEditors(SEEDS)
