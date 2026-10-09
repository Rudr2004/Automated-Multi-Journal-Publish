// IJFRD static pages: numbered clauses with a sticky table of contents (left), related pages, rich blocks, and a two-column contact layout.
import { useMemo } from 'react'
import { journal } from '../../../config/journals'
import { staticGroups } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import type { BlockActions } from '../../../core/theme'
import type { StaticBlock, StaticPageData } from '../../../core/types'
import { anchorId, BlockBody, blockTitle } from '../components/static/StaticBlocks'
import { RightRail, SectionClauses, SideColumn, StaticBand, type TocItem } from '../components/static/Clauses'
import { ContactDetails } from '../components/static/InfoBlocks'
import { ContactForm } from '../components/static/ContactForm'
import { Container } from '../components/primitives'
import * as I from '../icons'

const principles = [
  { icon: I.Verified, title: 'Integrity', text: 'Honest, carefully documented research and reporting.' },
  { icon: I.FactCheck, title: 'Transparency', text: 'Open processes and decisions that come with reasons.' },
  { icon: I.Shield, title: 'Fairness', text: 'Impartial evaluation of the work on its merits.' },
  { icon: I.Person, title: 'Accountability', text: 'Authors, reviewers and editors answer for their roles.' },
  { icon: I.Book, title: 'Good practice', text: 'Guided by COPE-style principles, without claiming membership.' },
]

/** A group of blocks that render together: the contact details and the contact form share one two-column section. */
interface Item { id: string; title: string; blocks: StaticBlock[] }
function groupBlocks(blocks: StaticBlock[]): Item[] {
  const details = blocks.find((b) => b.type === 'contact-details')
  const form = blocks.find((b) => b.type === 'contact-form')
  const items: Item[] = []
  for (const b of blocks) {
    if (details && form && (b === details || b === form)) {
      if (b === details) items.push({ id: anchorId('Contact the editorial office'), title: 'Contact the editorial office', blocks: [details, form] })
      continue
    }
    const t = blockTitle(b)
    items.push({ id: anchorId(t), title: t, blocks: [b] })
  }
  return items
}

export function StaticPage({ page, sidebar, allPages, actions }: { page: StaticPageData; sidebar: StaticPageData[]; allPages: StaticPageData[]; actions: BlockActions }) {
  const related = page.related.map((s) => allPages.find((p) => p.slug === s)).filter(Boolean) as StaticPageData[]
  const items = useMemo(() => groupBlocks(page.blocks ?? []), [page])
  const toc = useMemo<TocItem[]>(() => [
    ...(page.principles ? [{ id: 's-principles', label: 'Our ethical principles' }] : []),
    ...page.sections.map((s) => ({ id: anchorId(s.heading), label: s.heading })),
    ...items.map((i) => ({ id: i.id, label: i.title })),
  ].map((t, n) => ({ ...t, num: n + 1 })), [page, items])
  const offset = page.principles ? 1 : 0

  return (
    <div className="bg-[#FBF8F4]">
      <StaticBand page={page} meta={<>
        <span className="inline-flex items-center gap-2 rounded border border-ochre-300/30 bg-white/5 px-3 py-1.5"><I.History className="h-4 w-4 text-ochre-300" aria-hidden="true" />Updated {formatDate(page.updated)}</span>
        {toc.length > 1 && <span className="inline-flex items-center gap-2 rounded border border-ochre-300/30 bg-white/5 px-3 py-1.5"><I.Book className="h-4 w-4 text-ochre-300" aria-hidden="true" />{toc.length} sections</span>}
        <span className="inline-flex items-center gap-2 rounded border border-ochre-300/30 bg-white/5 px-3 py-1.5"><I.OpenAccess className="h-4 w-4 text-ochre-300" aria-hidden="true" />{journal.licence.name}</span>
      </>} />

      <Container className="py-8 sm:py-12">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[15rem_minmax(0,1fr)_17rem]">
          <SideColumn page={page} toc={toc} sidebar={sidebar} related={related} />
          <article className="min-w-0 space-y-4">
            {page.principles && (
              <section aria-labelledby="s-principles" className="rounded border border-[#E6DCD0] bg-white p-5  sm:p-7">
                <h2 id="s-principles" className="flex scroll-mt-28 items-center gap-3 font-newsreader text-[1.375rem] font-semibold leading-tight tracking-tight text-obsidian-900 sm:text-[1.625rem]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-wine-800 text-sm font-semibold tabular-nums text-white" aria-hidden="true">1</span>Our ethical principles</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {principles.map(({ icon: Icon, title, text }) => (
                    <li key={title} className="flex gap-3 rounded border border-[#E6DCD0] bg-white p-4 ">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-wine-800 text-ochre-300"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                      <div className="min-w-0"><h3 className="font-newsreader text-base font-semibold text-obsidian-900">{title}</h3><p className="mt-0.5 font-serif4 text-[0.9375rem] text-obsidian-700">{text}</p></div>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {page.sections.map((s, n) => <SectionClauses key={s.heading} section={s} num={offset + n + 1} id={anchorId(s.heading)} />)}
            {items.map((it, i) => {
              const num = offset + page.sections.length + i + 1
              return (
                <section key={it.id} aria-labelledby={it.id} className="rounded border border-[#E6DCD0] bg-white p-5  sm:p-7">
                  <h2 id={it.id} className="mb-5 flex scroll-mt-28 items-center gap-3 font-newsreader text-[1.375rem] font-semibold leading-tight tracking-tight text-obsidian-900 sm:text-[1.625rem]"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-wine-800 text-sm font-semibold tabular-nums text-white" aria-hidden="true">{num}</span>{it.title}</h2>
                  {it.blocks.length === 2
                    ? <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"><div className="min-w-0"><ContactForm onSubmit={actions.onContact} /></div><div className="min-w-0"><ContactDetails /></div></div>
                    : <BlockBody block={it.blocks[0]} actions={actions} />}
                </section>
              )
            })}
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded border border-[#E6DCD0] bg-[#F4EEE6] p-4 text-sm text-obsidian-700">
              <I.History className="h-4 w-4" aria-hidden="true" />Last updated {formatDate(page.updated)}. Questions about this page:
              <a className="font-semibold text-wine-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>
            </p>
          </article>
          <RightRail related={related} groupLabel={staticGroups[page.group].label} />
        </div>
      </Container>
    </div>
  )
}
