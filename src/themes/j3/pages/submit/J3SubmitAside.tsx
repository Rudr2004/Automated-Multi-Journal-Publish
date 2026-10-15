// Right rail of the Journal 3 submission page: checklist, recent submissions (only when the journal has any), review stages, charges and help.
import { useEffect, useState } from 'react'
import { MdOutlineCheckCircle, MdOutlineDownload, MdOutlineSouth } from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { api } from '../../../../core/api'
import { ACCEPTED_EXT, MAX_FILE_MB } from '../../../../core/lib/submission'
import { AppLink } from '../../../../core/router'
import { STAGES, type HomeData } from '../../../../core/types'
import { cx } from '../../components/primitives'
import { useToast } from '../../components/Toast'

const DOWNLOADS = [['Manuscript Template', 'DOCX'], ['Sample Acceptance Certificate', 'PDF'], ['Sample Certificate', 'PDF']] as const

function Card({ title, id, tone = 'white', children }: { title: string; id: string; tone?: 'white' | 'mist'; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className={cx('rounded-tile border border-j3paper-rule p-5', tone === 'mist' ? 'bg-j3paper-cool' : 'bg-white')}>
      <div className="mb-3 flex items-center gap-2 border-b border-j3paper-rule pb-2.5">
        <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-ember-500" />
        <h2 id={id} className="font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-night-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

const CHECKLIST: [string, string][] = [
  ['Manuscript file', `A Word file (${ACCEPTED_EXT.join(', ')}) of up to ${MAX_FILE_MB} MB, with figures and tables included.`],
  ['Manuscript', 'Include the title, abstract and keywords inside the file.'],
  ['Authors', 'Every author listed with a name and affiliation. Co-authors each receive a certificate.'],
  ['Declarations', 'Original work, not under review elsewhere, and consent to process your data.'],
]

type Recent = HomeData['recentSubmissions']

function RecentCard() {
  const [items, setItems] = useState<Recent>([])
  useEffect(() => {
    let live = true
    api.getHome().then((h) => live && setItems(h.recentSubmissions ?? [])).catch(() => undefined)
    return () => { live = false }
  }, [])
  if (!items.length) return null
  return (
    <Card id="recent-h" title="Recently submitted papers">
      {/* Scrolls upwards; hover or focus pauses it, and reduced-motion visitors can scroll by hand. */}
      <div className="j1-pausable h-52 overflow-hidden motion-reduce:overflow-y-auto [mask-image:linear-gradient(to_bottom,transparent,#000_10px,#000_calc(100%-14px),transparent)]">
        <div className="j1-scroll-up" style={{ ['--j1-scroll-duration' as string]: `${Math.max(18, items.length * 6)}s` }}>
          {[0, 1].map((copy) => (
            <ul key={copy} aria-hidden={copy > 0 || undefined} className="divide-y divide-j3paper-rule border-b border-j3paper-rule">
              {items.slice(0, 5).map((s) => (
                <li key={`${copy}-${s.title ?? s.subject}-${s.minutes}`} className="py-2.5">
                  <p className="font-inter text-[13px] font-semibold text-night-900">{s.institution}</p>
                  <p className="font-inter text-xs text-mauve-600">{s.title ?? s.subject}</p>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Card>
  )
}

export function J3SubmitAside() {
  const toast = useToast()
  return (
    <aside aria-label="Submission help" className="space-y-5">
      <Card id="check-h" title="Submission checklist">
        <ul className="space-y-2.5 font-inter text-[13px] leading-snug text-mauve-700">
          {CHECKLIST.map(([k, v]) => (
            <li key={k} className="flex items-start gap-2"><MdOutlineCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-j3valid-700" aria-hidden="true" /><span><strong className="font-bold text-night-900">{k}:</strong> {v}</span></li>
          ))}
        </ul>
      </Card>
      <RecentCard />
      <Card id="stages-h" title="Editorial turnaround" tone="mist">
        <ol className="space-y-1 font-inter text-[13px] font-medium text-night-900">
          {STAGES.map((s, i) => (
            <li key={s.id}>
              <div className="flex items-center gap-2.5 rounded-tile border border-j3paper-rule bg-white px-2.5 py-1.5">
                <span aria-hidden="true" className={cx('flex h-5 w-5 shrink-0 items-center justify-center rounded-tile text-[11px] font-bold tabular-nums', i === STAGES.length - 1 ? 'bg-ember-500 text-night-900' : 'bg-iris-700 text-white')}>{i + 1}</span>{s.label}
              </div>
              {i < STAGES.length - 1 && <MdOutlineSouth className="mx-auto my-0.5 h-3.5 w-3.5 text-mauve-500" aria-hidden="true" />}
            </li>
          ))}
        </ol>
        <p className="mt-3 font-inter text-xs leading-relaxed text-mauve-600">Follow your paper at any time on the <AppLink to={paths.track} className="font-semibold text-iris-700 underline">Track My Paper</AppLink> page with your Paper ID and email.</p>
      </Card>
      <Card id="downloads-h" title="Author downloads">
        <ul className="space-y-2">
          {DOWNLOADS.map(([name, kind]) => (
            <li key={name}>
              <button type="button" onClick={() => toast(`${name} downloaded (simulated).`)} className="flex w-full items-center gap-2 border border-j3paper-rule bg-white px-3 py-2 text-left font-inter text-[13px] font-semibold text-iris-700 hover:border-iris-700">
                <MdOutlineDownload className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="min-w-0 flex-1">{name}</span>
                <span className="shrink-0 bg-j3paper-deep px-1.5 py-0.5 text-[10px] font-bold uppercase text-mauve-700">{kind}</span>
              </button>
            </li>
          ))}
        </ul>
      </Card>
      <Card id="help-h" title="Need editorial assistance?">
        <p className="font-inter text-[13px] text-mauve-700">Trouble with formatting, files or author details? Write to us.</p>
        <ul className="mt-2.5 space-y-1 font-inter text-[13px] text-mauve-700">
          <li><strong className="text-night-900">Editorial office:</strong> <a className="text-iris-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a></li>
          <li><strong className="text-night-900">WhatsApp:</strong> {journal.whatsapp}</li>
        </ul>
        <a href={`mailto:${journal.email}`} className="mt-3 inline-block font-inter text-[13px] font-bold text-iris-700 underline underline-offset-4 hover:text-iris-800">Email the editorial office</a>
      </Card>
    </aside>
  )
}
