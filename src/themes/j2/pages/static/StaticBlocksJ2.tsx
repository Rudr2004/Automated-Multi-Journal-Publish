import { lazy, Suspense, useId, useState, type ComponentType } from 'react'
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import type { BlockActions } from '../../../../core/theme'
import type { StaticBlock } from '../../../../core/types'
import { Button } from '../../components/Button'
import { cx, Skeleton } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import * as I from '../../icons'
import { ContactFormJ2 } from './ContactFormJ2'
import { ReviewerFormJ2 } from './ReviewerFormJ2'

const OfficeMap = lazy(() => import('../../components/OfficeMap')) // keeps Leaflet out of the main bundle

/** Heading text and anchor id of a block, used for the "On this page" list. */
export const blockTitle = (b: StaticBlock): string | null => {
  if (b.type === 'journal-info') return 'Journal information'
  if (b.type === 'contact-details') return 'Contact details'
  return b.title
}
export const anchorId = (text: string) => `sec-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

const iconMap: Record<string, ComponentType<I.IconProps>> = {
  engineering: I.Engineering, computing: I.Computing, life: I.Life, environment: I.Environment, physical: I.Physical, social: I.Social,
  business: I.Business, agriculture: I.Agriculture, review: I.Review, verified: I.Verified, award: I.Award, link: I.LinkIcon, open: I.OpenAccess,
  globe: I.Language, speed: I.Speed, book: I.Book, check: I.FactCheck, person: I.Person, payments: I.Payments, email: I.Email,
}

const H2 = ({ id, children }: { id: string; children: string }) => (
  <h2 id={id} className="scroll-mt-28 font-display text-2xl font-bold tracking-tight text-brand-800">{children}</h2>
)

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const base = useId()
  const [open, setOpen] = useState<number>(0)
  return (
    <div className="divide-y divide-graphite-200 rounded-panel border border-graphite-200 bg-white">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left font-medium text-graphite-800 hover:bg-accent-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-700 sm:px-5">
                {it.q}
                <I.ChevronDown className={cx('h-5 w-5 shrink-0 text-accent-700 motion-safe:transition-transform', on && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" aria-label={it.q} hidden={!on} className="px-4 pb-4 text-[0.9375rem] leading-relaxed text-graphite-700 sm:px-5">{it.a}</div>
          </div>
        )
      })}
    </div>
  )
}

function Downloads({ items }: { items: { name: string; desc: string; format: string }[] }) {
  const toast = useToast()
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((d) => (
        <li key={d.name} className="flex flex-col rounded-panel border border-graphite-200 bg-[#F8FBFA] p-4">
          <I.Book className="h-6 w-6 text-accent-700" aria-hidden="true" />
          <h3 className="mt-2 font-display font-semibold text-graphite-800">{d.name}</h3>
          <p className="mt-1 text-sm text-graphite-600">{d.desc}</p>
          <p className="mt-2 text-xs text-graphite-600">{d.format}</p>
          <Button variant="outline" className="mt-4 self-start" onClick={() => toast(`${d.name} downloaded (simulated).`)}><I.Download className="h-4 w-4" aria-hidden="true" />Download</Button>
        </li>
      ))}
    </ul>
  )
}

function IndexingGrid() {
  const logos = visibleLogos()
  return (
    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
      {logos.map((l) => (
        <li key={l.id}>
          <a href={l.verifyUrl} target="_blank" rel="noreferrer" aria-label={`${l.name}: verify the listing (opens in a new tab)`}
            className="group flex h-full gap-4 rounded-panel border border-graphite-200 bg-white p-4 transition-colors hover:border-accent-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-700">
            <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-soft border border-graphite-200 bg-white p-2">
              {l.file
                ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                : <span className="font-display text-sm font-bold tracking-tight text-brand-800">{l.name}</span>}
            </span>
            <span className="min-w-0 text-sm">
              <span className="flex items-center gap-1 font-display font-semibold text-graphite-800">{l.name}<I.OpenInNew className="h-4 w-4 text-accent-700" aria-hidden="true" /></span>
              <span className="mt-0.5 block text-graphite-600">{l.description}</span>
              <span className="mt-1 block text-graphite-700"><strong className="font-medium">For authors:</strong> {l.meaning}</span>
              <span className="mt-2 inline-block rounded-chip bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-800 ring-1 ring-inset ring-brand-200">{l.status}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}

function JournalInfo() {
  return (
    <div className="overflow-x-auto rounded-panel border border-graphite-200 bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">Journal information</caption>
        <tbody className="divide-y divide-graphite-200">
          {journal.info.map(([k, val]) => (
            <tr key={k} className="odd:bg-graphite-50">
              <th scope="row" className="w-2/5 min-w-[8rem] px-4 py-3 align-top font-medium text-graphite-800 sm:w-1/3">{k}</th>
              <td className="break-words px-4 py-3 text-graphite-700">
                {k === 'Email' ? <a className="text-accent-700 underline" href={`mailto:${val}`}>{val}</a>
                  : k === 'Website' ? <a className="text-accent-700 underline" href={`https://${val}`} target="_blank" rel="noreferrer">{val}</a> : val}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ContactDetails() {
  const wa = `https://wa.me/${journal.whatsapp.replace(/\D/g, '')}`
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ul className="space-y-4 rounded-panel border border-graphite-200 bg-[#F8FBFA] p-5 text-sm">
        <li className="flex items-start gap-3"><I.Email className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" /><div><p className="font-semibold text-graphite-800">Email</p><a href={`mailto:${journal.email}`} className="text-accent-700 underline">{journal.email}</a></div></li>
        <li className="flex items-start gap-3"><I.Send className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" /><div><p className="font-semibold text-graphite-800">WhatsApp</p><p className="text-graphite-700">{journal.whatsapp}</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center rounded-soft border border-accent-700 px-3 py-1.5 font-semibold text-accent-700 hover:bg-accent-50">Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></div></li>
        <li className="flex items-start gap-3"><I.Location className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" aria-hidden="true" /><div className="min-w-0"><p className="font-semibold text-graphite-800">Editorial office</p><p className="break-words text-graphite-700">{journal.address}</p></div></li>
      </ul>
      <Suspense fallback={<Skeleton className="min-h-[300px]" />}>
        <OfficeMap lat={journal.location.lat} lng={journal.location.lng} name={journal.shortName} address={journal.address} />
      </Suspense>
    </div>
  )
}

