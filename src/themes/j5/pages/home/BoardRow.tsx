// Editorial board highlights. Portraits load eagerly with an initials badge underneath, so the circle is never empty
// (the shared avatar used loading="lazy", which left below-the-fold circles blank until scrolled near).
import { useState } from 'react'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { EditorProfile } from '../../../../core/types'
import { portraitFor } from '../../../../mock-data/shared/portraits'
import { initialsOfJ5 } from '../../components/AuthorChipJ5'
import { Tag } from '../../components/primitives'
import { ArrowRight } from '../../icons'
import { HomeSection } from './HomeHead'

function Photo({ name, photo }: { name: string; photo?: string }) {
  const [failed, setFailed] = useState(false)
  const src = photo ?? portraitFor(name)
  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-wine-100 font-newsreader text-xl font-semibold text-wine-900 ring-2 ring-ochre-600/60 ring-offset-2 ring-offset-white">
      <span aria-hidden="true">{initialsOfJ5(name)}</span>
      {src && !failed && <img src={src} alt="" width={64} height={64} loading="eager" decoding="async" onError={() => setFailed(true)} className="absolute inset-0 h-full w-full object-cover" />}
    </span>
  )
}

export function BoardRow({ editors }: { editors: EditorProfile[] }) {
  if (!editors.length) return null
  return (
    <HomeSection id="board-title" label="Editorial board" title="Guided by researchers from across the sciences" bg="bg-[#FBF8F4]"
      action={<AppLink to={paths.editorialBoard} className="inline-flex items-center gap-1 text-sm font-semibold text-wine-800 hover:underline">Full board directory <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>}>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {editors.slice(0, 6).map((e) => (
          <li key={e.id} className="flex items-start gap-4 rounded border border-obsidian-200 border-t-2 border-t-ochre-600 bg-white p-4 transition duration-150 hover:-translate-y-px hover:border-wine-800 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
            <Photo name={e.name} photo={e.photo} />
            <div className="min-w-0">
              <p className="font-newsreader text-base font-semibold leading-snug text-obsidian-900">{e.name}</p>
              <p className="mt-0.5 text-xs font-semibold text-wine-800">{e.role}</p>
              <p className="mt-1 text-[13px] leading-snug text-obsidian-600">{e.institution}, {e.country}</p>
              {e.areas.length > 0 && <p className="mt-2 flex flex-wrap gap-1">{e.areas.slice(0, 2).map((a) => <Tag key={a} tone="wine">{a}</Tag>)}</p>}
            </div>
          </li>
        ))}
      </ul>
    </HomeSection>
  )
}
