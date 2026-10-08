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
import { Badge, Container } from '../components/primitives'
import { AppLink } from '../../../core/router'
import { useToast } from '../components/Toast'
import { doiFor, journal, visibleLogos } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { formatCitation } from '../../../core/lib/cite'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { getScholarMeta } from '../../../core/lib/scholar'

const dot = <span aria-hidden className="mx-2 text-line">•</span>

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
      <div className="flex items-center gap-2 rounded-lg border border-line bg-mist p-2 pl-3 text-sm">
        <span className="min-w-0 flex-1 truncate">{url}</span><CopyButton text={url} label="Copy link" />
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-2">
        {links.map(([l, href]) => (
          <li key={l}><a href={href} target="_blank" rel="noreferrer" className="flex h-10 items-center justify-center rounded-lg border border-line text-sm font-semibold text-navy hover:border-navy hover:bg-navy-50">{l}</a></li>
        ))}
      </ul>
    </Modal>
  )
}

export function ArticlePage({ article }: { article: ArticleFull }) {
  const toast = useToast()
  const [citeOpen, setCiteOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const { tags, jsonLd } = getScholarMeta(article)
  const backdated = article.publishedOnline !== article.publishedAt
  const doi = doiFor(article.paperId)
  const citation = formatCitation(article, 'apa')
  const toc = [{ id: 'abstract', label: 'Abstract' }, ...article.sections.map((s) => ({ id: s.id, label: s.title })), { id: 'references', label: 'References' }, { id: 'how-to-cite', label: 'How to cite' }]
  const active = useScrollSpy(toc.map((t) => t.id))
  // A real link to the public PDF address (what Google Scholar reads); in the prototype it downloads a generated PDF.
  const onPdf = (e: MouseEvent) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded.`) }
  const pdfLink = (extra = '') => (
    <a href={paths.pdf(article.paperId)} download onClick={onPdf} className={btnClass('primary', 'md', `w-full ${extra}`)}><Download className="h-4 w-4" aria-hidden />Download PDF</a>
  )

  const actions = (
    <>
      {pdfLink()}
      <a href="#introduction" className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-navy text-sm font-semibold text-navy hover:bg-navy-50"><FileText className="h-4 w-4" aria-hidden />View Full Text</a>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => setCiteOpen(true)}><Quote className="h-4 w-4" aria-hidden />Cite</Button>
        <Button variant="outline" onClick={() => setShareOpen(true)}><Share2 className="h-4 w-4" aria-hidden />Share</Button>
      </div>
    </>
  )

  return (
    <>
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={article.abstract.slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Container className="pb-24 lg:pb-8">
        <Breadcrumbs items={[
          { label: 'Home', to: paths.home }, { label: 'Current Issue', to: paths.currentIssue },
          { label: `Volume ${article.volume}, Issue ${article.issue}`, to: paths.issue(article.volume, article.issue) }, { label: article.title },
        ]} />

        <header className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="open">Open Access</Badge><Badge tone="navy">{article.type}</Badge>
            <span className="text-xs text-ink-muted">{article.subject}</span>
          </div>
          <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight text-navy sm:text-4xl">{article.title}</h1>

          <ul className="mt-5 flex flex-wrap gap-3" aria-label="Authors">
            {article.authorDetails.map((a) => (
              <li key={a.name} className="inline-flex items-center gap-3 rounded border border-line bg-white py-1.5 pl-1.5 pr-4 shadow-sm">
                <Avatar name={a.name} photo={a.photo} size="sm" />
                <span className="text-base font-medium text-ink">
                  {a.name}<sup className="ml-0.5 text-xs font-semibold text-navy-500">{a.affiliations.join(',')}{a.corresponding ? '*' : ''}</sup>
                </span>
                {a.corresponding && a.email && <a href={`mailto:${a.email}`} aria-label={`Email corresponding author ${a.name}`} className="inline-flex text-navy-500 hover:text-navy"><Mail className="h-4 w-4" aria-hidden /></a>}
                {a.orcid && <OrcidIcon id={a.orcid} />}
              </li>
            ))}
          </ul>
          <ol className="mt-4 space-y-1 text-sm text-ink-muted">
            {article.affiliations.map((aff, i) => (
              <li key={i} className="flex items-baseline gap-2"><span className="w-4 shrink-0 text-right text-xs font-semibold text-navy-500">{i + 1}</span><span>{aff}</span></li>
            ))}
          </ol>
          <p className="mt-1 text-xs text-ink-muted">* Corresponding author: {article.authorDetails[0].email}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-card border border-line bg-mist p-4 text-sm sm:grid-cols-3 lg:grid-cols-5">
            {[['Received', article.received], ['Accepted', article.accepted], ...(backdated ? [['Issue date', article.publishedAt], ['Published online', article.publishedOnline]] : [['Published', article.publishedAt]])].map(([k, v]) => (
              <div key={k}><dt className="text-xs uppercase tracking-wide text-ink-muted">{k}</dt><dd className="mt-0.5 font-semibold">{formatDate(v)}</dd></div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap items-center gap-y-2 text-sm text-ink">
            <span className="inline-flex items-center gap-2"><strong>DOI:</strong> <a href={`https://doi.org/${doi}`} className="text-navy-600 hover:underline">{doi}</a><CopyButton text={`https://doi.org/${doi}`} label="Copy DOI" /></span>
            {dot}<span>Vol {article.volume}, Issue {article.issue}, pp. {article.pages}</span>
            {dot}<a href={journal.licence.url} target="_blank" rel="noreferrer" className="text-navy-600 hover:underline">{journal.licence.name}</a>
            {dot}<span className="inline-flex items-center gap-1 text-oa"><CheckCircle2 className="h-4 w-4" aria-hidden />DOI registered with Crossref</span>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[190px_minmax(0,1fr)_300px]">
          {/* Sticky TOC (xl: left rail; below xl: collapsible card) */}
          <nav aria-label="Table of contents" className="xl:sticky xl:top-20 xl:self-start lg:col-span-1 xl:order-none">
            <details className="rounded-card border border-line bg-white xl:hidden" >
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-navy">On this page</summary>
              <ul className="space-y-1 px-4 pb-3 text-sm">{toc.map((t) => <li key={t.id}><a href={`#${t.id}`} className="block py-1 text-ink-muted hover:text-navy">{t.label}</a></li>)}</ul>
            </details>
            <div className="hidden xl:block">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">On this page</h2>
              <ul className="space-y-1 border-l border-line text-sm">
                {toc.map((t) => (
                  <li key={t.id}><a href={`#${t.id}`} aria-current={active === t.id ? 'true' : undefined}
                    className={`-ml-px block border-l-2 py-1.5 pl-3 transition-colors ${active === t.id ? 'border-navy font-semibold text-navy' : 'border-transparent text-ink-muted hover:text-navy'}`}>{t.label}</a></li>
                ))}
              </ul>
            </div>
          </nav>

          <article className="min-w-0 xl:col-start-2 xl:row-start-1">
            <section id="abstract" className="scroll-mt-24">
              <h2 className="font-serif text-2xl font-semibold text-navy">Abstract</h2>
              <p className="mt-3 max-w-prose font-serif text-[1.0625rem] leading-[1.7]">{article.abstract}</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Keywords">
                {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-block rounded border border-line bg-white px-3 py-1 text-xs font-medium text-navy hover:border-navy hover:bg-navy-50">{k}</AppLink></li>)}
              </ul>
            </section>

            <div id="fulltext" className="mt-10 border-t border-line pt-2">
              {article.sections.map((s, i) => (
                <section key={s.id} id={s.id} className="scroll-mt-24 pt-6">
                  <h2 className="font-serif text-2xl font-semibold text-navy">{i + 1}. {s.title}</h2>
                  {s.paragraphs.map((p, j) => <p key={j} className="mt-4 max-w-prose font-serif text-[1.0625rem] leading-[1.7]">{p}</p>)}
                  {s.table && <DataTable table={s.table} />}
                  {s.figure && <BarFigure figure={s.figure} />}
                </section>
              ))}
            </div>

            <section id="references" className="scroll-mt-24 pt-10">
              <h2 className="font-serif text-2xl font-semibold text-navy">References</h2>
              <ol className="mt-4 max-w-prose list-decimal space-y-3 pl-6 text-sm leading-relaxed marker:font-semibold marker:text-navy-500">
                {article.references.map((r, i) => (
                  <li key={i} id={`ref-${i + 1}`}>{r.text}{r.doi && <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="break-all text-navy-600 hover:underline">https://doi.org/{r.doi}</a></>}</li>
                ))}
              </ol>
            </section>

            <section id="how-to-cite" className="mt-10 scroll-mt-24 rounded-card border border-navy-200 bg-navy-50 p-5">
              <h2 className="font-serif text-lg font-semibold text-navy">How to cite this article</h2>
              <p className="mt-2 max-w-prose text-sm leading-relaxed">{citation}</p>
              <div className="mt-3 flex flex-wrap gap-2"><CopyButton text={citation} label="Copy citation" /><Button size="sm" variant="outline" onClick={() => setCiteOpen(true)}>More formats</Button></div>
            </section>
          </article>

          {/* Sticky sidebar */}
          <aside aria-label="Article tools" className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:col-start-3 xl:row-start-1">
            <div className="space-y-3 rounded-card border border-line bg-white p-5 shadow-sm">
              <div className="hidden space-y-3 lg:block">{actions}</div>
              <div className="grid grid-cols-2 gap-3 lg:border-t lg:border-line lg:pt-4">
                <div className="rounded-lg bg-mist p-3 text-center"><Eye className="mx-auto h-4 w-4 text-navy-500" aria-hidden /><div className="mt-1 font-serif text-xl font-semibold text-navy">{formatNumber(article.views)}</div><div className="text-xs text-ink-muted">Views</div></div>
                <div className="rounded-lg bg-mist p-3 text-center"><Download className="mx-auto h-4 w-4 text-navy-500" aria-hidden /><div className="mt-1 font-serif text-xl font-semibold text-navy">{formatNumber(article.downloads)}</div><div className="text-xs text-ink-muted">Downloads</div></div>
              </div>
              <AppLink to={paths.verify(`IJMAT-CERT-${article.paperId}`)} className="flex items-center gap-2 rounded-lg border border-line p-3 text-sm font-semibold text-navy hover:border-navy hover:bg-navy-50">
                <ShieldCheck className="h-5 w-5 text-oa" aria-hidden />Verify author certificate
              </AppLink>
            </div>
            {visibleLogos().length > 0 && (
              <div className="mt-4 rounded border border-line bg-white p-4">
                <h2 className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted">Indexed in</h2>
                <div className="mt-2"><IndexedStrip look="compact" limit={6} /></div>
              </div>
            )}
            {article.related.length > 0 && (
              <div className="mt-4 rounded-card border border-line bg-white p-5">
                <h2 className="font-serif text-lg font-semibold text-navy">Related articles</h2>
                <ul className="mt-3 divide-y divide-line">
                  {article.related.map((r) => (
                    <li key={r.paperId} className="py-3 first:pt-0 last:pb-0">
                      <AppLink to={paths.article(r.paperId)} className="text-sm font-medium leading-snug text-navy hover:underline">{r.title}</AppLink>
                      <p className="mt-1 text-xs text-ink-muted">{r.authors[0]}{r.authors.length > 1 ? ' et al.' : ''} · {formatDate(r.publishedAt)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </Container>

      {/* Mobile / tablet bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto_auto] gap-2 border-t border-line bg-white p-3 lg:hidden">
        {pdfLink()}
        <Button variant="outline" onClick={() => setCiteOpen(true)} aria-label="Cite this article"><Quote className="h-4 w-4" aria-hidden />Cite</Button>
        <Button variant="outline" onClick={() => setShareOpen(true)} aria-label="Share this article"><Share2 className="h-4 w-4" aria-hidden /></Button>
      </div>

      <CiteModal article={article} open={citeOpen} onClose={() => setCiteOpen(false)} />
      <ShareModal article={article} open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  )
}
