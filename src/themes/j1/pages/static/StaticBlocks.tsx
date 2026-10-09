import { AlertTriangle, CheckCircle2, Download, FileText, Info, Mail, MapPin, MessageCircle } from '../../components/uiIcons'
import { MdOutlineBolt, MdOutlineHelpOutline, MdOutlineStickyNote2 } from 'react-icons/md'
import { lazy, Suspense, type ReactNode } from 'react'
import type { StaticBlock } from '../../../../mock-data/journals/j1'
import { AccordionItem, Accordion } from '../../components/Accordion'
import { Button } from '../../components/Button'
import { TrustIcon } from '../../components/icons'
import { IndexingGrid } from '../../components/IndexLogos'
import { JournalInfoTable } from '../../components/JournalInfoTable'
import { Skeleton } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import { journal } from '../../../../config/journals/j1'
import { ContactForm } from './ContactForm'
import { ReviewerForm } from './ReviewerForm'
import { StaticIcon } from './staticIcons'

const OfficeMap = lazy(() => import('../../components/OfficeMap')) // keeps Leaflet out of the main bundle

export interface BlockActions {
  onContact: Parameters<typeof ContactForm>[0]['onSubmit']
  onReviewer: Parameters<typeof ReviewerForm>[0]['onSubmit']
}

/** Section heading with the reference's numbered chip ("3.0"). Un-numbered when `n` is absent; `badge` is a small label at the right. */
export function SectionTitle({ n, id, badge, children }: { n?: number; id?: string; badge?: string; children: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
      <h2 id={id} className="flex scroll-mt-24 items-center gap-2.5 font-serif text-2xl font-semibold leading-snug text-navy">
        {n !== undefined && <span aria-hidden className="rounded-sm bg-scholar-soft px-2 py-0.5 font-sans text-sm font-bold tabular-nums text-scholar">{n}.0</span>}
        {children}
      </h2>
      {badge && <span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-scholar">{badge}</span>}
    </div>
  )
}

/** Block types that are placed by the page template itself or inside a section: they never get a section number. */
const UNNUMBERED: StaticBlock['type'][] = ['in-brief', 'faq-accordion', 'callout', 'table', 'card-grid', 'icon-list', 'ordered-steps']

export const blockTitle = (b: StaticBlock): string | undefined =>
  UNNUMBERED.includes(b.type) ? undefined : 'title' in b ? (b as { title?: string }).title : undefined

function Downloads({ block, n }: { block: Extract<StaticBlock, { type: 'downloads' }>; n?: number }) {
  const toast = useToast()
  return (
    <>
      <SectionTitle n={n} id={`sec-${n}`}>{block.title}</SectionTitle>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {block.items.map((d) => (
          <li key={d.name} className="flex flex-col rounded-card border border-line bg-white p-4">
            <FileText className="h-6 w-6 text-scholar" strokeWidth={1.5} aria-hidden />
            <h3 className="mt-2 font-semibold text-navy">{d.name}</h3>
            <p className="mt-1 text-sm text-ink-muted">{d.desc}</p>
            <p className="mt-2 text-xs text-ink-muted">{d.format}</p>
            <Button size="sm" variant="secondary" className="mt-3" onClick={() => toast(`${d.name} downloaded (simulated).`)}><Download className="h-4 w-4" aria-hidden />Download</Button>
          </li>
        ))}
      </ul>
    </>
  )
}

function ContactDetails() {
  const wa = `https://wa.me/${journal.whatsapp.replace(/\D/g, '')}`
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ul className="space-y-3 rounded-card border border-line bg-white p-5 text-sm">
        <li className="flex items-start gap-3"><Mail className="mt-0.5 h-5 w-5 text-scholar" aria-hidden /><div><p className="font-semibold">Email</p><a href={`mailto:${journal.email}`} className="text-scholar hover:underline">{journal.email}</a></div></li>
        <li className="flex items-start gap-3"><MessageCircle className="mt-0.5 h-5 w-5 text-scholar" aria-hidden /><div><p className="font-semibold">WhatsApp</p><p>{journal.whatsapp}</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-2 inline-flex h-9 items-center rounded border border-oa px-3 font-semibold text-oa hover:bg-oa-soft">Chat on WhatsApp</a></div></li>
        <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 text-scholar" aria-hidden /><div><p className="font-semibold">Address</p><p>{journal.address}</p></div></li>
      </ul>
      <Suspense fallback={<Skeleton className="min-h-[300px] rounded-card" />}>
        <OfficeMap lat={journal.location.lat} lng={journal.location.lng} name={journal.name} address={journal.address} />
      </Suspense>
    </div>
  )
}

