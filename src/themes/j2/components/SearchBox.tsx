// Search input with instant suggestions: articles, authors, keywords and a direct match when a DOI or Paper ID is typed.
// The suggestion data comes from `onSuggest` (core API); this component only displays it.
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { useRouter } from '../../../core/router'
import type { SearchSuggestions, SuggestFn } from '../../../core/types'
import { cx } from './primitives'
import { Book, Enter, FactCheck, Hash, Person, Search } from '../icons'

interface Row { key: string; group: string; icon: ReactNode; label: string; sub?: string; run: () => void }
const ICON = 'h-4 w-4 shrink-0 text-accent-700'

export function SearchBox({ onSearch, onSuggest, placeholder, size = 'md', autoFocus, onDone, className }: {
  onSearch: (q: string) => void
  onSuggest: SuggestFn
  placeholder?: string
  size?: 'md' | 'lg'
  autoFocus?: boolean
  /** Called after a search or a suggestion is chosen (e.g. to close the overlay). */
  onDone?: () => void
  className?: string
}) {
  const { navigate } = useRouter()
  const id = useId()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [data, setData] = useState<SearchSuggestions | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const term = q.trim()

  useEffect(() => {
    if (term.length < 2) { setData(null); return }
    let live = true
    const t = setTimeout(() => { onSuggest(term).then((d) => live && setData(d)).catch(() => live && setData(null)) }, 160)
    return () => { live = false; clearTimeout(t) }
  }, [term, onSuggest])

  const go = (to: string) => { setOpen(false); onDone?.(); navigate(to) }
  const rows = useMemo<Row[]>(() => {
    if (!data) return []
    const out: Row[] = []
    if (data.direct) {
      const d = data.direct
      out.push({ key: 'direct', group: d.via === 'doi' ? 'DOI match' : 'Paper ID match', icon: <FactCheck className={ICON} aria-hidden="true" />,
        label: d.article?.title ?? `${d.paperId} (not found)`, sub: `${d.via === 'doi' ? 'DOI' : 'Paper ID'} ${d.paperId}`, run: () => go(paths.article(d.paperId)) })
    }
    data.articles.forEach((a) => out.push({ key: `a-${a.paperId}`, group: 'Articles', icon: <Book className={ICON} aria-hidden="true" />, label: a.title, sub: `${a.authors[0]}${a.authors.length > 1 ? ' et al.' : ''} · ${a.subject}`, run: () => go(paths.article(a.paperId)) }))
    data.authors.forEach((a) => out.push({ key: `p-${a.name}`, group: 'Authors', icon: <Person className={ICON} aria-hidden="true" />, label: a.name, sub: `${a.count} article${a.count === 1 ? '' : 's'}`, run: () => go(paths.search(a.name)) }))
    data.keywords.forEach((k) => out.push({ key: `k-${k}`, group: 'Keywords', icon: <Hash className={ICON} aria-hidden="true" />, label: k, run: () => go(paths.search(k)) }))
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (active >= 0 && rows[active]) { rows[active].run(); return }
    if (!term) { input.current?.focus(); return }
    setOpen(false); onDone?.(); onSearch(term)
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((i) => Math.min(rows.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(-1, i - 1)) }
    else if (e.key === 'Escape') setOpen(false)
  }
  const showList = open && term.length >= 2 && rows.length > 0
  const lg = size === 'lg'

  return (
    <div className={cx('relative', className)}>
      <form role="search" onSubmit={submit} className={cx('flex items-center gap-2 rounded-panel border border-graphite-300 bg-white shadow-card focus-within:border-accent-700 focus-within:ring-2 focus-within:ring-accent-700/30', lg ? 'p-2 pl-4' : 'p-1.5 pl-3')}>
        <Search className={cx('shrink-0 text-graphite-500', lg ? 'h-6 w-6' : 'h-5 w-5')} aria-hidden="true" />
        <input ref={input} autoFocus={autoFocus} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }} onFocus={() => setOpen(true)} onKeyDown={onKey}
          role="combobox" aria-expanded={showList} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
          type="search" autoComplete="off" aria-label="Search articles, authors, keywords, DOI or Paper ID"
          placeholder={placeholder ?? `Search articles, authors, DOI or ${journal.paperIdPrefix} Paper ID`}
          className={cx('min-w-0 flex-1 bg-transparent text-graphite-800 placeholder:text-graphite-500 focus:outline-none focus-visible:!outline-none [&::-webkit-search-cancel-button]:hidden', lg ? 'py-2.5 text-lg' : 'py-1.5 text-base')} />
        <button type="submit" className={cx('shrink-0 rounded-soft bg-brand-800 font-semibold text-white hover:bg-brand-900', lg ? 'px-6 py-3 text-base' : 'px-4 py-2 text-sm')}>Search</button>
      </form>
      {showList && (
        <ul id={`${id}-list`} role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[22rem] overflow-auto rounded-panel border border-graphite-200 bg-white py-2 text-left shadow-pop">
          {rows.map((r, i) => (
            <li key={r.key} role="presentation">
              {(i === 0 || rows[i - 1].group !== r.group) && <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-graphite-500">{r.group}</p>}
              <button id={`${id}-${i}`} type="button" role="option" aria-selected={active === i} onMouseDown={(e) => e.preventDefault()} onClick={r.run} onMouseEnter={() => setActive(i)}
                className={cx('flex w-full items-start gap-3 px-4 py-2 text-left', active === i ? 'bg-accent-50' : 'hover:bg-graphite-50')}>
                <span className="mt-0.5">{r.icon}</span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-medium text-graphite-800">{r.label}</span>{r.sub && <span className="block text-xs text-graphite-600">{r.sub}</span>}</span>
                {active === i && <Enter className="mt-1 h-4 w-4 text-graphite-500" aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
