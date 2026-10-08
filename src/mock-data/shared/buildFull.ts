// Builds full-text article detail (authors, sections, table, figure, references) deterministically from a summary.
// Shared by every journal: each journal supplies its own subject profiles, institutions and article list.
import type { ArticleFull, ArticleSection, ArticleSummary, AuthorDetail, Reference } from '../../core/types'
import { orcidFor } from './identity'
import { portraitFor } from './portraits'
import { rnd } from './rnd'

const addDays = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

export interface Profile {
  field: string; problem: string; gap: string; approach: string; setup: string; metric: string; unit: string
  groups: string[]; keywords: string[]; refJournals: string[]; params: [string, string, string][]
}
const LAST = ['Sharma', 'Patel', 'Nair', 'Kumar', 'Hoffmann', 'Okafor', 'Lindqvist', 'Tan', 'Rao', 'Clarke', 'Verma', 'Petrova', 'Singh', 'Ali', 'Meyer']

function makeReferences(p: Profile, seed: number): Reference[] {
  return Array.from({ length: 12 }, (_, i) => {
    const s = seed * 31 + i * 7
    const year = 2012 + Math.floor(rnd(s) * 14)
    const a1 = LAST[Math.floor(rnd(s + 1) * LAST.length)], a2 = LAST[Math.floor(rnd(s + 2) * LAST.length)]
    const topic = p.keywords[i % p.keywords.length]
    const journal = p.refJournals[i % p.refJournals.length]
    const vol = 10 + Math.floor(rnd(s + 3) * 40)
    const first = 100 + Math.floor(rnd(s + 4) * 800)
    return {
      text: `${a1}, ${String.fromCharCode(65 + (s % 26))}., & ${a2}, ${String.fromCharCode(65 + ((s + 5) % 26))}. (${year}). Advances in ${topic}: a critical analysis. ${journal}, ${vol}, ${first}–${first + 12}.`,
      doi: i === 11 ? undefined : `10.1234/ref.${year}.${first}${vol}`,
    }
  })
}

