// Article page for IJFRD (replica of the client's article view): wine header band, sticky anchor tab bar, then one scrolling page of
// 12 columns: outline (2) · reading column (6) · metrics / declarations / cite / paper details (4). Everything is in the DOM, so print shows the whole paper.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { journal } from '../../../config/journals'
import { getScholarMeta } from '../../../core/lib/scholar'
import type { ArticleFull } from '../../../core/types'
import { ArticleHeader } from './article/ArticleHeader'
import { AuthorCards } from './article/AuthorCards'
import { OutlineRail } from './article/OutlineRail'
import { AbstractPanel, FullTextPanel, HistoryPanel, ReferencesPanel } from './article/ReadingPanels'
import { reducedMotion, tabsFor } from './article/shared'
import { SidePanel } from './article/SidePanel'
import { TabBar } from './article/TabBar'
import { RelatedPanel } from './article/UtilityPanels'

const SPY_OFFSET = 170

export function ArticlePage({ article }: { article: ArticleFull }) {
  const { tags, jsonLd } = getScholarMeta(article)
  const tabs = useMemo(() => tabsFor(article), [article])
  const [current, setCurrent] = useState('abstract')
  const progress = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const lockUntil = useRef(0)

  // Blocks of the reading column in page order: the scroll-spy follows these.
  const spyIds = useMemo(() => [
    'abstract', ...(article.keywords?.length ? ['keywords'] : []), 'authors-section', 'publication-history',
    ...(article.sections ?? []).map((s) => s.id),
    ...(article.references?.length ? ['references'] : []),
    ...(article.related?.length ? ['related-articles'] : []),
  ], [article])

  const goTo = useCallback((id: string, focus = true) => {
    const el = document.getElementById(id)
    if (!el) return
    lockUntil.current = Date.now() + 900
    setCurrent(id)
    window.history.replaceState(window.history.state, '', `${window.location.pathname}${window.location.search}#${id}`)
    el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
    if (focus && el.tabIndex === -1 && el.getAttribute('tabindex') !== null) el.focus({ preventScroll: true })
  }, [])

  // Deep links: a hash into any block, section or numbered reference scrolls there on load and on later hash changes.
  useEffect(() => {
    const timers: number[] = []
    const apply = () => {
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ''))
      if (!id) return
      // Run again after layout settles (fonts, images) so the target lands in the right place.
      ;[0, 350, 900].forEach((ms) => timers.push(window.setTimeout(() => {
        const el = document.getElementById(id)
        if (!el) return
        lockUntil.current = Date.now() + 900
        setCurrent(id)
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
        if (ms === 0 && el.getAttribute('tabindex') !== null) el.focus({ preventScroll: true })
      }, ms)))
    }
    window.addEventListener('hashchange', apply)
    apply()
    return () => { window.removeEventListener('hashchange', apply); timers.forEach((t) => window.clearTimeout(t)) }
  }, [article])

  // Scroll-spy and reading progress.
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = content.current
      if (el && progress.current) {
        const r = el.getBoundingClientRect()
        const total = r.height - window.innerHeight * 0.6
        progress.current.style.transform = `scaleX(${Math.max(0, Math.min(1, total > 0 ? -(r.top - 120) / total : 0))})`
      }
      if (Date.now() < lockUntil.current) return
      let found = spyIds[0]
      for (const id of spyIds) {
        const t = document.getElementById(id)?.getBoundingClientRect().top
        if (t !== undefined && t <= SPY_OFFSET) found = id
      }
      setCurrent((c) => (c === found ? c : found))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf) }
  }, [spyIds])

  // Which tab owns the block in view.
  const activeTab = useMemo(() => {
    if (tabs.some((t) => t.id === current)) return current
    if (current === 'keywords' || current === 'publication-history') return 'abstract'
    if (current === 'related-articles') return article.references?.length ? 'references' : 'abstract'
    if (article.sections?.some((s) => s.id === current)) return 'full-text'
    return 'abstract'
  }, [current, tabs, article])

  const onRef = useCallback((n: number) => goTo(`ref-${n}`), [goTo])

  return (
    <>
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={(article.abstract ?? '').slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[3px] print:hidden"><div ref={progress} className="h-full origin-left bg-ochre-600" style={{ transform: 'scaleX(0)' }} /></div>

      <article className="bg-[#F9F9FF]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <ArticleHeader article={article} />
        </div>
        <TabBar tabs={tabs} active={activeTab} onSelect={(id) => goTo(id)} />
        <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            <OutlineRail article={article} current={current} onGo={(id) => goTo(id)} />
            <div ref={content} className="min-w-0 space-y-6 lg:col-span-6">
              <AbstractPanel article={article} />
              <AuthorCards article={article} />
              <HistoryPanel article={article} />
              {article.sections?.length > 0 && <FullTextPanel article={article} onRef={onRef} />}
              {article.references?.length > 0 && <ReferencesPanel article={article} />}
              <RelatedPanel article={article} />
            </div>
            <SidePanel article={article} />
          </div>
        </div>
      </article>
    </>
  )
}
