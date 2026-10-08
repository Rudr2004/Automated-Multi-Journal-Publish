import type { EditorProfile } from '../../../mock-data/journals/j1'
import { Avatar } from './Avatar'
import { Badge } from './primitives'

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
        <li key={label}><a href={href} target="_blank" rel="noreferrer" className="inline-block rounded-md border border-line px-2 py-0.5 text-xs font-semibold text-navy-500 hover:border-navy hover:bg-navy-50">{label}</a></li>
      ))}
    </ul>
  )
}

export function EditorCard({ editor, onView }: { editor: EditorProfile; onView: (e: EditorProfile) => void }) {
  return (
    <article className="flex h-full flex-col rounded-card border border-line bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <Avatar name={editor.name} photo={editor.photo} />
        <div className="min-w-0">
          <Badge tone="navy">{editor.role}</Badge>
          <h3 className="mt-1.5 font-serif text-lg font-semibold leading-snug text-navy">{editor.name}</h3>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-ink">{editor.designation}</p>
      <p className="text-sm text-ink-muted">{editor.institution}, {editor.country}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">{editor.shortBio}</p>
      <div className="mt-4"><ProfileLinks links={editor.links} /></div>
      <button type="button" onClick={() => onView(editor)} className="mt-auto pt-4 text-left text-sm font-semibold text-navy-500 hover:underline">View Profile →</button>
    </article>
  )
}
