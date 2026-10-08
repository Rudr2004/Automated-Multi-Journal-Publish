import { useCallback, useMemo, useState, type FocusEvent } from 'react'
import type { FormErrors } from './submission'

/**
 * Decides which validation errors to show: a field's error appears once the user has left it (blur),
 * and every error appears after `attempt()` (Next / Submit pressed). Controls must have a `name` equal to their error key.
 */
export function useVisibleErrors(all: FormErrors) {
  const [attempted, setAttempted] = useState(false)
  const [touched, setTouched] = useState<Set<string>>(new Set())

  const errors = useMemo<FormErrors>(
    () => (attempted ? all : Object.fromEntries(Object.entries(all).filter(([k]) => touched.has(k)))),
    [all, attempted, touched],
  )

  const onBlur = useCallback((e: FocusEvent<HTMLElement>) => {
    const name = (e.target as HTMLElement).getAttribute('name')
    if (name) setTouched((t) => (t.has(name) ? t : new Set(t).add(name)))
  }, [])

  /** Marks the form as attempted. Returns true when it is valid. */
  const attempt = () => { setAttempted(true); return Object.keys(all).length === 0 }
  const reset = () => { setAttempted(false); setTouched(new Set()) }

  return { errors, onBlur, attempt, reset }
}

/** Focuses the first control in `root` whose `name` has an error. */
export function focusFirstError(root: HTMLElement | null, errors: FormErrors) {
  const key = Object.keys(errors)[0]
  const el = key && root?.querySelector<HTMLElement>(`[name="${CSS.escape(key)}"]`)
  if (el) el.focus()
  else root?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
