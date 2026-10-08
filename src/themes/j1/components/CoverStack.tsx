import { motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import type { IssueSummary } from '../../../mock-data/journals/j1'
import { paths } from '../../../config/routes'
import { IssueCover } from './IssueCover'
import { AppLink } from '../../../core/router'

// Resting and fanned-out positions of the covers behind the current one.
const REST = [{ x: 0, y: 0, rotate: 0 }, { x: 16, y: -8, rotate: 3 }, { x: 32, y: -16, rotate: 6 }]
const FAN = [{ x: 0, y: 0, rotate: 0 }, { x: 44, y: -4, rotate: 7 }, { x: 88, y: -8, rotate: 14 }]

/**
 * The signature masthead graphic: the current issue on top, the two previous issues stacked behind it.
 * Hover or focus fans them out; each cover opens its own issue.
 */
export function CoverStack({ issues }: { issues: IssueSummary[] }) {
  const reduce = useReducedMotion()
  const [fanned, setFanned] = useState(false)
  const pos = fanned && !reduce ? FAN : REST

  return (
    <div className="relative h-[215px] w-[190px] shrink-0 sm:w-[200px]" role="group" aria-label="Current and previous issues"
      onMouseEnter={() => setFanned(true)} onMouseLeave={() => setFanned(false)} onFocusCapture={() => setFanned(true)} onBlurCapture={() => setFanned(false)}>
      {issues.slice(0, 3).map((it, i) => (
        // Rendered back-to-front so the current issue (index 0) is on top.
        <motion.div key={`${it.volume}-${it.issue}`} className="absolute left-0 top-6 w-[128px]" style={{ zIndex: 3 - i, transformOrigin: 'bottom left' }}
          initial={false} animate={pos[i]} transition={reduce ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}>
          <AppLink to={it.isCurrent ? paths.currentIssue : paths.issue(it.volume, it.issue)} aria-label={`Open Volume ${it.volume}, Issue ${it.issue}${it.isCurrent ? ' (current issue)' : ''}`}
            className="group relative block border border-line bg-white shadow-xl hover:border-scholar">
            <IssueCover volume={it.volume} issue={it.issue} month={it.month} className="block h-auto w-full" />
            {i > 0 && <span aria-hidden className="absolute inset-0 bg-white/0 transition-colors group-hover:bg-white/0" />}
          </AppLink>
        </motion.div>
      ))}
    </div>
  )
}
