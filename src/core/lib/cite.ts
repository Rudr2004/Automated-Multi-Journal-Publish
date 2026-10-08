import type { ArticleFull } from '../types'
import { doiFor, journal } from '../../config/journals'

export type CitationStyle = 'apa' | 'mla' | 'chicago' | 'harvard' | 'ieee' | 'bibtex' | 'ris'
export const CITATION_STYLES: { id: CitationStyle; label: string }[] = [
  { id: 'apa', label: 'APA' }, { id: 'mla', label: 'MLA' }, { id: 'chicago', label: 'Chicago' },
  { id: 'harvard', label: 'Harvard' }, { id: 'bibtex', label: 'BibTeX' }, { id: 'ris', label: 'RIS' },
]
/** The same list with IEEE added, for themes that offer it. */
export const CITATION_STYLES_WITH_IEEE: { id: CitationStyle; label: string }[] = [
  ...CITATION_STYLES.slice(0, 4), { id: 'ieee', label: 'IEEE' }, ...CITATION_STYLES.slice(4),
]

const year = (a: ArticleFull) => a.publishedOnline.slice(0, 4)
const split = (name: string) => { const p = name.trim().split(/\s+/); return { last: p[p.length - 1], first: p.slice(0, -1) } }
const initials = (first: string[]) => first.map((f) => `${f[0]}.`).join(' ')
const doiUrl = (a: ArticleFull) => `https://doi.org/${doiFor(a.paperId)}`

const apaNames = (names: string[]) => {
  const f = names.map((n) => { const s = split(n); return `${s.last}, ${initials(s.first)}` })
  return f.length === 1 ? f[0] : `${f.slice(0, -1).join(', ')}, & ${f[f.length - 1]}`
}

export function formatCitation(a: ArticleFull, style: CitationStyle): string {
  const j = journal.name
  switch (style) {
    case 'apa':
      return `${apaNames(a.authors)} (${year(a)}). ${a.title}. ${j}, ${a.volume}(${a.issue}), ${a.pages}. ${doiUrl(a)}`
    case 'harvard':
      return `${apaNames(a.authors).replace(/, &/, ' and')} (${year(a)}) '${a.title}', ${j}, ${a.volume}(${a.issue}), pp. ${a.pages}. doi:${doiFor(a.paperId)}.`
    case 'ieee': {
      const names = a.authors.map((n) => { const s = split(n); return `${initials(s.first)} ${s.last}` })
      const list = names.length > 2 ? `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}` : names.join(' and ')
      return `${list}, “${a.title},” ${j}, vol. ${a.volume}, no. ${a.issue}, pp. ${a.pages}, ${year(a)}, doi: ${doiFor(a.paperId)}.`
    }
    case 'mla': {
      const s0 = split(a.authors[0])
      const lead = a.authors.length > 2 ? `${s0.last}, ${s0.first.join(' ')}, et al.` : a.authors.length === 2 ? `${s0.last}, ${s0.first.join(' ')}, and ${a.authors[1]}.` : `${s0.last}, ${s0.first.join(' ')}.`
      return `${lead} “${a.title}.” ${j}, vol. ${a.volume}, no. ${a.issue}, ${year(a)}, pp. ${a.pages}, ${doiUrl(a)}.`
    }
    case 'chicago': {
      const s0 = split(a.authors[0])
      const rest = a.authors.slice(1)
      const lead = [`${s0.last}, ${s0.first.join(' ')}`, ...rest].join(', ').replace(/, ([^,]+)$/, rest.length ? ', and $1' : ', $1')
      return `${lead}. “${a.title}.” ${j} ${a.volume}, no. ${a.issue} (${year(a)}): ${a.pages}. ${doiUrl(a)}.`
    }
    case 'bibtex': {
      const key = `${split(a.authors[0]).last.toLowerCase()}${year(a)}${a.paperId.slice(-3)}`
      return `@article{${key},\n  title   = {${a.title}},\n  author  = {${a.authors.map((n) => { const s = split(n); return `${s.last}, ${s.first.join(' ')}` }).join(' and ')}},\n  journal = {${j}},\n  year    = {${year(a)}},\n  volume  = {${a.volume}},\n  number  = {${a.issue}},\n  pages   = {${a.pages.replace('–', '--')}},\n  issn    = {${journal.issnOnline}},\n  doi     = {${doiFor(a.paperId)}}\n}`
    }
    case 'ris': {
      const [sp, ep] = a.pages.split('–')
      return ['TY  - JOUR', ...a.authors.map((n) => { const s = split(n); return `AU  - ${s.last}, ${s.first.join(' ')}` }), `TI  - ${a.title}`, `JO  - ${j}`, `PY  - ${year(a)}`, `VL  - ${a.volume}`, `IS  - ${a.issue}`, `SP  - ${sp}`, `EP  - ${ep ?? sp}`, `SN  - ${journal.issnOnline}`, `DO  - ${doiFor(a.paperId)}`, `UR  - ${doiUrl(a)}`, 'ER  - '].join('\n')
    }
  }
}

export const citationFilename = (a: ArticleFull, style: CitationStyle) => `${a.paperId}.${style === 'ris' ? 'ris' : style === 'bibtex' ? 'bib' : 'txt'}`
