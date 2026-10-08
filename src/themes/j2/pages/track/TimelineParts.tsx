// Progress ring, vertical stage timeline and the current-stage panel for the Journal 2 track page.
import { useEffect, useState } from 'react'
import { formatDate } from '../../../../core/lib/format'
import { stageInfo } from '../../../../core/lib/stageInfo'
import { STAGES, type TrackedPaper } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { Check, Info, Timer } from '../../icons'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

/** True after the first paint, so CSS transitions can run from the empty state. */
function useMounted() {
  const [m, setM] = useState(false)
  useEffect(() => { const t = requestAnimationFrame(() => setM(true)); return () => cancelAnimationFrame(t) }, [])
  return m
}

/** Number of stages finished (the current stage counts once it is a final "done" stage). */
export const stagesDone = (p: TrackedPaper) => (stageInfo(p).tone === 'done' ? p.stageIndex + 1 : p.stageIndex)

export function ProgressRing({ paper }: { paper: TrackedPaper }) {
  const reduced = useReducedMotion()
  const mounted = useMounted()
  const current = paper.stageIndex + 1
  const r = 52, c = 2 * Math.PI * r
  const frac = current / STAGES.length
  const shown = reduced || mounted ? frac : 0
  return (
    <figure className="m-0 flex flex-col items-center">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" role="img" aria-label={`Stage ${current} of ${STAGES.length}: ${STAGES[paper.stageIndex].label}`}>
          <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" className="stroke-graphite-200" />
          <circle cx="64" cy="64" r={r} fill="none" strokeWidth="10" strokeLinecap="round" className="stroke-brand-700"
            strokeDasharray={c} strokeDashoffset={c * (1 - shown)} style={{ transition: reduced ? 'none' : 'stroke-dashoffset 1.1s cubic-bezier(.22,.8,.3,1)' }} />
        </svg>
        <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-extrabold text-brand-800">{current}<span className="text-lg font-semibold text-graphite-500">/{STAGES.length}</span></span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-accent-700">stage</span>
        </div>
      </div>
      <figcaption className="mt-2 text-center font-display text-base font-bold text-graphite-800">{STAGES[paper.stageIndex].label}</figcaption>
    </figure>
  )
}

export function StageTimeline({ paper }: { paper: TrackedPaper }) {
  const reduced = useReducedMotion()
  const mounted = useMounted()
  const done = stagesDone(paper)
  const fill = reduced || mounted ? (STAGES.length > 1 ? Math.min(100, (paper.stageIndex / (STAGES.length - 1)) * 100) : 0) : 0
  return (
    <ol aria-label="Paper stages" className="relative">
      <span aria-hidden="true" className="absolute bottom-4 left-[15px] top-4 w-0.5 bg-graphite-200" />
      <span aria-hidden="true" className="absolute left-[15px] top-4 w-0.5 bg-brand-700" style={{ height: `calc((100% - 2rem) * ${fill / 100})`, transition: reduced ? 'none' : 'height 1.1s cubic-bezier(.22,.8,.3,1)' }} />
      {STAGES.map((s, i) => {
        const isDone = i < done
        const isCurrent = i === paper.stageIndex && !isDone
        const date = paper.stageDates[s.id]
        return (
          <li key={s.id} aria-current={isCurrent ? 'step' : undefined}
            className={cx('relative flex gap-4 pb-5 last:pb-0', !reduced && 'animate-fade-in')} style={reduced ? undefined : { animationDelay: `${i * 70}ms`, animationFillMode: 'backwards' }}>
            <span aria-hidden="true" className={cx('relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              isDone ? 'bg-brand-800 text-white' : isCurrent ? 'bg-white text-brand-800 ring-4 ring-accent-200 border-2 border-brand-800' : 'border-2 border-graphite-300 bg-white text-graphite-500')}>
              {isDone ? <Check className="h-5 w-5" /> : i + 1}
            </span>
            <div className="min-w-0 pt-1">
              <p className={cx('text-sm font-semibold', isCurrent ? 'text-brand-800' : isDone ? 'text-graphite-800' : 'text-graphite-600')}>
                {s.label}
                <span className="sr-only">{isDone ? ' (completed)' : isCurrent ? ' (current stage)' : ' (upcoming)'}</span>
                {isCurrent && <span aria-hidden="true" className="ml-2 rounded-chip bg-accent-50 px-1.5 py-0.5 text-[11px] font-semibold text-accent-800 ring-1 ring-inset ring-accent-200">Now</span>}
              </p>
              <p className="text-xs text-graphite-600">{date ? formatDate(date) : isDone ? 'Completed' : 'Pending'}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

const TONES = {
  wait: { box: 'border-accent-200 bg-accent-50', icon: 'text-accent-700', label: 'In progress', Icon: Timer },
  action: { box: 'border-cta-200 bg-cta-50', icon: 'text-cta-700', label: 'Your turn', Icon: Info },
  done: { box: 'border-brand-200 bg-brand-50', icon: 'text-brand-700', label: 'Complete', Icon: Check },
} as const

export function StagePanel({ paper }: { paper: TrackedPaper }) {
  const info = stageInfo(paper)
  const t = TONES[info.tone]
  return (
    <section aria-labelledby="stage-now-h" className={cx('rounded-panel border p-5', t.box)}>
      <p className={cx('flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider', t.icon)}><t.Icon className="h-4 w-4" aria-hidden="true" />{t.label}</p>
      <h3 id="stage-now-h" className="mt-1 font-display text-lg font-bold text-graphite-800">{info.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-graphite-700">{info.text}</p>
    </section>
  )
}
