// Journal 4 (IJECM) static pages: policies, for authors and about. Original text for this journal only.
// Facts mirror src/config/journals/j4.ts (ISSN, domain and contact details are "client to confirm" there).
import type { StaticPageData } from '../../../core/types'
import { authorsAbout } from './staticAuthorsAbout'
import { policiesOne } from './staticPolicies1'
import { policiesTwo } from './staticPolicies2'

export const staticPages: StaticPageData[] = [...policiesOne, ...policiesTwo, ...authorsAbout]
