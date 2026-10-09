import { CheckCircle2, Download, Mail, MessageCircle } from '../../components/uiIcons'
import type { ReactNode } from 'react'
import { Button } from '../../components/Button'
import { useToast } from '../../components/Toast'
import { Panel } from '../../components/primitives'
import { TrackForm } from '../../components/TrackForm'
import { AwardsCard } from '../../components/AwardsCard'
import { RecentSubmissionsCard } from '../../components/RecentSubmissionsCard'
import { journal } from '../../../../config/journals/j1'

const CHECKLIST = ['Manuscript in Word format (.doc / .docx)', 'Title, abstract and 3–8 keywords', 'All authors’ names and affiliations', 'Figures and tables inside the file', 'References with DOIs where available']
const inr = new Intl.NumberFormat('en-IN')

/** Left column of the submission page: progress, formatting guidelines, APC summary and the support desk (4 cards). */
export function HelpLeft({ children }: { children?: ReactNode }) {
  const toast = useToast()
  const wa = `https://wa.me/${journal.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent('Hello, I would like to submit a manuscript to ' + journal.name)}`
  return (
    <>
      {children}
      <Panel title="Author guidelines & formatting">
        <ul className="space-y-2 text-sm">{CHECKLIST.map((c) => <li key={c} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-oa" aria-hidden />{c}</li>)}</ul>
        <Button variant="outline" className="mt-4 w-full" onClick={() => toast('Manuscript template downloaded (simulated).')}><Download className="h-4 w-4" aria-hidden />Download template</Button>
      </Panel>
      <Panel title="APC summary" tone="paper">
        <p className="text-sm text-ink-muted">Free to submit. Pay only after acceptance.</p>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between"><dt>Indian authors</dt><dd className="font-semibold">₹{inr.format(journal.apc.inr)} + {journal.apc.gstPercent}% GST</dd></div>
          <div className="flex justify-between"><dt>International</dt><dd className="font-semibold">US${journal.apc.usd}</dd></div>
        </dl>
      </Panel>
      <Panel title="Author support desk">
        <a href={wa} target="_blank" rel="noreferrer" className="flex h-11 items-center justify-center gap-2 rounded border border-oa font-semibold text-oa hover:bg-oa-soft"><MessageCircle className="h-4 w-4" aria-hidden />Prefer WhatsApp? Submit on WhatsApp</a>
        <details className="group mt-3 rounded border border-line bg-paper px-3 py-2 text-sm">
          <summary className="cursor-pointer font-semibold text-navy">How to submit on WhatsApp</summary>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-ink">
            <li>Open a chat with <strong>{journal.whatsapp}</strong>.</li>
            <li>Send your <strong>Word file</strong> (.doc or .docx).</li>
            <li>In the next message, send the <strong>title, author names and your email</strong>.</li>
            <li>You get your <strong>Paper ID</strong> back on WhatsApp straight away. No login is needed.</li>
          </ol>
        </details>
        <p className="mt-3 flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-scholar" aria-hidden /><a href={`mailto:${journal.email}`} className="text-scholar hover:underline">{journal.email}</a></p>
        <p className="mt-1.5 flex items-center gap-2 text-sm"><MessageCircle className="h-4 w-4 text-scholar" aria-hidden />{journal.whatsapp}</p>
      </Panel>
    </>
  )
}

/** Right column of the submission page: the live Recent submissions feed, the achievements (awards) card and the track form (3 cards). */
export function HelpRight() {
  return (
    <>
      <RecentSubmissionsCard />
      <AwardsCard />
      <Panel title="Track existing submission"><TrackForm idPrefix="submit-trk" submitLabel="Check review status" /></Panel>
    </>
  )
}
