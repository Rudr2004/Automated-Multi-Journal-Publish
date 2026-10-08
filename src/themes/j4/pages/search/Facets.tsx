// Facet column for search: checkbox groups with counts. Static on desktop; on phones it collapses behind a toggle button.
import { useId, useState } from 'react'
import { Button } from '../../components/Button'
import { cx } from '../../components/primitives'
import { ChevronDown } from '../../icons'

export interface FacetOption { value: string; label: string; n: number }
export interface FacetGroup { key: string; legend: string; options: FacetOption[]; selected: string[] }

export function Facets({ groups, onToggle, onClear, active }: { groups: FacetGroup[]; onToggle: (key: string, value: string) => void; onClear: () => void; active: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <aside aria-label="Refine results" className="lg:sticky lg:top-24">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between rounded-ctl border border-abyss-300 bg-white px-4 text-sm font-semibold text-abyss-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:hidden">
        <span>Refine results{active > 0 && <span className="ml-2 rounded-ctl bg-cobalt-700 px-2 py-0.5 text-xs text-white">{active}</span>}</span>
        <ChevronDown className={cx('h-5 w-5 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <div id={id} className={cx('mt-3 space-y-6 rounded-pane border border-abyss-200 bg-white p-4 lg:mt-0 lg:block', open ? 'block' : 'hidden')}>
        {groups.map((g) => g.options.length > 0 && (
          <fieldset key={g.key}>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel-700">{g.legend}</legend>
            <ul>
              {g.options.map((o) => {
                const cid = `${id}-${g.key}-${o.value}`
                return (
                  <li key={o.value}>
                    <label htmlFor={cid} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-ctl px-1 text-sm text-abyss-800 hover:bg-abyss-50 lg:min-h-9">
                      <input id={cid} type="checkbox" checked={g.selected.includes(o.value)} onChange={() => onToggle(g.key, o.value)} className="h-4 w-4 shrink-0 rounded-sm border-abyss-400 accent-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600" />
                      <span className="min-w-0 flex-1">{o.label}</span>
                      <span className="tabular-nums text-steel-600">{o.n}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </fieldset>
        ))}
        {active > 0 && <Button variant="outline" onClick={onClear} className="h-11 w-full">Clear all filters ({active})</Button>}
      </div>
    </aside>
  )
}
