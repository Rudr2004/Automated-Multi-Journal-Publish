// Searchable, filterable list of every archived article (text, research area, article type, issue), newest first. The filter card follows the
// issue reference's left panel (labels, grey controls); results are the same article cards as the issue page.
import { useEffect, useId, useMemo, useState } from 'react'
import { MdOutlineExpandMore as ExpandMore } from 'react-icons/md'
import type { ArticleSummary } from '../../../../core/types'
import { ARTICLE_TYPES } from '../../../../core/types'
import { ArticleRow } from '../../components/ArticleRow'
import { Button } from '../../components/Button'
import { areas } from '../../components/areas'
import { cx, EmptyState } from '../../components/primitives'
import { Search } from '../../icons'

const STEP = 10
const LABEL = 'block font-work text-base font-normal uppercase tracking-wider text-[#564241]'
const CTRL = 'w-full rounded border border-[#6B7280] bg-[#F4F5FC] font-work text-base text-[#141B2B] placeholder:text-[#6F5A58] focus:bg-[#E9EDFF] focus:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'

function Select({ id, value, onChange, children }: { id: string; value: string; onChange: (v: string) => void; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={cx(CTRL, 'cursor-pointer appearance-none px-3 py-2 pr-9')}>{children}</select>
      <ExpandMore className="pointer-events-none absolute right-2.5 top-2.5 h-[18px] w-[18px] text-[#6F5A58]" aria-hidden="true" />
    </div>
  )
}

export function ArchiveList({ articles }: { articles: ArticleSummary[] }) {
  const id = useId()
  const [q, setQ] = useState('')
  const [area, setArea] = useState('')
  const [type, setType] = useState('')
  const [iss, setIss] = useState('')
  const [shown, setShown] = useState(STEP)
  const term = q.trim().toLowerCase()
  useEffect(() => { setShown(STEP) }, [term, area, type, iss])

  const issueKeys = useMemo(() => [...new Set(articles.map((a) => `${a.volume}.${a.issue}`))].sort((a, b) => b.localeCompare(a, undefined, { numeric: true })), [articles])
  const rows = useMemo(() => articles
    .filter((a) => (!area || a.subject === area) && (!type || a.type === type) && (!iss || `${a.volume}.${a.issue}` === iss) &&
      (!term || a.title.toLowerCase().includes(term) || a.subject.toLowerCase().includes(term) || a.authors.some((n) => n.toLowerCase().includes(term))))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.title.localeCompare(b.title)), [articles, area, type, iss, term])
  const dirty = !!(term || area || type || iss)
  const reset = () => { setQ(''); setArea(''); setType(''); setIss('') }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <aside aria-label="Archive filters" className="min-w-0 lg:col-span-3 lg:sticky lg:top-16">
        <div role="search" aria-label="Search the archive" className="space-y-6 rounded bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-2 pb-1">
            <h3 className="font-newsreader text-base text-[#141B2B]">Search the archive</h3>
            <span role="status" aria-live="polite" className="sr-only">{rows.length} results</span>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${id}-q`} className={LABEL}>Title or Author</label>
            <div className="relative flex items-center">
              <Search className="pointer-events-none absolute left-2.5 h-[18px] w-[18px] text-[#6F5A58]" aria-hidden="true" />
              <input id={`${id}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" placeholder="Search all issues" className={cx(CTRL, 'py-1.5 pl-9 pr-3')} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${id}-a`} className={LABEL}>Research Area</label>
            <Select id={`${id}-a`} value={area} onChange={setArea}><option value="">All areas</option>{areas.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}</Select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${id}-t`} className={LABEL}>Article Type</label>
            <Select id={`${id}-t`} value={type} onChange={setType}><option value="">All types</option>{ARTICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
          </div>
          <div className="space-y-1.5">
            <label htmlFor={`${id}-i`} className={LABEL}>Issue</label>
            <Select id={`${id}-i`} value={iss} onChange={setIss}>
              <option value="">All issues</option>{issueKeys.map((k) => { const [v, n] = k.split('.'); return <option key={k} value={k}>Volume {v}, Issue {n}</option> })}
            </Select>
          </div>
          {dirty && <button type="button" onClick={reset} className="inline-flex min-h-11 w-full items-center justify-center gap-1 rounded border border-[#DCC0BE]/50 bg-[#E9EDFF] px-3 py-2.5 font-work text-xs font-medium uppercase tracking-wider text-[#141B2B] transition-colors motion-reduce:transition-none hover:bg-[#E1E8FD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700">Clear filters</button>}
        </div>
      </aside>

      <div className="min-w-0 lg:col-span-9">
        {rows.length === 0 ? <EmptyState title="No archived articles match" text="Check the spelling or remove a filter." action={<Button variant="primary" onClick={reset}>Clear filters</Button>} /> : (
          <>
            <ol>{rows.slice(0, shown).map((a) => <ArticleRow key={a.paperId} article={a} terms={term ? [term] : []} />)}</ol>
            {rows.length > shown && <div className="mt-6 text-center"><Button variant="outline" className="h-11" onClick={() => setShown((n) => n + STEP)}>Show {Math.min(STEP, rows.length - shown)} more of {rows.length - shown} remaining</Button></div>}
          </>
        )}
      </div>
    </div>
  )
}
