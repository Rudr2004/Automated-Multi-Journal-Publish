// Article reading page: sticky tools rail, reading column, progress bar, floating contents menu and a mobile action bar.
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineListAlt, MdOutlineShare } from 'react-icons/md'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { CITATION_STYLES_WITH_IEEE, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { getScholarMeta } from '../../../core/lib/scholar'
import { AppLink } from '../../../core/router'
import type { ArticleFull, AuthorDetail } from '../../../core/types'
import { ArticleCard } from '../components/ArticleCard'
import { DataTable, FigureBlock } from '../components/ArticleFigure'
import { Button, buttonClass } from '../components/Button'
import { CiteFlyout, citable } from '../components/CiteFlyout'
import { cx, Container, Tag } from '../components/primitives'
import { useToast } from '../components/Toast'
import { disciplineColor } from '../components/discipline'
import { Check, Close, Copy, Download, Email, OpenAccess, Verified } from '../icons'

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

function Portrait({ author }: { author: AuthorDetail }) {
  const initials = author.name.replace(/^(Dr|Prof)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  return author.photo
    ? <img src={author.photo} alt="" loading="lazy" className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white" />
    : <span aria-hidden="true" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-800 ring-2 ring-white">{initials}</span>
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

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="text-center"><dd className="font-display text-lg font-semibold tabular-nums text-graphite-800">{formatNumber(value)}</dd><dt className="text-[11px] uppercase tracking-wide text-graphite-600">{label}</dt></div>
}

function HowToCite({ article }: { article: ArticleFull }) {
  const [style, setStyle] = useState<CitationStyle>('apa')
  const toast = useToast()
  const text = formatCitation(citable(article), style)
  return (
    <section id="how-to-cite" aria-labelledby="cite-h" className="mt-12 scroll-mt-24 rounded-panel border border-accent-200 bg-accent-50 p-5">
      <h2 id="cite-h" className="font-display text-xl font-semibold text-graphite-800">How to cite this article</h2>
      <div role="tablist" aria-label="Citation style" className="mt-3 flex flex-wrap gap-1">
        {CITATION_STYLES_WITH_IEEE.map((s) => (
          <button key={s.id} type="button" role="tab" aria-selected={style === s.id} onClick={() => setStyle(s.id)}
            className={cx('rounded-chip px-2.5 py-1 text-xs font-semibold', style === s.id ? 'bg-accent-700 text-white' : 'bg-white text-graphite-700 ring-1 ring-inset ring-graphite-300 hover:bg-graphite-100')}>{s.label}</button>
        ))}
      </div>
      <pre role="tabpanel" tabIndex={0} className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-soft bg-white p-3 font-body text-sm leading-relaxed text-graphite-700">{text}</pre>
      <Button variant="secondary" className="mt-3" onClick={async () => { const ok = await copyText(text); toast(ok ? 'Citation copied' : 'Could not copy the citation', ok ? 'success' : 'error') }}>
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

  const toc = [{ id: 'abstract', label: 'Abstract' }, ...article.sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })), { id: 'references', label: 'References' }, { id: 'how-to-cite', label: 'How to cite' }]
  const active = useScrollSpy(toc.map((t) => t.id))

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
  const tocLinks = (cls: string) => toc.map((t) => (
    <li key={t.id}>
      <a href={`#${t.id}`} onClick={jump(t.id)} aria-current={active === t.id ? 'location' : undefined}
        className={cx('block rounded-chip px-3 py-1.5 text-sm', cls, active === t.id ? 'bg-accent-50 font-semibold text-accent-800' : 'text-graphite-700 hover:bg-graphite-50 hover:text-accent-700')}>{t.label}</a>
    </li>
  ))

  let figNo = 0
  let tabNo = 0

  return (
    <>
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={article.abstract.slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <ReadingProgress target={articleRef} />

      <Container className="pb-32 pt-6 lg:pb-16 lg:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-graphite-600">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li><AppLink to={paths.home} className="text-accent-700 hover:underline">Home</AppLink></li><li aria-hidden="true">/</li>
            <li><AppLink to={paths.issue(article.volume, article.issue)} className="text-accent-700 hover:underline">Volume {article.volume}, Issue {article.issue}</AppLink></li><li aria-hidden="true">/</li>
            <li aria-current="page" className="max-w-[16rem] truncate sm:max-w-md">{article.paperId}</li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[16.5rem_minmax(0,1fr)] lg:gap-12">
          {/* Tools rail (desktop) */}
          <aside aria-label="Article tools" className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-8rem)] space-y-5 overflow-y-auto rounded-panel border border-graphite-200 bg-white p-5 shadow-card">
              <div>
                <p className="font-display text-base font-semibold text-graphite-800">{journal.shortName}</p>
                <p className="text-sm text-graphite-600">Volume {article.volume}, Issue {article.issue}, pp. {article.pages}</p>
                <p className="text-xs text-graphite-600">ISSN {journal.issnOnline} (online)</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-graphite-600">DOI</p>
                <div className="mt-1 flex items-start gap-2">
                  <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="min-w-0 flex-1 break-all text-sm font-medium text-accent-700 hover:underline">{doi}</a>
                  <CopyDoi doi={doi} />
                </div>
              </div>
              <div className="space-y-2">
                <a href={paths.pdf(article.paperId)} download onClick={onPdf} className={cx(buttonClass('primary'), 'w-full')}><Download className="h-4 w-4" aria-hidden="true" /> Download PDF</a>
                <CiteFlyout article={article} className="[&>button]:w-full" />
                <Button variant="ghost" className="w-full border border-graphite-200" onClick={share}><MdOutlineShare className="h-4 w-4" aria-hidden="true" /> Share</Button>
              </div>
              <dl className="grid grid-cols-3 gap-2 border-t border-graphite-200 pt-4" aria-label="Article metrics">
                <Metric label="Views" value={article.views} /><Metric label="Downloads" value={article.downloads} /><Metric label="Citations" value={article.citations} />
              </dl>
              <nav aria-label="Jump to section" className="border-t border-graphite-200 pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-graphite-600">Jump to</p>
                <ul className="-mx-3 space-y-0.5">{tocLinks('')}</ul>
              </nav>
            </div>
          </aside>

          {/* Reading column */}
          <article ref={articleRef} className="min-w-0 max-w-[72ch]">
            <header>
              <div className="flex flex-wrap items-center gap-2">
                <Tag tone="neutral">{article.type}</Tag>
                <span className="inline-flex items-center gap-1.5 rounded-chip px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ring-graphite-200" style={{ color }}>
                  <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />{article.subject}
                </span>
                {journal.badges.openAccess && <Tag tone="brand" icon={<OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />}>Open Access</Tag>}
                {journal.badges.peerReviewed && <Tag tone="accent" icon={<Verified className="h-3.5 w-3.5" aria-hidden="true" />}>Peer Reviewed</Tag>}
              </div>
              <h1 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-graphite-800 sm:text-4xl">{article.title}</h1>

              <ul aria-label="Authors" className="mt-6 space-y-3">
                {article.authorDetails.map((a) => (
                  <li key={a.name} className="flex items-center gap-3">
                    <Portrait author={a} />
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-graphite-800">
                        {a.name}<sup className="ml-0.5 text-xs font-semibold text-accent-700">{a.affiliations.join(',')}{a.corresponding && <span aria-label=" corresponding author">*</span>}</sup>
                      </p>
                      <p className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs">
                        {a.corresponding && a.email && <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1 text-accent-700 hover:underline"><Email className="h-3.5 w-3.5" aria-hidden="true" />{a.email}</a>}
                        {a.orcid && <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noreferrer" aria-label={`ORCID profile of ${a.name}`} className="inline-flex items-center gap-1 text-accent-700 hover:underline"><span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-brand-600 text-[8px] font-bold text-white">iD</span>{a.orcid}</a>}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <ol className="mt-4 space-y-1 text-sm text-graphite-600">
                {article.affiliations.map((aff, i) => <li key={i} className="flex gap-2"><sup className="mt-0.5 w-3 shrink-0 text-xs font-semibold text-accent-700">{i + 1}</sup><span>{aff}</span></li>)}
              </ol>
              <p className="mt-1 text-xs text-graphite-600">* Corresponding author</p>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-panel border border-graphite-200 bg-graphite-50 p-4 text-sm sm:grid-cols-4">
                {[['Received', article.received], ['Accepted', article.accepted], ...(backdated ? [['Issue date', article.publishedAt], ['Published online', article.publishedOnline]] : [['Published', article.publishedAt]])].map(([k, v]) => (
                  <div key={k}><dt className="text-xs uppercase tracking-wide text-graphite-600">{k}</dt><dd className="mt-0.5 font-semibold text-graphite-800">{formatDate(v)}</dd></div>
                ))}
              </dl>
              {backdated && <p className="mt-2 text-xs text-graphite-600">This article was published online on {formatDate(article.publishedOnline)} and assigned to the issue dated {formatDate(article.publishedAt)}.</p>}
              <p className="mt-3 text-xs text-graphite-600">Licensed under <a href={journal.licence.url} target="_blank" rel="noreferrer" className="text-accent-700 hover:underline">{journal.licence.name}</a>.</p>

              {/* DOI for small screens (the rail is hidden below lg) */}
              <div className="mt-4 flex items-start gap-2 lg:hidden">
                <span className="text-sm font-semibold text-graphite-800">DOI</span>
                <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="min-w-0 flex-1 break-all text-sm text-accent-700 hover:underline">{doi}</a>
                <CopyDoi doi={doi} />
              </div>
            </header>

            <section id="abstract" aria-labelledby="abstract-h" className="mt-8 scroll-mt-24 rounded-panel border-l-4 border-brand-800 bg-brand-50 p-5">
              <h2 id="abstract-h" className="font-display text-xl font-semibold text-brand-900">Abstract</h2>
              <p className="mt-2 text-base leading-[1.75] text-graphite-800">{article.abstract}</p>
              <ul aria-label="Keywords" className="mt-4 flex flex-wrap gap-2">
                {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-block rounded-chip bg-white px-2.5 py-1 text-xs font-medium text-accent-800 ring-1 ring-inset ring-accent-200 hover:bg-accent-100">{k}</AppLink></li>)}
              </ul>
            </section>

            <div className="mt-4">
              {article.sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-24 pt-8">
                  <h2 id={`${s.id}-h`} className="font-display text-2xl font-semibold text-graphite-800">{i + 1}. {s.title}</h2>
                  {s.paragraphs.map((p, j) => <p key={j} className="mt-4 text-base leading-[1.8] text-graphite-800">{p}</p>)}
                  {s.table && <DataTable table={s.table} number={++tabNo} />}
                  {s.figure && <FigureBlock figure={s.figure} number={++figNo} />}
                </section>
              ))}
            </div>

            <section id="references" aria-labelledby="refs-h" className="mt-12 scroll-mt-24 border-t border-graphite-200 pt-8">
              <h2 id="refs-h" className="font-display text-2xl font-semibold text-graphite-800">References</h2>
              <ol className="mt-4 list-decimal space-y-3 pl-6 text-sm leading-relaxed text-graphite-700 marker:font-semibold marker:text-accent-700">
                {article.references.map((r, i) => (
                  <li key={i} id={`ref-${i + 1}`} className="pl-1">{r.text}{r.doi && <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="break-all text-accent-700 hover:underline">https://doi.org/{r.doi}</a></>}</li>
                ))}
              </ol>
            </section>

            <HowToCite article={article} />

            {article.related.length > 0 && (
              <section aria-labelledby="related-h" className="mt-12">
                <h2 id="related-h" className="font-display text-2xl font-semibold text-graphite-800">Related articles</h2>
                <ul className="mt-5 grid gap-5 sm:grid-cols-2">
                  {article.related.slice(0, 4).map((r) => <li key={r.paperId} className="flex"><div className="w-full min-w-0"><ArticleCard article={r} /></div></li>)}
                </ul>
              </section>
            )}
          </article>
        </div>
      </Container>

      {/* Floating contents menu */}
      <div ref={tocRef} className="fixed bottom-24 right-4 z-40 lg:bottom-8 lg:right-6">
        {tocOpen && (
          <div role="dialog" aria-label="Contents" className="absolute bottom-full right-0 mb-2 w-72 max-w-[calc(100vw-2rem)] rounded-panel border border-graphite-200 bg-white p-2 shadow-pop motion-safe:animate-fade-in">
            <div className="flex items-center justify-between px-3 py-1.5">
              <p className="font-display text-sm font-semibold text-graphite-800">Contents</p>
              <button type="button" onClick={closeToc} aria-label="Close contents" className="rounded-chip p-1 text-graphite-600 hover:bg-graphite-100"><Close className="h-4 w-4" aria-hidden="true" /></button>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto">{tocLinks('')}</ul>
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
    </>
  )
}
