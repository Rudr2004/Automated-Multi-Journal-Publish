// Journal 2 template for policies, for-authors and about pages. Top tabs switch between pages of the same group.
import { useEffect, useMemo, useRef, useState } from 'react'
import { journal } from '../../../config/journals'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink, useRouter } from '../../../core/router'
import type { BlockActions } from '../../../core/theme'
import type { StaticPageData } from '../../../core/types'
import { Container, cx } from '../components/primitives'
import { AwardsCard } from '../components/AwardsCard'
import * as I from '../icons'
import { Print } from '../components/pageIcons'
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

  const groupTag = page.group === 'policies' ? 'Editorial policy' : page.group === 'for-authors' ? 'Author information' : 'About the journal'
  const sectionNo = (id: string) => toc.findIndex((t) => t.id === id) + 1
  const blockStart = (page.principles ? 1 : 0) + page.sections.length
  const card = 'rounded-sheet border border-graphite-200 bg-white shadow-card'
  const h2cls = 'scroll-mt-28 font-display text-2xl font-bold tracking-tight text-brand-800'
  const metaItems: [string, string][] = [
    ['Last updated', formatDate(page.updated)],
    ['Section', g.label],
    ['Journal', journal.shortName],
    ['Licence', journal.licence.name],
  ]

  return (
    <div className="bg-[#F4F9F7]">
      <Container className="pb-10 pt-6 sm:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-graphite-600">
            <li><AppLink to={paths.home} className={cx('rounded-chip hover:text-accent-700 hover:underline', focusRing)}>Home</AppLink></li>
            <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
            <li><AppLink to={g.to} className={cx('rounded-chip hover:text-accent-700 hover:underline', focusRing)}>{g.label}</AppLink></li>
            <li aria-hidden="true"><I.ChevronRight className="h-4 w-4" /></li>
            <li aria-current="page" className="font-semibold text-brand-800">{page.title}</li>
          </ol>
        </nav>

        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-8">
          <div className="min-w-0 space-y-6">
            <header className={cx(card, 'p-5 sm:p-8')}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-chip bg-accent-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-accent-900">{groupTag}</span>
                <span className="inline-flex items-center gap-1 rounded-chip bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-800 ring-1 ring-inset ring-brand-200"><I.Verified className="h-3.5 w-3.5" aria-hidden="true" />{journal.shortName}</span>
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-brand-900 sm:text-[2.5rem] sm:leading-tight">{page.title}</h1>
              <p className="mt-3 max-w-3xl text-lg leading-relaxed text-graphite-700">{page.intro}</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 rounded-panel border border-graphite-200 bg-graphite-50 p-4 sm:grid-cols-4">
                {metaItems.map(([k, v]) => (
                  <div key={k} className="min-w-0"><dt className="text-xs text-graphite-600">{k}</dt><dd className="mt-0.5 break-words text-sm font-semibold text-graphite-800">{v}</dd></div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2 print:hidden">
                <button type="button" onClick={() => window.print()} className={cx('inline-flex items-center gap-2 rounded-soft border border-graphite-300 bg-white px-3.5 py-2 text-sm font-semibold text-graphite-800 hover:border-accent-700 hover:text-accent-700', focusRing)}><Print className="h-4 w-4" aria-hidden="true" />Print this page</button>
                <a href={`mailto:${journal.email}`} className={cx('inline-flex items-center gap-2 rounded-soft border border-graphite-300 bg-white px-3.5 py-2 text-sm font-semibold text-graphite-800 hover:border-accent-700 hover:text-accent-700', focusRing)}><I.Email className="h-4 w-4" aria-hidden="true" />Email the editorial office</a>
              </div>
            </header>

            {/* Phones: select. Larger screens: horizontally scrollable pills without a visible scrollbar. */}
            <div className="sm:hidden">
              <label htmlFor="j2-static-nav" className="mb-1.5 block text-sm font-medium text-graphite-800">{g.label} pages</label>
              <select id="j2-static-nav" value={pathname} onChange={(e) => navigate(e.target.value)}
                className="block w-full rounded-soft border border-graphite-300 bg-white px-3 py-2.5 text-base text-graphite-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">
                {sidebar.map((p) => <option key={p.slug} value={staticPath(p.group, p.slug)}>{p.title}</option>)}
              </select>
            </div>
            <nav aria-label={`${g.label} pages`} className="hidden overflow-x-auto rounded-sheet border border-graphite-200 bg-white p-1.5 shadow-card [-ms-overflow-style:none] [scrollbar-width:none] sm:block [&::-webkit-scrollbar]:hidden">
              <ul ref={tabsRef} className="relative flex w-max min-w-full gap-1">
                {sidebar.map((p) => {
                  const on = p.slug === page.slug
                  return (
                    <li key={p.slug} className="shrink-0">
                      <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                        className={cx('block whitespace-nowrap rounded-soft px-3.5 py-2 text-sm font-semibold transition-colors', focusRing,
                          on ? 'bg-brand-800 text-white' : 'text-graphite-700 hover:bg-brand-50 hover:text-brand-800')}>{p.title}</AppLink>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {toc.length > 1 && (
              <details className={cx(card, 'lg:hidden')}>
                <summary className={cx('cursor-pointer rounded-sheet px-4 py-3 text-sm font-semibold text-graphite-800', focusRing)}>On this page</summary>
                <ul className="space-y-1 border-t border-graphite-200 px-4 py-3 text-sm">
                  {toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="block py-1 text-accent-700 hover:underline">{t.label}</a></li>)}
                </ul>
              </details>
            )}

            <article className="min-w-0 space-y-6">
              {page.principles && (
                <section aria-labelledby="principles-h" className={cx(card, 'p-5 sm:p-8')}>
                  <div className="flex items-baseline justify-between gap-3 border-b border-graphite-200 pb-3">
                    <h2 id="principles-h" className={h2cls}>{sectionNo('principles-h')}. Our ethical principles</h2>
                  </div>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
                const n = sectionNo(id)
                return (
                  <section key={s.heading} aria-labelledby={id} className={cx(card, 'p-5 sm:p-8')}>
                    <div className="flex items-baseline justify-between gap-3 border-b border-graphite-200 pb-3">
                      <h2 id={id} className={h2cls}>{n}. {s.heading}</h2>
                      <span className="shrink-0 text-xs font-medium tabular-nums text-graphite-600">Section {String(n).padStart(2, '0')}</span>
                    </div>
                    {s.paragraphs?.map((p, i) => <p key={i} className="mt-4 text-[1.0625rem] leading-[1.75] text-graphite-700">{p}</p>)}
                    {s.list && (
                      <ul className="mt-4 space-y-2.5 text-[1.0625rem] leading-[1.7] text-graphite-700">
                        {s.list.map((x) => <li key={x} className="flex gap-3"><I.TaskDone className="mt-1 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" /><span>{x}</span></li>)}
                      </ul>
                    )}
                    {s.callout && (
                      <aside role="note" className={cx('mt-5 flex gap-3 rounded-panel border-l-4 p-4', s.callout.tone === 'warn' ? 'border-cta-700 bg-cta-50' : 'border-accent-700 bg-accent-50')}>
                        {s.callout.tone === 'warn'
                          ? <I.ErrorIcon className="mt-0.5 h-5 w-5 shrink-0 text-cta-800" aria-hidden="true" />
                          : <I.Info className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" />}
                        <div><p className="font-display font-semibold text-graphite-800">{s.callout.title}</p><p className="mt-0.5 text-sm text-graphite-700">{s.callout.text}</p></div>
                      </aside>
                    )}
                  </section>
                )
              })}

              {page.blocks && <StaticBlocksJ2 blocks={page.blocks} actions={actions} startAt={blockStart} />}

              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 px-1 text-sm text-graphite-600">
                <I.History className="h-4 w-4" aria-hidden="true" />Last updated {formatDate(page.updated)}. Questions about this page: <a className="text-accent-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>
              </p>
            </article>

            {related.length > 0 && (
              <section aria-labelledby="related-h">
                <h2 id="related-h" className="font-display text-xl font-bold text-brand-800">Related policies</h2>
                <ul className="mt-3 grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <AppLink to={staticPath(r.group, r.slug)} className={cx('group flex h-full flex-col gap-1 rounded-sheet border border-graphite-200 bg-white p-4 shadow-card transition-colors hover:border-accent-700', focusRing)}>
                        <span className="flex items-start justify-between gap-2 font-display text-lg font-semibold text-graphite-900 group-hover:text-accent-700">{r.title}<I.ArrowRight className="mt-1 h-4 w-4 shrink-0 -rotate-45 text-accent-700" aria-hidden="true" /></span>
                        <span className="text-sm text-graphite-600">{r.intro.length > 140 ? `${r.intro.slice(0, r.intro.lastIndexOf(' ', 140))}…` : r.intro}</span>
                      </AppLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside aria-label="Page sidebar" className="min-w-0 space-y-5 lg:sticky lg:top-24">
            <section aria-labelledby="cfp-h" className="rounded-sheet bg-brand-800 p-5 text-white shadow-soft">
              <span className="rounded-chip bg-white/15 px-2 py-1 text-xs font-bold uppercase tracking-wider text-white">Call for papers</span>
              <h2 id="cfp-h" className="mt-4 font-display text-xl font-bold">Submit to {journal.nextIssue.label}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-100">{journal.mission}</p>
              <p className="mt-4 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 rounded-soft border border-white/20 bg-white/10 px-3 py-2 text-sm"><span className="inline-flex items-center gap-1.5 text-brand-100"><I.Calendar className="h-4 w-4" aria-hidden="true" />Submission deadline</span><strong>{formatDate(journal.nextIssue.deadline.slice(0, 10))}</strong></p>
              <AppLink to={paths.submit} className="mt-4 flex items-center justify-center gap-2 rounded-soft bg-white px-4 py-2.5 text-sm font-bold text-brand-900 hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800"><I.Submit className="h-4 w-4" aria-hidden="true" />Submit your manuscript</AppLink>
              <AppLink to={paths.track} className="mt-2 flex items-center justify-center gap-2 rounded-soft border border-white/40 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-800"><I.Track className="h-4 w-4" aria-hidden="true" />Track manuscript</AppLink>
            </section>

            <AwardsCard />

            {toc.length > 1 && (
              <nav aria-label="On this page" className={cx(card, 'hidden p-5 lg:block')}>
                <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-brand-800">On this page</h2>
                <ul className="mt-3 space-y-0.5 border-l border-graphite-200">
                  {toc.map((t) => {
                    const on = t.id === active
                    return (
                      <li key={t.id}>
                        <a href={`#${t.id}`} aria-current={on ? 'location' : undefined}
                          className={cx('-ml-px block border-l-2 py-1.5 pl-3 text-sm leading-snug transition-colors', focusRing,
                            on ? 'border-accent-700 font-semibold text-accent-700' : 'border-transparent text-graphite-700 hover:text-graphite-900')}>{t.label}</a>
                      </li>
                    )
                  })}
                </ul>
              </nav>
            )}

            <section aria-labelledby="vital-h" className={cx(card, 'p-5')}>
              <h2 id="vital-h" className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-800"><I.FactCheck className="h-4 w-4" aria-hidden="true" />Journal at a glance</h2>
              <dl className="mt-3 divide-y divide-graphite-100 text-sm">
                {([['Online ISSN', journal.issnOnline], ['Crossref DOI prefix', journal.doiPrefix], ['Licensing', `Open access, ${journal.licence.name}`], ['Frequency', journal.frequency]] as const).map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 py-2.5"><dt className="text-graphite-600">{k}</dt><dd className="text-right font-semibold tabular-nums text-graphite-800">{v}</dd></div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="help-h" className="rounded-sheet border border-accent-200 bg-accent-50 p-5">
              <h2 id="help-h" className="font-display text-lg font-bold text-accent-900">Need help?</h2>
              <p className="mt-1 text-sm text-graphite-700">The editorial office answers policy and submission questions.</p>
              <p className="mt-3 text-sm"><a className="font-semibold text-accent-800 underline" href={`mailto:${journal.email}`}>{journal.email}</a></p>
              <p className="mt-1 text-sm text-graphite-700">WhatsApp {journal.whatsapp}</p>
            </section>
          </aside>
        </div>
      </Container>
    </div>
  )
}
