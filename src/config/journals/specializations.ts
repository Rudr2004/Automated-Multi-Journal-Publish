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

// ---- J3 (IJCSD): the client's second sheet. "Multidisciplinary Subject" has no list: the author types any subject (see `freeTextSpecialization`).
const j3cs = [
  'Machine Learning',
  'Information Technology',
  'Artificial Intelligence',
  'Data Science and Analytics',
  'Cybersecurity',
  'Computer Networks and Communication',
  'Cloud Computing and Distributed Systems',
  'Information Systems and Management',
  'Human-Computer Interaction',
  'Emerging Computing Technologies',
  'Others',
]
const j3en = [
  'Civil Engineering',
  'Mechanical Engineering',
  'Electrical Engineering',
  'Electronics Engineering',
  'Electronics and Communication Engineering',
  'Chemical Engineering',
  'Aerospace Engineering',
  'Automobile Engineering',
  'Mechatronics and Robotics',
  'Industrial and Production Engineering',
  'Materials and Metallurgical Engineering',
  'Environmental Engineering',
  'Biomedical Engineering',
  'Agricultural Engineering',
  'Energy Engineering',
  'Mining and Geological Engineering',
  'Marine and Ocean Engineering',
  'Engineering Management and Technology',
  'Others',
]
const j3mg = [
  'Business Administration',
  'Marketing Management',
  'Human Resource Management',
  'Finance',
  'Accounting',
  'Commerce',
  'Economics',
  'International Business',
  'Entrepreneurship and Innovation',
  'Operations and Supply Chain Management',
  'Banking and Insurance',
  'Business Analytics',
  'Hospitality and Tourism Management',
  'Public Administration',
  'E-Commerce and Digital Business',
  'Others',
]
const j3ed = [
  'Education',
  'Educational Technology',
  'Teacher Education',
  'Educational Psychology',
  'Educational Administration and Leadership',
  'Sociology',
  'Psychology',
  'Social Work',
  'Political Science',
  'Public Policy and Governance',
  'Geography',
  'Economics and Development Studies',
  'Library and Information Science',
  'Communication and Media Studies',
  'Others',
]
const j3ar = [
  'English Language and Literature',
  'Languages and Linguistics',
  'History',
  'Philosophy',
  'Religious and Cultural Studies',
  'Fine Arts',
  'Architecture and Design',
  'Fashion and Textile Studies',
  'Law',
  'Corporate and Commercial Law',
  'International Law',
  'Intellectual Property Law',
  'Environmental Law',
  'Linguistic and Cultural Heritage',
  'Others',
]
const j3sc = [
  'Mathematics',
  'Statistics',
  'Physics',
  'Chemistry',
  'Biotechnology',
  'Biochemistry',
  'Environmental Science',
  'Earth Sciences',
  'Marine Sciences',
  'Food Science and Technology',
  'Forensic Science',
  'Materials Science',
  'Pharmaceutical Sciences',
  'Others',
]

export const J3_SPECIALIZATIONS: Record<string, string[]> = {
  'Computer Science and Information Technology': j3cs,
  'Engineering and Technology': j3en,
  'Management and Commerce': j3mg,
  'Education and Social Sciences': j3ed,
  'Arts, Humanities and Law': j3ar,
  'Science': j3sc,
}
export const J3_SUBJECTS = [...Object.keys(J3_SPECIALIZATIONS), 'Multidisciplinary Subject']

// ---- J4 (IJECM): the client's third specialization sheet.
const j4eng = [
  'Aeronautical & Aerospace Engineering',
  'Agricultural Engineering',
  'Automobile Engineering',
  'Biomedical Engineering',
  'Biotechnology Engineering',
  'Chemical Engineering',
  'Civil Engineering',
  'Electrical Engineering',
  'Electronics & Communication Engineering',
  'Environmental Engineering',
  'Industrial & Production Engineering',
  'Mechanical Engineering',
  'Mechatronics & Robotics',
  'Mining Engineering',
  'Petroleum Engineering',
  'Renewable Energy Engineering',
  'Structural Engineering',
  'Textile Engineering',
  'Transportation Engineering',
  'Other Engineering & Technology',
]
const j4cs = [
  'Artificial Intelligence & Machine Learning',
  'Computer Applications',
  'Computer Networks',
  'Cybersecurity',
  'Data Science & Analytics',
  'Database Management Systems',
  'Information Systems',
  'Internet of Things (IoT)',
  'Software Engineering',
  'Web & Mobile Technologies',
  'Other Computer Science & IT',
]
const j4mg = [
  'Business Administration',
  'Business Analytics',
  'Entrepreneurship',
  'Finance & Banking',
  'Human Resource Management',
  'International Business',
  'Marketing Management',
  'Operations Management',
  'Project Management',
  'Supply Chain Management',
  'Strategic Management',
  'Tourism & Hospitality Management',
  'Other Management Studies',
]
const j4sc = [
  'Biochemistry',
  'Biology',
  'Biotechnology',
  'Chemistry',
  'Environmental Science',
  'Mathematics',
  'Microbiology',
  'Physics',
  'Statistics',
  'Materials Science',
  'Nanotechnology',
  'Other Applied & Natural Sciences',
]
const j4ec = [
  'Accounting & Auditing',
  'Agricultural Economics',
  'Applied Economics',
  'Banking & Finance',
  'Business Economics',
  'Development Economics',
  'Econometrics',
  'International Trade',
  'Microeconomics & Macroeconomics',
  'Taxation',
  'Other Economics & Commerce',
]
const j4ar = [
  'Archaeology',
  'Cultural Studies',
  'Fine Arts',
  'History',
  'Languages & Literature',
  'Linguistics',
  'Music & Performing Arts',
  'Philosophy',
  'Religious Studies',
  'Communication & Media Studies',
  'Other Arts & Humanities',
]
const j4ss = [
  'Anthropology',
  'Curriculum & Instruction',
  'Criminology',
  'Distance & Online Education',
  'Development Studies',
  'Educational Administration',
  'Educational Psychology',
  'Educational Technology',
  'Geography',
  'Gender Studies',
  'Higher Education',
  'Inclusive & Special Education',
  'International Relations',
  'Language Education',
  'Political Science',
  'Public Administration',
  'Rural Development',
  'Science & Mathematics Education',
  'Social Work',
  'Sociology',
  'Teacher Education',
  'Other Social Sciences & Education',
]

export const J4_SPECIALIZATIONS: Record<string, string[]> = {
  'Engineering & Technology': j4eng,
  'Computer Science & Information Technology': j4cs,
  'Management Studies': j4mg,
  'Applied & Natural Sciences': j4sc,
  'Economics & Commerce': j4ec,
  'Arts & Humanities': j4ar,
  'Social Sciences & Education': j4ss,
}
