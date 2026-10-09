import { Search } from '../components/uiIcons'
import { useMemo, useState } from 'react'
import type { ArticleSummary, IssueSummary } from '../../../mock-data/journals/j1'
import { AccordionItem } from '../components/Accordion'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { IssueArticleCard } from '../components/IssueArticleCard'
import { inputClass } from '../components/form'
import { IssueCard } from '../components/IssueCard'
import { Container, EmptyState } from '../components/primitives'
import { WithAwardsRail } from '../components/WithAwardsRail'
import { AppLink } from '../../../core/router'
import { paths } from '../../../config/routes'
import { formatMonthYear } from '../../../core/lib/format'

const MONTH = (m: string) => formatMonthYear(m).split(' ')[0]

export function PastIssuesPage({ issues, articles }: { issues: IssueSummary[]; articles: ArticleSummary[] }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState<number | null>(null)
  const [open, setOpen] = useState<Record<number, boolean>>(() => ({ [Math.max(...issues.map((i) => i.volume))]: true }))

  const volumes = useMemo(() => {
    const map = new Map<number, IssueSummary[]>()
    issues.forEach((i) => map.set(i.volume, [...(map.get(i.volume) ?? []), i]))
    return [...map.entries()].sort((a, b) => b[0] - a[0]).map(([volume, list]) => ({ volume, year: list[0].month.slice(0, 4), list: list.sort((a, b) => b.issue - a.issue) }))
  }, [issues])

  const q = query.trim().toLowerCase()
  const results = useMemo(() => q
    ? articles.filter((a) => [a.title, a.authors.join(' '), a.paperId, `10.55041/${a.paperId}`, a.subject].some((f) => f.toLowerCase().includes(q))).slice(0, 20)
    : [], [articles, q])

  const goTo = (volume: number) => {
    setOpen((o) => ({ ...o, [volume]: true }))
    setActive(volume)
    requestAnimationFrame(() => document.getElementById(`volume-${volume}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  return (
    <>
      <Container>
        <Breadcrumbs items={[{ label: 'Home', to: paths.home }, { label: 'Past Issues' }]} />
        <header className="border-b border-line pb-5">
          <h1 className="font-serif text-[1.875rem] font-semibold leading-tight tracking-tight text-navy sm:text-[2.5rem] sm:leading-[3rem]">Archives: Past Issues</h1>
          <p className="mt-2 max-w-2xl text-[1.0625rem] leading-relaxed text-ink-muted">Browse every published volume and issue. All articles are open access and free to read.</p>
        </header>
      </Container>
      <WithAwardsRail className="mt-8 pb-12"><div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Desktop timeline */}
        <nav aria-label="Volumes timeline" className="hidden lg:block">
          <div className="sticky top-20 border border-line bg-white p-5">
            <h2 className="border-b border-line pb-3 font-serif text-[1.25rem] font-semibold text-navy">Archive timeline</h2>
            <ol className="mt-4 space-y-5 border-l border-line pl-4">
              {volumes.map((v) => (
                <li key={v.volume} className="relative">
                  <span className={`absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-white ${active === v.volume ? 'bg-navy' : 'bg-navy-300'}`} />
                  <button type="button" onClick={() => goTo(v.volume)} className={`text-left font-serif text-lg font-semibold ${active === v.volume ? 'text-navy' : 'text-ink hover:text-navy'}`}>
                    {v.year}<span className="ml-2 font-sans text-xs font-medium text-ink-muted">Volume {v.volume}</span>
                  </button>
                  <ul className="mt-1.5 flex flex-wrap gap-1.5">
                    {[...v.list].reverse().map((i) => (
                      <li key={i.issue}><AppLink to={i.isCurrent ? paths.currentIssue : paths.issue(i.volume, i.issue)}
                        className="rounded-sm border border-line bg-white px-1.5 py-0.5 text-[11px] font-semibold text-scholar hover:border-navy hover:bg-navy hover:text-white" aria-label={`Volume ${i.volume}, Issue ${i.issue}, ${formatMonthYear(i.month)}`}>{MONTH(i.month).slice(0, 3)}</AppLink></li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <div>
          {/* Mobile year dropdown */}
          <div className="mb-4 lg:hidden">
            <label htmlFor="year-jump" className="mb-1.5 block text-sm font-medium">Jump to year</label>
            <select id="year-jump" className={inputClass()} value={active ?? ''} onChange={(e) => e.target.value && goTo(Number(e.target.value))}>
              <option value="">Select a year…</option>
              {volumes.map((v) => <option key={v.volume} value={v.volume}>{v.year} — Volume {v.volume}</option>)}
            </select>
          </div>

          <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
            <label htmlFor="past-q" className="sr-only">Search the archive by keyword, title, author or DOI</label>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden />
            <input id="past-q" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by keyword, title, author or DOI…" className="h-12 w-full rounded border border-line bg-white pl-10 pr-3 text-sm text-ink outline-none placeholder:text-ink-muted focus:border-scholar focus:ring-2 focus:ring-scholar/25" />
          </form>

          {q ? (
            <section aria-live="polite" className="mt-6">
              <h2 className="font-serif text-xl font-semibold text-navy">{results.length} result{results.length === 1 ? '' : 's'} for “{query}”</h2>
              <div className="mt-4 space-y-4">
                {results.length === 0
                  ? <EmptyState title="No articles match your search" hint="Check the spelling or try an author name or DOI." />
                  : results.map((a) => <IssueArticleCard key={a.paperId} article={a} highlight={query} />)}
              </div>
            </section>
          ) : (
            <div className="mt-6 space-y-4">
              {volumes.map((v) => (
                <section key={v.volume} id={`volume-${v.volume}`} className="scroll-mt-20" aria-label={`Volume ${v.volume}, ${v.year}`}>
                  <AccordionItem open={!!open[v.volume]} onToggle={(o) => setOpen((s) => ({ ...s, [v.volume]: o }))}
                    title={<span className="font-serif text-xl">Volume {v.volume} <span className="font-sans text-sm font-semibold text-ink-muted">· {v.year} · {v.list.length} issues</span></span>}>
                    <div className="grid gap-4 md:grid-cols-2">
                      {v.list.map((i) => <IssueCard key={i.issue} issue={i} href={i.isCurrent ? paths.currentIssue : paths.issue(i.volume, i.issue)} />)}
                    </div>
                  </AccordionItem>
                </section>
              ))}
            </div>
          )}
        </div>
      </div></WithAwardsRail>
    </>
  )
}
