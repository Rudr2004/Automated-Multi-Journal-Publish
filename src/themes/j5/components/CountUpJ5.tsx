// Counts a figure such as "14 days" or "9 Articles" up from zero when it scrolls into view. Non-numeric values and reduced-motion visitors see it as is.
import { useEffect, useRef, useState } from 'react'

const NUMBER = /^([^A-Za-z\d]*)(\d[\d,]*(?:\.\d+)?)(.*)$/
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function CountUpJ5({ value, durationMs = 1100 }: { value: string; durationMs?: number }) {
  const match = value.match(NUMBER)
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState<string | null>(match && !reduced() ? '0' : null)

  useEffect(() => {
    if (!match || reduced()) return
    const target = parseFloat(match[2].replace(/,/g, ''))
    const decimals = match[2].includes('.') ? match[2].split('.')[1].length : 0
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
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { io.disconnect(); run() } }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(frame) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  if (!match || shown === null) return <span ref={ref}>{value}</span>
  return <span ref={ref} className="tabular-nums" aria-label={value}>{match[1]}{shown}{match[3]}</span>
}
