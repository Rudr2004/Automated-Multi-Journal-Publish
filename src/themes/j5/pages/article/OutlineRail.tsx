// Left rail (2 of 12 columns): the article outline. The Abstract group lists its blocks; the rest are single links to the sections below.
import type { ArticleFull } from '../../../../core/types'
import { cx } from '../../components/primitives'

interface Item { id: string; label: string }

const LINK = 'block rounded px-2.5 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none'

export function OutlineRail({ article, current, onGo }: { article: ArticleFull; current: string; onGo: (id: string) => void }) {
  const abstractItems: Item[] = [
    { id: 'abstract', label: 'Abstract' },
    ...(article.keywords?.length ? [{ id: 'keywords', label: 'Keywords' }] : []),
    { id: 'authors-section', label: 'Authors & Certs' },
    { id: 'publication-history', label: 'Publication history' },
  ]
  const rest: Item[] = [
    ...(article.sections ?? []).map((s) => ({ id: s.id, label: s.title })),
    ...(article.references?.length ? [{ id: 'references', label: `References (${article.references.length})` }] : []),
    ...(article.related?.length ? [{ id: 'related-articles', label: 'Related Articles' }] : []),
    { id: 'metrics', label: 'Visual Metrics' },
    { id: 'disclosures', label: 'Declarations' },
    { id: 'cite-panel', label: 'Cite Article' },
  ]
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); onGo(id) }
  const inAbstract = abstractItems.some((i) => i.id === current)
  return (
    <aside aria-label="Article outline" className="hidden space-y-3 lg:sticky lg:top-28 lg:col-span-2 lg:block lg:self-start print:hidden">
      <h2 className="font-work text-[11px] font-bold uppercase tracking-wider text-obsidian-600">Outline</h2>
      <nav className="space-y-1 font-work text-xs">
        <div className={cx('space-y-1 rounded p-1.5', inAbstract && 'bg-[#E1E8FD]/60')}>
          <a href="#abstract" onClick={go('abstract')} aria-current={inAbstract ? 'location' : undefined} className={cx(LINK, 'font-semibold text-wine-900')}>Abstract</a>
          <div className="space-y-0.5 pl-3 text-[11px] text-[#564241]">
            {abstractItems.map((i) => (
              <a key={i.id} href={`#${i.id}`} onClick={go(i.id)} className={cx('block rounded px-1 py-0.5 transition-colors hover:text-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none', current === i.id && 'font-medium text-wine-900 hover:underline')}>{i.label}</a>
            ))}
          </div>
        </div>
        {rest.map((i) => (
          <a key={i.id} href={`#${i.id}`} onClick={go(i.id)} aria-current={current === i.id ? 'location' : undefined}
            className={cx(LINK, 'break-words', current === i.id ? 'font-semibold text-wine-900' : 'text-[#564241] hover:text-wine-800')}>{i.label}</a>
        ))}
      </nav>
    </aside>
  )
}
