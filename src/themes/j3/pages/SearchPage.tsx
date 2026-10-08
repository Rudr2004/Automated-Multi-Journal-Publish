// Search: query box, filter chips (theme, type, year), sort, 10-per-page results as editorial rows; with no query it shows the eight themes.
import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { ARTICLE_TYPES } from '../../../core/types'
import { Button } from '../components/Button'
import { Container, cx, EmptyState, Kicker } from '../components/primitives'
import { useSearchApi } from '../components/searchContext'
import { themeColor, themes } from '../components/themes'
import { ArrowRight, ChevronLeft, ChevronRight, Search } from '../icons'

type Sort = 'relevance' | 'newest' | 'views' | 'cited'
const SORTS: { value: Sort; label: string }[] = [
  { value: 'relevance', label: 'Relevance' }, { value: 'newest', label: 'Newest first' }, { value: 'views', label: 'Most viewed' }, { value: 'cited', label: 'Most cited' },
]
const PER_PAGE = 10
const SUGGESTIONS = ['creative economy', 'museum', 'digital storytelling', 'music education', 'community arts', 'typography']
const yearOf = (a: ArticleSummary) => a.publishedAt.slice(0, 4)
const themeMatch = (q: string) => themes.find((t) => t.name.toLowerCase() === q.trim().toLowerCase())?.name ?? null

const count = <T,>(list: T[], key: (x: T) => string) => { const m = new Map<string, number>(); list.forEach((x) => m.set(key(x), (m.get(key(x)) ?? 0) + 1)); return m }

function Chips({ legend, options, selected, onToggle }: { legend: string; options: { value: string; n: number }[]; selected: string[]; onToggle: (v: string) => void }) {
  if (options.length === 0) return null
  return (
    <div role="group" aria-label={legend} className="flex flex-wrap items-center gap-2">
      <span className="mr-1 font-jakarta text-sm font-bold text-night-900" aria-hidden="true">{legend}</span>
      {options.map((o) => {
        const on = selected.includes(o.value)
        return (
          <button key={o.value} type="button" aria-pressed={on} onClick={() => onToggle(o.value)}
            className={cx('rounded-full px-3.5 py-2 font-jakarta text-sm font-bold', on ? 'bg-iris-700 text-white' : 'bg-iris-50 text-night-900 hover:bg-iris-100')}>
            {o.value} <span className={on ? 'text-iris-100' : 'text-mauve-600'}>({o.n})</span>
          </button>
        )
      })}
    </div>
  )
}

