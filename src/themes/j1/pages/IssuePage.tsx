import { ChevronLeft, ChevronRight, Download, Search, Share2, X } from '../components/uiIcons'
import { MdOutlineFilterAlt, MdOutlineListAlt } from 'react-icons/md'
import { useEffect, useMemo, useState } from 'react'
import { ARTICLE_TYPES, SUBJECTS, type ArticleSummary, type ArticleType, type IssueData, type IssueSummary } from '../../../mock-data/journals/j1'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button } from '../components/Button'
import { IssueArticleCard } from '../components/IssueArticleCard'
import { IssueCover } from '../components/IssueCover'
import { Container, EmptyState } from '../components/primitives'
import { useToast } from '../components/Toast'
import { AppLink, useRouter } from '../../../core/router'
import { api } from '../../../core/api'
import { IssueFeatured } from '../components/IssueFeatured'
import { IssuePager } from '../components/IssuePager'
import { IndexedStrip, IssueRightRail, NextIssueBanner } from '../components/IssueExtras'
import { CiteIssueButton, SubscribeIssueButton, issueHref } from '../components/IssueDialogs'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'
import { StickyRail } from '../components/StickyRail'

type Sort = 'latest' | 'views' | 'pages' | 'cited' | 'title' | 'date'
const PAGE_SIZE = 5

const firstPage = (a: ArticleSummary) => (a.pages.startsWith('i') ? 0 : parseInt(a.pages, 10))
const plural = (t: ArticleType) => (t === 'Editorial' ? 'Editorial' : `${t}s`)
const SORTS: [Sort, string][] = [['pages', 'Page order (default)'], ['latest', 'Latest'], ['views', 'Most read'], ['cited', 'Most cited'], ['title', 'Title (A–Z)'], ['date', 'Date published']]

