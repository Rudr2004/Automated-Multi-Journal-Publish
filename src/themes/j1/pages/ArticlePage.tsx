import { CheckCircle2, Download, Eye, FileText, Mail, Quote, Share2, ShieldCheck } from '../components/uiIcons'
import { useEffect, useState, type MouseEvent } from 'react'
import { Helmet } from 'react-helmet-async'
import type { ArticleFull } from '../../../mock-data/journals/j1'
import { BarFigure, CopyButton, DataTable, OrcidIcon } from '../components/ArticleParts'
import { Avatar } from '../components/Avatar'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { IndexedStrip } from '../components/IndexLogos'
import { btnClass, Button } from '../components/Button'
import { CiteModal } from '../components/CiteModal'
import { Modal } from '../components/Modal'
import { Container } from '../components/primitives'
import { AppLink } from '../../../core/router'
import { useToast } from '../components/Toast'
import { doiFor, journal, visibleLogos } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { citationFilename, formatCitation } from '../../../core/lib/cite'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { downloadText } from '../../../core/lib/clipboard'
import { getScholarMeta } from '../../../core/lib/scholar'

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const obs = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (visible[0]) setActive(visible[0].target.id)
    }, { rootMargin: '-15% 0px -70% 0px' })
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [ids.join('|')]) // eslint-disable-line react-hooks/exhaustive-deps
  return active
}

function ShareModal({ article, open, onClose }: { article: ArticleFull; open: boolean; onClose: () => void }) {
  const url = `https://${journal.domain}${paths.article(article.paperId)}`
  const enc = encodeURIComponent
  const links = [
    ['Email', `mailto:?subject=${enc(article.title)}&body=${enc(url)}`],
    ['LinkedIn', `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`],
    ['X (Twitter)', `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(article.title)}`],
    ['WhatsApp', `https://wa.me/?text=${enc(`${article.title} ${url}`)}`],
  ]
  return (
    <Modal open={open} onClose={onClose} title="Share this article">
      <div className="flex items-center gap-2 border border-line bg-paper p-2 pl-3 text-sm">
        <span className="min-w-0 flex-1 truncate">{url}</span><CopyButton text={url} label="Copy link" />
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {links.map(([l, href]) => (
          <li key={l}><a href={href} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center rounded border border-line text-sm font-semibold text-navy hover:border-scholar hover:bg-scholar-soft">{l}</a></li>
        ))}
      </ul>
    </Modal>
  )
}

const panelTitle = 'border-b border-line pb-2 text-xs font-bold uppercase tracking-[0.12em] text-navy'
const sectionH2 = 'border-b border-line pb-2 font-serif text-[1.5rem] font-semibold leading-snug text-navy'
const btnSecondary = 'inline-flex h-11 items-center justify-center gap-2 rounded border border-navy/70 bg-white px-4 text-sm font-semibold text-navy transition-colors hover:bg-scholar-soft'

