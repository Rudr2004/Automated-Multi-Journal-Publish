import { useParams } from 'react-router-dom'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { useTheme } from '../theme'

export function CurrentIssueContainer() {
  const { pages: { Issue }, AsyncView } = useTheme()
  const state = useAsync(() => api.getCurrentIssue(), [])
  return <AsyncView state={state}>{(data) => <Issue data={data} />}</AsyncView>
}

export function IssueContainer() {
  const { volume = '', issue = '' } = useParams()
  const { pages: { Issue, NotFound }, AsyncView } = useTheme()
  const state = useAsync(() => api.getIssue(Number(volume), Number(issue)), [volume, issue])
  return <AsyncView state={state} notFound={<NotFound what="issue" />}>{(data) => <Issue data={data} />}</AsyncView>
}

export function PastIssuesContainer() {
  const { pages: { PastIssues }, AsyncView } = useTheme()
  const state = useAsync(async () => {
    const [issues, articles] = await Promise.all([api.listIssues(), api.listArticles()])
    return { issues, articles }
  }, [])
  return <AsyncView state={state}>{({ issues, articles }) => <PastIssues issues={issues} articles={articles} />}</AsyncView>
}
