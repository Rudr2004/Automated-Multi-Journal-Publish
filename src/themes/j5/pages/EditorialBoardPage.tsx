// Journal 5 editorial board: leadership summary above a filterable, sortable directory table (cards on phones).
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import type { EditorProfile } from '../../../core/types'
import { ButtonLink } from '../components/Button'
import { Directory } from '../components/board/Directory'
import { Leadership } from '../components/board/parts'
import { areas } from '../components/areas'
import { ClassicHeader } from '../components/ClassicHeader'
import { Container } from '../components/primitives'
import { Kicker, OrnamentRule } from '../components/signature'
import { ArrowRight } from '../icons'

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  const countries = new Set(editors.map((e) => e.country)).size
  return (
    <>
      <ClassicHeader crumbs={[{ label: 'Editorial Board' }]} kicker={`${journal.shortName} · Editorial Board`} title="Editorial Board"
        intro={`The editors and reviewers who assess every submission across our nine research areas. ${editors.length} members from ${countries} countries.`}>
        <dl className="mt-7 grid max-w-2xl grid-cols-3 gap-3">
          {[['Members', editors.length], ['Countries', countries], ['Research areas', areas.length]].map(([k, v]) => (
            <div key={k} className="rounded border border-ochre-300/30 bg-white/5 p-3"><dd className="font-newsreader text-2xl font-semibold tabular-nums text-ochre-300">{v}</dd><dt className="text-xs text-wine-200">{k}</dt></div>
          ))}
        </dl>
      </ClassicHeader>
      <div className="bg-[#FBF8F4]"><Container className="py-10 sm:py-12">
        <Leadership editors={editors} />
        <Directory editors={editors} />
        <OrnamentRule className="mt-12" />
        <aside aria-labelledby="join-h" className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded border border-[#E6DCD0] border-l-4 border-l-ochre-700 bg-white p-5 sm:p-6">
          <div className="max-w-xl"><Kicker>Reviewers</Kicker><h2 id="join-h" className="mt-1 font-newsreader text-xl font-semibold text-obsidian-900">Join as a reviewer</h2><p className="mt-1 font-serif4 text-base text-obsidian-700">Researchers and practising specialists with expertise in our research areas are invited to apply. Reviews are expected within 14 days.</p></div>
          <ButtonLink to={paths.forAuthors('become-a-reviewer')} variant="cta" className="min-h-[44px]">Apply to review <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
        </aside>
      </Container></div>
    </>
  )
}
