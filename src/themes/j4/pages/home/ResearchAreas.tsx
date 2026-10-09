// Research areas: a 3 x 3 matrix of the engineering areas, each with a short description and the number of articles in this issue.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { AREA_BLURB, AREA_ICONS, areas } from '../../components/areas'
import { Container, SectionHead } from '../../components/primitives'
import { ArrowRight } from '../../icons'

export function ResearchAreas({ articles }: { articles: ArticleSummary[] }) {
  return (
    <section aria-labelledby="areas-title" className="py-12 sm:py-16">
      <Container>
        <SectionHead id="areas-title" label="Research areas" title="Nine areas, one rigorous standard" text="Browse published work by engineering area. Papers that cross areas are welcome." />
        <ul className="grid gap-px overflow-hidden rounded-pane border border-abyss-200 bg-abyss-200 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => {
            const Icon = AREA_ICONS[a.id]
            const n = articles.filter((x) => x.subject === a.name).length
            return (
              <li key={a.id} className="bg-white">
                <AppLink to={paths.search(a.name)} className="group flex h-full flex-col p-5 transition-colors hover:bg-azure-50 sm:p-6">
                  <span className="flex items-center justify-between">
                    <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-ctl" style={{ backgroundColor: `${a.color}18`, color: a.color }}>{Icon && <Icon className="h-5 w-5" />}</span>
                    <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-steel-400">{String(i + 1).padStart(2, '0')}</span>
                  </span>
                  <span className="mt-4 font-serif4 text-xl font-semibold leading-snug text-abyss-900 group-hover:text-cobalt-700">{a.name}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-steel-600">{AREA_BLURB[a.id]}</span>
                  <span className="mt-auto flex items-center justify-between pt-5 text-sm">
                    <span className="font-medium tabular-nums text-abyss-800">{n} {n === 1 ? 'article' : 'articles'} in this issue</span>
                    <ArrowRight className="h-4 w-4 text-cobalt-700 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                  </span>
                </AppLink>
              </li>
            )
          })}
        </ul>
      </Container>
    </section>
  )
}
