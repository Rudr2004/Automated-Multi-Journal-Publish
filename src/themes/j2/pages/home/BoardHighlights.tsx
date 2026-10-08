// Editorial board highlights: the leadership team with portraits, linking to the full board.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { EditorProfile } from '../../../../core/types'
import { Container, SectionHeading } from '../../components/primitives'
import { ArrowRight } from '../../icons'

function Avatar({ editor }: { editor: EditorProfile }) {
  const initials = editor.name.replace(/^(Prof|Dr)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('')
  return editor.photo
    ? <img src={editor.photo} alt="" width={72} height={72} className="h-[72px] w-[72px] rounded-full object-cover ring-2 ring-white shadow-card" />
    : <span aria-hidden="true" className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-accent-100 font-display text-xl font-bold text-accent-800">{initials}</span>
}

export function BoardHighlights({ editors }: { editors: EditorProfile[] }) {
  if (!editors.length) return null
  return (
    <section aria-labelledby="board-title" className="bg-accent-50/60 py-14 sm:py-20">
      <Container>
        <SectionHeading id="board-title" eyebrow="Editorial board" title="Guided by researchers from around the world"
          action={<AppLink to={paths.editorialBoard} className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700 hover:underline">Meet the full board <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {editors.slice(0, 4).map((e) => (
            <li key={e.id} className="rounded-panel border border-graphite-200 bg-white p-5 text-center shadow-card">
              <div className="flex justify-center"><Avatar editor={e} /></div>
              <p className="mt-3 font-display text-base font-semibold text-graphite-800">{e.name}</p>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">{e.role}</p>
              <p className="mt-2 text-sm text-graphite-600">{e.institution}, {e.country}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
