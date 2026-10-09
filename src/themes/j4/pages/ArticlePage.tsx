// Article page for IJECM: a tabbed article workspace. Dark blueprint header band, sticky tab bar (URL-hash deep links, arrow keys),
// reading column on the left and a sticky "Paper details" spec sheet on the right. All panels stay in the DOM so print shows the whole paper.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { getScholarMeta } from '../../../core/lib/scholar'
import type { ArticleFull } from '../../../core/types'
import { Container } from '../components/primitives'
import { ArticleHeader } from './article/ArticleHeader'
import { AbstractPanel, FullTextPanel, ReferencesPanel } from './article/ReadingPanels'
import { OutlineRail } from './article/OutlineRail'
import { reducedMotion, tabsFor, type TabId } from './article/shared'
import { SidePanel } from './article/SidePanel'
import { panelDomId, tabDomId, TabBar } from './article/TabBar'
import { CitePanel, MetricsPanel, RelatedPanel } from './article/UtilityPanels'

/** Where a URL hash points: a tab, or an element inside one (a section or a numbered reference). */
function tabForHash(hash: string, tabs: { id: TabId }[], article: ArticleFull): TabId | null {
  const id = decodeURIComponent(hash.replace(/^#/, ''))
  if (!id) return null
  const direct = tabs.find((t) => t.id === id)
  if (direct) return direct.id
  if (/^ref-\d+$/.test(id) && tabs.some((t) => t.id === 'references')) return 'references'
  if (article.sections?.some((s) => s.id === id)) return 'full-text'
  return null
}

export function ArticlePage({ article }: { article: ArticleFull }) {
  const { tags, jsonLd } = getScholarMeta(article)
  const tabs = useMemo(() => tabsFor(article), [article])
  const [active, setActive] = useState<TabId>(() => (typeof window === 'undefined' ? 'abstract' : tabForHash(window.location.hash, tabs, article) ?? 'abstract'))
  const progress = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const pendingScroll = useRef<string | null>(null)

  const select = useCallback((id: TabId, scrollTo?: string) => {
    setActive(id)
    pendingScroll.current = scrollTo ?? null
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
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'center' })
    el.focus({ preventScroll: true })
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
    references: article.references?.length ? <ReferencesPanel article={article} /> : null,
    metrics: <MetricsPanel article={article} />,
    cite: <CitePanel article={article} />,
    related: article.related?.length ? <RelatedPanel article={article} /> : null,
  }

  return (
    <>
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={(article.abstract ?? '').slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] print:hidden"><div ref={progress} className="h-full origin-left bg-azure-600" style={{ transform: 'scaleX(0)' }} /></div>

      <article>
        <ArticleHeader article={article} />
        <TabBar tabs={tabs} active={active} onSelect={(id) => select(id)} />
        <Container className="pb-20 pt-8 sm:pt-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:gap-8 xl:grid-cols-[14rem_minmax(0,1fr)_21rem] xl:gap-10">
            <OutlineRail tabs={tabs} active={active} onSelect={(id) => select(id)} article={article} />
            <div ref={content} className="min-w-0">
              {tabs.map((t) => (
                <div key={t.id} role="tabpanel" id={panelDomId(t.id)} aria-labelledby={tabDomId(t.id)} hidden={active !== t.id} tabIndex={0}
                  className="min-w-0 scroll-mt-32 rounded-ctl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-azure-600 print:!block print:break-inside-auto [&:not([hidden])]:motion-safe:animate-fade-in print:mb-8">
                  {panels[t.id]}
                </div>
              ))}
            </div>
            <SidePanel article={article} />
          </div>
        </Container>
      </article>
    </>
  )
}
