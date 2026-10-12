// Right rail of the submission page (reference order): recent submissions, indexing and archiving, fast-track milestones, editorial assistance.
import { journal, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ReactNode } from 'react'
import { Feed, Lock, Mail, Phone, Speed, Bolt, Support, VerifiedI } from './mi'

function Card({ icon, title, pill, children, tone = 'white' }: { icon: ReactNode; title: string; pill?: ReactNode; children: ReactNode; tone?: 'white' | 'low' }) {
  return (
    <section aria-label={title} className={`flex flex-col gap-3.5 rounded-xl p-5 shadow-sm ${tone === 'white' ? 'border border-[#DCC0BE]/40 bg-white' : 'bg-[#F1F3FF]'}`}>
      <div className={`flex items-center justify-between gap-2 rounded-lg px-3 py-1.5 ${tone === 'white' ? 'bg-[#F1F3FF]' : ''}`}>
        <div className="flex items-center gap-2 text-wine-900">{icon}<h2 className="font-newsreader text-base font-bold">{title}</h2></div>
        {pill}
      </div>
      {children}
    </section>
  )
}

const MILESTONES = [
  { dot: 'bg-wine-900', title: 'Initial Desk Screening', text: 'An editor checks scope, completeness and similarity.' },
  { dot: 'bg-ochre-700', title: 'Peer Review', text: 'Experts review the work against a published checklist.' },
  { dot: 'bg-bordeaux-700', title: 'Publication & DOI', text: 'Layout, Crossref DOI and author certificates.' },
]

export function SubmitAside() {
  const logos = visibleLogos()
  return (
    <aside aria-label="Submission quick reference" className="flex flex-col gap-6 lg:sticky lg:top-28">
      <Card icon={<Feed className="h-5 w-5" aria-hidden="true" />} title="Recent Submissions"
        pill={<span className="flex items-center gap-1 rounded-full bg-[#E9EDFF] px-2 py-0.5 font-work text-xs font-semibold text-wine-900"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-700" />Confidential</span>}>
        <p className="font-serif4 text-[15px] leading-6 text-[#564241]">Submissions are not listed publicly until an article is published. After you submit, follow your own paper with its Paper ID and email.</p>
        <AppLink to={paths.track} className="font-work text-xs font-bold text-wine-800 underline">Already submitted? Track your paper</AppLink>
        <p className="flex items-center justify-center gap-1 pt-1 font-work text-xs text-[#564241]"><Lock className="h-4 w-4 text-wine-900" aria-hidden="true" />Confidential submission queue</p>
      </Card>

      <Card icon={<VerifiedI className="h-5 w-5" aria-hidden="true" />} title="Indexing & Archiving"
        pill={<span className="flex items-center gap-1 rounded-full bg-[#E9EDFF] px-2.5 py-0.5 font-work text-xs font-semibold text-ochre-700"><span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ochre-700" />{logos.length} Listed</span>}>
        <ul className="flex flex-col gap-2.5 rounded-lg bg-[#F1F3FF] p-2">
          {logos.map((l) => (
            <li key={l.id} className="flex h-11 items-center justify-center rounded-lg border border-[#DCC0BE]/30 bg-white p-2.5 shadow-sm">
              {l.file ? <img src={`/shared/indexing/${l.file}`} alt={l.name} className="max-h-6 max-w-[140px] object-contain" /> : <span className="font-work text-sm font-bold text-wine-900">{l.name}</span>}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-2 font-work text-[11px] text-[#564241]">
          <span>Permanent DOI under 10.55041</span>
          <AppLink to={paths.about('indexing')} className="font-semibold text-ochre-700 underline">Indexing details</AppLink>
        </div>
      </Card>

      <section aria-label="Editorial milestones" className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2.5 rounded-lg bg-[#F1F3FF] px-3 py-1.5 text-wine-900"><Speed className="h-5 w-5" aria-hidden="true" /><h2 className="font-newsreader text-lg font-bold">Editorial Milestones</h2></div>
        <ol className="relative flex flex-col gap-5 pl-6">
          {MILESTONES.map((m) => (
            <li key={m.title} className="relative">
              <span aria-hidden="true" className={`absolute -left-6 top-1.5 h-3 w-3 rounded-full ring-4 ring-[#E9EDFF] ${m.dot}`} />
              <h3 className="font-work text-xs font-bold text-[#141B2B]">{m.title}</h3>
              <p className="mt-0.5 font-serif4 text-xs leading-[18px] text-[#564241]">{m.text}</p>
            </li>
          ))}
        </ol>
        <div className="flex items-center gap-2 rounded-lg bg-[#E9EDFF] p-3"><Bolt className="h-5 w-5 text-wine-900" aria-hidden="true" /><span className="font-work text-xs font-bold text-wine-900">Every decision comes with written reasons</span></div>
      </section>

      <section aria-label="Editorial assistance" className="flex flex-col gap-3 rounded-xl bg-[#F1F3FF] p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-newsreader text-lg font-bold text-wine-900"><Support className="h-5 w-5" aria-hidden="true" />Editorial Assistance</h2>
        <p className="font-work text-xs leading-[18px] text-[#564241]">Facing difficulty with your submission or file upload? Write to the editorial office and we will help.</p>
        <div className="flex flex-col gap-1 font-work text-[11px] text-[#141B2B]">
          <a href={`mailto:${journal.email}`} className="flex min-h-[28px] items-center gap-1.5 break-all hover:text-wine-900 hover:underline"><Mail className="h-4 w-4 shrink-0" aria-hidden="true" />{journal.email}</a>
          <span className="flex items-center gap-1.5 text-[#564241]"><Phone className="h-4 w-4 shrink-0" aria-hidden="true" />WhatsApp: {journal.whatsapp}</span>
        </div>
      </section>
    </aside>
  )
}
