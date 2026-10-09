// For pages without a right rail of their own: page content on the left, a slim sticky right column holding the awards card
// (below xl the card stacks under the content). Same 1440 container as every other page.
import type { ReactNode } from 'react'
import { AwardsCard } from './AwardsCard'
import { Container } from './primitives'

export function WithAwardsRail({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Container className={`grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] ${className}`}>
      <div className="min-w-0">{children}</div>
      <aside aria-label="Academic recognition" className="empty:hidden xl:sticky xl:top-24"><AwardsCard /></aside>
    </Container>
  )
}
