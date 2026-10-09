import { useEffect, useState } from 'react'
import { BadgeCheck, ClipboardCheck, Eye, Mail, Printer, Scale, ShieldCheck } from '../components/uiIcons'
import { MdOutlineArrowForward, MdOutlinePictureAsPdf, MdOutlineRule, MdOutlineToc, MdOutlineVerifiedUser } from 'react-icons/md'
import type { StaticPageData } from '../../../mock-data/journals/j1'
import { inputClass } from '../components/form'
import { Button, ButtonLink } from '../components/Button'
import { CrumbBar } from '../components/CrumbBar'
import { Container } from '../components/primitives'
import { StickyRail } from '../components/StickyRail'
import { useToast } from '../components/Toast'
import { AppLink, useRouter } from '../../../core/router'
import { paths, staticGroups, staticPath } from '../../../config/routes'
import { journal } from '../../../config/journals/j1'
import { formatDate } from '../../../core/lib/format'
import { BlockView, Callout, StaticBlocks, SectionTitle, blockTitle, type BlockActions } from './static/StaticBlocks'
import { StaticIcon } from './static/staticIcons'
import { PolicyDirectory, PolicyRightRail } from './static/StaticRails'
import { downloadPolicyPdf } from './static/policyPdf'

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

/** Related pages as an even-sized list (2-column grid): the page's own links first, topped up from its group. */
function relatedPages(page: StaticPageData, all: StaticPageData[]) {
  const picked: StaticPageData[] = []
  const add = (p?: StaticPageData) => { if (p && p.slug !== page.slug && !picked.includes(p)) picked.push(p) }
  page.related.forEach((s) => add(all.find((p) => p.slug === s)))
  all.filter((p) => p.group === page.group).forEach((p) => picked.length < 4 && add(p))
  const list = picked.slice(0, 4)
  return list.length % 2 ? list.slice(0, -1) : list
}

