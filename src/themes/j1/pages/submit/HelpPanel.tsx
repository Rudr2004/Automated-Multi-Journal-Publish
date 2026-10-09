import { CheckCircle2, Download, Mail, MessageCircle } from '../../components/uiIcons'
import type { ReactNode } from 'react'
import { MdOutlineChecklist, MdOutlineDescription, MdOutlineLink, MdOutlineLockOpen, MdOutlineMarkEmailRead, MdOutlinePublic, MdOutlineRateReview, MdOutlineSchedule, MdOutlineSupportAgent, MdOutlineVerified, MdOutlineWorkspacePremium } from 'react-icons/md'
import { Panel } from '../../components/primitives'
import { TrackForm } from '../../components/TrackForm'
import { AwardsCard } from '../../components/AwardsCard'
import { RecentSubmissionsCard } from '../../components/RecentSubmissionsCard'
import { AppLink } from '../../../../core/router'
import { paths } from '../../../../config/routes'
import { journal, visibleLogos } from '../../../../config/journals/j1'

const CHECKLIST = ['Manuscript in Word format (.doc / .docx)', 'Title, abstract and 3–8 keywords', 'All authors’ names and affiliations', 'Figures and tables inside the file', 'References with DOIs where available']
const inr = new Intl.NumberFormat('en-IN')

// Real files generated for the prototype (see public/journals/j1/downloads).
const TEMPLATE_DOCX = '/journals/j1/downloads/IJMAT-manuscript-template.docx'
const CHECKLIST_PDF = '/journals/j1/downloads/IJMAT-author-checklist.pdf'

const REVIEW_STAGES = [
  { title: 'Screening', text: 'The editor checks scope, quality and plagiarism.' },
  { title: 'Peer review', text: 'A reviewer’s report is added when the editor asks for one.' },
  { title: 'Decision & revisions', text: 'Approve, revise or reject, with the reason logged.' },
  { title: 'Publication & DOI', text: `Crossref DOI ${journal.doiPrefix} and ${journal.licence.name} publication.` },
]

const fileLink = 'flex min-h-10 items-center gap-2.5 rounded border border-line bg-white px-3 py-2 text-[13px] font-semibold text-navy hover:border-scholar hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar'

