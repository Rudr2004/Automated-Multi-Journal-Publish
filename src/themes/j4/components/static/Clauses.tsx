// Numbered clauses (1.1, 1.2 ...) with anchor links, the page band, and the sticky table of contents for Journal 4 static pages.
import { useEffect, useState, type ReactNode } from 'react'
import { paths, staticGroups, staticPath } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { StaticPageData, StaticSection } from '../../../../core/types'
import { Check, ChevronDown, ErrorIcon, FactCheck } from '../../icons'
import { Container, cx, Label } from '../primitives'

export interface TocItem { id: string; label: string; num: number }

/** Dark blueprint-grid page header with breadcrumbs. */
export function StaticBand({ page, meta }: { page: StaticPageData; meta: ReactNode }) {
  const g = staticGroups[page.group]
  return (
    <header className="relative isolate bg-abyss-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_75%)]" />
      </div>
      <Container className="pb-10 pt-8 sm:pb-12 sm:pt-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-abyss-300">
            <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
            <li><AppLink to={g.to} className="hover:text-white hover:underline">{g.label}</AppLink></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-white">{page.title}</li>
          </ol>
        </nav>
        <Label className="mt-7 text-azure-300">{g.label}</Label>
        <h1 className="mt-2 max-w-3xl break-words font-serif4 text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight">{page.title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-abyss-200 sm:text-[1.0625rem]">{page.intro}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-[13px] tabular-nums text-abyss-100">{meta}</div>
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
        <nav aria-label={`${g.label} pages`} className="mt-8">
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
        <nav aria-label="Related pages" className="mt-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">Related pages</p>
          <ul className="space-y-1">{related.map((r) => <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="block min-h-[44px] py-2.5 text-sm font-medium text-cobalt-700 hover:underline lg:min-h-0 lg:py-1">{r.title} →</AppLink></li>)}</ul>
        </nav>
      )}
    </>
  )
  return (
    <aside aria-label="Page navigation" className="min-w-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
      {toc.length > 1 && (
        <>
          <details className="group rounded-pane border border-abyss-200 bg-white lg:hidden">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-abyss-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-600 [&::-webkit-details-marker]:hidden">
              On this page ({toc.length} sections)<ChevronDown className="h-5 w-5 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <nav aria-label="On this page" className="px-4 pb-3">{tocList}</nav>
          </details>
          <nav aria-label="On this page" className="hidden lg:block">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">On this page</p>
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
    <section aria-labelledby={id} className="border-t border-abyss-200 py-8 first:border-t-0 first:pt-0">
      <h2 id={id} className="scroll-mt-28 font-serif4 text-[1.5rem] font-semibold leading-tight tracking-tight text-abyss-900 sm:text-[1.75rem]">
        <span className="mr-3 tabular-nums text-steel-500" aria-hidden="true">{num}.</span>{section.heading}
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
