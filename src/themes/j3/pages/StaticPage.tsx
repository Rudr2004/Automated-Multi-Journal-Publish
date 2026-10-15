// Journal 3 long-form template for policies, for-authors and about pages ("Academic Editorial & Press", after the Publication Ethics reference):
// breadcrumb, a Mist header card with status tags and the title, bordered numbered section cards (orange 8px marker, uppercase tracked heading,
// ruled sub-cards, left-ruled items, ruled tables), a right rail (page list, "On this page", submit, track, contact), a plum contact band and
// a floating "Jump to section" menu on small screens.
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { BlockActions } from '../../../core/theme'
import type { StaticPageData } from '../../../core/types'
import { acBtn, AcMarker } from '../components/AcademicUi'
import { AcButton } from '../components/AcButton'
import { ApcPaymentJ3, APC_TOC } from './ApcPaymentJ3'
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
const metaLabel = 'font-jakarta text-xs font-bold uppercase tracking-[0.08em]'
const rule = 'border-j3paper-rule'
const panel = cx('rounded-[2px] border bg-white', rule)
const railHead = 'flex items-center gap-2 border-b border-j3paper-rule px-4 py-3'

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

/** A numbered section card: orange square marker, uppercase heading (the heading holds the collapse toggle), hairline rule, body. */
function SectionCard({ id, n, title, open, onToggle, children }: { id: string; n: number; title: string; open: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <section className={cx(panel, 'p-4 sm:p-5')}>
      <h2 id={id} className="scroll-mt-28 xl:scroll-mt-36">
        <button type="button" id={`${id}-btn`} aria-expanded={open} aria-controls={`${id}-body`} onClick={onToggle}
          className={cx('group flex w-full items-center justify-between gap-4 border-b pb-2.5 text-left', rule)}>
          <span className="flex min-w-0 items-center gap-2.5 font-jakarta text-[0.9375rem] font-bold uppercase leading-snug tracking-[0.05em] text-night-900 sm:text-base">
            <AcMarker />
            <span className="min-w-0 break-words">{n}. {title}</span>
          </span>
          <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border border-transparent text-iris-700 group-hover:border-iris-700 group-hover:bg-j3paper-cool">
            <I.ChevronDown className={cx('h-5 w-5 motion-safe:transition-transform', open && 'rotate-180')} />
          </span>
        </button>
      </h2>
      <div id={`${id}-body`} role="region" aria-labelledby={id} hidden={!open} className="mt-4 space-y-4">{children}</div>
    </section>
  )
}