/** Returns a `buildFull` bound to one journal's subject profiles, institutions and article list. */
export function createBuildFull(profiles: Record<string, Profile>, institutions: string[], getAll: () => ArticleSummary[]) {
  return function buildFull(a: ArticleSummary): ArticleFull {
    const p = profiles[a.subject]
    const seed = a.paperId.split('').reduce((n, c) => n + c.charCodeAt(0), 0)
    const issueDate = a.publishedAt
    const backdated = seed % 5 === 0
    const publishedOnline = backdated ? addDays(issueDate, 4 + (seed % 12)) : issueDate
    const accepted = addDays(publishedOnline, -(10 + (seed % 9)))
    const received = addDays(accepted, -(28 + (seed % 25)))

    const affCount = Math.min(a.authors.length, 2 + (seed % 2))
    const affiliations = Array.from({ length: affCount }, (_, i) => institutions[(seed + i * 3) % institutions.length])
    const authorDetails: AuthorDetail[] = a.authors.map((name, i) => ({
      name,
      photo: portraitFor(name),
      affiliations: i === a.authors.length - 1 && a.authors.length > 2 && affCount > 1 ? [1, 2] : [(i % affCount) + 1],
      corresponding: i === 0,
      email: i === 0 ? `${name.toLowerCase().replace(/[^a-z]+/g, '.')}@example.edu` : undefined,
      orcid: orcidFor(name),
    }))

    const vals = p.groups.map((_, i) => Math.round((40 + rnd(seed + i) * 40 + i * 6) * 10) / 10)
    const t = a.title.charAt(0).toLowerCase() + a.title.slice(1)
    const sections: ArticleSection[] = [
      {
        id: 'introduction', title: 'Introduction',
        paragraphs: [
          `Progress in ${p.field} is increasingly shaped by ${p.problem}. Across the literature, researchers have reported encouraging results, yet comparisons between studies are difficult because protocols, datasets and reporting conventions differ considerably [1,2].`,
          `A recurring limitation is ${p.gap} [3,4]. Without such evidence, decision-makers and practitioners must extrapolate from narrowly defined settings, which risks over- or under-estimating the real-world value of promising approaches [5].`,
          `This article addresses that gap. Specifically, we examine ${t} using ${p.approach}. Our objectives are to quantify ${p.metric} under clearly specified conditions, to test the robustness of the findings, and to provide data and methods that others can reuse.`,
        ],
      },
      {
        id: 'methods', title: 'Methods',
        paragraphs: [
          `We used ${p.approach}. ${p.setup.charAt(0).toUpperCase() + p.setup.slice(1)}. All procedures followed the relevant institutional guidelines and are described in sufficient detail to be repeated [6].`,
          `The primary outcome was ${p.metric} (${p.unit}). Secondary outcomes and sensitivity analyses were specified before data collection. Table 1 summarises the key parameters; values were selected following earlier work [7,8] and refined in a pilot phase.`,
        ],
        table: { caption: 'Table 1. Key study parameters and settings.', head: ['Parameter', 'Setting', 'Notes'], rows: p.params.map((r) => [...r]) },
      },
      {
        id: 'results', title: 'Results',
        paragraphs: [
          `Table 2 and Figure 1 present the main findings. The ${p.metric} differed across conditions, with the highest value observed for “${p.groups[4]}” (${vals[4]} ${p.unit}) and the lowest for “${p.groups[0]}” (${vals[0]} ${p.unit}). The pattern was consistent across replicates and remained after adjusting for the pre-specified covariates.`,
          `Sensitivity analyses led to the same conclusions: excluding the two most extreme observations changed the pooled estimates by less than 3%, and the ranking of conditions was unchanged. No unexpected adverse events or data-quality issues were recorded during the study.`,
        ],
        table: {
          caption: `Table 2. ${p.metric.charAt(0).toUpperCase() + p.metric.slice(1)} by condition (mean ± SD, 95% confidence interval).`,
          head: ['Condition', `Mean (${p.unit})`, 'SD', '95% CI', 'p vs. first'],
          rows: p.groups.map((g, i) => [g, String(vals[i]), (1.2 + rnd(seed + i + 9) * 2.4).toFixed(1), `${(vals[i] - 2.1).toFixed(1)}–${(vals[i] + 2.1).toFixed(1)}`, i === 0 ? '—' : i < 2 ? '0.041' : '< 0.001']),
        },
        figure: {
          caption: `Figure 1. ${p.metric.charAt(0).toUpperCase() + p.metric.slice(1)} (${p.unit}) for each condition. Bars show group means.`,
          xLabel: 'Condition', yLabel: `${p.metric} (${p.unit})`, labels: p.groups, values: vals,
        },
      },
      {
        id: 'discussion', title: 'Discussion',
        paragraphs: [
          `Our results indicate that ${p.approach} can deliver measurable gains in ${p.metric}, in line with several earlier reports [2,5,9] while offering a more complete account of variability. The effect sizes we observed are practically meaningful, not merely statistically significant.`,
          `Several limitations should be noted. The study was conducted in a defined context, and generalisation to other settings should be made cautiously. In addition, longer follow-up would help establish durability. Future work should test the approach at larger scale and across more diverse conditions [10–12].`,
        ],
      },
      {
        id: 'conclusion', title: 'Conclusion',
        paragraphs: [
          `This study provides clear, reproducible evidence on ${t}. By reporting methods, parameters and uncertainty transparently, we hope to support wider adoption and more rigorous comparison in ${p.field}. The data supporting these findings are available from the corresponding author on reasonable request.`,
        ],
      },
    ]

    const keywords = p.keywords.slice(0, 4 + (seed % 2))
    const related = getAll().filter((x) => x.subject === a.subject && x.paperId !== a.paperId).sort((x, y) => y.views - x.views).slice(0, 3)

    return { ...a, received, accepted, publishedOnline, authorDetails, affiliations, keywords, sections, references: makeReferences(p, seed), related }
  }
}
