import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { Campaign, LocateFixed, LockOpen, Star } from '../components/uiIcons'

const MINUTE = 60000
const HOUR = 3600000
const DAY = 86400000
const ROTATE_MS = 5000
const SPEED_PX_PER_SEC = 45

/** "closes in 4 days" / "closes in 9 hours" / "submissions are open", from the config's next-issue deadline. */
export function closesIn(deadline: string, now = Date.now()) {
  const ms = new Date(deadline).getTime() - now
  if (ms <= 0) return 'submissions are open'
  if (ms >= DAY) { const d = Math.floor(ms / DAY); return `closes in ${d} day${d === 1 ? '' : 's'}` }
  const h = Math.max(1, Math.floor(ms / HOUR))
  return `closes in ${h} hour${h === 1 ? '' : 's'}`
}

/**
 * Left-to-right ticker driven in code (requestAnimationFrame), so it moves on every device and does not depend on CSS animation
 * settings. Three identical copies of the content make the loop seamless.
 */
function Marquee({ children, paused }: { children: ReactNode; paused: boolean }) {
  const track = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(paused)
  pausedRef.current = paused

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let offset: number | null = null
    const tick = (t: number) => {
      const el = track.current
      if (el) {
        const copy = el.scrollWidth / 3
        if (copy > 0) {
          if (offset === null) offset = -copy
          if (!pausedRef.current && !document.hidden) offset += (SPEED_PX_PER_SEC * Math.min(100, t - last)) / 1000
          if (offset >= 0) offset -= copy
          el.style.transform = `translate3d(${offset}px, 0, 0)`
        }
      }
      last = t
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return <div ref={track} className="flex w-max items-center whitespace-nowrap will-change-transform">{children}</div>
}

/**
 * Top strip (as in the reference): an ANNOUNCEMENT label and the announcements, then ISSN, Crossref DOI, the Open Access
 * licence and Track Paper. Announcements scroll left to right; for visitors who prefer reduced motion they fade from one to the
 * next instead of moving. Hovering or focusing the ticker pauses it.
 */
export function ResearchRibbon() {
  const reduce = useReducedMotion()
  const [now, setNow] = useState(() => Date.now())
  const [hover, setHover] = useState(false)
  const [index, setIndex] = useState(0)
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), MINUTE); return () => clearInterval(t) }, [])

  const items = journal.announcements.map((a) => ({ ...a, label: a.live ? `${a.text} ${closesIn(journal.nextIssue.deadline, now)}` : a.text }))
  const stopped = hover

  // Reduced motion: rotate through the announcements instead of scrolling.
  useEffect(() => {
    if (!reduce || stopped) return
    const t = setTimeout(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS)
    return () => clearTimeout(t)
  }, [reduce, stopped, index, items.length])

  const item = (a: (typeof items)[number]) => (
    <AppLink to={a.to} className={`inline-flex items-center gap-1.5 whitespace-nowrap px-3 font-medium hover:underline ${a.highlight ? 'text-gold' : 'text-white'}`}>
      {a.highlight && <Star className="h-3.5 w-3.5" aria-hidden />}{a.label}
    </AppLink>
  )

  return (
    <div className="bg-navy-900 text-xs text-navy-100">
      <div className="flex h-10 items-center gap-4 px-3 sm:px-4 lg:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span className="flex shrink-0 items-center gap-1.5 rounded-sm bg-scholar px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <Campaign className="h-3.5 w-3.5" aria-hidden /><span className="hidden sm:inline">Announcement</span><span className="sm:hidden">News</span>
          </span>

          <div role="region" aria-label="Journal announcements" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocus={() => setHover(true)} onBlur={() => setHover(false)}
            className="relative min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_14px,#000_calc(100%-28px),transparent)]">
            {reduce ? (
              <AnimatePresence mode="wait" initial={false}>
                <motion.p key={index} className="truncate" aria-live="off" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>{item(items[index])}</motion.p>
              </AnimatePresence>
            ) : (
              <Marquee paused={stopped}>
                {[0, 1, 2].map((copy) => (
                  <ul key={copy} aria-hidden={copy > 0} className="flex shrink-0 items-center">
                    {items.map((a) => <li key={a.id} className="flex items-center">{item(a)}<span aria-hidden className="text-navy-300">|</span></li>)}
                  </ul>
                ))}
              </Marquee>
            )}
          </div>
        </div>

        <div className="hidden shrink-0 items-center gap-4 border-l border-white/20 pl-4 md:flex">
          <ul className="flex items-center gap-3 divide-x divide-white/20 [&>li+li]:pl-3" aria-label="Journal identifiers">
            <li>ISSN: <strong className="font-semibold tabular-nums text-white">{journal.issnOnline}</strong></li>
            <li className="hidden lg:block">Crossref DOI: <strong className="font-semibold tabular-nums text-white">{journal.doiPrefix}</strong></li>
            <li className="hidden xl:flex items-center gap-1 font-semibold text-[#7FD6A0]"><LockOpen className="h-3.5 w-3.5" aria-hidden />Open Access {journal.licence.name}</li>
          </ul>
          <AppLink to={paths.track} className="inline-flex items-center gap-1.5 font-semibold text-white hover:underline"><LocateFixed className="h-4 w-4" aria-hidden />Track Paper</AppLink>
        </div>
      </div>
    </div>
  )
}
