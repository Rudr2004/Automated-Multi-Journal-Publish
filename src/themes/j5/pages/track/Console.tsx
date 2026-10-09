// Result console of the Journal 5 (IJFRD) status page: paper header, six-stage tracker and the log table.
import type { ComponentType } from 'react'
import { formatDate } from '../../../../core/lib/format'
import { stageInfo } from '../../../../core/lib/stageInfo'
import { STAGES, type TrackedPaper } from '../../../../core/types'
import { CopyButton } from '../../components/form/Field'
import { Label, Tag, cx } from '../../components/primitives'
import { Calendar, Check, FactCheck, Payments, Publish, Review, Shield, Submit, TaskDone, type IconProps } from '../../icons'

const TRACK: { label: string; icon: ComponentType<IconProps> }[] = [
  { label: 'Submitted', icon: Submit }, { label: 'Screening', icon: Shield }, { label: 'Peer review', icon: Review },
  { label: 'Decision', icon: TaskDone }, { label: 'Payment', icon: Payments }, { label: 'Publication', icon: Publish },
]
/** Core has 8 stages; the console shows six. Screening and review share core stage 1. */
const MAP = [1, 2, 3, 4, 4, 5, 5, 5]

export function trackerState(p: TrackedPaper) {
  const complete = p.stageIndex >= 6
  let current = MAP[p.stageIndex] ?? 5
  if (p.stageIndex === 4 && p.payment === 'paid') current = 5
  return { complete, current }
}