export function ArticlePage({ article }: { article: ArticleFull }) {
  const toast = useToast()
  const [citeOpen, setCiteOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const { tags, jsonLd } = getScholarMeta(article)
  const backdated = article.publishedOnline !== article.publishedAt
  const doi = doiFor(article.paperId)
  const apa = formatCitation(article, 'apa')
  const ieee = formatCitation(article, 'ieee')
  const hasMedia = article.sections.some((s) => s.table || s.figure)
  const mediaCount = article.sections.reduce((n, s) => n + (s.table ? 1 : 0) + (s.figure ? 1 : 0), 0)
  const firstMedia = article.sections.find((s) => s.table || s.figure)?.id
  const toc = [{ id: 'abstract', label: 'Abstract' }, ...article.sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })), { id: 'references', label: 'References' }, { id: 'how-to-cite', label: 'How to cite' }]
  const spyIds = [...toc.map((t) => t.id), ...(article.related.length ? ['related'] : [])]
  const active = useScrollSpy(spyIds)
  // A real link to the public PDF address (what Google Scholar reads); in the prototype it downloads a generated PDF.
  const onPdf = (e: MouseEvent) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded.`) }

  // Reference-style tab bar: in-page anchors, the active tab follows the reader's scroll position.
  const sectionIds = new Set(article.sections.map((s) => s.id))
  const tabActive = (id: string) => {
    if (id === 'abstract') return active === 'abstract' || sectionIds.has(active) || active === 'how-to-cite'
    if (id === 'references') return active === 'references'
    return active === id
  }
  const tabs = [
    { id: 'abstract', label: 'Abstract & Full Text' },
    ...(hasMedia && firstMedia ? [{ id: firstMedia, label: `Figures & Tables (${mediaCount})`, media: true }] : []),
    { id: 'references', label: `References (${article.references.length})` },
    ...(article.related.length ? [{ id: 'related', label: 'Related Articles' }] : []),
  ]

  const authorRole = (a: ArticleFull['authorDetails'][number]) => (a.corresponding ? 'Corresponding author' : 'Co-author')

  return (
    <>
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={article.abstract.slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Container className="pb-24 pt-6 lg:pb-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[220px_minmax(0,1fr)_300px]">
          {/* Article outline (xl: left rail; below xl: collapsible) */}
          <nav aria-label="Article outline" className="xl:sticky xl:top-20 xl:self-start lg:col-span-2 xl:col-span-1">
            <details className="border border-line bg-white xl:hidden">
              <summary className="cursor-pointer px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-navy">Article outline</summary>
              <ul className="space-y-0.5 px-4 pb-3 text-sm">{toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="block py-1.5 text-ink hover:text-scholar">{t.label}</a></li>)}</ul>
            </details>
            <div className="hidden border border-line bg-white p-4 xl:block">
              <h2 className={panelTitle}>Article outline</h2>
              <ul className="mt-3 text-[13px]">
                {toc.map((t, i) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} aria-current={active === t.id ? 'true' : undefined}
                      className={`flex items-baseline justify-between gap-2 border-l-2 px-3 py-2 transition-colors ${active === t.id ? 'border-scholar bg-scholar-soft font-bold text-scholar' : 'border-transparent font-semibold text-ink hover:bg-paper hover:text-scholar'}`}>
                      <span>{t.label}</span>
                      <span aria-hidden className="font-mono text-[10px] tabular-nums text-ink-muted">{String(i).padStart(2, '0')}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <a href={paths.pdf(article.paperId)} download onClick={onPdf}
                className="mt-4 flex h-10 items-center justify-center gap-2 rounded border border-scholar text-[13px] font-semibold text-scholar hover:bg-scholar-soft"><Download className="h-4 w-4" aria-hidden />Full Article PDF</a>
              <a href="#top-of-article" className="mt-3 block text-center text-xs font-semibold text-ink-muted hover:text-scholar">Jump to top</a>
            </div>
          </nav>

          {/* Article panel */}
          <article id="top-of-article" className="min-w-0 border border-line bg-white px-5 pb-8 sm:px-8 lg:col-start-1 xl:col-start-2 xl:row-start-1 lg:row-start-2 xl:row-start-1">
            <Breadcrumbs items={[
              { label: 'Home', to: paths.home }, { label: 'Current Issue', to: paths.currentIssue },
              { label: `Vol. ${article.volume} Issue ${article.issue}`, to: paths.issue(article.volume, article.issue) }, { label: `Article ${article.paperId.slice(-5)}` },
            ]} />

            <header>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                <span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2.5 py-1 text-scholar">{article.type}</span>
                <span className="inline-flex items-center gap-1 rounded-sm border border-[#F0C98F] bg-gold-soft px-2.5 py-1 text-[#7A4300]">Open Access ({journal.licence.name})</span>
                <span className="rounded-sm border border-line bg-paper px-2.5 py-1 text-ink">Peer-Reviewed</span>
                <span className="text-ink-muted">{article.subject}</span>
              </div>
              <h1 className="mt-4 font-serif text-[1.875rem] font-semibold leading-[1.2] tracking-tight text-navy sm:text-[2.5rem] sm:leading-[3rem]">{article.title}</h1>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3" aria-label="Authors">
                {article.authorDetails.map((a) => (
                  <li key={a.name} className="flex gap-3 border border-line bg-mist p-3">
                    <Avatar name={a.name} photo={a.photo} size="sm" />
                    <div className="min-w-0 text-[13px] leading-snug">
                      <p className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-navy">
                        <span>{a.name}<sup className="ml-0.5 text-[10px] font-semibold text-scholar">{a.affiliations.join(',')}{a.corresponding ? '*' : ''}</sup></span>
                        {a.orcid && <OrcidIcon id={a.orcid} />}
                      </p>
                      <p className={`mt-0.5 text-[10px] font-bold uppercase tracking-wider ${a.corresponding ? 'text-scholar' : 'text-ink-muted'}`}>{authorRole(a)}</p>
                      {a.affiliations.length > 0 && <p className="mt-1 text-ink-muted">{a.affiliations.map((n) => article.affiliations[n - 1]).filter(Boolean).join('; ')}</p>}
                      {a.corresponding && a.email && (
                        <a href={`mailto:${a.email}`} className="mt-1 inline-flex items-center gap-1 break-all text-scholar hover:underline"><Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />{a.email}</a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-4 border border-line bg-mist p-4 text-sm md:grid-cols-[1fr_1fr] md:divide-x md:divide-line">
                <dl className="space-y-1 md:pr-4">
                  {[['Received', article.received], ['Accepted', article.accepted], ...(backdated ? [['Issue date', article.publishedAt], ['Published online', article.publishedOnline]] : [['Published', article.publishedAt]])].map(([k, v]) => (
                    <div key={k} className="flex gap-1.5"><dt className="font-bold">{k}:</dt><dd className="tabular-nums">{formatDate(v)}</dd></div>
                  ))}
                </dl>
                <div className="space-y-1.5 md:pl-4">
                  <p className="font-semibold">Volume {article.volume}, Issue {article.issue}, pp. <span className="tabular-nums">{article.pages}</span></p>
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="font-bold">DOI:</span>
                    <a href={`https://doi.org/${doi}`} className="break-all font-mono text-[13px] tabular-nums text-scholar hover:underline">{doi}</a>
                    <CopyButton text={`https://doi.org/${doi}`} label="Copy DOI" />
                  </p>
                  <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
                    <span className="inline-flex items-center gap-1 text-oa"><CheckCircle2 className="h-4 w-4" aria-hidden />DOI registered with Crossref</span>
                    <a href={journal.licence.url} target="_blank" rel="noreferrer" className="text-scholar hover:underline">{journal.licence.name}</a>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-4">
                <a href={paths.pdf(article.paperId)} download onClick={onPdf}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded bg-scholar px-5 text-sm font-semibold text-white transition-colors hover:bg-scholar-dark"><Download className="h-4 w-4" aria-hidden />Download PDF</a>
                <a href="#introduction" className={btnSecondary}><FileText className="h-4 w-4" aria-hidden />View Full Text</a>
                <button type="button" className={btnSecondary} onClick={() => setCiteOpen(true)}><Quote className="h-4 w-4" aria-hidden />Cite Article</button>
                <button type="button" className={btnSecondary} onClick={() => setShareOpen(true)}><Share2 className="h-4 w-4" aria-hidden />Share</button>
              </div>
            </header>

            <nav aria-label="Article sections" className="mt-6 flex gap-6 overflow-x-auto border-b border-line [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((t) => (
                <a key={t.label} href={`#${t.id}`} aria-current={tabActive(t.id) ? 'true' : undefined}
                  className={`-mb-px whitespace-nowrap border-b-2 py-3 text-sm font-semibold transition-colors ${tabActive(t.id) ? 'border-scholar text-scholar' : 'border-transparent text-ink hover:text-scholar'}`}>{t.label}</a>
              ))}
            </nav>

            <section id="abstract" className="mt-6 scroll-mt-24 border border-line border-l-[3px] border-l-navy bg-paper p-5 sm:p-6">
              <h2 className="font-serif text-[1.375rem] font-semibold text-navy">Abstract</h2>
              <p className="mt-3 text-[1.0625rem] leading-[1.75] text-ink">{article.abstract}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="text-[13px] font-bold">Keywords:</span>
                <ul className="flex flex-wrap gap-2" aria-label="Keywords">
                  {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-block rounded-sm border border-[#C4D9EE] bg-white px-2.5 py-1 text-xs font-semibold text-scholar hover:border-scholar hover:bg-scholar-soft">#{k}</AppLink></li>)}
                </ul>
              </div>
            </section>

            <div id="fulltext" className="mt-8">
              {article.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24 pt-6">
                  <h2 className={sectionH2}>{i + 1}. {s.title}</h2>
                  {s.paragraphs.map((p, j) => <p key={j} className="mt-4 text-[1.0625rem] leading-[1.75] text-ink">{p}</p>)}
                  {s.table && <DataTable table={s.table} />}
                  {s.figure && <BarFigure figure={s.figure} />}
                </section>
              ))}
            </div>

            <section id="references" className="mt-8 scroll-mt-24 border-t border-line pt-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-serif text-[1.5rem] font-semibold text-navy">References ({article.references.length})</h2>
              </div>
              <ol className="mt-4 space-y-5">
                {article.references.map((r, i) => (
                  <li key={i} id={`ref-${i + 1}`} className="text-[0.9375rem] leading-relaxed text-ink">
                    <span className="font-bold">[{i + 1}]</span> {r.text}
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs">
                      {r.doi && <><a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="text-scholar hover:underline">Crossref</a><span aria-hidden className="text-ink-muted">·</span></>}
                      <a href={`https://scholar.google.com/scholar?q=${encodeURIComponent(r.text.slice(0, 120))}`} target="_blank" rel="noreferrer" className="text-scholar hover:underline">Google Scholar</a>
                      {r.doi && <><span aria-hidden className="text-ink-muted">·</span><span className="break-all font-mono text-ink-muted">doi: {r.doi}</span></>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section id="how-to-cite" className="mt-10 scroll-mt-24 border border-line border-l-[3px] border-l-navy bg-paper p-5">
              <h2 className="font-serif text-lg font-semibold text-navy">How to cite this article</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed">{apa}</p>
              <div className="mt-3 flex flex-wrap gap-2"><CopyButton text={apa} label="Copy citation" /><Button size="sm" variant="outline" onClick={() => setCiteOpen(true)}>More formats</Button></div>
            </section>
          </article>

          {/* Right rail */}
          <aside aria-label="Article tools" className="space-y-5 lg:col-start-2 lg:row-start-2 xl:col-start-3 xl:row-start-1 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <section aria-labelledby="metrics-title" className="border border-line bg-white p-4">
              <h2 id="metrics-title" className={panelTitle}>Article impact &amp; metrics</h2>
              <dl className="mt-3 grid grid-cols-3 divide-x divide-line border border-line text-center">
                {([['Views', article.views, Eye], ['PDF downloads', article.downloads, Download], ['Citations', article.citations, Quote]] as const).map(([k, v, Icon]) => (
                  <div key={k} className="px-1 py-3">
                    <Icon className="mx-auto mb-1.5 h-5 w-5 text-scholar" aria-hidden />
                    <dd className="font-serif text-[1.5rem] font-semibold leading-none tabular-nums text-navy">{formatNumber(v)}</dd>
                    <dt className="mt-1.5 text-[11px] font-semibold text-ink-muted">{k}</dt>
                  </div>
                ))}
              </dl>
              <AppLink to={paths.verify(`IJMAT-CERT-${article.paperId}`)} className="mt-3 flex items-center gap-2 border border-line p-3 text-[13px] font-semibold text-navy hover:border-scholar hover:bg-scholar-soft">
                <ShieldCheck className="h-5 w-5 shrink-0 text-oa" aria-hidden />Verify author certificate
              </AppLink>
            </section>

            <section aria-labelledby="cite-title" className="border border-line bg-white p-4">
              <h2 id="cite-title" className={panelTitle}>Cite this paper</h2>
              <p className="mt-3 text-xs text-ink-muted">Copy the standard IEEE bibliographic snippet:</p>
              <p className="mt-2 border border-line bg-mist p-3 font-mono text-[12px] leading-relaxed text-ink">{ieee}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <CopyButton text={ieee} label="Copy IEEE" tone="solid" className="h-9" />
                <button type="button" onClick={() => downloadText(citationFilename(article, 'bibtex'), formatCitation(article, 'bibtex'))}
                  className="h-9 rounded border border-line bg-scholar-soft px-2 text-xs font-semibold text-scholar hover:border-scholar">Download BibTeX</button>
              </div>
              <button type="button" onClick={() => setCiteOpen(true)} className="mt-2 text-xs font-semibold text-scholar hover:underline">More citation formats</button>
            </section>

            <section aria-labelledby="subject-title" className="border border-line bg-white p-4">
              <h2 id="subject-title" className={panelTitle}>Subject classification</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                <AppLink to={paths.search(article.subject)} className="rounded-sm border border-line bg-mist px-2.5 py-1 text-xs font-semibold text-navy hover:border-scholar">{article.subject}</AppLink>
              </div>
            </section>

            {visibleLogos().length > 0 && (
              <section aria-labelledby="indexed-title" className="border border-line bg-white p-4">
                <h2 id="indexed-title" className={panelTitle}>Indexed in</h2>
                <div className="mt-3"><IndexedStrip look="compact" limit={6} /></div>
              </section>
            )}
          </aside>
        </div>

        {article.related.length > 0 && (
          <section id="related" aria-labelledby="related-title" className="mt-10 scroll-mt-24 border-t border-line pt-8">
            <h2 id="related-title" className="font-serif text-[1.625rem] font-semibold text-navy">Related Scholarship in {journal.shortName}</h2>
            <p className="mt-1 text-sm text-ink-muted">Recommended from the same journal.</p>
            <ul className="mt-5 grid gap-4 md:grid-cols-3">
              {article.related.map((r) => (
                <li key={r.paperId} className="flex flex-col border border-line bg-white p-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-ink-muted">
                    <span>Vol. {r.volume} Issue {r.issue} · {formatDate(r.publishedAt)}</span>
                    <span className="font-semibold tabular-nums text-scholar">{formatNumber(r.citations)} citations</span>
                  </div>
                  <h3 className="mt-2 font-serif text-lg font-semibold leading-snug text-navy">
                    <AppLink to={paths.article(r.paperId)} className="hover:text-scholar hover:underline">{r.title}</AppLink>
                  </h3>
                  <p className="mt-2 text-[13px] text-ink-muted">{r.authors.slice(0, 2).join(', ')}{r.authors.length > 2 ? ' et al.' : ''}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3 text-xs">
                    <span className="truncate font-mono text-ink-muted">doi: {doiFor(r.paperId)}</span>
                    <AppLink to={paths.article(r.paperId)} className="shrink-0 font-semibold text-scholar hover:underline">Read Full Text</AppLink>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </Container>

      {/* Mobile / tablet bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-line bg-white p-3 lg:hidden">
        <a href={paths.pdf(article.paperId)} download onClick={onPdf} className={btnClass('primary', 'md', 'w-full')}><Download className="h-4 w-4" aria-hidden />Download PDF</a>
        <Button variant="outline" onClick={() => setCiteOpen(true)} aria-label="Cite this article"><Quote className="h-4 w-4" aria-hidden />Cite</Button>
        <Button variant="outline" onClick={() => setShareOpen(true)} aria-label="Share this article"><Share2 className="h-4 w-4" aria-hidden /></Button>
      </div>

      <CiteModal article={article} open={citeOpen} onClose={() => setCiteOpen(false)} />
      <ShareModal article={article} open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  )
}
