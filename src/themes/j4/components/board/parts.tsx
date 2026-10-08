// Small parts of the Journal 4 editorial directory: portrait, detail panel, leadership summary.
import { useState } from 'react'
import type { EditorProfile } from '../../../../core/types'
import { cx, Label } from '../primitives'

export const initials = (name: string) => name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export function Portrait({ editor, size = 'h-10 w-10', text = 'text-sm' }: { editor: EditorProfile; size?: string; text?: string }) {
  const [failed, setFailed] = useState(false)
  return editor.photo && !failed
    ? <img src={editor.photo} alt="" loading="lazy" onError={() => setFailed(true)} className={cx('shrink-0 rounded-ctl border border-abyss-200 bg-abyss-100 object-cover', size)} />
    : <span aria-hidden="true" className={cx('flex shrink-0 items-center justify-center rounded-ctl bg-abyss-900 font-serif4 font-semibold text-white', size, text)}>{initials(editor.name)}</span>
}

/** Expanded profile: designation, bio, areas, research profile links. */
export function Detail({ editor }: { editor: EditorProfile }) {
  const orcid = editor.links.orcid
  return (
    <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
      <Portrait editor={editor} size="h-24 w-24" text="text-2xl" />
      <div className="min-w-0 max-w-3xl">
        <p className="font-serif4 text-lg font-semibold text-abyss-900">{editor.designation}</p>
        <p className="text-sm text-steel-600">{editor.role} · {editor.institution}, {editor.country}</p>
        <p className="mt-3 text-base leading-relaxed text-steel-700">{editor.fullBio}</p>
        {editor.areas.length > 0 && (
          <ul aria-label="Areas of expertise" className="mt-3 flex flex-wrap gap-1.5">
            {editor.areas.map((a) => <li key={a} className="rounded-ctl border border-abyss-200 bg-white px-2.5 py-1 text-xs font-medium text-steel-700">{a}</li>)}
          </ul>
        )}
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {orcid && <div><dt className="inline text-steel-600">ORCID </dt><dd className="inline tabular-nums"><a className="font-medium text-cobalt-700 underline" href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer">{orcid}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>}
          {editor.links.scholar && <div><dt className="inline text-steel-600">Profile </dt><dd className="inline"><a className="font-medium text-cobalt-700 underline" href={editor.links.scholar} target="_blank" rel="noreferrer">Google Scholar<span className="sr-only"> (opens in a new tab)</span></a></dd></div>}
        </dl>
      </div>
    </div>
  )
}

/** Editor-in-Chief and the people who lead the journal, above the directory. */
export function Leadership({ editors }: { editors: EditorProfile[] }) {
  const chief = editors.find((e) => e.role === 'Editor-in-Chief')
  const leaders = editors.filter((e) => e.role === 'Managing Editor' || e.role === 'Associate Editor')
  if (!chief && leaders.length === 0) return null
  return (
    <section aria-labelledby="lead-h" className="mb-10">
      <h2 id="lead-h" className="sr-only">Journal leadership</h2>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {chief && (
          <article className="rounded-pane border border-abyss-200 border-t-4 border-t-azure-600 bg-white p-5 shadow-panel">
            <Label className="text-cobalt-700">Editor-in-Chief</Label>
            <div className="mt-3 flex items-start gap-4">
              <Portrait editor={chief} size="h-20 w-20" text="text-xl" />
              <div className="min-w-0">
                <h3 className="font-serif4 text-xl font-semibold leading-tight text-abyss-900">{chief.name}</h3>
                <p className="mt-1 text-sm text-steel-700">{chief.designation}</p>
                <p className="text-sm text-steel-600">{chief.institution}, {chief.country}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-steel-700">{chief.shortBio}</p>
          </article>
        )}
        <div>
          <Label className="text-steel-600">Managing and associate editors</Label>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {leaders.map((e) => (
              <li key={e.id} className="flex items-center gap-3 rounded-pane border border-abyss-200 bg-white p-3 shadow-hair">
                <Portrait editor={e} size="h-12 w-12" />
                <div className="min-w-0"><p className="truncate font-serif4 text-base font-semibold text-abyss-900">{e.name}</p><p className="text-xs text-steel-600">{e.role}</p><p className="truncate text-xs text-steel-600">{e.institution}</p></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
