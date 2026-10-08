// Journal 2 editorial board mock data (fictional people, placeholder institutions).
import { buildEditors, type EditorSeed } from '../../shared/buildEditors'

const SEEDS: EditorSeed[] = [
  ['Prof. Ingrid Solberg', 'Editor-in-Chief', 'Professor of Science and Technology Studies', 'Norwegian University of Science and Technology', 'Norway', ['Interdisciplinary research', 'Research methods', 'Open science']],
  ['Dr. Arvind Subramanian', 'Managing Editor', 'Senior Research Fellow', 'Indian Institute of Technology Madras', 'India', ['Research publishing', 'Scientometrics', 'Structural engineering']],
  ['Prof. Leila Haddad', 'Associate Editor', 'Professor of Computer Science', 'American University of Beirut', 'Lebanon', ['Natural language processing', 'Education technology', 'Low-resource languages']],
  ['Dr. Naomi Adeyemi', 'Associate Editor', 'Associate Professor of Materials Science', 'University of Lagos', 'Nigeria', ['Sustainable construction materials', 'Geopolymers', 'Characterisation']],
  ['Prof. Kenji Watanabe', 'Associate Editor', 'Professor of Environmental Engineering', 'Kyoto University', 'Japan', ['Water resources', 'Coastal engineering', 'Climate adaptation']],
  ['Dr. Camila Torres', 'Associate Editor', 'Senior Researcher in Molecular Diagnostics', 'University of São Paulo', 'Brazil', ['CRISPR diagnostics', 'Infectious disease', 'Point-of-care testing']],
  ['Prof. Divya Menon', 'Editorial Board', 'Professor of Education', 'Tata Institute of Social Sciences', 'India', ['Teacher education', 'Educational equity', 'Mixed methods']],
  ['Dr. Lucia Romano', 'Editorial Board', 'Associate Professor of Agroecology', 'University of Bologna', 'Italy', ['Agroforestry', 'Soil carbon', 'Smallholder systems']],
  ['Prof. Samuel Adeyemi', 'Editorial Board', 'Professor of Agricultural Economics', 'University of Ibadan', 'Nigeria', ['Value chains', 'Rural livelihoods', 'Food policy']],
  ['Dr. Olivia Bennett', 'Editorial Board', 'Reader in Nutrition and Metabolism', 'University of Edinburgh', 'United Kingdom', ['Nutrition', 'Metabolic health', 'Clinical trials']],
  ['Prof. Harsh Vardhan', 'Editorial Board', 'Professor of Finance', 'Indian Institute of Management Bangalore', 'India', ['Digital finance', 'Small enterprises', 'Emerging markets']],
  ['Dr. Nadia Volkova', 'Editorial Board', 'Lecturer in Machine Learning', 'Delft University of Technology', 'Netherlands', ['Speech recognition', 'On-device AI', 'Energy-efficient learning']],
  ['Dr. Beatriz Santos', 'Review Board', 'Research Scientist', 'University of Lisbon', 'Portugal', ['Coastal ecosystems', 'Mangroves']],
  ['Dr. Joseph Okonkwo', 'Review Board', 'Lecturer in Environmental Science', 'University of Nairobi', 'Kenya', ['Flood risk', 'Remote sensing']],
  ['Dr. Maya Krishnan', 'Review Board', 'Assistant Professor of Agronomy', 'Tamil Nadu Agricultural University', 'India', ['Precision agriculture', 'Crop stress sensing']],
  ['Dr. Tobias Lindgren', 'Review Board', 'Postdoctoral Researcher', 'Swedish University of Agricultural Sciences', 'Sweden', ['Drone imaging', 'Nitrogen management']],
  ['Dr. Imran Qureshi', 'Review Board', 'Assistant Professor of Biotechnology', 'Aga Khan University', 'Pakistan', ['Molecular diagnostics', 'Tropical diseases']],
  ['Dr. Ethan Collins', 'Review Board', 'Senior Lecturer in Economics', 'University of Melbourne', 'Australia', ['Applied econometrics', 'Financial inclusion']],
]

export const editors = buildEditors(SEEDS)
