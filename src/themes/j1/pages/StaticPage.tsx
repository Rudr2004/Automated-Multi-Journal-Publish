import { useEffect, useState } from 'react'
import { AlertTriangle, BadgeCheck, ClipboardCheck, Eye, Info, Mail, Printer, Scale, ShieldCheck } from '../components/uiIcons'
import type { StaticPageData } from '../../../mock-data/journals/j1'
import { inputClass } from '../components/form'
import { Button, ButtonLink } from '../components/Button'
import { CrumbBar } from '../components/CrumbBar'
import { AwardsCard } from '../components/AwardsCard'
import { Container, Panel } from '../components/primitives'
import { TrackForm } from '../components/TrackForm'
import { AppLink, useRouter } from '../../../core/router'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { journal } from '../../../config/journals/j1'
import { formatDate } from '../../../core/lib/format'
import { StaticBlocks, SectionTitle, blockTitle, type BlockActions } from './static/StaticBlocks'

const principles = [
  { icon: ShieldCheck, title: 'Integrity', text: 'Honest, rigorous research and reporting.' },
  { icon: Eye, title: 'Transparency', text: 'Open processes and clear decisions.' },
  { icon: Scale, title: 'Fairness', text: 'Impartial evaluation on merit alone.' },
  { icon: ClipboardCheck, title: 'Accountability', text: 'Clear responsibility at every stage.' },
  { icon: BadgeCheck, title: 'Compliance', text: 'Aligned with COPE and legal standards.' },
]