function pageList(page: number, pages: number): (number | '…')[] {
  const set = [...new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  set.forEach((n, i) => { if (i && n - set[i - 1] > 1) out.push('…'); out.push(n) })
  return out
}

function ThemeTiles() {
  return (
    <section aria-labelledby="themes-h" className="py-14 sm:py-20">
      <Kicker className="text-iris-700">Browse by theme</Kicker>
      <h2 id="themes-h" className="mb-8 mt-2 font-jakarta text-[1.75rem] font-extrabold tracking-tight text-night-900 sm:text-[2.125rem]">Eight themes, one journal</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((t, i) => (
          <li key={t.id}>
            <AppLink to={paths.search(t.name)} className="group relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-block p-6 text-white transition-transform motion-safe:hover:-translate-y-0.5 hover:shadow-lift3" style={{ backgroundColor: t.color }}>
              <span aria-hidden="true" className="font-jakarta text-[2.25rem] font-extrabold leading-none text-white/40">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-6 flex items-end justify-between gap-3">
                <span className="font-jakarta text-[1.5rem] font-extrabold leading-tight">{t.name}</span>
                <ArrowRight className="h-6 w-6 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function SearchPage({ query, results }: { query: string; results: ArticleSummary[] }) {
  const { onSearch } = useSearchApi()
  const term = query.trim()
  const [text, setText] = useState(query)
  const [subjects, setSubjects] = useState<string[]>(() => { const t = themeMatch(query); return t ? [t] : [] })
  const [types, setTypes] = useState<string[]>([])
  const [years, setYears] = useState<string[]>([])
  const [sort, setSort] = useState<Sort>('relevance')
  const [page, setPage] = useState(1)
  const top = useRef<HTMLDivElement>(null)
  const inputId = useId()
  const sortId = useId()

  useEffect(() => { setText(query); const t = themeMatch(query); setSubjects(t ? [t] : []); setTypes([]); setYears([]); setPage(1) }, [query])
  useEffect(() => { setPage(1) }, [subjects, types, years, sort])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) => set((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]))
  const subjectOpts = useMemo(() => [...count(results, (a) => a.subject)].map(([value, n]) => ({ value, n })), [results])
  const typeOpts = useMemo(() => { const c = count(results, (a) => a.type); return ARTICLE_TYPES.filter((t) => c.has(t)).map((value) => ({ value: value as string, n: c.get(value)! })) }, [results])
  const yearOpts = useMemo(() => [...count(results, yearOf)].sort((a, b) => b[0].localeCompare(a[0])).map(([value, n]) => ({ value, n })), [results])

  const filtered = useMemo(() => {
    const list = results.filter((a) => (!subjects.length || subjects.includes(a.subject)) && (!types.length || types.includes(a.type)) && (!years.length || years.includes(yearOf(a))))
    if (sort === 'newest') return [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    if (sort === 'views') return [...list].sort((a, b) => b.views - a.views)
    if (sort === 'cited') return [...list].sort((a, b) => b.citations - a.citations)
    return list
  }, [results, subjects, types, years, sort])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const current = Math.min(page, pages)
  const slice = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE)
  const active = subjects.length + types.length + years.length
  const clear = () => { setSubjects([]); setTypes([]); setYears([]) }
  const go = (n: number) => { setPage(n); top.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }) }
  const submit = (e: FormEvent) => { e.preventDefault(); if (text.trim()) onSearch(text.trim()) }

  return (
    <>
      <Helmet><title>{`${term ? `Search: ${term}` : 'Search'} | ${journal.shortName}`}</title><meta name="robots" content="noindex" /></Helmet>
      <section className="bg-iris-50">
        <Container className="py-12 sm:py-16">
          <Kicker className="text-iris-700">Search</Kicker>
          <h1 className="mt-3 font-jakarta font-extrabold leading-[1.05] tracking-tight text-night-900" style={{ fontSize: 'clamp(32px,3.4vw,44px)' }}>
            {term ? 'Search results' : 'Find an article'}
          </h1>
          <form role="search" onSubmit={submit} className="mt-6 max-w-2xl">
            <label htmlFor={inputId} className="sr-only">Search articles, authors, keywords, DOI or Paper ID</label>
            <div className="flex h-14 items-center gap-2 rounded-full bg-white pl-5 pr-1.5 shadow-lift3 ring-1 ring-mauve-200 focus-within:ring-2 focus-within:ring-iris-700">
              <Search className="h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />
              <input id={inputId} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Title, author, keyword or DOI…" autoComplete="off"
                className="min-w-0 flex-1 bg-transparent text-base text-night-900 placeholder:text-mauve-500 focus:outline-none focus-visible:!outline-none" />
              <button type="submit" className="h-11 shrink-0 rounded-full bg-iris-700 px-6 font-jakarta text-sm font-bold text-white hover:bg-iris-800">Search</button>
            </div>
          </form>
        </Container>
      </section>

      <Container>
        {!term && results.length === 0 ? (
          <ThemeTiles />
        ) : (
          <div ref={top} className="scroll-mt-32 py-12 sm:py-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p role="status" className="text-lg text-mauve-700">
                <strong className="font-jakarta font-extrabold text-night-900">{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'}{term && <> for <strong className="text-night-900">“{term}”</strong></>}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor={sortId} className="font-jakarta text-sm font-bold text-night-900">Sort by</label>
                <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-11 rounded-full border border-mauve-300 bg-white px-4 font-jakarta text-sm font-bold text-night-900">
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {results.length > 0 && (
              <div className="mt-6 space-y-3 border-y border-mauve-100 py-5">
                <Chips legend="Theme" options={subjectOpts} selected={subjects} onToggle={toggle(setSubjects)} />
                <Chips legend="Type" options={typeOpts} selected={types} onToggle={toggle(setTypes)} />
                <Chips legend="Year" options={yearOpts} selected={years} onToggle={toggle(setYears)} />
                {active > 0 && <button type="button" onClick={clear} className="font-jakarta text-sm font-bold text-iris-700 underline underline-offset-4 hover:text-iris-900">Clear all filters</button>}
              </div>
            )}

            {results.length === 0 ? (
              <div className="mt-10">
                <EmptyState title={`No articles found for “${term}”`} text="Check the spelling, try fewer words, or start from one of these ideas." />
                <ul className="mt-6 flex flex-wrap justify-center gap-2">
                  {SUGGESTIONS.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded-full bg-iris-50 px-4 py-2 font-jakarta text-sm font-bold text-iris-700 hover:bg-iris-100">{s}</AppLink></li>)}
                </ul>
                <p className="mt-8 text-center text-sm text-mauve-700">Or browse by theme:</p>
                <ul className="mt-3 flex flex-wrap justify-center gap-2">
                  {themes.map((t) => <li key={t.id}><AppLink to={paths.search(t.name)} className="inline-block rounded-full border border-mauve-300 px-4 py-2 font-jakarta text-sm font-bold text-night-900 hover:bg-iris-50">{t.name}</AppLink></li>)}
                </ul>
              </div>
            ) : filtered.length === 0 ? (
              <div className="mt-10"><EmptyState title="No results match these filters" text="Remove a filter to see more articles." action={<Button variant="primary" onClick={clear}>Clear all filters</Button>} /></div>
            ) : (
              <ol className="mt-4" start={(current - 1) * PER_PAGE + 1}>
                {slice.map((a, i) => (
                  <li key={a.paperId} className="relative grid gap-x-6 border-b border-mauve-100 py-8 sm:grid-cols-[3.5rem_1fr]">
                    <span aria-hidden="true" className="hidden font-jakarta text-[1.625rem] font-extrabold leading-none text-iris-200 sm:block">{String((current - 1) * PER_PAGE + i + 1).padStart(2, '0')}</span>
                    <div className="min-w-0">
                      <p className="font-jakarta text-sm font-extrabold" style={{ color: themeColor(a.subject) }}>{a.subject}</p>
                      <h2 className="mt-1.5 font-jakarta text-[1.5rem] font-extrabold leading-snug tracking-tight text-night-900 sm:text-[1.75rem]">
                        <AppLink to={paths.article(a.paperId)} className="hover:text-iris-700 after:absolute after:inset-0 after:content-['']">{a.title}</AppLink>
                      </h2>
                      <p className="mt-2 text-base font-semibold text-mauve-800">{a.authors.join(', ')}</p>
                      <p className="mt-3 line-clamp-2 max-w-3xl text-base text-mauve-700">{a.abstract}</p>
                      <p className="mt-3 text-sm text-mauve-600">{a.type} · Vol. {a.volume}, No. {a.issue} · pp. {a.pages} · {formatDate(a.publishedAt)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {pages > 1 && filtered.length > 0 && (
              <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
                <button type="button" disabled={current === 1} onClick={() => go(current - 1)} className="inline-flex h-11 items-center gap-1 rounded-full border-2 border-night-900 px-4 font-jakarta text-sm font-bold text-night-900 hover:bg-night-900 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-night-900">
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Previous
                </button>
                {pageList(current, pages).map((n, i) => n === '…' ? <span key={`g${i}`} aria-hidden="true" className="px-1 text-mauve-600">…</span> : (
                  <button key={n} type="button" onClick={() => go(n)} aria-label={`Page ${n}`} aria-current={n === current ? 'page' : undefined}
                    className={cx('h-11 min-w-11 rounded-full px-3 font-jakarta text-sm font-bold', n === current ? 'bg-iris-700 text-white' : 'bg-iris-50 text-night-900 hover:bg-iris-100')}>{n}</button>
                ))}
                <button type="button" disabled={current === pages} onClick={() => go(current + 1)} className="inline-flex h-11 items-center gap-1 rounded-full border-2 border-night-900 px-4 font-jakarta text-sm font-bold text-night-900 hover:bg-night-900 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-night-900">
                  Next <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        )}
      </Container>
    </>
  )
}
