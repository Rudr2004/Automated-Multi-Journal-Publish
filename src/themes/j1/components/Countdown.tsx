import { useEffect, useState } from 'react'

const remaining = (deadline: string) => Math.max(0, new Date(deadline).getTime() - Date.now())

/** Shows a live clock only within the last `windowDays` days before the deadline. */
export function Countdown({ deadline, windowDays = 5, tone = 'dark' }: { deadline: string; windowDays?: number; tone?: 'dark' | 'light' }) {
  const [ms, setMs] = useState(() => remaining(deadline))
  useEffect(() => {
    const t = setInterval(() => setMs(remaining(deadline)), 1000)
    return () => clearInterval(t)
  }, [deadline])

  if (ms <= 0 || ms > windowDays * 86400000) return null
  const s = Math.floor(ms / 1000)
  const two = (n: number) => String(n).padStart(2, '0')
  const parts = [[Math.floor(s / 86400), 'd'], [Math.floor((s % 86400) / 3600), 'h'], [Math.floor((s % 3600) / 60), 'm'], [s % 60, 's']] as const
  return (
    <div role="timer" aria-label="Time left to submit"
      className={`flex items-center justify-center gap-x-2 rounded border px-2 py-2 font-mono text-lg font-bold tabular-nums sm:text-xl ${tone === 'dark' ? 'border-white/20 bg-white/10 text-white' : 'border-line bg-white text-navy'}`}>
      {parts.map(([v, u], i) => (
        <span key={u} className="inline-flex items-baseline gap-x-2">
          {i > 0 && <span aria-hidden className="font-normal text-ink-muted">:</span>}
          <span>{two(v)}{u}</span>
        </span>
      ))}
    </div>
  )
}
