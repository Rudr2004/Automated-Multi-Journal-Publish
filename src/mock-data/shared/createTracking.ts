// Mock paper tracking shared by every journal: stage dates, documents and payment state follow from a paper's stage.
import type { JournalConfig } from '../../config/journals/types'
import type { PaperDocument, PaperStage, PaymentStatus, TrackedPaper, TrackResult } from '../../core/types'
import { STAGES } from '../../core/types'

export const DEMO_EMAIL = 'demo@example.com'

export interface TrackingSpec {
  id: string; email: string; title: string; stage: number; authors: string[]; start: string
  payment?: PaymentStatus
  referral?: { code: string; credits: number; referred: number }
}

/** Builds the tracking helpers for one journal from its demo paper specs. */
export function createTracking(journal: JournalConfig, specs: (make: (s: TrackingSpec) => TrackedPaper) => TrackedPaper[]) {
  const doc = (id: string, label: string, available: boolean, note?: string): PaperDocument => ({ id, label, available, note })

  /** Dates for every stage up to (and including) stage `n`, six days apart. */
  const dates = (n: number, start: string): Partial<Record<PaperStage, string>> => {
    const out: Partial<Record<PaperStage, string>> = {}
    const d = new Date(`${start}T00:00:00Z`)
    STAGES.slice(0, n + 1).forEach((s) => { out[s.id] = d.toISOString().slice(0, 10); d.setUTCDate(d.getUTCDate() + 6) })
    return out
  }

  const DECISION_NOTE =
    'Accepted with minor changes. The methodology is sound and the results are clearly reported. Please add the sample-size justification requested in the review report before production.'


  /** Builds a tracked paper whose documents, payment state and notes follow from its stage. */
  function make(s: TrackingSpec): TrackedPaper {
    const stage = s.stage
    const payment: PaymentStatus = s.payment ?? (stage < 3 ? 'not-due' : stage < 5 ? 'due' : 'paid')
    const signed = stage >= 5
    const stageDates = dates(stage, s.start)
    return {
      paperId: s.id, email: s.email, title: s.title, journalName: journal.name, authors: s.authors,
      stageIndex: stage, stageDates, editable: stage < 3, payment, copyrightSigned: signed,
      decisionNote: stage >= 2 ? DECISION_NOTE : undefined,
      indexedOn: stage >= 7 ? stageDates.indexed : undefined,
      documents: [
        doc('review', 'Review report', stage >= 2, stage < 2 ? 'Available after the decision' : undefined),
        doc('accept', 'Acceptance letter', stage >= 3),
        doc('copyright', 'Copyright form', stage >= 3, stage >= 3 ? (signed ? 'Signed' : 'Signature pending') : undefined),
        doc('invoice', 'GST invoice', payment === 'paid', payment === 'paid' ? undefined : 'Generated after payment is confirmed'),
        doc('cert', 'Author certificates', stage >= 6, stage >= 6 ? 'With QR code' : 'Issued on publication'),
      ],
      referral: s.referral ?? { code: `${s.id.slice(-4)}-${journal.shortName}`, credits: 0, referred: 0 },
    }
  }

  /** Demo papers covering every stage and payment state. Email must match to view. */
  const trackedPapers: TrackedPaper[] = specs(make)

  const dynamic: TrackedPaper[] = []
  const addTracked = (p: TrackedPaper) => dynamic.push(p)

  function findPaper(paperId: string, email: string): TrackResult {
    const id = paperId.trim().toUpperCase()
    const found = [...trackedPapers, ...dynamic].find((p) => p.paperId === id)
    if (found) return found.email.toLowerCase() === email.trim().toLowerCase() ? { kind: 'found', paper: found } : { kind: 'not-found' }
    const m = id.match(/^([A-Z]{2,5})\d{10}$/)
    if (m && m[1] !== journal.paperIdPrefix) return { kind: 'other-journal', code: m[1] }
    return { kind: 'not-found' }
  }

  function newSubmission(title: string, email: string, authorName: string): TrackedPaper {
    const paperId = `${journal.paperIdPrefix}2026${String(300 + dynamic.length).padStart(6, '0')}`
    const p = make({ id: paperId, email, title, stage: 0, authors: [authorName || 'Corresponding author'], start: new Date().toISOString().slice(0, 10) })
    addTracked(p)
    return p
  }

  return { trackedPapers, findPaper, newSubmission }
}
