// Call for Papers: the issue, a live countdown to the deadline, and the Submit call to action.
import { useEffect, useState } from 'react'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import type { CallForPapers } from '../../../../core/types'
import { ButtonLink } from '../../components/Button'
import { Container, Label } from '../../components/primitives'
import { Submit } from '../../icons'

function useCountdown(deadline: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  const ms = Math.max(0, new Date(deadline).getTime() - now)
  return { d: Math.floor(ms / 86400000), h: Math.floor(ms / 3600000) % 24, m: Math.floor(ms / 60000) % 60, s: Math.floor(ms / 1000) % 60, over: ms === 0 }
}

export function CallPanel({ cfp }: { cfp: CallForPapers }) {
  const c = useCountdown(cfp.deadline)
  const units: [string, number][] = [['Days', c.d], ['Hours', c.h], ['Minutes', c.m], ['Seconds', c.s]]
  return (
    <section aria-labelledby="cfp-title" className="py-16 sm:py-24">
      <Container>
        <div className="relative isolate overflow-hidden rounded-pane bg-abyss-900 text-white">
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:linear-gradient(to_left,black,transparent_75%)]" />
          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[minmax(0,1fr)_26rem] lg:items-center">
            <div>
              <Label className="text-azure-300">Call for papers</Label>
              <h2 id="cfp-title" className="mt-2 font-serif4 text-[1.75rem] font-semibold leading-[1.15] tracking-tight sm:text-[2.125rem]">{cfp.issueName}</h2>
              <p className="mt-3 max-w-xl text-base text-abyss-200">Original research, review articles and short communications across the nine research areas. Accepted papers appear in the next monthly issue.</p>
              <p className="mt-4 text-sm tabular-nums text-abyss-300">Deadline {formatDate(cfp.deadline.slice(0, 10))} · Publication {formatDate(cfp.expectedPublication)}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                <ButtonLink to={paths.submit} variant="cta"><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</ButtonLink>
                <ButtonLink to={paths.policy('author-guidelines')} variant="onDark">Author guidelines</ButtonLink>
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-abyss-300">{c.over ? 'Submissions are closed for this issue' : 'Time left to submit'}</p>
              <ul className="grid grid-cols-4 gap-2" role="timer" aria-label={`${c.d} days, ${c.h} hours, ${c.m} minutes left`}>
                {units.map(([u, v]) => (
                  <li key={u} className="rounded-ctl border border-white/15 bg-white/5 px-2 py-3 text-center">
                    <span className="block font-serif4 text-[2rem] font-semibold leading-none tabular-nums">{String(v).padStart(2, '0')}</span>
                    <span className="mt-1.5 block text-xs text-abyss-300">{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
