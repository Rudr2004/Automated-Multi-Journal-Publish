import { useParams } from 'react-router-dom'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { useTheme } from '../theme'

export function ArticleContainer() {
  const { id = '' } = useParams()
  const { pages: { Article, NotFound }, AsyncView } = useTheme()
  const state = useAsync(() => api.getArticle(id), [id])
  return <AsyncView state={state} notFound={<NotFound what="article" />}>{(article) => <Article article={article} />}</AsyncView>
}
