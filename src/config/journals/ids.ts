// Which journal is active.
// - VITE_JOURNAL=j1 | j2 | j3 builds a single-journal site (production, one domain per journal).
// - Left unset (plain `npm run dev`), both journals are bundled and the URL decides: /jimrt is Journal 2, /ijcsd is Journal 3, anything else Journal 1.
// No imports from other config files on purpose, so routes.ts can read the slug without creating an import cycle.
import type { JournalId } from './types'

export const SLUGS: Record<JournalId, string> = { j1: 'ijmat', j2: 'jimrt', j3: 'ijcsd' }

const fromEnv = import.meta.env.VITE_JOURNAL
const fromPath: JournalId =
  typeof window === 'undefined' ? 'j1' : window.location.pathname.startsWith(`/${SLUGS.j3}`) ? 'j3' : window.location.pathname.startsWith(`/${SLUGS.j2}`) ? 'j2' : 'j1'

export const activeJournalId: JournalId = fromEnv === 'j1' || fromEnv === 'j2' || fromEnv === 'j3' ? fromEnv : fromPath
export const activeSlug = SLUGS[activeJournalId]
/** True when one build contains every journal. */
export const combinedBuild = fromEnv !== 'j1' && fromEnv !== 'j2' && fromEnv !== 'j3'
