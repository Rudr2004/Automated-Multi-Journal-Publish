// Turns compact editor seeds into full profiles (bio, ORCID and profile links) for the editorial board.
import type { EditorProfile, EditorRole } from '../../core/types'
import { portraitFor } from './portraits'

export type EditorSeed = [name: string, role: EditorRole, designation: string, institution: string, country: string, areas: string[]]

const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')

export const buildEditors = (seeds: EditorSeed[]): EditorProfile[] => seeds.map(([name, role, designation, institution, country, areas], i) => {
  const first = areas[0].toLowerCase()
  const short = `${name.split(' ').slice(0, 2).join(' ')} works on ${first} and related topics at ${institution}, ${country}.`
  return {
    id: slug(name), name, photo: portraitFor(name), role, designation, institution, country, areas,
    shortBio: short,
    fullBio: `${short} Over the past decade they have published widely on ${areas.join(', ').toLowerCase()}, supervised graduate researchers and served on programme committees and review panels. As ${role === 'Editor-in-Chief' ? 'Editor-in-Chief' : `a member of the ${role.toLowerCase()}`}, they help ensure that manuscripts receive fair, rigorous and timely peer review.`,
    links: {
      orcid: `0000-0002-${1000 + i * 37}-${2000 + i * 53}`,
      scholar: 'https://scholar.google.com/',
      ...(i % 2 === 0 ? { scopus: 'https://www.scopus.com/' } : {}),
      ...(i % 3 === 0 ? { wos: 'https://www.webofscience.com/' } : {}),
    },
  }
})