export function Tracker({ paper }: { paper: TrackedPaper }) {
  const { complete, current } = trackerState(paper)
  const label = complete ? 'All six stages complete' : `Stage ${current + 1} of 6: ${TRACK[current].label}`
  return (
    <div role="group" aria-label={`Paper progress. ${label}`}>
      <ol className="relative grid gap-4 md:grid-cols-6 md:gap-2">
        <span aria-hidden="true" className="absolute left-[1.375rem] top-6 h-[calc(100%-3rem)] w-px bg-obsidian-300 md:left-[8%] md:top-[1.375rem] md:h-px md:w-[84%]" />
        {TRACK.map(({ label: l, icon: Icon }, i) => {
          const done = complete || i < current
          const now = !complete && i === current
          return (
            <li key={l} aria-current={now ? 'step' : undefined} className="relative flex items-center gap-3 md:flex-col md:items-start md:gap-2">
              <span className={cx('relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded border',
                done ? 'border-wine-700 bg-wine-800 text-white' : now ? 'border-ochre-600 bg-white text-wine-700 ring-2 ring-ochre-600/40' : 'border-obsidian-300 bg-white text-obsidian-500')}>
                {done ? <Check className="h-5 w-5" aria-hidden="true" /> : <Icon className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div>
                <p className="text-xs font-semibold tabular-nums text-obsidian-600">Stage {i + 1}</p>
                <p className="font-newsreader text-base font-semibold leading-tight text-obsidian-900">{l}</p>
                <p className="text-[13px] text-obsidian-600">{done ? 'Complete' : now ? 'In progress' : 'Upcoming'}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const TONE = { wait: 'In progress', action: 'Action needed', done: 'Complete' } as const

export function PaperHeader({ paper }: { paper: TrackedPaper }) {
  const info = stageInfo(paper)
  return (
    <div className="rounded border border-[#E6DCD0] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6DCD0] bg-bordeaux-900 px-5 py-3 text-white">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1"><Label className="text-ochre-300">Paper ID</Label><strong className="break-all font-newsreader text-xl font-semibold tabular-nums tracking-wide">{paper.paperId}</strong></div>
        <CopyButton tone="dark" text={paper.paperId} label="Copy" done="Paper ID copied" />
      </div>
      <div className="p-5 sm:p-6">
        <h2 id="paper-h" className="font-newsreader text-[1.375rem] font-semibold leading-snug text-obsidian-900 sm:text-[1.625rem]">{paper.title}</h2>
        <p className="mt-2 text-[15px] text-obsidian-600"><span className="sr-only">Authors: </span>{paper.authors.join(', ')}</p>
        <div className="mt-6"><Tracker paper={paper} /></div>
        <div className={cx('mt-6 rounded border p-4', info.tone === 'action' ? 'border-wine-700 bg-ochre-50' : 'border-[#E6DCD0] bg-[#F4EEE6]')}>
          <Tag tone={info.tone === 'action' ? 'azure' : 'plain'}>{TONE[info.tone]}</Tag>
          <h3 className="mt-2 font-newsreader text-lg font-semibold text-obsidian-900">{info.title}</h3>
          <p className="mt-1 text-[15px] leading-relaxed text-obsidian-700">{info.text}</p>
        </div>
      </div>
    </div>
  )
}

export function LogTable({ paper }: { paper: TrackedPaper }) {
  const info = stageInfo(paper)
  return (
    <section aria-labelledby="log-h" className="rounded border border-[#E6DCD0] bg-white">
      <h3 id="log-h" className="border-b border-[#E6DCD0] bg-[#F4EEE6] px-5 py-3 font-newsreader text-lg font-semibold text-obsidian-900">Activity log</h3>
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Every stage of the paper with its status and date</caption>
        <thead>
          <tr className="border-b border-[#E6DCD0] text-xs uppercase tracking-[0.06em] text-obsidian-600">
            <th scope="col" className="px-5 py-2.5 font-semibold">Stage</th>
            <th scope="col" className="px-2 py-2.5 font-semibold">Status</th>
            <th scope="col" className="px-5 py-2.5 text-right font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {STAGES.map((s, i) => {
            const past = i < paper.stageIndex
            const now = i === paper.stageIndex
            const status = past ? 'Complete' : now ? (info.tone === 'done' ? 'Complete' : info.tone === 'action' ? 'Action needed' : 'In progress') : 'Upcoming'
            const date = paper.stageDates[s.id]
            return (
              <tr key={s.id} aria-current={now ? 'step' : undefined} className={cx('border-b border-[#E6DCD0] align-top last:border-b-0', now && 'bg-ochre-50')}>
                <th scope="row" className="px-5 py-3 font-semibold text-obsidian-900">
                  <span className="mr-2 tabular-nums text-obsidian-600">{String(i + 1).padStart(2, '0')}</span>{s.label}
                  {i === 2 && paper.decisionNote && (past || now) && <span className="mt-1 block pl-7 text-[13px] font-normal text-obsidian-600">Editor’s note: {paper.decisionNote}</span>}
                </th>
                <td className={cx('px-2 py-3 font-medium', status === 'Upcoming' ? 'text-obsidian-500' : 'text-obsidian-900')}>{status}</td>
                <td className="px-5 py-3 text-right tabular-nums text-obsidian-600">{date ? formatDate(date) : 'Pending'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}

const PAYLABEL = { 'not-due': 'Not due yet', due: 'Payment due', verifying: 'Verifying proof', paid: 'Paid' } as const

/** Four summary tiles above the console, all derived from the tracked paper. */
export function KpiTiles({ paper }: { paper: TrackedPaper }) {
  const { complete, current } = trackerState(paper)
  const dates = Object.values(paper.stageDates).filter(Boolean) as string[]
  const last = dates.sort().slice(-1)[0]
  const ready = paper.documents.filter((d) => d.available).length
  const tiles = [
    { icon: Review, label: 'Current stage', value: complete ? 'Complete' : TRACK[current].label, note: complete ? 'All six stages done' : `Stage ${current + 1} of 6` },
    { icon: Payments, label: 'Payment', value: PAYLABEL[paper.payment], note: 'Article processing charge' },
    { icon: FactCheck, label: 'Documents ready', value: `${ready} of ${paper.documents.length}`, note: 'Invoice, certificate, forms' },
    { icon: Calendar, label: 'Last update', value: last ? formatDate(last) : 'Pending', note: 'Latest stage date' },
  ]
  return (
    <ul aria-label="Paper summary" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {tiles.map(({ icon: Icon, label, value, note }) => (
        <li key={label} className="flex gap-3 rounded border border-[#E6DCD0] bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-wine-800 text-ochre-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[0.06em] text-obsidian-600">{label}</p><p className="font-newsreader text-lg font-semibold leading-tight tabular-nums text-obsidian-900">{value}</p><p className="text-[13px] text-obsidian-600">{note}</p></div>
        </li>
      ))}
    </ul>
  )
}
