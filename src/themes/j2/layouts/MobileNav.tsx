// Mobile and tablet navigation: a full-width panel under the header with the same links as the desktop menus.
import { useState } from 'react'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { ButtonLink, buttonClass } from '../components/Button'
import { DisciplineIcon, disciplines } from '../components/discipline'
import { cx } from '../components/primitives'
import { ChevronDown, Submit, Track } from '../icons'
import { apcLink, editorialLink, homeLink, menus, primaryLinks } from './nav'

function Group({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-graphite-100">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between py-3 text-left text-base font-semibold text-graphite-800">
        {label} <ChevronDown className={cx('h-5 w-5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && <div id={id} className="pb-3">{children}</div>}
    </div>
  )
}

const row = 'block rounded-soft px-2 py-2 text-sm font-medium text-graphite-700 hover:bg-accent-50'

export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <div className="max-h-[calc(100vh-100px)] overflow-y-auto border-b border-graphite-200 bg-white px-4 pb-6 pt-2 shadow-pop motion-safe:animate-slide-down xl:hidden">
      <nav aria-label="Mobile">
        {[homeLink, ...primaryLinks, editorialLink, apcLink].map((l) => (
          <AppLink key={l.to} to={l.to} onClick={onClose} className="block border-b border-graphite-100 py-3 text-base font-semibold text-graphite-800">{l.label}</AppLink>
        ))}
        <Group id="m-disciplines" label="Disciplines">
          <ul className="grid gap-1 sm:grid-cols-2">
            {disciplines.map((d) => (
              <li key={d.id}><AppLink to={paths.search(d.name)} onClick={onClose} className="flex items-center gap-3 rounded-soft px-2 py-2 hover:bg-accent-50"><DisciplineIcon discipline={d} size="sm" /><span className="text-sm font-medium text-graphite-800">{d.name}</span></AppLink></li>
            ))}
          </ul>
        </Group>
        {menus.map((m) => (
          <Group key={m.id} id={`m-${m.id}`} label={m.label}>
            {m.groups.map((g) => (
              <div key={g.title} className="mb-2">
                <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-accent-700">{g.title}</p>
                {g.links.map((l) => <AppLink key={l.to + l.label} to={l.to} onClick={onClose} className={row}>{l.label}</AppLink>)}
              </div>
            ))}
          </Group>
        ))}
      </nav>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <AppLink to={paths.track} onClick={onClose} className={buttonClass('outline')}><Track className="h-4 w-4" aria-hidden="true" /> Track My Paper</AppLink>
        <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
      </div>
    </div>
  )
}
