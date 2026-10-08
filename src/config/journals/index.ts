// The active journal for this build (VITE_JOURNAL). Shared code (core/*, routes) reads the journal from here, never from j1/j2 directly.
import { journal as j1 } from './j1'
import { journal as j2 } from './j2'
import { journal as j3 } from './j3'
import { activeJournalId } from './ids'
import type { IndexLogo, JournalConfig } from './types'

export type { JournalConfig, JournalId, IndexLogo, TrustItem, Discipline } from './types'
export { activeJournalId, activeSlug, SLUGS } from './ids'

export const journal: JournalConfig = activeJournalId === 'j3' ? j3 : activeJournalId === 'j2' ? j2 : j1

/** DOI format is always {prefix}/{Paper ID}. */
export const doiFor = (paperId: string) => `${journal.doiPrefix}/${paperId}`

/** Logos that the client has switched on. */
export const visibleLogos = (): IndexLogo[] => journal.logos.filter((l) => l.show)

/** Public URL of a logo file (respects a sub-folder deployment). */
export const logoSrc = (file: string) => `${import.meta.env.BASE_URL}shared/indexing/${file}`
