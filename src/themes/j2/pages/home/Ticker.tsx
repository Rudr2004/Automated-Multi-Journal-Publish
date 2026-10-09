// Announcement ticker: rotates the journal's announcements and notices one at a time. A pause/play button stops the rotation
// (required for accessibility); it starts paused for visitors who prefer reduced motion.
import { useEffect, useMemo, useState } from 'react'
import { journal } from '../../../../config/journals'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import { ChevronLeft, Megaphone, Pause, Play } from '../../components/homeIcons'
import { ArrowRight, ChevronRight } from '../../icons'

interface Item { key: string; text: string; to?: string; date?: string }

const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function Ticker({ notices, reviewDays }: { notices: { date: string; text: string }[]; reviewDays: number }) {
  const items = useMemo<Item[]>(() => [
    ...journal.announcements.map((a) => ({ key: a.id, text: a.text, to: a.to })),
    ...notices.map((n, i) => ({ key: `n${i}`, text: n.text, date: n.date })),
  ], [notices])
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(reduceMotion)
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
  const nav = 'shrink-0 rounded-chip border border-graphite-300 bg-white p-1.5 text-graphite-700 hover:border-brand-800 hover:bg-brand-50 hover:text-brand-800'
  return (
    <section aria-label="Announcements" className="relative flex items-stretch overflow-hidden rounded-panel border border-graphite-200 bg-white text-sm shadow-card">
      <div className="flex shrink-0 items-center gap-2 bg-brand-800 px-3 text-white sm:px-4">
        <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
          <Megaphone className="h-[18px] w-[18px]" aria-hidden="true" />
          {!paused && <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-cta-400 ring-2 ring-brand-800" />}
        </span>
        <span className="hidden font-display text-[11px] font-bold uppercase leading-tight tracking-wider sm:block">Latest<br />announcements</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center gap-3 px-3 py-3 sm:px-4" aria-live={paused ? 'polite' : 'off'} aria-atomic="true">
        <p key={cur.key} className="min-w-0 font-medium leading-snug text-graphite-800 motion-safe:animate-fade-in">
          {cur.date && <span className="mr-2 inline-block rounded bg-brand-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-brand-800">{formatDate(cur.date)}</span>}
          {cur.to
            ? <AppLink to={cur.to} className="hover:text-accent-700 hover:underline">{cur.text} <ArrowRight className="inline h-4 w-4 align-text-bottom text-accent-700" aria-hidden="true" /></AppLink>
            : cur.text}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-l border-graphite-200 bg-graphite-50 px-2.5 sm:px-3">
        <span className="hidden whitespace-nowrap rounded bg-white px-2 py-1 font-mono text-[11px] font-semibold text-graphite-700 ring-1 ring-graphite-200 xl:inline">Average review ~{reviewDays} days</span>
        {n > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous announcement" className={nav}><ChevronLeft className="h-4 w-4" aria-hidden="true" /></button>
            <span className="hidden min-w-[2.5rem] text-center text-xs font-semibold tabular-nums text-graphite-700 sm:inline" aria-hidden="true">{idx + 1} / {n}</span>
            <button type="button" onClick={() => go(1)} aria-label="Next announcement" className={nav}><ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
            <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Resume rotating announcements' : 'Pause rotating announcements'} className={nav}>
              {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
            </button>
          </>
        )}
      </div>
      {n > 1 && !paused && (
        <span aria-hidden="true" key={`${cur.key}-${idx}`} className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-accent-600/80 motion-reduce:hidden"
          style={{ animation: 'j2-ticker-progress 6s linear forwards' }} />
      )}
    </section>
  )
}
