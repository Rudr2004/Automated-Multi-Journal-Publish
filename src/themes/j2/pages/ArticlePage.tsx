// Article reading page: title block with author cards, action bar, section tabs, reading column and a sidebar (contents, citation, impact).
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineListAlt, MdOutlinePrint, MdOutlineShare } from 'react-icons/md'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { CITATION_STYLES_WITH_IEEE, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { getScholarMeta } from '../../../core/lib/scholar'
import { AppLink } from '../../../core/router'
import type { ArticleFull } from '../../../core/types'
import { ArticleCard } from '../components/ArticleCard'
import { DataTable, FigureBlock } from '../components/ArticleFigure'
import { Button, buttonClass } from '../components/Button'
import { CiteFlyout, citable } from '../components/CiteFlyout'
import { cx, Container } from '../components/primitives'
import { Avatar, TypePill } from '../components/paperType'
import { useToast } from '../components/Toast'
import { disciplineColor } from '../components/discipline'
import { Book, Check, ChevronRight, Close, Copy, Download, Email, OpenAccess, Quote, Verified } from '../icons'
import { Eye } from '../components/homeIcons'

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join('|')
  useEffect(() => {
    const els = key.split('|').map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver((entries) => {
      const seen = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (seen[0]) setActive(seen[0].target.id)
    }, { rootMargin: '-12% 0px -70% 0px' })
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [key])
  return active
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
}

function ReadingProgress({ target }: { target: React.RefObject<HTMLElement> }) {
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = target.current
      if (!el || !bar.current) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight
      const pct = total <= 0 ? 1 : Math.min(1, Math.max(0, -r.top / total))
      bar.current.style.transform = `scaleX(${pct})`
      bar.current.parentElement?.setAttribute('aria-valuenow', String(Math.round(pct * 100)))
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); if (frame) cancelAnimationFrame(frame) }
  }, [target])
  return (
    <div role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[3px]">
      <div ref={bar} className="h-full origin-left bg-accent-700" style={{ transform: 'scaleX(0)' }} />
    </div>
  )
}

function CopyDoi({ doi }: { doi: string }) {
  const toast = useToast()
  const [done, setDone] = useState(false)
  const run = async () => {
    const ok = await copyText(`https://doi.org/${doi}`)
    if (ok) { setDone(true); setTimeout(() => setDone(false), 1800) }
    toast(ok ? 'DOI link copied' : 'Could not copy the DOI. Select it and copy manually.', ok ? 'success' : 'error')
  }
  return (
    <button type="button" onClick={run} aria-label="Copy DOI link" className="inline-flex shrink-0 items-center gap-1 rounded-chip border border-graphite-300 bg-white px-2 py-1 text-xs font-semibold text-accent-700 hover:bg-accent-50">
      {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}{done ? 'Copied' : 'Copy'}
    </button>
  )
}

function useActions(article: ArticleFull) {
  const toast = useToast()
  const onPdf = (e: MouseEvent) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded`) }
  const share = async () => {
    const url = `https://${journal.domain}${paths.article(article.paperId)}`
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> }
    if (nav.share) { try { await nav.share({ title: article.title, url }); return } catch { /* cancelled: fall back to copy */ } }
    const ok = await copyText(url)
    toast(ok ? 'Article link copied' : 'Could not copy the link', ok ? 'success' : 'error')
  }
  return { onPdf, share }
}

const card = 'rounded-panel border border-graphite-200 bg-white shadow-card'
const sideTitle = 'flex items-center gap-2 font-display text-xs font-bold uppercase tracking-[0.12em] text-brand-900'

function Metric({ label, value, tint, icon: Icon }: { label: string; value: number; tint?: boolean; icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }> }) {
  return (
    <div className={cx('rounded-soft border p-3 text-center', tint ? 'border-accent-200 bg-accent-50' : 'border-graphite-200 bg-graphite-50')}>
      <Icon className="mx-auto mb-1 h-5 w-5 text-accent-700" aria-hidden="true" />
      <dd className="font-display text-2xl font-bold tabular-nums text-brand-900">{formatNumber(value)}</dd>
      <dt className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-graphite-700">{label}</dt>
    </div>
  )
}

