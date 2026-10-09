// A sidebar that stays in view while the long centre column scrolls (no empty strip beside it).
// Rails taller than the screen scroll normally until their bottom edge is visible, then stay pinned there, so every card is reachable
// without an inner scrollbar. Below the `xl` breakpoint the rail is an ordinary block (the columns stack).
import { useEffect, useRef, useState, type ReactNode } from 'react'

const TOP_OFFSET = 112 // clears the sticky main navigation and a little breathing room
const BOTTOM_GAP = 72 // leaves room for the floating back-to-top button below the pinned rail

export function StickyRail({ children, className = '', label, as = 'aside', minWidth = 1280 }: {
  children: ReactNode; className?: string
  /** Accessible name; used when the rail is an `aside`. */
  label?: string
  /** Render a plain `div` when the rail's cards are already landmarks of their own. */
  as?: 'aside' | 'div'
  /** Viewport width (px) from which the rail sticks; narrower screens get an ordinary block. */
  minWidth?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [top, setTop] = useState<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const wide = window.matchMedia(`(min-width: ${minWidth}px)`)
    const measure = () => {
      if (!wide.matches) { setTop(null); return }
      setTop(Math.min(TOP_OFFSET, Math.round(window.innerHeight - el.offsetHeight - BOTTOM_GAP)))
    }
    measure()
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null
    ro?.observe(el)
    window.addEventListener('resize', measure)
    wide.addEventListener?.('change', measure)
    return () => { ro?.disconnect(); window.removeEventListener('resize', measure); wide.removeEventListener?.('change', measure) }
  }, [minWidth])

  const style = top === null ? undefined : { position: 'sticky' as const, top, alignSelf: 'start' as const }
  return as === 'aside'
    ? <aside ref={ref} aria-label={label} className={className} style={style}>{children}</aside>
    : <div ref={ref} className={className} style={style}>{children}</div>
}
