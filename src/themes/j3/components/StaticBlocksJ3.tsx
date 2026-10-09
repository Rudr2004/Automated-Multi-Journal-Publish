// Rich blocks for Journal 3 static pages: steps, flow, FAQ, downloads, icon grid, indexing, journal table, contact details and forms.
import { lazy, Suspense, useId, useState, type ComponentType } from 'react'
import {
  MdOutlineAccountBalance, MdOutlineDevices, MdOutlineMovie, MdOutlinePalette, MdOutlinePlace, MdOutlinePublic, MdOutlineSchool,
  MdOutlineStorefront, MdOutlineTheaterComedy, MdOutlineWhatsapp,
} from 'react-icons/md'
import { journal, logoSrc, visibleLogos } from '../../../config/journals'
import type { BlockActions } from '../../../core/theme'
import type { StaticBlock } from '../../../core/types'
import * as I from '../icons'
import { AcButton, AcTag } from './AcButton'
import { ContactFormJ3 } from './ContactFormJ3'
import { cx, Skeleton } from './primitives'
import { ReviewerFormJ3 } from './ReviewerFormJ3'
import { useToast } from './Toast'

const OfficeMap = lazy(() => import('./OfficeMap')) // keeps Leaflet out of the main bundle

/** Heading text of a block (used for its collapsible title and the "Jump to section" list). */
export const blockTitle = (b: StaticBlock): string => {
  if (b.type === 'journal-info') return 'Journal information'
  if (b.type === 'contact-details') return 'Contact details'
  return b.title
}
export const anchorId = (text: string) => `sec-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

const iconMap: Record<string, ComponentType<I.IconProps>> = {
  design: MdOutlinePalette, education: MdOutlineSchool, media: MdOutlineMovie, heritage: MdOutlineAccountBalance, industries: MdOutlineStorefront,
  digital: MdOutlineDevices, development: MdOutlinePublic, performing: MdOutlineTheaterComedy,
  review: I.Review, verified: I.Verified, award: I.Award, link: I.LinkIcon, open: I.OpenAccess, globe: MdOutlinePublic, speed: I.Timer,
  book: I.Book, check: I.FactCheck, person: I.Person, email: I.Email,
}

const card = 'border border-mauve-100 bg-white'
const label = 'font-inter text-xs font-bold uppercase tracking-[0.08em]'

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const base = useId()
  const [open, setOpen] = useState(0)
  return (
    <div className={cx('divide-y divide-mauve-100', card)}>
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? -1 : i)}
                className={cx('flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-jakarta text-lg font-semibold hover:bg-iris-50 sm:px-6', on ? 'bg-j3paper-cool text-iris-700' : 'text-night-900')}>
                {it.q}
                <I.ChevronDown className={cx('h-5 w-5 shrink-0 text-iris-700 motion-safe:transition-transform', on && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" aria-label={it.q} hidden={!on} className="px-5 pb-5 pt-1 font-jakarta text-base leading-[1.7] text-mauve-600 sm:px-6">{it.a}</div>
          </div>
        )
      })}
    </div>
  )
}

function Downloads({ items }: { items: { name: string; desc: string; format: string }[] }) {
  const toast = useToast()
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map((d) => (
        <li key={d.name} className={cx('flex flex-col p-6', card)}>
          <span className="flex h-10 w-10 items-center justify-center bg-iris-700 text-white"><I.Book className="h-5 w-5" aria-hidden="true" /></span>
          <h3 className="mt-4 font-jakarta text-xl font-semibold leading-tight text-iris-700">{d.name}</h3>
          <p className="mt-1 font-jakarta text-base text-mauve-600">{d.desc}</p>
          <p className="mt-2"><AcTag tone="plain">{d.format}</AcTag></p>
          <AcButton variant="outline" className="mt-5 self-start" onClick={() => toast(`${d.name} downloaded (simulated).`)}><I.Download className="h-4 w-4" aria-hidden="true" />Download<span className="sr-only"> {d.name}</span></AcButton>
        </li>
      ))}
    </ul>
  )
}

function IndexingGrid() {
  const logos = visibleLogos()
  return (
    <>
      <p className="mb-5 font-jakarta text-base text-mauve-600">Select a listing to check it on the service’s own website. Only listings the journal can confirm are shown.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {logos.map((l) => (
          <li key={l.id}>
            <a href={l.verifyUrl} target="_blank" rel="noreferrer" aria-label={`${l.name}: verify the listing (opens in a new tab)`}
              className={cx('group flex h-full gap-4 p-5 transition-colors hover:border-iris-700', card)}>
              <span className="flex h-16 w-24 shrink-0 items-center justify-center border border-mauve-100 bg-white p-2">
                {l.file
                  ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  : <span className="font-jakarta text-base font-semibold tracking-tight text-iris-700">{l.name}</span>}
              </span>
              <span className="min-w-0 font-inter text-sm">
                <span className="flex items-center gap-1 font-jakarta text-lg font-semibold text-iris-700 group-hover:text-ember-700">{l.name}<I.ArrowUpRight className="h-5 w-5" aria-hidden="true" /></span>
                <span className="mt-0.5 block text-mauve-600">{l.description}</span>
                <span className="mt-1 block text-mauve-700"><strong className="font-semibold">For authors:</strong> {l.meaning}</span>
                <span className="mt-2 inline-block"><AcTag tone="green">{l.status}</AcTag></span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

/** Scholarly table: 2px navy header rule, hairline row rules, no vertical lines, no zebra. */
function JournalInfo() {
  return (
    <div className={cx('overflow-x-auto p-4 sm:p-5', card)}>
      <table className="w-full border-collapse text-left font-inter text-sm">
        <caption className="sr-only">Journal information</caption>
        <thead>
          <tr className="border-b-2 border-iris-700">
            <th scope="col" className="py-2 pr-4 font-jakarta text-base font-semibold text-iris-700">Item</th>
            <th scope="col" className="py-2 font-jakarta text-base font-semibold text-iris-700">Detail</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-mauve-100">
          {journal.info.map(([k, val]) => (
            <tr key={k}>
              <th scope="row" className="w-2/5 min-w-[8rem] py-3 pr-4 text-left align-top font-semibold text-night-900 sm:w-1/3">{k}</th>
              <td className="break-words py-3 text-mauve-700">
                {k === 'Email' ? <a className="text-iris-700 underline hover:text-ember-700" href={`mailto:${val}`}>{val}</a>
                  : k === 'Website' ? <a className="text-iris-700 underline hover:text-ember-700" href={`https://${val}`} target="_blank" rel="noreferrer">{val}<span className="sr-only"> (opens in a new tab)</span></a> : val}
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
    <div className="grid gap-5 md:grid-cols-2">
      <ul className={cx('space-y-6 p-6 text-base', card)}>
        <li className="flex items-start gap-4"><I.Email className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" /><div><p className={cx(label, 'text-mauve-600')}>Email</p><a href={`mailto:${journal.email}`} className="break-all font-inter text-iris-700 underline hover:text-ember-700">{journal.email}</a></div></li>
        <li className="flex items-start gap-4"><MdOutlineWhatsapp className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" /><div><p className={cx(label, 'text-mauve-600')}>WhatsApp</p><p className="font-inter text-mauve-800">{journal.whatsapp}</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center rounded-none border border-iris-700 px-4 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-700 hover:text-white">Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></div></li>
        <li className="flex items-start gap-4"><MdOutlinePlace className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" /><div className="min-w-0"><p className={cx(label, 'text-mauve-600')}>Editorial office</p><p className="break-words font-inter text-mauve-800">{journal.address}</p></div></li>
      </ul>
      <Suspense fallback={<Skeleton className="min-h-[300px]" />}>
        <OfficeMap lat={journal.location.lat} lng={journal.location.lng} name={journal.shortName} address={journal.address} />
      </Suspense>
    </div>
  )
}

