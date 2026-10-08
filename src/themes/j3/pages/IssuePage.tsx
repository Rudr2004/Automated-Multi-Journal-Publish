// Issue page as a printed "Table of Contents": cover spread, then entries grouped by article type with dotted leaders and page numbers.
import { useId, useMemo, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate, formatMonthYear } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { ArticleSummary, ArticleType, IssueData } from '../../../core/types'
import { ButtonLink } from '../components/Button'
import { IssueCover } from '../components/IssueCover'
import { Container, cx, EmptyState, Kicker } from '../components/primitives'
import { themeColor } from '../components/themes'
import { Button } from '../components/Button'
import { ChevronDown, Close, History, Search } from '../icons'

const GROUPS: { type: ArticleType; label: string }[] = [
  { type: 'Editorial', label: 'Editorial' },
  { type: 'Research Article', label: 'Research Articles' },
  { type: 'Review Article', label: 'Review Articles' },
  { type: 'Short Communication', label: 'Short Communications' },
]

function Entry({ article }: { article: ArticleSummary }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <li className="relative border-b border-mauve-100 py-6 first:pt-2">
      <div className="flex items-end gap-3">
        <h3 className="min-w-0 font-jakarta text-[1.375rem] font-extrabold leading-snug tracking-tight text-night-900 sm:text-[1.5rem]">
          <AppLink to={paths.article(article.paperId)} className="hover:text-iris-700 after:absolute after:inset-0 after:content-['']">{article.title}</AppLink>
        </h3>
        <span aria-hidden="true" className="mb-2 min-w-6 flex-1 border-b-2 border-dotted border-mauve-300" />
        <span className="shrink-0 font-jakarta text-lg font-extrabold tabular-nums text-night-900"><span className="sr-only">Pages </span>{article.pages}</span>
      </div>
      <p className="mt-2 max-w-3xl text-base text-mauve-700">{article.authors.join(', ')}</p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-jakarta text-sm font-bold" style={{ color: themeColor(article.subject) }}>{article.subject}</span>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
          className="relative z-10 inline-flex items-center gap-1 rounded-full bg-iris-50 px-3.5 py-1.5 font-jakarta text-sm font-bold text-iris-700 hover:bg-iris-100">
          Abstract <ChevronDown className={cx('h-4 w-4 transition-transform motion-reduce:transition-none', open && 'rotate-180')} aria-hidden="true" />
        </button>
      </div>
      {open && <p id={id} className="relative z-10 mt-3 max-w-3xl rounded-tile bg-iris-50 p-5 text-base leading-relaxed text-mauve-800">{article.abstract}</p>}
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

  return (
    <>
      <Helmet><title>{`Volume ${issue.volume}, Issue ${issue.issue} (${formatMonthYear(issue.month)}) | ${journal.shortName}`}</title></Helmet>

      <section className="bg-night-900 text-white">
        <Container className="grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[minmax(0,300px)_1fr] md:gap-14 lg:py-20">
          <IssueCover volume={issue.volume} issue={issue.issue} large className="mx-auto w-full max-w-[260px] md:max-w-none" />
          <div>
            <Kicker className="text-ember-400">{issue.isCurrent ? 'Current issue' : 'Past issue'}</Kicker>
            <h1 className="mt-3 font-jakarta font-extrabold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(32px,3.4vw,44px)' }}>
              Volume {issue.volume}, Issue {issue.issue}
              <span className="block text-iris-200">{formatMonthYear(issue.month)}</span>
            </h1>
            <dl className="mt-8 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 text-base sm:grid-cols-3">
              <div><dt className="text-sm text-night-200">Articles</dt><dd className="font-jakarta font-bold">{issue.articleCount}</dd></div>
              <div><dt className="text-sm text-night-200">Published</dt><dd className="font-jakarta font-bold">{formatDate(issue.publishedAt)}</dd></div>
              <div><dt className="text-sm text-night-200">ISSN (online)</dt><dd className="font-jakarta font-bold">{journal.issnOnline}</dd></div>
              <div className="col-span-2 sm:col-span-3"><dt className="text-sm text-night-200">Issue DOI</dt><dd className="break-all font-jakarta font-bold">{issue.doi}</dd></div>
            </dl>
            <ButtonLink to={paths.pastIssues} variant="light" className="mt-8"><History className="h-5 w-5" aria-hidden="true" /> Browse past issues</ButtonLink>
          </div>
        </Container>
      </section>

      <Container className="py-14 sm:py-20">
        <div className="mb-10 border-b-2 border-night-900 pb-6">
          <Kicker className="text-iris-700">In this issue</Kicker>
          <h2 className="mt-2 font-jakarta text-[1.75rem] font-extrabold leading-tight tracking-tight text-night-900 sm:text-[2.125rem]">Contents</h2>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="mt-6 max-w-xl">
            <label htmlFor={searchId} className="sr-only">Search within this issue by title, author or theme</label>
            <div className="flex h-[52px] items-center gap-2 rounded-full bg-white pl-5 pr-2 ring-1 ring-mauve-300 focus-within:ring-2 focus-within:ring-iris-700">
              <Search className="h-5 w-5 shrink-0 text-mauve-500" aria-hidden="true" />
              <input id={searchId} type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search this issue by title, author or theme"
                className="min-w-0 flex-1 bg-transparent text-base text-night-900 placeholder:text-mauve-500 focus:outline-none focus-visible:!outline-none" />
              {q && <button type="button" onClick={() => setQ('')} aria-label="Clear search" className="inline-flex h-9 w-9 items-center justify-center rounded-full text-mauve-700 hover:bg-iris-50"><Close className="h-5 w-5" aria-hidden="true" /></button>}
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by theme">
            <button type="button" aria-pressed={!theme} onClick={() => setTheme(null)}
              className={cx('rounded-full px-4 py-2 font-jakarta text-sm font-bold', !theme ? 'bg-iris-700 text-white' : 'bg-iris-50 text-night-900 hover:bg-iris-100')}>All themes</button>
            {themeList.map(([name, n]) => (
              <button key={name} type="button" aria-pressed={theme === name} onClick={() => setTheme(theme === name ? null : name)}
                className={cx('rounded-full px-4 py-2 font-jakarta text-sm font-bold', theme === name ? 'bg-iris-700 text-white' : 'bg-iris-50 text-night-900 hover:bg-iris-100')}>{name} <span className={theme === name ? 'text-iris-100' : 'text-mauve-600'}>({n})</span></button>
            ))}
          </div>
          <p role="status" className="mt-4 text-sm text-mauve-700">{filtering ? `${visible.length} of ${articles.length} articles shown` : `${articles.length} articles in this issue`}</p>
        </div>

        {grouped.length === 0 ? (
          <EmptyState title="No articles match your search" text="Try a different word or remove the theme filter."
            action={<Button variant="primary" onClick={clear}>Clear filters</Button>} />
        ) : (
          <div className="space-y-14">
            {grouped.map((g) => (
              <section key={g.type} aria-labelledby={`grp-${g.type.replace(/\s/g, '')}`}>
                <h2 id={`grp-${g.type.replace(/\s/g, '')}`} className="mb-2 flex items-baseline gap-3 font-jakarta text-[1.75rem] font-extrabold tracking-tight text-iris-700 sm:text-[1.75rem]">
                  {g.label} <span className="text-base font-bold text-mauve-600">{g.items.length}</span>
                </h2>
                <ul>{g.items.map((a) => <Entry key={a.paperId} article={a} />)}</ul>
              </section>
            ))}
          </div>
        )}
      </Container>
    </>
  )
}
