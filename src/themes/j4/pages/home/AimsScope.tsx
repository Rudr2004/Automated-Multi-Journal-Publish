// Aims & Scope card: the journal mission, the research areas in two domain groups, and the standing editorial features. All text comes from the journal config.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { areas } from '../../components/areas'
import { AccountTree, Bolt, Insights, Manufacturing, Rule, Verified } from '../../components/refIconsJ4'
import { Box, SectionHead } from './parts'

export function AimsScope() {
  const split = Math.ceil(areas.length / 2)
  const groups = [
    { title: 'Core Engineering Domains', icon: Manufacturing, list: areas.slice(0, split) },
    { title: 'Management & Systems Science', icon: Insights, list: areas.slice(split) },
  ]
  return (
    <Box id="aims-scope" aria-labelledby="home-aims" className="p-5 md:p-6">
      <SectionHead id="home-aims" title="Aims & Scope" icon={<AccountTree className="h-6 w-6 text-azure-600" aria-hidden="true" />} text="Scholarly framework, research areas and editorial standards." tag="Editorial Mission" />
      <p className="mb-5 text-xs leading-relaxed text-slate-600 md:text-sm">{journal.mission.startsWith(journal.shortName) ? <>The <strong className="font-semibold text-slate-800">{journal.name} ({journal.shortName})</strong>{journal.mission.slice(journal.shortName.length).replace(/^ is /, ' is ')}</> : journal.mission}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {groups.map(({ title, icon: Icon, list }) => (
          <div key={title} className="rounded-[8px] border border-sky-100 bg-sky-50/50 p-4 transition-colors hover:bg-sky-50">
            <h3 className="mb-2 flex items-center gap-2 font-serif4 text-sm font-bold text-[#0b2545]"><Icon className="h-[18px] w-[18px] text-azure-600" aria-hidden="true" />{title}</h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {list.map((a) => (
                <li key={a.id}><AppLink to={paths.search(a.name)} className="flex items-start gap-1.5 hover:text-cobalt-700"><span aria-hidden="true" className="font-bold text-azure-600">•</span>{a.name}</AppLink></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5 font-medium text-slate-700">
          <li className="flex items-center gap-1"><Rule className="h-3.5 w-3.5 text-azure-600" aria-hidden="true" />Structured Peer Review</li>
          <li className="flex items-center gap-1"><Verified className="h-3.5 w-3.5 text-azure-600" aria-hidden="true" />Open Access, {journal.licence.name}</li>
          <li className="flex items-center gap-1"><Bolt className="h-3.5 w-3.5 text-azure-600" aria-hidden="true" />Permanent Crossref DOI</li>
        </ul>
        <AppLink to={paths.policy('author-guidelines')} className="flex items-center gap-1 text-xs font-semibold text-cobalt-700 hover:underline">Detailed Guidelines for Authors →</AppLink>
      </div>
    </Box>
  )
}
