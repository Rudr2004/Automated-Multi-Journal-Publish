// Live countdown to a deadline (days, hours, minutes, seconds). Updates once a second.
import { useEffect, useState } from 'react'

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [['Days', Math.floor(s / 86400)], ['Hours', Math.floor((s % 86400) / 3600)], ['Min', Math.floor((s % 3600) / 60)], ['Sec', s % 60]] as const
}

export function CountdownJ5({ deadline, tone = 'dark' }: { deadline: string; tone?: 'dark' | 'light' }) {
  const target = new Date(deadline).getTime()
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t) }, [])
  const left = target - now
  const cell = tone === 'dark' ? 'border-white/15 bg-white/5 text-white' : 'border-obsidian-200 bg-white text-obsidian-900'
  const sub = tone === 'dark' ? 'text-obsidian-300' : 'text-obsidian-600'
  return (
    <div role="timer" aria-label={left > 0 ? `${parts(left)[0][1]} days left until the submission deadline` : 'Submission window closed'} className="grid grid-cols-4 gap-1.5 text-center">
      {parts(left).map(([label, v]) => (
        <div key={label} className={`rounded border px-1 py-2 ${cell}`}>
          <p className="font-newsreader text-xl font-semibold tabular-nums leading-none">{String(v).padStart(2, '0')}</p>
          <p className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.06em] ${sub}`}>{label}</p>
        </div>
      ))}
    </div>
  )
}
