// Page body plus the same right column as the home page (call for papers, awards, copyright, indicators, index logos, resources...).
// Used by every page that has no sidebar of its own; below xl the column stacks under the content. The article page has none.
import type { ReactNode } from 'react'
import { HomeRail } from './HomeRail'

/** `before` is an optional card shown above the home column (for example recent submissions on the submit page). */
export function WithAwardsRail({ children, before }: { children: ReactNode; before?: ReactNode }) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22.5rem] xl:gap-8">
      <div className="min-w-0">{children}</div>
      <aside aria-label="Journal information" className="min-w-0 space-y-5">{before}<HomeRail /></aside>
    </div>
  )
}
