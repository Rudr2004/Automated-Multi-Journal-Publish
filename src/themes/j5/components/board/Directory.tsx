// The editorial directory: filters, a sortable table (md and up) and expandable cards (phones).
import { Fragment, useId, useMemo, useState } from 'react'
import { EDITOR_ROLES, type EditorProfile } from '../../../../core/types'
import { ArrowDown, ArrowUp, ChevronDown, Search, Unfold } from '../../icons'
import { cx, EmptyState } from '../primitives'
import { Kicker, OrnamentRule } from '../signature'
import { Detail, Portrait } from './parts'

type SortKey = 'name' | 'role' | 'institution' | 'country' | 'area'
const COLS: { key: SortKey; label: string }[] = [
  { key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }, { key: 'institution', label: 'Affiliation' }, { key: 'country', label: 'Country' }, { key: 'area', label: 'Area' },
]
const value = (e: EditorProfile, k: SortKey) => k === 'area' ? (e.areas[0] ?? '') : k === 'role' ? String(EDITOR_ROLES.indexOf(e.role)).padStart(2, '0') : e[k]
const selectCls = 'min-h-[44px] w-full rounded border border-ochre-600/50 bg-white px-3 text-sm text-obsidian-900 shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'

export function Directory({ editors }: { editors: EditorProfile[] }) {
  const base = useId()
  const [q, setQ] = useState('')
  const [role, setRole] = useState('')
  const [country, setCountry] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'role', dir: 1 })
  const [open, setOpen] = useState<Set<string>>(new Set())
  const countries = useMemo(() => [...new Set(editors.map((e) => e.country))].sort(), [editors])

  const counts = useMemo(() => { const m: Record<string, number> = {}; editors.forEach((e) => { m[e.role] = (m[e.role] ?? 0) + 1 }); return m }, [editors])

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase()
    return editors
      .filter((e) => (!role || e.role === role) && (!country || e.country === country)
        && (!t || [e.name, e.institution, e.designation, e.country, ...e.areas].join(' ').toLowerCase().includes(t)))
      .sort((a, b) => value(a, sort.key).localeCompare(value(b, sort.key)) * sort.dir || a.name.localeCompare(b.name))
  }, [editors, q, role, country, sort])

  const toggle = (id: string) => setOpen((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n })
  const setSortKey = (key: SortKey) => setSort((s) => ({ key, dir: s.key === key && s.dir === 1 ? -1 : 1 }))
  const clear = () => { setQ(''); setRole(''); setCountry('') }

  return (
    <section aria-labelledby={`${base}-h`}>
      <Kicker>All members</Kicker>
      <h2 id={`${base}-h`} className="mt-1 font-newsreader text-[1.5rem] font-semibold tracking-tight text-obsidian-900 sm:text-[1.75rem]">Directory</h2>
      <OrnamentRule className="mt-3 max-w-sm" />
      <form role="search" aria-label="Filter the editorial directory" onSubmit={(e) => e.preventDefault()} className="mt-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div>
          <label htmlFor={`${base}-q`} className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600">Search</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-obsidian-500" aria-hidden="true" />
            <input id={`${base}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, institution or area" className={cx(selectCls, 'pl-10')} />
          </div>
        </div>
        <div><label htmlFor={`${base}-c`} className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600">Country</label>
          <select id={`${base}-c`} value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}><option value="">All countries</option>{countries.map((c) => <option key={c}>{c}</option>)}</select></div>
      </form>
      <div role="group" aria-label="Filter by role" className="mt-3 flex flex-wrap gap-2">
        {[['', 'All roles', editors.length] as const, ...EDITOR_ROLES.filter((x) => counts[x]).map((x) => [x, x, counts[x]] as const)].map(([v, label, n]) => (
          <button key={v} type="button" aria-pressed={role === v} onClick={() => setRole(v)} className={cx('inline-flex min-h-9 items-center gap-2 rounded border px-3 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700', role === v ? 'border-wine-800 bg-wine-800 text-white' : 'border-obsidian-300 bg-white text-obsidian-900 transition-colors duration-150 hover:border-wine-700 hover:text-wine-800')}>{label}<span className={cx('tabular-nums', role === v ? 'text-ochre-300' : 'text-obsidian-600')}>{n}</span></button>
        ))}
      </div>
      <p role="status" aria-live="polite" className="mt-3 text-sm tabular-nums text-obsidian-600">
        Showing {rows.length} of {editors.length} members.{(q || role || country) && <> <button type="button" onClick={clear} className="font-semibold text-wine-700 underline">Clear filters</button></>}
      </p>

      {rows.length === 0 ? <div className="mt-4"><EmptyState title="No members match these filters" text="Try a different name, role or country." /></div> : (
        <>
          <div className="mt-3 hidden overflow-x-auto rounded border border-[#E6DCD0] bg-white shadow-none md:block">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Editorial board members. Column headers are buttons that sort the table.</caption>
              <thead className="border-b border-[#E6DCD0] bg-[#F4EEE6]"><tr>
                {COLS.map((c) => {
                  const on = sort.key === c.key
                  const Icon = !on ? Unfold : sort.dir === 1 ? ArrowUp : ArrowDown
                  return (
                    <th key={c.key} scope="col" aria-sort={on ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'} className="p-0">
                      <button type="button" onClick={() => setSortKey(c.key)} className="flex min-h-[44px] w-full items-center gap-1 px-4 text-left text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600 hover:text-obsidian-900 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-wine-700">
                        {c.label}<Icon className={cx('h-4 w-4', on ? 'text-obsidian-900' : 'text-obsidian-400')} aria-hidden="true" />
                      </button>
                    </th>
                  )
                })}
              </tr></thead>
              <tbody className="divide-y divide-obsidian-200">
                {rows.map((e) => {
                  const on = open.has(e.id)
                  return (
                    <Fragment key={e.id}>
                      <tr className={cx('align-middle transition-colors duration-150 hover:bg-[#FBF8F4]', on && 'bg-[#FBF8F4]')}>
                        <th scope="row" className="px-4 py-2.5 font-normal">
                          <button type="button" aria-expanded={on} aria-controls={`${base}-${e.id}`} onClick={() => toggle(e.id)} className="group flex min-h-[44px] items-center gap-3 rounded text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wine-700">
                            <Portrait editor={e} /><span className="font-newsreader text-base font-semibold text-obsidian-900 group-hover:text-wine-700">{e.name}</span>
                            <ChevronDown className={cx('h-5 w-5 shrink-0 text-obsidian-500 motion-safe:transition-transform', on && 'rotate-180')} aria-hidden="true" />
                          </button>
                        </th>
                        <td className="px-4 py-2.5"><span className="inline-block whitespace-nowrap rounded-sm border border-ochre-200 bg-ochre-50 px-2 py-0.5 text-xs font-semibold text-ochre-800">{e.role}</span></td>
                        <td className="px-4 py-2.5 text-obsidian-700">{e.institution}</td>
                        <td className="px-4 py-2.5 text-obsidian-700">{e.country}</td>
                        <td className="px-4 py-2.5 text-obsidian-700">{e.areas[0]}</td>
                      </tr>
                      {on && <tr id={`${base}-${e.id}`} className="bg-[#FBF8F4]"><td colSpan={5} className="px-4 pb-5 pt-1"><Detail editor={e} /></td></tr>}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>

          <ul className="mt-3 space-y-3 md:hidden">
            {rows.map((e) => {
              const on = open.has(e.id)
              return (
                <li key={e.id} className="rounded border border-[#E6DCD0] bg-white shadow-none">
                  <button type="button" aria-expanded={on} aria-controls={`${base}-m-${e.id}`} onClick={() => toggle(e.id)} className="flex min-h-[44px] w-full items-center gap-3 p-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-wine-700">
                    <Portrait editor={e} size="h-12 w-12" />
                    <span className="min-w-0 flex-1"><span className="block font-newsreader text-base font-semibold text-obsidian-900">{e.name}</span><span className="mt-0.5 inline-block rounded-sm border border-ochre-200 bg-ochre-50 px-1.5 py-0.5 text-[11px] font-semibold text-ochre-800">{e.role}</span><span className="block text-xs text-obsidian-600">{e.institution}, {e.country}</span></span>
                    <ChevronDown className={cx('h-5 w-5 shrink-0 text-obsidian-500', on && 'rotate-180')} aria-hidden="true" />
                  </button>
                  {on && <div id={`${base}-m-${e.id}`} className="border-t border-[#E6DCD0] p-3"><Detail editor={e} /></div>}
                </li>
              )
            })}
          </ul>
        </>
      )}
    </section>
  )
}