/** The numbered section index (right rail). */
function PolicyIndex({ items, active, onPick }: { items: { id: string; label: string }[]; active: string; onPick: (id: string) => void }) {
  return (
    <nav aria-label="On this page" className={panel}>
      <div className={cx(railHead, 'justify-between bg-j3paper-cool')}>
        <span className={cx(metaLabel, 'flex items-center gap-2 text-night-900')}><AcMarker />On this page</span>
        <span className="font-inter text-xs tabular-nums text-mauve-600">{items.length} sections</span>
      </div>
      <ol className="p-2">
        {items.map((t, n) => {
          const on = t.id === active
          return (
            <li key={t.id}>
              <button type="button" aria-current={on ? 'location' : undefined} onClick={() => onPick(t.id)}
                className={cx('flex w-full items-start gap-2 border-l-2 px-3 py-2 text-left font-inter text-sm leading-snug transition-colors',
                  on ? 'border-iris-700 bg-j3paper-cool font-semibold text-iris-700' : 'border-transparent text-mauve-700 hover:bg-j3paper-cool hover:text-iris-700')}>
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
        <nav id="j3-jump-list" aria-label="Jump to section" className="absolute bottom-full right-0 mb-3 max-h-[60vh] w-[min(20rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-[2px] border border-j3paper-rule bg-white p-2 shadow-dock motion-safe:animate-fade-in">
          <ul>
            {items.map((t, n) => {
              const on = t.id === active
              return (
                <li key={t.id}>
                  <button type="button" aria-current={on ? 'location' : undefined} onClick={() => { setOpen(false); onPick(t.id) }}
                    className={cx('flex w-full items-start gap-2 px-3 py-2.5 text-left font-inter text-sm leading-snug transition-colors',
                      on ? 'bg-iris-700 font-semibold text-white' : 'text-night-900 hover:bg-j3paper-cool')}>
                    <span aria-hidden="true" className="w-5 shrink-0 tabular-nums">{n + 1}.</span><span className="min-w-0">{t.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
      <button ref={btn} type="button" aria-expanded={open} aria-controls="j3-jump-list" onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-[2px] bg-iris-700 px-5 py-3 font-jakarta text-xs font-bold uppercase tracking-[0.08em] text-white shadow-dock transition-colors hover:bg-iris-800">
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

  const isApc = page.slug === 'apc-payment' && page.group === 'for-authors'
  const toc = useMemo(() => [
    ...(page.principles ? [{ id: PRINCIPLES_ID, label: 'Our ethical principles' }] : []),
    ...(isApc ? APC_TOC : page.sections.map((s) => ({ id: anchorId(s.heading), label: s.heading }))),
    ...(page.blocks ?? []).map((b) => { const t = blockTitle(b); return { id: anchorId(t), label: t } }),
  ], [page, isApc])
  const active = useActiveId(toc.map((t) => t.id))
  const numOf = (id: string) => toc.findIndex((t) => t.id === id) + 1

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

  const para = 'font-inter text-base leading-[1.75] text-mauve-700 sm:text-[1.0625rem] sm:leading-[1.65]'
  const tag = 'inline-flex items-center gap-1 rounded-[2px] px-2 py-0.5 font-jakarta text-[0.6875rem] font-bold uppercase tracking-[0.06em]'

  return (
    <>
      <Container className="pb-12 pt-6 sm:pb-16 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 font-inter text-[0.8125rem] text-mauve-600">
            <li><AppLink to={paths.home} className="hover:text-iris-700 hover:underline">Home</AppLink></li>
            <li aria-hidden="true"><I.ChevronRight className="h-3.5 w-3.5" /></li>
            <li><AppLink to={g.to} className="hover:text-iris-700 hover:underline">{g.label}</AppLink></li>
            <li aria-hidden="true"><I.ChevronRight className="h-3.5 w-3.5" /></li>
            <li aria-current="page" className="font-bold text-night-900">{page.title}</li>
          </ol>
        </nav>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17.5rem] xl:grid-cols-[minmax(0,1fr)_19rem]">
          <div className="min-w-0 space-y-5">
            {/* Phones and tablets: a scrollable strip of the sibling pages. */}
            <nav aria-label={`${g.label} pages`} className="lg:hidden">
              <div className="-mx-4 overflow-x-auto px-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
                <ul ref={chips} className={cx('flex w-max border-b', rule)}>
                  {sidebar.map((p) => {
                    const on = p.slug === page.slug
                    return (
                      <li key={p.slug} className="shrink-0">
                        <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                          className={cx('block whitespace-nowrap border-b-2 px-4 py-2.5 font-inter text-sm transition-colors', on ? 'border-iris-700 font-semibold text-iris-700' : 'border-transparent text-mauve-700 hover:text-iris-700')}>{p.title}</AppLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </nav>

            <header className={cx('rounded-[2px] border bg-j3paper-cool p-5 sm:p-6', rule)}>
              <ul className="flex flex-wrap items-center gap-2">
                <li className={cx(tag, 'bg-iris-700 text-white')}>{g.label}</li>
                {journal.badges.peerReviewed && <li className={cx(tag, 'bg-j3valid-50 text-j3valid-700')}><I.Verified className="h-3.5 w-3.5" aria-hidden="true" />Peer reviewed</li>}
                {journal.badges.openAccess && <li className={cx(tag, 'bg-j3paper-deep text-night-900')}><I.OpenAccess className="h-3.5 w-3.5 text-ember-700" aria-hidden="true" />Open access ({journal.licence.name})</li>}
                <li className={cx(tag, 'bg-j3paper-deep text-iris-700')}>DOI: {journal.doiPrefix}</li>
              </ul>
              <h1 className="mt-3 break-words font-jakarta text-[clamp(1.625rem,3vw,2.125rem)] font-bold leading-[1.15] tracking-tight text-night-900">{page.title}</h1>
              <p className="mt-3 max-w-3xl font-inter text-[1.0625rem] leading-[1.65] text-mauve-700">{page.intro}</p>
              <div className={cx('mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 border-t pt-4', rule)}>
                <button type="button" onClick={() => window.print()} className={acBtn('ember')}><I.Download className="h-4 w-4" aria-hidden="true" />Print or save as PDF</button>
                <span className="inline-flex items-center gap-2 font-inter text-sm text-mauve-700"><I.History className="h-4 w-4 text-iris-700" aria-hidden="true" />Updated {formatDate(page.updated)}</span>
                {toc.length > 1 && <span className="inline-flex items-center gap-2 font-inter text-sm tabular-nums text-mauve-700"><I.Book className="h-4 w-4 text-iris-700" aria-hidden="true" />{toc.length} sections</span>}
              </div>
            </header>

            {toc.length > 1 && (
              <div className="flex justify-end">
                <AcButton variant="ghost" onClick={setAll}>
                  <I.ChevronDown className={cx('h-4 w-4', allOpen && 'rotate-180')} aria-hidden="true" />{allOpen ? 'Collapse all sections' : 'Expand all sections'}
                </AcButton>
              </div>
            )}

            {page.principles && (
              <SectionCard id={PRINCIPLES_ID} n={numOf(PRINCIPLES_ID)} title="Our ethical principles" open={!closed.has(PRINCIPLES_ID)} onToggle={() => toggle(PRINCIPLES_ID)}>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {principles.map(({ icon: Icon, title, text }) => (
                    <li key={title} className={cx('rounded-[2px] border bg-j3paper-cool p-3.5', rule)}>
                      <h3 className="flex items-center gap-2 font-jakarta text-[0.9375rem] font-bold text-night-900"><Icon className="h-4 w-4 shrink-0 text-iris-700" aria-hidden="true" />{title}</h3>
                      <p className="mt-1.5 font-inter text-[0.9375rem] leading-[1.6] text-mauve-700">{text}</p>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}

            {isApc && <ApcPaymentJ3 />}

            {!isApc && page.sections.map((s) => {
              const id = anchorId(s.heading)
              return (
                <SectionCard key={id} id={id} n={numOf(id)} title={s.heading} open={!closed.has(id)} onToggle={() => toggle(id)}>
                  {s.paragraphs?.map((p, i) => <p key={i} className={para}>{p}</p>)}
                  {s.list && (
                    <ul className="space-y-3">
                      {s.list.map((x, i) => (
                        <li key={x} className="flex gap-3 border-l-2 border-iris-700 pl-3.5">
                          <span aria-hidden="true" className="w-5 shrink-0 font-jakarta text-base font-bold leading-[1.65] text-iris-700">{String.fromCharCode(65 + (i % 26))}.</span>
                          <span className="min-w-0 font-inter text-base leading-[1.65] text-mauve-700">{x}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.callout && (
                    <aside role="note" className={cx('flex gap-3 rounded-[2px] border p-4', s.callout.tone === 'warn' ? 'border-ember-200 bg-ember-50' : cx(rule, 'bg-j3paper-deep'))}>
                      {s.callout.tone === 'warn'
                        ? <I.ErrorIcon className="mt-0.5 h-5 w-5 shrink-0 text-ember-700" aria-hidden="true" />
                        : <I.Bolt className="mt-0.5 h-5 w-5 shrink-0 text-iris-700" aria-hidden="true" />}
                      <div><p className="font-jakarta text-[0.9375rem] font-bold text-night-900">{s.callout.title}</p><p className="mt-1 font-inter text-[0.9375rem] leading-[1.65] text-mauve-700">{s.callout.text}</p></div>
                    </aside>
                  )}
                </SectionCard>
              )
            })}

            {page.blocks?.map((b, i) => {
              const t = blockTitle(b)
              const id = anchorId(t)
              return (
                <SectionCard key={`${id}-${i}`} id={id} n={numOf(id)} title={t} open={!closed.has(id)} onToggle={() => toggle(id)}>
                  <BlockBody block={b} actions={actions} />
                </SectionCard>
              )
            })}

            {related.length > 0 && (
              <section aria-labelledby="j3-related-h" className={cx(panel, 'p-4 sm:p-5')}>
                <h2 id="j3-related-h" className={cx('flex items-center gap-2.5 border-b pb-2.5 font-jakarta text-[0.9375rem] font-bold uppercase tracking-[0.05em] text-night-900 sm:text-base', rule)}><AcMarker />Related {g.label.toLowerCase()}</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <AppLink to={staticPath(r.group, r.slug)} className={cx('group flex h-full items-center justify-between gap-3 rounded-[2px] border bg-j3paper-cool p-3.5 font-jakarta text-[0.9375rem] font-bold leading-snug text-night-900 transition-colors hover:border-iris-700 hover:text-iris-700', rule)}>
                        {r.title}<I.ArrowRight className="h-4 w-4 shrink-0 text-iris-700" aria-hidden="true" />
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="j3-contact-h" className="flex flex-col gap-4 rounded-[2px] bg-night-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div className="min-w-0">
                <h2 id="j3-contact-h" className="flex items-center gap-2 font-jakarta text-base font-bold"><I.Email className="h-5 w-5 text-white" aria-hidden="true" />Questions about this page?</h2>
                <p className="mt-1 font-inter text-[0.9375rem] leading-[1.6] text-white/80">The editorial office replies within two working days. Last updated {formatDate(page.updated)}.</p>
              </div>
              <a href={`mailto:${journal.email}`} className={cx(acBtn('outline'), 'shrink-0 !border-white !bg-white hover:!bg-j3paper-deep')}>Email {journal.email}<I.ArrowRight className="h-4 w-4" aria-hidden="true" /></a>
            </section>
          </div>

          <aside aria-label={`${g.label} navigation and actions`} className="min-w-0 space-y-5">
            <nav aria-label={`${g.label} pages`} className={cx(panel, 'hidden lg:block')}>
              <p className={cx(railHead, metaLabel, 'bg-j3paper-cool text-night-900')}><AcMarker />{g.label}</p>
              <ul className="max-h-[22rem] overflow-y-auto p-2">
                {sidebar.map((p) => {
                  const on = p.slug === page.slug
                  return (
                    <li key={p.slug}>
                      <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                        className={cx('block border-l-2 px-3 py-1.5 font-inter text-sm leading-snug transition-colors', on ? 'border-iris-700 bg-j3paper-cool font-semibold text-iris-700' : 'border-transparent text-mauve-700 hover:bg-j3paper-cool hover:text-iris-700')}>{p.title}</AppLink>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {toc.length > 1 && <div className="hidden lg:block"><PolicyIndex items={toc} active={active} onPick={jump} /></div>}

            <section aria-labelledby="j3-rail-submit" className="rounded-[2px] bg-night-900 p-4 text-white">
              <p id="j3-rail-submit" className={cx(metaLabel, 'flex items-center gap-2 text-white')}><AcMarker />Call for papers</p>
              <p className="mt-2 font-jakarta text-base font-bold leading-snug">{journal.nextIssue.label}</p>
              <p className="mt-1 font-inter text-sm leading-relaxed text-white/80">Submit your manuscript online and follow it with your Paper ID.</p>
              <AppLink to={paths.submit} className={cx(acBtn('ember'), 'mt-3 w-full')}>Submit manuscript<I.ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
            </section>

            <section aria-labelledby="j3-rail-track" className={cx(panel, 'p-4')}>
              <p id="j3-rail-track" className={cx(metaLabel, 'flex items-center gap-2 text-night-900')}><AcMarker />Track submission status</p>
              <p className="mt-2 font-inter text-sm leading-relaxed text-mauve-700">Use your Paper ID to see where your manuscript is in review.</p>
              <AppLink to={paths.track} className={cx(acBtn('primary'), 'mt-3 w-full')}>Track my paper<I.ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
            </section>

            <section aria-labelledby="j3-rail-meta" className={cx('rounded-[2px] border bg-j3paper-cool p-4', rule)}>
              <p id="j3-rail-meta" className={cx(metaLabel, 'text-mauve-600')}>Version details</p>
              <dl className="mt-2 space-y-1.5 font-inter text-sm text-night-900">
                <div className="flex justify-between gap-3"><dt className="text-mauve-600">Last updated</dt><dd className="text-right tabular-nums">{formatDate(page.updated)}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-mauve-600">Licence</dt><dd className="text-right font-bold text-j3valid-700">{journal.licence.name}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-mauve-600">Contact</dt><dd className="min-w-0 break-all text-right"><a className="text-iris-700 underline underline-offset-2 hover:text-iris-800" href={`mailto:${journal.email}`}>{journal.email}</a></dd></div>
              </dl>
            </section>
          </aside>
        </div>
      </Container>

      {toc.length > 1 && <JumpToSection items={toc} active={active} onPick={jump} />}
    </>
  )
}
