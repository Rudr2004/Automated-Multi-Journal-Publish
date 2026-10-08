// Past issues: a shelf of generated covers per year (tabs choose the year), then a search across every article.
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { ArticleTile } from '../components/ArticleTile'
import { Button } from '../components/Button'
import { IssueCover } from '../components/IssueCover'
import { Container, cx, EmptyState, Kicker } from '../components/primitives'
import { ChevronLeft, ChevronRight, Search } from '../icons'

const PAGE = 12
const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Shelf({ issues, label }: { issues: IssueSummary[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })
  const [edge, setEdge] = useState({ overflow: false, left: false, right: false })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdge({ overflow: el.scrollWidth > el.clientWidth + 1, left: el.scrollLeft > 4, right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 })
  }, [])
  useEffect(() => {
    measure()
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, issues])

  const scrollBy = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * Math.max(240, ref.current.clientWidth * 0.8), behavior: reduced() ? 'auto' : 'smooth' })
  const onKey = (e: KeyboardEvent) => {
    if (e.target !== e.currentTarget) return
    if (e.key === 'ArrowRight') { e.preventDefault(); scrollBy(1) } else if (e.key === 'ArrowLeft') { e.preventDefault(); scrollBy(-1) }
  }
  const onDown = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return
    drag.current = { down: true, x: e.clientX, left: ref.current.scrollLeft, moved: false }
  }
  const onMove = (e: PointerEvent) => {
    const d = drag.current
    if (!d.down || !ref.current) return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 5) d.moved = true
    if (d.moved) ref.current.scrollLeft = d.left - dx
  }
  const onUp = () => { drag.current.down = false }

  const arrow = 'absolute top-[110px] z-10 hidden h-12 w-12 items-center justify-center rounded-full bg-night-900 text-white shadow-lift3 hover:bg-night-700 disabled:opacity-0 sm:inline-flex'
  return (
    <div className="relative">
      {edge.overflow && (
        <>
          <button type="button" onClick={() => scrollBy(-1)} disabled={!edge.left} aria-label="Scroll issues left" className={cx(arrow, '-left-3')}><ChevronLeft className="h-6 w-6" aria-hidden="true" /></button>
          <button type="button" onClick={() => scrollBy(1)} disabled={!edge.right} aria-label="Scroll issues right" className={cx(arrow, '-right-3')}><ChevronRight className="h-6 w-6" aria-hidden="true" /></button>
        </>
      )}
      <div ref={ref} role="region" aria-label={`${label}. Use the left and right arrow keys to scroll.`} tabIndex={0} onKeyDown={onKey} onScroll={measure}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp} onClickCapture={(e) => { if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false } }}
        className="flex cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto rounded-block px-1 pb-6 pt-2 active:cursor-grabbing [scrollbar-width:thin]">
        {issues.map((i) => (
          <AppLink key={`${i.volume}-${i.issue}`} to={paths.issue(i.volume, i.issue)} aria-label={`Volume ${i.volume}, Issue ${i.issue}, ${formatMonthYear(i.month)}, ${i.articleCount} articles`}
            className="group w-[190px] shrink-0 snap-start rounded-block sm:w-[220px]">
            <IssueCover volume={i.volume} issue={i.issue} className="transition-transform duration-200 motion-safe:group-hover:-translate-y-1" />
            <span className="mt-3 block font-jakarta text-base font-extrabold text-night-900 group-hover:text-iris-700">{formatMonthYear(i.month)}</span>
            <span className="block text-sm text-mauve-700">{i.articleCount} articles{i.isCurrent ? ' · Current' : ''}</span>
          </AppLink>
        ))}
      </div>
    </div>
  )
}

