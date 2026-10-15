// Numbered clauses (1.1, 1.2 ...) with anchor links, the page band, and the sticky table of contents for Journal 5 (IJFRD) static pages.
import type { ReactNode } from 'react'
import { paths, staticGroups, staticPath } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { StaticPageData, StaticSection } from '../../../../core/types'
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import { formatDate } from '../../../../core/lib/format'
import { ArrowRight, Calendar, Check, Download, ErrorIcon, FactCheck, History, OpenAccess, Publish, Verified } from '../../icons'
import { cx } from '../primitives'
import { TrackQuickFormJ5 } from '../TrackQuickFormJ5'
import { DoubleRule } from '../PageBand'
import { DropCap, Kicker } from '../signature'

export interface TocItem { id: string; label: string; num: number }

/** Light header card (reference: breadcrumb, banner with rule, meta chips, title, intro, quick index chips). */
export function StaticBand({ page, toc }: { page: StaticPageData; toc: TocItem[] }) {
  const g = staticGroups[page.group]
  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 border-b border-[#E6DCD0] pb-2 font-work text-xs text-obsidian-600">
        <AppLink to={paths.home} className="hover:text-wine-800">Home</AppLink><span aria-hidden="true" className="text-obsidian-400">/</span>
        <AppLink to={g.to} className="hover:text-wine-800">{g.label}</AppLink><span aria-hidden="true" className="text-obsidian-400">/</span>
        <span aria-current="page" className="font-medium text-wine-800">{page.title}</span>
      </nav>
      <header className="rounded border border-[#E6DCD0] bg-white p-6 shadow-sm sm:p-8">
        <DoubleRule tone="light" className="mb-3" />
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded border border-wine-800/20 bg-wine-800/10 px-2.5 py-1 font-work text-[11px] font-bold uppercase tracking-wider text-wine-800"><Verified className="h-4 w-4" aria-hidden="true" />{g.label} · {journal.shortName}</span>
          <span className="inline-flex items-center gap-1.5 font-work text-xs text-obsidian-600"><History className="h-4 w-4" aria-hidden="true" />Updated {formatDate(page.updated)}</span>
        </div>
        <h1 className="mb-3 font-newsreader text-2xl font-bold leading-tight tracking-tight text-wine-800 sm:text-3xl lg:text-4xl">{page.title}</h1>
        <p className="mb-6 font-serif4 text-sm leading-relaxed text-obsidian-600 sm:text-base">{page.intro}</p>
        {toc.length > 1 && (
          <nav aria-label="On this page" className="border-t border-[#E6DCD0] pt-4">
            <span className="mb-2.5 block font-work text-[11px] font-bold uppercase tracking-wider text-obsidian-600">Sections &amp; quick index:</span>
            <ul className="flex flex-wrap gap-2 font-work text-xs">
              {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="inline-flex min-h-[32px] items-center rounded border border-[#E6DCD0] bg-[#F4EEE6] px-2.5 py-1 text-obsidian-800 transition hover:bg-[#EBE2D6] hover:text-wine-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine-700">{t.label}</a></li>)}
            </ul>
          </nav>
        )}
      </header>
    </>
  )
}

/** One numbered clause with a hover/focus anchor link. */
function Clause({ id, n, children, tick }: { id: string; n: string; children: ReactNode; tick?: boolean }) {
  return (
    <li id={id} className="group relative grid scroll-mt-28 grid-cols-[2.75rem_minmax(0,1fr)] gap-x-1 border-b border-dotted border-[#E6DCD0] py-3 last:border-b-0 sm:grid-cols-[3.25rem_minmax(0,1fr)]">
      <a href={`#${id}`} aria-label={`Link to clause ${n}`} className="h-fit rounded py-0.5 font-newsreader text-base font-semibold tabular-nums text-ochre-700 hover:text-wine-800 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine-700">{n}</a>
      <div className="min-w-0 font-serif4 text-[0.9375rem] leading-[1.7] text-obsidian-800 sm:text-base">
        {tick && <Check className="mr-1.5 inline h-4 w-4 -translate-y-px text-ochre-600" aria-hidden="true" />}{children}
      </div>
    </li>
  )
}

