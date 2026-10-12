// Sticky anchor tab bar (replica of the reference): jumps to a section of the single-scroll article; the section in view is underlined.
import { cx } from '../../components/primitives'
import type { TabDef } from './shared'

export function TabBar({ tabs, active, onSelect }: { tabs: TabDef[]; active: string; onSelect: (id: string) => void }) {
  return (
    // Sits under the sticky site header row (48px tall).
    <div className="sticky top-12 z-20 w-full border-b border-[#DCC0BE] bg-white shadow-sm print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav aria-label="Article sections" className="flex items-center gap-6 overflow-x-auto whitespace-nowrap font-work text-xs font-medium uppercase tracking-wider [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((t) => {
            const on = t.id === active
            return (
              <a key={t.id} href={`#${t.id}`} aria-current={on ? 'location' : undefined}
                onClick={(e) => { e.preventDefault(); onSelect(t.id) }}
                className={cx('flex min-h-11 items-center rounded-sm py-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none',
                  on ? 'font-bold text-wine-900 shadow-[0_2px_0_0_#55121A]' : 'text-[#564241] hover:text-wine-800')}>
                {t.label}
              </a>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
