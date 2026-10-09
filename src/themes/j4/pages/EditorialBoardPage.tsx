// Journal 4 editorial board: leadership summary above a filterable, sortable directory table (cards on phones).
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import type { EditorProfile } from '../../../core/types'
import { ButtonLink } from '../components/Button'
import { Directory } from '../components/board/Directory'
import { Leadership } from '../components/board/parts'
import { areas } from '../components/areas'
import { Container, Label } from '../components/primitives'
import { ArrowRight } from '../icons'

export function EditorialBoardPage({ editors }: { editors: EditorProfile[] }) {
  return (
    <>
      <header className="relative isolate bg-abyss-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_75%)]" />
        </div>
        <Container className="pb-10 pt-8 sm:pb-12 sm:pt-10">
          <nav aria-label="Breadcrumb"><ol className="flex gap-2 text-sm text-abyss-300"><li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li><li aria-hidden="true">/</li><li aria-current="page" className="font-medium text-white">Editorial Board</li></ol></nav>
          <Label className="mt-7 text-azure-300">{journal.shortName}</Label>
          <h1 className="mt-2 font-serif4 text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight">Editorial Board</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-abyss-200 sm:text-[1.0625rem]">The editors and reviewers who assess every submission across our nine research areas. {editors.length} members from {new Set(editors.map((e) => e.country)).size} countries.</p>
          <dl className="mt-7 grid max-w-2xl grid-cols-3 gap-3">
            {[['Members', editors.length], ['Countries', new Set(editors.map((e) => e.country)).size], ['Research areas', areas.length]].map(([k, v]) => (
              <div key={k} className="rounded-pane border border-white/15 bg-white/5 p-3"><dd className="font-serif4 text-2xl font-semibold tabular-nums text-white">{v}</dd><dt className="text-xs text-abyss-200">{k}</dt></div>
            ))}
          </dl>
        </Container>
      </header>
      <div className="bg-abyss-50"><Container className="py-10 sm:py-12">
        <Leadership editors={editors} />
        <Directory editors={editors} />
        <aside aria-labelledby="join-h" className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-pane border border-abyss-200 border-l-4 border-l-azure-600 bg-white p-5 shadow-hair sm:p-6">
          <div className="max-w-xl"><h2 id="join-h" className="font-serif4 text-xl font-semibold text-abyss-900">Join as a reviewer</h2><p className="mt-1 text-sm text-steel-600">Researchers and practising engineers with expertise in our research areas are invited to apply. Reviews are expected within 14 days.</p></div>
          <ButtonLink to={paths.forAuthors('become-a-reviewer')} variant="cta" className="min-h-[44px]">Apply to review <ArrowRight className="h-4 w-4" aria-hidden="true" /></ButtonLink>
        </aside>
      </Container></div>
    </>
  )
}
