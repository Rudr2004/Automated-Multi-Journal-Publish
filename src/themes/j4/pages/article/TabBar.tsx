// Sticky WAI-ARIA tab bar at the top of the article card: roving tabindex, arrow / Home / End keys, activation on focus. 2px sky bottom border marks the open tab.
import { useRef, type KeyboardEvent } from 'react'
import { MdOutlineArticle, MdOutlineFormatListBulleted, MdOutlineImage, MdOutlineSubject } from 'react-icons/md'
import { cx } from '../../components/primitives'
import type { TabDef, TabId } from './shared'

export const tabDomId = (id: string) => `tab-${id}`
export const panelDomId = (id: string) => `panel-${id}`
const ICONS: Record<TabId, typeof MdOutlineSubject> = { abstract: MdOutlineSubject, 'full-text': MdOutlineArticle, figures: MdOutlineImage, references: MdOutlineFormatListBulleted }

export function TabBar({ tabs, active, onSelect }: { tabs: TabDef[]; active: TabId; onSelect: (id: TabId) => void }) {
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = tabs.findIndex((t) => t.id === active)
    let next = -1
    if (e.key === 'ArrowRight') next = (i + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (i - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    if (next < 0) return
    e.preventDefault()
    onSelect(tabs[next].id)
    refs.current[tabs[next].id]?.focus()
  }
  return (
    // Sits under the sticky site header row (48px tall).
    <div className="sticky top-12 z-30 bg-white print:hidden">
      <div role="tablist" aria-label="Article sections" onKeyDown={onKeyDown} className="flex gap-1 border-b border-abyss-200 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t) => {
          const on = t.id === active
          const Icon = ICONS[t.id]
          return (
            <button key={t.id} ref={(el) => { refs.current[t.id] = el }} type="button" role="tab" id={tabDomId(t.id)} aria-selected={on} aria-controls={panelDomId(t.id)} tabIndex={on ? 0 : -1}
              onClick={() => onSelect(t.id)}
              className={cx('relative -mb-px inline-flex min-h-11 shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 px-4 py-2 font-work text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure-600 motion-reduce:transition-none',
                on ? 'border-azure-600 font-bold text-cobalt-700' : 'border-transparent font-medium text-steel-600 hover:text-cobalt-700')}>
              <Icon className="h-4 w-4" aria-hidden="true" />{t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
