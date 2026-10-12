// Client-side filtering, sorting and grouping for the issue table of contents.
import type { ArticleSummary, ArticleType } from '../../../../core/types'
import { ARTICLE_TYPES } from '../../../../core/types'
import { doiFor } from '../../../../config/journals'

export type IssueSort = 'pages' | 'title' | 'views' | 'downloads' | 'citations'
export const SORTS: { value: IssueSort; label: string }[] = [
  { value: 'pages', label: 'Page order' }, { value: 'title', label: 'Title A to Z' },
  { value: 'views', label: 'Most viewed' }, { value: 'citations', label: 'Most cited' }, { value: 'downloads', label: 'Most downloaded' },
]
export type SearchField = 'all' | 'title' | 'author' | 'abstract' | 'doi'
export const FIELDS: { value: SearchField; label: string }[] = [{ value: 'all', label: 'All Fields' }, { value: 'title', label: 'Article Title' }, { value: 'author', label: 'Author Name' }, { value: 'abstract', label: 'Abstract Text' }, { value: 'doi', label: 'DOI' }]
export interface IssueFilters { area: string; type: string; text: string; sort: IssueSort; field: SearchField }
export const EMPTY: IssueFilters = { area: '', type: '', text: '', sort: 'pages', field: 'all' }

const startPage = (a: ArticleSummary) => parseInt(a.pages, 10) || 0

const has = (v: string, t: string) => v.toLowerCase().includes(t)
function matches(a: ArticleSummary, t: string, field: SearchField): boolean {
  const title = has(a.title, t), author = a.authors.some((n) => has(n, t)), abstract = has(a.abstract, t), doi = has(doiFor(a.paperId), t) || has(a.paperId, t)
  if (field === 'title') return title
  if (field === 'author') return author
  if (field === 'abstract') return abstract
  if (field === 'doi') return doi
  return title || author || abstract || doi || has(a.subject, t)
}

export function applyFilters(articles: ArticleSummary[], f: IssueFilters): ArticleSummary[] {
  const t = f.text.trim().toLowerCase()
  const list = articles.filter((a) =>
    (!f.area || a.subject === f.area) && (!f.type || a.type === f.type) &&
    (!t || matches(a, t, f.field)))
  const by: Record<IssueSort, (a: ArticleSummary, b: ArticleSummary) => number> = {
    pages: (a, b) => startPage(a) - startPage(b),
    title: (a, b) => a.title.localeCompare(b.title),
    views: (a, b) => b.views - a.views,
    downloads: (a, b) => b.downloads - a.downloads,
    citations: (a, b) => b.citations - a.citations,
  }
  return [...list].sort(by[f.sort])
}

/** Groups in article-type order (editorial first), skipping empty ones. */
export function groupByType(list: ArticleSummary[]): { type: ArticleType; items: ArticleSummary[] }[] {
  const order: ArticleType[] = ['Editorial', ...ARTICLE_TYPES.filter((t) => t !== 'Editorial')]
  return order.map((type) => ({ type, items: list.filter((a) => a.type === type) })).filter((g) => g.items.length)
}

/** Section headings as in the issue reference (editorial perspectives, original research, review surveys). */
export const GROUP_TITLE: Record<ArticleType, string> = { Editorial: 'Editorial Overview & Perspectives', 'Research Article': 'Original Research Articles', 'Review Article': 'Review & Systematic Survey Articles', 'Short Communication': 'Short Communications' }
export const plural = (type: ArticleType) => GROUP_TITLE[type] ?? `${type}s`