/** One template for every static page. `sidebar` lists the pages of the same group. */
export function StaticPage({ page, sidebar, allPages, actions }: { page: StaticPageData; sidebar: StaticPageData[]; allPages: StaticPageData[]; actions: BlockActions }) {
  const { navigate, pathname } = useRouter()
  const toast = useToast()
  const [vote, setVote] = useState<'yes' | 'no' | null>(null)
  const g = staticGroups[page.group]
  const related = relatedPages(page, allPages)
  const meta = page.meta ?? {}
  const isPolicy = page.group === 'policies'

  const blocks = page.blocks ?? []
  const brief = blocks.find((b) => b.type === 'in-brief')
  const faq = blocks.find((b) => b.type === 'faq-accordion')
  const rest = blocks.filter((b) => b !== brief && b !== faq)

  // Numbered outline: written sections first, then titled content blocks (matches StaticBlocks numbering).
  const outline: { id: string; label: string; num?: string }[] = page.sections.map((s, i) => ({ id: `sec-${i + 1}`, label: s.heading, num: `${i + 1}.0` }))
  rest.filter((b) => blockTitle(b)).forEach((b, i) => {
    const n = page.sections.length + i + 1
    outline.push({ id: `sec-${n}`, label: blockTitle(b) as string, num: `${n}.0` })
  })
  if (page.principles) outline.unshift({ id: 'in-brief', label: 'Our ethical principles' })
  if (brief && 'title' in brief) outline.unshift({ id: 'in-brief', label: 'In Brief', num: '' })
  if (faq && 'title' in faq) outline.push({ id: 'faq-section', label: 'Frequently Asked Questions' })
  const active = useActiveSection(outline.map((o) => o.id))

  const policyRef = meta.ref ?? `${journal.shortName}-${isPolicy ? 'POL' : page.group === 'about' ? 'ABT' : 'AUT'}-${page.slug.toUpperCase()}`
  const metaItems: [string, string][] = [
    ['Last updated', formatDate(page.updated)],
    ['Version', `v${meta.version ?? '1.0'}`],
    ['Authority', meta.authority ?? 'Editorial Office'],
    ['Applies to', meta.appliesTo ?? 'Authors, reviewers, editors'],
  ]

  const vote_ = (v: 'yes' | 'no') => {
    setVote(v)
    toast(v === 'yes' ? 'Thank you for your feedback.' : 'Thanks. Please tell the editorial office what was missing.')
  }

  return (
    <>
      <CrumbBar items={[{ label: 'Home', to: paths.home }, { label: g.label, to: g.to }, { label: page.title }]} />
      <Container className="grid gap-8 py-8 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[260px_minmax(0,1fr)_300px]">
        {/* LEFT: in-page outline + directory of the same group */}
        <StickyRail as="div" className="space-y-5 print:hidden">
          <div className="lg:hidden">
            <label htmlFor="static-nav" className="mb-1.5 block text-sm font-semibold text-navy">{g.label} pages</label>
            <select id="static-nav" className={inputClass()} value={pathname} onChange={(e) => navigate(e.target.value)}>
              {sidebar.map((p) => <option key={p.slug} value={staticPath(p.group, p.slug)}>{p.title}</option>)}
            </select>
          </div>

          {outline.length > 1 && (
            <nav aria-label="On this page" className="hidden border border-line bg-white lg:block">
              <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
                <h2 className="flex items-center gap-2 font-serif text-[1.0625rem] font-semibold text-navy"><MdOutlineToc className="h-5 w-5 text-scholar" aria-hidden />On this page</h2>
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

          <PolicyDirectory page={page} pages={sidebar} label={g.label} />

          {isPolicy && journal.badges.cope && (
            <div className="hidden items-start gap-3 border border-line bg-paper p-3.5 lg:flex">
              <MdOutlineVerifiedUser className="mt-0.5 h-5 w-5 shrink-0 text-scholar" aria-hidden />
              <div><p className="text-sm font-bold text-navy">Follows COPE core practices</p><p className="mt-0.5 text-xs leading-relaxed text-ink-muted">Principles of transparency and good publishing practice.</p></div>
            </div>
          )}
        </StickyRail>

        {/* CENTRE: the document */}
        <article className="min-w-0 border border-line bg-white p-5 sm:p-8">
          <header className="border-b border-line pb-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-scholar">
                <MdOutlineRule className="h-4 w-4" aria-hidden />{meta.category ?? g.label}
              </span>
              <span className="text-xs tabular-nums text-ink-muted">Ref: {policyRef}</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-navy sm:text-[2.5rem]">{page.title}</h1>
            <p className="mt-3 max-w-prose text-[1.0625rem] leading-relaxed text-ink-muted">{page.intro}</p>
            <dl className="mt-5 grid grid-cols-2 gap-4 border border-line bg-paper p-4 sm:grid-cols-4">
              {metaItems.map(([k, v]) => (
                <div key={k} className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">{k}</dt><dd className="mt-0.5 break-words text-sm font-semibold tabular-nums text-navy">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 print:hidden">
              <span className="text-xs tabular-nums text-ink-muted">{isPolicy ? 'Policy reference' : 'Reference'}: {policyRef} · DOI prefix {journal.doiPrefix}</span>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />Print this policy</Button>
                <Button size="sm" variant="primary" onClick={() => downloadPolicyPdf(page)}><MdOutlinePictureAsPdf className="h-4 w-4" aria-hidden />Download PDF</Button>
              </div>
            </div>
          </header>

          <div className="space-y-8 pt-8">
            {brief && <BlockView b={brief} actions={actions} />}
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
              <section key={s.heading} id={`sec-${i + 1}`} className="scroll-mt-24 space-y-4 border-t border-line pt-6 first:border-t-0 first:pt-0">
                <SectionTitle n={i + 1} badge={s.badge}>{s.heading}</SectionTitle>
                {s.paragraphs?.map((p, k) => <p key={k} className="text-base leading-[1.75] text-ink">{p}</p>)}
                {s.blocks?.map((b, k) => <BlockView key={k} b={b} actions={actions} />)}
                {s.list && (
                  <ul className="list-disc space-y-2 pl-6 text-base leading-[1.75] text-ink marker:text-ink-muted">{s.list.map((x) => <li key={x}>{x}</li>)}</ul>
                )}
                {s.callout && <Callout tone={s.callout.tone} title={s.callout.title} text={s.callout.text} />}
              </section>
            ))}

            {rest.length > 0 && <StaticBlocks blocks={rest} actions={actions} startNumber={page.sections.length + 1} />}
            {faq && <section className="border-t border-line pt-6"><BlockView b={faq} actions={actions} /></section>}
          </div>

          {related.length > 0 && (
            <section className="mt-8 border-t border-line pt-6" aria-labelledby="related-h">
              <h2 id="related-h" className="font-serif text-xl font-semibold text-navy">Related {isPolicy ? 'Journal Policies' : 'Pages'}</h2>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <AppLink to={staticPath(r.group, r.slug)} className="flex items-center justify-between gap-3 border border-line bg-white px-4 py-3 text-sm font-semibold text-navy transition-colors hover:border-scholar hover:text-scholar">
                      <span className="flex min-w-0 items-center gap-2.5"><StaticIcon name={r.slug} className="h-5 w-5 shrink-0 text-scholar" aria-hidden />{r.title}</span>
                      <MdOutlineArrowForward className="h-4 w-4 shrink-0" aria-hidden />
                    </AppLink>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="mt-6 flex flex-col gap-3 border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <div className="min-w-0">
              <p className="flex items-center gap-2 font-serif text-lg font-semibold text-navy"><Mail className="h-5 w-5 text-scholar" aria-hidden />Questions, complaints or policy appeals?</p>
              <p className="mt-1 text-sm text-ink-muted">Write to the editorial office at <a href={`mailto:${journal.email}`} className="break-all font-semibold text-scholar hover:underline">{journal.email}</a>. We aim to reply within two working days.</p>
            </div>
            <ButtonLink to={paths.about('contact')} variant="primary" className="self-start sm:self-auto">Contact the Editorial Office</ButtonLink>
          </div>

          <footer className="mt-6 flex flex-col gap-3 border-t border-line pt-4 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between print:hidden">
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Was this page helpful?">
              <span className="text-sm font-semibold text-navy">Was this {isPolicy ? 'policy' : 'page'} helpful?</span>
              {(['yes', 'no'] as const).map((v) => (
                <button key={v} type="button" aria-pressed={vote === v} onClick={() => vote_(v)} disabled={vote !== null}
                  className={`h-8 rounded border px-3 text-sm font-semibold transition-colors disabled:cursor-default ${vote === v ? 'border-scholar bg-scholar-soft text-scholar' : 'border-line bg-white text-navy hover:border-scholar disabled:opacity-60'}`}>
                  {v === 'yes' ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
            <p>
              Last updated: {formatDate(page.updated)}. {journal.badges.cope ? <>This page follows the <a href="https://publicationethics.org/guidance" target="_blank" rel="noreferrer" className="font-semibold text-scholar underline">COPE guidelines</a>.</> : null}
            </p>
          </footer>
        </article>

        {/* RIGHT: actions */}
        <StickyRail label="Journal actions" className="space-y-5 lg:col-start-2 xl:col-start-auto print:hidden"><PolicyRightRail /></StickyRail>
      </Container>
    </>
  )
}
