// Journal 3 long-form template for policies, for-authors and about pages ("Academic Prestige"): breadcrumb, serif title, meta strip, a sticky numbered
// section index, collapsible numbered sections, callouts, side cards, a floating "Jump to section" menu on small screens and related pages.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { BlockActions } from '../../../core/theme'
import type { StaticPageData } from '../../../core/types'
import { AcButton, AcTag } from '../components/AcButton'
import { anchorId, BlockBody, blockTitle } from '../components/StaticBlocksJ3'
import { Container, cx } from '../components/primitives'
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
const metaLabel = 'font-inter text-xs font-bold uppercase tracking-[0.08em]'

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

/** A numbered section: a hairline header bar whose title holds the collapse toggle. */
function Collapsible({ id, title, tag, open, onToggle, children }: { id: string; title: string; tag: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-0 sm:mt-12">
      <h2 id={id} className="scroll-mt-28 border border-mauve-100 bg-j3paper-cool font-jakarta text-[1.375rem] font-semibold leading-snug text-iris-700 sm:text-[1.625rem] xl:scroll-mt-36">
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-body`} onClick={onToggle}
          className="group flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-iris-50 sm:px-5">
          <span className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1.5">
            <AcTag tone="dark" className="shrink-0">{tag}</AcTag>
            <span className="min-w-0 break-words">{title}</span>
          </span>
          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center border border-mauve-200 bg-white text-iris-700 group-hover:border-iris-700">
            <I.ChevronDown className={cx('h-5 w-5 motion-safe:transition-transform', open && 'rotate-180')} />
          </span>
        </button>
      </h2>
      <div id={`${id}-body`} role="region" aria-labelledby={id} hidden={!open} className="mt-5 space-y-5">{children}</div>
    </section>
  )
}

/** The numbered section index (sticky card on wide screens). */
function PolicyIndex({ items, active, onPick }: { items: { id: string; label: string }[]; active: string; onPick: (id: string) => void }) {
  return (
    <nav aria-label="On this page" className="hidden border border-mauve-100 bg-white lg:block">
      <div className="flex items-center justify-between gap-3 border-b border-mauve-100 bg-j3paper-cool px-4 py-3">
        <span className={cx(metaLabel, 'text-iris-700')}>On this page</span>
        <span className="font-inter text-xs text-mauve-600">{items.length} sections</span>
      </div>
      <ol className="p-2">
        {items.map((t, n) => {
          const on = t.id === active
          return (
            <li key={t.id}>
              <button type="button" aria-current={on ? 'location' : undefined} onClick={() => onPick(t.id)}
                className={cx('flex w-full items-start gap-2 border-l-2 px-3 py-2 text-left font-inter text-sm leading-snug transition-colors',
                  on ? 'border-iris-700 bg-iris-50 font-semibold text-iris-700' : 'border-transparent text-mauve-700 hover:bg-j3paper-cool hover:text-iris-700')}>
                <span aria-hidden="true" className="w-5 shrink-0 tabular-nums text-mauve-600">{n + 1}.</span><span className="min-w-0 break-words">{t.label}</span>
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
    <div ref={box} className="fixed bottom-24 right-4 z-30 sm:bottom-6 sm:right-6 lg:hidden">
      {open && (
        <nav id="j3-jump-list" aria-label="Jump to section" className="absolute bottom-full right-0 mb-3 max-h-[60vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain border border-mauve-200 bg-white p-2 shadow-dock motion-safe:animate-fade-in">
          <ul>
            {items.map((t, n) => {
              const on = t.id === active
              return (
                <li key={t.id}>
                  <button type="button" aria-current={on ? 'location' : undefined} onClick={() => { setOpen(false); onPick(t.id) }}
                    className={cx('flex w-full items-start gap-2 px-3 py-2.5 text-left font-inter text-sm leading-snug transition-colors',
                      on ? 'bg-iris-700 font-semibold text-white' : 'text-night-900 hover:bg-iris-50')}>
                    <span aria-hidden="true" className="w-5 shrink-0 tabular-nums">{n + 1}.</span><span className="min-w-0">{t.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
      <button ref={btn} type="button" aria-expanded={open} aria-controls="j3-jump-list" onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-none bg-iris-700 px-5 py-3 font-inter text-xs font-bold uppercase tracking-[0.08em] text-white shadow-dock transition-colors hover:bg-iris-600">
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
  const numOf = (id: string) => String(toc.findIndex((t) => t.id === id) + 1).padStart(2, '0')

  useEffect(() => { setClosed(new Set()) }, [page.slug])

  // Keep the current page tab visible in its own scroll strip (inline only, so the page never jumps).
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

  const para = 'font-jakarta text-base leading-[1.75] text-night-700 sm:text-[1.0625rem]'

  return (
    <>
      <header className="border-b border-mauve-100 bg-j3paper-cool">
        <Container className="pb-8 pt-6 sm:pb-10 sm:pt-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 font-inter text-sm text-mauve-600">
              <li><AppLink to={paths.home} className="hover:text-ember-700 hover:underline">Home</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li><AppLink to={g.to} className="hover:text-ember-700 hover:underline">{g.label}</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li aria-current="page" className="font-semibold text-iris-700">{page.title}</li>
            </ol>
          </nav>
          <p className={cx(metaLabel, 'mt-6 text-ember-700')}>{g.label}</p>
          <h1 className="mt-2 max-w-4xl break-words font-jakarta text-[clamp(1.75rem,3.2vw,2.5rem)] font-semibold leading-[1.15] tracking-tight text-iris-700">{page.title}</h1>
          <p className="mt-4 max-w-3xl font-jakarta text-lg leading-relaxed text-mauve-600">{page.intro}</p>
          <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-mauve-100 pt-4 font-inter text-sm text-mauve-700">
            <li className="inline-flex items-center gap-2"><I.History className="h-4 w-4 text-ember-700" aria-hidden="true" />Updated {formatDate(page.updated)}</li>
            {toc.length > 1 && <li className="inline-flex items-center gap-2"><I.Book className="h-4 w-4 text-ember-700" aria-hidden="true" />{toc.length} sections</li>}
            <li><AcTag tone="green" icon={<I.OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />}>{journal.licence.name}</AcTag></li>
          </ul>
        </Container>
      </header>

      <Container className="py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
          <aside aria-label={`${g.label} navigation`} className="min-w-0">
            <div className="lg:sticky lg:top-32 lg:space-y-4">
              <nav aria-label={`${g.label} pages`} className="lg:border lg:border-mauve-100 lg:bg-white">
                <p className={cx(metaLabel, 'hidden border-b border-mauve-100 bg-j3paper-cool px-4 py-3 text-iris-700 lg:block')}>{g.label}</p>
                {/* Phones and tablets: a scrollable strip of tabs inside its own box. Large screens: a vertical list. */}
                <div className="-mx-4 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:overflow-visible lg:p-2 [&::-webkit-scrollbar]:hidden">
                  <ul ref={chips} className="flex w-max gap-0 border-b border-mauve-100 lg:w-auto lg:flex-col lg:border-b-0">
                    {sidebar.map((p) => {
                      const on = p.slug === page.slug
                      return (
                        <li key={p.slug} className="shrink-0">
                          <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                            className={cx('block whitespace-nowrap border-b-2 px-4 py-2.5 font-inter text-sm transition-colors lg:whitespace-normal lg:border-b-0 lg:border-l-2 lg:py-2',
                              on ? 'border-iris-700 font-semibold text-iris-700 lg:bg-iris-50' : 'border-transparent text-mauve-700 hover:text-iris-700 lg:hover:bg-j3paper-cool')}>{p.title}</AppLink>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </nav>

              {toc.length > 1 && <PolicyIndex items={toc} active={active} onPick={jump} />}

              <div className="hidden bg-iris-700 p-4 text-white lg:block">
                <p className={cx(metaLabel, 'flex items-center gap-2 text-white')}><I.Email className="h-4 w-4" aria-hidden="true" />Editorial office</p>
                <p className="mt-2 font-jakarta text-base leading-snug">Questions about this page can be sent to the editorial office.</p>
                <a href={`mailto:${journal.email}`} className="mt-3 block break-all border border-white/30 bg-iris-600 p-2.5 font-inter text-sm text-white underline-offset-2 hover:underline">{journal.email}</a>
              </div>

              <div className="hidden border border-mauve-100 bg-j3paper-cool p-4 lg:block">
                <p className={cx(metaLabel, 'text-mauve-600')}>Version details</p>
                <dl className="mt-2 space-y-1 font-inter text-sm text-night-700">
                  <div className="flex justify-between gap-3"><dt className="text-mauve-600">Last updated</dt><dd className="text-right">{formatDate(page.updated)}</dd></div>
                  <div className="flex justify-between gap-3"><dt className="text-mauve-600">Licence</dt><dd className="text-right font-bold text-j3valid-700">{journal.licence.name}</dd></div>
                </dl>
              </div>
            </div>
          </aside>

          <article className="min-w-0 max-w-[58rem]">
            {toc.length > 1 && (
              <div className="mb-4 flex justify-end">
                <AcButton variant="ghost" onClick={setAll}>
                  <I.ChevronDown className={cx('h-4 w-4', allOpen && 'rotate-180')} aria-hidden="true" />{allOpen ? 'Collapse all sections' : 'Expand all sections'}
                </AcButton>
              </div>
            )}

            {page.principles && (
              <Collapsible id={PRINCIPLES_ID} title="Our ethical principles" tag={`Section ${numOf(PRINCIPLES_ID)}`} open={!closed.has(PRINCIPLES_ID)} onToggle={() => toggle(PRINCIPLES_ID)}>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {principles.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-4 border border-mauve-100 bg-white p-5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-iris-700 text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <div className="min-w-0"><h3 className="font-jakarta text-lg font-semibold leading-tight text-iris-700">{title}</h3><p className="mt-1 font-inter text-sm leading-relaxed text-mauve-600">{text}</p></div>
                    </li>
                  ))}
                </ul>
              </Collapsible>
            )}

            {page.sections.map((s) => {
              const id = anchorId(s.heading)
              return (
                <Collapsible key={id} id={id} title={s.heading} tag={`Section ${numOf(id)}`} open={!closed.has(id)} onToggle={() => toggle(id)}>
                  {s.paragraphs?.map((p, i) => <p key={i} className={para}>{p}</p>)}
                  {s.list && (
                    <ul className="space-y-3 border border-mauve-100 bg-white p-5 sm:p-6">
                      {s.list.map((x) => (
                        <li key={x} className="flex gap-3 font-inter text-base leading-relaxed text-night-700">
                          <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-j3valid-50 text-j3valid-700"><I.Check className="h-3.5 w-3.5" /></span>
                          <span className="min-w-0">{x}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.callout && (
                    <aside role="note" className={cx('flex gap-4 border-l-4 p-5', s.callout.tone === 'warn' ? 'border-ember-700 bg-ember-50' : 'border-iris-700 bg-iris-50')}>
                      {s.callout.tone === 'warn'
                        ? <I.ErrorIcon className="mt-0.5 h-6 w-6 shrink-0 text-ember-700" aria-hidden="true" />
                        : <I.Bolt className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" />}
                      <div><p className="font-jakarta text-lg font-semibold text-iris-700">{s.callout.title}</p><p className="mt-1 font-jakarta text-base leading-relaxed text-night-700">{s.callout.text}</p></div>
                    </aside>
                  )}
                </Collapsible>
              )
            })}

            {page.blocks?.map((b, i) => {
              const t = blockTitle(b)
              const id = anchorId(t)
              return (
                <Collapsible key={`${id}-${i}`} id={id} title={t} tag={`Section ${numOf(id)}`} open={!closed.has(id)} onToggle={() => toggle(id)}>
                  <BlockBody block={b} actions={actions} />
                </Collapsible>
              )
            })}

            <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-mauve-100 pt-6 font-inter text-sm text-mauve-600">
              <I.History className="h-4 w-4" aria-hidden="true" />Last updated {formatDate(page.updated)}. Questions about this page: <a className="font-semibold text-iris-700 underline hover:text-ember-700" href={`mailto:${journal.email}`}>{journal.email}</a>
            </p>

            {related.length > 0 && (
              <section className="mt-10" aria-labelledby="j3-related-h">
                <h2 id="j3-related-h" className="border-b-2 border-iris-700 pb-2 font-jakarta text-[1.375rem] font-semibold leading-snug text-iris-700 sm:text-[1.625rem]">Related policies</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <AppLink to={staticPath(r.group, r.slug)} className="group flex h-full items-center justify-between gap-3 border border-mauve-100 bg-white p-5 font-jakarta text-lg font-semibold leading-snug text-iris-700 transition-colors hover:border-iris-700 hover:text-ember-700">
                        {r.title}<I.ArrowRight className="h-5 w-5 shrink-0" aria-hidden="true" />
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        </div>
      </Container>

      {toc.length > 1 && <JumpToSection items={toc} active={active} onPick={jump} />}
    </>
  )
}
