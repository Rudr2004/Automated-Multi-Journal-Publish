// Top notice bar, as in the reference: a "Call for Papers" badge followed by one continuous right-to-left scrolling line of alerts separated by amber stars.
// The line pauses on hover and keyboard focus and has its own pause button; it does not move for visitors who prefer reduced motion (the notices wrap instead).
// Items come from the journal config (announcements, next issue, licence); extra items (e.g. notices) can be passed in.
import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { journal } from '../../../config/journals'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { Megaphone, Pause, Play } from './homeIconsJ5'

interface Item { key: string; node: ReactNode }

export function AnnouncementTickerJ5({ extra = [] }: { extra?: { date: string; text: string }[] }) {
  const [paused, setPaused] = useState(false)
  const year = journal.nextIssue.expectedPublication.slice(0, 4)
  const items = useMemo<Item[]>(() => [
    ...journal.announcements.map((a) => ({ key: a.id, node: a.to ? <AppLink to={a.to} className="hover:underline">{a.text}</AppLink> : <>{a.text}</> })),
    { key: 'x-next', node: <>Online monthly journal · Next issue: <strong>{journal.nextIssue.label}</strong> · Submission deadline <strong>{formatDate(journal.nextIssue.deadline.slice(0, 10))}</strong></> },
    { key: 'x-doi', node: <>Crossref DOI prefix <strong>{journal.doiPrefix}</strong> for every published article</> },
    { key: 'x-oa', node: <>Open access under <strong>{journal.licence.name}</strong>: authors keep their copyright</> },
    ...extra.map((n, i) => ({ key: `n${i}`, node: <><strong>{formatDate(n.date)}</strong> · {n.text}</> })),
  ], [extra])
  if (!items.length) return null
  const line = (hidden: boolean) => (
    <span aria-hidden={hidden || undefined} className={hidden ? 'j5-dup inline-flex items-center gap-6 pr-6' : 'inline-flex items-center gap-6 pr-6'}>
      {items.map((it) => (
        <Fragment key={it.key}><span>{it.node}</span><span aria-hidden="true" className="text-amber-300">✦</span></Fragment>
      ))}
    </span>
  )
  return (
    <section aria-label="Announcements" className="relative z-50 overflow-hidden border-b border-[#6b1e2f] bg-[#51020b] px-4 py-2 text-white">
      <div className="mx-auto flex max-w-[1600px] items-center">
        <div className="z-10 mr-3 flex shrink-0 items-center gap-1.5 rounded border border-amber-300/30 bg-[#6b1e2f] px-2.5 py-0.5 font-work text-[11px] font-semibold uppercase tracking-[0.08em] text-amber-200 shadow-sm">
          <Megaphone className="h-3.5 w-3.5" aria-hidden="true" /><span>Call for Papers {year}</span>
        </div>
        <div className="w-full overflow-hidden whitespace-nowrap motion-reduce:overflow-visible">
          <div className={`j5-marquee font-work text-xs tracking-wide text-[#f4f5fc] sm:text-sm ${paused ? 'j5-paused' : ''}`}>
            {line(false)}{line(true)}
          </div>
        </div>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-pressed={paused} aria-label={paused ? 'Resume scrolling announcements' : 'Pause scrolling announcements'}
          className="z-10 ml-3 shrink-0 rounded border border-white/25 p-1 text-white hover:bg-white/10 motion-reduce:hidden">
          {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>
      </div>
    </section>
  )
}
