// Journal 4 static-page building blocks in the reference's language: breadcrumb and white title card, sticky quick-jump bar, numbered section cards
// (sky "01" tile, serif heading, subtitle), check-mark lists, callouts. The right sidebar lives in ./Rail.
import { useEffect, useState, type ReactNode } from 'react'
import { MdOutlinePrint as Print, MdOutlineInfo as Info } from 'react-icons/md'
import { paths, staticGroups } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { StaticPageData, StaticSection } from '../../../../core/types'
import { journal } from '../../../../config/journals'
import { Check, Email } from '../../icons'
import { cx } from '../primitives'

export { RightRail } from './Rail'

export interface TocItem { id: string; label: string; num: number }

/** Card shell shared by every numbered section. */
export const SECTION = 'scroll-mt-28 rounded-pane border border-slate-200 bg-white p-6 shadow-hair sm:p-7'

/** Breadcrumb plus the white title card (meta chips, title, intro, print and contact actions) that opens every static page. */
export function StaticBand({ page, meta }: { page: StaticPageData; meta: ReactNode }) {
  const g = staticGroups[page.group]
  const btn = 'inline-flex min-h-[44px] items-center gap-1.5 rounded border px-3.5 py-2 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure-600 sm:min-h-0'
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-medium text-slate-500">
          <li><AppLink to={paths.home} className="transition-colors hover:text-cobalt-700">Home</AppLink></li><li aria-hidden="true">/</li>
          <li><AppLink to={g.to} className="transition-colors hover:text-cobalt-700">{g.label}</AppLink></li><li aria-hidden="true">/</li>
          <li aria-current="page" className="font-semibold text-slate-800">{page.title}</li>
        </ol>
      </nav>
      <header className="relative isolate mt-6 overflow-hidden rounded-pane border border-slate-200 bg-white p-6 shadow-hair sm:p-8">
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-bl-full bg-sky-50 opacity-60" />
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">{meta}</div>
        <h1 className="mb-3 break-words font-serif4 text-2xl font-bold leading-tight tracking-tight text-[#0b2545] sm:text-3xl lg:text-4xl">{page.title}</h1>
        <p className="mb-6 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">{page.intro}</p>
        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-xs print:hidden">
          <button type="button" onClick={() => window.print()} className={cx(btn, 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200')}>
            <Print className="h-4 w-4 text-slate-500" aria-hidden="true" />Print Policy
          </button>
          <a href={`mailto:${journal.email}`} className={cx(btn, 'border-sky-200 bg-sky-50 text-cobalt-700 hover:bg-sky-100')}>
            <Email className="h-4 w-4" aria-hidden="true" />Ask the editorial office
          </a>
          <span className="ml-auto text-xs text-slate-500">ISSN {journal.issnOnline} (online)</span>
        </div>
      </header>
    </>
  )
}

/** Numbered section header: sky tile with "01", a serif title and an optional one-line subtitle or badge. */
export function SectionHead({ num, id, title, subtitle, badge }: { num: number; id: string; title: string; subtitle?: string; badge?: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 border-b border-slate-100 pb-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-sky-200 bg-sky-50 font-bold tabular-nums text-cobalt-700" aria-hidden="true">{String(num).padStart(2, '0')}</span>
      <div className="min-w-0 flex-1">
        <h2 id={id} className="scroll-mt-28 font-serif4 text-xl font-bold leading-snug text-[#0b2545]">{num}. {title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {badge && <span className="hidden shrink-0 rounded border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-900 sm:inline">{badge}</span>}
    </div>
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
    }, { rootMargin: '-140px 0px -65% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

/** Sticky quick-jump bar: a horizontally scrolling row of numbered section links with the current one highlighted. */
export function QuickNav({ toc }: { toc: TocItem[] }) {
  const active = useActiveId(toc.map((t) => t.id))
  if (toc.length < 2) return null
  return (
    <nav aria-label="Quick section navigation" className="sticky top-14 z-20 rounded-pane border border-slate-200 bg-white p-2.5 shadow-hair print:hidden">
      <p className="mb-1 px-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">Quick Navigation</p>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs">
        {toc.map((t) => {
          const on = t.id === active
          return (
            <li key={t.id} className="shrink-0">
              <a href={`#${t.id}`} aria-current={on ? 'location' : undefined}
                className={cx('inline-flex min-h-[36px] items-center whitespace-nowrap rounded px-2.5 py-1.5 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-azure-600 sm:min-h-0', on ? 'bg-[#0b2545] text-white' : 'text-slate-700 hover:bg-[#0b2545] hover:text-white')}>
                {t.num}. {t.label}
              </a>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

/** Green-tick list item: an optional bold lead-in ("Label: text") followed by the text. */
export function TickItem({ children, lead }: { children: ReactNode; lead?: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
      <span>{lead && <strong className="font-semibold text-slate-900">{lead} </strong>}{children}</span>
    </li>
  )
}

/** Callout in the reference's two styles: navy left-border note (info) and amber note with an info icon (warn). */
export function Callout({ tone, title, children }: { tone: string; title: string; children: ReactNode }) {
  if (tone === 'warn') {
    return (
      <div role="note" className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" aria-hidden="true" />
        <span><strong className="font-semibold">{title}:</strong> {children}</span>
      </div>
    )
  }
  return (
    <div role="note" className="rounded border-l-4 border-[#0b2545] bg-slate-50 p-3.5 text-xs text-slate-700">
      <strong className="font-semibold text-slate-900">{title}:</strong> {children}
    </div>
  )
}

/** A generic policy section: paragraphs, a green-tick list and an optional callout, in the reference's section card. */
export function SectionClauses({ section, num, id }: { section: StaticSection; num: number; id: string }) {
  const c = section.callout
  return (
    <section aria-labelledby={id} className={SECTION}>
      <SectionHead num={num} id={id} title={section.heading} badge={section.badge} />
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
        {section.list && <ul className="space-y-3 pl-2">{section.list.map((x) => <TickItem key={x}>{x}</TickItem>)}</ul>}
        {c && <Callout tone={c.tone} title={c.title}>{c.text}</Callout>}
      </div>
    </section>
  )
}
