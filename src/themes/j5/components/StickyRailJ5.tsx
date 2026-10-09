// A sidebar that stays in view while the long centre column scrolls. A rail taller than the screen scrolls until its bottom edge is visible,
// then stays pinned there, so every card is reachable without an inner scrollbar. Below `minWidth` it is an ordinary block.
import { useEffect, useRef, useState, type ReactNode } from 'react'

const TOP_OFFSET = 64 // clears the sticky navigation row
const BOTTOM_GAP = 24

export function StickyRailJ5({ children, className = '', label, minWidth = 1024 }: { children: ReactNode; className?: string; label?: string; minWidth?: number }) {
  const ref = useRef<HTMLElement>(null)
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
  return <aside ref={ref} aria-label={label} className={className} style={top === null ? undefined : { position: 'sticky', top, alignSelf: 'start' }}>{children}</aside>
}
