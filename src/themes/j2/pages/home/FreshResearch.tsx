// "Fresh research": the latest articles with a card / list toggle. The choice is remembered in this browser only.
import { useState } from 'react'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { ArticleCard, type CardLayout } from '../../components/ArticleCard'
import { Container, cx, SectionHeading } from '../../components/primitives'
import { ArrowRight, GridView, ListView } from '../../icons'

const KEY = 'jimrt-layout'
const load = (): CardLayout => { try { return localStorage.getItem(KEY) === 'list' ? 'list' : 'card' } catch { return 'card' } }

export function LayoutToggle({ value, onChange }: { value: CardLayout; onChange: (v: CardLayout) => void }) {
  const set = (v: CardLayout) => { onChange(v); try { localStorage.setItem(KEY, v) } catch { /* storage unavailable */ } }
  const btn = (v: CardLayout, label: string, icon: React.ReactNode) => (
    <button type="button" aria-pressed={value === v} onClick={() => set(v)} className={cx('inline-flex items-center gap-1.5 rounded-chip px-3 py-1.5 text-sm font-semibold', value === v ? 'bg-white text-accent-800 shadow-card' : 'text-graphite-600 hover:text-graphite-800')}>{icon}{label}</button>
  )
  return <div role="group" aria-label="Layout" className="inline-flex rounded-soft bg-graphite-100 p-1">{btn('card', 'Cards', <GridView className="h-4 w-4" aria-hidden="true" />)}{btn('list', 'List', <ListView className="h-4 w-4" aria-hidden="true" />)}</div>
}

export function FreshResearch({ articles }: { articles: ArticleSummary[] }) {
  const [layout, setLayout] = useState<CardLayout>(load)
  return (
    <section aria-labelledby="fresh-title" className="py-14 sm:py-20">
      <Container>
        <SectionHeading id="fresh-title" eyebrow="Latest" title="Fresh research" text="Newly published articles from the current issue. All are free to read and download."
          action={<LayoutToggle value={layout} onChange={setLayout} />} />
        <ul className={cx('grid gap-5', layout === 'card' ? 'sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1')}>
          {articles.map((a) => <li key={a.paperId} className="flex"><div className="w-full"><ArticleCard article={a} layout={layout} /></div></li>)}
        </ul>
        <div className="mt-8 text-center">
          <AppLink to={paths.currentIssue} className="inline-flex items-center gap-1 text-sm font-semibold text-accent-700 hover:underline">See every article in the current issue <ArrowRight className="h-4 w-4" aria-hidden="true" /></AppLink>
        </div>
      </Container>
    </section>
  )
}
