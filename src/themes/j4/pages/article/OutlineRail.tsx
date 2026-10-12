// "Article outline" card (top of the sticky right rail): Abstract, each section, Figures & tables and References. Picking an item opens the right tab and scrolls to it; the section in view is highlighted (scroll-spy).
import { useEffect, useMemo, useState } from 'react'
import { MdOutlineToc } from 'react-icons/md'
import type { ArticleFull } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { CARD, exhibitsOf, MONO, NAVY, type TabId } from './shared'

interface Item { id: string; tab: TabId; label: string }

export function outlineFor(article: ArticleFull): Item[] {
  return [
    { id: 'abstract-text', tab: 'abstract', label: 'Abstract & Keywords' },
    ...(article.sections ?? []).map((s, i) => ({ id: s.id, tab: 'full-text' as const, label: `${i + 1}. ${s.title}` })),
    ...(exhibitsOf(article).length ? [{ id: 'figures-list', tab: 'figures' as const, label: `Figures & Tables (${exhibitsOf(article).length})` }] : []),
    ...(article.references?.length ? [{ id: 'references-list', tab: 'references' as const, label: `References (${article.references.length})` }] : []),
  ]
}

export function OutlineRail({ active, onGo, article }: { active: TabId; onGo: (tab: TabId, id: string) => void; article: ArticleFull }) {
  const items = useMemo(() => outlineFor(article), [article])
  const [current, setCurrent] = useState('')

  useEffect(() => {
    const mine = items.filter((i) => i.tab === active)
    setCurrent(mine[0]?.id ?? '')
    const els = mine.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e)
    if (els.length < 2 || typeof IntersectionObserver === 'undefined') return
    const seen = new Map<string, boolean>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting))
      const first = els.find((el) => seen.get(el.id))
      if (first) setCurrent(first.id)
    }, { rootMargin: '-130px 0px -55% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items, active])

  return (
    <nav aria-label="Article outline" className={cx(CARD, 'p-4')}>
      <div className="mb-3 flex items-center gap-2 border-b border-abyss-100 pb-2.5 text-abyss-800">
        <MdOutlineToc className="h-5 w-5 text-azure-600" aria-hidden="true" />
        <h2 className={`${MONO} text-xs font-bold uppercase tracking-wider ${NAVY}`}>Article Outline</h2>
      </div>
      <ol className="space-y-1 text-xs font-medium">
        {items.map((i) => {
          const on = i.tab === active && current === i.id
          return (
            <li key={i.id}>
              <button type="button" aria-current={on ? 'location' : undefined} onClick={() => onGo(i.tab, i.id)}
                className={cx('flex min-h-8 w-full items-center gap-2 rounded-md px-2 py-1.5 text-left leading-snug [overflow-wrap:anywhere] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600',
                  on ? 'bg-azure-50 font-semibold text-cobalt-700' : 'text-steel-600 transition-colors hover:bg-abyss-50 hover:text-cobalt-700')}>
                <span aria-hidden="true" className={cx('h-1.5 w-1.5 shrink-0 rounded-full', on ? 'bg-azure-600' : 'bg-abyss-300')} />
                {i.label}
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
