// IJFRD static-page builders. Facts mirror src/config/journals/j5.ts; memberships and listings the journal does not hold are never claimed.
import type { StaticBlock, StaticPageData, StaticSection } from '../../../core/types'

export const UPDATED = '2026-10-01'
export const NAME = 'International Journal of Fundamental Research and Development (IJFRD)'

type Make = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], extra?: Partial<StaticPageData>) => StaticPageData
const make = (group: StaticPageData['group']): Make => (slug, title, intro, sections, related, extra = {}) =>
  ({ slug, group, title, intro, sections, updated: UPDATED, related, ...extra })

/** Policy page. */
export const P = make('policies')
/** For-authors page; the last argument is the list of rich blocks. */
export const A = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], blocks?: StaticBlock[]) =>
  make('for-authors')(slug, title, intro, sections, related, { blocks })
/** About page. */
export const B = (slug: string, title: string, intro: string, sections: StaticSection[], related: string[], blocks?: StaticBlock[]) =>
  make('about')(slug, title, intro, sections, related, { blocks })
