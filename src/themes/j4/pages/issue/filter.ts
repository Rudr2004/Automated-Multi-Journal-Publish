// Client-side filtering, sorting and grouping for the issue table of contents.
import type { ArticleSummary, ArticleType } from '../../../../core/types'
import { ARTICLE_TYPES } from '../../../../core/types'

export type IssueSort = 'pages' | 'title' | 'views' | 'downloads'
export const SORTS: { value: IssueSort; label: string }[] = [
  { value: 'pages', label: 'Page order' }, { value: 'title', label: 'Title A to Z' },
  { value: 'views', label: 'Most viewed' }, { value: 'downloads', label: 'Most downloaded' },
]
export interface IssueFilters { area: string; type: string; text: string; sort: IssueSort }
export const EMPTY: IssueFilters = { area: '', type: '', text: '', sort: 'pages' }

const startPage = (a: ArticleSummary) => parseInt(a.pages, 10) || 0

export function applyFilters(articles: ArticleSummary[], f: IssueFilters): ArticleSummary[] {
  const t = f.text.trim().toLowerCase()
  const list = articles.filter((a) =>
    (!f.area || a.subject === f.area) && (!f.type || a.type === f.type) &&
    (!t || a.title.toLowerCase().includes(t) || a.subject.toLowerCase().includes(t) || a.authors.some((n) => n.toLowerCase().includes(t))))
  const by: Record<IssueSort, (a: ArticleSummary, b: ArticleSummary) => number> = {
    pages: (a, b) => startPage(a) - startPage(b),
    title: (a, b) => a.title.localeCompare(b.title),
    views: (a, b) => b.views - a.views,
    downloads: (a, b) => b.downloads - a.downloads,
  }
  return [...list].sort(by[f.sort])
}

/** Groups in article-type order (editorial first), skipping empty ones. */
export function groupByType(list: ArticleSummary[]): { type: ArticleType; items: ArticleSummary[] }[] {
  const order: ArticleType[] = ['Editorial', ...ARTICLE_TYPES.filter((t) => t !== 'Editorial')]
  return order.map((type) => ({ type, items: list.filter((a) => a.type === type) })).filter((g) => g.items.length)
}

export const plural = (type: ArticleType) => (type === 'Editorial' ? 'Editorial' : `${type}s`)