function HowToCite({ article }: { article: ArticleFull }) {
  const [style, setStyle] = useState<CitationStyle>('apa')
  const toast = useToast()
  const text = formatCitation(citable(article), style)
  return (
    <section id="how-to-cite" aria-labelledby="cite-h" className={cx(card, 'scroll-mt-24 p-5')}>
      <h2 id="cite-h" className={sideTitle}><Quote className="h-4 w-4" aria-hidden="true" /> Cite this article</h2>
      <p className="mt-2 text-xs text-graphite-700">Select a citation style, then copy the reference.</p>
      <div role="tablist" aria-label="Citation style" className="mt-3 flex flex-wrap gap-1">
        {CITATION_STYLES_WITH_IEEE.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={style === s.id} onClick={() => setStyle(s.id)}
            className={cx('rounded-chip px-2.5 py-1 text-xs font-semibold', style === s.id ? 'bg-brand-800 text-white' : 'bg-brand-50 text-brand-900 hover:bg-brand-100')}>{s.label}</button>
        ))}
      </div>
      <pre role="tabpanel" tabIndex={0} className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-soft border border-graphite-200 bg-graphite-50 p-3 font-mono text-xs leading-relaxed text-graphite-800">{text}</pre>
      <Button variant="outline" className="mt-3 w-full" onClick={async () => { const ok = await copyText(text); toast(ok ? 'Citation copied' : 'Could not copy the citation', ok ? 'success' : 'error') }}>
        <Copy className="h-4 w-4" aria-hidden="true" /> Copy citation
      </Button>
    </section>
  )
}

