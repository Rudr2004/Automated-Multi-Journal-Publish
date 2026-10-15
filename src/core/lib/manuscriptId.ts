// How a journal writes the ID of a submitted paper. A journal that sets `manuscriptId` in its config (J1: "ijmat.v1i1.001", i.e.
// journal code, volume, issue, running number) calls it a "Manuscript ID" and uses lower-case dotted IDs; every other journal keeps
// "Paper ID" with IDs such as IJMAT2026000123. All input boxes, validation and look-ups go through here, so the two formats never mix.
import { journal } from '../../config/journals'

const format = journal.manuscriptId

export const idLabel = format ? 'Manuscript ID' : 'Paper ID'
export const idExample = format?.example ?? `${journal.paperIdPrefix}2026000123`
export const idMaxLength = format ? 24 : 15

/** One-line description of the ID format for error messages. */
export const idHint = format ? `${idExample} (journal code, volume, issue and a running number)` : `${idExample} (letters followed by 10 digits)`

/** Letter case of IDs (no other change): used where text is compared with stored IDs. */
export const caseId = (raw: string): string => (format ? raw.toLowerCase() : raw.toUpperCase())

/** Keeps only the characters an ID can contain, in the journal's letter case (for typing and for look-ups). */
export const normalizeId = (raw: string): string =>
  format ? raw.toLowerCase().replace(/[^a-z0-9.]/g, '') : raw.toUpperCase().replace(/[^A-Z0-9]/g, '')

/** Source of a pattern that matches one ID of ANY journal (used to tell "wrong journal" apart from "mistyped"). */
const ANY_ID = format ? '^([a-z]{2,6})\\.v\\d{1,3}i\\d{1,3}\\.\\d{3,5}$' : '^([A-Z]{2,5})\\d{10}$'
const OWN_BODY = format ? `${journal.paperIdPrefix.toLowerCase()}\\.v\\d{1,3}i\\d{1,3}\\.\\d{3,5}` : `${journal.paperIdPrefix}\\d{10}`
const OWN_ID = `^${OWN_BODY}$`

/** True when the text is shaped like an ID of any journal in this family. */
export const looksLikeId = (id: string): boolean => new RegExp(ANY_ID).test(id)
/** True when the ID belongs to the journal this site is running. */
export const isOwnId = (id: string): boolean => new RegExp(OWN_ID).test(id)
/** The journal code of an ID (upper case), or null when the text is not shaped like an ID. */
export const idJournalCode = (id: string): string | null => new RegExp(ANY_ID).exec(id)?.[1]?.toUpperCase() ?? null

/** Pattern (source) for the ID inside a certificate number such as IJMAT-CERT-<ID>-A2. */
export const certificatePattern = (): RegExp => new RegExp(`^${journal.paperIdPrefix}-CERT-(${OWN_BODY})(?:-A(\\d))?$`, 'i')

/** ID for a new submission, e.g. ijmat.v1i1.301 (J1) or IJMAT2026000301. */
export const newManuscriptId = (sequence: number): string =>
  format ? `${journal.paperIdPrefix.toLowerCase()}.v1i1.${String(sequence).padStart(3, '0')}` : `${journal.paperIdPrefix}2026${String(sequence).padStart(6, '0')}`
