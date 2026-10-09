// Research-area helpers: colour, icon and a one-line description for each area in the journal config (ids: physics ... development).
import type { ComponentType } from 'react'
import { journal } from '../../../config/journals'
import type { Discipline } from '../../../config/journals'
import { Chemistry, Computational, Development, Earth, EngineeringFundamentals, Life, Materials, Maths, Physics, type IconProps } from '../icons'

export const areas: readonly Discipline[] = journal.disciplines ?? []
export const areaOf = (subject: string): Discipline | undefined => areas.find((a) => a.name === subject)
export const areaColor = (subject: string) => areaOf(subject)?.color ?? '#475569'

export const AREA_ICONS: Record<string, ComponentType<IconProps>> = {
  physics: Physics, chemistry: Chemistry, materials: Materials, life: Life, earth: Earth,
  math: Maths, computational: Computational, engineering: EngineeringFundamentals, development: Development,
}

/** One line about each area, shown in the Research Areas menu and matrix. */
export const AREA_BLURB: Record<string, string> = {
  physics: 'Quantum, condensed matter, optics, astrophysics and cosmology.',
  chemistry: 'Synthesis, catalysis, analytical, physical and theoretical chemistry.',
  materials: 'Nanomaterials, thin films, polymers, composites and characterisation.',
  life: 'Molecular and cell biology, genomics, biotechnology and biomedicine.',
  earth: 'Climate, geoscience, hydrology, ecology and environmental systems.',
  math: 'Pure and applied mathematics, probability, statistics and modelling.',
  computational: 'Simulation, machine learning, scientific computing and data science.',
  engineering: 'Mechanics, thermal and electrical fundamentals, control and design.',
  development: 'Translating research into technology, policy and sustainable development.',
}

/** Two-letter element-style symbols, unique across the nine areas (the generic symbolOf collides for Materials and Mathematics). */
const SYMBOLS: Record<string, string> = { physics: 'Ph', chemistry: 'Ch', materials: 'Ma', life: 'Li', earth: 'Ea', math: 'Mt', computational: 'Cs', engineering: 'En', development: 'De' }
export const areaSymbol = (a: Discipline) => SYMBOLS[a.id] ?? a.name.slice(0, 2)
