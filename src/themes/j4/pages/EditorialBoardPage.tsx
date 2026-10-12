// Journal 4 editorial board: leadership summary above a filterable, sortable directory table (cards on phones).
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import type { EditorProfile } from '../../../core/types'
import { ButtonLink } from '../components/Button'
import { Directory } from '../components/board/Directory'
import { Leadership } from '../components/board/parts'
import { areas } from '../components/areas'
import { Container } from '../components/primitives'
import { PageHead } from '../components/static/PageHead'
import { ArrowRight } from '../icons'

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  return (
    <>
      <PageHead crumbs={[{ label: 'Editorial Board' }]} eyebrow={journal.shortName} title="Editorial Board"
        intro={`The editors and reviewers who assess every submission across our nine research areas. ${editors.length} members from ${new Set(editors.map((e) => e.country)).size} countries.`}>
        <dl className="mt-6 grid max-w-2xl grid-cols-3 gap-3">
          {[['Members', editors.length], ['Countries', new Set(editors.map((e) => e.country)).size], ['Research areas', areas.length]].map(([k, v]) => (
            <div key={k} className="rounded-ctl border border-abyss-200 bg-abyss-50 p-3"><dd className="font-serif4 text-2xl font-semibold tabular-nums text-[#0b2545]">{v}</dd><dt className="text-xs text-steel-700">{k}</dt></div>
          ))}
        </dl>
      </PageHead>
      <div className="bg-abyss-50"><Container className="py-6 sm:py-8">
        <Leadership editors={editors} />
        <Directory editors={editors} />
        <aside aria-labelledby="join-h" className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-pane border border-abyss-200 border-l-4 border-l-azure-600 bg-white p-5 shadow-hair sm:p-6">
          <div className="max-w-xl"><h2 id="join-h" className="font-serif4 text-xl font-semibold text-[#0b2545]">Join as a reviewer</h2><p className="mt-1 text-sm text-steel-600">Researchers and practising engineers with expertise in our research areas are invited to apply. Reviews are expected within 14 days.</p></div>
          <ButtonLink to={paths.forAuthors('become-a-reviewer')} variant="cta" className="min-h-[44px]">Apply to review <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
        </aside>
      </Container></div>
    </>
  )
}
