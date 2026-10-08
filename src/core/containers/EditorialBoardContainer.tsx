import { api } from '../api'
import { useAsync } from '../lib/useAsync'
import { useTheme } from '../theme'

export function EditorialBoardContainer() {
  const { pages: { EditorialBoard }, AsyncView } = useTheme()
  const state = useAsync(() => api.listEditors(), [])
  return <AsyncView state={state}>{(editors) => <EditorialBoard editors={editors} />}</AsyncView>
}
