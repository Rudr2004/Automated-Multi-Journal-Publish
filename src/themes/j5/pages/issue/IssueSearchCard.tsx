// "Search Issue Contents" card from the issue reference: field select, query box with Clear, Search Issue / Reset buttons, quick type chips.
import { useId } from 'react'
import { MdOutlineExpandMore as ExpandMore, MdOutlineManageSearch as ManageSearch, MdOutlineRestartAlt as Restart, MdOutlineVerified as VerifiedIcon } from 'react-icons/md'
import type { ArticleSummary, ArticleType, IssueSummary } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { Search } from '../../icons'
import { EMPTY, FIELDS, type IssueFilters, type SearchField } from './filter'

const GREY = 'text-[#6F5A58]'
const CTRL = 'rounded border border-[#DCC0BE]/60 bg-[#F4F5FC] text-[#141B2B] placeholder:text-[#6F5A58] focus:border-wine-800 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'
const QUICK: [ArticleType, string][] = [['Research Article', 'Research Articles'], ['Review Article', 'Reviews'], ['Editorial', 'Editorial'], ['Short Communication', 'Short Comm.']]

export function IssueSearchCard({ value, onChange, articles, issue }: { value: IssueFilters; onChange: (f: IssueFilters) => void; articles: ArticleSummary[]; issue: IssueSummary }) {
  const id = useId()
  const set = (p: Partial<IssueFilters>) => onChange({ ...value, ...p })
  return (
    <div className="space-y-4 rounded-lg border border-[#DCC0BE]/40 bg-white p-5 shadow-sm">
      <div className="flex flex-col justify-between gap-3 border-b border-[#E1E8FD] pb-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <ManageSearch className="h-[22px] w-[22px] shrink-0 text-wine-800" aria-hidden="true" />
          <div>
            <h2 className="font-newsreader text-base font-bold leading-tight text-[#141B2B]">Search Issue Contents</h2>
            <p className={cx('font-work text-xs', 'text-[#564241]')}>Query published manuscripts across metadata, full texts, and abstracts</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 self-start rounded border border-[#DCC0BE]/30 bg-[#E9EDFF] px-2.5 py-1 font-work text-[11px] font-semibold text-[#564241] sm:self-auto">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-600" />Showing published articles in Vol. {issue.volume}, Issue {issue.issue}
        </span>
      </div>
      <form role="search" aria-label="Search this issue" className="space-y-3" onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col items-stretch gap-2 md:flex-row">
          <div className="relative shrink-0 md:w-44">
            <label htmlFor={`${id}-f`} className="sr-only">Search field</label>
            <select id={`${id}-f`} value={value.field} onChange={(e) => set({ field: e.target.value as SearchField })} className={cx(CTRL, 'h-full min-h-11 w-full cursor-pointer appearance-none py-2.5 pl-3 pr-8 font-work text-xs')}>
              {FIELDS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
            </select>
            <ExpandMore className="pointer-events-none absolute right-2.5 top-3 h-4 w-4 text-[#6F5A58]" aria-hidden="true" />
          </div>
          <div className="relative flex-1">
            <label htmlFor={`${id}-q`} className="sr-only">Search in this issue</label>
            <Search className="pointer-events-none absolute left-3 top-3 h-5 w-5 text-[#6F5A58]" aria-hidden="true" />
            <input id={`${id}-q`} type="search" value={value.text} onChange={(e) => set({ text: e.target.value })} autoComplete="off" placeholder="Search in this issue (Title, Author, DOI, Abstract)..." className={cx(CTRL, 'min-h-11 w-full py-2 pl-10 pr-20 font-serif4 text-sm')} />
            {value.text && <button type="button" onClick={() => set({ text: '' })} className={cx('absolute right-2 top-2 rounded px-2 py-1 font-work text-xs hover:text-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700', GREY)}>Clear</button>}
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" className="inline-flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded bg-wine-900 px-5 py-2.5 font-work text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-colors motion-reduce:transition-none hover:bg-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2 md:flex-initial"><Search className="h-4 w-4" aria-hidden="true" />Search Issue</button>
            <button type="button" title="Reset filters" onClick={() => onChange({ ...EMPTY, sort: value.sort })} className="inline-flex min-h-11 items-center justify-center gap-1 rounded border border-[#DCC0BE]/50 bg-[#E9EDFF] px-3 py-2.5 font-work text-xs font-medium uppercase tracking-wider text-[#141B2B] transition-colors motion-reduce:transition-none hover:bg-[#E1E8FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700"><Restart className="h-[15px] w-[15px]" aria-hidden="true" />Reset</button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 font-work text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={cx('mr-1 text-[11px] uppercase tracking-wide', GREY)}>Quick Filter:</span>
            <button type="button" aria-pressed={!value.type} onClick={() => set({ type: '' })} className={cx('min-h-8 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-sm transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700', !value.type ? 'bg-wine-800 text-white' : 'border border-[#DCC0BE]/50 bg-[#F4F5FC] text-[#141B2B] hover:bg-[#E9EDFF]')}>All Types</button>
            {QUICK.map(([t, label]) => {
              const n = articles.filter((a) => a.type === t).length
              if (!n) return null
              const on = value.type === t
              return <button key={t} type="button" aria-pressed={on} onClick={() => set({ type: on ? '' : t })} className={cx('min-h-8 rounded-full px-2.5 py-1 text-[11px] transition-colors motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700', on ? 'bg-wine-800 font-medium text-white' : 'border border-[#DCC0BE]/50 bg-[#F4F5FC] text-[#141B2B] hover:bg-[#E9EDFF]')}>{label} ({n})</button>
            })}
          </div>
          <p className={cx('flex items-center gap-1 text-[11px]', GREY)}><VerifiedIcon className="h-[14px] w-[14px]" aria-hidden="true" />Peer-reviewed &amp; DOI-registered</p>
        </div>
      </form>
    </div>
  )
}
