// Journal 4 static pages in the reference layout: title card, sticky quick-jump bar, numbered section cards, rich blocks and the right sidebar card stack.
// /policies/publication-ethics uses the dedicated EthicsPolicy body; every other page shares the same shell and section style.
import { useMemo } from 'react'
import { journal } from '../../../config/journals'
import { staticGroups } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import type { BlockActions } from '../../../core/theme'
import type { StaticBlock, StaticPageData } from '../../../core/types'
import { anchorId, BlockBody, blockTitle } from '../components/static/StaticBlocks'
import { QuickNav, RightRail, SectionClauses, SectionHead, StaticBand, type TocItem } from '../components/static/Clauses'
import { EthicsPolicy, ethicsToc } from '../components/static/EthicsPolicy'
import { ContactDetails } from '../components/static/InfoBlocks'
import { ContactForm } from '../components/static/ContactForm'
import { Container } from '../components/primitives'
import * as I from '../icons'

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
  const ethics = page.slug === 'publication-ethics' && page.group === 'policies'
  const toc = useMemo<TocItem[]>(() => ethics ? ethicsToc : [
    ...page.sections.map((s) => ({ id: anchorId(s.heading), label: s.heading })),
    ...items.map((i) => ({ id: i.id, label: i.title })),
  ].map((t, n) => ({ ...t, num: n + 1 })), [page, items, ethics])

  const chip = 'inline-flex items-center gap-1 rounded-ctl border px-2.5 py-1 font-medium'
  return (
    <Container className="py-6 sm:py-8">
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-12">
        <div className="min-w-0 space-y-5 lg:col-span-8">
          <div>
            <StaticBand page={page} meta={<>
              <span className={`${chip} border-sky-200 bg-sky-100 font-semibold text-[#0b2545]`}><I.Verified className="h-3.5 w-3.5 text-cobalt-700" aria-hidden="true" />{staticGroups[page.group].label}</span>
              <span className={`${chip} border-slate-200 bg-slate-100 text-slate-700`}><I.History className="h-3.5 w-3.5" aria-hidden="true" />Updated {formatDate(page.updated)}</span>
              <span className={`${chip} border-emerald-200 bg-emerald-50 text-emerald-800`}><I.OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />{journal.licence.name}</span>
            </>} />
          </div>
          <QuickNav toc={toc} />
          <article className="min-w-0 space-y-5">
            {ethics && <EthicsPolicy />}
            {!ethics && page.sections.map((s, n) => <SectionClauses key={s.heading} section={s} num={n + 1} id={anchorId(s.heading)} />)}
            {!ethics && items.map((it, i) => {
              const num = page.sections.length + i + 1
              return (
                <section key={it.id} aria-labelledby={it.id} className="scroll-mt-28 rounded-pane border border-abyss-200 bg-white p-5 shadow-hair sm:p-7">
                  <SectionHead num={num} id={it.id} title={it.title} />
                  {it.blocks.length === 2
                    ? <div className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"><div className="min-w-0"><ContactForm onSubmit={actions.onContact} /></div><div className="min-w-0"><ContactDetails /></div></div>
                    : <BlockBody block={it.blocks[0]} actions={actions} />}
                </section>
              )
            })}
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-pane border border-abyss-200 bg-white p-4 text-sm text-steel-600 shadow-hair">
              <I.History className="h-4 w-4" aria-hidden="true" />Last updated {formatDate(page.updated)}. Questions about this page:
              <a className="font-semibold text-cobalt-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a>
            </p>
          </article>
        </div>
        <div className="min-w-0 lg:col-span-4"><RightRail page={page} sidebar={sidebar} related={related} groupLabel={staticGroups[page.group].label} /></div>
      </div>
    </Container>
  )
}