/** The content of one block (without its title; the page wraps it in a collapsible section). */
export function BlockBody({ block: b, actions }: { block: StaticBlock; actions: BlockActions }) {
  switch (b.type) {
    case 'steps':
      return (
        <ol className={card}>
          {b.items.map((s, n) => (
            <li key={s.title} className="flex gap-4 border-t border-mauve-100 p-5 first:border-t-0 sm:gap-5 sm:p-6">
              <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center bg-iris-700 font-inter text-sm font-bold text-white">{String(n + 1).padStart(2, '0')}</span>
              <div className="min-w-0"><h3 className="font-jakarta text-xl font-semibold leading-tight text-iris-700">{s.title}</h3><p className="mt-1 font-jakarta text-base leading-[1.7] text-mauve-600">{s.text}</p></div>
            </li>
          ))}
        </ol>
      )
    case 'flow':
      return (
        <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {b.nodes.map((n, k) => (
            <li key={n.label} className="border border-t-2 border-mauve-100 border-t-iris-700 bg-white p-4">
              <span className={cx(label, 'text-ember-700')}>Phase {String(k + 1).padStart(2, '0')}</span>
              <p className="mt-2 font-jakarta text-lg font-semibold leading-snug text-iris-700">{n.label}</p><p className="mt-0.5 font-inter text-sm text-mauve-600">{n.note}</p>
            </li>
          ))}
        </ol>
      )
    case 'faq': return <Faq items={b.items} />
    case 'downloads': return <Downloads items={b.items} />
    case 'icon-grid':
      return (
        <ul className="grid gap-4 sm:grid-cols-2">
          {b.items.map((it) => {
            const Icon = iconMap[it.icon] ?? I.Book
            return (
              <li key={it.title} className={cx('flex gap-4 p-5', card)}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-iris-700 text-white"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0"><h3 className="font-jakarta text-lg font-semibold leading-snug text-iris-700">{it.title}</h3><p className="mt-1 font-inter text-sm leading-relaxed text-mauve-600">{it.text}</p></div>
              </li>
            )
          })}
        </ul>
      )
    case 'indexing-grid': return <IndexingGrid />
    case 'journal-info': return <JournalInfo />
    case 'contact-details': return <ContactDetails />
    case 'contact-form': return <ContactFormJ3 onSubmit={actions.onContact} />
    case 'reviewer-form': return <ReviewerFormJ3 onSubmit={actions.onReviewer} />
  }
}
