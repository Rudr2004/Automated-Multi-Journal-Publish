// Numbered clauses (1.1, 1.2 ...) with anchor links, the page band, and the sticky table of contents for Journal 4 static pages.
import { useEffect, useState, type ReactNode } from 'react'
import { paths, staticGroups, staticPath } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { StaticPageData, StaticSection } from '../../../../core/types'
import { journal } from '../../../../config/journals'
import { formatDate } from '../../../../core/lib/format'
import { ArrowRight, Calendar, Check, ChevronDown, ErrorIcon, FactCheck, Publish } from '../../icons'
import { Container, cx, Label } from '../primitives'

export interface TocItem { id: string; label: string; num: number }

/** Breadcrumb bar plus the title card (group label, title, intro, meta strip) that opens every static page. */
export function StaticBand({ page, meta }: { page: StaticPageData; meta: ReactNode }) {
  const g = staticGroups[page.group]
  return (
    <header className="border-b border-abyss-200 bg-abyss-50">
      <Container className="pb-6 pt-5 sm:pb-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-steel-600">
            <li><AppLink to={paths.home} className="hover:text-cobalt-700 hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
            <li><AppLink to={g.to} className="hover:text-cobalt-700 hover:underline">{g.label}</AppLink></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-abyss-900">{page.title}</li>
          </ol>
        </nav>
        <div className="relative isolate mt-4 overflow-hidden rounded-pane bg-abyss-900 p-6 text-white shadow-panel sm:p-8">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_85%_20%,black,transparent_75%)]" />
          <Label className="text-azure-300">{g.label}</Label>
          <h1 className="mt-2 max-w-3xl break-words font-serif4 text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight">{page.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-abyss-200 sm:text-[1.0625rem]">{page.intro}</p>
          <div className="mt-5 flex flex-wrap gap-2 border-t border-white/15 pt-4 text-[13px] tabular-nums text-abyss-100">{meta}</div>
        </div>
      </Container>
    </header>
  )
}

