import type { EditorProfile } from '../../../mock-data/journals/j1'
import { Avatar } from './Avatar'

/** Small profile links: ORCID, Google Scholar, Scopus, Web of Science. */
export function ProfileLinks({ links }: { links: EditorProfile['links'] }) {
  const items = [
    links.orcid && ['ORCID', `https://orcid.org/${links.orcid}`],
    links.scholar && ['Scholar', links.scholar],
    links.scopus && ['Scopus', links.scopus],
    links.wos && ['WoS', links.wos],
  ].filter(Boolean) as [string, string][]
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Profile links">
      {items.map(([label, href]) => (
        <li key={label}><a href={href} target="_blank" rel="noreferrer" className="inline-block rounded-sm border border-line bg-white px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-scholar hover:border-scholar hover:bg-scholar-soft">{label}</a></li>
      ))}
    </ul>
  )
}

/** Role label: muted-gold badge for the Editor-in-Chief (an honour), Scholar-blue small caps for everyone else. */
export function RoleLabel({ role }: { role: EditorProfile['role'] }) {
  return role === 'Editor-in-Chief'
    ? <span className="inline-block rounded-sm border border-[#FCD8A5] bg-[#FFF7EB] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#7A5A12]">{role}</span>
    : <span className="text-[11px] font-bold uppercase tracking-wider text-scholar">{role}</span>
}

/** Leadership card: flat warm-paper tile with an initials circle, role, name, designation and institution. */
export function EditorCard({ editor, onView }: { editor: EditorProfile; onView: (e: EditorProfile) => void }) {
  return (
    <article className="flex h-full flex-col rounded border border-line bg-paper p-4 transition-colors hover:border-scholar">
      <div className="flex items-start gap-3.5">
        <Avatar name={editor.name} photo={editor.photo} />
        <div className="min-w-0">
          <RoleLabel role={editor.role} />
          <h3 className="mt-1 font-serif text-[1.0625rem] font-semibold leading-snug text-navy">{editor.name}</h3>
          <p className="mt-0.5 text-[13px] leading-snug text-ink">{editor.designation}</p>
        </div>
      </div>
      <p className="mt-3 border-t border-line pt-3 text-[13px] leading-snug text-ink-muted">
        <span className="font-semibold text-ink">{editor.institution}</span>, {editor.country}
      </p>
      <ul aria-label="Research areas" className="mt-2 flex flex-wrap gap-1">
        {editor.areas.slice(0, 3).map((a) => <li key={a} className="rounded-sm border border-line bg-white px-1.5 py-0.5 text-[11px] text-ink-muted">{a}</li>)}
      </ul>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-4">
        <ProfileLinks links={editor.links} />
        <button type="button" onClick={() => onView(editor)} aria-label={`View profile of ${editor.name}`} className="text-[13px] font-semibold text-scholar hover:underline">View profile →</button>
      </div>
    </article>
  )
}

/** One dense directory row (name · institution · research areas · links). Used in the grouped board directory. */
export function EditorRow({ editor, onView }: { editor: EditorProfile; onView: (e: EditorProfile) => void }) {
  return (
    <li className="grid items-start gap-x-4 gap-y-2 border-b border-line px-1 py-3 last:border-b-0 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1.1fr)_180px]">
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={editor.name} photo={editor.photo} size="sm" />
        <div className="min-w-0">
          <button type="button" onClick={() => onView(editor)} className="text-left font-serif text-base font-semibold leading-snug text-navy hover:text-scholar hover:underline">{editor.name}</button>
          <p className="text-[13px] leading-snug text-ink-muted">{editor.designation}</p>
        </div>
      </div>
      <p className="text-[13px] leading-snug text-ink"><span className="font-semibold">{editor.institution}</span><br /><span className="text-ink-muted">{editor.country}</span></p>
      <ul aria-label="Research areas" className="flex flex-wrap gap-1">
        {editor.areas.map((a) => <li key={a} className="rounded-sm border border-line bg-paper px-1.5 py-0.5 text-[11px] text-ink-muted">{a}</li>)}
      </ul>
      <ProfileLinks links={editor.links} />
    </li>
  )
}
