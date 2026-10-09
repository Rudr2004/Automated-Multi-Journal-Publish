// Journal 5's signature elements, reused across its pages so the whole site shares one recognisable identity:
//  - OrnamentRule: a hairline, a small diamond and a hairline (taken from the divider in the IJFRD logo), used between sections and under page titles.
//  - ElementTile: a research area drawn like a cell of the periodic table (atomic number, symbol, name), for the research-areas board and area chips.
//  - Kicker: the small uppercase label above a heading, with the diamond ornament.
//  - DropCap: a large initial letter for the first paragraph of an abstract or a policy.
import type { ReactNode } from 'react'
import { cx } from './primitives'

/** Hairline, diamond, hairline. `tone` picks the colours for light or dark backgrounds. */
export function OrnamentRule({ tone = 'light', className }: { tone?: 'light' | 'dark'; className?: string }) {
  const line = tone === 'dark' ? 'bg-ochre-300/50' : 'bg-wine-800/25'
  const gem = tone === 'dark' ? 'bg-ochre-300' : 'bg-ochre-700'
  return (
    <div aria-hidden="true" className={cx('flex items-center gap-3', className)}>
      <span className={cx('h-px flex-1', line)} />
      <span className={cx('h-2 w-2 rotate-45', gem)} />
      <span className={cx('h-px flex-1', line)} />
    </div>
  )
}

/** Small uppercase label above a heading. */
export function Kicker({ children, tone = 'light', className }: { children: ReactNode; tone?: 'light' | 'dark'; className?: string }) {
  return (
    <p className={cx('flex items-center gap-2 font-work text-[11px] font-semibold uppercase tracking-[0.14em]', tone === 'dark' ? 'text-ochre-300' : 'text-ochre-700', className)}>
      <span aria-hidden="true" className={cx('h-1.5 w-1.5 rotate-45', tone === 'dark' ? 'bg-ochre-300' : 'bg-ochre-700')} />
      {children}
    </p>
  )
}

/** Two-letter symbol for an area name: "Physics & Astronomy" -> "Ph", "Technology, Policy & Development" -> "Td". */
export function symbolOf(name: string): string {
  const words = name.replace(/&/g, ' ').split(/\s+/).filter(Boolean)
  if (words.length === 1) return words[0].slice(0, 2).replace(/^./, (c) => c.toUpperCase())
  return (words[0][0].toUpperCase() + (words.find((w, i) => i > 0 && !/^(and|of|the)$/i.test(w))?.[0] ?? words[0][1]).toLowerCase())
}

/** A research area drawn like a periodic-table cell. `number` is the position in the list (1-based). */
export function ElementTile({ number, name, symbol, color, meta, className }: { number: number; name: string; symbol?: string; color: string; meta?: ReactNode; className?: string }) {
  return (
    <div className={cx('relative flex h-full flex-col border border-wine-800/20 bg-white p-3 transition-colors', className)} style={{ borderTop: `3px solid ${color}` }}>
      <span aria-hidden="true" className="font-work text-[11px] font-semibold tabular-nums text-obsidian-500">{String(number).padStart(2, '0')}</span>
      <span aria-hidden="true" className="mt-1 font-newsreader text-[2.25rem] font-semibold leading-none" style={{ color }}>{symbol ?? symbolOf(name)}</span>
      <span className="mt-2 font-newsreader text-[0.95rem] font-semibold leading-snug text-obsidian-900">{name}</span>
      {meta && <span className="mt-1 font-work text-xs text-obsidian-600">{meta}</span>}
    </div>
  )
}

/** First paragraph with a large initial. Pass plain text; the rest of the styling comes from the surrounding prose classes. */
export function DropCap({ text, className }: { text: string; className?: string }) {
  const first = text.charAt(0)
  return (
    <p className={className}>
      <span aria-hidden="true" className="float-left mr-2 mt-1 font-newsreader text-[3.4rem] font-semibold leading-[0.8] text-wine-800">{first}</span>
      <span className="sr-only">{first}</span>
      {text.slice(1)}
    </p>
  )
}
