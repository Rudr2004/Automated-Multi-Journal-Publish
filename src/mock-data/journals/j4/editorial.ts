// Journal 4 editorial board mock data (fictional people, placeholder institutions).
import { buildEditors, type EditorSeed } from '../../shared/buildEditors'

const SEEDS: EditorSeed[] = [
  ['Prof. Venkatesh Subramaniam', 'Editor-in-Chief', 'Professor of Structural Engineering', 'Indian Institute of Technology Madras', 'India', ['Structural health monitoring', 'Bridge engineering', 'Engineering management']],
  ['Dr. Anjali Kulkarni', 'Managing Editor', 'Associate Professor of Operations Management', 'Indian Institute of Management Bangalore', 'India', ['Operations management', 'Engineering management', 'Research publishing']],
  ['Prof. Henrik Johansson', 'Associate Editor', 'Professor of Electric Power Systems', 'KTH Royal Institute of Technology', 'Sweden', ['Power systems', 'Microgrids', 'Renewable integration']],
  ['Prof. Deepa Narayanan', 'Associate Editor', 'Professor of Civil Engineering', 'National University of Singapore', 'Singapore', ['Structural dynamics', 'Smart infrastructure', 'Concrete structures']],
  ['Dr. Michael Thornton', 'Associate Editor', 'Associate Professor of Supply Chain Analytics', 'University of Warwick', 'United Kingdom', ['Supply chain optimisation', 'Inventory control', 'Logistics']],
  ['Prof. Keiko Matsuda', 'Associate Editor', 'Professor of Electronic Systems', 'University of Tokyo', 'Japan', ['Embedded systems', 'Low-power sensing', 'Instrumentation']],
  ['Prof. Rajiv Chaudhary', 'Editorial Board', 'Professor of Manufacturing Engineering', 'Indian Institute of Technology Bombay', 'India', ['Lean manufacturing', 'Machining processes', 'Additive manufacturing']],
  ['Prof. Sofia Andersson', 'Editorial Board', 'Professor of Construction Management', 'Chalmers University of Technology', 'Sweden', ['Project risk management', 'Construction management', 'Contract performance']],
  ['Dr. Carlos Mendoza', 'Editorial Board', 'Associate Professor of Structural Engineering', 'Universidad Politécnica de Madrid', 'Spain', ['Seismic design', 'Masonry structures', 'Structural retrofitting']],
  ['Prof. Tariq Mahmood', 'Editorial Board', 'Professor of Electrical Engineering', 'King Fahd University of Petroleum and Minerals', 'Saudi Arabia', ['Power electronics', 'Grid protection', 'Energy storage']],
  ['Prof. Ingrid Vogel', 'Editorial Board', 'Professor of Industrial Engineering', 'Technical University of Munich', 'Germany', ['Production scheduling', 'Industrial engineering', 'Simulation']],
  ['Dr. Priyam Bose', 'Editorial Board', 'Associate Professor of Control Engineering', 'Indian Institute of Technology Kharagpur', 'India', ['Industrial automation', 'Model predictive control', 'Process monitoring']],
  ['Dr. Naveen Reddy', 'Review Board', 'Assistant Professor of Civil Engineering', 'National Institute of Technology Warangal', 'India', ['Construction planning', 'Project scheduling']],
  ['Dr. Fiona McAllister', 'Review Board', 'Senior Lecturer in Electrical Engineering', 'University of Strathclyde', 'United Kingdom', ['Microgrid control', 'Distribution networks']],
  ['Dr. Kwabena Asante', 'Review Board', 'Lecturer in Civil Engineering', 'Kwame Nkrumah University of Science and Technology', 'Ghana', ['Water infrastructure', 'Sustainable materials']],
  ['Dr. Shalini Mathur', 'Review Board', 'Assistant Professor of Operations Research', 'Birla Institute of Technology and Science, Pilani', 'India', ['Supply chain resilience', 'Optimisation methods']],
  ['Dr. Pavel Novotny', 'Review Board', 'Researcher in Embedded Systems', 'Czech Technical University in Prague', 'Czech Republic', ['Embedded sensing', 'Wireless sensor networks']],
  ['Dr. Amira Hassan', 'Review Board', 'Assistant Professor of Structural Engineering', 'Cairo University', 'Egypt', ['Structural monitoring', 'Concrete durability']],
]

export const editors = buildEditors(SEEDS)
