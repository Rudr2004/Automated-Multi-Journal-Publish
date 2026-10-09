// Aims & Scope: the journal's mission with area chips, beside an illustration of the nine fundamental disciplines orbiting the journal.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { areaSymbol, areas } from '../../components/areas'
import { ArrowRight } from '../../icons'
import { Logo } from '../../layouts/Header'
import { HomeSection } from './HomeHead'

function Orbit() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[26rem]">
      <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none" stroke="#701A1E">
        <circle cx="50" cy="50" r="40" strokeOpacity=".3" strokeDasharray="1 2" strokeWidth=".4" />
        <circle cx="50" cy="50" r="27" strokeOpacity=".18" strokeWidth=".4" />
        <ellipse cx="50" cy="50" rx="44" ry="15" strokeOpacity=".22" strokeWidth=".4" transform="rotate(-30 50 50)" />
        <ellipse cx="50" cy="50" rx="44" ry="15" strokeOpacity=".22" strokeWidth=".4" transform="rotate(30 50 50)" />
      </svg>
      <Logo size={72} tile className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-wine-800/30" />
      {areas.map((a, i) => {
        const ang = (i / areas.length) * 2 * Math.PI - Math.PI / 2
        return (
          <AppLink key={a.id} to={paths.search(a.name)} aria-label={a.name}
            style={{ left: `${50 + 40 * Math.cos(ang)}%`, top: `${50 + 40 * Math.sin(ang)}%`, borderColor: a.color, color: a.color }}
            className="absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-white font-newsreader text-base font-semibold transition-transform duration-150 hover:scale-110 motion-reduce:transition-none sm:h-11 sm:w-11">
            {areaSymbol(a)}
          </AppLink>
        )
      })}
    </div>
  )
}

export function AimsScope() {
  return (
    <HomeSection id="aims-title" label="Aims & Scope" title="Fundamental questions, and the development that follows" bg="bg-[#FBF8F4]"
      action={<AppLink to={paths.about('aims-scope')} className="inline-flex items-center gap-1 text-sm font-semibold text-wine-800 hover:underline">Read the full scope <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>}>
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_26rem]">
        <div>
          <p className="font-serif4 text-[1.0625rem] leading-relaxed text-obsidian-700">{journal.mission}</p>
          <p className="mt-3 font-serif4 text-[1.0625rem] leading-relaxed text-obsidian-700">The journal welcomes work in any of nine areas, and work that crosses between them.</p>
          <ul aria-label="Research areas in scope" className="mt-6 flex flex-wrap gap-2">
            {areas.map((a) => (
              <li key={a.id}>
                <AppLink to={paths.search(a.name)} className="inline-flex items-center gap-2 rounded-sm border border-wine-800/20 bg-white py-1 pl-1 pr-3 text-sm font-medium text-obsidian-800 transition-colors duration-150 hover:border-wine-800 hover:text-wine-800">
                  <span aria-hidden="true" className="inline-flex h-7 min-w-7 items-center justify-center rounded-sm px-1 font-newsreader text-sm font-semibold text-white" style={{ backgroundColor: a.color }}>{areaSymbol(a)}</span>{a.name}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
        <Orbit />
      </div>
    </HomeSection>
  )
}