export function PastIssuesPage({ issues, articles }: { issues: IssueSummary[]; articles: ArticleSummary[] }) {
  const byYear = useMemo(() => {
    const m = new Map<string, IssueSummary[]>()
    ;[...issues].sort((a, b) => b.month.localeCompare(a.month)).forEach((i) => { const y = i.month.slice(0, 4); m.set(y, [...(m.get(y) ?? []), i]) })
    return m
  }, [issues])
  const years = [...byYear.keys()]
  const [year, setYear] = useState(years[0] ?? '')
  const [q, setQ] = useState('')
  const [shown, setShown] = useState(PAGE)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const tabId = useId()
  const searchId = useId()
  const term = q.trim().toLowerCase()
  const active = byYear.has(year) ? year : years[0]

  const results = useMemo(() => term ? articles.filter((a) => a.title.toLowerCase().includes(term) || a.authors.some((n) => n.toLowerCase().includes(term))) : [], [articles, term])
  useEffect(() => { setShown(PAGE) }, [term])

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % years.length : e.key === 'ArrowLeft' ? (i - 1 + years.length) % years.length : e.key === 'Home' ? 0 : e.key === 'End' ? years.length - 1 : -1
    if (next < 0) return
    e.preventDefault()
    setYear(years[next])
    tabs.current[next]?.focus()
  }

  return (
    <>
      <Helmet><title>{`Past issues | ${journal.shortName}`}</title></Helmet>
      <section className="bg-iris-50">
        <Container className="py-12 sm:py-16">
          <Kicker className="text-iris-700">Archive</Kicker>
          <h1 className="mt-3 font-jakarta font-extrabold leading-[1.05] tracking-tight text-night-900" style={{ fontSize: 'clamp(32px,3.4vw,44px)' }}>Past issues</h1>
          <p className="mt-4 max-w-2xl text-lg text-mauve-700">Every issue of {journal.name}, shelved by year. Pick a cover to open its table of contents.</p>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        {years.length === 0 ? (
          <EmptyState title="No issues published yet" text="Issues will appear here as soon as they are released." />
        ) : (
          <>
            <div role="tablist" aria-label="Year" className="mb-6 flex flex-wrap gap-2">
              {years.map((y, i) => (
                <button key={y} ref={(el) => { tabs.current[i] = el }} type="button" role="tab" id={`${tabId}-t-${y}`} aria-selected={active === y} aria-controls={`${tabId}-p`} tabIndex={active === y ? 0 : -1}
                  onClick={() => setYear(y)} onKeyDown={(e) => onTabKey(e, i)}
                  className={cx('rounded-full px-5 py-2.5 font-jakarta text-base font-extrabold', active === y ? 'bg-night-900 text-white' : 'bg-iris-50 text-night-900 hover:bg-iris-100')}>{y}</button>
              ))}
            </div>
            <div role="tabpanel" id={`${tabId}-p`} aria-labelledby={`${tabId}-t-${active}`}>
              <h2 className="mb-4 font-jakarta text-[1.75rem] font-extrabold tracking-tight text-night-900 sm:text-[2.125rem]">{active}</h2>
              <Shelf issues={byYear.get(active) ?? []} label={`Issues published in ${active}`} />
            </div>
          </>
        )}

        <section aria-labelledby={`${searchId}-h`} className="mt-20 border-t-2 border-night-900 pt-12 sm:mt-24">
          <h2 id={`${searchId}-h`} className="font-jakarta text-[1.75rem] font-extrabold tracking-tight text-night-900 sm:text-[2.125rem]">Search all articles</h2>
          <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-5 max-w-xl">
            <label htmlFor={searchId} className="sr-only">Search every issue by article title or author</label>
            <div className="flex h-[52px] items-center gap-2 rounded-full bg-white pl-5 pr-2 ring-1 ring-mauve-300 focus-within:ring-2 focus-within:ring-iris-700">
              <Search className="h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />
              <input id={searchId} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or author name"
                className="min-w-0 flex-1 bg-transparent text-base text-night-900 placeholder:text-mauve-500 focus:outline-none focus-visible:!outline-none" />
            </div>
          </form>
          <p role="status" className="mt-4 text-sm text-mauve-700">{term ? `${results.length} article${results.length === 1 ? '' : 's'} found` : `Type a title or an author to search ${articles.length} articles.`}</p>

          {term && (results.length === 0 ? (
            <div className="mt-6"><EmptyState title="No articles found" text="Check the spelling or try a shorter search." action={<Button variant="primary" onClick={() => setQ('')}>Clear search</Button>} /></div>
          ) : (
            <>
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.slice(0, shown).map((a, i) => <ArticleTile key={a.paperId} article={a} surface={i} />)}
              </div>
              {results.length > shown && <div className="mt-8 text-center"><Button variant="outline" onClick={() => setShown((n) => n + PAGE)}>Show more articles</Button></div>}
            </>
          ))}
        </section>
      </Container>
    </>
  )
}
