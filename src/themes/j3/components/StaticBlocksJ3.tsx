// Rich blocks for Journal 3 static pages ("Academic Editorial & Press"): steps, flow table, FAQ, downloads, icon grid, indexing, journal table, contact details and forms.
import { lazy, Suspense, useId, useState, type ComponentType, type ReactNode } from 'react'
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

/** Heading text of a block (used for its section title and the "On this page" list). */
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

const card = 'rounded-[2px] border border-j3paper-rule bg-white'
const sub = 'rounded-[2px] border border-j3paper-rule bg-j3paper-cool'
const label = 'font-jakarta text-xs font-bold uppercase tracking-[0.08em]'
const subTitle = 'font-jakarta text-[0.9375rem] font-bold leading-snug text-night-900'
const subText = 'font-inter text-[0.9375rem] leading-[1.65] text-mauve-700'

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const base = useId()
  const [open, setOpen] = useState(0)
  return (
    <div className={cx('divide-y divide-j3paper-rule', card)}>
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? -1 : i)}
                className={cx('flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left font-jakarta text-base font-bold hover:bg-j3paper-cool sm:px-5', on ? 'bg-j3paper-cool text-iris-700' : 'text-night-900')}>
                {it.q}
                <I.ChevronDown className={cx('h-5 w-5 shrink-0 text-iris-700 motion-safe:transition-transform', on && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" aria-label={it.q} hidden={!on} className={cx('px-4 pb-4 pt-2 sm:px-5', subText)}>{it.a}</div>
          </div>
        )
      })}
    </div>
  )
}

function Downloads({ items }: { items: { name: string; desc: string; format: string }[] }) {
  const toast = useToast()
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((d) => (
        <li key={d.name} className={cx('flex flex-col p-4', sub)}>
          <h3 className={cx('flex items-center gap-2', subTitle)}><I.Book className="h-4 w-4 shrink-0 text-iris-700" aria-hidden="true" />{d.name}</h3>
          <p className={cx('mt-1.5', subText)}>{d.desc}</p>
          <p className="mt-2"><AcTag tone="plain">{d.format}</AcTag></p>
          <AcButton variant="outline" className="mt-4 self-start" onClick={() => toast(`${d.name} downloaded (simulated).`)}><I.Download className="h-4 w-4" aria-hidden="true" />Download<span className="sr-only"> {d.name}</span></AcButton>
        </li>
      ))}
    </ul>
  )
}

