// Left panel of the issue page, card for card as in the reference: the "In this issue" filter card (title or author, article type,
// research area, sort by) and the "Issue Telemetry" widget (total views and downloads of the issue's articles).
import { useId } from 'react'
import { MdOutlineExpandMore as ExpandMore, MdOutlineInsights as Insights } from 'react-icons/md'
import { formatNumber } from '../../../../core/lib/format'
import { ARTICLE_TYPES, type ArticleSummary } from '../../../../core/types'
import { areas } from '../../components/areas'
import { cx } from '../../components/primitives'
import { Search } from '../../icons'
import { SORTS, type IssueFilters, type IssueSort } from './filter'

const LABEL = 'block font-work text-base font-normal uppercase tracking-wider text-[#564241]'
const GREY = 'text-[#6F5A58]'
const CTRL = 'w-full rounded border border-[#6B7280] bg-[#F4F5FC] font-work text-base text-[#141B2B] placeholder:text-[#6F5A58] focus:bg-[#E9EDFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'
const OPT = 'flex min-h-11 w-full items-center justify-between rounded px-2.5 py-1.5 text-left font-work text-base transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 lg:min-h-0'
/** Dot colours as cycled in the reference (primary-container, secondary, tertiary, outline ...). */
const TYPE_DOT: Record<string, string> = { 'Research Article': '#701A1E', 'Review Article': '#B45309', 'Short Communication': '#4E061A', Editorial: '#897270' }
const AREA_DOTS = ['#701A1E', '#B45309', '#6B1E2F', '#51020B', '#4E061A', '#DCC0BE', '#FD8A42', '#F8817F', '#701A1E']

export function IssueRail({ value, onChange, articles }: { value: IssueFilters; onChange: (f: IssueFilters) => void; articles: ArticleSummary[]; shown?: number }) {
  const id = useId()
  const set = (p: Partial<IssueFilters>) => onChange({ ...value, ...p })
  const typeCounts = ARTICLE_TYPES.map((t) => [t, articles.filter((a) => a.type === t).length] as const).filter(([, n]) => n > 0)
  const areaCounts = areas.map((a) => [a.name, articles.filter((x) => x.subject === a.name).length] as const).filter(([, n]) => n > 0)
  const views = articles.reduce((s, a) => s + a.views, 0)
  const downloads = articles.reduce((s, a) => s + a.downloads, 0)

  return (
    <aside aria-label="Filter this issue" className="min-w-0 space-y-6 lg:col-span-3">
      <div role="search" className="space-y-6 rounded bg-white p-5 shadow-sm">
        <div className="space-y-1.5">
          <label htmlFor={`${id}-q`} className={LABEL}>Title or Author</label>
          <div className="relative flex items-center">
            <Search className="pointer-events-none absolute left-2.5 h-[18px] w-[18px] text-[#6F5A58]" aria-hidden="true" />
            <input id={`${id}-q`} type="search" value={value.text} onChange={(e) => set({ text: e.target.value })} placeholder="Filter this issue" autoComplete="off" className={cx(CTRL, 'py-1.5 pl-9 pr-3')} />
          </div>
        </div>

        <fieldset className="min-w-0 space-y-2">
          <legend className={cx(LABEL, 'mb-2')}>Article Type</legend>
          <ul className="space-y-1">
            <li><button type="button" aria-pressed={!value.type} onClick={() => set({ type: '' })} className={cx(OPT, !value.type ? 'bg-[#141B2B] font-medium text-white' : 'text-[#564241] hover:bg-[#F4F5FC]')}>
              <span>All types</span><span className={cx('rounded px-2 py-0.5 text-[10px]', !value.type ? 'bg-[#2A3040]' : '')}>{articles.length}</span></button></li>
            {typeCounts.map(([t, n]) => {
              const on = value.type === t
              return (
                <li key={t}><button type="button" aria-pressed={on} onClick={() => set({ type: on ? '' : t })} className={cx(OPT, on ? 'bg-[#141B2B] font-medium text-white' : 'text-[#564241] hover:bg-[#F4F5FC]')}>
                  <span className="flex items-center gap-2"><span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: TYPE_DOT[t] }} />{t}</span>
                  <span className={on ? '' : GREY}>{n}</span></button></li>
              )
            })}
          </ul>
        </fieldset>

        <fieldset className="min-w-0 space-y-2">
          <legend className={cx(LABEL, 'mb-2')}>Research Area</legend>
          <ul className="space-y-1">
            <li><button type="button" aria-pressed={!value.area} onClick={() => set({ area: '' })} className={cx(OPT, !value.area ? 'bg-[#E1E8FD] font-semibold text-[#141B2B]' : 'text-[#564241] hover:bg-[#F4F5FC]')}>
              <span>All areas</span><span className={cx('rounded px-2 py-0.5 text-[10px]', !value.area ? 'bg-[#DCE2F7]' : '')}>{articles.length}</span></button></li>
            {areaCounts.map(([name, n], i) => {
              const on = value.area === name
              return (
                <li key={name}><button type="button" aria-pressed={on} onClick={() => set({ area: on ? '' : name })} className={cx(OPT, on ? 'bg-[#E1E8FD] font-semibold text-[#141B2B]' : 'text-[#564241] hover:bg-[#F4F5FC]')}>
                  <span className="flex min-w-0 items-center gap-2"><span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: AREA_DOTS[i % AREA_DOTS.length] }} /><span className="truncate">{name}</span></span>
                  <span className={cx('ml-1 shrink-0', on ? '' : GREY)}>{n}</span></button></li>
              )
            })}
          </ul>
        </fieldset>

        <div className="space-y-1.5 pt-2">
          <label htmlFor={`${id}-s`} className={LABEL}>Sort By</label>
          <div className="relative">
            <select id={`${id}-s`} value={value.sort} onChange={(e) => set({ sort: e.target.value as IssueSort })} className={cx(CTRL, 'cursor-pointer appearance-none px-3 py-2 pr-9')}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
            <ExpandMore className="pointer-events-none absolute right-2.5 top-2.5 h-[18px] w-[18px] text-[#6F5A58]" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="space-y-3 rounded bg-[#F4F5FC] p-4 shadow-sm">
        <h3 className="flex items-center gap-1.5 font-work text-base font-bold uppercase tracking-wider text-[#564241]"><Insights className="h-4 w-4 text-ochre-700" aria-hidden="true" />Issue Telemetry</h3>
        <dl className="grid grid-cols-2 gap-2 text-center font-work">
          <div className="rounded bg-white p-2"><dd className="block font-newsreader text-base font-bold tabular-nums text-wine-900">{formatNumber(views)}</dd><dt className={cx('text-[11px]', GREY)}>Total Views</dt></div>
          <div className="rounded bg-white p-2"><dd className="block font-newsreader text-base font-bold tabular-nums text-ochre-700">{formatNumber(downloads)}</dd><dt className={cx('text-[11px]', GREY)}>Downloads</dt></div>
        </dl>
      </div>
    </aside>
  )
}
