// Hero search bar. Suggestions come from `onSuggest` (core API). A pasted DOI or Paper ID offers the article and its tracking page directly.
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { useRouter } from '../../../core/router'
import type { SearchSuggestions } from '../../../core/types'
import { cx } from './primitives'
import { useSearchApi } from './searchContext'
import { Book, FactCheck, Search, Track } from '../icons'

interface Row { key: string; label: string; sub?: string; icon: React.ReactNode; run: () => void }

export function HeroSearch({ className }: { className?: string }) {
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
    const t = setTimeout(() => { onSuggest(term).then((d) => live && setData(d)).catch(() => live && setData(null)) }, 160)
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
    const ic = 'h-5 w-5 shrink-0 text-iris-700'
    if (data.direct) {
      const d = data.direct
      out.push({ key: 'open', label: d.article ? `Open article: ${d.article.title}` : `${d.paperId} is not a published article`, sub: d.via === 'doi' ? 'DOI match' : 'Paper ID match', icon: <FactCheck className={ic} aria-hidden="true" />, run: () => go(d.article ? paths.article(d.paperId) : paths.search(d.paperId)) })
      out.push({ key: 'track', label: 'Track this paper', sub: d.paperId, icon: <Track className={ic} aria-hidden="true" />, run: () => go(`${paths.track}?id=${d.paperId}`) })
    }
    data.articles.slice(0, 3).forEach((a) => out.push({ key: a.paperId, label: a.title, sub: `${a.authors[0]}${a.authors.length > 1 ? ' et al.' : ''} · ${a.subject}`, icon: <Book className={ic} aria-hidden="true" />, run: () => go(paths.article(a.paperId)) }))
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
      <form role="search" onSubmit={submit} className="flex h-[52px] items-center gap-2 rounded-full bg-white pl-5 pr-1.5 shadow-lift3 ring-1 ring-mauve-200 focus-within:ring-2 focus-within:ring-iris-700">
        <Search className="h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />
        <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }} onFocus={() => setOpen(true)} onKeyDown={onKey}
          role="combobox" aria-expanded={show} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
          type="text" autoComplete="off" aria-label="Search articles, authors, keywords, DOI or Paper ID" placeholder="Title, author, keyword or DOI…"
          className="min-w-0 flex-1 bg-transparent text-base text-night-900 placeholder:text-mauve-500 focus:outline-none focus-visible:!outline-none" />
        <button type="submit" className="h-10 shrink-0 rounded-full bg-iris-700 px-6 font-jakarta text-sm font-bold text-white hover:bg-iris-800">Search</button>
      </form>
      {show && (
        <ul id={`${id}-list`} role="listbox" className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-block bg-white py-2 text-left shadow-dock ring-1 ring-mauve-100">
          {rows.map((r, i) => (
            <li key={r.key} role="presentation">
              <button id={`${id}-${i}`} type="button" role="option" aria-selected={active === i} onMouseDown={(e) => e.preventDefault()} onClick={r.run} onMouseEnter={() => setActive(i)}
                className={cx('flex w-full items-start gap-3 px-5 py-2.5 text-left', active === i && 'bg-iris-50')}>
                <span className="mt-0.5">{r.icon}</span>
                <span className="min-w-0"><span className="block truncate font-jakarta text-sm font-bold text-night-900">{r.label}</span>{r.sub && <span className="block truncate text-xs text-mauve-600">{r.sub}</span>}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="sr-only">Paste a DOI or a {journal.paperIdPrefix} Paper ID to open the article directly.</p>
    </div>
  )
}
