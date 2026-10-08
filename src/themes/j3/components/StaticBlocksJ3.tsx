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
import { Button } from './Button'
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

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const base = useId()
  const [open, setOpen] = useState(0)
  return (
    <div className="divide-y divide-mauve-100 rounded-block bg-iris-50">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 rounded-block px-5 py-4 text-left font-jakarta text-base font-bold text-night-900 hover:bg-iris-100 sm:px-6">
                {it.q}
                <I.ChevronDown className={cx('h-6 w-6 shrink-0 text-iris-700 motion-safe:transition-transform', on && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" aria-label={it.q} hidden={!on} className="px-5 pb-5 text-base leading-relaxed text-mauve-700 sm:px-6">{it.a}</div>
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
        <li key={d.name} className="flex flex-col rounded-block bg-iris-50 p-6">
          <span className="flex h-11 w-11 items-center justify-center rounded-tile bg-iris-700 text-white"><I.Book className="h-6 w-6" aria-hidden="true" /></span>
          <h3 className="mt-4 font-jakarta text-[1.375rem] font-extrabold leading-tight tracking-tight text-night-900">{d.name}</h3>
          <p className="mt-1 text-base text-mauve-700">{d.desc}</p>
          <p className="mt-2 text-sm font-semibold text-mauve-700">{d.format}</p>
          <Button variant="outline" className="mt-5 self-start" onClick={() => toast(`${d.name} downloaded (simulated).`)}><I.Download className="h-4 w-4" aria-hidden="true" />Download<span className="sr-only"> {d.name}</span></Button>
        </li>
      ))}
    </ul>
  )
}

function IndexingGrid() {
  const logos = visibleLogos()
  return (
    <>
      <p className="mb-5 text-base text-mauve-700">Select a listing to check it on the service’s own website. Only listings the journal can confirm are shown.</p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {logos.map((l) => (
          <li key={l.id}>
            <a href={l.verifyUrl} target="_blank" rel="noreferrer" aria-label={`${l.name}: verify the listing (opens in a new tab)`}
              className="group flex h-full gap-4 rounded-block bg-iris-50 p-5 transition-colors hover:bg-iris-100">
              <span className="flex h-16 w-24 shrink-0 items-center justify-center rounded-tile bg-white p-2">
                {l.file
                  ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  : <span className="font-jakarta text-base font-extrabold tracking-tight text-iris-800">{l.name}</span>}
              </span>
              <span className="min-w-0 text-sm">
                <span className="flex items-center gap-1 font-jakarta text-lg font-extrabold text-night-900">{l.name}<I.ArrowUpRight className="h-5 w-5 text-iris-700" aria-hidden="true" /></span>
                <span className="mt-0.5 block text-mauve-700">{l.description}</span>
                <span className="mt-1 block text-mauve-800"><strong className="font-semibold">For authors:</strong> {l.meaning}</span>
                <span className="mt-2 inline-block rounded-full bg-iris-100 px-3 py-1 font-jakarta text-xs font-bold text-iris-800">{l.status}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

function JournalInfo() {
  return (
    <div className="overflow-x-auto rounded-block bg-iris-50">
      <table className="w-full text-left text-base">
        <caption className="sr-only">Journal information</caption>
        <tbody className="divide-y divide-iris-100">
          {journal.info.map(([k, val]) => (
            <tr key={k}>
              <th scope="row" className="w-2/5 min-w-[8rem] px-5 py-3.5 align-top font-jakarta text-sm font-bold text-night-900 sm:w-1/3">{k}</th>
              <td className="break-words px-5 py-3.5 text-mauve-800">
                {k === 'Email' ? <a className="text-iris-700 underline" href={`mailto:${val}`}>{val}</a>
                  : k === 'Website' ? <a className="text-iris-700 underline" href={`https://${val}`} target="_blank" rel="noreferrer">{val}<span className="sr-only"> (opens in a new tab)</span></a> : val}
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
      <ul className="space-y-6 rounded-block bg-iris-50 p-6 text-base">
        <li className="flex items-start gap-4"><I.Email className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" /><div><p className="font-jakarta font-bold text-night-900">Email</p><a href={`mailto:${journal.email}`} className="break-all text-iris-700 underline">{journal.email}</a></div></li>
        <li className="flex items-start gap-4"><MdOutlineWhatsapp className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" /><div><p className="font-jakarta font-bold text-night-900">WhatsApp</p><p className="text-mauve-800">{journal.whatsapp}</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center rounded-full border-2 border-iris-700 px-4 py-1.5 font-jakarta text-sm font-bold text-iris-700 hover:bg-iris-100">Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></div></li>
        <li className="flex items-start gap-4"><MdOutlinePlace className="mt-0.5 h-6 w-6 shrink-0 text-iris-700" aria-hidden="true" /><div className="min-w-0"><p className="font-jakarta font-bold text-night-900">Editorial office</p><p className="break-words text-mauve-800">{journal.address}</p></div></li>
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
        <ol className="space-y-6">
          {b.items.map((s, n) => (
            <li key={s.title} className="flex gap-4 sm:gap-5">
              <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-iris-700 font-jakarta text-lg font-extrabold text-white">{n + 1}</span>
              <div className="min-w-0 pt-0.5"><h3 className="font-jakarta text-[1.375rem] font-extrabold leading-tight tracking-tight text-night-900">{s.title}</h3><p className="mt-1 text-base leading-relaxed text-mauve-700">{s.text}</p></div>
            </li>
          ))}
        </ol>
      )
    case 'flow':
      return (
        <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {b.nodes.map((n, k) => (
            <li key={n.label} className="rounded-tile bg-iris-50 p-4">
              <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-iris-700 font-jakarta text-xs font-extrabold text-white">{k + 1}</span>
              <p className="mt-3 font-jakarta text-base font-extrabold text-night-900">{n.label}</p><p className="mt-0.5 text-sm text-mauve-700">{n.note}</p>
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
              <li key={it.title} className="flex gap-4 rounded-block bg-iris-50 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-tile bg-iris-700 text-white"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <div className="min-w-0"><h3 className="font-jakarta text-lg font-extrabold leading-snug text-night-900">{it.title}</h3><p className="mt-1 text-base text-mauve-700">{it.text}</p></div>
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
