// Research areas as a periodic-table board: nine ElementTile cells (atomic number, symbol, name) with the article count in this issue, each linking to a search by area.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { AREA_BLURB, areaSymbol, areas } from '../../components/areas'
import { ElementTile } from '../../components/signature'
import { ArrowRight } from '../../icons'
import { HomeSection } from './HomeHead'

export function ResearchAreas({ articles }: { articles: ArticleSummary[] }) {
  return (
    <HomeSection id="areas-title" label="Research areas" title="Nine areas, one rigorous standard" text="Browse published work by research area, arranged like the elements. Papers that cross areas are welcome.">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {areas.map((a, i) => {
          const n = articles.filter((x) => x.subject === a.name).length
          return (
            <li key={a.id} className={i === areas.length - 1 ? 'col-span-2 sm:col-span-1' : ''}>
              <AppLink to={paths.search(a.name)} className="group block h-full transition duration-150 hover:-translate-y-px motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                <ElementTile number={i + 1} name={a.name} symbol={areaSymbol(a)} color={a.color} className="p-4 group-hover:border-wine-800 sm:p-5"
                  meta={<>
                    <span className="mt-0.5 block font-serif4 text-[14px] leading-relaxed text-obsidian-600">{AREA_BLURB[a.id]}</span>
                    <span className="mt-3 flex items-center justify-between gap-2 border-t border-wine-800/10 pt-2 font-semibold tabular-nums text-obsidian-800">
                      <span>{n} {n === 1 ? 'article' : 'articles'} in this issue</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-wine-800 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                    </span>
                  </>} />
              </AppLink>
            </li>
          )
        })}
      </ul>
    </HomeSection>
  )
}
