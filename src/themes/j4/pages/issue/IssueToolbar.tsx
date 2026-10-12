// Issue filter card (reference: "dedicated article tab bar and multi-facet filter"): a search row with a "Search Issue" button, Subject Area / Type / Sort By selects,
// and article-type tabs with counts. Filtering is live; a status line reports how many articles are shown.
import { useId } from 'react'
import { MdOutlineManageSearch as ManageSearch } from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { ARTICLE_TYPES, type ArticleSummary, type ArticleType } from '../../../../core/types'
import { areas } from '../../components/areas'
import { cx } from '../../components/primitives'
import { Close, Search } from '../../icons'
import { plural, SORTS, EMPTY, type IssueFilters, type IssueSort } from './filter'

const lab = 'text-[11px] font-semibold uppercase text-slate-500'
const sel = 'rounded border border-slate-300 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 focus:border-azure-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-600/30 min-h-11 lg:min-h-8'

export function IssueToolbar({ value, onChange, shown, articles }: { value: IssueFilters; onChange: (f: IssueFilters) => void; shown: number; articles: ArticleSummary[] }) {
  const id = useId()
  const set = (p: Partial<IssueFilters>) => onChange({ ...value, ...p })
  const dirty = !!(value.area || value.type || value.text)
  const areaList = areas.map((a) => a.name).filter((n) => articles.some((x) => x.subject === n))
  const typeList = (['Editorial', ...ARTICLE_TYPES.filter((t) => t !== 'Editorial')] as ArticleType[]).map((t) => [t, articles.filter((a) => a.type === t).length] as const).filter(([, n]) => n > 0)
  const tab = (on: boolean) => cx('inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded px-3 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-1 lg:min-h-8',
    on ? 'bg-cobalt-700 font-semibold text-white shadow-hair' : 'border border-slate-200 font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-cobalt-700')

  return (
    <section role="search" aria-label="Filter this issue" className="space-y-4 rounded-[12px] border border-slate-200 bg-white p-5 shadow-hair">
      <div className="space-y-3">
        <form onSubmit={(e) => { e.preventDefault(); document.getElementById('issue-articles')?.scrollIntoView({ block: 'start' }) }} className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor={`${id}-q`} className="sr-only">Search within this issue</label>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input id={`${id}-q`} type="search" value={value.text} onChange={(e) => set({ text: e.target.value })} placeholder="Search within this issue by title, author name, keyword, or DOI..." autoComplete="off"
              className="min-h-11 w-full rounded border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-xs placeholder:text-slate-500 focus:border-azure-600 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-azure-600/30 lg:min-h-9" />
          </div>
          <button type="submit" className="inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded bg-cobalt-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-1 lg:min-h-9">
            <ManageSearch className="h-4 w-4" aria-hidden="true" />Search Issue
          </button>
        </form>
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-600">
              <label htmlFor={`${id}-a`} className={lab}>Subject Area:</label>
              <select id={`${id}-a`} value={value.area} onChange={(e) => set({ area: e.target.value })} className={sel}>
                <option value="">All Specializations</option>{areaList.map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <label htmlFor={`${id}-t`} className={lab}>Type:</label>
              <select id={`${id}-t`} value={value.type} onChange={(e) => set({ type: e.target.value })} className={sel}>
                <option value="">All Document Types</option>{typeList.map(([t]) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <label htmlFor={`${id}-s`} className={lab}>Sort By:</label>
            <select id={`${id}-s`} value={value.sort} onChange={(e) => set({ sort: e.target.value as IssueSort })} className={sel}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 overflow-x-auto border-t border-slate-200 pt-3">
        <div role="group" aria-label="Article type" className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium">
          <button type="button" aria-pressed={!value.type} onClick={() => set({ type: '' })} className={tab(!value.type)}>All Articles</button>
          {typeList.map(([t, n]) => (
            <button key={t} type="button" aria-pressed={value.type === t} onClick={() => set({ type: value.type === t ? '' : t })} className={tab(value.type === t)}>
              {plural(t)}<span className={cx('rounded px-1.5 font-mono text-[10px]', value.type === t ? 'bg-white/20' : 'bg-slate-100 text-slate-600')}>{n}</span>
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <p role="status" aria-live="polite" className="whitespace-nowrap font-mono text-[11px] text-slate-500">{dirty ? `${shown} of ${articles.length} shown` : `ISSN ${journal.issnOnline}`}</p>
          {dirty && <button type="button" onClick={() => onChange({ ...EMPTY, sort: value.sort })} className="inline-flex min-h-11 items-center gap-1 whitespace-nowrap rounded px-2 text-xs font-semibold text-cobalt-700 hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:min-h-8"><Close className="h-4 w-4" aria-hidden="true" />Clear filters</button>}
        </div>
      </div>
    </section>
  )
}
