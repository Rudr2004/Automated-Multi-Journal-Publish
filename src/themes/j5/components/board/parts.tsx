// Small parts of the Journal 5 editorial directory: portrait, detail panel, leadership cards.
import { useState } from 'react'
import type { EditorProfile } from '../../../../core/types'
import { cx } from '../primitives'
import { Kicker, OrnamentRule } from '../signature'

export const initials = (name: string) => name.replace(/^(Prof\.|Dr\.|Mr\.|Ms\.|Mrs\.)\s*/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

export function Portrait({ editor, size = 'h-10 w-10', text = 'text-sm' }: { editor: EditorProfile; size?: string; text?: string }) {
  const [failed, setFailed] = useState(false)
  return editor.photo && !failed
    ? <img src={editor.photo} alt="" loading="lazy" onError={() => setFailed(true)} className={cx('shrink-0 rounded border border-[#E6DCD0] bg-obsidian-100 object-cover', size)} />
    : <span aria-hidden="true" className={cx('flex shrink-0 items-center justify-center rounded bg-wine-800 font-newsreader font-semibold text-white', size, text)}>{initials(editor.name)}</span>
}

/** Expanded profile: designation, bio, areas, research profile links. */
export function Detail({ editor }: { editor: EditorProfile }) {
  const orcid = editor.links.orcid
  return (
    <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)]">
      <Portrait editor={editor} size="h-24 w-24" text="text-2xl" />
      <div className="min-w-0 max-w-3xl">
        <p className="font-newsreader text-lg font-semibold text-obsidian-900">{editor.designation}</p>
        <p className="text-sm text-obsidian-600">{editor.role} · {editor.institution}, {editor.country}</p>
        <p className="mt-3 font-serif4 text-base leading-relaxed text-obsidian-700">{editor.fullBio}</p>
        {editor.areas.length > 0 && (
          <ul aria-label="Areas of expertise" className="mt-3 flex flex-wrap gap-1.5">
            {editor.areas.map((a) => <li key={a} className="rounded border border-[#E6DCD0] bg-white px-2.5 py-1 text-xs font-medium text-obsidian-700">{a}</li>)}
          </ul>
        )}
        <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
          {orcid && <div><dt className="inline text-obsidian-600">ORCID </dt><dd className="inline tabular-nums"><a className="font-medium text-wine-700 underline" href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer">{orcid}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>}
          {editor.links.scholar && <div><dt className="inline text-obsidian-600">Profile </dt><dd className="inline"><a className="font-medium text-wine-700 underline" href={editor.links.scholar} target="_blank" rel="noreferrer">Google Scholar<span className="sr-only"> (opens in a new tab)</span></a></dd></div>}
        </dl>
      </div>
    </div>
  )
}

/** Editor-in-Chief, managing and associate editors as photo cards, above the directory. */
export function Leadership({ editors }: { editors: EditorProfile[] }) {
  const chief = editors.find((e) => e.role === 'Editor-in-Chief')
  const leaders = editors.filter((e) => e.role === 'Managing Editor' || e.role === 'Associate Editor')
  if (!chief && leaders.length === 0) return null
  return (
    <section aria-labelledby="lead-h" className="mb-10">
      <Kicker>The masthead</Kicker>
      <h2 id="lead-h" className="mt-1 font-newsreader text-[1.5rem] font-semibold tracking-tight text-obsidian-900 sm:text-[1.75rem]">Journal leadership</h2>
      <OrnamentRule className="mt-3 max-w-sm" />
      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {chief && (
          <article className="rounded border border-[#E6DCD0] border-t-4 border-t-wine-800 bg-white p-5 transition-colors duration-150 hover:border-wine-800/60 motion-reduce:transition-none">
            <span className="inline-block rounded-sm bg-wine-800 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">Editor-in-Chief</span>
            <div className="mt-3 flex items-start gap-4">
              <Portrait editor={chief} size="h-24 w-24" text="text-2xl" />
              <div className="min-w-0">
                <h3 className="font-newsreader text-xl font-semibold leading-tight text-obsidian-900">{chief.name}</h3>
                <p className="mt-1 text-sm text-obsidian-700">{chief.designation}</p>
                <p className="text-sm text-obsidian-600">{chief.institution}, {chief.country}</p>
              </div>
            </div>
            <p className="mt-3 font-serif4 text-base leading-relaxed text-obsidian-700">{chief.shortBio}</p>
            {chief.areas.length > 0 && <ul aria-label="Areas of expertise" className="mt-3 flex flex-wrap gap-1.5">{chief.areas.map((a) => <li key={a} className="rounded border border-[#E6DCD0] bg-[#FBF8F4] px-2 py-0.5 text-xs font-medium text-obsidian-700">{a}</li>)}</ul>}
          </article>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600">Managing and associate editors</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {leaders.map((e) => (
              <li key={e.id} className="flex items-start gap-3 rounded border border-[#E6DCD0] bg-white p-3 transition duration-150 hover:-translate-y-px hover:border-wine-800/60 motion-reduce:transform-none motion-reduce:transition-none">
                <Portrait editor={e} size="h-16 w-16" text="text-lg" />
                <div className="min-w-0">
                  <p className="font-newsreader text-base font-semibold leading-snug text-obsidian-900">{e.name}</p>
                  <p className="mt-0.5 inline-block rounded-sm border border-ochre-200 bg-ochre-50 px-1.5 py-0.5 text-[11px] font-semibold text-ochre-800">{e.role}</p>
                  <p className="mt-1 text-xs text-obsidian-600">{e.institution}, {e.country}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
