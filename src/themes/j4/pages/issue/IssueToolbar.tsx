// Issue toolbar: filter by research area, article type and text, plus sort. A live status line reports how many articles are shown.
import { useId } from 'react'
import { ARTICLE_TYPES } from '../../../../core/types'
import { Button } from '../../components/Button'
import { areas } from '../../components/areas'
import { FIELD } from '../../components/PageBand'
import { Label } from '../../components/primitives'
import { Close, Search } from '../../icons'
import { EMPTY, SORTS, type IssueFilters, type IssueSort } from './filter'

export function IssueToolbar({ value, onChange, shown, total, areaNames, typeNames }: {
  value: IssueFilters; onChange: (f: IssueFilters) => void; shown: number; total: number; areaNames: string[]; typeNames: string[]
}) {
  const id = useId()
  const set = (p: Partial<IssueFilters>) => onChange({ ...value, ...p })
  const dirty = !!(value.area || value.type || value.text)
  const areaList = areas.map((a) => a.name).filter((n) => areaNames.includes(n))
  const typeList = ARTICLE_TYPES.filter((t) => typeNames.includes(t))
  const lab = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-steel-700'
  return (
    <div role="search" aria-label="Filter this issue" className="rounded-pane border border-abyss-200 bg-abyss-50 p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <label htmlFor={`${id}-q`} className={lab}>Title or author</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" aria-hidden="true" />
            <input id={`${id}-q`} type="search" value={value.text} onChange={(e) => set({ text: e.target.value })} placeholder="Filter this issue" autoComplete="off" className={`${FIELD} w-full pl-9`} />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-a`} className={lab}>Research area</label>
          <select id={`${id}-a`} value={value.area} onChange={(e) => set({ area: e.target.value })} className={`${FIELD} w-full`}>
            <option value="">All areas</option>{areaList.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-t`} className={lab}>Article type</label>
          <select id={`${id}-t`} value={value.type} onChange={(e) => set({ type: e.target.value })} className={`${FIELD} w-full`}>
            <option value="">All types</option>{typeList.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-s`} className={lab}>Sort by</label>
          <select id={`${id}-s`} value={value.sort} onChange={(e) => set({ sort: e.target.value as IssueSort })} className={`${FIELD} w-full`}>
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <Label className="text-steel-700"><span role="status" aria-live="polite">{dirty ? `${shown} of ${total} articles shown` : `${total} articles in this issue`}</span></Label>
        {dirty && <Button variant="ghost" onClick={() => onChange({ ...EMPTY, sort: value.sort })} className="h-11"><Close className="h-4 w-4" aria-hidden="true" />Clear filters</Button>}
      </div>
    </div>
  )
}