const DOTS = ['bg-wine-800', 'bg-ochre-700', 'bg-emerald-600']
const DOT_TXT = ['text-wine-800', 'text-ochre-700', 'text-emerald-800']

export function SectionClauses({ section, num, id, label }: { section: StaticSection; num: number; id: string; label: string }) {
  let k = 0
  const next = () => { k += 1; return { n: `${num}.${k}`, id: `c-${num}-${k}` } }
  const c = section.callout
  return (
    <section aria-labelledby={id} className="scroll-mt-28 rounded border border-[#E6DCD0] bg-white p-6 shadow-sm sm:p-8">
      <DoubleRule tone="light" className="mb-3" />
      <p className={cx('mb-2 flex items-center gap-2 font-work text-xs font-bold uppercase tracking-wider', DOT_TXT[num % 3])}><span aria-hidden="true" className={cx('h-2 w-2 rounded-full', DOTS[num % 3])} />{label}</p>
      <h2 id={id} className="scroll-mt-28 font-newsreader text-xl font-semibold leading-tight text-obsidian-900 sm:text-2xl">{num}. {section.heading}</h2>
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

const SIDE = 'rounded border border-[#E6DCD0] bg-white p-5 shadow-sm'
const SIDE_H = 'mb-3 flex items-center justify-between gap-2 border-b border-[#E6DCD0] pb-2'
const SIDE_T = 'font-work text-xs font-bold uppercase tracking-wider text-obsidian-900'
const SIDE_LINK = 'flex min-h-[40px] items-center justify-between gap-2 rounded border border-[#E6DCD0] bg-[#F4EEE6] px-3 py-2 font-work text-xs font-semibold text-obsidian-900 transition hover:border-wine-800/40 hover:text-wine-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-wine-700'

/** Right sidebar (reference "author desk"): call for papers, indexing, notifications, track form, toolkits, DOI details, reviewer invite, open access. */
export function RightRail({ related }: { related: StaticPageData[] }) {
  const logos = visibleLogos()
  const cfp: [string, string][] = [['Submission deadline', formatDate(journal.nextIssue.deadline.slice(0, 10))], ['Publication', `${journal.frequency} (online)`], ['Expected publication', '2 Days'], ['Crossref DOI prefix', journal.doiPrefix]]
  return (
    <aside aria-label="Author desk" className="min-w-0 space-y-6">
      <section className="rounded border-2 border-wine-800 bg-white p-5 shadow-sm">
        <DoubleRule tone="light" className="mb-2.5" />
        <p className="mb-2 flex items-center gap-2 font-work text-xs font-bold uppercase tracking-wider text-wine-800"><Calendar className="h-4 w-4" aria-hidden="true" />Call for papers</p>
        <h2 className="mb-2 font-newsreader text-base font-semibold text-obsidian-900">{journal.nextIssue.label}</h2>
        <p className="mb-4 font-work text-xs leading-relaxed text-obsidian-600">Submit manuscripts for the next monthly issue. Every submission goes through structured peer review.</p>
        <dl className="mb-4 space-y-1.5 rounded border border-[#E6DCD0] bg-[#F4EEE6] p-3 font-work text-xs">
          {cfp.map(([k, v], i) => <div key={k} className={cx('flex items-center justify-between gap-3', i > 0 && 'border-t border-[#E6DCD0] pt-1.5')}><dt className="text-obsidian-600">{k}:</dt><dd className="text-right font-semibold tabular-nums text-obsidian-900">{v}</dd></div>)}
        </dl>
        <AppLink to={paths.submit} className="inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded bg-wine-800 px-4 py-2.5 font-work text-xs font-semibold uppercase tracking-wider text-white hover:bg-bordeaux-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 focus-visible:ring-offset-2"><Publish className="h-4 w-4" aria-hidden="true" />Submit via portal</AppLink>
      </section>

      <section className={SIDE}>
        <div className={SIDE_H}><h2 className={SIDE_T}>Indexing &amp; archiving</h2><span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-100 px-2 py-0.5 font-work text-[10px] font-bold uppercase tracking-wider text-emerald-800"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />{logos.length} listed</span></div>
        <p className="mb-3 font-work text-xs leading-relaxed text-obsidian-600">Only listings the journal can confirm are shown.</p>
        {/* Scrolls upwards; hover or keyboard focus pauses it, and reduced-motion visitors can scroll by hand. */}
        <div className="j1-pausable h-60 overflow-hidden rounded bg-[#F4EEE6] p-2 motion-reduce:overflow-y-auto">
          <div className="j1-scroll-up" style={{ ['--j1-scroll-duration' as string]: `${Math.max(24, logos.length * 5)}s` }}>
            {[0, 1].map((copy) => (
              <ul key={copy} aria-hidden={copy > 0 || undefined} className="flex flex-col gap-2 pb-2">
                {logos.map((l) => <li key={l.id} className="flex h-12 items-center justify-center rounded border border-[#E6DCD0] bg-white p-2">{l.file ? <img src={logoSrc(l.file)} alt={copy > 0 ? '' : l.name} loading="lazy" className="max-h-6 w-auto object-contain" /> : <span className="font-newsreader text-sm font-bold text-obsidian-800">{l.name}</span>}</li>)}
              </ul>
            ))}
          </div>
        </div>
      </section>

      <section className={SIDE}>
        <div className={SIDE_H}><h2 className={SIDE_T}>Notifications &amp; alerts</h2><span className="rounded border border-amber-300 bg-amber-100 px-2 py-0.5 font-work text-[10px] font-bold uppercase tracking-wider text-amber-900">Updates</span></div>
        <ul className="space-y-2">
          {journal.announcements.map((a) => <li key={a.id}><AppLink to={a.to} className="block rounded border border-[#E6DCD0] bg-[#F4EEE6] p-3 font-work text-xs font-semibold leading-snug text-obsidian-900 hover:text-wine-800">{a.text}</AppLink></li>)}
        </ul>
      </section>

      <section className={SIDE}>
        <div className={SIDE_H}><h2 className={SIDE_T}>Track paper status</h2></div>
        <TrackQuickFormJ5 />
      </section>

      <section className={SIDE}>
        <div className={SIDE_H}><h2 className={SIDE_T}>Author toolkits &amp; downloads</h2></div>
        <ul className="space-y-2">
          <li><AppLink to={paths.policy('author-guidelines')} className={SIDE_LINK}>Author guidelines<Download className="h-4 w-4 shrink-0" aria-hidden="true" /></AppLink></li>
          <li><AppLink to={paths.policy('copyright-licensing')} className={SIDE_LINK}>Copyright and licensing<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></AppLink></li>
          {related.filter((r) => r.slug !== 'author-guidelines' && r.slug !== 'copyright-licensing').map((r) => <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className={SIDE_LINK}>{r.title}<ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" /></AppLink></li>)}
        </ul>
      </section>

      <section className={SIDE}>
        <div className={SIDE_H}><h2 className={SIDE_T}>Crossref DOI details</h2></div>
        <dl className="space-y-1.5 font-work text-xs">
          {[['DOI prefix', journal.doiPrefix], ['ISSN (online)', journal.issnOnline], ['Publisher', journal.publisher]].map(([k, v]) => <div key={k} className="flex justify-between gap-3"><dt className="shrink-0 text-obsidian-600">{k}</dt><dd className="text-right font-semibold text-obsidian-900">{v}</dd></div>)}
        </dl>
      </section>

      <section className={SIDE}>
        <Kicker>Editorial board</Kicker>
        <h2 className="mt-1 font-newsreader text-base font-semibold text-obsidian-900">Join as a reviewer</h2>
        <p className="mt-1 font-work text-xs leading-relaxed text-obsidian-600">Specialists in our research areas are invited to apply.</p>
        <AppLink to={paths.forAuthors('become-a-reviewer')} className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 font-work text-xs font-semibold text-wine-700 underline-offset-4 hover:underline">Apply to review<ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
      </section>

      <section className="rounded border border-emerald-300 bg-emerald-50 p-5 shadow-sm">
        <p className="mb-1 flex items-center gap-2 font-work text-xs font-bold uppercase tracking-wider text-emerald-800"><OpenAccess className="h-4 w-4" aria-hidden="true" />Open access · {journal.licence.name}</p>
        <p className="font-work text-xs leading-relaxed text-obsidian-700">Every article is free to read, share and reuse under {journal.licence.name}. Authors keep their copyright.</p>
      </section>
    </aside>
  )
}
