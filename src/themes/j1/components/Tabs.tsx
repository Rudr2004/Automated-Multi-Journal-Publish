import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface TabDef { id: string; label: string; content: ReactNode }

/** Accessible tabs (WAI-ARIA): arrow keys / Home / End move between tabs. */
export function Tabs({ tabs, label }: { tabs: TabDef[]; label: string }) {
  const [active, setActive] = useState(tabs[0].id)
  const uid = useId()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})

  const onKey = (e: KeyboardEvent, i: number) => {
    const last = tabs.length - 1
    const next = e.key === 'ArrowRight' ? (i === last ? 0 : i + 1) : e.key === 'ArrowLeft' ? (i === 0 ? last : i - 1)
      : e.key === 'Home' ? 0 : e.key === 'End' ? last : -1
    if (next < 0) return
    e.preventDefault()
    setActive(tabs[next].id)
    refs.current[tabs[next].id]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="mb-6 flex gap-1 overflow-x-auto overflow-y-hidden border-b border-line [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((t, i) => (
          <button
            key={t.id} ref={(el) => { refs.current[t.id] = el }} role="tab" id={`${uid}-t-${t.id}`}
            aria-selected={active === t.id} aria-controls={`${uid}-p-${t.id}`} tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)} onKeyDown={(e) => onKey(e, i)}
            className={`-mb-px whitespace-nowrap border-b-[3px] px-4 py-2.5 text-sm font-semibold transition-colors ${
              active === t.id ? 'border-navy text-navy' : 'border-transparent text-ink-muted hover:text-navy'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.id} role="tabpanel" id={`${uid}-p-${t.id}`} aria-labelledby={`${uid}-t-${t.id}`} hidden={active !== t.id}>
          {active === t.id && t.content}
        </div>
      ))}
    </div>
  )
}
