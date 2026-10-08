// Counts a figure such as "8", "100%" or "~14 days" up from zero when it scrolls into view. Values without a leading number ("Monthly", "CC BY 4.0") show as they are.
// Nothing animates when the visitor prefers reduced motion.
import { useEffect, useRef, useState } from 'react'

const NUMBER = /^([^A-Za-z\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/
const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function CountUp({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const match = value.match(NUMBER)
  const ref = useRef<HTMLSpanElement>(null)
  const [reduce] = useState(reducedMotion)
  const [shown, setShown] = useState<string | null>(match && !reduce ? '0' : null)

  useEffect(() => {
    if (!match || reduce) return
    const raw = match[2]
    const target = parseFloat(raw.replace(/,/g, ''))
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
    let frame = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs)
        const v = target * (1 - Math.pow(1 - t, 3))
        setShown(decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US'))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { run(); return () => cancelAnimationFrame(frame) }
    const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { io.disconnect(); run() } }, { threshold: 0.15 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce])

  if (!match || shown === null) return <span ref={ref}>{value}</span>
  return <span ref={ref} className="tabular-nums" aria-label={value}>{match[1]}{shown}{match[3]}</span>
}
