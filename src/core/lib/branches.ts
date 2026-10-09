// Branches (sub-fields) offered once an author has picked a discipline on the submission form. Keyed by the exact discipline names
// that Journal 1 and Journal 2 use in their config; a discipline that is not listed here simply has no branch question.

export const BRANCHES: Record<string, string[]> = {
  // Journal 1 (IJMAT)
  'Materials Science': ['Polymers & composites', 'Nanomaterials', 'Metals & alloys', 'Ceramics & glass', 'Biomaterials', 'Thin films & coatings', 'Other'],
  'Environmental Science': ['Water resources', 'Air quality & climate', 'Soil & land use', 'Waste management', 'Ecology & biodiversity', 'Environmental policy', 'Other'],
  'Computer Science': ['Artificial intelligence', 'Machine learning & data science', 'Computer vision', 'Cybersecurity', 'Software engineering', 'Networks & IoT', 'Human–computer interaction', 'Other'],
  'Biotechnology': ['Genetic engineering', 'Industrial biotechnology', 'Medical & pharmaceutical biotechnology', 'Agricultural biotechnology', 'Bioinformatics', 'Environmental biotechnology', 'Other'],
  'Energy Systems': ['Solar & photovoltaics', 'Wind energy', 'Energy storage & batteries', 'Smart grids', 'Bioenergy', 'Energy policy & economics', 'Other'],
  'Public Health': ['Epidemiology', 'Community & primary care', 'Health policy & systems', 'Nutrition', 'Mental health', 'Occupational & environmental health', 'Other'],
  // Journal 2 (JIMRT)
  'Engineering & Technology': ['Civil & structural engineering', 'Mechanical engineering', 'Electrical & electronics engineering', 'Chemical engineering', 'Computer engineering', 'Industrial & manufacturing', 'Aerospace engineering', 'Environmental engineering', 'Biomedical engineering', 'Other'],
  'Computer & Data Science': ['Artificial intelligence', 'Machine learning', 'Data mining & analytics', 'Cybersecurity', 'Software engineering', 'Networks & cloud computing', 'Other'],
  'Life & Health Sciences': ['Molecular biology', 'Genetics & genomics', 'Microbiology', 'Clinical medicine', 'Public health', 'Pharmacology', 'Neuroscience', 'Other'],
  'Environment & Sustainability': ['Climate change', 'Renewable energy', 'Water & sanitation', 'Waste & circular economy', 'Biodiversity & conservation', 'Sustainable cities', 'Other'],
  'Physical Sciences & Materials': ['Physics', 'Chemistry', 'Nanomaterials', 'Polymers', 'Condensed matter', 'Optics & photonics', 'Other'],
  'Social Sciences & Education': ['Education & pedagogy', 'Psychology', 'Sociology', 'Public policy', 'Communication & media', 'Development studies', 'Other'],
  'Business & Economics': ['Management', 'Finance & accounting', 'Marketing', 'Operations & supply chain', 'Entrepreneurship', 'Economics', 'Other'],
  'Agriculture & Food': ['Crop science', 'Soil science', 'Food technology', 'Horticulture', 'Animal science', 'Agricultural economics', 'Other'],
}

/** The branch options for a discipline (empty when the discipline has none). */
export const branchesFor = (subject: string): string[] => BRANCHES[subject] ?? []
