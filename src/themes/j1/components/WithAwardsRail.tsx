// For pages without a right rail of their own: page content on the left, the same right sidebar as the home page on the right
// (call for papers, track, awards, indexing verifier, downloads, author rights). Below xl the sidebar stacks under the content.
// Same 1440 container as every other page.
import type { ReactNode } from 'react'
import { RightSidebar } from './HomeSidebars'
import { StickyRail } from './StickyRail'
import { Container } from './primitives'

export function WithAwardsRail({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <Container className={`grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px] ${className}`}>
      <div className="min-w-0">{children}</div>
      <StickyRail label="Author tools" className="grid content-start gap-4 md:grid-cols-2 xl:block xl:space-y-4"><RightSidebar /></StickyRail>
    </Container>
  )
}
