// Discipline helpers: look up a discipline's colour and icon from the journal config, and show it as an icon tile.
import type { ComponentType } from 'react'
import { journal } from '../../../config/journals'
import type { Discipline } from '../../../config/journals'
import { Agriculture, Business, Computing, Engineering, Environment, Info, Life, Physical, Social, type IconProps } from '../icons'

const ICONS: Record<string, ComponentType<IconProps>> = {
  engineering: Engineering, computing: Computing, life: Life, environment: Environment,
  physical: Physical, social: Social, business: Business, agriculture: Agriculture,
}

export const disciplines: readonly Discipline[] = journal.disciplines ?? []
export const disciplineOf = (subject: string): Discipline | undefined => disciplines.find((d) => d.name === subject)
/** Colour strip for a subject; neutral when the subject is not a configured discipline. */
export const disciplineColor = (subject: string) => disciplineOf(subject)?.color ?? '#6B7280'

/** Rounded icon tile tinted with the discipline colour. */
export function DisciplineIcon({ discipline, size = 'md' }: { discipline: Discipline; size?: 'sm' | 'md' | 'lg' }) {
  const Icon = ICONS[discipline.icon] ?? Info
  const box = { sm: 'h-8 w-8', md: 'h-11 w-11', lg: 'h-14 w-14' }[size]
  const icon = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-7 w-7' }[size]
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-soft ${box}`} style={{ backgroundColor: `${discipline.color}1A`, color: discipline.color }}>
      <Icon className={icon} />
    </span>
  )
}