/** Left column of the submission page: progress, formatting guidelines, trust, review timeline, APC summary and the support desk. */
export function HelpLeft({ children }: { children?: ReactNode }) {
  const wa = `https://wa.me/${journal.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello, I would like to submit a manuscript to ' + journal.name)}`
  // Only index names the config marks as "Listed" (no claims beyond the config).
  const listed = visibleLogos().filter((l) => l.status === 'Listed').slice(0, 3).map((l) => l.name)
  return (
    <>
      {children}
      <section aria-labelledby="guide-h" className="border-2 border-scholar bg-white">
        <header className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <MdOutlineDescription className="h-5 w-5 text-scholar" aria-hidden />
          <h3 id="guide-h" className="font-serif text-[1.0625rem] font-semibold leading-snug text-navy">Author guidelines &amp; formatting</h3>
        </header>
        <div className="p-4">
          <ul className="space-y-2 text-sm">{CHECKLIST.map((c) => <li key={c} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-oa" aria-hidden />{c}</li>)}</ul>
          <div className="mt-4 space-y-2">
            <a href={TEMPLATE_DOCX} download className={fileLink}><Download className="h-4 w-4 shrink-0 text-scholar" aria-hidden /><span className="min-w-0 flex-1">Word template</span><span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">DOCX</span></a>
            <a href={CHECKLIST_PDF} download className={fileLink}><MdOutlineChecklist className="h-4 w-4 shrink-0 text-scholar" aria-hidden /><span className="min-w-0 flex-1">Author guidelines checklist</span><span className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">PDF</span></a>
          </div>
        </div>
      </section>
      <Panel title="Scholar trust & protections">
        <ul className="space-y-2.5 text-[13px] text-ink">
          <li className="flex gap-2"><MdOutlineLockOpen className="mt-0.5 h-4 w-4 shrink-0 text-scholar" aria-hidden /><span><strong className="text-navy">Copyright retained.</strong> Authors keep their copyright ({journal.licence.name}).</span></li>
          <li className="flex gap-2"><MdOutlineLink className="mt-0.5 h-4 w-4 shrink-0 text-scholar" aria-hidden /><span><strong className="text-navy">Crossref DOI</strong> with prefix {journal.doiPrefix}.</span></li>
          {listed.length > 0 && <li className="flex gap-2"><MdOutlinePublic className="mt-0.5 h-4 w-4 shrink-0 text-scholar" aria-hidden /><span><strong className="text-navy">Discoverable:</strong> listed in {listed.join(', ')}.</span></li>}
          <li className="flex gap-2"><MdOutlineMarkEmailRead className="mt-0.5 h-4 w-4 shrink-0 text-scholar" aria-hidden /><span><strong className="text-navy">Instant Paper ID</strong> on submission.</span></li>
        </ul>
      </Panel>
      <section aria-labelledby="rev-h" className="border border-line bg-white">
        <header className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <MdOutlineRateReview className="h-5 w-5 text-scholar" aria-hidden />
          <h3 id="rev-h" className="font-serif text-[1.0625rem] font-semibold leading-snug text-navy">Peer review process</h3>
        </header>
        <ol className="p-4">
          {REVIEW_STAGES.map((s, i) => (
            <li key={s.title} className="relative flex gap-3 pb-4 last:pb-0">
              {i < REVIEW_STAGES.length - 1 && <span aria-hidden className="absolute left-3 top-7 h-[calc(100%-1.75rem)] w-px bg-line" />}
              <span aria-hidden className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold tabular-nums text-white">{i + 1}</span>
              <span className="min-w-0"><span className="block text-[13px] font-bold text-navy">{s.title}</span><span className="block text-xs text-ink-muted">{s.text}</span></span>
            </li>
          ))}
        </ol>
      </section>
      <Panel title="APC summary" tone="paper">
        <p className="text-sm text-ink-muted">Free to submit. Pay only after acceptance.</p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between gap-2"><dt>Indian authors</dt><dd className="text-right font-semibold">₹{inr.format(journal.apc.inr)} + {journal.apc.gstPercent}% GST</dd></div>
          <div className="flex justify-between gap-2"><dt>International</dt><dd className="font-semibold">US${journal.apc.usd}</dd></div>
        </dl>
      </Panel>
      <section aria-labelledby="desk-h" className="border border-line bg-white">
        <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <h3 id="desk-h" className="flex items-center gap-2 font-serif text-[1.0625rem] font-semibold leading-snug text-navy"><MdOutlineSupportAgent className="h-5 w-5 text-scholar" aria-hidden />Author support desk</h3>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-[#B9E0C8] bg-[#ECFDF5] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#14633A]"><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[#1E9E5A]" />Active</span>
        </header>
        <div className="p-4">
          {/* PLACEHOLDER hours copied from the reference design; the client must confirm the real support hours before launch. */}
          <p className="mb-3 flex items-center gap-2 text-[13px] text-ink-muted"><MdOutlineSchedule className="h-4 w-4 shrink-0 text-scholar" aria-hidden />Mon–Sat, 9:00–18:00 IST</p>
          <a href={wa} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-2 rounded border border-oa px-3 py-2 text-center text-sm font-semibold leading-snug text-oa hover:bg-oa-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar"><MessageCircle className="h-4 w-4 shrink-0" aria-hidden /><span className="min-w-0 break-words">Prefer WhatsApp? Submit on WhatsApp</span></a>
          <details className="group mt-3 rounded border border-line bg-paper px-3 py-2 text-sm">
            <summary className="cursor-pointer font-semibold text-navy">How to submit on WhatsApp</summary>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-ink">
              <li>Open a chat with <strong>{journal.whatsapp}</strong>.</li>
              <li>Send your <strong>Word file</strong> (.doc or .docx).</li>
              <li>In the next message, send the <strong>title, author names and your email</strong>.</li>
              <li>You get your <strong>Paper ID</strong> back on WhatsApp straight away. No login is needed.</li>
            </ol>
          </details>
          <p className="mt-3 flex items-center gap-2 text-sm"><Mail className="h-4 w-4 shrink-0 text-scholar" aria-hidden /><a href={`mailto:${journal.email}`} className="min-w-0 break-all text-scholar hover:underline">{journal.email}</a></p>
          <p className="mt-1.5 flex items-center gap-2 text-sm"><MessageCircle className="h-4 w-4 shrink-0 text-scholar" aria-hidden />{journal.whatsapp}</p>
        </div>
      </section>
    </>
  )
}

/** Right column of the submission page: the live Recent submissions feed, the achievements (awards) card and the track form (3 cards). */
export function HelpRight() {
  return (
    <>
      <RecentSubmissionsCard />
      <AwardsCard />
      <Panel title="Track existing submission">
        <TrackForm idPrefix="submit-trk" submitLabel="Check review status" />
        <div className="mt-4 border-t border-line pt-3">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-muted">Institutional artifacts</p>
          <AppLink to={paths.verify()} className={fileLink}><MdOutlineWorkspacePremium className="h-4 w-4 shrink-0 text-scholar" aria-hidden /><span className="min-w-0 flex-1">Verify a publication certificate</span><MdOutlineVerified className="h-4 w-4 shrink-0 text-oa" aria-hidden /></AppLink>
        </div>
      </Panel>
    </>
  )
}
