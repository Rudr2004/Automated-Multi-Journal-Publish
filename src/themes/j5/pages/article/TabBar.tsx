// Sticky WAI-ARIA tab bar: roving tabindex, arrow / Home / End keys, activation on focus.
import { useRef, type KeyboardEvent } from 'react'
import { cx } from '../../components/primitives'
import type { TabDef, TabId } from './shared'

export const tabDomId = (id: string) => `tab-${id}`
export const panelDomId = (id: string) => `panel-${id}`

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
    <div className="sticky top-12 z-30 border-b border-wine-800/20 bg-[#FBF8F4]/95 backdrop-blur print:hidden">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6">
        <div role="tablist" aria-label="Article sections" onKeyDown={onKeyDown} className="-mb-px flex gap-1 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => {
            const on = t.id === active
            return (
              <button key={t.id} ref={(el) => { refs.current[t.id] = el }} type="button" role="tab" id={tabDomId(t.id)} aria-selected={on} aria-controls={panelDomId(t.id)} tabIndex={on ? 0 : -1}
                onClick={() => onSelect(t.id)}
                className={cx('relative min-h-12 shrink-0 whitespace-nowrap border-b-2 px-3.5 text-sm font-semibold transition-colors motion-reduce:transition-none sm:px-4',
                  on ? 'border-wine-800 text-wine-800' : 'border-transparent text-obsidian-600 hover:text-obsidian-900')}>
                {t.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
