// Draft persistence for the submission form (localStorage; every access is guarded).
import { useEffect, useState } from 'react'
import { initialForm, type StepIndex, type SubmissionForm } from './submission'

const KEY = 'j1-submission-draft-v1'

export interface Draft { form: SubmissionForm; step: StepIndex; savedAt: string }

/** Declarations and the captcha are never restored: authors must confirm them again at submission. */
const sanitise = (f: SubmissionForm): SubmissionForm => ({ ...f, declarations: initialForm.declarations, captcha: false })

export function loadDraft(): Draft | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const d = JSON.parse(raw) as Draft
    return d?.form ? { ...d, form: sanitise({ ...initialForm, ...d.form, author: { ...initialForm.author, ...d.form.author } }) } : null
  } catch { return null }
}

export function clearDraft() {
  try { localStorage.removeItem(KEY) } catch { /* storage unavailable */ }
}

export const isPristine = (f: SubmissionForm) => JSON.stringify(sanitise(f)) === JSON.stringify(sanitise(initialForm))

/** Debounced autosave. Returns the time of the last save (or null). Pass enabled=false to pause (e.g. before resuming). */
export function useAutosave(form: SubmissionForm, step: StepIndex, enabled: boolean) {
  const [savedAt, setSavedAt] = useState<string | null>(null)
  useEffect(() => {
    if (!enabled || isPristine(form)) return
    const t = setTimeout(() => {
      const at = new Date().toISOString()
      try { localStorage.setItem(KEY, JSON.stringify({ form: sanitise(form), step, savedAt: at } satisfies Draft)); setSavedAt(at) }
      catch { /* storage unavailable: keep working without autosave */ }
    }, 700)
    return () => clearTimeout(t)
  }, [form, step, enabled])
  return savedAt
}
