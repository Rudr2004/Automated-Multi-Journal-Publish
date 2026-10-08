// Editorial board highlights: the leadership team in a row, linking to the full directory.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { EditorProfile } from '../../../../core/types'
import { Container, SectionHead } from '../../components/primitives'
import { ArrowRight } from '../../icons'

const initials = (name: string) => name.replace(/^(Prof|Dr)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('')

export function BoardRow({ editors }: { editors: EditorProfile[] }) {
  if (!editors.length) return null
  return (
    <section aria-labelledby="board-title" className="border-t border-abyss-200 pb-16 pt-16 sm:pb-24 sm:pt-24">
      <Container>
        <SectionHead id="board-title" label="Editorial board" title="Led by working engineers and researchers"
          action={<AppLink to={paths.editorialBoard} className="inline-flex items-center gap-1 text-sm font-semibold text-cobalt-700 hover:underline">Full board directory <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {editors.slice(0, 4).map((e) => (
            <li key={e.id} className="flex items-start gap-4 rounded-pane border border-abyss-200 bg-white p-4">
              {e.photo
                ? <img src={e.photo} alt="" width={56} height={56} className="h-14 w-14 shrink-0 rounded-ctl object-cover" />
                : <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-ctl bg-abyss-100 font-serif4 text-lg font-semibold text-abyss-800">{initials(e.name)}</span>}
              <div className="min-w-0">
                <p className="font-serif4 text-base font-semibold leading-snug text-abyss-900">{e.name}</p>
                <p className="text-xs font-semibold text-cobalt-700">{e.role}</p>
                <p className="mt-1 text-[13px] leading-snug text-steel-600">{e.institution}, {e.country}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
