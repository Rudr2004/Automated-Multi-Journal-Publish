// Journal 3 long-form template for policies, for-authors and about pages: collapsible sections, a floating "Jump to section" menu,
// links to the other pages of the group and related pages.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { BlockActions } from '../../../core/theme'
import type { StaticPageData } from '../../../core/types'
import { Artwork } from '../components/Artwork'
import { anchorId, BlockBody, blockTitle } from '../components/StaticBlocksJ3'
import { Container, cx, Kicker } from '../components/primitives'
import * as I from '../icons'

const principles = [
  { icon: I.Verified, title: 'Integrity', text: 'Honest, carefully documented research and reporting.' },
  { icon: I.FactCheck, title: 'Transparency', text: 'Open processes and decisions that come with reasons.' },
  { icon: I.Award, title: 'Fairness', text: 'Impartial evaluation of the work on its merits.' },
  { icon: I.Person, title: 'Respect', text: 'Consent, credit and care for people and communities.' },
  { icon: I.Book, title: 'Alignment', text: 'Guided by COPE-aligned good-practice principles.' },
]

const PRINCIPLES_ID = 'sec-our-ethical-principles'
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

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
    }, { rootMargin: '-110px 0px -60% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

/** A numbered section whose heading holds the collapse toggle. */
function Collapsible({ id, title, num, open, onToggle, children }: { id: string; title: string; num?: number; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className="border-t border-mauve-100 py-7 first:border-t-0 sm:py-9">
      {num !== undefined && <p aria-hidden="true" className="mb-1 font-jakarta text-xs font-extrabold tracking-[0.08em] text-iris-700">{String(num).padStart(2, '0')}</p>}
      <h2 id={id} className="scroll-mt-24 font-jakarta text-[1.375rem] font-extrabold leading-[1.2] tracking-tight text-night-900 sm:text-[1.625rem] xl:scroll-mt-32">
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-body`} onClick={onToggle}
          className="group flex w-full items-start justify-between gap-4 rounded-tile text-left">
          <span className="min-w-0 break-words">{title}</span>
          <span aria-hidden="true" className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-iris-50 text-iris-800 ring-1 ring-inset ring-iris-100 transition-colors group-hover:bg-iris-100">
            <I.ChevronDown className={cx('h-5 w-5 motion-safe:transition-transform', open && 'rotate-180')} />
          </span>
        </button>
      </h2>
      <div id={`${id}-body`} role="region" aria-labelledby={id} hidden={!open} className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

/** "On this page": a sticky outline on wide screens that follows the reader. */
function PageOutline({ items, active, onPick }: { items: { id: string; label: string }[]; active: string; onPick: (id: string) => void }) {
  return (
    <nav aria-label="On this page" className="sticky top-32 hidden xl:block">
      <p className="mb-3 font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-mauve-700">On this page</p>
      <ol className="space-y-0.5 border-l border-mauve-200">
        {items.map((t) => {
          const on = t.id === active
          return (
            <li key={t.id}>
              <button type="button" aria-current={on ? 'location' : undefined} onClick={() => onPick(t.id)}
                className={cx('-ml-px block w-full border-l-2 py-1.5 pl-4 pr-2 text-left text-sm leading-snug transition-colors', on ? 'border-iris-700 font-semibold text-iris-700' : 'border-transparent text-mauve-700 hover:border-iris-300 hover:text-night-900')}>
                {t.label}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

function JumpToSection({ items, active, onPick }: { items: { id: string; label: string }[]; active: string; onPick: (id: string) => void }) {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btn.current?.focus() } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('touchstart', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    // Clear of the mobile bottom bar (about 68px tall) below sm.
    <div ref={box} className="fixed bottom-24 right-4 z-30 sm:bottom-6 sm:right-6 xl:hidden">
      {open && (
        <nav id="j3-jump-list" aria-label="Jump to section" className="absolute bottom-full right-0 mb-3 max-h-[60vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-block bg-white p-2 shadow-dock motion-safe:animate-fade-in">
          <ul>
            {items.map((t) => {
              const on = t.id === active
              return (
                <li key={t.id}>
                  <button type="button" aria-current={on ? 'location' : undefined} onClick={() => { setOpen(false); onPick(t.id) }}
                    className={cx('flex w-full items-center gap-2 rounded-tile px-3 py-2.5 text-left font-jakarta text-sm font-bold leading-snug transition-colors',
                      on ? 'bg-iris-700 text-white' : 'text-night-900 hover:bg-iris-100')}>
                    {on && <I.Check className="h-4 w-4 shrink-0" aria-hidden="true" />}<span className="min-w-0">{t.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
      <button ref={btn} type="button" aria-expanded={open} aria-controls="j3-jump-list" onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-full bg-night-900 px-5 py-3 font-jakarta text-sm font-bold tracking-wide text-white shadow-dock transition-colors hover:bg-night-700">
        <I.Menu className="h-5 w-5" aria-hidden="true" />Jump to section
      </button>
    </div>
  )
}

export function StaticPage({ page, sidebar, allPages, actions }: { page: StaticPageData; sidebar: StaticPageData[]; allPages: StaticPageData[]; actions: BlockActions }) {
  const g = staticGroups[page.group]
  const related = page.related.map((s) => allPages.find((p) => p.slug === s)).filter(Boolean) as StaticPageData[]
  const [closed, setClosed] = useState<Set<string>>(new Set()) // every section starts open
  const chips = useRef<HTMLUListElement>(null)

  const toc = useMemo(() => [
    ...(page.principles ? [{ id: PRINCIPLES_ID, label: 'Our ethical principles' }] : []),
    ...page.sections.map((s) => ({ id: anchorId(s.heading), label: s.heading })),
    ...(page.blocks ?? []).map((b) => { const t = blockTitle(b); return { id: anchorId(t), label: t } }),
  ], [page])
  const active = useActiveId(toc.map((t) => t.id))

  useEffect(() => { setClosed(new Set()) }, [page.slug])

  // Keep the current page chip visible in its own scroll strip (inline only, so the page never jumps).
  useEffect(() => {
    const el = chips.current?.querySelector<HTMLElement>('[aria-current="page"]')
    const box = chips.current?.parentElement
    if (el && box) box.scrollLeft = Math.max(0, el.offsetLeft - 16)
  }, [page.slug])

  const toggle = useCallback((id: string) => setClosed((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n }), [])
  const allOpen = closed.size === 0
  const setAll = () => setClosed(allOpen ? new Set(toc.map((t) => t.id)) : new Set())

  const jump = useCallback((id: string) => {
    setClosed((s) => { if (!s.has(id)) return s; const n = new Set(s); n.delete(id); return n })
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
      document.getElementById(`${id}-btn`)?.focus({ preventScroll: true })
    })
  }, [])

  const para = 'text-base leading-[1.75] text-mauve-800 sm:text-[1.0625rem]'

  return (
    <>
      <header className="relative isolate overflow-hidden bg-night-900 text-white">
        <Artwork seed={`${page.group}-${page.slug}`} palette={1} className="pointer-events-none absolute -right-16 -top-16 -z-10 hidden h-72 w-72 rotate-12 rounded-sheet opacity-30 sm:block lg:h-96 lg:w-96" />
        <Container className="pb-10 pt-8 sm:pb-14 sm:pt-10">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-night-200">
              <li><AppLink to={paths.home} className="rounded-full hover:text-white hover:underline">Home</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li><AppLink to={g.to} className="rounded-full hover:text-white hover:underline">{g.label}</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li aria-current="page" className="font-semibold text-white">{page.title}</li>
            </ol>
          </nav>
          <Kicker className="mt-7 text-ember-400">{g.label}</Kicker>
          <h1 className="mt-3 max-w-3xl break-words font-jakarta text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-tight">{page.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-night-100 sm:text-[1.0625rem]">{page.intro}</p>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-night-50"><I.History className="h-4 w-4 text-ember-400" aria-hidden="true" />Updated {formatDate(page.updated)}</li>
            {toc.length > 1 && <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-night-50"><I.Book className="h-4 w-4 text-ember-400" aria-hidden="true" />{toc.length} sections</li>}
            <li className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-night-50"><I.OpenAccess className="h-4 w-4 text-ember-400" aria-hidden="true" />{journal.licence.name}</li>
          </ul>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[14rem_minmax(0,1fr)_13.5rem]">
          <aside aria-label={`${g.label} pages`} className="min-w-0">
            <nav aria-label={`${g.label} pages`} className="lg:sticky lg:top-32">
              <p className="mb-3 hidden font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-mauve-700 lg:block">{g.label}</p>
              {/* Phones and tablets: a scrollable strip of pills inside its own box. Large screens: a vertical list. */}
              <div className="-mx-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
                <ul ref={chips} className="flex w-max gap-2 lg:w-auto lg:flex-col lg:gap-1">
                  {sidebar.map((p) => {
                    const on = p.slug === page.slug
                    return (
                      <li key={p.slug} className="shrink-0">
                        <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                          className={cx('block whitespace-nowrap rounded-full px-4 py-2 font-jakarta text-sm font-bold transition-colors lg:whitespace-normal lg:rounded-tile',
                            on ? 'bg-iris-700 text-white lg:bg-iris-50 lg:text-iris-700 lg:shadow-[inset_3px_0_0_0_#4B2E9B]' : 'bg-iris-50 text-night-900 hover:bg-iris-100 lg:bg-transparent lg:text-mauve-800 lg:hover:bg-iris-50')}>{p.title}</AppLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>
          </aside>

          <article className="min-w-0 max-w-[52rem]">
            {toc.length > 1 && (
              <div className="mb-2 flex justify-end">
                <button type="button" onClick={setAll} className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-jakarta text-sm font-bold text-iris-700 hover:bg-iris-100">
                  <I.ChevronDown className={cx('h-5 w-5', allOpen && 'rotate-180')} aria-hidden="true" />{allOpen ? 'Collapse all sections' : 'Expand all sections'}
                </button>
              </div>
            )}

            {page.principles && (
              <Collapsible id={PRINCIPLES_ID} title="Our ethical principles" open={!closed.has(PRINCIPLES_ID)} onToggle={() => toggle(PRINCIPLES_ID)}>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {principles.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-4 rounded-block bg-iris-50 p-5">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-iris-700 text-white"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                      <div className="min-w-0"><h3 className="font-jakarta text-lg font-extrabold leading-tight tracking-tight text-night-900">{title}</h3><p className="mt-1 text-[0.9375rem] text-mauve-700">{text}</p></div>
                    </li>
                  ))}
                </ul>
              </Collapsible>
            )}

            {page.sections.map((s, n) => {
              const id = anchorId(s.heading)
              return (
                <Collapsible key={id} id={id} title={s.heading} num={n + 1} open={!closed.has(id)} onToggle={() => toggle(id)}>
                  {s.paragraphs?.map((p, i) => <p key={i} className={para}>{p}</p>)}
                  {s.list && <ul className="space-y-2.5 rounded-block bg-iris-50 p-5 sm:p-6">{s.list.map((x) => <li key={x} className={cx('flex gap-3', para)}><span aria-hidden="true" className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-iris-700 text-white"><I.Check className="h-3.5 w-3.5" /></span><span className="min-w-0">{x}</span></li>)}</ul>}
                  {s.callout && (
                    <aside role="note" className={cx('flex gap-4 rounded-block p-5', s.callout.tone === 'warn' ? 'border-l-4 border-ember-700 bg-ember-50' : 'bg-iris-100')}>
                      {s.callout.tone === 'warn'
                        ? <I.ErrorIcon className="mt-0.5 h-6 w-6 shrink-0 text-ember-700" aria-hidden="true" />
                        : <I.Bolt className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" />}
                      <div><p className="font-jakarta text-base font-extrabold text-night-900">{s.callout.title}</p><p className="mt-1 text-[0.9375rem] text-mauve-800">{s.callout.text}</p></div>
                    </aside>
                  )}
                </Collapsible>
              )
            })}

            {page.blocks?.map((b, i) => {
              const t = blockTitle(b)
              const id = anchorId(t)
              return (
                <Collapsible key={`${id}-${i}`} id={id} title={t} num={page.sections.length + i + 1} open={!closed.has(id)} onToggle={() => toggle(id)}>
                  <BlockBody block={b} actions={actions} />
                </Collapsible>
              )
            })}

            <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-mauve-100 pt-6 text-sm text-mauve-700">
              <I.History className="h-4 w-4" aria-hidden="true" />Last updated {formatDate(page.updated)}. Questions about this page: <a className="font-semibold text-iris-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>
            </p>

            {related.length > 0 && (
              <section className="mt-12" aria-labelledby="j3-related-h">
                <h2 id="j3-related-h" className="font-jakarta text-[1.375rem] font-extrabold leading-[1.2] tracking-tight text-night-900 sm:text-[1.625rem]">Related pages</h2>
                <ul className="mt-6 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <AppLink to={staticPath(r.group, r.slug)} className="flex h-full items-center justify-between gap-3 rounded-block bg-iris-50 p-5 font-jakarta text-base font-extrabold text-night-900 transition-colors hover:bg-iris-700 hover:text-white">
                        {r.title}<I.ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          {toc.length > 1 && <PageOutline items={toc} active={active} onPick={jump} />}
        </div>
      </Container>

      {toc.length > 1 && <JumpToSection items={toc} active={active} onPick={jump} />}
    </>
  )
}
