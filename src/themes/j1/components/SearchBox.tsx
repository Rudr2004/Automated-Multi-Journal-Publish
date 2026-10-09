import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import type { SearchSuggestions } from '../../../mock-data/journals/j1'
import { BASE, paths } from '../../../config/routes'
import { useRouter } from '../../../core/router'
import { Description, Explore, FactCheck, Hash, KeyboardReturn, Person, Search, X } from './uiIcons'

export type SuggestFn = (q: string) => Promise<SearchSuggestions>

const SEARCH_PATH = `${BASE}/search`

type Group = 'Quick actions' | 'Articles' | 'Authors' | 'Keywords' | 'Search'
interface Row { key: string; group: Group; icon: ReactNode; label: string; sub?: string; run: () => void }

/**
 * Smart search (ARIA combobox). Typing shows suggestions grouped as Articles, Authors and Keywords. If the text is an
 * exact DOI or Paper ID it offers "Open article" / "Track this paper". Enter searches; ↑/↓ pick; Esc closes.
 * On the results page the box mirrors the `q` in the URL.
 */
export function SearchBox({ onSearch, onSuggest, id, className = '', large = false, variant = 'default' }: {
  onSearch: (q: string) => void
  onSuggest?: SuggestFn
  id?: string
  className?: string
  large?: boolean
  /** 'nav' is the compact white field used inside the navy navigation bar. */
  variant?: 'default' | 'nav'
}) {
  const nav = variant === 'nav'
  const uid = useId()
  const inputId = id ?? `search-${uid}`
  const listId = `${inputId}-list`
  const { pathname, search, navigate } = useRouter()
  const urlQuery = pathname === SEARCH_PATH ? new URLSearchParams(search).get('q') ?? '' : ''

  const [q, setQ] = useState(urlQuery)
  const [data, setData] = useState<SearchSuggestions | null>(null)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [loading, setLoading] = useState(false)
  const latest = useRef(0)
  const box = useRef<HTMLDivElement>(null)
  const term = q.trim()

  useEffect(() => { setQ(urlQuery) }, [urlQuery])

  // Debounced suggestions; stale responses are ignored.
  useEffect(() => {
    if (!onSuggest || term.length < 2 || !open) { setData(null); setLoading(false); return }
    const ticket = ++latest.current
    setLoading(true)
    const t = setTimeout(() => {
      onSuggest(term).then((r) => { if (ticket === latest.current) { setData(r); setLoading(false); setActive(-1) } })
    }, 180)
    return () => clearTimeout(t)
  }, [term, open, onSuggest])

  const close = () => { setOpen(false); setActive(-1) }
  const run = (value: string) => { const t = value.trim(); if (!t) return; close(); onSearch(t) }
  const go = (to: string) => { close(); navigate(to) }

  const rows = useMemo<Row[]>(() => {
    if (!data) return []
    const r: Row[] = []
    const icon = 'h-4 w-4 shrink-0 text-scholar'
    if (data.direct) {
      const d = data.direct
      if (d.article) r.push({ key: 'open', group: 'Quick actions', icon: <FactCheck className={icon} aria-hidden />, label: 'Open article', sub: d.article.title, run: () => go(paths.article(d.paperId)) })
      r.push({ key: 'track', group: 'Quick actions', icon: <Explore className={icon} aria-hidden />, label: 'Track this paper', sub: `${d.paperId}${d.via === 'doi' ? ' (from DOI)' : ''}`, run: () => go(`${paths.track}?id=${d.paperId}`) })
    }
    data.articles.forEach((a) => r.push({ key: `a-${a.paperId}`, group: 'Articles', icon: <Description className={icon} aria-hidden />, label: a.title, sub: `${a.authors.join(', ')} · ${a.subject}`, run: () => go(paths.article(a.paperId)) }))
    data.authors.forEach((a) => r.push({ key: `p-${a.name}`, group: 'Authors', icon: <Person className={icon} aria-hidden />, label: a.name, sub: `${a.count} article${a.count === 1 ? '' : 's'}`, run: () => run(a.name) }))
    data.keywords.forEach((k) => r.push({ key: `k-${k}`, group: 'Keywords', icon: <Hash className={icon} aria-hidden />, label: k, run: () => run(k) }))
    r.push({ key: 'all', group: 'Search', icon: <Search className={icon} aria-hidden />, label: `See all results for “${term}”`, run: () => run(term) })
    return r
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, term])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (active >= 0 && rows[active]) rows[active].run()
    else run(q)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { close(); return }
    if (!rows.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((a) => (a + 1) % rows.length) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a <= 0 ? rows.length - 1 : a - 1)) }
  }

  const showList = open && !!onSuggest && term.length >= 2
  return (
    <div ref={box} className={`relative ${className}`} onBlur={(e) => { if (!box.current?.contains(e.relatedTarget as Node)) close() }}>
      <form role="search" onSubmit={submit}>
        <label htmlFor={inputId} className="sr-only">Search articles, authors, keywords or DOI</label>
        <div className={`flex overflow-hidden rounded border focus-within:border-scholar focus-within:bg-white focus-within:ring-2 focus-within:ring-scholar/20 ${nav ? 'h-9' : ''} border-line bg-white ${nav ? '' : large ? 'h-12' : 'h-11'}`}>
          <input id={inputId} type="search" value={q} autoComplete="off" spellCheck={false} maxLength={120}
            role="combobox" aria-expanded={showList} aria-controls={listId} aria-autocomplete="list" aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
            onChange={(e) => { setQ(e.target.value); setOpen(true) }} onFocus={() => setOpen(true)} onKeyDown={onKey}
            placeholder={nav ? 'Search articles, DOI…' : 'Search articles, authors, keywords, DOI…'} className={`min-w-0 flex-1 bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:hidden ${nav ? 'px-3' : 'px-4'}`} />
          {q && <button type="button" aria-label="Clear search" onClick={() => { setQ(''); setData(null) }} className="px-2 text-ink-muted hover:text-navy"><X className="h-4 w-4" aria-hidden /></button>}
          <button type="submit" aria-label="Search" className={`flex items-center justify-center bg-scholar text-white hover:bg-scholar-dark ${nav ? 'w-10' : 'w-12 !bg-navy hover:!bg-navy-900'}`}><Search className="h-4 w-4" aria-hidden /></button>
        </div>
      </form>

      {showList && (
        <div id={listId} role="listbox" aria-label="Search suggestions" className={`absolute top-full z-50 mt-2 max-h-[70vh] overflow-auto rounded border border-line bg-white shadow-xl ${nav ? 'right-0 w-[min(34rem,92vw)]' : 'inset-x-0'}`}>
          {loading && !rows.length && <p role="presentation" className="px-4 py-3 text-sm text-ink-muted">Searching…</p>}
          {rows.map((r, i) => (
            <div key={r.key} role="presentation">
              {(i === 0 || rows[i - 1].group !== r.group) && r.group !== 'Search' && (
                <p role="presentation" className="border-t border-line bg-paper px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-muted first:border-t-0">{r.group}</p>
              )}
              <div id={`${listId}-${i}`} role="option" aria-selected={active === i} onMouseDown={(e) => e.preventDefault()} onClick={r.run} onMouseEnter={() => setActive(i)}
                className={`flex cursor-pointer items-start gap-3 px-4 py-2.5 ${r.group === 'Search' ? 'border-t border-line bg-paper' : ''} ${active === i ? 'bg-scholar-soft' : ''}`}>
                <span className="mt-0.5">{r.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className={`block text-sm ${r.group === 'Search' ? 'font-semibold text-scholar' : r.group === 'Quick actions' ? 'font-semibold text-navy' : 'line-clamp-1 font-medium text-ink'}`}>{r.label}</span>
                  {r.sub && <span className="line-clamp-1 block text-xs text-ink-muted">{r.sub}</span>}
                </span>
                {r.group === 'Search' && <KeyboardReturn className="mt-0.5 h-4 w-4 text-scholar" aria-hidden />}
              </div>
            </div>
          ))}
          {!loading && data && rows.length === 1 && <p role="presentation" className="px-4 pb-3 pt-2 text-sm text-ink-muted">No quick matches. Press Enter to search everything.</p>}
        </div>
      )}
    </div>
  )
}
