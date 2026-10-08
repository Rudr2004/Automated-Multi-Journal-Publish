// Journal 3 theme profiles; the article builder itself is shared (mock-data/shared/buildFull).
import { createBuildFull, type Profile } from '../../shared/buildFull'
import { INSTITUTIONS, SUBJECTS, allArticles } from './articles'

const [DES, EDU, MED, HER, IND, DIG, DEV, PER] = SUBJECTS

const P: Record<string, Profile> = {
  [DES]: {
    field: 'design research and visual culture', problem: 'the need to understand how people read, use and remember designed objects and images', gap: 'few studies that link studio practice with the experience of everyday users',
    approach: 'practice-based design research with observation and interviews', setup: 'prototypes were made in studio sessions with practitioners and then reviewed by users in workshops and short interviews',
    metric: 'user preference rating', unit: 'points', groups: ['Existing design', 'Prototype A', 'Prototype B', 'Prototype C', 'Co-designed'],
    keywords: ['design research', 'visual culture', 'co-design', 'material practice', 'user experience'],
    refJournals: ['Design Studies', 'Design Issues', 'The Design Journal', 'Visual Communication'],
    params: [['Method', 'Practice-based design', 'Studio and workshop phases'], ['Participants', '32 practitioners and users', 'Purposively sampled'], ['Data', 'Field notes and interviews', 'Audio recorded with consent'], ['Analysis', 'Thematic coding', 'Two independent coders']],
  },
  [EDU]: {
    field: 'arts education and creative pedagogy', problem: 'the place of the arts in how learners build imagination, confidence and critical thinking', gap: 'limited classroom evidence from schools with modest resources',
    approach: 'a classroom-based mixed-methods study', setup: 'lessons were observed over one term, learners kept visual portfolios and teachers wrote short reflections after each unit',
    metric: 'creative confidence score', unit: 'points', groups: ['Comparison class', 'Term start', 'Mid-term', 'Term end', 'Follow-up'],
    keywords: ['arts education', 'creative pedagogy', 'studio learning', 'assessment', 'learner voice'],
    refJournals: ['Studies in Art Education', 'International Journal of Art & Design Education', 'Arts Education Policy Review', 'Thinking Skills and Creativity'],
    params: [['Design', 'Mixed-methods case study', 'One school term'], ['Learners', '186 across 8 classes', 'Grades 6 to 9'], ['Instruments', 'Portfolio rubric and survey', 'Pilot-tested'], ['Ethics', 'Approved by IRB', 'Parental consent obtained']],
  },
  [MED]: {
    field: 'media and communication studies', problem: 'the changing ways audiences find, trust and share stories', gap: 'little audience research in regional languages and smaller media markets',
    approach: 'an audience study combining content analysis, focus groups and a short survey', setup: 'a sample of programmes was coded and viewers were then invited to discuss them in small groups',
    metric: 'perceived trust score', unit: 'points', groups: ['National outlet', 'Regional outlet', 'Community outlet', 'Social platform', 'Personal network'],
    keywords: ['media studies', 'audience reception', 'regional media', 'news literacy', 'storytelling'],
    refJournals: ['Media, Culture & Society', 'New Media & Society', 'Journalism Studies', 'Television & New Media'],
    params: [['Sample', '48 programmes', 'Coded by two raters'], ['Focus groups', '12 groups', 'Six to eight members each'], ['Survey', 'n = 420', 'Five-point scales'], ['Languages', 'Hindi, Tamil, English', 'Translated for analysis']],
  },
  [HER]: {
    field: 'cultural heritage and museum studies', problem: 'the work of keeping living traditions and collections meaningful to their communities', gap: 'thin documentation of how custodians and visitors interpret heritage together',
    approach: 'an ethnographic and archival study with community partners', setup: 'archives were reviewed, sites were visited over several months and custodians took part in recorded conversations',
    metric: 'visitor engagement score', unit: 'points', groups: ['Standard display', 'Guided tour', 'Community-led tour', 'Digital guide', 'Co-curated gallery'],
    keywords: ['cultural heritage', 'museum practice', 'oral history', 'community curation', 'archives'],
    refJournals: ['International Journal of Heritage Studies', 'Museum Management and Curatorship', 'Journal of Cultural Heritage', 'Museum & Society'],
    params: [['Method', 'Ethnography and archival review', 'Eight months in the field'], ['Interviews', '34 custodians and visitors', 'Semi-structured'], ['Sites', '5 museums and heritage sites', 'Regional focus'], ['Ethics', 'Community consent protocol', 'Shared with partners']],
  },
  [IND]: {
    field: 'creative industries and cultural economy', problem: 'the fragile networks of small studios, freelancers and cooperatives that sustain creative work', gap: 'sparse evidence on how creative enterprises outside large cities reach markets',
    approach: 'a mixed-methods sector study with a survey and in-depth case studies', setup: 'a sector survey was followed by case studies of eight enterprises, with interviews held at their workplaces',
    metric: 'monthly income index', unit: 'index', groups: ['Independent', 'Cooperative', 'Cluster member', 'Platform seller', 'Brand partner'],
    keywords: ['creative industries', 'cultural economy', 'craft clusters', 'creative labour', 'market access'],
    refJournals: ['International Journal of Cultural Policy', 'Poetics', 'Creative Industries Journal', 'Journal of Cultural Economics'],
    params: [['Survey', 'n = 312 enterprises', 'Stratified by sector'], ['Case studies', '8 enterprises', 'Interviews and site visits'], ['Period', '12 months', 'Two survey waves'], ['Analysis', 'Regression and coding', 'Triangulated']],
  },
  [DIG]: {
    field: 'digital creativity and interactive media', problem: 'the way new digital tools are changing how artists, designers and audiences create and share work', gap: 'few practice-led accounts of how creators actually use such tools',
    approach: 'a practice-led study with prototype building, creator interviews and audience testing', setup: 'creators built short projects with the tools over six weeks and audiences then tested the finished pieces',
    metric: 'audience engagement score', unit: 'points', groups: ['Manual workflow', 'Tool-assisted', 'Hybrid', 'Collaborative', 'Community remix'],
    keywords: ['digital creativity', 'interactive media', 'authorship', 'creative coding', 'generative tools'],
    refJournals: ['Digital Creativity', 'Convergence', 'Leonardo', 'International Journal of Human-Computer Studies'],
    params: [['Creators', '24 practitioners', 'Students and professionals'], ['Duration', '6 weeks', 'Weekly check-ins'], ['Audience test', 'n = 140', 'Online and in person'], ['Data', 'Logs, interviews, ratings', 'Stored with consent']],
  },
  [DEV]: {
    field: 'development communication and community studies', problem: 'the need to give communities a stronger voice in development work', gap: 'limited long-term evidence on arts-based and participatory methods outside pilot projects',
    approach: 'a participatory study using workshops, field observation and follow-up interviews', setup: 'workshops were co-facilitated with local organisations and participants were revisited three months later',
    metric: 'community participation score', unit: 'points', groups: ['Baseline', 'After workshop 1', 'After workshop 2', 'After workshop 3', 'Three-month follow-up'],
    keywords: ['development communication', 'participatory methods', 'arts-based research', 'community voice', 'social change'],
    refJournals: ['Community Development Journal', 'Development in Practice', 'Journal of Creative Communications', 'Action Research'],
    params: [['Sites', '6 villages and wards', 'Chosen with partners'], ['Participants', 'n = 214', 'Mixed age and gender'], ['Format', 'Three workshop cycles', 'Co-facilitated'], ['Follow-up', '3 months', 'Interviews and observation']],
  },
  [PER]: {
    field: 'performing arts and music studies', problem: 'the way shared practice, trust and embodied knowledge are passed between performers', gap: 'few close accounts of rehearsal and teaching in smaller performance traditions',
    approach: 'a performance ethnography with recorded rehearsals and interviews', setup: 'rehearsals and performances were filmed over several months and performers, teachers and audience members were interviewed afterwards',
    metric: 'ensemble cohesion rating', unit: 'points', groups: ['Early rehearsal', 'Mid rehearsal', 'Late rehearsal', 'Public performance', 'Season end'],
    keywords: ['performing arts', 'embodied knowledge', 'ethnomusicology', 'rehearsal practice', 'audience'],
    refJournals: ['Journal of Dance & Somatic Practices', 'Ethnomusicology Forum', 'Theatre Research International', 'Music Education Research'],
    params: [['Method', 'Performance ethnography', 'Filmed with consent'], ['Performers', '18 across 3 groups', 'Ages 19 to 64'], ['Observation', '60 rehearsal hours', 'Plus 9 performances'], ['Analysis', 'Video coding', 'Reviewed with performers']],
  },
}

export const KEYWORDS: string[] = [...new Set(Object.values(P).flatMap((p) => p.keywords))]

export const buildFull = createBuildFull(P, INSTITUTIONS, () => allArticles)
