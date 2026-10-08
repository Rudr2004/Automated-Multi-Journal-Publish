import { useParams } from 'react-router-dom'
import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { useTheme } from '../theme'
import type { StaticGroup } from '../types'

/** Serves every static page: the route decides the group, the slug picks the content. */
export function StaticPageContainer({ group }: { group: StaticGroup }) {
  const { slug = '' } = useParams()
  const { pages: { Static, NotFound }, AsyncView } = useTheme()
  const state = useAsync(async () => {
    const [page, all] = await Promise.all([api.getStaticPage(slug), api.listStaticPages()])
    return page && page.group === group ? { page, all } : null
  }, [slug, group])
  return (
    <AsyncView state={state} notFound={<NotFound />}>
      {({ page, all }) => <Static page={page} allPages={all} sidebar={all.filter((p) => p.group === group)}
        actions={{ onContact: api.submitTicket, onReviewer: api.applyAsReviewer }} />}
    </AsyncView>
  )
}