export function ArticlePage({ article }: { article: ArticleFull }) {
  const { tags, jsonLd } = getScholarMeta(article)
  const { onPdf, share } = useActions(article)
  const doi = doiFor(article.paperId)
  const backdated = article.publishedOnline !== article.publishedAt
  const color = disciplineColor(article.subject)
  const articleRef = useRef<HTMLElement>(null)
  const [tocOpen, setTocOpen] = useState(false)
  const tocRef = useRef<HTMLDivElement>(null)

  const toc = [{ id: 'abstract', label: 'Abstract' }, ...article.sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })), { id: 'references', label: `References (${article.references.length})` }, { id: 'how-to-cite', label: 'How to cite' }]
  const active = useScrollSpy(toc.map((t) => t.id))
  const figureCount = article.sections.filter((s) => s.figure || s.table).length
  const firstFigure = article.sections.find((s) => s.figure || s.table)

  const closeToc = useCallback(() => setTocOpen(false), [])
  useEffect(() => {
    if (!tocOpen) return
    const onDown = (e: globalThis.MouseEvent) => { if (!tocRef.current?.contains(e.target as Node)) closeToc() }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeToc() }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [tocOpen, closeToc])

  const jump = (id: string) => (e: MouseEvent) => { e.preventDefault(); scrollToId(id); closeToc() }
  const tocLinks = () => toc.map((t, i) => (
    <li key={t.id}>
      <a href={`#${t.id}`} onClick={jump(t.id)} aria-current={active === t.id ? 'location' : undefined}
        className={cx('flex items-center justify-between gap-3 border-l-4 px-3 py-2 text-sm', active === t.id ? 'border-brand-800 bg-brand-50 font-semibold text-brand-900' : 'border-transparent text-graphite-800 hover:bg-graphite-50 hover:text-accent-700')}>
        <span>{t.label}</span><span aria-hidden="true" className="font-mono text-[11px] text-graphite-600">{String(i + 1).padStart(2, '0')}</span>
      </a>
    </li>
  ))

  let figNo = 0
  let tabNo = 0
  const tabs = [
    { id: 'abstract', label: 'Abstract & Full Text' },
    ...(firstFigure ? [{ id: firstFigure.id, label: `Figures & Tables (${figureCount})` }] : []),
    { id: 'references', label: `References (${article.references.length})` },
    ...(article.related.length ? [{ id: 'related', label: 'Related Research' }] : []),
  ]
  const pill = 'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider'

  return (
    <div className="bg-brand-50/60">
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={article.abstract.slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <ReadingProgress target={articleRef} />

      <Container className="pb-32 pt-5 lg:pb-16">
        <nav aria-label="Breadcrumb" className="text-sm text-graphite-700">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><AppLink to={paths.home} className="hover:text-accent-700 hover:underline">Home</AppLink></li><li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li><AppLink to={paths.pastIssues} className="hover:text-accent-700 hover:underline">Archives</AppLink></li><li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li><AppLink to={paths.issue(article.volume, article.issue)} className="hover:text-accent-700 hover:underline">Volume {article.volume}, Issue {article.issue}</AppLink></li><li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li aria-current="page" className="break-all font-mono text-xs font-semibold text-graphite-900 sm:text-sm">Article {article.paperId}</li>
          </ol>
        </nav>

        <header className="mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <TypePill type={article.type} />
            <span className={cx(pill, 'border-graphite-200 bg-white text-graphite-800')}>
              <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{article.subject}
            </span>
            {journal.badges.openAccess && <span className={cx(pill, 'border-cta-200 bg-cta-50 text-cta-900')}><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" /> Open Access</span>}
            {journal.badges.peerReviewed && <span className={cx(pill, 'border-graphite-300 bg-white text-graphite-800')}><Verified className="h-3.5 w-3.5" aria-hidden="true" /> Peer Reviewed</span>}
          </div>
          <h1 className="mt-4 max-w-5xl font-display text-3xl font-bold leading-tight tracking-tight text-brand-900 sm:text-4xl lg:text-[2.6rem]">{article.title}</h1>

          <ul aria-label="Authors" className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {article.authorDetails.map((a) => (
              <li key={a.name} className={cx(card, 'flex items-start gap-4 p-4')}>
                <Avatar name={a.name} photo={a.photo} size={56} />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-display text-base font-bold text-graphite-900">
                    {a.name}
                    {a.corresponding && <span className="rounded-chip bg-brand-50 px-2 py-0.5 font-body text-[11px] font-semibold text-brand-900">Corresponding</span>}
                  </p>
                  {a.affiliations.length > 0 && <p className="mt-1 text-sm text-graphite-700">{a.affiliations.map((i) => article.affiliations[i - 1]).filter(Boolean).join('; ')}</p>}
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    {a.orcid && <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noreferrer" aria-label={`ORCID profile of ${a.name}`} className="inline-flex items-center gap-1.5 font-mono text-accent-800 hover:underline"><span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-700 font-body text-[8px] font-bold text-white">iD</span>{a.orcid}</a>}
                    {a.corresponding && a.email && <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1 break-all text-accent-800 hover:underline"><Email className="h-3.5 w-3.5" aria-hidden="true" />{a.email}</a>}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-graphite-200 pt-5">
            <dl className="contents">
              {[['Received', article.received], ['Accepted', article.accepted], ...(backdated ? [['Issue date', article.publishedAt], ['Published online', article.publishedOnline]] : [['Published', article.publishedAt]])].map(([k, v]) => (
                <div key={k} className="rounded-chip border border-graphite-200 bg-white px-3 py-1.5 text-sm"><dt className="inline font-semibold text-graphite-900">{k}: </dt><dd className="inline font-mono text-graphite-800">{formatDate(v)}</dd></div>
              ))}
            </dl>
            <span className="inline-flex items-center rounded-chip border border-brand-200 bg-brand-50 px-3 py-1.5 text-sm text-brand-900">Volume {article.volume}, Issue {article.issue} · Pages {article.pages}</span>
            <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-chip border border-graphite-200 bg-white px-3 py-1.5 text-sm lg:ml-auto">
              <span className="font-mono text-xs text-graphite-800">DOI:</span>
              <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="min-w-0 break-all font-mono text-xs text-accent-800 hover:underline">https://doi.org/{doi}</a>
              <CopyDoi doi={doi} />
            </div>
          </div>
          {backdated && <p className="mt-2 text-xs text-graphite-700">This article was published online on {formatDate(article.publishedOnline)} and assigned to the issue dated {formatDate(article.publishedAt)}.</p>}
        </header>

        {/* Action bar (desktop; phones use the bar fixed at the bottom) */}
        <div className={cx(card, 'mt-6 hidden flex-wrap items-center gap-3 p-3 lg:flex')}>
          <p className="mr-auto flex items-center gap-2 text-sm text-graphite-800"><Book className="h-5 w-5 text-brand-800" aria-hidden="true" /> {journal.shortName} · Vol. {article.volume}, Issue {article.issue} · ISSN {journal.issnOnline}</p>
          <a href={paths.pdf(article.paperId)} download onClick={onPdf} className={buttonClass('primary')}><Download className="h-4 w-4" aria-hidden="true" /> Download PDF</a>
          <CiteFlyout article={article} />
          <Button variant="outline" onClick={share}><MdOutlineShare className="h-4 w-4" aria-hidden="true" /> Share</Button>
          <Button variant="outline" onClick={() => window.print()}><MdOutlinePrint className="h-4 w-4" aria-hidden="true" /> Print</Button>
        </div>

        <nav aria-label="Article sections" className="mt-6 flex flex-wrap gap-x-1 border-b border-graphite-300">
          {tabs.map((t, i) => (
            <a key={t.id} href={`#${t.id}`} onClick={jump(t.id)} className={cx('-mb-px border-b-2 px-4 py-3 text-sm font-semibold', i === 0 ? 'border-brand-800 text-brand-900' : 'border-transparent text-graphite-800 hover:text-accent-700')}>{t.label}</a>
          ))}
        </nav>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start xl:gap-8">
          <article ref={articleRef} className="min-w-0">
            <section id="abstract" aria-labelledby="abstract-h" className={cx(card, 'scroll-mt-24 p-6 sm:p-8')}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 id="abstract-h" className="font-display text-2xl font-bold text-brand-900">Abstract</h2>
                <span className="rounded-chip bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-900">Scholarly Overview</span>
              </div>
              <p className="mt-4 text-base leading-[1.8] text-graphite-900 sm:text-[1.05rem]">{article.abstract}</p>
              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-graphite-200 pt-4">
                <span className="text-sm font-semibold text-graphite-900">Keywords:</span>
                <ul aria-label="Keywords" className="flex flex-wrap gap-2">
                  {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-block rounded-chip bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-900 ring-1 ring-inset ring-brand-200 hover:bg-brand-100">{k}</AppLink></li>)}
                </ul>
              </div>
            </section>

            <div className={cx(card, 'mt-6 p-6 sm:p-8')}>
              {article.sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className={cx('scroll-mt-24', i > 0 && 'mt-10')}>
                  <h2 id={`${s.id}-h`} className="border-b border-graphite-200 pb-2 font-display text-2xl font-bold text-brand-900">{i + 1}. {s.title}</h2>
                  {s.paragraphs.map((p, j) => <p key={j} className="mt-4 max-w-[75ch] text-base leading-[1.8] text-graphite-900">{p}</p>)}
                  {s.table && <DataTable table={s.table} number={++tabNo} />}
                  {s.figure && <FigureBlock figure={s.figure} number={++figNo} />}
                </section>
              ))}
            </div>

            <section id="references" aria-labelledby="refs-h" className={cx(card, 'mt-6 scroll-mt-24 p-6 sm:p-8')}>
              <h2 id="refs-h" className="border-b border-graphite-200 pb-2 font-display text-2xl font-bold text-brand-900">References</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-graphite-800 marker:font-semibold marker:text-accent-800">
                {article.references.map((r, i) => (
                  <li key={i} id={`ref-${i + 1}`} className="pl-1">{r.text}{r.doi && <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="break-all text-accent-800 hover:underline">https://doi.org/{r.doi}</a></>}</li>
                ))}
              </ol>
            </section>

            {article.related.length > 0 && (
              <section id="related" aria-labelledby="related-h" className="mt-10 scroll-mt-24">
                <h2 id="related-h" className="border-b-2 border-brand-800 pb-2 font-display text-lg font-bold uppercase tracking-wide text-brand-900">Related research</h2>
                <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                  {article.related.slice(0, 4).map((r) => <li key={r.paperId} className="flex"><div className="w-full min-w-0"><ArticleCard article={r} /></div></li>)}
                </ul>
              </section>
            )}
          </article>

          {/* Sidebar: contents, citation, impact, article facts */}
          <aside aria-label="Article tools" className="space-y-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-1">
            <nav aria-label="Jump to section" className={cx(card, 'hidden overflow-hidden lg:block')}>
              <h2 className={cx(sideTitle, 'p-5 pb-3')}><MdOutlineListAlt className="h-4 w-4" aria-hidden="true" /> Article contents</h2>
              <ul className="pb-3">{tocLinks()}</ul>
            </nav>
            <HowToCite article={article} />
            <section aria-labelledby="impact-h" className={cx(card, 'p-5')}>
              <h2 id="impact-h" className={sideTitle}>Article impact</h2>
              <dl className="mt-3 grid grid-cols-2 gap-3">
                <Metric label="Views" value={article.views} icon={Eye} /><Metric label="Downloads" value={article.downloads} icon={Download} />
                <Metric label="Citations" value={article.citations} tint icon={Quote} />
              </dl>
            </section>
            <section aria-labelledby="facts-h" className={cx(card, 'p-5')}>
              <h2 id="facts-h" className={sideTitle}>About this article</h2>
              <dl className="mt-3 divide-y divide-graphite-200 text-sm">
                <div className="flex justify-between gap-4 py-2"><dt className="text-graphite-700">Journal</dt><dd className="text-right font-semibold text-graphite-900">{journal.shortName}</dd></div>
                <div className="flex justify-between gap-4 py-2"><dt className="text-graphite-700">Online ISSN</dt><dd className="font-mono font-semibold text-graphite-900">{journal.issnOnline}</dd></div>
                <div className="flex justify-between gap-4 py-2"><dt className="text-graphite-700">Discipline</dt><dd className="text-right font-semibold text-graphite-900">{article.subject}</dd></div>
                <div className="flex justify-between gap-4 py-2"><dt className="text-graphite-700">Licence</dt><dd className="text-right font-semibold"><a href={journal.licence.url} target="_blank" rel="noreferrer" className="text-accent-800 hover:underline">{journal.licence.name}</a></dd></div>
              </dl>
            </section>
          </aside>
        </div>
      </Container>

      {/* Floating contents menu (the sidebar contents card is desktop only) */}
      <div ref={tocRef} className="fixed bottom-24 right-4 z-40 lg:hidden">
        {tocOpen && (
          <div role="dialog" aria-label="Contents" className="absolute bottom-full right-0 mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-panel border border-graphite-200 bg-white p-2 shadow-pop motion-safe:animate-fade-in">
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="font-display text-sm font-semibold text-graphite-800">Contents</p>
              <button type="button" onClick={closeToc} aria-label="Close contents" className="rounded-chip p-1 text-graphite-600 hover:bg-graphite-100"><Close className="h-4 w-4" aria-hidden="true" /></button>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto">{tocLinks()}</ul>
          </div>
        )}
        <button type="button" aria-expanded={tocOpen} onClick={() => setTocOpen((v) => !v)} className="inline-flex items-center gap-2 rounded-full bg-brand-800 px-4 py-2.5 text-sm font-semibold text-white shadow-pop hover:bg-brand-900">
          <MdOutlineListAlt className="h-5 w-5" aria-hidden="true" /> Contents
        </button>
      </div>

      {/* Mobile / tablet action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-graphite-200 bg-white/95 p-3 backdrop-blur lg:hidden">
        <a href={paths.pdf(article.paperId)} download onClick={onPdf} className={cx(buttonClass('primary'), 'min-w-0 flex-1')}><Download className="h-4 w-4" aria-hidden="true" /> Download PDF</a>
        <CiteFlyout article={article} />
        <Button variant="outline" onClick={share} aria-label="Share this article"><MdOutlineShare className="h-4 w-4" aria-hidden="true" /></Button>
      </div>
    </div>
  )
}
