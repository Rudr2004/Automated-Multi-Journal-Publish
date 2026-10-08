import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const NUMBER = /^([^A-Za-z\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/

/** Counts a figure such as "1,248", "38%" or "14 days" up from zero when it scrolls into view. Non-numeric values show as is. */
export function CountUp({ value, durationMs = 1200 }: { value: string; durationMs?: number }) {
  const reduce = useReducedMotion()
  const match = value.match(NUMBER)
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(match && !reduce ? '0' : null)

  useEffect(() => {
    if (!match || reduce) return
    const [, , raw] = match
    const target = parseFloat(raw.replace(/,/g, ''))
    const decimals = raw.includes('.') ? raw.split('.')[1].length : 0
    let frame = 0
    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs)
        const eased = 1 - Math.pow(1 - t, 3)
        const v = target * eased
        setShown(decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('en-US'))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) { run(); return }
    const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { io.disconnect(); run() } }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, reduce])

  if (!match || shown === null) return <span ref={ref}>{value}</span>
  const [, prefix, , suffix] = match
  return <span ref={ref} className="tabular-nums" aria-label={value}>{prefix}{shown}{suffix}</span>
}
