// A result row used by the archive list (same API as before): now the scholarly article card with author photo chips, icon metrics, quick actions and an abstract toggle.
import type { ArticleSummary } from '../../../core/types'
import { ArticleCard } from './ArticleCard'

export function ArticleRow({ article, terms = [], abstract = false }: { article: ArticleSummary; terms?: string[]; abstract?: boolean }) {
  return <ArticleCard article={article} terms={terms} defaultOpen={abstract} showIssue />
}
