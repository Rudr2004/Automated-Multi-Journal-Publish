import { useCallback, useEffect, useState } from 'react'

/** Loads data through a fake-API call, with loading / error state and a reload function. */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]) {
  const [data, setData] = useState<T | undefined>()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [nonce, setNonce] = useState(0)
  const reload = useCallback(() => setNonce((n) => n + 1), [])
  useEffect(() => {
    let live = true
    setLoading(true)
    setError(null)
    load()
      .then((d) => live && setData(d))
      .catch((e: Error) => live && setError(e))
      .finally(() => live && setLoading(false))
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce, ...deps])
  return { data, loading, error, reload }
}

/** What `useAsync` returns; themes' AsyncView components take it. */
export type AsyncState<T> = { data: T | undefined; loading: boolean; error: Error | null; reload: () => void }
