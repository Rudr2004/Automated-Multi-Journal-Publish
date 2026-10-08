// Theme ("collection") helpers: look up a theme's colour from the journal config.
import { journal } from '../../../config/journals'
import type { Discipline } from '../../../config/journals'

export const themes: readonly Discipline[] = journal.disciplines ?? []
export const themeOf = (subject: string): Discipline | undefined => themes.find((d) => d.name === subject)
export const themeColor = (subject: string) => themeOf(subject)?.color ?? '#3A3350'
