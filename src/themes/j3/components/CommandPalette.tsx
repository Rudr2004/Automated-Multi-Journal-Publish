// Command palette search (Ctrl/Cmd + K): instant results, quick actions, collections, and a direct match when a DOI or Paper ID is typed.
// Suggestion data comes from `onSuggest` (core API); this component only displays it.
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { useRouter } from '../../../core/router'
import type { SearchSuggestions, SuggestFn } from '../../../core/types'
import { themes } from './themes'
import { cx } from './primitives'
import { ArrowRight, Book, Calendar, Close, Enter, FactCheck, Hash, Layers, Person, Search, Submit, Track, Verified } from '../icons'

interface Row { key: string; group: string; icon: ReactNode; label: string; sub?: string; run: () => void }
const ICON = 'h-5 w-5 shrink-0 text-iris-700'

export function CommandPalette({ open, onClose, onSearch, onSuggest }: { open: boolean; onClose: () => void; onSearch: (q: string) => void; onSuggest: SuggestFn }) {
  const { navigate } = useRouter()
  const id = useId()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const [data, setData] = useState<SearchSuggestions | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const term = q.trim()

  useEffect(() => {
    if (!open) return
    setQ(''); setData(null); setActive(0)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => input.current?.focus(), 30)
    return () => { document.body.style.overflow = prev; clearTimeout(t) }
  }, [open])

  useEffect(() => {
    if (term.length < 2) { setData(null); return }
    let live = true
    const t = setTimeout(() => { onSuggest(term).then((d) => live && setData(d)).catch(() => live && setData(null)) }, 140)
    return () => { live = false; clearTimeout(t) }
  }, [term, onSuggest])

  const go = (to: string) => { onClose(); navigate(to) }
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = []
    const low = term.toLowerCase()
    if (term.length < 2) {
      const quick: [string, string, ReactNode][] = [
        ['Submit Manuscript', paths.submit, <Submit key="s" className={ICON} aria-hidden="true" />],
        ['Track My Paper', paths.track, <Track key="t" className={ICON} aria-hidden="true" />],
        ['Current Issue', paths.currentIssue, <Book key="c" className={ICON} aria-hidden="true" />],
        ['Past Issues', paths.pastIssues, <Calendar key="p" className={ICON} aria-hidden="true" />],
        ['Verify a Certificate', paths.verify(), <Verified key="v" className={ICON} aria-hidden="true" />],
        ['Editorial Board', paths.editorialBoard, <Person key="e" className={ICON} aria-hidden="true" />],
      ]
      quick.forEach(([label, to, icon]) => out.push({ key: `q-${to}`, group: 'Go to', icon, label, run: () => go(to) }))
      themes.forEach((t) => out.push({ key: `th-${t.id}`, group: 'Collections', icon: <Layers className={ICON} aria-hidden="true" />, label: t.name, sub: 'Browse articles', run: () => go(paths.search(t.name)) }))
      return out
    }
    if (data?.direct) {
      const d = data.direct
      out.push({ key: 'open', group: d.via === 'doi' ? 'DOI match' : 'Paper ID match', icon: <FactCheck className={ICON} aria-hidden="true" />, label: d.article ? `Open article: ${d.article.title}` : `${d.paperId} is not a published article`, sub: d.paperId, run: () => go(d.article ? paths.article(d.paperId) : paths.search(d.paperId)) })
      out.push({ key: 'track', group: d.via === 'doi' ? 'DOI match' : 'Paper ID match', icon: <Track className={ICON} aria-hidden="true" />, label: 'Track this paper', sub: `Check the review status of ${d.paperId}`, run: () => go(`${paths.track}?id=${d.paperId}`) })
    }
    themes.filter((t) => t.name.toLowerCase().includes(low)).forEach((t) => out.push({ key: `th-${t.id}`, group: 'Collections', icon: <Layers className={ICON} aria-hidden="true" />, label: t.name, sub: 'Browse articles', run: () => go(paths.search(t.name)) }))
    data?.articles.forEach((a) => out.push({ key: `a-${a.paperId}`, group: 'Articles', icon: <Book className={ICON} aria-hidden="true" />, label: a.title, sub: `${a.authors[0]}${a.authors.length > 1 ? ' et al.' : ''} · ${a.subject}`, run: () => go(paths.article(a.paperId)) }))
    data?.authors.forEach((a) => out.push({ key: `p-${a.name}`, group: 'Authors', icon: <Person className={ICON} aria-hidden="true" />, label: a.name, sub: `${a.count} article${a.count === 1 ? '' : 's'}`, run: () => go(paths.search(a.name)) }))
    data?.keywords.forEach((k) => out.push({ key: `k-${k}`, group: 'Keywords', icon: <Hash className={ICON} aria-hidden="true" />, label: k, run: () => go(paths.search(k)) }))
    out.push({ key: 'all', group: 'Search', icon: <Search className={ICON} aria-hidden="true" />, label: `Search all articles for “${term}”`, run: () => { onClose(); onSearch(term) } })
    return out
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term, data])

  useEffect(() => { setActive(0) }, [rows.length, term])
  useEffect(() => { document.getElementById(`${id}-${active}`)?.scrollIntoView({ block: 'nearest' }) }, [active, id])

  if (!open) return null
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => Math.min(rows.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(0, i - 1)) }
    else if (e.key === 'Enter') { e.preventDefault(); rows[active]?.run() }
    else if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'Tab') { e.preventDefault(); input.current?.focus() }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center px-3 pt-[8vh] sm:px-6" role="dialog" aria-modal="true" aria-label="Search" onKeyDown={onKey}>
      <div className="absolute inset-0 bg-night-900/70 motion-safe:animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl overflow-hidden bg-white shadow-dock motion-safe:animate-slide-down">
        <div className="flex items-center gap-3 border-b border-mauve-100 px-5">
          <Search className="h-6 w-6 shrink-0 text-mauve-500" aria-hidden="true" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} role="combobox" aria-expanded="true" aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={rows[active] ? `${id}-${active}` : undefined}
            type="text" autoComplete="off" spellCheck={false} aria-label="Search articles, authors, DOI or Paper ID" placeholder={`Search articles, authors, DOI or ${journal.paperIdPrefix} Paper ID`}
            className="min-w-0 flex-1 bg-transparent py-5 font-inter text-lg font-semibold text-night-900 placeholder:font-medium placeholder:text-mauve-400 focus:outline-none focus-visible:!outline-none" />
          <button type="button" onClick={onClose} aria-label="Close search" className="p-2 text-mauve-500 hover:bg-mauve-100"><Close className="h-5 w-5" aria-hidden="true" /></button>
        </div>
        <ul id={`${id}-list`} role="listbox" className="max-h-[60vh] overflow-y-auto py-2">
          {rows.map((r, i) => (
            <li key={r.key} role="presentation">
              {(i === 0 || rows[i - 1].group !== r.group) && <p className="px-5 pb-1 pt-3 font-inter text-[11px] font-semibold uppercase tracking-[0.08em] text-mauve-500">{r.group}</p>}
              <button id={`${id}-${i}`} type="button" role="option" aria-selected={active === i} tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={r.run} onMouseEnter={() => setActive(i)}
                className={cx('flex w-full items-center gap-3 px-5 py-2.5 text-left', active === i ? 'bg-iris-50' : '')}>
                {r.icon}
                <span className="min-w-0 flex-1"><span className="block break-words font-inter text-sm font-semibold text-night-900">{r.label}</span>{r.sub && <span className="block break-words text-xs text-mauve-600">{r.sub}</span>}</span>
                {active === i && <span className="hidden items-center gap-1 text-xs font-semibold text-mauve-500 sm:inline-flex"><Enter className="h-4 w-4" aria-hidden="true" /> Open</span>}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-3 border-t border-mauve-100 bg-iris-50 px-5 py-2.5 text-xs text-mauve-600">
          <span className="inline-flex items-center gap-1"><kbd className="border border-mauve-200 bg-white px-1.5 py-0.5 font-inter font-semibold text-night-900">↑</kbd><kbd className="border border-mauve-200 bg-white px-1.5 py-0.5 font-inter font-semibold text-night-900">↓</kbd> to move</span>
          <span className="inline-flex items-center gap-1"><kbd className="border border-mauve-200 bg-white px-1.5 py-0.5 font-inter font-semibold text-night-900">Esc</kbd> to close</span>
          <span className="hidden items-center gap-1 sm:inline-flex">Paste a DOI or Paper ID <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
        </div>
      </div>
    </div>
  )
}
