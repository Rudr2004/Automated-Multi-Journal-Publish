// Filter rail for the issue: search, article-type counts, research-area counts and sort. Sticky on desktop; stacked above the list on phones.
import { useId } from 'react'
import { ARTICLE_TYPES, type ArticleSummary } from '../../../../core/types'
import { Button } from '../../components/Button'
import { areaColor, areas } from '../../components/areas'
import { FIELD } from '../../components/PageBand'
import { TYPE_STYLE } from '../../components/PaperBits'
import { cx } from '../../components/primitives'
import { symbolOf } from '../../components/signature'
import { Close, Search } from '../../icons'
import { EMPTY, SORTS, type IssueFilters, type IssueSort } from './filter'

const H = 'mb-2 font-work text-[11px] font-semibold uppercase tracking-[0.12em] text-wine-800'
const OPT = 'flex min-h-11 w-full items-center gap-2 rounded border px-2.5 text-left text-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 lg:min-h-9'

export function IssueRail({ value, onChange, articles, shown }: { value: IssueFilters; onChange: (f: IssueFilters) => void; articles: ArticleSummary[]; shown: number }) {
  const id = useId()
  const set = (p: Partial<IssueFilters>) => onChange({ ...value, ...p })
  const dirty = !!(value.area || value.type || value.text)
  const typeCounts = ARTICLE_TYPES.map((t) => [t, articles.filter((a) => a.type === t).length] as const).filter(([, n]) => n > 0)
  const areaCounts = areas.map((a) => [a.name, articles.filter((x) => x.subject === a.name).length] as const).filter(([, n]) => n > 0)
  const opt = (on: boolean) => cx(OPT, on ? 'border-wine-800 bg-wine-800 text-white' : 'border-transparent text-obsidian-800 hover:border-wine-800/30 hover:bg-[#FBF8F4]')

  return (
    <aside aria-label="Filter this issue" className="lg:sticky lg:top-16 lg:self-start">
      <div role="search" className="rounded border border-wine-800/20 border-t-2 border-t-wine-800 bg-white shadow-none">
        <div className="border-b border-wine-800/15 bg-[#FBF8F4] px-4 py-3">
          <h2 className="font-newsreader text-lg font-semibold text-obsidian-900">In this issue</h2>
          <p role="status" aria-live="polite" className="mt-0.5 text-[13px] tabular-nums text-obsidian-600">{dirty ? `${shown} of ${articles.length} articles shown` : `${articles.length} articles`}</p>
        </div>
        <div className="space-y-5 p-4">
          <div>
            <label htmlFor={`${id}-q`} className={`${H} block`}>Title or author</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-obsidian-500" aria-hidden="true" />
              <input id={`${id}-q`} type="search" value={value.text} onChange={(e) => set({ text: e.target.value })} placeholder="Filter this issue" autoComplete="off" className={`${FIELD} w-full pl-9`} />
            </div>
          </div>
          <fieldset>
            <legend className={H}>Article type</legend>
            <div className="space-y-1">
              <button type="button" aria-pressed={!value.type} onClick={() => set({ type: '' })} className={opt(!value.type)}><span className="flex-1">All types</span><span className="tabular-nums">{articles.length}</span></button>
              {typeCounts.map(([t, n]) => (
                <button key={t} type="button" aria-pressed={value.type === t} onClick={() => set({ type: value.type === t ? '' : t })} className={opt(value.type === t)}>
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full ring-1 ring-white/60" style={{ backgroundColor: TYPE_STYLE[t].dot }} />
                  <span className="flex-1">{t}</span><span className="tabular-nums">{n}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className={H}>Research area</legend>
            <div className="space-y-1">
              <button type="button" aria-pressed={!value.area} onClick={() => set({ area: '' })} className={opt(!value.area)}><span className="flex-1">All areas</span><span className="tabular-nums">{articles.length}</span></button>
              {areaCounts.map(([name, n]) => (
                <button key={name} type="button" aria-pressed={value.area === name} onClick={() => set({ area: value.area === name ? '' : name })} className={opt(value.area === name)}>
                  <span aria-hidden="true" className="inline-flex h-6 w-7 shrink-0 items-center justify-center rounded-sm border-t-2 bg-white font-newsreader text-[13px] font-semibold leading-none" style={{ borderTopColor: areaColor(name), color: areaColor(name) }}>{symbolOf(name)}</span>
                  <span className="flex-1">{name}</span><span className="tabular-nums">{n}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor={`${id}-s`} className={`${H} block`}>Sort by</label>
            <select id={`${id}-s`} value={value.sort} onChange={(e) => set({ sort: e.target.value as IssueSort })} className={`${FIELD} w-full`}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          {dirty && <Button variant="outline" onClick={() => onChange({ ...EMPTY, sort: value.sort })} className="h-11 w-full"><Close className="h-4 w-4" aria-hidden="true" />Clear filters</Button>}
        </div>
      </div>
    </aside>
  )
}
