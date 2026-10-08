// Placeholder portraits, stored in /public/shared/portraits (originally from randomuser.me, free images made for mock data).
// They are served from this site, so nothing breaks when deployed to another host or when offline.
// One entry per person, so the same name always gets the same face (articles, board, testimonials).
// The gender is chosen from the name. Replace with real photos before launch.
const PORTRAIT: Record<string, ['men' | 'women', number]> = {
  // women
  'Ananya Iyer': ['women', 44], 'Elena Petrova': ['women', 68], 'Priya Nair': ['women', 21], 'Mei Lin Tan': ['women', 33],
  'Sneha Kulkarni': ['women', 17], 'Fatima Al-Mansoori': ['women', 12], 'Sofia Lindqvist': ['women', 26], 'Meera Joshi': ['women', 55],
  'Ritu Sharma': ['women', 90], 'Amara Nwosu': ['women', 63], 'Hannah Clarke': ['women', 79], 'Sunita Verma': ['women', 8],
  'Chinwe Eze': ['women', 37], 'Anjali Deshmukh': ['women', 49], 'Elena Fischer': ['women', 71], 'Mei Ling Zhou': ['women', 3],
  'Priyanka Rao': ['women', 59],
  // men
  'Rahul Menon': ['men', 32], 'Thomas Becker': ['men', 22], 'Vikram Desai': ['men', 45], 'Arjun Kapoor': ['men', 67],
  'Daniel Okafor': ['men', 11], 'Karthik Raman': ['men', 53], 'James Whitfield': ['men', 75], 'Nikhil Bhatia': ['men', 86],
  'Lars Eriksen': ['men', 41], 'Debasish Roy': ['men', 28], 'Marcus Hoffmann': ['men', 5], 'Rohan Mehta': ['men', 36],
  'Kwame Boateng': ['men', 19], 'Arjun Venkataraman': ['men', 62], 'Omar Al-Farsi': ['men', 48], 'Daniel Whitfield': ['men', 82],
  'James Okoye': ['men', 14],
  // Journal 2 (JIMRT) people
  'Aditi Banerjee': ['women', 1], 'Leila Haddad': ['women', 2], 'Ingrid Solberg': ['women', 4], 'Naomi Adeyemi': ['women', 5],
  'Ishita Chandra': ['women', 6], 'Camila Torres': ['women', 7], 'Yuki Tanaka': ['women', 9], 'Radhika Pillai': ['women', 10],
  'Zainab Hussain': ['women', 11], 'Olivia Bennett': ['women', 13], 'Kavya Reddy': ['women', 14], 'Maya Krishnan': ['women', 15],
  'Beatriz Santos': ['women', 16], 'Shreya Agarwal': ['women', 18], 'Nadia Volkova': ['women', 19], 'Grace Mwangi': ['women', 20],
  'Tanvi Kapoor': ['women', 22], 'Lucia Romano': ['women', 23], 'Divya Menon': ['women', 24], 'Helena Novak': ['women', 25],
  'Arvind Subramanian': ['men', 1], 'Mateo Fernandez': ['men', 2], 'Sanjay Gupta': ['men', 3], 'Oliver Grant': ['men', 4],
  'Kenji Watanabe': ['men', 6], 'Rajesh Pillai': ['men', 7], 'Ahmed Mansour': ['men', 9], 'Pranav Joshi': ['men', 10],
  'Samuel Adeyemi': ['men', 13], 'Ethan Collins': ['men', 15], 'Vivek Chatterjee': ['men', 16], 'Lukas Weber': ['men', 18],
  'Imran Qureshi': ['men', 20], 'Harsh Vardhan': ['men', 23], 'Tobias Lindgren': ['men', 24], 'Anand Narayan': ['men', 25],
  'Joseph Okonkwo': ['men', 29], 'Ravi Teja': ['men', 30], 'Diego Alvarez': ['men', 31], 'Neil Thompson': ['men', 34],
  // Journal 3 (IJCSD) people
  'Meenakshi Raghavan': ['women', 27], 'Charlotte Ashworth': ['women', 28], 'Isabel Moreno': ['women', 29], 'Nandini Mukherjee': ['women', 30],
  'Mariam Khalil': ['women', 31], 'Freya Lindholm': ['women', 32], 'Aarohi Deshpande': ['women', 34], 'Hana Kobayashi': ['women', 35],
  'Pooja Nambiar': ['women', 36], 'Sunaina Malhotra': ['women', 38], 'Amaka Obi': ['women', 39], 'Rhea Dasgupta': ['women', 40],
  'Ayesha Siddiqui': ['women', 41], 'Esther Mutua': ['women', 42], 'Gauri Kulshreshtha': ['women', 43], 'Clara Dubois': ['women', 45],
  'Lakshmi Venkatesan': ['women', 46], 'Noor Rahman': ['women', 47], 'Simran Bhatia': ['women', 48], 'Tara Menezes': ['women', 50],
  'Siddharth Rao': ['men', 26], 'Hiroshi Nakamura': ['men', 33], 'Kofi Mensah': ['men', 37], 'Matthias Brandt': ['men', 39],
  'Rafael Ortega': ['men', 40], 'Anirudh Bhattacharya': ['men', 42], 'Emeka Nwankwo': ['men', 43], 'Jonas Berg': ['men', 44],
  'Farid Benali': ['men', 46], 'Aarav Khanna': ['men', 47], 'Tomas Kovac': ['men', 49], 'Kabir Malhotra': ['men', 50],
  'Julian Ashford': ['men', 51], 'Pedro Carvalho': ['men', 52], 'Sandeep Iyengar': ['men', 54], 'Gautam Chakravarty': ['men', 55],
  'Stefan Moller': ['men', 56], 'Ravindra Joshi': ['men', 35], 'Mohan Pillai': ['men', 38], 'Alejandro Ruiz': ['men', 27],
}

/** Portrait URL for a person's name (titles like "Dr." or "Prof." are ignored). Undefined when unknown. */
export function portraitFor(name: string): string | undefined {
  const p = PORTRAIT[name.replace(/^(Prof|Dr)\.?\s+/i, '').trim()]
  // BASE_URL keeps the path correct if the site is deployed under a sub-folder.
  return p ? `${import.meta.env.BASE_URL}shared/portraits/${p[0]}-${p[1]}.jpg` : undefined
}
