// Announcement bar at the very top, as in the reference: a deep-navy strip with a LIVE ALERT badge and a slowly sliding line of the journal's announcements,
// plus pause / play and dismiss buttons. The slide pauses on hover or focus and never runs for visitors who prefer reduced motion (the line is then static and scrolls by hand).
// Items come from the journal config; extra items (e.g. notices) can be passed in.
import { useMemo, useState } from 'react'
import { journal } from '../../../config/journals'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { Campaign, Close, PauseCircle, PlayCircle } from './refIconsJ4'

interface Item { key: string; text: string; to?: string; date?: string }
const reduceMotion = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
const TONES = ['text-white', 'text-sky-200', 'text-emerald-300', 'text-slate-200']

export function AnnouncementTickerJ4({ extra = [] }: { extra?: { date: string; text: string }[] }) {
  const items = useMemo<Item[]>(() => [
    ...journal.announcements.map((a) => ({ key: a.id, text: a.text, to: a.to })),
    ...extra.map((n, i) => ({ key: `n${i}`, text: n.text, date: n.date })),
  ], [extra])
  const [paused, setPaused] = useState(false)
  const [hidden, setHidden] = useState(false)
  const still = reduceMotion()
  if (!items.length || hidden) return null
  const live = journal.announcements.some((a) => a.live)

  const line = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-12 pr-12">
      {items.map((it, i) => (
        <span key={it.key} className="flex items-center gap-2 whitespace-nowrap">
          <Campaign className="h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          {it.date && <span className="rounded bg-white/10 px-1.5 text-[11px] font-semibold tabular-nums text-amber-300">{formatDate(it.date)}</span>}
          {it.to && !hidden
            ? <AppLink to={it.to} className={`font-semibold hover:underline ${TONES[i % TONES.length]}`}>{it.text}</AppLink>
            : <span className={`font-semibold ${TONES[i % TONES.length]}`}>{it.text}</span>}
        </span>
      ))}
    </span>
  )

  return (
    <section aria-label="Announcements" className="relative z-50 flex w-full items-center justify-between overflow-hidden border-b border-[#034470] bg-[#002b49] px-3 py-1.5 text-[11px] text-sky-100 sm:px-4 sm:text-xs">
      <div className="z-10 flex shrink-0 items-center gap-2 bg-[#002b49] pr-3">
        <span className="inline-flex items-center gap-1.5 rounded border border-amber-400/40 bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full bg-emerald-400 ${paused || still ? '' : 'motion-safe:animate-pulse'}`} />{live ? 'Live alert' : 'Notice'}
        </span>
      </div>
      <div className="relative mx-2 flex-1 overflow-hidden" onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div className={`group flex w-max items-center font-medium ${still ? 'overflow-x-auto' : 'animate-[marquee_36s_linear_infinite] hover:[animation-play-state:paused]'} ${paused ? '[animation-play-state:paused]' : ''}`}>
          {line(false)}
          {!still && line(true)}
        </div>
      </div>
      <div className="z-10 flex shrink-0 items-center gap-1 bg-[#002b49] pl-2 text-sky-300">
        {!still && (
          <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Play announcements' : 'Pause announcements'} title={paused ? 'Play' : 'Pause'} className="flex items-center rounded p-1 hover:text-white">
            {paused ? <PlayCircle className="h-4 w-4" aria-hidden="true" /> : <PauseCircle className="h-4 w-4" aria-hidden="true" />}
          </button>
        )}
        <button type="button" onClick={() => setHidden(true)} aria-label="Dismiss announcements" title="Dismiss" className="flex items-center rounded p-1 hover:text-white"><Close className="h-4 w-4" aria-hidden="true" /></button>
      </div>
    </section>
  )
}
