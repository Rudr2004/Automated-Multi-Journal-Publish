import { AlertTriangle, BadgeCheck, ClipboardCheck, Eye, Info, Scale, ShieldCheck } from '../components/uiIcons'
import type { StaticPageData } from '../../../mock-data/journals/j1'
import { inputClass } from '../components/form'
import { PageHeader } from '../components/PageHeader'
import { Container } from '../components/primitives'
import { AppLink, useRouter } from '../../../core/router'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { StaticBlocks, type BlockActions } from './static/StaticBlocks'

const principles = [
  { icon: ShieldCheck, title: 'Integrity', text: 'Honest, rigorous research and reporting.' },
  { icon: Eye, title: 'Transparency', text: 'Open processes and clear decisions.' },
  { icon: Scale, title: 'Fairness', text: 'Impartial evaluation on merit alone.' },
  { icon: ClipboardCheck, title: 'Accountability', text: 'Clear responsibility at every stage.' },
  { icon: BadgeCheck, title: 'Compliance', text: 'Aligned with COPE and legal standards.' },
]

/** One template for every static page. `sidebar` lists the pages of the same group. */
export function StaticPage({ page, sidebar, allPages, actions }: { page: StaticPageData; sidebar: StaticPageData[]; allPages: StaticPageData[]; actions: BlockActions }) {
  const { navigate, pathname } = useRouter()
  const g = staticGroups[page.group]
  const related = page.related.map((s) => allPages.find((p) => p.slug === s)).filter(Boolean) as StaticPageData[]
  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', to: paths.home }, { label: g.label, to: g.to }, { label: page.title }]} title={page.title} subtitle={page.intro} />
      <Container className="mt-8 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Mobile: dropdown */}
        <div className="lg:hidden">
          <label htmlFor="static-nav" className="mb-1.5 block text-sm font-medium">{g.label} pages</label>
          <select id="static-nav" className={inputClass()} value={pathname} onChange={(e) => navigate(e.target.value)}>
            {sidebar.map((p) => <option key={p.slug} value={staticPath(p.group, p.slug)}>{p.title}</option>)}
          </select>
        </div>
        {/* Desktop: sticky list */}
        <nav aria-label={`${g.label} pages`} className="hidden lg:block">
          <div className="sticky top-20 rounded-card border border-line bg-white p-3">
            <h2 className="px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-wider text-ink-muted">{g.label}</h2>
            <ul>
              {sidebar.map((p) => {
                const on = p.slug === page.slug
                return (
                  <li key={p.slug}>
                    <AppLink to={staticPath(p.group, p.slug)} aria-current={on ? 'page' : undefined}
                      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${on ? 'bg-navy font-semibold text-white' : 'text-ink hover:bg-mist'}`}>{p.title}</AppLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        <article className="min-w-0 max-w-3xl">
          {page.principles && (
            <section aria-labelledby="principles-h" className="mb-10">
              <h2 id="principles-h" className="font-serif text-2xl font-semibold text-navy">Our Ethical Principles</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {principles.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="rounded-card border border-line bg-mist p-4">
                    <Icon className="h-6 w-6 text-navy-500" strokeWidth={1.5} aria-hidden />
                    <h3 className="mt-2 font-semibold text-navy">{title}</h3>
                    <p className="mt-0.5 text-sm text-ink-muted">{text}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {page.sections.map((s) => (
            <section key={s.heading} className="mb-8">
              <h2 className="font-serif text-2xl font-semibold text-navy">{s.heading}</h2>
              {s.paragraphs?.map((p, i) => <p key={i} className="mt-3 text-[1.0625rem] leading-[1.7]">{p}</p>)}
              {s.list && (
                <ul className="mt-3 list-disc space-y-2 pl-6 text-[1.0625rem] leading-[1.7] marker:text-navy-500">{s.list.map((x) => <li key={x}>{x}</li>)}</ul>
              )}
              {s.callout && (
                <aside role="note" className={`mt-4 flex gap-3 rounded-card border p-4 ${s.callout.tone === 'warn' ? 'border-gold/40 bg-gold-soft' : 'border-navy-200 bg-navy-50'}`}>
                  {s.callout.tone === 'warn' ? <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-gold-dark" aria-hidden /> : <Info className="mt-0.5 h-5 w-5 shrink-0 text-navy-500" aria-hidden />}
                  <div><p className="font-semibold text-navy">{s.callout.title}</p><p className="mt-0.5 text-sm">{s.callout.text}</p></div>
                </aside>
              )}
            </section>
          ))}

          {page.blocks && <StaticBlocks blocks={page.blocks} actions={actions} />}

          <p className="border-t border-line pt-4 text-sm text-ink-muted">Last updated: {formatDate(page.updated)}. This page follows the <a href="https://publicationethics.org/guidance" target="_blank" rel="noreferrer" className="text-navy-600 underline">COPE guidelines</a>.</p>

          {related.length > 0 && (
            <section className="mt-8" aria-labelledby="related-h">
              <h2 id="related-h" className="font-serif text-xl font-semibold text-navy">Related pages</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}><AppLink to={staticPath(r.group, r.slug)} className="block rounded-card border border-line bg-white p-4 text-sm font-semibold text-navy transition-colors hover:border-navy">{r.title} →</AppLink></li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </Container>
    </>
  )
}
