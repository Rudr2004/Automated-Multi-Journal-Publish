// Page body plus a slim right column holding the awards card (used on pages that have no right sidebar of their own).
// Below xl the card stacks under the content.
import type { ReactNode } from 'react'
import { AwardsCard } from './AwardsCard'

export function WithAwardsRail({ children }: { children: ReactNode }) {
  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] xl:gap-8">
      <div className="min-w-0">{children}</div>
      <aside aria-label="Recognition" className="min-w-0 xl:sticky xl:top-24"><AwardsCard /></aside>
    </div>
  )
}