/** Highlights the table-of-contents entry of the section currently in view. */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')
  const key = ids.join('|')
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (hit) setActive(hit.target.id)
    }, { rootMargin: '-90px 0px -65% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key]) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}

/** One template for every static page. `sidebar` lists the pages of the same group. */
export function StaticPage({ page, sidebar, allPages, actions }: { page: StaticPageData; sidebar: StaticPageData[]; allPages: StaticPageData[]; actions: BlockActions }) {
  const { navigate, pathname } = useRouter()
  const g = staticGroups[page.group]
  const related = page.related.map((s) => allPages.find((p) => p.slug === s)).filter(Boolean) as StaticPageData[]

  // Numbered outline: written sections first, then titled content blocks (matches StaticBlocks numbering).
  const outline: { id: string; label: string; num?: string }[] = page.sections.map((s, i) => ({ id: `sec-${i + 1}`, label: s.heading, num: `${i + 1}.0` }))
  ;(page.blocks ?? []).filter((b) => blockTitle(b)).forEach((b, i) => {
    const n = page.sections.length + i + 1
    outline.push({ id: `sec-${n}`, label: blockTitle(b) as string, num: `${n}.0` })
  })
  if (page.principles) outline.unshift({ id: 'in-brief', label: 'Our ethical principles' })
  const active = useActiveSection(outline.map((o) => o.id))
  const wa = `https://wa.me/${journal.whatsapp.replace(/\D/g, '')}`

  const meta: [string, string][] = [
    ['Last updated', formatDate(page.updated)],
    ['Journal', `${journal.shortName} · ISSN ${journal.issnOnline}`],
    ['Licence', journal.licence.name],
    ['Contact', journal.email],
  ]

  return (
    <>
      <CrumbBar items={[{ label: 'Home', to: paths.home }, { label: g.label, to: g.to }, { label: page.title }]} />
      <Container className="grid gap-8 py-8 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_280px]">
        {/* LEFT: in-page outline + directory of the same group */}
        <div className="space-y-5 lg:sticky lg:top-4 lg:self-start xl:max-h-[calc(100vh-2rem)] xl:overflow-y-auto">
          <div className="lg:hidden">
            <label htmlFor="static-nav" className="mb-1.5 block text-sm font-semibold text-navy">{g.label} pages</label>
            <select id="static-nav" className={inputClass()} value={pathname} onChange={(e) => navigate(e.target.value)}>
              {sidebar.map((p) => <option key={p.slug} value={staticPath(p.group, p.slug)}>{p.title}</option>)}
            </select>
          </div>

          {outline.length > 1 && (
            <nav aria-label="On this page" className="hidden border border-line bg-white lg:block">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <h2 className="font-serif text-[1.0625rem] font-semibold text-navy">On this page</h2>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Quick jump</span>
              </div>
              <ul className="py-2">
                {outline.map((o) => {
                  const on = active === o.id
                  return (
                    <li key={o.id}>
                      <a href={`#${o.id}`} aria-current={on ? 'location' : undefined}
                        onClick={(e) => { e.preventDefault(); document.getElementById(o.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState(history.state, '', `#${o.id}`) }}
                        className={`flex gap-2 border-l-[3px] px-4 py-1.5 text-[13px] leading-snug ${on ? 'border-scholar bg-scholar-soft font-semibold text-scholar' : 'border-transparent text-ink hover:bg-paper hover:text-navy'}`}>
                        {o.num && <span className="tabular-nums text-ink-muted">{o.num}</span>}{o.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          )}

          <nav aria-label={`${g.label} pages`} className="hidden border border-line bg-white lg:block">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <h2 className="font-serif text-[1.0625rem] font-semibold text-navy">{g.label}</h2>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{sidebar.length} pages</span>
            </div>
            <ul className="py-2">
              {sidebar.map((p) => {
                const on = p.slug === page.slug
                return (
                  <li key={p.slug}>
                    <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                      className={`block border-l-[3px] px-4 py-1.5 text-[13px] ${on ? 'border-scholar bg-scholar-soft font-semibold text-scholar' : 'border-transparent text-ink hover:bg-paper hover:text-navy'}`}>{p.title}</AppLink>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        {/* CENTRE: the document */}
        <article className="min-w-0 border border-line bg-white p-5 sm:p-8">
          <header className="border-b border-line pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center rounded-sm border border-line bg-paper px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-scholar">{g.label}</span>
              <span className="text-xs tabular-nums text-ink-muted">{journal.shortName} · {page.slug}</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-navy sm:text-[2.5rem]">{page.title}</h1>
            <p className="mt-3 max-w-prose text-[1.0625rem] leading-relaxed text-ink-muted">{page.intro}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 border border-line bg-paper p-4 sm:grid-cols-4">
              {meta.map(([k, v]) => (
                <div key={k} className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{k}</dt><dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-navy">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 flex justify-end print:hidden">
              <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />Print this page</Button>
            </div>
          </header>

          <div className="space-y-8 pt-8">
            {page.principles && (
              <section id="in-brief" aria-labelledby="principles-h" className="scroll-mt-24 border border-line bg-paper p-5">
                <h2 id="principles-h" className="font-serif text-xl font-semibold text-navy">Our Ethical Principles</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {principles.map(({ icon: Icon, title, text }, i) => (
                    <li key={title} className="flex items-start gap-3 border border-line bg-white p-3.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-scholar-soft text-xs font-bold text-scholar">{i + 1}</span>
                      <div><p className="flex items-center gap-1.5 text-sm font-bold text-navy"><Icon className="h-4 w-4 text-scholar" strokeWidth={1.75} aria-hidden />{title}</p><p className="mt-0.5 text-sm text-ink-muted">{text}</p></div>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {page.sections.map((s, i) => (
              <section key={s.heading} id={`sec-${i + 1}`} className="scroll-mt-24 space-y-3 border-t border-line pt-6 first:border-t-0 first:pt-0">
                <SectionTitle n={i + 1}>{s.heading}</SectionTitle>
                {s.paragraphs?.map((p, k) => <p key={k} className="text-base leading-[1.75] text-ink">{p}</p>)}
                {s.list && (
                  <ul className="list-disc space-y-2 pl-6 text-base leading-[1.75] text-ink marker:text-ink-muted">{s.list.map((x) => <li key={x}>{x}</li>)}</ul>
                )}
                {s.callout && (
                  <aside role="note" className={`flex gap-3 border border-l-4 p-4 ${s.callout.tone === 'warn' ? 'border-[#E4D3A8] border-l-[#B8892B] bg-paper' : 'border-[#C4D9EE] border-l-scholar bg-scholar-soft'}`}>
                    {s.callout.tone === 'warn' ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#8A6414]" aria-hidden /> : <Info className="mt-0.5 h-5 w-5 shrink-0 text-scholar" aria-hidden />}
                    <div><p className="text-sm font-bold text-navy">{s.callout.title}</p><p className="mt-0.5 text-sm leading-relaxed text-ink">{s.callout.text}</p></div>
                  </aside>
                )}
              </section>
            ))}

            {page.blocks && <StaticBlocks blocks={page.blocks} actions={actions} startNumber={page.sections.length + 1} />}
          </div>

          {related.length > 0 && (
            <section className="mt-6 border-t border-line pt-6" aria-labelledby="related-h">
              <h2 id="related-h" className="font-serif text-xl font-semibold text-navy">Related {page.group === 'policies' ? 'journal policies' : 'pages'}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="flex items-center justify-between gap-3 border border-line bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors hover:border-scholar hover:text-scholar">{r.title}<span aria-hidden>→</span></AppLink></li>
                ))}
              </ul>
            </section>
          )}

          <footer className="mt-8 border-t border-line pt-4 text-xs text-ink-muted">
            Last updated: {formatDate(page.updated)}. This page follows the <a href="https://publicationethics.org/guidance" target="_blank" rel="noreferrer" className="font-semibold text-scholar underline">COPE guidelines</a>.
          </footer>
        </article>

        {/* RIGHT: actions */}
        <aside aria-label="Journal actions" className="space-y-5 lg:col-start-2 xl:sticky xl:top-4 xl:col-start-auto xl:self-start">
          <section className="border border-navy border-t-[3px] bg-white p-4">
            <h2 className="font-serif text-lg font-semibold text-navy">Submit your manuscript</h2>
            <p className="mt-1 text-sm text-ink-muted">Free to submit. The APC is payable only after acceptance. No account needed.</p>
            <ButtonLink to={paths.submit} variant="submit" size="lg" className="mt-3 w-full">Submit Manuscript</ButtonLink>
            <p className="mt-2 text-center text-[11px] tabular-nums text-ink-muted">DOI {journal.doiPrefix} · {journal.licence.name}</p>
          </section>
          <Panel title="Track manuscript status" aside="Author portal"><TrackForm idPrefix="static-trk" submitLabel="Check status" /></Panel>
          <Panel title="Editorial office" tone="paper">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-scholar" aria-hidden /><a href={`mailto:${journal.email}`} className="break-all font-semibold text-scholar hover:underline">{journal.email}</a></li>
              <li><a href={wa} target="_blank" rel="noreferrer" className="font-semibold text-oa hover:underline">WhatsApp {journal.whatsapp}</a></li>
              <li><AppLink to={paths.about('contact')} className="font-semibold text-scholar hover:underline">Contact form →</AppLink></li>
            </ul>
          </Panel>
          <AwardsCard />
        </aside>
      </Container>
    </>
  )
}
