// Full-width search overlay opened from the header's search icon (or the "/" key). Closes on Escape or a click outside.
import { useEffect, useRef } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import type { SuggestFn } from '../../../core/types'
import { SearchBox } from '../components/SearchBox'
import { disciplines } from '../components/discipline'
import { Close } from '../icons'

export function SearchOverlay({ open, onClose, onSearch, onSuggest }: { open: boolean; onClose: () => void; onSearch: (q: string) => void; onSuggest: SuggestFn }) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search">
      <div className="absolute inset-0 bg-graphite-900/50 motion-safe:animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div ref={panel} className="relative bg-white shadow-pop motion-safe:animate-slide-down">
        <div className="mx-auto max-w-4xl px-4 pb-8 pt-6 sm:px-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent-700">Search {journal.shortName}</p>
            <button type="button" onClick={onClose} aria-label="Close search" className="rounded-soft p-2 text-graphite-600 hover:bg-graphite-100"><Close className="h-5 w-5" aria-hidden="true" /></button>
          </div>
          <SearchBox size="lg" autoFocus onSearch={onSearch} onSuggest={onSuggest} onDone={onClose} />
          <p className="mt-3 text-sm text-graphite-600">Tip: paste a DOI such as <span className="font-medium text-graphite-800">{journal.doiPrefix}/{journal.paperIdPrefix}2026000045</span> or a Paper ID to jump straight to the article.</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-graphite-500">Browse by discipline</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {disciplines.map((d) => (
              <AppLink key={d.id} to={paths.search(d.name)} onClick={onClose} className="rounded-full border border-graphite-300 bg-white px-3 py-1.5 text-sm font-medium text-graphite-700 hover:border-accent-700 hover:text-accent-700">{d.name}</AppLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
