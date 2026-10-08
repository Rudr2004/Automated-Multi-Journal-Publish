import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { useTheme } from '../theme'

export function HomeContainer() {
  const { pages: { Home }, AsyncView, HomeExtras } = useTheme()
  const state = useAsync(() => api.getHome(), [])
  return (
    <AsyncView state={state}>
      {(data) => (<><Home data={data} onSubscribe={api.subscribe} />{HomeExtras && <HomeExtras />}</>)}
    </AsyncView>
  )
}
