// Journal 2 template for policies, for-authors and about pages. Top tabs switch between pages of the same group.
import { useEffect, useMemo, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink, useRouter } from '../../../core/router'
import type { BlockActions } from '../../../core/theme'
import type { StaticPageData } from '../../../core/types'
import { Container, cx } from '../components/primitives'
import * as I from '../icons'
import { anchorId, blockTitle, StaticBlocksJ2 } from './static/StaticBlocksJ2'

const principles = [
  { icon: I.Verified, title: 'Integrity', text: 'Honest, rigorous research and reporting.' },
  { icon: I.FactCheck, title: 'Transparency', text: 'Open processes and clearly explained decisions.' },
  { icon: I.Award, title: 'Fairness', text: 'Impartial evaluation on merit alone.' },
  { icon: I.TaskDone, title: 'Accountability', text: 'Clear responsibility at every stage.' },
  { icon: I.Book, title: 'Alignment', text: 'Guided by COPE-style good-practice principles.' },
]

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700 focus-visible:ring-offset-2'

/** Tracks which heading is nearest the top of the viewport. */
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
    }, { rootMargin: '-96px 0px -65% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return active
}

export function StaticPage({ page, sidebar, allPages, actions }: { page: StaticPageData; sidebar: StaticPageData[]; allPages: StaticPageData[]; actions: BlockActions }) {
  const { navigate, pathname } = useRouter()
  const g = staticGroups[page.group]
  const related = page.related.map((s) => allPages.find((p) => p.slug === s)).filter(Boolean) as StaticPageData[]
  const tabsRef = useRef<HTMLUListElement>(null)

  const toc = useMemo(() => [
    ...(page.principles ? [{ id: 'principles-h', label: 'Our ethical principles' }] : []),
    ...page.sections.map((s) => ({ id: anchorId(s.heading), label: s.heading })),
    ...(page.blocks ?? []).flatMap((b) => { const t = blockTitle(b); return t ? [{ id: anchorId(t), label: t }] : [] }),
  ], [page])
  const active = useActiveId(toc.map((t) => t.id))

  // Keep the current tab visible in the scrollable strip (inline only, so the page itself never jumps).
  useEffect(() => {
    const el = tabsRef.current?.querySelector<HTMLElement>('[aria-current="page"]')
    const box = tabsRef.current?.parentElement
    if (el && box) box.scrollLeft = Math.max(0, el.offsetLeft - 16)
  }, [page.slug])

  return (
    <>
      <header className="border-b border-graphite-200 bg-gradient-to-b from-brand-50 to-white">
        <Container className="pb-6 pt-6 sm:pb-8 sm:pt-8">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-graphite-600">
              <li><AppLink to={paths.home} className={cx('rounded-chip hover:text-accent-700 hover:underline', focusRing)}>Home</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li><AppLink to={g.to} className={cx('rounded-chip hover:text-accent-700 hover:underline', focusRing)}>{g.label}</AppLink></li>
              <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
              <li aria-current="page" className="font-medium text-graphite-800">{page.title}</li>
            </ol>
          </nav>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-graphite-800 sm:text-4xl">{page.title}</h1>
          <p className="mt-3 max-w-3xl text-lg leading-relaxed text-graphite-600">{page.intro}</p>
        </Container>
      </header>

      <Container className="mt-6">
        {/* Phones: select. Larger screens: horizontally scrollable tabs without a visible scrollbar. */}
        <div className="sm:hidden">
          <label htmlFor="j2-static-nav" className="mb-1.5 block text-sm font-medium text-graphite-800">{g.label} pages</label>
          <select id="j2-static-nav" value={pathname} onChange={(e) => navigate(e.target.value)}
            className="block w-full rounded-soft border border-graphite-300 bg-white px-3 py-2.5 text-base text-graphite-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">
            {sidebar.map((p) => <option key={p.slug} value={staticPath(p.group, p.slug)}>{p.title}</option>)}
          </select>
        </div>
        <nav aria-label={`${g.label} pages`} className="hidden overflow-x-auto border-b border-graphite-200 [-ms-overflow-style:none] [scrollbar-width:none] sm:block [&::-webkit-scrollbar]:hidden">
          <ul ref={tabsRef} className="relative flex w-max min-w-full gap-1">
            {sidebar.map((p) => {
              const on = p.slug === page.slug
              return (
                <li key={p.slug} className="shrink-0">
                  <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                    className={cx('-mb-px block whitespace-nowrap border-b-2 px-3.5 py-3 text-sm font-medium transition-colors', focusRing,
                      on ? 'border-accent-700 text-accent-700' : 'border-transparent text-graphite-600 hover:border-graphite-300 hover:text-graphite-800')}>{p.title}</AppLink>
                </li>
              )
            })}
          </ul>
        </nav>
      </Container>

      <Container className="mt-8 grid gap-8 pb-4 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-12">
        <article className="min-w-0 max-w-3xl">
          {toc.length > 1 && (
            <details className="mb-8 rounded-panel border border-graphite-200 bg-white lg:hidden">
              <summary className={cx('cursor-pointer rounded-panel px-4 py-3 text-sm font-semibold text-graphite-800', focusRing)}>On this page</summary>
              <ul className="space-y-1 border-t border-graphite-200 px-4 py-3 text-sm">
                {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="block py-1 text-accent-700 hover:underline">{t.label}</a></li>)}
              </ul>
            </details>
          )}

          {page.principles && (
            <section aria-labelledby="principles-h" className="mb-10">
              <h2 id="principles-h" className="scroll-mt-24 font-display text-2xl font-bold tracking-tight text-graphite-800">Our ethical principles</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {principles.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="rounded-panel border border-brand-200 bg-brand-50 p-4">
                    <Icon className="h-6 w-6 text-brand-800" aria-hidden="true" />
                    <h3 className="mt-2 font-display font-semibold text-graphite-800">{title}</h3>
                    <p className="mt-0.5 text-sm text-graphite-700">{text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {page.sections.map((s) => {
            const id = anchorId(s.heading)
            return (
              <section key={s.heading} aria-labelledby={id} className="mb-9">
                <h2 id={id} className="scroll-mt-24 font-display text-2xl font-bold tracking-tight text-graphite-800">{s.heading}</h2>
                {s.paragraphs?.map((p, i) => <p key={i} className="mt-3 text-[1.0625rem] leading-[1.75] text-graphite-700">{p}</p>)}
                {s.list && <ul className="mt-3 list-disc space-y-2 pl-6 text-[1.0625rem] leading-[1.7] text-graphite-700 marker:text-accent-700">{s.list.map((x) => <li key={x}>{x}</li>)}</ul>}
                {s.callout && (
                  <aside role="note" className={cx('mt-4 flex gap-3 rounded-panel border p-4', s.callout.tone === 'warn' ? 'border-cta-300 bg-cta-50' : 'border-accent-200 bg-accent-50')}>
                    {s.callout.tone === 'warn'
                      ? <I.ErrorIcon className="mt-0.5 h-5 w-5 shrink-0 text-cta-800" aria-hidden="true" />
                      : <I.Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />}
                    <div><p className="font-display font-semibold text-graphite-800">{s.callout.title}</p><p className="mt-0.5 text-sm text-graphite-700">{s.callout.text}</p></div>
                  </aside>
                )}
              </section>
            )
          })}

          {page.blocks && <StaticBlocksJ2 blocks={page.blocks} actions={actions} />}

          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-graphite-200 pt-4 text-sm text-graphite-600">
            <I.History className="h-4 w-4" aria-hidden="true" />Last updated {formatDate(page.updated)}. Questions about this page: <a className="text-accent-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>
          </p>

          {related.length > 0 && (
            <section className="mt-8" aria-labelledby="related-h">
              <h2 id="related-h" className="font-display text-xl font-bold text-graphite-800">Related pages</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <AppLink to={staticPath(r.group, r.slug)} className={cx('flex items-center justify-between gap-2 rounded-panel border border-graphite-200 bg-white p-4 text-sm font-semibold text-graphite-800 shadow-card transition-colors hover:border-accent-700 hover:text-accent-700', focusRing)}>
                      {r.title}<I.ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </AppLink>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        {toc.length > 1 && (
          <aside aria-label="On this page" className="hidden lg:block">
            <nav className="sticky top-24">
              <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite-600">On this page</h2>
              <ul className="mt-3 space-y-0.5 border-l border-graphite-200">
                {toc.map((t) => {
                  const on = t.id === active
                  return (
                    <li key={t.id}>
                      <a href={`#${t.id}`} aria-current={on ? 'location' : undefined}
                        className={cx('-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors', focusRing,
                          on ? 'border-accent-700 font-semibold text-accent-700' : 'border-transparent text-graphite-600 hover:text-graphite-800')}>{t.label}</a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </aside>
        )}
      </Container>
    </>
  )
}
