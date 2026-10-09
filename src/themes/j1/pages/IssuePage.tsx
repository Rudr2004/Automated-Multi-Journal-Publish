import { ChevronLeft, ChevronRight, Download, Search, Share2, X } from '../components/uiIcons'
import { useMemo, useState } from 'react'
import { ARTICLE_TYPES, SUBJECTS, type ArticleSummary, type ArticleType, type IssueData } from '../../../mock-data/journals/j1'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { Button, ButtonLink } from '../components/Button'
import { IssueArticleCard } from '../components/IssueArticleCard'
import { IssueCover } from '../components/IssueCover'
import { Container, EmptyState } from '../components/primitives'
import { useToast } from '../components/Toast'
import { AppLink } from '../../../core/router'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'
import { StickyRail } from '../components/StickyRail'
import { AwardsCard } from '../components/AwardsCard'

type Sort = 'latest' | 'views' | 'pages' | 'cited'

const firstPage = (a: ArticleSummary) => (a.pages.startsWith('i') ? 0 : parseInt(a.pages, 10))
const plural = (t: ArticleType) => (t === 'Editorial' ? 'Editorial' : `${t}s`)
const SORTS: [Sort, string][] = [['pages', 'Page order (default)'], ['latest', 'Latest'], ['views', 'Most read'], ['cited', 'Most cited']]

