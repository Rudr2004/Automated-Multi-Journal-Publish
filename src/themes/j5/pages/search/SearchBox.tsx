// Search field for the results page, starting from the current query. Shows instant suggestions (articles, authors, keywords)
// and recognises a pasted DOI or Paper ID, offering "Open article" and "Track this paper".
import { useEffect, useId, useMemo, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { useRouter } from '../../../../core/router'
import type { SearchSuggestions } from '../../../../core/types'
import { Button } from '../../components/Button'
import { FIELD } from '../../components/PageBand'
import { cx } from '../../components/primitives'
import { useSearchApi } from '../../components/searchContext'
import { Search } from '../../icons'

interface Row { key: string; group: string; label: string; sub?: string; run: () => void }

export function SearchBox({ query }: { query: string }) {
  const { onSearch, onSuggest } = useSearchApi()
  const { navigate } = useRouter()
  const id = useId()
  const [q, setQ] = useState(query)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const [data, setData] = useState<SearchSuggestions | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const term = q.trim()
  useEffect(() => { setQ(query); setOpen(false) }, [query])
  useEffect(() => {
    if (term.length < 2 || term === query.trim()) { setData(null); return }
    let live = true
    const t = setTimeout(() => { onSuggest(term).then((d) => live && setData(d)).catch(() => live && setData(null)) }, 150)
    return () => { live = false; clearTimeout(t) }
  }, [term, query, onSuggest])
  useEffect(() => {
    const down = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', down)
    return () => document.removeEventListener('mousedown', down)
  }, [])

  const rows = useMemo<Row[]>(() => {
    if (!data) return []
    const go = (to: string) => { setOpen(false); navigate(to) }
    const out: Row[] = []
    if (data.direct) {
      const d = data.direct
      const g = d.via === 'doi' ? 'DOI match' : 'Paper ID match'
      out.push({ key: 'open', group: g, label: d.article ? `Open article: ${d.article.title}` : `${d.paperId} is not a published article`, sub: d.paperId, run: () => go(d.article ? paths.article(d.paperId) : paths.search(d.paperId)) })
      out.push({ key: 'track', group: g, label: 'Track this paper', sub: `Check the review status of ${d.paperId}`, run: () => go(`${paths.track}?id=${d.paperId}`) })
    }
    data.articles.slice(0, 4).forEach((a) => out.push({ key: a.paperId, group: 'Articles', label: a.title, sub: `${a.authors[0]}${a.authors.length > 1 ? ' et al.' : ''} · ${a.subject}`, run: () => go(paths.article(a.paperId)) }))
    data.authors.forEach((a) => out.push({ key: `p-${a.name}`, group: 'Authors', label: a.name, sub: `${a.count} article${a.count === 1 ? '' : 's'}`, run: () => go(paths.search(a.name)) }))
    data.keywords.forEach((k) => out.push({ key: `k-${k}`, group: 'Keywords', label: k, run: () => go(paths.search(k)) }))
    return out
  }, [data, navigate])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (active >= 0 && rows[active]) { rows[active].run(); return }
    if (data?.direct?.article) { navigate(paths.article(data.direct.paperId)); return }
    if (term) { setOpen(false); onSearch(term) }
  }
  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActive((i) => Math.min(rows.length - 1, i + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => Math.max(-1, i - 1)) }
    else if (e.key === 'Escape') setOpen(false)
  }
  const show = open && rows.length > 0

  return (
    <div ref={box} className="relative mt-6 max-w-3xl">
      <form role="search" onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={`${id}-q`} className="sr-only">Search articles, authors, keywords, DOI or Paper ID</label>
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ochre-700" aria-hidden="true" />
          <input id={`${id}-q`} type="text" value={q} autoComplete="off" role="combobox" aria-expanded={show} aria-controls={`${id}-list`} aria-autocomplete="list" aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
            onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }} onFocus={() => setOpen(true)} onKeyDown={onKey}
            placeholder={`Title, author, keyword, DOI or ${journal.paperIdPrefix} Paper ID`} className={cx(FIELD, 'h-12 w-full border-ochre-600/60 pl-11 text-base')} />
        </div>
        <Button type="submit" variant="cta" className="h-12 px-8 text-base">Search</Button>
      </form>
      {show && (
        <ul id={`${id}-list`} role="listbox" aria-label="Suggestions" className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[22rem] overflow-auto rounded border border-[#E6DCD0] bg-white py-2 text-left text-obsidian-900 shadow-lift">
          {rows.map((r, i) => (
            <li key={r.key} role="presentation">
              {(i === 0 || rows[i - 1].group !== r.group) && <p className="px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-obsidian-600">{r.group}</p>}
              <button id={`${id}-${i}`} type="button" role="option" aria-selected={active === i} onMouseDown={(e) => e.preventDefault()} onClick={r.run} onMouseEnter={() => setActive(i)}
                className={cx('flex min-h-11 w-full flex-col items-start justify-center px-4 py-2 text-left', active === i && 'bg-wine-50')}>
                <span className="text-sm font-medium">{r.label}</span>{r.sub && <span className="text-xs text-obsidian-600">{r.sub}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
