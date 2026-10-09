// Announcement ticker: rotates the journal's announcements one at a time. Megaphone badge, previous / next buttons.
// There is no pause button: the rotation stops while the pointer or keyboard focus is on the bar and never starts for visitors who prefer reduced motion. Items come from the journal config; extra items (e.g. notices) can be passed in.
import { useEffect, useMemo, useState } from 'react'
import { journal } from '../../../config/journals'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { ArrowRight } from '../icons'
import { ChevronLeft, ChevronRight, Megaphone } from './homeIconsJ5'

interface Item { key: string; text: string; to?: string; date?: string }
const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function AnnouncementTickerJ5({ extra = [] }: { extra?: { date: string; text: string }[] }) {
  const items = useMemo<Item[]>(() => [
    ...journal.announcements.map((a) => ({ key: a.id, text: a.text, to: a.to })),
    ...extra.map((n, i) => ({ key: `n${i}`, text: n.text, date: n.date })),
  ], [extra])
  const [i, setI] = useState(0)
  const [hover, setHover] = useState(false)
  const paused = hover || reduceMotion()
  useEffect(() => {
    if (paused || items.length < 2) return
    const t = window.setInterval(() => setI((n) => (n + 1) % items.length), 6000)
    return () => window.clearInterval(t)
  }, [paused, items.length])
  if (!items.length) return null
  const n = items.length
  const idx = i % n
  const cur = items[idx]
  const go = (d: number) => setI((x) => (x + d + n) % n)
  const btn = 'shrink-0 rounded border border-white/20 p-1.5 text-bordeaux-100 hover:bg-white/10 hover:text-white'
  return (
    <section aria-label="Announcements" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)} className="border-b border-white/10 bg-bordeaux-900 text-sm text-bordeaux-100">
      <div className="mx-auto flex min-h-[2.5rem] max-w-[1240px] items-center gap-3 px-4 py-1 sm:px-6">
        <span className="flex shrink-0 items-center gap-2 text-white">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-ochre-400/20 text-ochre-300">
            <Megaphone className="h-[18px] w-[18px]" aria-hidden="true" />
            {!paused && n > 1 && <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-ochre-300 ring-2 ring-bordeaux-900" />}
          </span>
          <span className="hidden text-[11px] font-semibold uppercase tracking-[0.08em] text-ochre-300 sm:inline">Announcements</span>
        </span>
        <div className="min-w-0 flex-1" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
          <p key={cur.key} className="font-medium leading-snug motion-safe:animate-fade-in">
            {cur.date && <span className="mr-2 inline-block rounded bg-white/10 px-2 py-0.5 text-xs font-semibold tabular-nums text-ochre-300">{formatDate(cur.date)}</span>}
            {cur.to
              ? <AppLink to={cur.to} className="text-white hover:underline">{cur.text} <ArrowRight className="inline h-4 w-4 align-text-bottom text-ochre-300" aria-hidden="true" /></AppLink>
              : cur.text}
          </p>
        </div>
        <span className="hidden shrink-0 whitespace-nowrap text-xs tabular-nums text-bordeaux-200 lg:inline">ISSN {journal.issnOnline} · DOI {journal.doiPrefix}</span>
        {n > 1 && (
          <span className="flex shrink-0 items-center gap-1.5">
            <button type="button" onClick={() => go(-1)} aria-label="Previous announcement" className={btn}><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
            <span className="hidden min-w-[2.25rem] text-center text-xs font-semibold tabular-nums text-bordeaux-200 sm:inline" aria-hidden="true">{idx + 1} / {n}</span>
            <button type="button" onClick={() => go(1)} aria-label="Next announcement" className={btn}><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
          </span>
        )}
      </div>
    </section>
  )
}
