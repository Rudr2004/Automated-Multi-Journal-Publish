// Editorial article tile: the theme label above a large title and the author line below. On hover or keyboard focus the title stays in place,
// the tile gets an outline, and the abstract takes the place of the author line.
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import type { ArticleSummary } from '../../../core/types'
import { Artwork } from './Artwork'
import { cx, Kicker } from './primitives'
import { themeColor } from './themes'
import { ArrowUpRight } from '../icons'

export type TileSize = 'large' | 'medium' | 'small'
const SURFACES = ['bg-iris-50', 'bg-white ring-1 ring-inset ring-mauve-200', 'bg-ember-50', 'bg-night-900 text-white']

export function ArticleTile({ article, size = 'medium', surface = 0, className }: { article: ArticleSummary; size?: TileSize; surface?: number; className?: string }) {
  const dark = SURFACES[surface % SURFACES.length].includes('night')
  const big = size === 'large'
  return (
    <article className={cx(
      'group relative flex flex-col overflow-hidden transition-[box-shadow,transform] duration-200 hover:shadow-lift3 focus-within:shadow-lift3',
      dark ? 'hover:ring-2 hover:ring-inset hover:ring-ember-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-ember-400' : 'hover:ring-2 hover:ring-inset hover:ring-iris-700 focus-within:ring-2 focus-within:ring-inset focus-within:ring-iris-700',
      SURFACES[surface % SURFACES.length], big ? 'p-7 sm:p-9' : size === 'medium' ? 'p-6' : 'p-5', className)}>
      {big && <Artwork seed={article.paperId} className="pointer-events-none absolute -bottom-14 -right-14 h-52 w-52 -rotate-6 opacity-90 sm:h-64 sm:w-64" />}
      <Kicker className={cx('relative', dark ? 'text-ember-400' : '')}><span style={dark ? undefined : { color: themeColor(article.subject) }}>{article.subject}</span></Kicker>
      <h3 className={cx('relative mt-3 font-jakarta font-semibold leading-snug', dark ? 'text-white' : 'text-night-900', big ? 'text-[1.625rem] sm:text-[1.875rem]' : size === 'medium' ? 'text-[1.375rem]' : 'text-lg')}>
        <AppLink to={paths.article(article.paperId)} className="after:absolute after:inset-0 after:z-10 after:content-['']">{article.title}</AppLink>
      </h3>

      {/* Both blocks share one grid cell, so the tile never changes height: the author line fades out as the abstract fades in. */}
      <div className="relative mt-auto grid pt-6">
        <p className={cx('text-sm transition-opacity duration-200 [grid-area:1/1] group-focus-within:opacity-0 group-hover:opacity-0 motion-reduce:transition-none', dark ? 'text-night-200' : 'text-mauve-700')}>
          <span className="font-semibold">{article.authors.slice(0, 2).join(', ')}{article.authors.length > 2 ? ' et al.' : ''}</span>
          <span aria-hidden="true"> · </span>{article.type}
        </p>
        <div className="pointer-events-none opacity-0 transition-opacity duration-200 [grid-area:1/1] group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none">
          <p className={cx('text-sm', dark ? 'text-night-100' : 'text-mauve-800', big ? 'line-clamp-4' : 'line-clamp-3')}>{article.abstract}</p>
          <p className={cx('mt-2 inline-flex items-center gap-1 font-inter text-sm font-semibold', dark ? 'text-ember-400' : 'text-iris-700')}>Read article <ArrowUpRight className="h-4 w-4" aria-hidden="true" /></p>
        </div>
      </div>
    </article>
  )
}
