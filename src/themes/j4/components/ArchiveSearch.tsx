// The search bar that overlaps the bottom edge of the home hero. Suggestions come from `onSuggest` (core API): articles, authors, keywords,
// and a direct match when a DOI or Paper ID is pasted ("Open article" / "Track this paper").
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { useRouter } from '../../../core/router'
import type { SearchSuggestions } from '../../../core/types'
import { Button } from './Button'
import { cx } from './primitives'
import { useSearchApi } from './searchContext'
import { Book, FactCheck, Hash, Person, Search, Track } from '../icons'

interface Row { key: string; group: string; icon: ReactNode; label: string; sub?: string; run: () => void }
const ICON = 'h-[18px] w-[18px] shrink-0 text-cobalt-700'

/** `bar` is the large card search; `compact` is a single slim field for the navigation bar. */
export function ArchiveSearch({ className, autoFocus, variant = 'bar', placeholder }: { className?: string; autoFocus?: boolean; variant?: 'bar' | 'compact'; placeholder?: string }) {
  const compact = variant === 'compact'
  const { onSearch, onSuggest } = useSearchApi()
  const { navigate } = useRouter()
  const id = useId()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [data, setData] = useState<SearchSuggestions | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const term = q.trim()

  useEffect(() => {
    if (term.length < 2) { setData(null); return }
    let live = true
    const t = setTimeout(() => { onSuggest(term).then((d) => live && setData(d)).catch(() => live && setData(null)) }, 150)
    return () => { live = false; clearTimeout(t) }
  }, [term, onSuggest])
  useEffect(() => {
    const onDown = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  const go = (to: string) => { setOpen(false); navigate(to) }
  const rows = useMemo<Row[]>(() => {
    if (!data) return []
    const out: Row[] = []
    if (data.direct) {
      const d = data.direct
      const grp = d.via === 'doi' ? 'DOI match' : 'Paper ID match'
      out.push({ key: 'open', group: grp, icon: <FactCheck className={ICON} aria-hidden="true" />, label: d.article ? `Open article: ${d.article.title}` : `${d.paperId} is not a published article`, sub: d.paperId, run: () => go(d.article ? paths.article(d.paperId) : paths.search(d.paperId)) })
      out.push({ key: 'track', group: grp, icon: <Track className={ICON} aria-hidden="true" />, label: 'Track this paper', sub: `Check the review status of ${d.paperId}`, run: () => go(`${paths.track}?id=${d.paperId}`) })
    }
    data.articles.slice(0, 4).forEach((a) => out.push({ key: a.paperId, group: 'Articles', icon: <Book className={ICON} aria-hidden="true" />, label: a.title, sub: `${a.authors[0]}${a.authors.length > 1 ? ' et al.' : ''} · ${a.subject}`, run: () => go(paths.article(a.paperId)) }))
    data.authors.forEach((a) => out.push({ key: `p-${a.name}`, group: 'Authors', icon: <Person className={ICON} aria-hidden="true" />, label: a.name, sub: `${a.count} article${a.count === 1 ? '' : 's'}`, run: () => go(paths.search(a.name)) }))
    data.keywords.forEach((k) => out.push({ key: `k-${k}`, group: 'Keywords', icon: <Hash className={ICON} aria-hidden="true" />, label: k, run: () => go(paths.search(k)) }))
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (active >= 0 && rows[active]) { rows[active].run(); return }
    if (data?.direct?.article) { go(paths.article(data.direct.paperId)); return }
    if (term) { setOpen(false); onSearch(term) }
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((i) => Math.min(rows.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(-1, i - 1)) }
    else if (e.key === 'Escape') setOpen(false)
  }
  const show = open && term.length >= 2 && rows.length > 0

  return (
    <div ref={box} className={cx('relative', className)}>
      <form role="search" onSubmit={submit} className={compact ? 'flex items-center gap-2' : 'flex flex-col gap-3 rounded-pane border border-abyss-200 bg-white p-3 shadow-float sm:flex-row sm:items-center sm:p-4'}>
        <label htmlFor={`${id}-q`} className={compact ? 'sr-only' : 'hidden shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-steel-600 lg:block'}>Search the archive</label>
        <div className={cx('flex min-w-0 flex-1 items-center gap-3 rounded-ctl border border-abyss-300 bg-abyss-50 px-3.5 focus-within:border-azure-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-azure-600/15', compact ? 'h-10' : 'h-12')}>
          <Search className="h-5 w-5 shrink-0 text-steel-500" aria-hidden="true" />
          <input id={`${id}-q`} value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }} onFocus={() => setOpen(true)} onKeyDown={onKey}
            role="combobox" aria-expanded={show} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
            type="text" autoComplete="off" autoFocus={autoFocus} placeholder={placeholder ?? `Title, author, keyword, DOI or ${journal.paperIdPrefix} Paper ID`}
            className={cx('min-w-0 flex-1 bg-transparent text-abyss-900 placeholder:text-steel-500 focus:outline-none focus-visible:!outline-none', compact ? 'text-sm' : 'text-base')} />
        </div>
        <Button type="submit" variant={compact ? 'primary' : 'cta'} className={compact ? 'h-10 px-4' : 'h-12 px-8 text-base'}>Search</Button>
      </form>
      {show && (
        <ul id={`${id}-list`} role="listbox" className={cx('absolute top-full z-40 mt-2 max-h-[22rem] overflow-auto rounded-pane border border-abyss-200 bg-white py-2 text-left shadow-float', compact ? 'right-0 w-[min(26rem,calc(100vw-2rem))]' : 'left-0 right-0')}>
          {rows.map((r, i) => (
            <li key={r.key} role="presentation">
              {(i === 0 || rows[i - 1].group !== r.group) && <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-steel-500">{r.group}</p>}
              <button id={`${id}-${i}`} type="button" role="option" aria-selected={active === i} onMouseDown={(e) => e.preventDefault()} onClick={r.run} onMouseEnter={() => setActive(i)}
                className={cx('flex w-full items-start gap-3 px-4 py-2 text-left', active === i && 'bg-azure-50')}>
                <span className="mt-0.5">{r.icon}</span>
                <span className="min-w-0"><span className="block text-sm font-medium text-abyss-900">{r.label}</span>{r.sub && <span className="block text-xs text-steel-600">{r.sub}</span>}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