export function StaticBlocksJ2({ blocks, actions, startAt }: { blocks: StaticBlock[]; actions: BlockActions; startAt?: number }) {
  return (
    <>
      {blocks.map((b, i) => {
        const t = blockTitle(b)
        const id = t ? anchorId(t) : undefined
        const n = startAt === undefined ? null : startAt + i + 1
        return (
          <section key={i} aria-labelledby={id} className="rounded-sheet border border-graphite-200 bg-white p-5 shadow-card sm:p-8">
            {t && (
              <div className="flex items-baseline justify-between gap-3 border-b border-graphite-200 pb-3">
                <H2 id={id!}>{n ? `${n}. ${t}` : t}</H2>
                {n && <span className="shrink-0 text-xs font-medium tabular-nums text-graphite-600">Section {String(n).padStart(2, '0')}</span>}
              </div>
            )}
            {b.type === 'steps' && (
              <ol className="mt-6 space-y-6 border-l-2 border-accent-200 pl-8">
                {b.items.map((s, n) => (
                  <li key={s.title} className="relative">
                    <span aria-hidden="true" className="absolute -left-[47px] flex h-8 w-8 items-center justify-center rounded-full bg-brand-800 text-xs font-bold text-white">{n + 1}</span>
                    <h3 className="font-display font-semibold text-graphite-800">{s.title}</h3><p className="text-[0.9375rem] text-graphite-600">{s.text}</p>
                  </li>
                ))}
              </ol>
            )}
            {b.type === 'flow' && (
              <ol className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {b.nodes.map((n, k) => (
                  <li key={n.label} className="rounded-panel border border-graphite-200 bg-[#F8FBFA] p-3 text-center">
                    <span aria-hidden="true" className="mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-accent-700 text-xs font-bold text-white">{k + 1}</span>
                    <p className="mt-2 text-sm font-semibold text-graphite-800">{n.label}</p><p className="text-xs text-graphite-600">{n.note}</p>
                  </li>
                ))}
              </ol>
            )}
            {b.type === 'faq' && <div className="mt-4"><Faq items={b.items} /></div>}
            {b.type === 'downloads' && <Downloads items={b.items} />}
            {b.type === 'icon-grid' && (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {b.items.map((it) => {
                  const Icon = iconMap[it.icon] ?? I.Star
                  return (
                    <li key={it.title} className="rounded-panel border border-graphite-200 bg-[#F8FBFA] p-5">
                      <span className="flex h-11 w-11 items-center justify-center rounded-soft bg-brand-800 text-white"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                      <h3 className="mt-3 font-display text-lg font-semibold text-graphite-800">{it.title}</h3><p className="mt-1 text-sm text-graphite-600">{it.text}</p>
                    </li>
                  )
                })}
              </ul>
            )}
            {b.type === 'indexing-grid' && (<><p className="mt-2 text-sm text-graphite-600">Select a listing to check it on the service’s own website. Only listings the journal can confirm are shown.</p><IndexingGrid /></>)}
            {b.type === 'journal-info' && <div className="mt-4"><JournalInfo /></div>}
            {b.type === 'contact-details' && <div className="mt-4"><ContactDetails /></div>}
            {b.type === 'contact-form' && <div className="mt-4"><ContactFormJ2 onSubmit={actions.onContact} /></div>}
            {b.type === 'reviewer-form' && <div className="mt-4"><ReviewerFormJ2 onSubmit={actions.onReviewer} /></div>}
          </section>
        )
      })}
    </>
  )
}