/** Tracks which section heading is nearest the top of the viewport. */
function useActiveId(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')
  useEffect(() => {
    setActive(ids[0] ?? '')
    if (typeof IntersectionObserver === 'undefined') return
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (hit) setActive(hit.target.id)
    }, { rootMargin: '-100px 0px -65% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

export function SideColumn({ page, toc, sidebar, related }: { page: StaticPageData; toc: TocItem[]; sidebar: StaticPageData[]; related: StaticPageData[] }) {
  const active = useActiveId(toc.map((t) => t.id))
  const g = staticGroups[page.group]
  const tocList = (
    <ol className="space-y-0.5 border-l border-abyss-200">
      {toc.map((t) => {
        const on = t.id === active
        return (
          <li key={t.id}>
            <a href={`#${t.id}`} aria-current={on ? 'location' : undefined}
              className={cx('-ml-px flex min-h-[44px] items-center gap-2 border-l-2 py-1.5 pl-3 pr-2 text-sm leading-snug lg:min-h-0', on ? 'border-azure-600 font-semibold text-abyss-900' : 'border-transparent text-steel-600 hover:border-abyss-400 hover:text-abyss-900')}>
              <span className="w-5 shrink-0 tabular-nums text-steel-500">{t.num}.</span><span className="min-w-0">{t.label}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )
  const lists = (
    <>
      {sidebar.length > 1 && (
        <nav aria-label={`${g.label} pages`} className="mt-4 rounded-pane border border-abyss-200 bg-white p-4 shadow-hair">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">{g.label}</p>
          <ul className="space-y-0.5">
            {sidebar.map((p) => (
              <li key={p.slug}>
                <AppLink to={staticPath(p.group, p.slug)} aria-current={p.slug === page.slug ? 'page' : undefined}
                  className={cx('block min-h-[44px] rounded-ctl px-3 py-2.5 text-sm leading-snug lg:min-h-0 lg:py-1.5', p.slug === page.slug ? 'bg-abyss-900 font-semibold text-white' : 'text-steel-700 hover:bg-abyss-100')}>{p.title}</AppLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {related.length > 0 && (
        <nav aria-label="Related pages" className="mt-8 xl:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">Related pages</p>
          <ul className="space-y-1">{related.map((r) => <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="block min-h-[44px] py-2.5 text-sm font-medium text-cobalt-700 hover:underline lg:min-h-0 lg:py-1">{r.title} →</AppLink></li>)}</ul>
        </nav>
      )}
    </>
  )
  return (
    <aside aria-label="Page navigation" className="min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
      {toc.length > 1 && (
        <>
          <details className="group rounded-pane border border-abyss-200 bg-white lg:hidden">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-abyss-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-600 [&::-webkit-details-marker]:hidden">
              On this page ({toc.length} sections)<ChevronDown className="h-5 w-5 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <nav aria-label="On this page" className="px-4 pb-3">{tocList}</nav>
          </details>
          <nav aria-label="On this page" className="hidden rounded-pane border border-abyss-200 bg-white p-4 shadow-hair lg:block">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">On this page</p>
            {tocList}
          </nav>
        </>
      )}
      <div className="hidden lg:block">{lists}</div>
      <details className="mt-3 rounded-pane border border-abyss-200 bg-white lg:hidden">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center px-4 text-sm font-semibold text-abyss-900 [&::-webkit-details-marker]:hidden">More in {g.label} and related pages</summary>
        <div className="px-4 pb-4">{lists}</div>
      </details>
    </aside>
  )
}

/** One numbered clause with a hover/focus anchor link. */
function Clause({ id, n, children, tick }: { id: string; n: string; children: ReactNode; tick?: boolean }) {
  return (
    <li id={id} className="group relative grid scroll-mt-28 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-1 py-2 sm:grid-cols-[3.25rem_minmax(0,1fr)]">
      <a href={`#${id}`} aria-label={`Link to clause ${n}`} className="h-fit rounded-ctl py-0.5 text-sm font-semibold tabular-nums text-cobalt-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-600">{n}</a>
      <div className="min-w-0 text-base leading-[1.75] text-steel-700 sm:text-[1.0625rem]">
        {tick && <Check className="mr-1.5 inline h-4 w-4 -translate-y-px text-azure-600" aria-hidden="true" />}{children}
      </div>
    </li>
  )
}

export function SectionClauses({ section, num, id }: { section: StaticSection; num: number; id: string }) {
  let k = 0
  const next = () => { k += 1; return { n: `${num}.${k}`, id: `c-${num}-${k}` } }
  const c = section.callout
  return (
    <section aria-labelledby={id} className="scroll-mt-28 rounded-pane border border-abyss-200 bg-white p-5 shadow-hair sm:p-7">
      <h2 id={id} className="flex scroll-mt-28 items-center gap-3 font-serif4 text-[1.375rem] font-semibold leading-tight tracking-tight text-abyss-900 sm:text-[1.625rem]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-ctl bg-abyss-900 text-sm font-semibold tabular-nums text-white" aria-hidden="true">{num}</span>{section.heading}
      </h2>
      <ol className="mt-3 list-none">
        {section.paragraphs?.map((p) => { const q = next(); return <Clause key={q.id} {...q}>{p}</Clause> })}
        {section.list?.map((x) => { const q = next(); return <Clause key={q.id} {...q} tick>{x}</Clause> })}
      </ol>
      {c && (
        <aside role="note" className={cx('ml-[2.75rem] mt-4 flex gap-3 rounded-pane border p-4 sm:ml-[3.25rem]', c.tone === 'warn' ? 'border-amber-300 bg-amber-50' : 'border-azure-200 bg-azure-50')}>
          {c.tone === 'warn' ? <ErrorIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" /> : <FactCheck className="mt-0.5 h-5 w-5 shrink-0 text-cobalt-700" aria-hidden="true" />}
          <div><p className="font-serif4 text-base font-semibold text-abyss-900">{c.title}</p><p className="mt-0.5 text-[0.9375rem] text-steel-700">{c.text}</p></div>
        </aside>
      )}
    </section>
  )
}

/** Right rail (xl+): call for papers, journal at a glance and related policies. */
export function RightRail({ related, groupLabel }: { related: StaticPageData[]; groupLabel: string }) {
  const facts: [string, string][] = [['ISSN (online)', journal.issnOnline], ['Frequency', journal.frequency], ['Licence', journal.licence.name], ['Publisher', journal.publisher]]
  return (
    <aside aria-label="Journal information" className="hidden min-w-0 space-y-4 xl:sticky xl:top-4 xl:block xl:self-start">
      <section className="rounded-pane border border-abyss-200 bg-white p-4 shadow-hair">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-cobalt-700"><Calendar className="h-4 w-4" aria-hidden="true" />Call for papers</p>
        <h2 className="mt-2 font-serif4 text-lg font-semibold leading-snug text-abyss-900">{journal.nextIssue.label}</h2>
        <p className="mt-1 text-sm tabular-nums text-steel-600">Submission deadline {formatDate(journal.nextIssue.deadline)}</p>
        <AppLink to={paths.submit} className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-ctl bg-cobalt-700 px-3.5 text-sm font-semibold text-white hover:bg-cobalt-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 focus-visible:ring-offset-2"><Publish className="h-4 w-4" aria-hidden="true" />Submit manuscript</AppLink>
      </section>
      <section className="rounded-pane border border-abyss-200 bg-white p-4 shadow-hair">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">Journal at a glance</h2>
        <dl className="mt-3 divide-y divide-abyss-200 text-sm">
          {facts.map(([k, v]) => <div key={k} className="py-2"><dt className="text-xs text-steel-600">{k}</dt><dd className="break-words font-medium tabular-nums text-abyss-900">{v}</dd></div>)}
        </dl>
      </section>
      {related.length > 0 && (
        <nav aria-label="Related policies" className="rounded-pane border border-abyss-200 bg-white p-4 shadow-hair">
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">Related in {groupLabel} and beyond</h2>
          <ul className="mt-2 space-y-1">{related.map((r) => <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="flex items-center justify-between gap-2 py-1.5 text-sm font-medium text-cobalt-700 hover:underline">{r.title}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></AppLink></li>)}</ul>
        </nav>
      )}
    </aside>
  )
}
