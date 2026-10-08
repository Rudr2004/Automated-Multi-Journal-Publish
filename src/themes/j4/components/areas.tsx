// Research-area helpers: colour, icon and a one-line description for each area in the journal config.
import type { ComponentType } from 'react'
import { journal } from '../../../config/journals'
import type { Discipline } from '../../../config/journals'
import { Civil, Computing, Electrical, Electronics, Industrial, Infrastructure, Mechanical, Operations, Project, type IconProps } from '../icons'

export const areas: readonly Discipline[] = journal.disciplines ?? []
export const areaOf = (subject: string): Discipline | undefined => areas.find((a) => a.name === subject)
export const areaColor = (subject: string) => areaOf(subject)?.color ?? '#475569'

export const AREA_ICONS: Record<string, ComponentType<IconProps>> = {
  civil: Civil, mechanical: Mechanical, electrical: Electrical, electronics: Electronics, computing: Computing,
  industrial: Industrial, operations: Operations, project: Project, infrastructure: Infrastructure,
}

/** One line about each area, shown in the Research Areas menu and matrix. */
export const AREA_BLURB: Record<string, string> = {
  civil: 'Structures, materials, geotechnics and structural health monitoring.',
  mechanical: 'Design, thermal systems, machining and manufacturing processes.',
  electrical: 'Power systems, microgrids, machines and energy conversion.',
  electronics: 'Sensors, embedded hardware, signal processing and circuits.',
  computing: 'Control, automation, industrial software and data-driven engineering.',
  industrial: 'Lean, quality, reliability, ergonomics and systems modelling.',
  operations: 'Logistics, scheduling, inventory and supply-chain optimisation.',
  project: 'Planning, risk, cost control and engineering leadership.',
  infrastructure: 'Smart cities, sustainable construction and resilient networks.',
}
