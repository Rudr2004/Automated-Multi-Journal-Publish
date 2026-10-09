import { Download, FileText, Mail, MapPin, MessageCircle } from '../../components/uiIcons'
import { lazy, Suspense } from 'react'
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

const OfficeMap = lazy(() => import('../../components/OfficeMap')) // keeps Leaflet out of the main bundle

export interface BlockActions {
  onContact: Parameters<typeof ContactForm>[0]['onSubmit']
  onReviewer: Parameters<typeof ReviewerForm>[0]['onSubmit']
}

/** Section heading with the reference's numbered chip ("3.0"). Un-numbered when `n` is absent. */
export function SectionTitle({ n, id, children }: { n?: number; id?: string; children: string }) {
  return (
    <h2 id={id} className="flex scroll-mt-24 items-center gap-2.5 font-serif text-2xl font-semibold leading-snug text-navy">
      {n !== undefined && <span aria-hidden className="rounded-sm bg-scholar-soft px-2 py-0.5 font-sans text-sm font-bold tabular-nums text-scholar">{n}.0</span>}
      {children}
    </h2>
  )
}

export const blockTitle = (b: StaticBlock): string | undefined => ('title' in b ? (b as { title?: string }).title : undefined)

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

export function StaticBlocks({ blocks, actions, startNumber = 1 }: { blocks: StaticBlock[]; actions: BlockActions; startNumber?: number }) {
  let counter = startNumber - 1
  return (
    <>
      {blocks.map((b, i) => {
        const titled = !!blockTitle(b)
        const n = titled ? ++counter : undefined
        return (
        <section key={i} className="mb-8 border-t border-line pt-6 first:border-t-0 first:pt-0">
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
                {b.nodes.map((n, k) => (
                  <li key={n.label} className="relative rounded-card border border-line bg-paper p-3 text-center">
                    <span className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">{k + 1}</span>
                    <p className="mt-2 text-[13px] font-bold text-navy">{n.label}</p><p className="text-xs text-ink-muted">{n.note}</p>
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
        </section>
        )
      })}
    </>
  )
}
