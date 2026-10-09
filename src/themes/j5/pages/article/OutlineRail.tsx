// Left rail: the article outline. Every tab is listed; the open tab expands to its sections, and the section in view is highlighted (scroll-spy).
import { useEffect, useMemo, useState } from 'react'
import type { ArticleFull } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { Kicker } from '../../components/signature'
import { reducedMotion, type TabDef, type TabId } from './shared'

interface Item { id: string; label: string }

export function outlineFor(article: ArticleFull, tab: TabId): Item[] {
  if (tab === 'abstract') {
    return [
      { id: 'abstract-text', label: 'Abstract' },
      ...(article.keywords?.length ? [{ id: 'keywords', label: 'Keywords' }] : []),
      ...(article.authorDetails?.length ? [{ id: 'authors', label: 'Authors' }] : []),
      { id: 'history', label: 'Publication history' },
    ]
  }
  if (tab === 'full-text') return (article.sections ?? []).map((s, i) => ({ id: s.id, label: `${String(i + 1).padStart(2, '0')}  ${s.title}` }))
  if (tab === 'references') return [{ id: 'references-list', label: `All ${article.references.length} references` }]
  return []
}

export function OutlineRail({ tabs, active, onSelect, article }: { tabs: TabDef[]; active: TabId; onSelect: (id: TabId) => void; article: ArticleFull }) {
  const items = useMemo(() => outlineFor(article, active), [article, active])
  const [current, setCurrent] = useState('')

  useEffect(() => {
    setCurrent(items[0]?.id ?? '')
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e)
    if (!els.length || typeof IntersectionObserver === 'undefined') return
    const seen = new Map<string, boolean>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target.id, e.isIntersecting))
      const first = els.find((el) => seen.get(el.id))
      if (first) setCurrent(first.id)
    }, { rootMargin: '-130px 0px -55% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [items])

  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
    setCurrent(id)
  }

  return (
    <nav aria-label="Article outline" className="hidden xl:sticky xl:top-28 xl:block xl:self-start print:hidden">
      <Kicker className="mb-2 px-2">Outline</Kicker>
      <ol className="space-y-0.5 border-l border-obsidian-200">
        {tabs.map((t) => {
          const on = t.id === active
          return (
            <li key={t.id}>
              <button type="button" aria-current={on ? 'true' : undefined} onClick={() => onSelect(t.id)}
                className={cx('-ml-px flex min-h-9 w-full items-center border-l-2 px-3 text-left text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wine-700',
                  on ? 'border-wine-800 text-wine-800' : 'border-transparent text-obsidian-600 hover:text-obsidian-900')}>{t.label}</button>
              {on && items.length > 0 && (
                <ul className="mb-1.5 ml-3 space-y-0.5 border-l border-obsidian-100 pl-2">
                  {items.map((i) => (
                    <li key={i.id}>
                      <button type="button" onClick={() => go(i.id)} aria-current={current === i.id ? 'location' : undefined}
                        className={cx('flex min-h-8 w-full items-start rounded px-2 py-1 text-left text-[13px] leading-snug focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 [overflow-wrap:anywhere]',
                          current === i.id ? 'bg-ochre-50 font-semibold text-wine-700' : 'text-obsidian-600 hover:bg-obsidian-50 hover:text-obsidian-900')}>
                        <span className="whitespace-pre-wrap">{i.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
