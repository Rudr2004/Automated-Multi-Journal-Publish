// Searchable, filterable list of every archived article (by text, research area, article type and issue), newest first.
import { useEffect, useId, useMemo, useState } from 'react'
import type { ArticleSummary } from '../../../../core/types'
import { ARTICLE_TYPES } from '../../../../core/types'
import { ArticleRow } from '../../components/ArticleRow'
import { Button } from '../../components/Button'
import { areas } from '../../components/areas'
import { FIELD } from '../../components/PageBand'
import { EmptyState } from '../../components/primitives'
import { Search } from '../../icons'

const STEP = 10
const lab = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.06em] text-steel-700'

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
    <div>
      <div role="search" aria-label="Search the archive" className="grid gap-3 rounded-pane border border-abyss-200 bg-abyss-50 p-4 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <label htmlFor={`${id}-q`} className={lab}>Title or author</label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-500" aria-hidden="true" />
            <input id={`${id}-q`} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" placeholder="Search all issues" className={`${FIELD} w-full pl-9`} />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-a`} className={lab}>Research area</label>
          <select id={`${id}-a`} value={area} onChange={(e) => setArea(e.target.value)} className={`${FIELD} w-full`}><option value="">All areas</option>{areas.map((a) => <option key={a.id} value={a.name}>{a.name}</option>)}</select>
        </div>
        <div>
          <label htmlFor={`${id}-t`} className={lab}>Article type</label>
          <select id={`${id}-t`} value={type} onChange={(e) => setType(e.target.value)} className={`${FIELD} w-full`}><option value="">All types</option>{ARTICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select>
        </div>
        <div>
          <label htmlFor={`${id}-i`} className={lab}>Issue</label>
          <select id={`${id}-i`} value={iss} onChange={(e) => setIss(e.target.value)} className={`${FIELD} w-full`}>
            <option value="">All issues</option>{issueKeys.map((k) => { const [v, n] = k.split('.'); return <option key={k} value={k}>Volume {v}, Issue {n}</option> })}
          </select>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p role="status" aria-live="polite" className="text-sm tabular-nums text-steel-700">{dirty ? `${rows.length} of ${articles.length} articles match` : `${articles.length} articles in the archive`}</p>
        {dirty && <Button variant="ghost" onClick={reset} className="h-11">Clear filters</Button>}
      </div>

      <div className="mt-6">
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
