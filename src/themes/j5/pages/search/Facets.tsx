// Facet column for search: checkbox groups with counts. Static on desktop; on phones it collapses behind a toggle button.
import { useId, useState } from 'react'
import { Button } from '../../components/Button'
import { areaColor } from '../../components/areas'
import { cx } from '../../components/primitives'
import { symbolOf } from '../../components/signature'
import { ChevronDown } from '../../icons'

export interface FacetOption { value: string; label: string; n: number }
export interface FacetGroup { key: string; legend: string; options: FacetOption[]; selected: string[] }

export function Facets({ groups, onToggle, onClear, active }: { groups: FacetGroup[]; onToggle: (key: string, value: string) => void; onClear: () => void; active: number }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <aside aria-label="Refine results" className="lg:sticky lg:top-20">
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
        className="flex min-h-11 w-full items-center justify-between rounded border border-obsidian-300 bg-white px-4 text-sm font-semibold text-obsidian-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 lg:hidden">
        <span>Refine results{active > 0 && <span className="ml-2 rounded bg-wine-700 px-2 py-0.5 text-xs text-white">{active}</span>}</span>
        <ChevronDown className={cx('h-5 w-5 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
      </button>
      <div id={id} className={cx('mt-3 space-y-6 rounded border border-wine-800/20 border-t-2 border-t-wine-800 bg-white p-4 lg:mt-0 lg:block', open ? 'block' : 'hidden')}>
        {groups.map((g) => g.options.length > 0 && (
          <fieldset key={g.key}>
            <legend className="mb-2 w-full border-b border-wine-800/20 pb-1 font-work text-[11px] font-semibold uppercase tracking-[0.12em] text-wine-800">{g.legend}</legend>
            <ul>
              {g.options.map((o) => {
                const cid = `${id}-${g.key}-${o.value}`
                return (
                  <li key={o.value}>
                    <label htmlFor={cid} className="flex min-h-11 cursor-pointer items-center gap-3 rounded px-1 text-sm text-obsidian-800 hover:bg-[#FBF8F4] lg:min-h-9">
                      <input id={cid} type="checkbox" checked={g.selected.includes(o.value)} onChange={() => onToggle(g.key, o.value)} className="h-4 w-4 shrink-0 rounded-sm border-obsidian-400 accent-wine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700" />
                      {g.key === 'area' && <span aria-hidden="true" className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-sm border-t-2 bg-white font-newsreader text-[13px] font-semibold leading-none" style={{ borderTopColor: areaColor(o.value), color: areaColor(o.value) }}>{symbolOf(o.value)}</span>}
                      <span className="min-w-0 flex-1">{o.label}</span>
                      <span className="tabular-nums text-obsidian-600">{o.n}</span>
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
