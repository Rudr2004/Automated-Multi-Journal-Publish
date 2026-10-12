// Issue page after the "current issue with refined author profiles" reference (Academic Editorial & Press): breadcrumb, an issue header card (cover, status tags,
// six-cell metadata, actions), an issue-navigation strip, a left "Explore this volume" rail, a search-within-issue panel, per-article cards with author profiles,
// pagination and an author's-desk band. Search, theme filters and the abstract toggle are kept; everything shown comes from the issue data.
import { useEffect, useId, useMemo, useState, type ReactNode } from 'react'
import { Helmet } from 'react-helmet-async'
import { api } from '../../../core/api'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink, useRouter } from '../../../core/router'
import { ARTICLE_TYPES, type ArticleSummary, type ArticleType, type IssueData, type IssueSummary } from '../../../core/types'
import { AuthorProfiles, OaTag, Pager, StreamTag, TypeTag, useFullArticles } from '../components/IssueParts'
import { IssueCover } from '../components/IssueCover'
import { Container, cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { ArrowRight, Calendar, ChevronDown, Close, Download, Eye, FactCheck, OpenInNew, Quote, Search, Submit, Track } from '../icons'

const PAGE_SIZE = 5
type Sort = 'page' | 'views' | 'downloads' | 'title'
const SORTS: { id: Sort; label: string }[] = [
  { id: 'page', label: 'Page order (default)' }, { id: 'views', label: 'Most viewed' }, { id: 'downloads', label: 'Most downloaded' }, { id: 'title', label: 'Title A to Z' },
]
const TYPE_LABEL: Record<ArticleType, string> = { Editorial: 'Editorial', 'Research Article': 'Research Articles', 'Review Article': 'Review Articles', 'Short Communication': 'Short Communications' }

const btnPrimary = 'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-tile border border-iris-700 bg-iris-700 px-4 font-jakarta text-[13px] font-semibold text-white hover:border-iris-800 hover:bg-iris-800'
const btnSecondary = 'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-tile border border-j3paper-rule bg-white px-4 font-jakarta text-[13px] font-semibold text-night-900 hover:border-iris-700 hover:bg-j3paper-cool'
const btnOrange = 'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-tile border border-ember-500 bg-ember-500 px-4 font-jakarta text-[13px] font-bold text-night-900 hover:bg-ember-400'
const railLabel = 'font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-mauve-600'
const marker = <span aria-hidden="true" className="inline-block h-2 w-2 shrink-0 bg-ember-500" />

/** Section heading with the 8x8 orange square marker. */
const SectionHead = ({ id, children, className }: { id?: string; children: ReactNode; className?: string }) => (
  <h2 id={id} className={cx('flex items-center gap-2.5 font-jakarta text-sm font-extrabold uppercase tracking-[0.06em] text-night-900', className)}>{marker}{children}</h2>
)

function Entry({ article, full }: { article: ArticleSummary; full: Parameters<typeof AuthorProfiles>[0]['full'] }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const toast = useToast()
  const doi = doiFor(article.paperId)
  const crossref = journal.logos.find((l) => l.id === 'crossref')?.verifyUrl ?? 'https://search.crossref.org/'
  return (
    <li className="border border-j3paper-rule bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-2">
        <StreamTag>{article.subject}</StreamTag>
        <OaTag licence={journal.licence.name} />
        <TypeTag>{article.type}</TypeTag>
        {article.pages && <span className="ml-auto font-mono text-xs tabular-nums text-mauve-600">pp. {article.pages}</span>}
      </div>
      <h3 className="mt-4 border-b border-j3paper-rule pb-4 font-jakarta text-[1.25rem] font-bold leading-snug text-night-900 sm:text-[1.375rem]">
        <AppLink to={paths.article(article.paperId)} className="hover:text-iris-700 hover:underline hover:underline-offset-4">{article.title}</AppLink>
      </h3>

      <div className="mt-4"><AuthorProfiles article={article} full={full} /></div>

      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
        className="mt-5 flex w-full items-center justify-between gap-3 border border-j3paper-rule bg-j3paper-cool px-4 py-3 text-left font-inter text-sm font-semibold text-iris-700 hover:border-iris-700">
        <span>Abstract <span className="font-normal text-mauve-600">(click to {open ? 'collapse' : 'expand'})</span></span>
        <ChevronDown className={cx('h-5 w-5 shrink-0 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && <p id={id} className="border border-t-0 border-j3paper-rule bg-j3paper-cool px-4 pb-4 pt-1 font-inter text-[15px] leading-[1.65] text-night-900">{article.abstract}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-inter text-xs text-mauve-700">
        <p className="flex flex-wrap items-center gap-2">
          <span className="font-mono">DOI:</span>
          <a href={`https://doi.org/${doi}`} target="_blank" rel="noopener noreferrer" className="break-all font-mono text-iris-700 underline underline-offset-2 hover:text-iris-800">{doi}</a>
          <a href={`${crossref}?q=${encodeURIComponent(doi)}`} target="_blank" rel="noopener noreferrer" aria-label={`Verify the DOI of ${article.title} (opens in a new tab)`}
            className="inline-flex items-center gap-1 border border-j3valid-700 bg-j3valid-50 px-2 py-1 font-semibold text-j3valid-800 hover:bg-j3valid-100">Verify DOI<OpenInNew className="h-3.5 w-3.5" aria-hidden="true" /></a>
        </p>
        <p className="flex items-center gap-4 tabular-nums">
          <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4 text-iris-600" aria-hidden="true" />Views: <b className="font-semibold text-night-900">{formatNumber(article.views)}</b></span>
          <span className="inline-flex items-center gap-1"><Download className="h-4 w-4 text-iris-600" aria-hidden="true" />Downloads: <b className="font-semibold text-night-900">{formatNumber(article.downloads)}</b></span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-j3paper-rule pt-4">
        <AppLink to={paths.article(article.paperId)} className={btnOrange}><Eye className="h-4 w-4" aria-hidden="true" />View full article</AppLink>
        <button type="button" onClick={() => { downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded`) }} className={btnPrimary}><Download className="h-4 w-4" aria-hidden="true" />Download PDF</button>
        <span className="ml-auto font-inter text-xs text-mauve-600">Published {formatDate(article.publishedAt)}</span>
      </div>
    </li>
  )
}

function FilterRow({ active, count, onClick, children }: { active: boolean; count: number; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick}
      className={cx('flex w-full items-center justify-between gap-3 px-3 py-2 text-left font-inter text-[13px]', active ? 'bg-iris-700 font-semibold text-white' : 'text-night-900 hover:bg-j3paper-cool')}>
      <span className="flex min-w-0 items-center gap-2">{active && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 bg-ember-500" />}<span className="min-w-0">{children}</span></span>
      <span className={cx('shrink-0 px-1.5 text-xs font-semibold tabular-nums', active ? 'bg-white/20 text-white' : 'text-mauve-600')}>{count}</span>
    </button>
  )
}

export function IssuePage({ data }: { data: IssueData }) {
  const { issue, articles } = data
  const { navigate } = useRouter()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [theme, setTheme] = useState<string | null>(null)
  const [type, setType] = useState<ArticleType | null>(null)
  const [sort, setSort] = useState<Sort>('page')
  const [page, setPage] = useState(1)
  const [allIssues, setAllIssues] = useState<IssueSummary[]>([])
  const term = q.trim().toLowerCase()
  const searchId = useId()
  const sortId = useId()
  const jumpId = useId()

  useEffect(() => { let live = true; api.listIssues().then((l) => { if (live) setAllIssues(l) }).catch(() => {}); return () => { live = false } }, [])
  useEffect(() => { setQ(''); setTheme(null); setType(null); setSort('page'); setPage(1) }, [issue.volume, issue.issue])
  useEffect(() => { setPage(1) }, [term, theme, type, sort])

  const themeList = useMemo(() => {
    const m = new Map<string, number>()
    articles.forEach((a) => m.set(a.subject, (m.get(a.subject) ?? 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [articles])
  const typeList = ARTICLE_TYPES.map((t) => [t, articles.filter((a) => a.type === t).length] as const).filter(([, n]) => n > 0)

  const visible = useMemo(() => {
    const list = articles.filter((a) =>
      (!theme || a.subject === theme) && (!type || a.type === type) &&
      (!term || a.title.toLowerCase().includes(term) || a.authors.some((n) => n.toLowerCase().includes(term)) || a.subject.toLowerCase().includes(term) || a.paperId.toLowerCase().includes(term)))
    if (sort === 'views') return [...list].sort((a, b) => b.views - a.views)
    if (sort === 'downloads') return [...list].sort((a, b) => b.downloads - a.downloads)
    if (sort === 'title') return [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [articles, theme, type, term, sort])
  const filtering = !!theme || !!type || !!term
  const clear = () => { setQ(''); setTheme(null); setType(null) }
  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const current = Math.min(page, pages)
  const shown = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)
  const full = useFullArticles(shown)
  const totals = useMemo(() => ({
    views: articles.reduce((n, a) => n + a.views, 0), downloads: articles.reduce((n, a) => n + a.downloads, 0), citations: articles.reduce((n, a) => n + a.citations, 0),
  }), [articles])

  // Neighbouring issues (the list is newest first).
  const idx = allIssues.findIndex((i) => i.volume === issue.volume && i.issue === issue.issue)
  const prev = idx >= 0 ? allIssues[idx + 1] : undefined
  const next = idx > 0 ? allIssues[idx - 1] : undefined
  const issueName = `Volume ${issue.volume}, Issue ${issue.issue}`
  const longName = `${issueName} (${formatMonthYear(issue.month)})`

  const downloadIndex = () => {
    const esc = (s: string) => `"${s.replace(/"/g, '""')}"`
    const rows = [['Paper ID', 'Type', 'Theme', 'Title', 'Authors', 'Pages', 'Published', 'DOI'], ...articles.map((a) => [a.paperId, a.type, a.subject, a.title, a.authors.join('; '), a.pages, a.publishedAt, doiFor(a.paperId)])]
    const url = URL.createObjectURL(new Blob(['﻿' + rows.map((r) => r.map(esc).join(',')).join('\r\n')], { type: 'text/csv;charset=utf-8' }))
    const a = document.createElement('a')
    a.href = url; a.download = `${journal.shortName}-V${issue.volume}I${issue.issue}-index.csv`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    toast('Issue index downloaded')
  }
  const citeIssue = async () => {
    const publisher = journal.info.find(([k]) => k === 'Publisher')?.[1] ?? ''
    const ok = await copyText(`${journal.name}. (${issue.month.slice(0, 4)}). ${longName}. ${publisher}. https://doi.org/${issue.doi}`)
    toast(ok ? 'Issue citation copied' : 'Could not copy the citation', ok ? 'success' : 'error')
  }

  const meta: [string, string, boolean?][] = [
    ['Volume', `Volume ${issue.volume}`], ['Issue', `Issue ${issue.issue}`, true], ['Issue period', formatMonthYear(issue.month)],
    ['Status & frequency', issue.isCurrent ? 'Current · Monthly' : 'Archived · Monthly'], ['DOI prefix', journal.doiPrefix], ['Access model', `Open Access (${journal.licence.name})`],
  ]

  return (
    <div className="bg-white">
      <Helmet><title>{`${longName}${issue.isCurrent ? ' · Current issue' : ''} | ${journal.shortName}`}</title></Helmet>

      <Container className="pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb" className="font-inter text-[13px] text-mauve-700">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <li><AppLink to={paths.home} className="hover:text-iris-700 hover:underline">Home</AppLink></li>
            <li aria-hidden="true">›</li>
            <li><AppLink to={paths.pastIssues} className="hover:text-iris-700 hover:underline">All volumes &amp; archives</AppLink></li>
            <li aria-hidden="true">›</li>
            <li>Volume {issue.volume}</li>
            <li aria-hidden="true">›</li>
            <li aria-current="page" className="font-semibold text-night-900">Issue {issue.issue} ({formatMonthYear(issue.month)}){issue.isCurrent && ' · Current issue'}</li>
          </ol>
        </nav>

        {/* Issue header */}
        <section aria-labelledby="issue-h" className="mt-5 grid gap-6 border border-j3paper-rule bg-j3paper-cool p-4 sm:p-6 md:grid-cols-[minmax(0,280px)_1fr] md:gap-8">
          <div className="mx-auto w-full max-w-[260px] md:max-w-none">
            <div className="border border-j3paper-rule bg-white p-4"><IssueCover volume={issue.volume} issue={issue.issue} large /></div>
            <p className="mt-3 border border-j3paper-rule bg-j3paper-deep px-3 py-2 text-center font-inter text-xs font-medium text-iris-800">Issue cover page</p>
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-iris-700 px-2 py-1 font-jakarta text-[11px] font-bold uppercase tracking-[0.04em] text-white">{issue.isCurrent ? 'Current issue' : 'Past issue'}</span>
              <OaTag licence={journal.licence.name} />
              <span className="ml-auto font-mono text-xs text-mauve-600">DOI: {issue.doi}</span>
            </div>
            <h1 id="issue-h" className="mt-4 font-jakarta font-extrabold leading-[1.1] tracking-[-0.01em] text-night-900" style={{ fontSize: 'clamp(28px,3.4vw,44px)' }}>
              {issueName} <span aria-hidden="true">·</span><span className="sr-only">,</span> {formatMonthYear(issue.month)}
            </h1>
            <p className="mt-3 max-w-3xl font-inter text-[15px] leading-relaxed text-mauve-700">
              Articles in this issue of {journal.name}, with author profiles, affiliations and persistent DOIs. Every article is open access under {journal.licence.name}.
            </p>
            <dl className="mt-6 grid grid-cols-2 border border-j3paper-rule bg-white md:grid-cols-3 xl:grid-cols-6">
              {meta.map(([k, v, accent]) => (
                <div key={k} className="min-w-0 border-b border-r border-j3paper-rule px-4 py-3 xl:border-b-0">
                  <dt className="font-inter text-[10px] font-medium uppercase tracking-[0.06em] text-mauve-600">{k}</dt>
                  <dd className={cx('mt-1 font-jakarta text-[13px] font-bold leading-snug', accent ? 'text-iris-700' : 'text-night-900')}>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <button type="button" onClick={downloadIndex} className={btnPrimary}><Download className="h-4 w-4" aria-hidden="true" />Download issue index</button>
              <button type="button" onClick={citeIssue} className={btnSecondary}><Quote className="h-4 w-4" aria-hidden="true" />Cite entire issue</button>
              <AppLink to={paths.pastIssues} className={btnSecondary}><Calendar className="h-4 w-4" aria-hidden="true" />Browse past issues</AppLink>
            </div>
          </div>
        </section>

        {/* Issue navigation strip */}
        <nav aria-label="Issue navigation" className="mt-5 grid items-center gap-x-6 gap-y-3 border border-j3paper-rule bg-j3paper-cool px-4 py-3 font-inter text-[13px] lg:grid-cols-[1fr_auto_1fr]">
          {prev
            ? <AppLink to={paths.issue(prev.volume, prev.issue)} className="font-semibold text-iris-700 hover:underline"><span aria-hidden="true">← </span>Previous issue: Vol. {prev.volume}, Iss. {prev.issue} ({formatMonthYear(prev.month)})</AppLink>
            : <span className="text-mauve-600">First issue of the journal</span>}
          <div className="flex flex-wrap items-center gap-2 lg:justify-center">
            <label htmlFor={jumpId} className="text-mauve-600">Quick issue jump:</label>
            <select id={jumpId} value={`${issue.volume}/${issue.issue}`} onChange={(e) => { const [v, i] = e.target.value.split('/').map(Number); navigate(paths.issue(v, i)) }}
              className="h-9 max-w-[19rem] rounded-tile border border-j3paper-rule bg-white px-2 font-semibold text-night-900 hover:border-iris-700">
              {(allIssues.length ? allIssues : [issue]).map((i) => <option key={`${i.volume}/${i.issue}`} value={`${i.volume}/${i.issue}`}>Vol. {i.volume}, Iss. {i.issue} ({formatMonthYear(i.month)}){i.isCurrent ? ' · Current' : ''}</option>)}
            </select>
            <AppLink to={paths.pastIssues} className="inline-flex h-9 items-center rounded-tile border border-j3paper-rule bg-white px-3 font-semibold text-night-900 hover:border-iris-700">Archive directory</AppLink>
          </div>
          {next
            ? <AppLink to={paths.issue(next.volume, next.issue)} className="lg:text-right font-semibold text-iris-700 hover:underline">Next issue: Vol. {next.volume}, Iss. {next.issue} ({formatMonthYear(next.month)})<span aria-hidden="true"> →</span></AppLink>
            : <span className="text-mauve-600 lg:text-right">Next issue: {journal.nextIssue.label} (in progress)</span>}
        </nav>
      </Container>

      <Container className="py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[300px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* Left rail */}
          <aside aria-label="Explore this volume" className="order-2 min-w-0 space-y-6 lg:order-1">
            <section className="border border-j3paper-rule bg-j3paper-cool p-4">
              <SectionHead className="pb-3">Explore this volume</SectionHead>
              <div className="border-t border-j3paper-rule pt-3">
                <h3 className={railLabel}>Filter by stream / subject</h3>
                <div className="mt-2 space-y-0.5">
                  <FilterRow active={!theme} count={articles.length} onClick={() => setTheme(null)}>All academic streams</FilterRow>
                  {themeList.map(([name, n]) => <FilterRow key={name} active={theme === name} count={n} onClick={() => setTheme(theme === name ? null : name)}>{name}</FilterRow>)}
                </div>
              </div>
              <div className="mt-4 border-t border-j3paper-rule pt-3">
                <h3 className={railLabel}>Filter by article type</h3>
                <div className="mt-2 space-y-0.5">
                  <FilterRow active={!type} count={articles.length} onClick={() => setType(null)}>All types</FilterRow>
                  {typeList.map(([t, n]) => <FilterRow key={t} active={type === t} count={n} onClick={() => setType(type === t ? null : t)}>{TYPE_LABEL[t]}</FilterRow>)}
                </div>
              </div>
              <div className="mt-4 border-t border-j3paper-rule pt-3">
                <h3 className={railLabel}>Access &amp; recognition</h3>
                <p className="mt-2 flex items-center justify-between gap-3 px-3 py-2 font-inter text-[13px] text-night-900">
                  <span>Open Access {journal.licence.name}</span><span className="text-xs font-semibold tabular-nums text-mauve-600">{articles.length}</span>
                </p>
              </div>
            </section>

            <section aria-label="Issue metrics" className="border border-j3paper-rule bg-j3paper-cool p-4">
              <div className="flex items-center justify-between border-b border-j3paper-rule pb-3">
                <SectionHead>Issue metrics</SectionHead>
                <span className="font-mono text-xs text-mauve-600">{issue.month.slice(0, 4)}</span>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                {([['Downloads', totals.downloads, Download], ['Views', totals.views, Eye], ['Citations', totals.citations, Quote]] as const).map(([k, v, Icon]) => (
                  <div key={k} className="border border-j3paper-rule bg-white px-1 py-3">
                    <Icon className="mx-auto h-5 w-5 text-iris-600" aria-hidden="true" />
                    <dt className="mt-1 font-jakarta text-[10px] font-bold uppercase tracking-[0.04em] text-mauve-600">{k}</dt>
                    <dd className="font-jakarta text-base font-bold tabular-nums text-night-900">{formatNumber(Number(v))}</dd>
                  </div>
                ))}
              </dl>
              <dl className="mt-4 space-y-1.5 font-inter text-xs text-mauve-700">
                <div><dt className="inline font-semibold text-night-900">Publisher: </dt><dd className="inline">{journal.info.find(([k]) => k === 'Publisher')?.[1]}</dd></div>
                <div><dt className="inline font-semibold text-night-900">DOI registration: </dt><dd className="inline">Crossref</dd></div>
                <div><dt className="inline font-semibold text-night-900">Online ISSN: </dt><dd className="inline tabular-nums">{journal.issnOnline}</dd></div>
              </dl>
            </section>

            <section aria-label="Author's desk" className="border border-j3paper-rule bg-white p-4">
              <SectionHead className="pb-3">Author's desk</SectionHead>
              <p className="border-t border-j3paper-rule pt-3 font-inter text-[13px] leading-relaxed text-mauve-700">Ready to publish with {journal.shortName}? Submit your manuscript or follow one you have already sent.</p>
              <div className="mt-3 flex flex-col gap-2">
                <AppLink to={paths.submit} className={btnOrange}><Submit className="h-4 w-4" aria-hidden="true" />Submit manuscript</AppLink>
                <AppLink to={paths.track} className={btnSecondary}><Track className="h-4 w-4" aria-hidden="true" />Track my paper</AppLink>
              </div>
            </section>
          </aside>

          {/* Main column */}
          <div className="order-1 min-w-0 lg:order-2">
            <section aria-labelledby={`${searchId}-h`} className="border border-j3paper-rule border-t-2 border-t-iris-700 bg-j3paper-cool p-4 sm:p-5">
              <SectionHead id={`${searchId}-h`}>Search within Volume {issue.volume}, Issue {issue.issue}</SectionHead>
              <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-4 flex flex-col gap-3 sm:flex-row">
                <label htmlFor={searchId} className="sr-only">Search within this issue by title, author, theme or paper ID</label>
                <div className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-tile border border-j3paper-rule bg-white pl-3 pr-1 focus-within:border-iris-700 focus-within:ring-1 focus-within:ring-iris-700">
                  <Search className="h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />
                  <input id={searchId} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, author, keyword or paper ID"
                    className="min-w-0 flex-1 bg-transparent font-inter text-sm text-night-900 placeholder:text-mauve-500 focus:outline-none focus-visible:!outline-none" />
                  {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="inline-flex h-9 w-9 items-center justify-center text-mauve-700 hover:bg-j3paper-deep"><Close className="h-5 w-5" aria-hidden="true" /></button>}
                </div>
                <button type="submit" className={cx(btnPrimary, 'h-11 sm:px-5')}><Search className="h-4 w-4" aria-hidden="true" />Search issue</button>
              </form>
              <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Quick topic scope">
                <span className={railLabel}>Quick topic scope:</span>
                {themeList.slice(0, 4).map(([name]) => (
                  <button key={name} type="button" aria-pressed={theme === name} onClick={() => setTheme(theme === name ? null : name)}
                    className={cx('rounded-tile border px-2.5 py-1 font-inter text-xs', theme === name ? 'border-iris-700 bg-iris-700 font-semibold text-white' : 'border-j3paper-rule bg-white text-night-900 hover:border-iris-700')}>{name}</button>
                ))}
              </div>
            </section>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border border-j3paper-rule bg-white px-4 py-3">
              <p role="status" className="font-inter text-sm text-mauve-700">{filtering ? `${visible.length} of ${articles.length} articles shown` : `${articles.length} articles in this issue`}</p>
              <div className="flex items-center gap-2 font-inter text-sm">
                <label htmlFor={sortId} className="text-mauve-600">Sort by:</label>
                <select id={sortId} value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-9 rounded-tile border border-j3paper-rule bg-white px-2 font-semibold text-night-900 hover:border-iris-700">
                  {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {visible.length === 0 ? (
              <div className="mt-5 border border-j3paper-rule bg-white p-10 text-center">
                <p className="font-jakarta text-lg font-bold text-night-900">No articles match your search</p>
                <p className="mt-1 font-inter text-sm text-mauve-700">Try a different word or remove a filter.</p>
                <button type="button" onClick={clear} className={cx(btnPrimary, 'mt-4')}>Clear filters</button>
              </div>
            ) : (
              <>
                <ul className="mt-5 space-y-5" aria-label="Articles in this issue">
                  {shown.map((a) => <Entry key={a.paperId} article={a} full={full[a.paperId]} />)}
                </ul>
                <div className="mt-5"><Pager page={current} pages={pages} onPage={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }} label="Issue articles pagination" /></div>
              </>
            )}
          </div>
        </div>
      </Container>

      {/* Author's desk band */}
      <section aria-labelledby="desk-h" className="bg-night-900 text-white">
        <Container className="grid gap-8 py-10 sm:py-12 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="flex items-center gap-2.5 font-jakarta text-xs font-extrabold uppercase tracking-[0.08em]">{marker}Author's desk</p>
            <h2 id="desk-h" className="mt-4 font-jakarta text-[1.75rem] font-extrabold leading-tight sm:text-[2rem]">Submit your scholarly work to {journal.shortName}</h2>
            <p className="mt-3 max-w-xl font-inter text-[15px] leading-relaxed text-iris-100">Accepted articles are published open access under {journal.licence.name} and receive a permanent Crossref DOI under {journal.doiPrefix}.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AppLink to={paths.submit} className="inline-flex h-11 items-center justify-center gap-2 rounded-tile border border-white bg-white px-5 font-jakarta text-[13px] font-bold text-night-900 hover:bg-j3paper-deep"><Submit className="h-4 w-4" aria-hidden="true" />Submit manuscript online</AppLink>
              <AppLink to={paths.policy('author-guidelines')} className="inline-flex h-11 items-center justify-center rounded-tile border border-white/60 px-5 font-jakarta text-[13px] font-bold text-white hover:bg-white/10">Author guidelines</AppLink>
            </div>
          </div>
          <div className="border border-white/20 bg-night-800 p-5 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <h3 className="font-jakarta text-sm font-extrabold uppercase tracking-[0.06em]">Track submission status</h3>
              <span className="font-mono text-xs text-iris-200">Manuscript tracker</span>
            </div>
            <p className="mt-4 font-inter text-sm leading-relaxed text-iris-100">Check where your paper is in the workflow, from submission and review to decision, payment and publication, using your Paper ID.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <AppLink to={paths.track} className="inline-flex h-10 items-center justify-center gap-2 rounded-tile border border-iris-500 bg-iris-600 px-4 font-jakarta text-[13px] font-semibold text-white hover:bg-iris-500"><Track className="h-4 w-4" aria-hidden="true" />Open the tracker<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
              <AppLink to={paths.verify()} className="inline-flex h-10 items-center justify-center gap-2 rounded-tile border border-white/30 px-4 font-jakarta text-[13px] font-semibold text-white hover:bg-white/10"><FactCheck className="h-4 w-4" aria-hidden="true" />Verify a certificate</AppLink>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}
