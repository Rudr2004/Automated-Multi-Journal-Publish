// Article page for IJECM (reference "article detail"): one white article card (metadata, title, DOI bar, authors, actions, sticky tabs Abstract / Full article / Figures & tables / References)
// next to a sticky rail with the outline, citation, details and metrics. URL-hash deep links and arrow keys work; all panels stay in the DOM so print shows the whole paper.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { getScholarMeta } from '../../../core/lib/scholar'
import type { ArticleFull } from '../../../core/types'
import { Container } from '../components/primitives'
import { ArticleHeader, Breadcrumbs } from './article/ArticleHeader'
import { AbstractPanel, FiguresPanel, FullTextPanel, ReferencesPanel } from './article/ReadingPanels'
import { reducedMotion, tabsFor, type TabId } from './article/shared'
import { SidePanel } from './article/SidePanel'
import { panelDomId, tabDomId, TabBar } from './article/TabBar'
import { Declarations, PublishBanner, RecognitionSection, RelatedSection } from './article/UtilityPanels'

/** Where a URL hash points: a tab, or an element inside one (a section or a numbered reference). */
function tabForHash(hash: string, tabs: { id: TabId }[], article: ArticleFull): TabId | null {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return null
  const direct = tabs.find((t) => t.id === id)
  if (direct) return direct.id
  if (/^ref-\d+$/.test(id) && tabs.some((t) => t.id === 'references')) return 'references'
  if (article.sections?.some((s) => s.id === id)) return 'full-text'
  if (id === 'figures-list' && tabs.some((t) => t.id === 'figures')) return 'figures'
  return null
}

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: id.startsWith('ref-') ? 'center' : 'start' })
  el.focus({ preventScroll: true })
}

export function ArticlePage({ article }: { article: ArticleFull }) {
  const { tags, jsonLd } = getScholarMeta(article)
  const tabs = useMemo(() => tabsFor(article), [article])
  const [active, setActive] = useState<TabId>(() => (typeof window === 'undefined' ? 'abstract' : tabForHash(window.location.hash, tabs, article) ?? 'abstract'))
  const progress = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const pendingScroll = useRef<string | null>(null)
  const activeRef = useRef<TabId>(active)
  activeRef.current = active

  const select = useCallback((id: TabId, scrollTo?: string) => {
    pendingScroll.current = scrollTo ?? null
    if (id === activeRef.current && scrollTo) scrollToId(scrollTo)
    setActive(id)
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${scrollTo ?? id}`)
    if (!scrollTo) {
      // Keep the reader at the top of the content when switching tabs from far down the page.
      const top = content.current?.getBoundingClientRect().top ?? 0
      if (top < 96) window.scrollTo({ top: window.scrollY + top - 140, behavior: reducedMotion() ? 'auto' : 'smooth' })
    }
  }, [])

  // Deep links: follow later hash changes (back/forward, pasted links); a hash into a section or reference scrolls there once its tab is shown.
  useEffect(() => {
    const apply = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      const tab = tabForHash(window.location.hash, tabs, article)
      if (!tab) return
      setActive(tab)
      if (id !== tab) pendingScroll.current = id
    }
    window.addEventListener('hashchange', apply)
    apply()
    return () => window.removeEventListener('hashchange', apply)
  }, [tabs, article])

  useEffect(() => {
    const id = pendingScroll.current
    if (!id) return
    pendingScroll.current = null
    scrollToId(id)
  }, [active])

  // Reading progress through the current panel.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = content.current
      if (!el || !progress.current) return
      const r = el.getBoundingClientRect()
      const total = r.height - window.innerHeight * 0.6
      progress.current.style.transform = `scaleX(${Math.max(0, Math.min(1, total > 0 ? -(r.top - 120) / total : 0))})`
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf) }
  }, [active])

  const panels: Record<TabId, React.ReactNode> = {
    abstract: <AbstractPanel article={article} />,
    'full-text': article.sections?.length ? <FullTextPanel article={article} onRef={(n) => select('references', `ref-${n}`)} /> : null,
    figures: <FiguresPanel article={article} onGo={(id) => select('full-text', id)} />,
    references: article.references?.length ? <ReferencesPanel article={article} /> : null,
  }
  const hasFull = tabs.some((t) => t.id === 'full-text')

  return (
    <>
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" />
        <meta name="description" content={(article.abstract ?? '').slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] print:hidden"><div ref={progress} className="h-full origin-left bg-azure-600" style={{ transform: 'scaleX(0)' }} /></div>

      <Container className="pb-16 pt-6">
        <Breadcrumbs article={article} />
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            <article className="min-w-0 space-y-6 rounded border border-abyss-200 bg-white p-5 shadow-hair sm:p-7 md:p-8">
              <ArticleHeader article={article} onReadFull={hasFull ? () => select('full-text') : undefined} />
              <TabBar tabs={tabs} active={active} onSelect={(id) => select(id)} />
              <div ref={content} className="min-w-0">
                {tabs.map((t) => (
                  <div key={t.id} role="tabpanel" id={panelDomId(t.id)} aria-labelledby={tabDomId(t.id)} hidden={active !== t.id} tabIndex={0}
                    className={`min-w-0 scroll-mt-32 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azure-600 print:!block print:break-inside-auto [&:not([hidden])]:motion-safe:animate-fade-in print:mb-8${t.id === 'figures' ? ' print:!hidden' : ''}`}>
                    {panels[t.id]}
                  </div>
                ))}
              </div>
              <Declarations article={article} />
              <RelatedSection article={article} />
            </article>
          </div>
          <div className="min-w-0 lg:col-span-4">
            <SidePanel article={article} active={active} onGo={(tab, id) => select(tab, id)} />
          </div>
        </div>
        <PublishBanner />
        <RecognitionSection article={article} />
      </Container>
    </>
  )
}
