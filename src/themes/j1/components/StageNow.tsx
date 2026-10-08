import { CheckCircle2, History, Info } from './uiIcons'
import type { StageInfo } from '../../../core/lib/stageInfo'

const STYLE = {
  wait: { box: 'border-line bg-mist', icon: History, color: 'text-ink-muted' },
  action: { box: 'border-navy-200 bg-navy-50', icon: Info, color: 'text-navy-500' },
  done: { box: 'border-oa/30 bg-oa-soft', icon: CheckCircle2, color: 'text-oa' },
} as const

/** "What's happening now" card shown under the stage timeline. */
export function StageNow({ info }: { info: StageInfo }) {
  const s = STYLE[info.tone]
  const Icon = s.icon
  return (
    <div role="status" className={`mt-8 flex gap-3 rounded-card border p-4 sm:p-5 ${s.box}`}>
      <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${s.color}`} aria-hidden />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted">What is happening now</p>
        <h3 className="mt-0.5 font-serif text-lg font-semibold text-navy">{info.title}</h3>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-ink">{info.text}</p>
      </div>
    </div>
  )
}
