// Journal 3 editorial board mock data (fictional people, placeholder institutions).
import { buildEditors, type EditorSeed } from '../../shared/buildEditors'

const SEEDS: EditorSeed[] = [
  ['Prof. Meenakshi Raghavan', 'Editor-in-Chief', 'Professor of Design and Visual Culture', 'National Institute of Design', 'India', ['Design research', 'Visual culture', 'Craft and material practice']],
  ['Dr. Siddharth Rao', 'Managing Editor', 'Senior Research Fellow in Creative Industries', 'Tata Institute of Social Sciences', 'India', ['Creative industries', 'Cultural policy', 'Research publishing']],
  ['Prof. Charlotte Ashworth', 'Associate Editor', 'Professor of Arts Education', 'University of the Arts London', 'United Kingdom', ['Arts education', 'Studio pedagogy', 'Creative assessment']],
  ['Dr. Hiroshi Nakamura', 'Associate Editor', 'Associate Professor of Performing Arts', 'Tokyo University of the Arts', 'Japan', ['Traditional performance', 'Embodied knowledge', 'Documentation']],
  ['Prof. Isabel Moreno', 'Associate Editor', 'Professor of Media and Communication', 'University of São Paulo', 'Brazil', ['Media studies', 'Audience research', 'Community media']],
  ['Dr. Kofi Mensah', 'Associate Editor', 'Senior Lecturer in Cultural Heritage', 'University of Cape Town', 'South Africa', ['Heritage interpretation', 'Museum studies', 'Oral history']],
  ['Prof. Nandini Mukherjee', 'Editorial Board', 'Professor of Development Communication', 'Jawaharlal Nehru University', 'India', ['Development communication', 'Participatory methods', 'Gender and media']],
  ['Prof. Matthias Brandt', 'Editorial Board', 'Professor of Digital Design', 'Aalto University', 'Finland', ['Digital creativity', 'Interactive media', 'Design futures']],
  ['Dr. Mariam Khalil', 'Editorial Board', 'Associate Professor of Applied Theatre', 'American University of Beirut', 'Lebanon', ['Applied theatre', 'Community arts', 'Health communication']],
  ['Prof. Rafael Ortega', 'Editorial Board', 'Professor of Cultural Economics', 'University of Melbourne', 'Australia', ['Cultural economy', 'Creative labour', 'Arts funding']],
  ['Dr. Freya Lindholm', 'Editorial Board', 'Reader in Museum Practice', 'University of Edinburgh', 'United Kingdom', ['Museum practice', 'Visitor studies', 'Collections access']],
  ['Prof. Anirudh Bhattacharya', 'Editorial Board', 'Professor of Ethnomusicology', 'Ashoka University', 'India', ['Ethnomusicology', 'Music education', 'Performance ethnography']],
  ['Dr. Aarohi Deshpande', 'Review Board', 'Assistant Professor of Textile Design', 'National Institute of Design', 'India', ['Textile design', 'Natural dyes']],
  ['Dr. Emeka Nwankwo', 'Review Board', 'Lecturer in Film Studies', 'University of Lagos', 'Nigeria', ['Film studies', 'Documentary practice']],
  ['Dr. Hana Kobayashi', 'Review Board', 'Assistant Professor of Media Art', 'Tokyo University of the Arts', 'Japan', ['Media art', 'Generative tools']],
  ['Dr. Jonas Berg', 'Review Board', 'Postdoctoral Researcher in Interaction Design', 'Aalto University', 'Finland', ['Interaction design', 'Creative coding']],
  ['Dr. Pooja Nambiar', 'Review Board', 'Assistant Professor of Education', 'Tata Institute of Social Sciences', 'India', ['Primary arts integration', 'Teacher education']],
  ['Dr. Farid Benali', 'Review Board', 'Lecturer in Cultural Studies', 'Université Paris Cité', 'France', ['Urban culture', 'Visual rhetoric']],
]

export const editors = buildEditors(SEEDS)
