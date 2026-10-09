// Detects the visitor's country from their IP address (a public lookup service, no key) so the submission form can pre-select the country and
// dialling code. It is a convenience only: it never blocks the form, times out quickly, remembers the answer for the session, and the author can
// always change both fields. If the lookup fails (offline, blocked, rate limited) nothing happens.
import { useEffect, useRef, useState } from 'react'
import { COUNTRIES, DIAL_CODES, initialForm, type SubmissionForm } from './submission'

const ENDPOINT = 'https://ipwho.is/?fields=success,country,country_code,calling_code'
const CACHE_KEY = 'geo-lookup-v1'
const TIMEOUT_MS = 4000

export interface DetectedLocation { country: string; dialCode: string }

/** Country names the lookup service may spell differently from the form's list. */
const ALIASES: Record<string, string> = { 'United States of America': 'United States', USA: 'United States', UK: 'United Kingdom', UAE: 'United Arab Emirates', 'Czechia': 'Czech Republic', 'Türkiye': 'Turkey' }

export async function detectLocation(): Promise<DetectedLocation | null> {
  try {
    const cached = window.sessionStorage.getItem(CACHE_KEY)
    if (cached) return JSON.parse(cached) as DetectedLocation | null
  } catch { /* storage unavailable: just look it up */ }
  const ctl = new AbortController()
  const timer = window.setTimeout(() => ctl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(ENDPOINT, { signal: ctl.signal })
    if (!res.ok) return null
    const j = (await res.json()) as { success?: boolean; country?: string; calling_code?: string | number }
    if (!j.success || !j.country) return null
    const name = ALIASES[j.country] ?? j.country
    const country = COUNTRIES.includes(name) ? name : 'Other'
    const dial = j.calling_code ? `+${String(j.calling_code).replace(/^\+/, '')}` : ''
    const dialCode = DIAL_CODES.some((d) => d.code === dial) ? dial : ''
    const found: DetectedLocation = { country, dialCode }
    try { window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(found)) } catch { /* ignore */ }
    return found
  } catch { return null } finally { window.clearTimeout(timer) }
}

/**
 * Pre-selects country and dialling code once, when the form still has the untouched defaults (so a restored draft or an author's own choice is
 * never overwritten). Returns a short note for the form to show ("Detected from your network: United Kingdom (+44)"), or ''.
 */
export function useDetectedLocation(author: SubmissionForm['author'], setAuthor: (patch: Partial<SubmissionForm['author']>) => void): string {
  const [note, setNote] = useState('')
  const latest = useRef(author)
  latest.current = author
  const apply = useRef(setAuthor)
  apply.current = setAuthor
  useEffect(() => {
    let live = true
    detectLocation().then((loc) => {
      if (!live || !loc) return
      const a = latest.current
      const untouched = a.country === initialForm.author.country && a.dialCode === initialForm.author.dialCode && !a.whatsapp
      if (!untouched) return
      const patch: Partial<SubmissionForm['author']> = {}
      if (loc.country !== a.country && loc.country !== 'Other') patch.country = loc.country
      if (loc.dialCode && loc.dialCode !== a.dialCode) patch.dialCode = loc.dialCode
      if (Object.keys(patch).length) apply.current(patch)
      if (loc.country !== 'Other') setNote(`Detected from your network: ${loc.country}${loc.dialCode ? ` (${loc.dialCode})` : ''}. You can change it.`)
    })
    return () => { live = false }
  }, [])
  return note
}
