// Editorial board highlights: the leadership team in a row, linking to the full directory.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { EditorProfile } from '../../../../core/types'
import { AuthorAvatarJ4 } from '../../components/AuthorChipJ4'
import { Container, SectionHead } from '../../components/primitives'
import { ArrowRight } from '../../icons'

export function BoardRow({ editors }: { editors: EditorProfile[] }) {
  if (!editors.length) return null
  return (
    <section aria-labelledby="board-title" className="border-t border-abyss-200 pb-12 pt-12 sm:pb-16 sm:pt-16">
      <Container>
        <SectionHead id="board-title" label="Editorial board" title="Led by working engineers and researchers"
          action={<AppLink to={paths.editorialBoard} className="inline-flex items-center gap-1 text-sm font-semibold text-cobalt-700 hover:underline">Full board directory <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {editors.slice(0, 6).map((e) => (
            <li key={e.id} className="flex items-start gap-4 rounded-pane border border-abyss-200 bg-white p-4">
              <AuthorAvatarJ4 name={e.name} photo={e.photo} className="h-14 w-14 text-lg !ring-1 !ring-abyss-200" />
              <div className="min-w-0">
                <p className="font-serif4 text-base font-semibold leading-snug text-abyss-900">{e.name}</p>
                <p className="text-xs font-semibold text-cobalt-700">{e.role}</p>
                <p className="mt-1 text-[13px] leading-snug text-steel-600">{e.institution}, {e.country}</p>
                {e.areas.length > 0 && <p className="mt-1 text-xs text-steel-600">{e.areas.slice(0, 2).join(' · ')}</p>}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
