// Journal 4 renderings of the rich static-page blocks: steps, flow, FAQ, downloads, icon grid, indexing, journal info, contact.
import { useId, useState, type ComponentType } from 'react'
import type { BlockActions } from '../../../../core/theme'
import type { StaticBlock } from '../../../../core/types'
import * as I from '../../icons'
import { Button } from '../Button'
import { cx } from '../primitives'
import { useToast } from '../Toast'
import { ContactForm } from './ContactForm'
import { ContactDetails, IndexingTable, JournalInfoTable } from './InfoBlocks'
import { ReviewerForm } from './ReviewerForm'

/** Heading text of a block (its section title and table-of-contents entry). */
export const blockTitle = (b: StaticBlock): string => b.type === 'journal-info' ? 'Journal information' : b.type === 'contact-details' ? 'Contact details' : b.title
export const anchorId = (text: string) => `s-${text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`

const iconMap: Record<string, ComponentType<I.IconProps>> = {
  civil: I.Civil, mechanical: I.Mechanical, electrical: I.Electrical, electronics: I.Electronics, computing: I.Computing, industrial: I.Industrial,
  operations: I.Operations, project: I.Project, infrastructure: I.Infrastructure,
  review: I.Review, verified: I.Verified, award: I.Award, link: I.LinkIcon, open: I.OpenAccess, book: I.Book, check: I.FactCheck, person: I.Person, email: I.Email,
}

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const base = useId()
  const [open, setOpen] = useState(0)
  return (
    <div className="divide-y divide-abyss-200 rounded-pane border border-abyss-200 bg-white shadow-hair">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`${base}-${i}`} onClick={() => setOpen(on ? -1 : i)}
                className="flex min-h-[44px] w-full items-center justify-between gap-4 px-4 py-3.5 text-left text-base font-semibold text-abyss-900 hover:bg-azure-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-azure-600 sm:px-5">
                {it.q}<I.ChevronDown className={cx('h-5 w-5 shrink-0 text-steel-600 motion-safe:transition-transform', on && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div id={`${base}-${i}`} role="region" aria-label={it.q} hidden={!on} className="px-4 pb-4 text-base leading-relaxed text-steel-700 sm:px-5">{it.a}</div>
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
        <li key={d.name} className="flex flex-col rounded-pane border border-abyss-200 bg-white p-5 shadow-hair">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif4 text-lg font-semibold leading-snug text-abyss-900">{d.name}</h3>
            <span className="rounded-ctl border border-abyss-200 bg-abyss-50 px-2 py-0.5 text-xs font-semibold text-steel-700">{d.format}</span>
          </div>
          <p className="mt-1 text-sm text-steel-600">{d.desc}</p>
          <Button variant="outline" className="mt-4 min-h-[44px] self-start" onClick={() => toast(`${d.name} downloaded (simulated).`)}><I.Download className="h-4 w-4" aria-hidden="true" />Download<span className="sr-only"> {d.name}</span></Button>
        </li>
      ))}
    </ul>
  )
}

export function BlockBody({ block: b, actions }: { block: StaticBlock; actions: BlockActions }) {
  switch (b.type) {
    case 'steps':
      return (
        <ol className="space-y-0 border-l border-abyss-300 pl-0">
          {b.items.map((s, n) => (
            <li key={s.title} className="relative pb-6 pl-8 last:pb-0">
              <span aria-hidden="true" className="absolute -left-[15px] top-0 flex h-[30px] w-[30px] items-center justify-center rounded-ctl bg-abyss-900 text-sm font-semibold tabular-nums text-white">{n + 1}</span>
              <h3 className="font-serif4 text-lg font-semibold leading-tight text-abyss-900">{s.title}</h3>
              <p className="mt-1 text-base leading-relaxed text-steel-700">{s.text}</p>
            </li>
          ))}
        </ol>
      )
    case 'flow':
      return (
        <ol className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {b.nodes.map((n, k) => (
            <li key={n.label} className="rounded-pane border border-abyss-200 border-t-2 border-t-azure-600 bg-white p-4 shadow-hair">
              <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-steel-600">{String(k + 1).padStart(2, '0')}</span>
              <p className="mt-1 font-serif4 text-base font-semibold text-abyss-900">{n.label}</p><p className="mt-0.5 text-sm text-steel-600">{n.note}</p>
            </li>
          ))}
        </ol>
      )
    case 'faq': return <Faq items={b.items} />
    case 'downloads': return <Downloads items={b.items} />
    case 'icon-grid':
      return (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {b.items.map((it) => {
            const Icon = iconMap[it.icon] ?? I.Book
            return (
              <li key={it.title} className="flex gap-3 rounded-pane border border-abyss-200 bg-white p-4 shadow-hair">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-ctl bg-abyss-900 text-azure-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                <div className="min-w-0"><h3 className="font-serif4 text-base font-semibold leading-snug text-abyss-900">{it.title}</h3><p className="mt-0.5 text-sm text-steel-600">{it.text}</p></div>
              </li>
            )
          })}
        </ul>
      )
    case 'indexing-grid': return <IndexingTable />
    case 'journal-info': return <JournalInfoTable />
    case 'contact-details': return <ContactDetails />
    case 'contact-form': return <ContactForm onSubmit={actions.onContact} />
    case 'reviewer-form': return <ReviewerForm onSubmit={actions.onReviewer} />
  }
}