function IndexingGrid() {
  const logos = visibleLogos()
  return (
    <>
      <p className={cx('mb-4', subText)}>Select a listing to check it on the service’s own website. Only listings the journal can confirm are shown.</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {logos.map((l) => (
          <li key={l.id}>
            <a href={l.verifyUrl} target="_blank" rel="noreferrer" aria-label={`${l.name}: verify the listing (opens in a new tab)`}
              className={cx('group flex h-full gap-4 p-4 transition-colors hover:border-iris-700', sub)}>
              <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-[2px] border border-j3paper-rule bg-white p-2">
                {l.file
                  ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                  : <span className="font-jakarta text-sm font-bold tracking-tight text-iris-700">{l.name}</span>}
              </span>
              <span className="min-w-0 font-inter text-sm">
                <span className="flex items-center gap-1 font-jakarta text-[0.9375rem] font-bold text-night-900 group-hover:text-iris-700">{l.name}<I.ArrowUpRight className="h-4 w-4 text-iris-700" aria-hidden="true" /></span>
                <span className="mt-0.5 block text-mauve-700">{l.description}</span>
                <span className="mt-1 block text-mauve-700"><strong className="font-semibold text-night-900">For authors:</strong> {l.meaning}</span>
                <span className="mt-2 inline-block"><AcTag tone="green">{l.status}</AcTag></span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}

/** Ruled table: Mist header, hairline row rules, tabular numbers (as the reference's complaints table). */
function RuledTable({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className={cx('relative overflow-x-auto', card)}>
      <table className="w-full border-collapse text-left font-inter text-[0.9375rem]">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-j3paper-rule bg-j3paper-cool">
            {head.map((h) => <th key={h} scope="col" className="px-4 py-2.5 font-jakarta text-sm font-bold text-night-900">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-j3paper-rule">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, k) => k === 0
                ? <th key={k} scope="row" className="w-2/5 min-w-[8rem] px-4 py-3 text-left align-top font-jakarta text-sm font-bold text-night-900 sm:w-1/3">{c}</th>
                : <td key={k} className="break-words px-4 py-3 align-top tabular-nums text-mauve-700">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function JournalInfo() {
  return (
    <RuledTable caption="Journal information" head={['Item', 'Detail']}
      rows={journal.info.map(([k, val]) => [k,
        k === 'Email' ? <a className="text-iris-700 underline underline-offset-2 hover:text-iris-800" href={`mailto:${val}`}>{val}</a>
          : k === 'Website' ? <a className="text-iris-700 underline underline-offset-2 hover:text-iris-800" href={`https://${val}`} target="_blank" rel="noreferrer">{val}<span className="sr-only"> (opens in a new tab)</span></a> : val])} />
  )
}

function ContactDetails() {
  const wa = `https://wa.me/${journal.whatsapp.replace(/\D/g, '')}`
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <ul className={cx('space-y-5 p-5 text-base', sub)}>
        <li className="flex items-start gap-3"><I.Email className="mt-0.5 h-5 w-5 shrink-0 text-iris-700" aria-hidden="true" /><div><p className={cx(label, 'text-mauve-600')}>Email</p><a href={`mailto:${journal.email}`} className="break-all font-inter text-iris-700 underline underline-offset-2 hover:text-iris-800">{journal.email}</a></div></li>
        <li className="flex items-start gap-3"><MdOutlineWhatsapp className="mt-0.5 h-5 w-5 shrink-0 text-iris-700" aria-hidden="true" /><div><p className={cx(label, 'text-mauve-600')}>WhatsApp</p><p className="font-inter text-mauve-800">{journal.whatsapp}</p>
          <a href={wa} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center rounded-[2px] border border-j3paper-rule bg-white px-4 py-1.5 font-jakarta text-xs font-bold text-iris-700 hover:border-iris-700 hover:bg-j3paper-cool">Chat on WhatsApp<span className="sr-only"> (opens in a new tab)</span></a></div></li>
        <li className="flex items-start gap-3"><MdOutlinePlace className="mt-0.5 h-5 w-5 shrink-0 text-iris-700" aria-hidden="true" /><div className="min-w-0"><p className={cx(label, 'text-mauve-600')}>Editorial office</p><p className="break-words font-inter text-mauve-800">{journal.address}</p></div></li>
      </ul>
      <Suspense fallback={<Skeleton className="min-h-[300px]" />}>
        <OfficeMap lat={journal.location.lat} lng={journal.location.lng} name={journal.shortName} address={journal.address} />
      </Suspense>
    </div>
  )
}

/** The content of one block (without its title; the page wraps it in a numbered section card). */
export function BlockBody({ block: b, actions }: { block: StaticBlock; actions: BlockActions }) {
  switch (b.type) {
    case 'steps':
      return (
        <ol className="space-y-3">
          {b.items.map((s, n) => (
            <li key={s.title} className="flex gap-3 border-l-2 border-iris-700 pl-3.5">
              <span aria-hidden="true" className="w-6 shrink-0 font-jakarta text-sm font-bold tabular-nums text-iris-700">{String(n + 1).padStart(2, '0')}</span>
              <div className="min-w-0"><h3 className={subTitle}>{s.title}</h3><p className={cx('mt-0.5', subText)}>{s.text}</p></div>
            </li>
          ))}
        </ol>
      )
    case 'flow':
      return <RuledTable caption={b.title} head={['Stage', 'What happens']} rows={b.nodes.map((n, k) => [<><span className="mr-2 tabular-nums text-iris-700">{String(k + 1).padStart(2, '0')}</span>{n.label}</>, n.note])} />
    case 'faq': return <Faq items={b.items} />
    case 'downloads': return <Downloads items={b.items} />
    case 'icon-grid':
      return (
        <ul className="grid gap-3 sm:grid-cols-2">
          {b.items.map((it) => {
            const Icon = iconMap[it.icon] ?? I.Book
            return (
              <li key={it.title} className={cx('p-4', sub)}>
                <h3 className={cx('flex items-center gap-2', subTitle)}><Icon className="h-4 w-4 shrink-0 text-iris-700" aria-hidden="true" />{it.title}</h3>
                <p className={cx('mt-1.5', subText)}>{it.text}</p>
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