const sideTitle = 'font-serif text-[1.25rem] font-semibold leading-tight text-navy'
const checkCls = 'h-4 w-4 shrink-0 accent-[#14284B]'
const radioCls = 'h-4 w-4 shrink-0 accent-[#14284B]'

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [type, setType] = useState<ArticleType | ''>('')
  const [choiceOnly, setChoiceOnly] = useState(false)
  const [sort, setSort] = useState<Sort>('pages')
  const [page, setPage] = useState(1)
  const [issues, setIssues] = useState<IssueSummary[]>([])
  const { navigate } = useRouter()

  useEffect(() => { let on = true; api.listIssues().then((l) => { if (on) setIssues(l) }).catch(() => {}); return () => { on = false } }, [])

  // Editor's Choice: the data has no flag, so the issue's most-cited article is featured.
  const top = useMemo(() => [...articles].sort((a, b) => b.citations - a.citations || b.views - a.views)[0], [articles])
  const counts = useMemo(() => Object.fromEntries(ARTICLE_TYPES.map((t) => [t, articles.filter((a) => a.type === t).length])), [articles])
  const subjectCounts = useMemo(() => Object.fromEntries(SUBJECTS.map((s) => [s, articles.filter((a) => a.subject === s).length])), [articles])
  const hasFilters = !!(query || subjects.length || type || choiceOnly)
  const showFeatured = !!top && !hasFilters && page === 1
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = articles.filter((a) =>
      (!type || a.type === type) && (!subjects.length || subjects.includes(a.subject)) && (!choiceOnly || a.paperId === top?.paperId) &&
      (!q || a.title.toLowerCase().includes(q) || a.authors.join(' ').toLowerCase().includes(q) || a.paperId.toLowerCase().includes(q)))
    const cmp = (a: ArticleSummary, b: ArticleSummary) =>
      sort === 'views' ? b.views - a.views : sort === 'cited' ? b.citations - a.citations : sort === 'title' ? a.title.localeCompare(b.title)
        : sort === 'latest' || sort === 'date' ? b.publishedAt.localeCompare(a.publishedAt) || b.paperId.localeCompare(a.paperId) : firstPage(a) - firstPage(b)
    // Sections keep their order across pages; the chosen sort applies inside each section.
    return [...list].sort((a, b) => ARTICLE_TYPES.indexOf(a.type) - ARTICLE_TYPES.indexOf(b.type) || cmp(a, b))
  }, [articles, query, subjects, type, choiceOnly, sort, top])

  // The featured article sits above the list on the first unfiltered page, so it is not repeated in the list.
  const listed = useMemo(() => (top && !hasFilters ? filtered.filter((a) => a.paperId !== top.paperId) : filtered), [filtered, top, hasFilters])
  const pageCount = Math.max(1, Math.ceil(listed.length / PAGE_SIZE))
  const cur = Math.min(page, pageCount)
  const slice = listed.slice((cur - 1) * PAGE_SIZE, cur * PAGE_SIZE)
  const groups = ARTICLE_TYPES.map((t) => ({ type: t, items: slice.filter((a) => a.type === t) })).filter((g) => g.items.length)
  const reset = () => setPage(1)
  const clear = () => { setQuery(''); setSubjects([]); setType(''); setChoiceOnly(false); reset() }
  const toggleSubject = (s: string) => { setSubjects((l) => (l.includes(s) ? l.filter((x) => x !== s) : [...l, s])); reset() }
  const crumbs = issue.isCurrent
    ? [{ label: 'Home', to: paths.home }, { label: 'Current Issue' }]
    : [{ label: 'Home', to: paths.home }, { label: 'Past Issues', to: paths.pastIssues }, { label: `Volume ${issue.volume}, Issue ${issue.issue}` }]

  const share = async () => {
    const url = `https://${journal.domain}${issue.isCurrent ? paths.currentIssue : paths.issue(issue.volume, issue.issue)}`
    toast((await copyText(url)) ? 'Issue link copied to clipboard.' : 'Could not copy. Copy the address from the browser bar instead.')
  }
  const navLink = 'inline-flex items-center gap-1.5 px-1 py-1 text-sm font-semibold text-scholar hover:underline'

  return (
    <div className="pb-12">
      <Container>
        <Breadcrumbs items={crumbs} />

        {/* Issue hero */}
        <section aria-labelledby="issue-title" className="border border-line bg-mist p-5 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-start">
            <IssueCover volume={issue.volume} issue={issue.issue} month={issue.month} className="mx-auto h-60 w-auto shadow-xl md:mx-0" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="rounded-sm border border-[#F0C98F] bg-gold-soft px-2 py-1 text-[#7A4300]">Open Access Issue</span>
                {issue.isCurrent && <span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2 py-1 text-scholar">Latest Issue</span>}
              </div>
              <h1 id="issue-title" className="mt-3 font-serif text-[1.875rem] font-semibold leading-tight tracking-tight text-navy sm:text-[2.5rem] sm:leading-[3rem]">
                Volume {issue.volume}, Issue {issue.issue} <span aria-hidden>·</span><span className="sr-only">,</span> {formatMonthYear(issue.month)}
              </h1>
              <dl className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-1 text-sm text-ink">
                <div className="flex gap-1.5"><dt className="font-bold">ISSN:</dt><dd className="tabular-nums">{journal.issnOnline} (Online)</dd></div>
                <div className="flex gap-1.5"><dt className="font-bold">Published Online:</dt><dd className="tabular-nums">{formatDate(issue.publishedAt)}</dd></div>
                <div className="flex gap-1.5"><dt className="font-bold">Total Articles:</dt><dd className="tabular-nums">{issue.articleCount} Peer-Reviewed Articles</dd></div>
                <div className="flex gap-1.5"><dt className="font-bold">DOI:</dt><dd className="break-all tabular-nums text-scholar">{issue.doi}</dd></div>
              </dl>
              <div className="mt-5 flex flex-wrap gap-3 border-t border-line pt-5">
                <Button onClick={() => toast('Complete issue PDF download started (simulated).')}><Download className="h-4 w-4" aria-hidden />Download Full Issue (PDF)</Button>
                <Button variant="outline" onClick={share}><Share2 className="h-4 w-4" aria-hidden />Share Issue</Button>
                <CiteIssueButton issue={issue} />
                <SubscribeIssueButton />
              </div>
            </div>
          </div>
        </section>

        {/* Issue navigation */}
        <nav aria-label="Issue navigation" className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border border-line bg-white px-4 py-2">
          <div className="flex flex-wrap items-center gap-x-4">
            {issue.issue > 1
              ? <AppLink to={paths.issue(issue.volume, issue.issue - 1)} className={navLink}><ChevronLeft className="h-4 w-4" aria-hidden />Previous Issue (Vol {issue.volume}, Iss {issue.issue - 1})</AppLink>
              : <span className="px-1 py-1 text-sm text-ink-muted">First issue of Volume {issue.volume}</span>}
            <span aria-hidden className="h-4 w-px bg-line" />
            <AppLink to={paths.pastIssues} className="px-1 py-1 text-sm font-semibold text-navy hover:underline">Archives Directory</AppLink>
            <span aria-hidden className="h-4 w-px bg-line" />
            {issue.isCurrent
              ? <span aria-disabled="true" className="px-1 py-1 text-sm text-ink-muted">Next issue in press</span>
              : <AppLink to={paths.issue(issue.volume, issue.issue + 1)} className={navLink}>Next Issue (Vol {issue.volume}, Iss {issue.issue + 1})<ChevronRight className="h-4 w-4" aria-hidden /></AppLink>}
          </div>
          {issues.length > 0 && (
            <div className="flex items-center gap-2">
              <label htmlFor="issue-jump" className="text-sm font-semibold text-ink">Jump to volume &amp; issue</label>
              <select id="issue-jump" value={`${issue.volume}/${issue.issue}`}
                onChange={(e) => { const t = issues.find((i) => `${i.volume}/${i.issue}` === e.target.value); if (t) navigate(issueHref(t)) }}
                className="h-9 rounded border border-line bg-white px-2 text-sm text-ink focus:border-scholar focus:outline-none focus:ring-2 focus:ring-scholar/25">
                {issues.map((i) => <option key={`${i.volume}/${i.issue}`} value={`${i.volume}/${i.issue}`}>Vol. {i.volume}, Issue {i.issue} ({formatMonthYear(i.month)})</option>)}
              </select>
            </div>
          )}
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_300px]">
          {/* Left rail */}
          <StickyRail as="div" minWidth={1024} className="space-y-5">
            <aside aria-labelledby="in-issue" className="border border-line bg-white p-5">
              <h2 id="in-issue" className={`${sideTitle} flex items-center gap-2 border-b border-line pb-3`}><MdOutlineListAlt className="h-5 w-5 text-scholar" aria-hidden />In This Issue</h2>
              <ul className="mt-1">
                {ARTICLE_TYPES.map((t) => (
                  <li key={t}>
                    <button type="button" disabled={!counts[t]} aria-pressed={type === t} onClick={() => { setType(type === t ? '' : t); reset() }}
                      className={`flex w-full items-center justify-between border-b border-line/60 py-2.5 text-left text-sm last:border-b-0 disabled:opacity-40 ${type === t ? 'font-bold text-navy' : 'font-semibold text-ink hover:text-scholar'}`}>
                      <span>{plural(t)}</span>
                      <span className={`rounded-sm px-2 py-0.5 text-xs font-bold tabular-nums ${type === t ? 'bg-navy text-white' : 'bg-scholar-soft text-scholar'}`}>{counts[t]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section aria-labelledby="filter-title" className="border border-line bg-white p-5">
              <h2 id="filter-title" className={`${sideTitle} flex items-center gap-2 border-b border-line pb-3`}><MdOutlineFilterAlt className="h-5 w-5 text-scholar" aria-hidden />Filter Articles</h2>
              <fieldset className="mt-4">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Subject area</legend>
                <div className="mt-2 space-y-1.5 text-sm">
                  {SUBJECTS.map((sub) => (
                    <label key={sub} className="flex cursor-pointer items-center gap-2.5 py-0.5 font-semibold text-ink">
                      <input type="checkbox" className={checkCls} checked={subjects.includes(sub)} onChange={() => toggleSubject(sub)} />
                      <span className="min-w-0 flex-1">{sub}</span><span className="text-xs font-semibold tabular-nums text-ink-muted">{subjectCounts[sub]}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="mt-4 border-t border-line pt-4">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Article type</legend>
                <div className="mt-2 space-y-1.5 text-sm">
                  {[['', 'All types', articles.length] as const, ...ARTICLE_TYPES.filter((t) => counts[t]).map((t) => [t, plural(t), counts[t]] as const)].map(([v, label, n]) => (
                    <label key={v || 'all'} className="flex cursor-pointer items-center gap-2.5 py-0.5 font-semibold text-ink">
                      <input type="radio" name="issue-type" className={radioCls} checked={type === v} onChange={() => { setType(v as ArticleType | ''); reset() }} />
                      <span className="min-w-0 flex-1">{label}</span><span className="text-xs font-semibold tabular-nums text-ink-muted">{n}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-4 border-t border-line pt-4">
                <label className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-ink">
                  Editor’s Choice only
                  <input type="checkbox" role="switch" className="peer sr-only" checked={choiceOnly} onChange={(e) => { setChoiceOnly(e.target.checked); reset() }} />
                  <span aria-hidden className={`relative h-5 w-9 shrink-0 rounded-full border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-scholar ${choiceOnly ? 'border-navy bg-navy' : 'border-line bg-paper'}`}>
                    <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full shadow transition-all ${choiceOnly ? 'left-[18px] bg-white' : 'left-0.5 bg-ink-muted'}`} />
                  </span>
                </label>
              </div>
              {hasFilters && (
                <button type="button" onClick={clear} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-scholar hover:underline"><X className="h-3.5 w-3.5" aria-hidden />Clear filters</button>
              )}
            </section>

            <section aria-labelledby="sort-title" className="border border-line bg-white p-5">
              <h2 id="sort-title" className={`${sideTitle} border-b border-line pb-3`}>Sort By</h2>
              <fieldset className="mt-3">
                <legend className="sr-only">Sort articles by</legend>
                <div className="space-y-1.5 text-sm">
                  {SORTS.map(([v, label]) => (
                    <label key={v} className="flex cursor-pointer items-center gap-2.5 py-0.5 font-semibold text-ink">
                      <input type="radio" name="issue-sort" className={radioCls} checked={sort === v} onChange={() => { setSort(v); reset() }} />{label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </section>
          </StickyRail>

          {/* Article feed */}
          <div className="min-w-0">
            <form role="search" aria-label="Search within this issue" onSubmit={(e) => e.preventDefault()} className="relative">
              <label htmlFor="issue-q" className="sr-only">Search within this issue</label>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
              <input id="issue-q" type="search" value={query} onChange={(e) => { setQuery(e.target.value); reset() }} placeholder="Search title, author or paper ID within this issue…"
                className="h-11 w-full rounded border border-line bg-white pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-scholar focus:ring-2 focus:ring-scholar/25" />
            </form>

            <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
              Showing {filtered.length} of {articles.length} articles · {formatNumber(filtered.reduce((n, a) => n + a.views, 0))} total views
            </p>

            {showFeatured && top && <div className="mt-4"><IssueFeatured article={top} /></div>}

            {filtered.length === 0 ? (
              <div className="mt-4"><EmptyState title="No articles match your filters" hint="Try a different keyword or clear the filters." /></div>
            ) : groups.map((g) => (
              <section key={g.type} aria-labelledby={`grp-${g.type.replace(/\s/g, '-')}`} className="mt-6">
                <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <h2 id={`grp-${g.type.replace(/\s/g, '-')}`} className="text-xs font-bold uppercase tracking-[0.12em] text-navy">{plural(g.type)}</h2>
                  <span className="text-sm text-ink-muted">{g.items.length} on this page · {counts[g.type]} in issue</span>
                </div>
                <div className="mt-4 space-y-4">
                  {g.items.map((a) => <IssueArticleCard key={a.paperId} article={a} />)}
                </div>
              </section>
            ))}

            {listed.length > 0 && (
              <div className="mt-6 flex flex-col gap-3 border border-line bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-ink" aria-live="polite">
                  Showing {(cur - 1) * PAGE_SIZE + 1}–{(cur - 1) * PAGE_SIZE + slice.length} of {listed.length} articles in Volume {issue.volume}, Issue {issue.issue}
                </p>
                <IssuePager page={cur} pageCount={pageCount} onChange={(p) => { setPage(p); document.getElementById('issue-q')?.scrollIntoView({ block: 'start' }) }} />
              </div>
            )}
          </div>

          {/* Right rail */}
          <IssueRightRail />
        </div>

        <IndexedStrip />
        <NextIssueBanner />
      </Container>
    </div>
  )
}
