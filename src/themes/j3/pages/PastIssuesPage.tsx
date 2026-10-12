// Past issues archive in the Academic Editorial & Press language: a Mist title card, a search panel (title or author, optional year), then a chronological explorer
// where year tabs choose the volume shown as a hairline panel of issue cards. 2px corners, 1px rules, no shadows; orange only as small markers.
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate, formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, IssueSummary } from '../../../core/types'
import { ArticleListItem } from '../components/ArticleListItem'
import { IssueCover } from '../components/IssueCover'
import { Container, cx } from '../components/primitives'
import { ArrowRight, Search } from '../icons'

const PAGE = 12
const btnPrimary = 'inline-flex h-11 items-center justify-center gap-2 whitespace-nowrap rounded-tile border border-iris-700 bg-iris-700 px-5 font-jakarta text-[13px] font-semibold text-white hover:border-iris-800 hover:bg-iris-800'
const field = 'h-11 rounded-tile border border-j3paper-rule bg-white px-3 font-inter text-sm text-night-900 hover:border-iris-700 focus:border-iris-700 focus:outline-none focus-visible:!outline-none focus:ring-1 focus:ring-iris-700'
const marker = <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-ember-500" />
const sectionHead = 'flex items-center gap-2.5 font-jakarta text-sm font-extrabold uppercase tracking-[0.06em] text-night-900'

