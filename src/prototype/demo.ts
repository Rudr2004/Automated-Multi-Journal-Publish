// Sample data the prototype index links to; each journal's mock data provides its own.
import type { TrackedPaper } from '../core/types'

export interface PrototypeDemo {
  trackedPapers: TrackedPaper[]
  /** [research article, review article, editorial] Paper IDs. */
  articleIds: [string, string, string]
  /** A past issue to link to: [volume, issue]. */
  pastIssue: [number, number]
}
