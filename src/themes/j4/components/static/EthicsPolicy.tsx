// Journal 4 body of /policies/publication-ethics, laid out like the reference (seven numbered cards with card grids, tiles, criteria, left-border notices and a
// closing contact box). Wording follows IJECM's own policies (peer review, plagiarism, AI, conflicts, corrections, retraction); the reference's claims that J4 does not
// make (COPE compliance or membership, double-blind review, fixed similarity percentages, audit certification) are replaced by facts from those policies.
import type { ReactNode } from 'react'
import { MdOutlineMail as Mail } from 'react-icons/md'
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { Callout, SECTION, SectionHead, TickItem, type TocItem } from './Clauses'
import { cx } from '../primitives'

interface Sec { id: string; title: string; subtitle: string; body: ReactNode }

const Card = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded border border-slate-200 bg-slate-50 p-3.5">
    <h4 className="mb-1 text-sm font-bold text-[#0b2545]">{title}</h4>
    <p className="text-slate-600">{children}</p>
  </div>
)
const Sub = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="space-y-2">
    <h3 className="font-serif4 text-base font-bold text-[#0b2545]">{title}</h3>
    <p className="text-xs text-slate-600 sm:text-sm">{children}</p>
  </div>
)
const Notice = ({ tone, title, children }: { tone: 'sky' | 'amber' | 'rose'; title: string; children: ReactNode }) => (
  <div className={cx('rounded border-l-4 bg-slate-50 p-3.5', tone === 'sky' && 'border-sky-500', tone === 'amber' && 'border-amber-500', tone === 'rose' && 'border-rose-500')}>
    <strong className={cx('block text-sm', tone === 'sky' && 'text-sky-900', tone === 'amber' && 'text-amber-900', tone === 'rose' && 'text-rose-900')}>{title}</strong>
    <span>{children}</span>
  </div>
)
const Tile = ({ tone, big, label, note }: { tone: 'sky' | 'amber' | 'rose'; big: string; label: string; note: string }) => (
  <div className={cx('rounded-[8px] border p-4', tone === 'sky' && 'border-sky-200 bg-sky-50/60', tone === 'amber' && 'border-amber-200 bg-amber-50/60', tone === 'rose' && 'border-rose-200 bg-rose-50/60')}>
    <div className={cx('text-2xl font-bold', tone === 'sky' && 'text-[#0b2545]', tone === 'amber' && 'text-amber-800', tone === 'rose' && 'text-rose-700')}>{big}</div>
    <div className="mt-1 text-xs font-semibold text-slate-700">{label}</div>
    <p className="mt-0.5 text-[11px] text-slate-600">{note}</p>
  </div>
)