const sideTitle = 'font-serif text-[1.25rem] font-semibold leading-tight text-navy'
const radioCls = 'h-4 w-4 shrink-0 accent-[#14284B]'

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const toast = useToast()
  const [query, setQuery] = useState('')
  const [subject, setSubject] = useState('')
  const [type, setType] = useState<ArticleType | ''>('')
  const [sort, setSort] = useState<Sort>('pages')

  const counts = useMemo(() => Object.fromEntries(ARTICLE_TYPES.map((t) => [t, articles.filter((a) => a.type === t).length])), [articles])
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = articles.filter((a) =>
      (!type || a.type === type) && (!subject || a.subject === subject) &&
      (!q || a.title.toLowerCase().includes(q) || a.authors.join(' ').toLowerCase().includes(q) || a.paperId.toLowerCase().includes(q)))
    return [...list].sort((a, b) =>
      sort === 'views' ? b.views - a.views : sort === 'cited' ? b.citations - a.citations
        : sort === 'latest' ? b.publishedAt.localeCompare(a.publishedAt) || b.paperId.localeCompare(a.paperId) : firstPage(a) - firstPage(b))
  }, [articles, query, subject, type, sort])

  const groups = ARTICLE_TYPES.map((t) => ({ type: t, items: filtered.filter((a) => a.type === t) })).filter((g) => g.items.length)
  const hasFilters = !!(query || subject || type)
  const clear = () => { setQuery(''); setSubject(''); setType('') }
  const crumbs = issue.isCurrent
    ? [{ label: 'Home', to: paths.home }, { label: 'Current Issue' }]
    : [{ label: 'Home', to: paths.home }, { label: 'Past Issues', to: paths.pastIssues }, { label: `Volume ${issue.volume}, Issue ${issue.issue}` }]
  const infoRows = journal.info.filter(([k]) => ['Frequency', 'Starting Year', 'ISSN', 'Publisher', 'Language'].includes(k))

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
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wider">
                <span className="rounded-sm border border-[#F0C98F] bg-gold-soft px-2 py-1 text-[#7A4300]">Open Access Issue</span>
                {issue.isCurrent && <span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2 py-1 text-scholar">Latest issue</span>}
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
              </div>
            </div>
          </div>
        </section>

        {/* Issue navigation */}
        <nav aria-label="Issue navigation" className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border border-line bg-white px-4 py-2">
          <div className="flex flex-wrap items-center gap-x-4">
            {issue.issue > 1
              ? <AppLink to={paths.issue(issue.volume, issue.issue - 1)} className={navLink}><ChevronLeft className="h-4 w-4" aria-hidden />Previous Issue (Vol {issue.volume}, Iss {issue.issue - 1})</AppLink>
              : <span className="px-1 py-1 text-sm text-ink-muted">First issue of Volume {issue.volume}</span>}
            <span aria-hidden className="h-4 w-px bg-line" />
            <AppLink to={paths.pastIssues} className="px-1 py-1 text-sm font-semibold text-navy hover:underline">Archives Directory</AppLink>
          </div>
          {!issue.isCurrent && (
            <AppLink to={paths.issue(issue.volume, issue.issue + 1)} className={navLink}>Next Issue (Vol {issue.volume}, Iss {issue.issue + 1})<ChevronRight className="h-4 w-4" aria-hidden /></AppLink>
          )}
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[250px_minmax(0,1fr)_300px]">
          {/* Left rail */}
          <StickyRail as="div" minWidth={1024} className="space-y-5">
            <aside aria-labelledby="in-issue" className="border border-line bg-white p-5">
              <h2 id="in-issue" className={`${sideTitle} border-b border-line pb-3`}>In This Issue</h2>
              <ul className="mt-1">
                {ARTICLE_TYPES.map((t) => (
                  <li key={t}>
                    <button type="button" disabled={!counts[t]} aria-pressed={type === t} onClick={() => setType(type === t ? '' : t)}
                      className={`flex w-full items-center justify-between border-b border-line/60 py-2.5 text-left text-sm last:border-b-0 disabled:opacity-40 ${type === t ? 'font-bold text-navy' : 'font-semibold text-ink hover:text-scholar'}`}>
                      <span>{plural(t)}</span>
                      <span className={`rounded-sm px-2 py-0.5 text-xs font-bold tabular-nums ${type === t ? 'bg-navy text-white' : 'bg-scholar-soft text-scholar'}`}>{counts[t]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </aside>

            <section aria-labelledby="filter-title" className="border border-line bg-white p-5">
              <h2 id="filter-title" className={`${sideTitle} border-b border-line pb-3`}>Filter Articles</h2>
              <fieldset className="mt-4">
                <legend className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Subject area</legend>
                <div className="mt-2 space-y-1.5 text-sm">
                  {[['', 'All subjects'], ...SUBJECTS.map((s) => [s, s])].map(([v, label]) => (
                    <label key={v || 'all'} className="flex cursor-pointer items-center gap-2.5 py-0.5 font-semibold text-ink">
                      <input type="radio" name="issue-subject" className={radioCls} checked={subject === v} onChange={() => setSubject(v)} />{label}
                    </label>
                  ))}
                </div>
              </fieldset>
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
                      <input type="radio" name="issue-sort" className={radioCls} checked={sort === v} onChange={() => setSort(v)} />{label}
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
              <input id="issue-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title, author or paper ID within this issue…"
                className="h-11 w-full rounded border border-line bg-white pl-9 pr-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-scholar focus:ring-2 focus:ring-scholar/25" />
            </form>

            <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
              Showing {filtered.length} of {articles.length} articles · {formatNumber(filtered.reduce((n, a) => n + a.views, 0))} total views
            </p>

            {filtered.length === 0 ? (
              <div className="mt-4"><EmptyState title="No articles match your filters" hint="Try a different keyword or clear the filters." /></div>
            ) : groups.map((g) => (
              <section key={g.type} aria-labelledby={`grp-${g.type.replace(/\s/g, '-')}`} className="mt-6">
                <div className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <h2 id={`grp-${g.type.replace(/\s/g, '-')}`} className="text-xs font-bold uppercase tracking-[0.12em] text-navy">{plural(g.type)}</h2>
                  <span className="text-sm text-ink-muted">Showing {g.items.length} of {counts[g.type]} in section</span>
                </div>
                <div className="mt-4 space-y-4">
                  {g.items.map((a) => <IssueArticleCard key={a.paperId} article={a} />)}
                </div>
              </section>
            ))}

            <div className="mt-6 border border-line bg-white px-4 py-3 text-sm font-semibold text-ink">
              Showing {filtered.length ? `1–${filtered.length}` : '0'} of {articles.length} articles in Volume {issue.volume}, Issue {issue.issue}
            </div>
          </div>

          {/* Right rail */}
          <StickyRail as="div" className="space-y-5 lg:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1">
            <section aria-labelledby="cfp-title" className="overflow-hidden border border-navy bg-navy text-white">
              <div className="border-b border-white/15 p-5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFC1E3]">Call for papers</p>
                <h2 id="cfp-title" className="mt-1 font-serif text-[1.375rem] font-semibold leading-snug">Submissions Open</h2>
                <p className="mt-1 text-sm text-[#D6E0F3]">{journal.nextIssue.label}</p>
              </div>
              <div className="bg-white p-5 text-sm text-ink">
                <ul className="space-y-2">
                  <li><strong>Open Access</strong> ({journal.licence.name})</li>
                  <li><strong>Crossref DOI</strong> assignment</li>
                  <li>Expected publication: <strong className="tabular-nums">{formatDate(journal.nextIssue.expectedPublication)}</strong></li>
                </ul>
                <ButtonLink to={paths.submit} variant="submit" className="mt-4 w-full">Submit Manuscript</ButtonLink>
              </div>
            </section>

            <section aria-labelledby="vital-title" className="border border-line bg-white">
              <h2 id="vital-title" className="bg-navy px-4 py-3 font-serif text-[1.0625rem] font-semibold text-white">Journal Vital Statistics</h2>
              <dl className="text-sm">
                {infoRows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[116px_1fr] border-t border-line first:border-t-0">
                    <dt className="bg-navy px-3 py-2.5 text-[13px] font-bold text-white">{k}</dt>
                    <dd className="px-3 py-2.5 tabular-nums">{v}</dd>
                  </div>
                ))}
                <div className="grid grid-cols-[116px_1fr] border-t border-line">
                  <dt className="bg-navy px-3 py-2.5 text-[13px] font-bold text-white">DOI Prefix</dt>
                  <dd className="px-3 py-2.5 tabular-nums">{journal.doiPrefix}</dd>
                </div>
              </dl>
            </section>
            <AwardsCard />
          </StickyRail>
        </div>
      </Container>
    </div>
  )
}
