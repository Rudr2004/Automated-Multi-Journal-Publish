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
  // Journal 4 (IJECM) people
  'Anjali Kulkarni': ['women', 0], 'Deepa Narayanan': ['women', 51], 'Keiko Matsuda': ['women', 52],
  'Sofia Andersson': ['women', 53], 'Ingrid Vogel': ['women', 54], 'Priyam Bose': ['women', 56],
  'Fiona McAllister': ['women', 57], 'Shalini Mathur': ['women', 58], 'Amira Hassan': ['women', 60],
  'Kavitha Subramanian': ['women', 61], 'Neha Agarwal': ['women', 62], 'Elisa Romano': ['women', 64],
  'Swati Choudhury': ['women', 65], 'Ngozi Adebayo': ['women', 66], 'Marta Kowalska': ['women', 67],
  'Divya Prakash': ['women', 69], 'Sakura Ito': ['women', 70], 'Rekha Bhattacharjee': ['women', 72],
  'Leena Thomas': ['women', 73], 'Anika Schmidt': ['women', 74],
  'Venkatesh Subramaniam': ['men', 0], 'Henrik Johansson': ['men', 8], 'Michael Thornton': ['men', 12],
  'Rajiv Chaudhary': ['men', 17], 'Carlos Mendoza': ['men', 21], 'Tariq Mahmood': ['men', 57],
  'Naveen Reddy': ['men', 58], 'Kwabena Asante': ['men', 59], 'Pavel Novotny': ['men', 60],
  'Ashwin Krishnamurthy': ['men', 61], 'Rohit Bansal': ['men', 63], 'Dmitri Volkov': ['men', 64],
  'Samir Khanna': ['men', 65], 'Tobias Hartmann': ['men', 66], 'Lucas Ferreira': ['men', 68],
  'Naresh Gowda': ['men', 69], 'Ibrahim Yusuf': ['men', 70], 'Pradeep Menon': ['men', 71],
  'Jun-ho Park': ['men', 72], 'Arnav Saxena': ['men', 73],
  // Journal 5 (IJFRD) people: existing portrait images are reused, one image per person within this journal.
  'Rajendra Varadarajan': ['men', 26], 'Yusuf Demirci': ['men', 27], 'Haoran Liu': ['men', 29], 'Oluwaseun Adewale': ['men', 30],
  'Jonas Eklund': ['men', 31], 'Anton Gruber': ['men', 34], 'Takashi Morimoto': ['men', 37], 'Felix Mbeki': ['men', 40], 'Arvind Chandrasekhar': ['men', 42],
  'Madhavi Kasturirangan': ['women', 44], 'Astrid Halvorsen': ['women', 38], 'Isabella Conti': ['women', 40], 'Sudha Ramanujam': ['women', 41],
  'Paloma Herrera': ['women', 42], 'Nomvula Dlamini': ['women', 43], 'Gayatri Venkataraman': ['women', 46], 'Camille Rousseau': ['women', 47], 'Hye-jin Seo': ['women', 49],
  'Ritika Bhandari': ['women', 2], 'Aiko Hasegawa': ['women', 4], 'Elodie Marchand': ['women', 5], 'Sana Qureshi': ['women', 6], 'Adaeze Okeke': ['women', 7],
  'Nadiya Kovalenko': ['women', 9], 'Lakshmi Ranganathan': ['women', 10], 'Ingeborg Dahl': ['women', 13], 'Farah Siddiqi': ['women', 14], 'Marisol Vega': ['women', 16],
  'Tanuja Phadke': ['women', 18], 'Joanna Wierzbicka': ['women', 20],
  'Karan Oberoi': ['men', 1], 'Mikhail Sorokin': ['men', 2], 'Emmanuel Tetteh': ['men', 3], 'Vishal Hegde': ['men', 4], 'Pieter van der Meer': ['men', 6],
  'Gaurav Mittal': ['men', 7], 'Hamza Idrissi': ['men', 9], 'Rafael Bianchi': ['men', 10], 'Tomasz Zielinski': ['men', 13], 'Siddharth Venkatesan': ['men', 15],
  'Daichi Yamamoto': ['men', 16], 'Julien Moreau': ['men', 18], 'Chinedu Obiora': ['men', 20], 'Aaron Feldman': ['men', 23], 'Dhruv Khurana': ['men', 24], 'Sandeep Raghuvanshi': ['men', 25],
}

/** Portrait URL for a person's name (titles like "Dr." or "Prof." are ignored). Undefined when unknown. */
export function portraitFor(name: string): string | undefined {
  const p = PORTRAIT[name.replace(/^(Prof|Dr)\.?\s+/i, '').trim()]
  // BASE_URL keeps the path correct if the site is deployed under a sub-folder.
  return p ? `${import.meta.env.BASE_URL}shared/portraits/${p[0]}-${p[1]}.jpg` : undefined
}
