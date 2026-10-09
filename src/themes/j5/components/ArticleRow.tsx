// A result row used by the archive list and the search results (same API as before): now the full paper row with author photo chips, icon metrics and an abstract toggle.
import type { ArticleSummary } from '../../../core/types'
import { PaperRow } from './PaperBits'

export function ArticleRow({ article, terms = [], abstract = false }: { article: ArticleSummary; terms?: string[]; abstract?: boolean }) {
  return <PaperRow article={article} terms={terms} defaultOpen={abstract} showIssue />
}