const sections: Sec[] = [
  {
    id: 's-duties-editors', title: 'Duties of the Editorial Board & Editors', subtitle: 'Editorial independence, fair play, confidentiality, and objective oversight',
    body: (
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <Callout tone="info" title="Publication Decisions">The editor-in-chief is responsible for deciding which submitted articles are published. The validity of the work and its importance to researchers and readers must always drive that decision.</Callout>
        <ul className="space-y-3 pl-2">
          <TickItem lead="Editorial Independence & Fair Play:">Manuscripts are judged on the quality and relevance of the work, never on nationality, gender, institution or ability to pay.</TickItem>
          <TickItem lead="Confidentiality:">Editors do not disclose a manuscript to anyone other than the corresponding author, reviewers and the publisher.</TickItem>
          <TickItem lead="Conflicts Managed:">Editors do not handle papers from their own institution or co-authors; those pass to another editor and the declaration is recorded.</TickItem>
          <TickItem lead="Checks Before Review:">An editor checks scope, completeness, ethics statements and the similarity-screening report before a paper goes to reviewers.</TickItem>
          <TickItem lead="Reference Standards:">Our practice is guided by COPE-style good-practice principles. IJECM is not a member of COPE and does not claim to be.</TickItem>
        </ul>
      </div>
    ),
  },
  {
    id: 's-duties-reviewers', title: 'Duties of Peer Reviewers', subtitle: 'Expertise contribution, constructive feedback, timelines, and objectivity',
    body: (
      <>
        <div className="mb-4 grid gap-4 text-xs sm:grid-cols-2">
          <Card title="Contribution to Editorial Decisions">Peer review helps the editor decide and, through constructive feedback, helps authors improve their manuscripts.</Card>
          <Card title="Promptness & Commitment">Reviewers tell the editor straight away if they are not qualified to assess a paper or cannot meet the 14-day target, so someone else can be asked.</Card>
          <Card title="Standards of Objectivity">Reviews are objective and courteous. Personal criticism of the authors is unacceptable; views are supported with reasons and references.</Card>
          <Card title="Competing Interests Disclosure">Reviewers decline papers from recent collaborators, colleagues at their institution or direct competitors, and keep every manuscript confidential.</Card>
        </div>
        <Callout tone="warn" title="Source Verification">Reviewers point out relevant published work that the authors have not cited, and report any substantial overlap between the manuscript and other published work to the editor.</Callout>
      </>
    ),
  },
  {
    id: 's-duties-authors', title: 'Duties & Obligations of Authors', subtitle: 'Accurate reporting, evidence on request, originality, and error reporting',
    body: (
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <Sub title="Reporting Standards & Methodological Integrity">Experimental, field and simulation studies must give enough detail on methods, instruments, software, settings and uncertainty for a competent group to repeat the work. Results must not be presented with more certainty than the evidence supports.</Sub>
        <Sub title="Data and Evidence">Work must be original, honestly reported and supported by data, models or calculations that the authors can produce on request.</Sub>
        <Sub title="Prohibition of Duplicate Submission">Fabricated or selectively reported measurements, manipulated images or plots, undisclosed re-use of one’s own published text, and duplicate submission are treated as malpractice. We investigate concerns in confidence and give authors the chance to respond.</Sub>
        <Sub title="Errors in Published Work">An author who finds a significant error in a published article should tell the editor promptly and cooperate in a correction or retraction.</Sub>
      </div>
    ),
  },
  {
    id: 's-plagiarism', title: 'Plagiarism Policy & Originality Screening', subtitle: 'Similarity screening, editor judgement, and text recycling',
    body: (
      <>
        <div className="mb-5 grid gap-4 text-center sm:grid-cols-3">
          <Tile tone="sky" big="Every paper" label="Similarity Screening" note="Checked at the editor’s first look" />
          <Tile tone="amber" big="Editor-read" label="A Report, Not a Percentage" note="Quotes, references and standard methods may match" />
          <Tile tone="rose" big="Heard first" label="Authors May Explain" note="Before any decision on overlap" />
        </div>
        <div className="space-y-3 text-xs leading-relaxed text-slate-700 sm:text-sm">
          <p><strong>Definition of Academic Misconduct:</strong> Copying text, figures, equations, tables or code without credit, close paraphrase that follows another source’s structure, presenting a published method or dataset as your own, and re-using your own earlier published text without saying so (text recycling).</p>
          <p><strong>Screening Protocol:</strong> Submissions are run through similarity-screening software and the editor reads the report. Unexplained overlap with a single source is a concern; matching quoted passages, reference lists and code-clause citations is expected. If overlap is found:</p>
          <ul className="list-disc space-y-1.5 pl-5 text-xs text-slate-600">
            <li><strong>Minor overlap:</strong> The manuscript is returned to the author for rewriting.</li>
            <li><strong>Substantial or deliberate copying:</strong> Rejection, and a report to the author’s institution in serious cases.</li>
            <li><strong>Published papers:</strong> Correction or retraction under the <AppLink to={paths.policy('retraction')} className="font-semibold text-cobalt-700 hover:underline">retraction policy</AppLink>.</li>
          </ul>
        </div>
      </>
    ),
  },
  {
    id: 's-ai-authorship', title: 'Authorship Criteria & AI Policy', subtitle: 'Who counts as an author, accountability, and generative tool disclosure',
    body: (
      <>
        <div className="mb-6 space-y-3">
          <h3 className="font-serif4 text-base font-bold text-[#0b2545]">Authorship Criteria</h3>
          <p className="text-xs text-slate-600">Authorship is limited to people who made a substantial contribution and who approve the final text. Every author should meet all four of the following:</p>
          <div className="grid gap-3 text-xs sm:grid-cols-2">
            {[
              'Substantial contribution to the conception or design of the work, or to the acquisition, analysis or interpretation of data.',
              'Drafting the work or revising it critically for important intellectual content.',
              'Approval of the final version to be published.',
              'Agreement to be accountable for the accuracy and integrity of the work.',
            ].map((t, n) => (
              <div key={t} className="rounded border border-slate-200 bg-slate-50 p-3"><span className="font-bold text-cobalt-700">Criterion {n + 1}:</span> {t}</div>
            ))}
          </div>
        </div>
        <div className="space-y-3 border-t border-slate-100 pt-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-purple-300 bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-900">AI &amp; Tool Governance</span>
            <h3 className="font-serif4 text-base font-bold text-[#0b2545]">Policy on Artificial Intelligence &amp; Generative Tools</h3>
          </div>
          <div className="space-y-2 rounded-md border border-rose-200 bg-rose-50 p-4 text-xs text-slate-700">
            <p className="font-semibold text-rose-900">1. AI tools do not qualify for authorship.</p>
            <p className="leading-relaxed text-rose-950/80">Generative tools cannot take responsibility for a work, so they cannot be listed as an author. You remain responsible for accuracy, references and the rights in anything a tool produced.</p>
          </div>
          <div className="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">2. Disclose AI assistance.</p>
            <p className="leading-relaxed text-slate-600">If a generative tool was used for text, code, analysis or figures, <strong>state it explicitly</strong> in the Methods or Acknowledgements, naming the tool, its version and what it was used for. Invented data, references or citations are treated as fabrication. See the <AppLink to={paths.policy('ai-policy')} className="font-semibold text-cobalt-700 hover:underline">AI policy</AppLink>.</p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 's-conflicts-interest', title: 'Conflict of Interest & Funding Disclosures', subtitle: 'Financial interests, personal relationships, and competing interests',
    body: (
      <div className="space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
        <p>A conflict is not wrongdoing; hiding one is a problem. Authors, reviewers and editors declare any financial or personal relationship that could inappropriately influence the work. Examples include:</p>
        <div className="grid gap-3 text-xs sm:grid-cols-3">
          <div className="rounded border border-slate-200 bg-slate-50 p-3"><span className="mb-1 block font-bold text-[#0b2545]">Financial Ties</span>Funding, consultancy, patents, or ownership of a company that makes or sells what the paper evaluates.</div>
          <div className="rounded border border-slate-200 bg-slate-50 p-3"><span className="mb-1 block font-bold text-[#0b2545]">Relationships</span>Client, employer or collaborator links to the organisations studied, and projects the author was paid to deliver.</div>
          <div className="rounded border border-slate-200 bg-slate-50 p-3"><span className="mb-1 block font-bold text-[#0b2545]">Competing Interests</span>A rival method, a pending patent application, or a close tie to the authors under review.</div>
        </div>
        <p className="text-xs italic text-slate-500">Note: Include a conflict statement in every manuscript. If there is none, say so explicitly: <em>“The authors declare no competing interests.”</em></p>
      </div>
    ),
  },
  {
    id: 's-retractions-appeals', title: 'Corrections, Retractions & Appeals', subtitle: 'How errors are corrected in public, and how a decision can be appealed',
    body: (
      <div className="space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm">
        <p>{journal.shortName} corrects the record in the open. Depending on the nature of the problem, one of the following notices is published and linked to the article and its DOI:</p>
        <div className="space-y-3 text-xs">
          <Notice tone="sky" title="Erratum / Corrigendum">An erratum fixes an error made by the journal; a corrigendum fixes an author error that affects meaning or credit, such as a wrong equation or unit. The corrected article carries a visible notice.</Notice>
          <Notice tone="amber" title="Minor Changes">Typographical changes that do not affect understanding may be made with a note in the article history.</Notice>
          <Notice tone="rose" title="Formal Retraction">Used when evidence shows fabricated or manipulated data, serious plagiarism, duplicate publication, or an error so serious that the conclusions no longer hold. The article stays online, marked as retracted, with the reason and date.</Notice>
        </div>
        <div className="border-t border-slate-100 pt-3 text-xs text-slate-600">
          <strong>Appeals Mechanism:</strong> An author who believes a decision rested on a factual error can appeal once, within 30 days, as described in <AppLink to={paths.policy('complaints')} className="font-semibold text-cobalt-700 hover:underline">Complaints and Appeals</AppLink>. Appeals are handled by an editor who was not involved in the original decision whenever possible.
        </div>
      </div>
    ),
  },
]

export const ethicsToc: TocItem[] = sections.map((s, n) => ({ id: s.id, label: s.title, num: n + 1 }))

export function EthicsPolicy() {
  return (
    <>
      {sections.map((s, n) => (
        <section key={s.id} aria-labelledby={s.id} className={SECTION}>
          <SectionHead num={n + 1} id={s.id} title={s.title} subtitle={s.subtitle} />
          {s.body}
        </section>
      ))}
      <div className="rounded-pane bg-gradient-to-r from-[#0b2545] to-[#12396b] p-6 text-white shadow-panel">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="space-y-1">
            <span className="inline-block rounded bg-amber-400 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-900">Raise a Concern</span>
            <h3 className="font-serif4 text-lg font-bold">Editorial Ethics &amp; Integrity</h3>
            <p className="max-w-xl text-xs text-slate-200">Concerns about plagiarism, copyright, authorship disputes or other malpractice? Write to the editorial office with the Paper ID or DOI and the reason for your concern.</p>
          </div>
          <div className="shrink-0">
            <a href={`mailto:${journal.email}`} className="inline-flex min-h-[44px] items-center gap-2 rounded bg-cobalt-700 px-4 py-2.5 text-xs font-semibold text-white shadow transition-all hover:bg-cobalt-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:min-h-0"><Mail className="h-4 w-4" aria-hidden="true" />{journal.email}</a>
            <div className="mt-1 text-center text-[11px] text-slate-300 sm:text-right">Acknowledged within two working days</div>
          </div>
        </div>
      </div>
    </>
  )
}
