// Specializations offered under each subject area on the submission form, from the client's sheet (one list per numbered group).
// Journals pick the groups that match their own subject areas (see `specializations` in each journal's config).

const engineering = [
  'Aerospace & Aeronautical Engineering', 'Agricultural Engineering', 'Automobile & Automotive Engineering', 'Biomedical Engineering',
  'Biotechnology Engineering', 'Chemical Engineering', 'Civil & Structural Engineering', 'Electrical Engineering',
  'Electronics & Communication Engineering', 'Energy & Renewable Energy Engineering', 'Environmental Engineering',
  'Industrial & Manufacturing Engineering', 'Instrumentation & Control Engineering', 'Marine & Mining Engineering', 'Mechanical Engineering',
  'Mechatronics & Robotics', 'Metallurgical & Materials Engineering', 'Petroleum & Polymer Engineering', 'Telecommunication Engineering',
  'Textile Engineering', 'Transportation & Infrastructure Engineering', 'Other Engineering & Technology',
]
const computerScience = [
  'Artificial Intelligence & Machine Learning', 'Cloud Computing & Distributed Systems', 'Computer Applications & Software Development',
  'Computer Networks & Cybersecurity', 'Data Science & Big Data Analytics', 'Database Systems & Information Management',
  'Human-Computer Interaction', 'Internet of Things (IoT)', 'Robotics & Intelligent Systems', 'Software Engineering',
  'Web & Mobile Technologies', 'Other Computer Science & IT',
]
const management = [
  'Accounting & Auditing', 'Business Administration & Entrepreneurship', 'Business Analytics & Decision Sciences', 'Finance, Banking & Insurance',
  'Human Resource Management', 'International Business & Trade', 'Marketing & Digital Marketing', 'Operations & Supply Chain Management',
  'Organizational Behaviour & Leadership', 'Strategic Management & Innovation', 'Other Management & Commerce',
]
const socialSciences = [
  'Anthropology & Cultural Studies', 'Education & Educational Technology', 'Geography & Regional Studies',
  'International Relations & Political Science', 'Psychology & Behavioural Sciences', 'Public Administration & Governance',
  'Social Work & Community Development', 'Sociology & Social Research', 'Teacher Education & Curriculum Studies',
  'Other Social Sciences & Education',
]
const economicsLaw = [
  'Applied & Development Economics', 'Banking, Finance & Financial Economics', 'Business & Commercial Law', 'Constitutional & Administrative Law',
  'Econometrics & Quantitative Economics', 'International Economics & Trade', 'Intellectual Property & Technology Law', 'Public Finance & Taxation',
  'Public Policy & Governance', 'Human Rights & International Law', 'Other Economics, Law & Public Policy',
]
const artsHumanities = [
  'Arts & Creative Studies', 'Communication, Journalism & Media Studies', 'Cultural Studies & Heritage', 'History & Archaeology',
  'Languages, Linguistics & Literature', 'Philosophy & Ethics', 'Performing Arts & Music', 'Religious Studies & Theology', 'Digital Humanities',
  'Interdisciplinary & Multidisciplinary Research', 'Other Arts & Humanities',
]
const naturalSciences = [
  'Biological Sciences & Biotechnology', 'Chemistry & Chemical Sciences', 'Earth & Geological Sciences', 'Environmental & Climate Sciences',
  'Materials Science & Nanotechnology', 'Mathematics & Applied Mathematics', 'Microbiology & Biochemistry', 'Physics & Applied Physics',
  'Statistics & Data Analysis', 'Other Applied & Natural Sciences',
]
const pharmaceutical = [
  'Allied Health Sciences', 'Clinical & Biomedical Research', 'Dentistry & Oral Health', 'Healthcare Management', 'Medical & Health Sciences',
  'Nursing & Midwifery', 'Nutrition & Dietetics', 'Pharmaceutical Sciences', 'Pharmacology & Toxicology', 'Physiotherapy & Rehabilitation',
  'Public Health & Epidemiology', 'Psychology & Mental Health', 'Other Medical & Health Sciences',
]

/** J1 subject areas (Multidisciplinary Studies has no list, so no specialization question). */
export const J1_SPECIALIZATIONS: Record<string, string[]> = {
  'Engineering & Technology': engineering,
  'Management Studies': management,
  'Applied Sciences': naturalSciences,
  'Arts & Humanities': artsHumanities,
  'Economics & Commerce': economicsLaw,
  'Social Sciences': socialSciences,
  'Pharmaceutical Sciences': pharmaceutical,
}

/** J2 subject areas (the sheet's "Social Sciences, Education & Economics" group is both lists of its group 4). */
export const J2_SPECIALIZATIONS: Record<string, string[]> = {
  'Engineering & Technology': engineering,
  'Computer Science': computerScience,
  'Applied & Natural Sciences': naturalSciences,
  'Pharmaceutical Sciences': pharmaceutical,
  'Management, Business & Commerce': management,
  'Social Sciences & Education': [...socialSciences.slice(0, -1), ...economicsLaw.slice(0, -1), 'Other Social Sciences, Education & Economics'],
  'Arts & Humanities': artsHumanities,
}
