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
  const parts = [['Days', Math.floor(s / 86400)], ['Hours', Math.floor((s % 86400) / 3600)], ['Min', Math.floor((s % 3600) / 60)], ['Sec', s % 60]] as const
  return (
    <div role="timer" aria-label="Time left to submit" className="flex gap-2">
      {parts.map(([label, v]) => (
        <div key={label} className={`min-w-0 flex-1 rounded px-1 py-2 text-center ${tone === 'dark' ? 'bg-white/10' : 'border border-line bg-paper text-navy'}`}>
          <div className="font-serif text-2xl font-semibold tabular-nums">{String(v).padStart(2, '0')}</div>
          <div className={`text-[10px] uppercase tracking-wider ${tone === 'dark' ? 'text-navy-100' : 'text-ink-muted'}`}>{label}</div>
        </div>
      ))}
    </div>
  )
}