type Tone = 'info' | 'warn' | 'note' | 'success'
const CALLOUT: Record<Tone, { box: string; icon: ReactNode }> = {
  info: { box: 'border-[#C4D9EE] border-l-scholar bg-scholar-soft', icon: <Info className="mt-0.5 h-5 w-5 shrink-0 text-scholar" aria-hidden /> },
  warn: { box: 'border-[#E4D3A8] border-l-[#B8892B] bg-[#FBF6E9]', icon: <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#8A6414]" aria-hidden /> },
  note: { box: 'border-line border-l-navy bg-paper', icon: <MdOutlineStickyNote2 className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden /> },
  success: { box: 'border-[#B9DEC6] border-l-[#2E7D4F] bg-[#EDF7F0]', icon: <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#1F6B40]" aria-hidden /> },
}

/** Call-out box in four tones (info, warn, note, success). */
export function Callout({ tone = 'info', title, text }: { tone?: Tone; title: string; text: string }) {
  const c = CALLOUT[tone] ?? CALLOUT.info
  return (
    <aside role="note" className={`flex gap-3 border border-l-4 p-4 ${c.box}`}>
      {c.icon}
      <div><p className="text-sm font-bold text-navy">{title}</p><p className="mt-0.5 text-sm leading-relaxed text-ink">{text}</p></div>
    </aside>
  )
}

/** Renders one block. `n` is the section number for titled, numbered blocks. */
export function BlockView({ b, n, actions }: { b: StaticBlock; n?: number; actions: BlockActions }) {
  return (
    <>
      {b.type === 'steps' && (
        <>
          <SectionTitle n={n} id={`sec-${n}`}>{b.title}</SectionTitle>
          <ol className="mt-5 space-y-5 border-l border-line pl-6">
            {b.items.map((s, k) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-[39px] flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{k + 1}</span>
                <p className="font-semibold text-navy">{s.title}</p><p className="text-sm text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </>
      )}
      {b.type === 'flow' && (
        <>
          <SectionTitle n={n} id={`sec-${n}`}>{b.title}</SectionTitle>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {b.nodes.map((node, k) => (
              <li key={node.label} className="relative rounded-card border border-line bg-paper p-3 text-center">
                <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{k + 1}</span>
                <p className="mt-2 text-[13px] font-bold text-navy">{node.label}</p><p className="text-xs text-ink-muted">{node.note}</p>
                {k < b.nodes.length - 1 && <span aria-hidden className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-navy-300 xl:block">›</span>}
              </li>
            ))}
          </ol>
        </>
      )}
      {b.type === 'faq' && (<><SectionTitle n={n} id={`sec-${n}`}>{b.title}</SectionTitle><div className="mt-4"><Accordion>{b.items.map((f, k) => <AccordionItem key={f.q} title={f.q} defaultOpen={k === 0}>{f.a}</AccordionItem>)}</Accordion></div></>)}
      {b.type === 'downloads' && <Downloads block={b} n={n} />}
      {b.type === 'icon-grid' && (
        <>
          <SectionTitle n={n} id={`sec-${n}`}>{b.title}</SectionTitle>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {b.items.map((it) => (
              <li key={it.title} className="rounded-card border border-line bg-white p-4 hover:border-scholar">
                <span className="flex h-10 w-10 items-center justify-center rounded bg-navy text-white"><TrustIcon name={it.icon} className="h-5 w-5" aria-hidden /></span>
                <h3 className="mt-3 font-serif text-lg font-semibold text-navy">{it.title}</h3><p className="mt-1 text-sm text-ink-muted">{it.text}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {b.type === 'indexing-grid' && (
        <>
          <SectionTitle n={n} id={`sec-${n}`}>{b.title}</SectionTitle>
          <p className="mt-2 text-sm text-ink-muted">Select a logo to see what the listing means and to verify it on the index’s own website. Only listings the journal can confirm are shown.</p>
          <div className="mt-4"><IndexingGrid /></div>
        </>
      )}
      {b.type === 'journal-info' && <JournalInfoTable />}
      {b.type === 'contact-details' && <ContactDetails />}
      {b.type === 'contact-form' && (<><SectionTitle n={n} id={`sec-${n}`}>{b.title}</SectionTitle><div className="mt-4"><ContactForm onSubmit={actions.onContact} /></div></>)}
      {b.type === 'reviewer-form' && (<><SectionTitle n={n} id={`sec-${n}`}>{b.title}</SectionTitle><div className="mt-4"><ReviewerForm onSubmit={actions.onReviewer} /></div></>)}

      {b.type === 'table' && (
        <figure className="overflow-x-auto">
          {b.title && <h3 className="mb-2 font-serif text-lg font-semibold text-navy">{b.title}</h3>}
          <table className="w-full min-w-[34rem] border-collapse border-y-2 border-navy text-left text-sm tabular-nums">
            {b.caption && <caption className="pb-2 text-left text-[13px] font-semibold text-navy">{b.caption}</caption>}
            <thead><tr className="border-b border-navy">{b.head.map((h) => <th key={h} scope="col" className="px-3 py-2 text-[12px] font-bold uppercase tracking-wider text-navy">{h}</th>)}</tr></thead>
            <tbody>
              {b.rows.map((r, i) => (
                <tr key={i} className="border-b border-line last:border-b-0">
                  {r.map((c, k) => k === 0
                    ? <th key={k} scope="row" className="px-3 py-2.5 align-top font-semibold text-ink">{c}</th>
                    : <td key={k} className="px-3 py-2.5 align-top text-ink">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )}
      {b.type === 'card-grid' && (
        <>
          {b.title && <h3 className="mb-3 font-serif text-lg font-semibold text-navy">{b.title}</h3>}
          <ul className="grid gap-3 sm:grid-cols-2">
            {b.items.map((it) => (
              <li key={it.title} className="flex flex-col border border-line bg-white p-4 hover:border-scholar">
                {(it.icon || it.tag || it.mark) && (
                  <div className="flex items-center justify-between gap-2">
                    {it.mark
                      ? <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-sm bg-navy font-serif text-sm font-bold text-white">{it.mark}</span>
                      : <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-sm bg-scholar-soft text-scholar"><StaticIcon name={it.icon} className="h-5 w-5" /></span>}
                    {it.tag && <span className="rounded-sm border border-[#C4D9EE] bg-scholar-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-scholar">{it.tag}</span>}
                  </div>
                )}
                <h3 className="mt-3 font-serif text-[1.0625rem] font-semibold leading-snug text-navy">{it.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{it.text}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {b.type === 'icon-list' && (
        <>
          {b.title && <h3 className="mb-3 font-serif text-lg font-semibold text-navy">{b.title}</h3>}
          <ul className="divide-y divide-line border border-line bg-white">
            {b.items.map((it) => (
              <li key={it.title} className="flex items-start gap-3 p-3.5">
                <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-scholar-soft text-scholar"><StaticIcon name={it.icon} className="h-5 w-5" /></span>
                <p className="min-w-0 text-sm leading-relaxed text-ink"><strong className="font-bold text-navy">{it.title}.</strong> {it.text}</p>
              </li>
            ))}
          </ul>
        </>
      )}
      {b.type === 'ordered-steps' && (
        <>
          {b.title && <h3 className="mb-3 font-serif text-lg font-semibold text-navy">{b.title}</h3>}
          {b.layout === 'list'
            ? (
              <ol className="space-y-3 border border-line bg-paper p-4">
                {b.items.map((s, k) => (
                  <li key={s.title} className="flex items-start gap-3">
                    <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{k + 1}</span>
                    <p className="text-sm leading-relaxed text-ink"><strong className="font-bold text-navy">{s.title}.</strong> {s.text}</p>
                  </li>
                ))}
              </ol>
            )
            : (
              <ol className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {b.items.map((s, k) => (
                  <li key={s.title} className="border border-line bg-paper p-3 text-center">
                    <span aria-hidden className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{k + 1}</span>
                    <p className="mt-2 text-[13px] font-bold text-navy">{s.title}</p>
                    {s.meta && <p className="mt-0.5 text-xs text-ink-muted">{s.meta}</p>}
                  </li>
                ))}
              </ol>
            )}
        </>
      )}
      {b.type === 'in-brief' && (
        <div id="in-brief" className="scroll-mt-24 border border-l-4 border-line border-l-scholar bg-paper p-5">
          <h2 className="flex items-center gap-2 font-serif text-xl font-semibold text-navy"><MdOutlineBolt className="h-5 w-5 text-scholar" aria-hidden />{b.title}</h2>
          <ol className="mt-4 grid gap-3 sm:grid-cols-2">
            {b.items.map((it, k) => (
              <li key={it.title} className="flex items-start gap-3 border border-line bg-white p-3.5">
                <span aria-hidden className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-scholar-soft text-xs font-bold text-scholar">{k + 1}</span>
                <p className="min-w-0 text-sm leading-relaxed text-ink-muted"><strong className="block font-bold text-navy">{it.title}</strong>{it.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
      {b.type === 'callout' && <Callout tone={b.tone} title={b.title} text={b.text} />}
      {b.type === 'faq-accordion' && (
        <div id="faq-section" className="scroll-mt-24">
          <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-navy"><MdOutlineHelpOutline className="h-6 w-6 text-scholar" aria-hidden />{b.title}</h2>
          <div className="mt-4"><Accordion>{b.items.map((f, k) => <AccordionItem key={f.q} title={f.q} defaultOpen={k === 0}>{f.a}</AccordionItem>)}</Accordion></div>
        </div>
      )}
    </>
  )
}

export function StaticBlocks({ blocks, actions, startNumber = 1 }: { blocks: StaticBlock[]; actions: BlockActions; startNumber?: number }) {
  let counter = startNumber - 1
  return (
    <>
      {blocks.map((b, i) => {
        const n = blockTitle(b) ? ++counter : undefined
        return (
          <section key={i} className="mb-8 border-t border-line pt-6 first:border-t-0 first:pt-0">
            <BlockView b={b} n={n} actions={actions} />
          </section>
        )
      })}
    </>
  )
}
