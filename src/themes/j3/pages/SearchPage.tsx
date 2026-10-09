// Search: scholarly query bar with theme scope, faceted filters, sort, 10-per-page results with highlighted terms; with no query it shows the themes.
import { Fragment, useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { ARTICLE_TYPES } from '../../../core/types'
import { AcButton, AcLabel, acInput } from '../components/AcademicUi'
import { Container, cx } from '../components/primitives'
import { useSearchApi } from '../components/searchContext'
import { themes } from '../components/themes'
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

function Facet({ legend, options, selected, onToggle }: { legend: string; options: { value: string; n: number }[]; selected: string[]; onToggle: (v: string) => void }) {
  if (options.length === 0) return null
  return (
    <fieldset className="border-t border-mauve-100 pt-4 first:border-t-0 first:pt-0">
      <legend className="mb-2 font-inter text-xs font-semibold uppercase tracking-[0.08em] text-iris-700">{legend}</legend>
      <ul className="space-y-1.5">
        {options.map((o) => {
          const on = selected.includes(o.value)
          return (
            <li key={o.value}>
              <label className="flex cursor-pointer items-start gap-2.5 font-inter text-sm text-night-700 hover:text-iris-700">
                <input type="checkbox" checked={on} onChange={() => onToggle(o.value)} className="mt-0.5 h-4 w-4 shrink-0 rounded-none border-mauve-300 text-iris-700 focus:ring-iris-700" />
                <span className="min-w-0 flex-1">{o.value}</span><span className="text-mauve-600">{o.n}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </fieldset>
  )
}

/** Wraps query words in <mark>. */
function Hi({ text, words }: { text: string; words: string[] }) {
  if (words.length === 0) return <>{text}</>
  const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(${words.map(esc).join('|')})`, 'gi')
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i} className="bg-[#FEF3C7] px-0.5 text-inherit">{p}</mark> : <Fragment key={i}>{p}</Fragment>))}</>
}

function pageList(page: number, pages: number): (number | '…')[] {
  const set = [...new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages))].sort((a, b) => a - b)
  const out: (number | '…')[] = []
  set.forEach((n, i) => { if (i && n - set[i - 1] > 1) out.push('…'); out.push(n) })
  return out
}

function ThemeTiles() {
  return (
    <section aria-labelledby="themes-h" className="py-12 sm:py-16">
      <AcLabel className="!text-ember-700">Browse by theme</AcLabel>
      <h2 id="themes-h" className="mb-6 mt-2 border-b-2 border-iris-700 pb-3 font-jakarta text-[1.5rem] font-semibold uppercase tracking-[0.02em] text-iris-700 sm:text-[1.75rem]">Themes</h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {themes.map((t, i) => (
          <li key={t.id}>
            <AppLink to={paths.search(t.name)} className="group flex min-h-[9rem] flex-col justify-between border border-t-2 border-mauve-100 border-t-iris-700 bg-white p-5 hover:border-iris-700">
              <span aria-hidden="true" className="font-jakarta text-[1.75rem] font-semibold leading-none text-mauve-300">{String(i + 1).padStart(2, '0')}</span>
              <span className="mt-5 flex items-end justify-between gap-3">
                <span className="font-jakarta text-[1.25rem] font-semibold leading-tight text-iris-700 group-hover:text-ember-700">{t.name}</span>
                <ArrowRight className="h-5 w-5 shrink-0 text-iris-700" aria-hidden="true" />
              </span>
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

const pageBtn = 'inline-flex h-10 min-w-10 items-center justify-center gap-1 border px-3 font-inter text-sm font-semibold'

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
  const scopeId = useId()

  useEffect(() => { setText(query); const t = themeMatch(query); setSubjects(t ? [t] : []); setTypes([]); setYears([]); setPage(1) }, [query])
  useEffect(() => { setPage(1) }, [subjects, types, years, sort])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) => set((l) => (l.includes(v) ? l.filter((x) => x !== v) : [...l, v]))
  const subjectOpts = useMemo(() => [...count(results, (a) => a.subject)].map(([value, n]) => ({ value, n })), [results])
  const typeOpts = useMemo(() => { const c = count(results, (a) => a.type); return ARTICLE_TYPES.filter((t) => c.has(t)).map((value) => ({ value: value as string, n: c.get(value)! })) }, [results])
  const yearOpts = useMemo(() => [...count(results, yearOf)].sort((a, b) => b[0].localeCompare(a[0])).map(([value, n]) => ({ value, n })), [results])
  const words = useMemo(() => (themeMatch(term) ? [] : [...new Set(term.split(/\s+/).filter((w) => w.length > 1))]), [term])

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
  const scope = subjects.length === 1 ? subjects[0] : ''

  return (
    <>
      <Helmet><title>{`${term ? `Search: ${term}` : 'Search'} | ${journal.shortName}`}</title><meta name="robots" content="noindex" /></Helmet>
      <section className="border-b border-mauve-100 bg-[#F8FAFC]">
        <Container className="py-10 sm:py-14">
          <AcLabel className="!text-ember-700">{journal.shortName} · Search the archive</AcLabel>
          <h1 className="mt-3 font-jakarta text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-[1.1] text-iris-700">{term ? 'Search results' : 'Find an article'}</h1>
          <form role="search" onSubmit={submit} className="mt-6 grid max-w-4xl gap-3 md:grid-cols-[1fr_14rem_auto]">
            <div>
              <label htmlFor={inputId} className="sr-only">Search articles, authors, keywords, DOI or Paper ID</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-mauve-600" aria-hidden="true" />
                <input id={inputId} type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Title, author, keyword or DOI…" autoComplete="off" className={cx(acInput, '!pl-10')} />
              </div>
            </div>
            <div>
              <label htmlFor={scopeId} className="sr-only">Limit results to a theme</label>
              <select id={scopeId} value={scope} disabled={subjectOpts.length < 2 && !scope} onChange={(e) => setSubjects(e.target.value ? [e.target.value] : [])} className={cx(acInput, 'pr-8 disabled:opacity-60')}>
                <option value="">All themes</option>
                {subjectOpts.map((o) => <option key={o.value} value={o.value}>{o.value}</option>)}
              </select>
            </div>
            <button type="submit" className="inline-flex items-center justify-center gap-2 border border-iris-700 bg-iris-700 px-8 py-3 font-inter text-xs font-semibold uppercase tracking-[0.08em] text-white hover:bg-iris-600">Search</button>
          </form>
          {!term && (
            <p className="mt-4 font-inter text-sm text-mauve-700">Try: {SUGGESTIONS.slice(0, 4).map((s, i) => <Fragment key={s}>{i > 0 && ', '}<AppLink to={paths.search(s)} className="font-semibold text-iris-700 underline underline-offset-4 hover:text-ember-700">{s}</AppLink></Fragment>)}</p>
          )}
        </Container>
      </section>

      <Container>
        {!term && results.length === 0 ? (
          <ThemeTiles />
        ) : (
          <div ref={top} className="scroll-mt-32 py-10 sm:py-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-iris-700 pb-3">
              <p role="status" className="font-inter text-base text-mauve-700">
                <strong className="font-semibold text-night-700">{filtered.length}</strong> result{filtered.length === 1 ? '' : 's'}{term && <> for <strong className="font-semibold text-night-700">“{term}”</strong></>}
              </p>
              <div className="flex items-center gap-2">
                <label htmlFor={sortId} className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600">Sort by</label>
                <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 border border-mauve-300 bg-white py-0 pl-3 pr-8 font-inter text-sm font-semibold text-night-700">
                  {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className={cx('mt-6 grid gap-8', results.length > 0 && 'lg:grid-cols-[15rem_1fr]')}>
              {results.length > 0 && (
                <aside aria-label="Refine results" className="space-y-4 self-start border border-mauve-100 bg-[#F8FAFC] p-4">
                  <Facet legend="Theme" options={subjectOpts} selected={subjects} onToggle={toggle(setSubjects)} />
                  <Facet legend="Article type" options={typeOpts} selected={types} onToggle={toggle(setTypes)} />
                  <Facet legend="Year" options={yearOpts} selected={years} onToggle={toggle(setYears)} />
                  {active > 0 && <button type="button" onClick={clear} className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-iris-700 underline underline-offset-4 hover:text-ember-700">Clear all filters</button>}
                </aside>
              )}

              <div className="min-w-0">
                {results.length === 0 ? (
                  <div>
                    <div className="border border-mauve-100 bg-[#F8FAFC] p-8 text-center">
                      <p className="font-jakarta text-xl font-semibold text-iris-700">No articles found for “{term}”</p>
                      <p className="mt-1 font-inter text-sm text-mauve-700">Check the spelling, try fewer words, or start from one of these ideas.</p>
                    </div>
                    <ul className="mt-6 flex flex-wrap justify-center gap-2">
                      {SUGGESTIONS.map((s) => <li key={s}><AppLink to={paths.search(s)} className="inline-block border border-mauve-100 bg-[#F8FAFC] px-3 py-2 font-inter text-sm font-semibold text-iris-700 hover:border-iris-700">{s}</AppLink></li>)}
                    </ul>
                    <p className="mt-8 text-center font-inter text-sm text-mauve-700">Or browse by theme:</p>
                    <ul className="mt-3 flex flex-wrap justify-center gap-2">
                      {themes.map((t) => <li key={t.id}><AppLink to={paths.search(t.name)} className="inline-block border border-mauve-300 px-3 py-2 font-inter text-sm font-semibold text-night-700 hover:border-iris-700 hover:text-iris-700">{t.name}</AppLink></li>)}
                    </ul>
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="border border-mauve-100 bg-[#F8FAFC] p-10 text-center">
                    <p className="font-jakarta text-xl font-semibold text-iris-700">No results match these filters</p>
                    <p className="mt-1 font-inter text-sm text-mauve-700">Remove a filter to see more articles.</p>
                    <AcButton className="mt-4" onClick={clear}>Clear all filters</AcButton>
                  </div>
                ) : (
                  <ol start={(current - 1) * PER_PAGE + 1}>
                    {slice.map((a, i) => (
                      <li key={a.paperId} className="relative border-b border-mauve-100 py-6 first:pt-0">
                        <p className="font-inter text-xs font-semibold uppercase tracking-[0.08em] text-ember-700">{a.type} · {a.subject}</p>
                        <h2 className="mt-1.5 font-jakarta text-[1.375rem] font-semibold leading-snug text-iris-700 sm:text-[1.5rem]">
                          <span className="sr-only">{(current - 1) * PER_PAGE + i + 1}. </span>
                          <AppLink to={paths.article(a.paperId)} className="hover:text-ember-700 hover:underline after:absolute after:inset-0 after:content-['']"><Hi text={a.title} words={words} /></AppLink>
                        </h2>
                        <p className="mt-1.5 font-inter text-sm font-semibold text-night-700"><Hi text={a.authors.join(', ')} words={words} /></p>
                        <p className="mt-2 line-clamp-2 max-w-3xl font-jakarta text-base leading-relaxed text-mauve-700"><Hi text={a.abstract} words={words} /></p>
                        <p className="mt-2 font-inter text-xs text-mauve-600">Vol. {a.volume}, No. {a.issue} · pp. {a.pages} · {formatDate(a.publishedAt)} · {a.paperId}</p>
                      </li>
                    ))}
                  </ol>
                )}

                {pages > 1 && filtered.length > 0 && (
                  <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center gap-2">
                    <button type="button" disabled={current === 1} onClick={() => go(current - 1)} className={cx(pageBtn, 'border-iris-700 text-iris-700 hover:bg-iris-700 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-iris-700')}>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" /> Previous
                    </button>
                    {pageList(current, pages).map((n, i) => n === '…' ? <span key={`g${i}`} aria-hidden="true" className="px-1 text-mauve-600">…</span> : (
                      <button key={n} type="button" onClick={() => go(n)} aria-label={`Page ${n}`} aria-current={n === current ? 'page' : undefined}
                        className={cx(pageBtn, n === current ? 'border-iris-700 bg-iris-700 text-white' : 'border-mauve-100 text-night-700 hover:border-iris-700')}>{n}</button>
                    ))}
                    <button type="button" disabled={current === pages} onClick={() => go(current + 1)} className={cx(pageBtn, 'border-iris-700 text-iris-700 hover:bg-iris-700 hover:text-white disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-iris-700')}>
                      Next <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </>
  )
}
