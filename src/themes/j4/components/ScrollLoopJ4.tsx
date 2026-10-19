// Vertical ticker for the "Recent Submissions" lists: the list scrolls upwards slowly in a loop (content is rendered twice, the copy is hidden from
// assistive tech and made inert) and pauses on hover or keyboard focus. Reduced-motion visitors get a normal, scrollable list.
import type { ReactNode } from 'react'

export function ScrollLoopJ4({ children, count, className = 'space-y-3 text-xs', height = 'h-64' }: { children: ReactNode; count: number; className?: string; height?: string }) {
  const style = { ['--j1-scroll-duration' as string]: `${Math.max(18, count * 7)}s` }
  const mask = '[mask-image:linear-gradient(to_bottom,transparent,#000_10px,#000_calc(100%-10px),transparent)]'
  return (
    <div className={`j1-pausable relative overflow-hidden motion-reduce:overflow-y-auto ${height} ${mask}`}>
      <div className="j1-scroll-up" style={style}>
        <ul className={`${className} pb-3`}>{children}</ul>
        <ul className={`${className} pb-3`} aria-hidden="true" {...({ inert: '' } as object)}>{children}</ul>
      </div>
    </div>
  )
}
