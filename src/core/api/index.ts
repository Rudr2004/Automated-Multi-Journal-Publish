// The data source of the active journal. It is installed once at start-up (main.tsx), so containers never import a journal's mock data.
import type { JournalApi } from './types'

export type { JournalApi } from './types'

let current: JournalApi | null = null

export const installApi = (api: JournalApi) => { current = api }

/** Proxy so containers can call `api.getHome()` at any time after start-up. */
export const api: JournalApi = new Proxy({} as JournalApi, {
  get: (_t, key: string) => {
    if (!current) throw new Error('Journal API not installed')
    return current[key as keyof JournalApi]
  },
})
