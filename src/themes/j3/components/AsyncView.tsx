import type { ReactNode } from 'react'
import type { AsyncState } from '../../../core/lib/useAsync'
import { Container, ErrorState, Skeleton } from './primitives'

/** Generic skeleton shown while a page's data loads. */
export function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <Skeleton className="h-[26rem] w-full rounded-none" />
      <Container className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 3 }, (_, i) => <Skeleton key={i} className="h-56" />)}</Container>
    </div>
  )
}

/** Renders loading, error and "not found" states around a page; children receive the loaded data. */
export function AsyncView<T>({ state, skeleton = <PageSkeleton />, notFound, children }: {
  state: AsyncState<T | null>
  skeleton?: ReactNode
  notFound?: ReactNode
  children: (data: T) => ReactNode
}) {
  if (state.loading && !state.data) return <>{skeleton}</>
  if (state.error) return <Container className="py-16"><ErrorState onRetry={state.reload} /></Container>
  if (!state.data) return <>{notFound ?? <Container className="py-16"><ErrorState message="Nothing to show here." /></Container>}</>
  return <>{children(state.data)}</>
}
