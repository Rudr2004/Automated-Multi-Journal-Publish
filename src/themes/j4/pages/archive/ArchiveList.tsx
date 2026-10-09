// Searchable, filterable list of every archived article (by text, research area, article type and issue), newest first, with a sticky filter rail.
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
    <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-8">
      <aside aria-label="Archive filters" className="lg:sticky lg:top-16 lg:self-start">
        <div role="search" aria-label="Search the archive" className="rounded-pane border border-abyss-200 bg-white shadow-hair">
          <div className="border-b border-abyss-200 bg-abyss-50 px-4 py-3">
            <h3 className="font-serif4 text-base font-semibold text-abyss-900">Search the archive</h3>
            <p role="status" aria-live="polite" className="mt-0.5 text-[13px] tabular-nums text-steel-600">{dirty ? `${rows.length} of ${articles.length} articles match` : `${articles.length} articles in the archive`}</p>
          </div>
          <div className="space-y-4 p-4">
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
            {dirty && <Button variant="outline" onClick={reset} className="h-11 w-full">Clear filters</Button>}
          </div>
        </div>
      </aside>

      <div className="min-w-0">
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
