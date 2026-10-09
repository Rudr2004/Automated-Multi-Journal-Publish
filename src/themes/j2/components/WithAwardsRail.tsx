// Page body plus a slim right column holding the awards card (used on pages that have no right sidebar of their own).
// Below xl the card stacks under the content.
import type { ReactNode } from 'react'
import { AwardsCard } from './AwardsCard'

/** `before` is an optional card shown above the awards card at the top of the right column. */
export function WithAwardsRail({ children, before }: { children: ReactNode; before?: ReactNode }) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
      <div className="min-w-0">{children}</div>
      <aside aria-label="Recognition" className="min-w-0 space-y-5 xl:sticky xl:top-24">{before}<AwardsCard /></aside>
    </div>
  )
}