export function PastIssuesPage({ issues, articles }: { issues: IssueSummary[]; articles: ArticleSummary[] }) {
  const byYear = useMemo(() => {
    const m = new Map<string, IssueSummary[]>()
    ;[...issues].sort((a, b) => b.month.localeCompare(a.month)).forEach((i) => { const y = i.month.slice(0, 4); m.set(y, [...(m.get(y) ?? []), i]) })
    return m
  }, [issues])
  const years = [...byYear.keys()]
  const [year, setYear] = useState(years[0] ?? '')
  const [q, setQ] = useState('')
  const [searchYear, setSearchYear] = useState('')
  const [shown, setShown] = useState(PAGE)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const tabId = useId()
  const searchId = useId()
  const yearSelId = useId()
  const term = q.trim().toLowerCase()
  const active = byYear.has(year) ? year : years[0]

  const results = useMemo(() => term
    ? articles.filter((a) => (!searchYear || a.publishedAt.startsWith(searchYear)) && (a.title.toLowerCase().includes(term) || a.authors.some((n) => n.toLowerCase().includes(term))))
    : [], [articles, term, searchYear])
  useEffect(() => { setShown(PAGE) }, [term, searchYear])

  const onTabKey = (e: KeyboardEvent, i: number) => {
    const next = e.key === 'ArrowRight' ? (i + 1) % years.length : e.key === 'ArrowLeft' ? (i - 1 + years.length) % years.length : e.key === 'Home' ? 0 : e.key === 'End' ? years.length - 1 : -1
    if (next < 0) return
    e.preventDefault()
    setYear(years[next])
    tabs.current[next]?.focus()
  }

  const activeIssues = byYear.get(active) ?? []
  const volumes = [...new Set(activeIssues.map((i) => i.volume))].sort((a, b) => b - a)

  return (
    <div className="bg-j3paper">
      <Helmet><title>{`Past issues | ${journal.shortName}`}</title></Helmet>

      <Container className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="font-inter text-[13px] text-mauve-700">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><AppLink to={paths.home} className="hover:text-iris-700 hover:underline">Home</AppLink></li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="font-semibold text-night-900">All volumes &amp; archives</li>
          </ol>
        </nav>
        <section className="mt-5 border border-j3paper-rule bg-j3paper-cool p-5 sm:p-8">
          <p className={sectionHead}>{marker}Journal archive</p>
          <h1 className="mt-4 font-jakarta font-extrabold leading-[1.1] tracking-[-0.01em] text-night-900" style={{ fontSize: 'clamp(30px,3.6vw,46px)' }}>Journal Archive &amp; Past Issues</h1>
          <p className="mt-3 max-w-3xl font-inter text-[15px] leading-relaxed text-mauve-700">
            Every issue of {journal.name}, shelved by year. Pick an issue to open its table of contents; each article carries a permanent Crossref DOI under {journal.doiPrefix}.
          </p>
        </section>
      </Container>

      <Container className="py-8 sm:py-10">
        {/* Search panel */}
        <section aria-labelledby={`${searchId}-h`} className="border border-j3paper-rule border-t-2 border-t-iris-700 bg-j3paper-cool p-4 sm:p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <h2 id={`${searchId}-h`} className={sectionHead}>{marker}Search the archive</h2>
            <p className="font-inter text-sm text-mauve-700">{articles.length} articles across {issues.length} issues</p>
          </div>
          <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-5 grid gap-3 sm:grid-cols-[minmax(0,1fr)_200px_auto]">
            <div>
              <label htmlFor={searchId} className="sr-only">Search every issue by article title or author</label>
              <div className="flex h-11 items-center gap-2 rounded-tile border border-j3paper-rule bg-white pl-3 focus-within:border-iris-700 focus-within:ring-1 focus-within:ring-iris-700">
                <Search className="h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />
                <input id={searchId} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title or author name"
                  className="min-w-0 flex-1 bg-transparent font-inter text-base text-night-900 placeholder:text-mauve-500 focus:outline-none focus-visible:!outline-none" />
              </div>
            </div>
            <div>
              <label htmlFor={yearSelId} className="sr-only">Limit the search to a year</label>
              <select id={yearSelId} value={searchYear} onChange={(e) => setSearchYear(e.target.value)} className={cx(field, 'w-full')}>
                <option value="">All years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button type="submit" className={btnPrimary}><Search className="h-4 w-4" aria-hidden="true" />Search</button>
          </form>
          <p role="status" className="mt-4 font-inter text-sm text-mauve-700">{term ? `${results.length} article${results.length === 1 ? '' : 's'} found` : `Type a title or an author to search ${articles.length} articles.`}</p>

          {term && (results.length === 0 ? (
            <div className="mt-6 border border-j3paper-rule bg-white p-10 text-center">
              <p className="font-jakarta text-lg font-bold text-night-900">No articles found</p>
              <p className="mt-1 font-inter text-sm text-mauve-700">Check the spelling or try a shorter search.</p>
              <button type="button" onClick={() => { setQ(''); setSearchYear('') }} className={cx(btnPrimary, 'mt-4')}>Clear search</button>
            </div>
          ) : (
            <>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {results.slice(0, shown).map((a) => <ArticleListItem key={a.paperId} article={a} />)}
              </div>
              {results.length > shown && <div className="mt-6 text-center"><button type="button" onClick={() => setShown((n) => n + PAGE)} className="inline-flex h-11 items-center rounded-tile border border-j3paper-rule bg-white px-6 font-jakarta text-[13px] font-semibold text-night-900 hover:border-iris-700 hover:bg-j3paper-cool">Show more articles</button></div>}
            </>
          ))}
        </section>

        {/* Chronological explorer */}
        <section className="mt-12 sm:mt-16" aria-labelledby={`${tabId}-h`}>
          <h2 id={`${tabId}-h`} className={sectionHead}>{marker}Chronological archive explorer</h2>
          {years.length === 0 ? (
            <div className="mt-5 border border-j3paper-rule bg-white p-10 text-center">
              <p className="font-jakarta text-lg font-bold text-night-900">No issues published yet</p>
              <p className="mt-1 font-inter text-sm text-mauve-700">Issues will appear here as soon as they are released.</p>
            </div>
          ) : (
            <>
              <div role="tablist" aria-label="Year" className="mt-4 flex flex-wrap gap-1 border border-j3paper-rule bg-j3paper-cool p-1">
                {years.map((y, i) => (
                  <button key={y} ref={(el) => { tabs.current[i] = el }} type="button" role="tab" id={`${tabId}-t-${y}`} aria-selected={active === y} aria-controls={`${tabId}-p`} tabIndex={active === y ? 0 : -1}
                    onClick={() => setYear(y)} onKeyDown={(e) => onTabKey(e, i)}
                    className={cx('rounded-tile px-5 py-2 font-jakarta text-[13px] font-bold tabular-nums', active === y ? 'bg-iris-700 text-white' : 'text-night-900 hover:bg-j3paper-deep')}>{y}</button>
                ))}
              </div>
              <div role="tabpanel" id={`${tabId}-p`} aria-labelledby={`${tabId}-t-${active}`} className="mt-6 space-y-8">
                {volumes.map((vol) => {
                  const list = activeIssues.filter((i) => i.volume === vol)
                  return (
                    <section key={vol} aria-label={`Volume ${vol}, ${active}`} className="border border-j3paper-rule bg-white p-4 sm:p-6">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-j3paper-rule pb-4">
                        <h3 className="font-jakarta text-[1.375rem] font-extrabold text-night-900">Volume {vol} ({active})</h3>
                        {list.some((i) => i.isCurrent) && <span className="bg-iris-700 px-2 py-1 font-jakarta text-[11px] font-bold uppercase tracking-[0.04em] text-white">Current volume</span>}
                        <p className="font-inter text-sm text-mauve-700 sm:ml-auto">{list.length} issue{list.length === 1 ? '' : 's'} · {list.reduce((n, i) => n + i.articleCount, 0)} peer-reviewed articles</p>
                      </div>
                      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {list.map((i) => (
                          <li key={`${i.volume}-${i.issue}`}>
                            <AppLink to={paths.issue(i.volume, i.issue)} aria-label={`Volume ${i.volume}, Issue ${i.issue}, ${formatMonthYear(i.month)}, ${i.articleCount} articles`}
                              className="group flex h-full flex-col border border-j3paper-rule bg-j3paper-cool p-3 hover:border-iris-700 focus-visible:border-iris-700">
                              <IssueCover volume={i.volume} issue={i.issue} />
                              <span className="mt-3 block font-jakarta text-base font-bold text-night-900 group-hover:text-iris-700">Issue {i.issue} ({new Date(`${i.month}-01T00:00:00`).toLocaleString('en-US', { month: 'long' })})</span>
                              <span className="mt-1 block font-inter text-sm text-mauve-700">Published {formatDate(i.publishedAt)}</span>
                              <span className="block font-inter text-sm text-night-900">{i.articleCount} articles</span>
                              <span className="mt-3 flex h-6 items-center justify-between gap-2 font-jakarta text-xs font-bold text-iris-700">
                                <span className="inline-flex items-center gap-1">View issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
                                {i.isCurrent ? <span className="bg-ember-100 px-2 py-0.5 font-bold uppercase tracking-[0.04em] text-ember-900">Current</span> : <span className="font-inter font-medium text-mauve-700">Archived</span>}
                              </span>
                            </AppLink>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )
                })}
              </div>
            </>
          )}
        </section>
      </Container>
    </div>
  )
}
