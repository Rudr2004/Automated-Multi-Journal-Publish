// Numbered clauses (1.1, 1.2 ...) with anchor links, the page band, and the sticky table of contents for Journal 5 (IJFRD) static pages.
import { useEffect, useState, type ReactNode } from 'react'
import { paths, staticGroups, staticPath } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { StaticPageData, StaticSection } from '../../../../core/types'
import { journal } from '../../../../config/journals'
import { formatDate } from '../../../../core/lib/format'
import { ArrowRight, Calendar, Check, ChevronDown, ErrorIcon, FactCheck, Publish } from '../../icons'
import { cx } from '../primitives'
import { ClassicHeader } from '../ClassicHeader'
import { DropCap, Kicker, OrnamentRule } from '../signature'

export interface TocItem { id: string; label: string; num: number }

/** Classical header (breadcrumb, kicker, title, ornament rule, intro, meta strip) that opens every static page. */
export function StaticBand({ page, meta }: { page: StaticPageData; meta: ReactNode }) {
  const g = staticGroups[page.group]
  return (
    <ClassicHeader crumbs={[{ label: g.label, to: g.to }, { label: page.title }]} kicker={g.label} title={page.title} intro={page.intro}>
      <div className="mt-6 flex flex-wrap gap-2 border-t border-ochre-300/30 pt-4 text-[13px] tabular-nums text-bordeaux-100">{meta}</div>
    </ClassicHeader>
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
    <ol className="space-y-0.5 border-l border-[#E6DCD0]">
      {toc.map((t) => {
        const on = t.id === active
        return (
          <li key={t.id}>
            <a href={`#${t.id}`} aria-current={on ? 'location' : undefined}
              className={cx('-ml-px flex min-h-[44px] items-center gap-2 border-l-2 py-1.5 pl-3 pr-2 text-sm leading-snug lg:min-h-0', on ? 'border-wine-800 font-semibold text-wine-900' : 'border-transparent text-obsidian-600 hover:border-obsidian-400 hover:text-obsidian-900')}>
              <span className="w-5 shrink-0 tabular-nums text-obsidian-500">{t.num}.</span><span className="min-w-0">{t.label}</span>
            </a>
          </li>
        )
      })}
    </ol>
  )
  const lists = (
    <>
      {sidebar.length > 1 && (
        <nav aria-label={`${g.label} pages`} className="mt-4 rounded border border-[#E6DCD0] bg-white p-4 ">
          <Kicker className="mb-2">{g.label}</Kicker>
          <ul className="space-y-0.5">
            {sidebar.map((p) => (
              <li key={p.slug}>
                <AppLink to={staticPath(p.group, p.slug)} aria-current={p.slug === page.slug ? 'page' : undefined}
                  className={cx('block min-h-[44px] rounded px-3 py-2.5 text-sm leading-snug lg:min-h-0 lg:py-1.5', p.slug === page.slug ? 'bg-wine-800 font-semibold text-white' : 'text-obsidian-700 hover:bg-obsidian-100')}>{p.title}</AppLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {related.length > 0 && (
        <nav aria-label="Related pages" className="mt-8 xl:hidden">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600">Related pages</p>
          <ul className="space-y-1">{related.map((r) => <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="block min-h-[44px] py-2.5 text-sm font-medium text-wine-700 hover:underline lg:min-h-0 lg:py-1">{r.title} →</AppLink></li>)}</ul>
        </nav>
      )}
    </>
  )
  return (
    <aside aria-label="Page navigation" className="min-w-0 lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:self-start lg:overflow-y-auto lg:pr-2">
      {toc.length > 1 && (
        <>
          <details className="group rounded border border-[#E6DCD0] bg-white lg:hidden">
            <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-obsidian-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine-700 [&::-webkit-details-marker]:hidden">
              On this page ({toc.length} sections)<ChevronDown className="h-5 w-5 group-open:rotate-180" aria-hidden="true" />
            </summary>
            <nav aria-label="On this page" className="px-4 pb-3">{tocList}</nav>
          </details>
          <nav aria-label="On this page" className="hidden rounded border border-[#E6DCD0] bg-white p-4  lg:block">
            <Kicker className="mb-3">On this page</Kicker>
            {tocList}
          </nav>
        </>
      )}
      <div className="hidden lg:block">{lists}</div>
      <details className="mt-3 rounded border border-[#E6DCD0] bg-white lg:hidden">
        <summary className="flex min-h-[44px] cursor-pointer list-none items-center px-4 text-sm font-semibold text-obsidian-900 [&::-webkit-details-marker]:hidden">More in {g.label} and related pages</summary>
        <div className="px-4 pb-4">{lists}</div>
      </details>
    </aside>
  )
}

/** One numbered clause with a hover/focus anchor link. */
function Clause({ id, n, children, tick }: { id: string; n: string; children: ReactNode; tick?: boolean }) {
  return (
    <li id={id} className="group relative grid scroll-mt-28 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-1 border-b border-dotted border-[#E6DCD0] py-3 last:border-b-0 sm:grid-cols-[3.25rem_minmax(0,1fr)]">
      <a href={`#${id}`} aria-label={`Link to clause ${n}`} className="h-fit rounded py-0.5 font-newsreader text-base font-semibold tabular-nums text-ochre-700 hover:text-wine-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine-700">{n}</a>
      <div className="min-w-0 font-serif4 text-base leading-[1.75] text-obsidian-800 sm:text-[1.0625rem]">
        {tick && <Check className="mr-1.5 inline h-4 w-4 -translate-y-px text-ochre-600" aria-hidden="true" />}{children}
      </div>
    </li>
  )
}

export function SectionClauses({ section, num, id }: { section: StaticSection; num: number; id: string }) {
  let k = 0
  const next = () => { k += 1; return { n: `${num}.${k}`, id: `c-${num}-${k}` } }
  const c = section.callout
  return (
    <section aria-labelledby={id} className="scroll-mt-28 rounded border border-[#E6DCD0] bg-white p-5 sm:p-7">
      <h2 id={id} className="flex scroll-mt-28 items-center gap-3 font-newsreader text-[1.375rem] font-semibold leading-tight tracking-tight text-obsidian-900 sm:text-[1.625rem]">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-wine-800 text-sm font-semibold tabular-nums text-white" aria-hidden="true">{num}</span>{section.heading}
      </h2>
      <OrnamentRule className="mt-3" />
      <ol className="mt-3 list-none">
        {section.paragraphs?.map((p, i) => { const q = next(); return <Clause key={q.id} {...q}>{i === 0 && p.length > 90 ? <DropCap text={p} /> : p}</Clause> })}
        {section.list?.map((x) => { const q = next(); return <Clause key={q.id} {...q} tick>{x}</Clause> })}
      </ol>
      {c && (
        <aside role="note" className={cx('ml-[2.75rem] mt-4 flex gap-3 rounded border p-4 sm:ml-[3.25rem]', c.tone === 'warn' ? 'border-amber-300 bg-amber-50' : 'border-ochre-200 border-l-4 border-l-ochre-600 bg-[#FBF8F4]')}>
          {c.tone === 'warn' ? <ErrorIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" /> : <FactCheck className="mt-0.5 h-5 w-5 shrink-0 text-wine-700" aria-hidden="true" />}
          <div><p className="font-newsreader text-base font-semibold text-obsidian-900">{c.title}</p><p className="mt-0.5 font-serif4 text-[0.9375rem] leading-relaxed text-obsidian-800">{c.text}</p></div>
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
      <section className="rounded border border-[#E6DCD0] bg-white p-4 ">
        <Kicker><Calendar className="h-4 w-4" aria-hidden="true" />Call for papers</Kicker>
        <h2 className="mt-2 font-newsreader text-lg font-semibold leading-snug text-obsidian-900">{journal.nextIssue.label}</h2>
        <p className="mt-1 text-sm tabular-nums text-obsidian-600">Submission deadline {formatDate(journal.nextIssue.deadline.slice(0, 10))}</p>
        <AppLink to={paths.submit} className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded bg-wine-800 px-3.5 text-sm font-semibold text-white hover:bg-wine-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2"><Publish className="h-4 w-4" aria-hidden="true" />Submit manuscript</AppLink>
      </section>
      <section className="rounded border border-[#E6DCD0] bg-white p-4 ">
        <h2><Kicker>Journal at a glance</Kicker></h2>
        <dl className="mt-3 divide-y divide-[#E6DCD0] text-sm">
          {facts.map(([k, v]) => <div key={k} className="py-2"><dt className="text-xs text-obsidian-600">{k}</dt><dd className="break-words font-medium tabular-nums text-obsidian-900">{v}</dd></div>)}
        </dl>
      </section>
      {related.length > 0 && (
        <nav aria-label="Related policies" className="rounded border border-[#E6DCD0] bg-white p-4 ">
          <h2><Kicker>Related in {groupLabel} and beyond</Kicker></h2>
          <ul className="mt-2 space-y-1">{related.map((r) => <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="flex items-center justify-between gap-2 py-1.5 text-sm font-medium text-wine-700 hover:underline">{r.title}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></AppLink></li>)}</ul>
        </nav>
      )}
    </aside>
  )
}
