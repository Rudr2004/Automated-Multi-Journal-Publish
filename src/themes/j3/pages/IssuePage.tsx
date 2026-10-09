// Issue page in the "Academic Prestige" language: an issue header card (cover, title, DOI / ISSN / counts), then the table of contents grouped by article type
// as hairline article cards, with an issue-navigation and section-index sidebar. Search and theme filters are kept.
import { useId, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, ArticleType, IssueData } from '../../../core/types'
import { IssueCover } from '../components/IssueCover'
import { Container, cx } from '../components/primitives'
import { ArrowRight, ChevronDown, Close, Download, Eye, Quote, Search } from '../icons'

const GROUPS: { type: ArticleType; label: string; note: string }[] = [
  { type: 'Editorial', label: 'Editorial', note: 'Editorial and perspectives' },
  { type: 'Research Article', label: 'Research Articles', note: 'Original research' },
  { type: 'Review Article', label: 'Review Articles', note: 'Reviews and syntheses' },
  { type: 'Short Communication', label: 'Short Communications', note: 'Brief reports' },
]
const gid = (t: string) => `grp-${t.replace(/\s/g, '')}`

const btnPrimary = 'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap bg-iris-700 px-5 font-inter text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-iris-600'
const label = 'font-inter text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600'

function Entry({ article }: { article: ArticleSummary }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const doi = doiFor(article.paperId)
  return (
    <li className="relative border border-mauve-100 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-inter text-xs text-mauve-600">
        <span className="bg-j3valid-700 px-2 py-0.5 font-bold uppercase tracking-[0.08em] text-white">Open access</span>
        <span className="bg-iris-50 px-2 py-0.5 font-semibold text-iris-700">{article.type}</span>
        {article.pages && <span>pp. {article.pages}</span>}
        <span className="break-all">doi:{doi}</span>
      </div>
      <h3 className="mt-3 font-jakarta text-[1.3125rem] font-semibold leading-snug text-iris-700 sm:text-[1.5rem]">
        <AppLink to={paths.article(article.paperId)} className="hover:text-ember-700 hover:underline after:absolute after:inset-0 after:content-['']">{article.title}</AppLink>
      </h3>
      <p className="mt-2 font-jakarta text-base font-semibold text-night-900">{article.authors.join(', ')}</p>
      <p className="mt-1 font-inter text-sm font-semibold text-ember-700">{article.subject}</p>

      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
        className="relative z-10 mt-4 flex w-full items-center justify-between gap-3 bg-j3paper-cool px-4 py-2.5 text-left font-inter text-sm font-semibold text-iris-700 hover:bg-iris-50">
        <span>View abstract</span>
        <ChevronDown className={cx('h-5 w-5 shrink-0 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && <p id={id} className="relative z-10 border-l-2 border-iris-700 bg-j3paper-cool px-4 py-4 font-jakarta text-[1rem] leading-relaxed text-night-900">{article.abstract}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-mauve-100 pt-4 font-inter text-sm text-mauve-600">
        <span>Published: <span className="font-semibold text-night-900">{formatDate(article.publishedAt)}</span></span>
        <span className="relative z-10 flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="inline-flex items-center gap-1" title="Views"><Eye className="h-4 w-4 text-iris-600" aria-hidden="true" />{formatNumber(article.views)}<span className="sr-only"> views</span></span>
          <span className="inline-flex items-center gap-1" title="Downloads"><Download className="h-4 w-4 text-iris-600" aria-hidden="true" />{formatNumber(article.downloads)}<span className="sr-only"> downloads</span></span>
          <span aria-hidden="true" className="inline-flex items-center gap-1 font-bold uppercase tracking-[0.08em] text-iris-700">Full text <ArrowRight className="h-4 w-4" /></span>
        </span>
      </div>
    </li>
  )
}

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const [q, setQ] = useState('')
  const [theme, setTheme] = useState<string | null>(null)
  const term = q.trim().toLowerCase()
  const searchId = useId()

  const themeList = useMemo(() => {
    const m = new Map<string, number>()
    articles.forEach((a) => m.set(a.subject, (m.get(a.subject) ?? 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [articles])

  const visible = useMemo(() => articles.filter((a) =>
    (!theme || a.subject === theme) &&
    (!term || a.title.toLowerCase().includes(term) || a.authors.some((n) => n.toLowerCase().includes(term)) || a.subject.toLowerCase().includes(term))), [articles, theme, term])
  const grouped = GROUPS.map((g) => ({ ...g, items: visible.filter((a) => a.type === g.type) })).filter((g) => g.items.length)
  const filtering = !!theme || !!term
  const clear = () => { setQ(''); setTheme(null) }
  const totals = useMemo(() => ({
    views: articles.reduce((n, a) => n + a.views, 0), downloads: articles.reduce((n, a) => n + a.downloads, 0), citations: articles.reduce((n, a) => n + a.citations, 0),
  }), [articles])

  return (
    <div className="bg-j3paper">
      <Helmet><title>{`Volume ${issue.volume}, Issue ${issue.issue} (${formatMonthYear(issue.month)}) | ${journal.shortName}`}</title></Helmet>

      <Container className="py-8 sm:py-12">
        {/* Issue header */}
        <section aria-labelledby="issue-h" className="grid gap-8 border border-mauve-100 bg-j3paper-cool p-5 sm:p-8 md:grid-cols-[minmax(0,260px)_1fr] md:gap-10">
          <IssueCover volume={issue.volume} issue={issue.issue} large className="mx-auto w-full max-w-[240px] md:max-w-none" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 font-inter text-xs font-bold uppercase tracking-[0.08em]">
              <span className="bg-iris-700 px-2.5 py-1 text-white">{issue.isCurrent ? 'Current issue' : 'Past issue'}</span>
              <span className="border border-j3valid-700 bg-j3valid-50 px-2.5 py-1 text-j3valid-700">Open access · {journal.licence.name}</span>
            </div>
            <h1 id="issue-h" className="mt-4 font-jakarta font-semibold leading-[1.1] text-iris-700" style={{ fontSize: 'clamp(30px,3.4vw,44px)' }}>
              Volume {issue.volume}, Issue {issue.issue} <span aria-hidden="true">—</span><span className="sr-only">,</span> {formatMonthYear(issue.month)}
            </h1>
            <dl className="mt-6 grid grid-cols-2 gap-px border border-mauve-100 bg-mauve-100 sm:grid-cols-4">
              {[
                ['Published', formatDate(issue.publishedAt)],
                ['DOI prefix', journal.doiPrefix],
                ['Online ISSN', journal.issnOnline],
                ['Total articles', String(issue.articleCount)],
              ].map(([k, v]) => (
                <div key={k} className="bg-white px-4 py-3"><dt className={label}>{k}</dt><dd className="mt-1 font-inter text-sm font-semibold text-night-900">{v}</dd></div>
              ))}
              <div className="col-span-2 bg-white px-4 py-3 sm:col-span-4"><dt className={label}>Issue DOI</dt><dd className="mt-1 break-all font-inter text-sm font-semibold text-night-900">{issue.doi}</dd></div>
            </dl>
            <p className="mt-5 max-w-2xl font-jakarta text-lg italic leading-relaxed text-night-700">
              Articles in this issue of {journal.name}, grouped by type. Every article is open access under {journal.licence.name}.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AppLink to={paths.pastIssues} className={btnPrimary}>Browse past issues</AppLink>
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-12">
          <div className="min-w-0">
            {/* Contents search and filter */}
            <div className="border border-mauve-100 bg-white p-5">
              <h2 className="font-jakarta text-[1.375rem] font-semibold text-iris-700">Contents of this issue</h2>
              <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-4">
                <label htmlFor={searchId} className="sr-only">Search within this issue by title, author or theme</label>
                <div className="flex h-11 items-center gap-2 border border-mauve-300 bg-white pl-3 pr-1 focus-within:border-iris-700 focus-within:ring-1 focus-within:ring-iris-700">
                  <Search className="h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />
                  <input id={searchId} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this issue by title, author or theme"
                    className="min-w-0 flex-1 bg-transparent font-inter text-base text-night-900 placeholder:text-mauve-500 focus:outline-none focus-visible:!outline-none" />
                  {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="inline-flex h-9 w-9 items-center justify-center text-mauve-700 hover:bg-iris-50"><Close className="h-5 w-5" aria-hidden="true" /></button>}
                </div>
              </form>
              <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by theme">
                <button type="button" aria-pressed={!theme} onClick={() => setTheme(null)}
                  className={cx('px-3 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.06em]', !theme ? 'bg-iris-700 text-white' : 'bg-iris-50 text-iris-700 hover:bg-iris-100')}>All themes</button>
                {themeList.map(([name, n]) => (
                  <button key={name} type="button" aria-pressed={theme === name} onClick={() => setTheme(theme === name ? null : name)}
                    className={cx('px-3 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.06em]', theme === name ? 'bg-iris-700 text-white' : 'bg-iris-50 text-iris-700 hover:bg-iris-100')}>{name} ({n})</button>
                ))}
              </div>
              <p role="status" className="mt-4 font-inter text-sm text-mauve-600">{filtering ? `${visible.length} of ${articles.length} articles shown` : `${articles.length} articles in this issue`}</p>
            </div>

            {grouped.length === 0 ? (
              <div className="mt-8 border border-mauve-100 bg-white p-10 text-center">
                <p className="font-jakarta text-lg font-semibold text-iris-700">No articles match your search</p>
                <p className="mt-1 font-inter text-sm text-mauve-700">Try a different word or remove the theme filter.</p>
                <button type="button" onClick={clear} className={cx(btnPrimary, 'mt-4')}>Clear filters</button>
              </div>
            ) : (
              <div className="mt-8 space-y-10">
                {grouped.map((g) => (
                  <section key={g.type} id={gid(g.type)} aria-labelledby={`${gid(g.type)}-h`} className="scroll-mt-24">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 border-b-2 border-iris-700 bg-iris-50 px-4 py-3">
                      <h2 id={`${gid(g.type)}-h`} className="font-jakarta text-[1.25rem] font-semibold uppercase tracking-[0.02em] text-iris-700">{g.label}</h2>
                      <span className="font-inter text-sm text-mauve-600">{g.items.length} published article{g.items.length === 1 ? '' : 's'}</span>
                    </div>
                    <ul className="mt-4 space-y-4">{g.items.map((a) => <Entry key={a.paperId} article={a} />)}</ul>
                  </section>
                ))}
              </div>
            )}
          </div>

          <aside aria-label="Issue information" className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <nav aria-label="Issue navigation" className="border border-mauve-100 bg-white p-5">
              <h2 className={label}>Issue navigation</h2>
              <AppLink to={paths.pastIssues} className="mt-4 flex items-center justify-center gap-2 bg-iris-50 px-4 py-3 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-100">Browse the archive <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
              {!issue.isCurrent && <AppLink to={paths.currentIssue} className="mt-2 flex items-center justify-center gap-2 border border-mauve-100 px-4 py-3 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-50">Go to current issue</AppLink>}
            </nav>

            <nav aria-label="Section index" className="border border-mauve-100 bg-white p-5">
              <h2 className={label}>Section index in vol. {issue.volume}({issue.issue})</h2>
              <ul className="mt-3 divide-y divide-mauve-100">
                {GROUPS.map((g) => {
                  const n = articles.filter((a) => a.type === g.type).length
                  if (!n) return null
                  const shown = grouped.some((x) => x.type === g.type)
                  return (
                    <li key={g.type}>
                      {shown
                        ? <a href={`#${gid(g.type)}`} className="flex items-center justify-between gap-3 py-2.5 font-inter text-sm text-night-900 hover:text-ember-700"><span>{g.label}</span><span className="bg-iris-50 px-2 py-0.5 text-xs font-bold text-iris-700">{n}</span></a>
                        : <span className="flex items-center justify-between gap-3 py-2.5 font-inter text-sm text-mauve-600"><span>{g.label}</span><span className="bg-iris-50 px-2 py-0.5 text-xs font-bold">{n}</span></span>}
                    </li>
                  )
                })}
              </ul>
            </nav>

            <section aria-label="Issue readership" className="border border-mauve-100 bg-white p-5">
              <h2 className={label}>Issue readership</h2>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                {([['Views', totals.views, Eye], ['Downloads', totals.downloads, Download], ['Citations', totals.citations, Quote]] as const).map(([k, v, Icon]) => (
                  <div key={k} className="bg-j3paper-cool px-2 py-3"><Icon className="mx-auto mb-1 h-5 w-5 text-iris-600" aria-hidden="true" /><dd className="font-jakarta text-lg font-semibold text-iris-700">{formatNumber(Number(v))}</dd><dt className="font-inter text-xs text-mauve-600">{k}</dt></div>
                ))}
              </dl>
            </section>
          </aside>
        </div>
      </Container>
    </div>
  )
}
