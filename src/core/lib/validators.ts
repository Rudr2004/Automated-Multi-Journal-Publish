import { journal } from '../../config/journals'
// Reusable field validators and input sanitisers. Validators return '' when valid, otherwise a message.

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const NAME_RE = /^[\p{L}][\p{L}\s.'’-]*$/u
export const PAPER_ID_RE = /^[A-Z]{2,5}\d{10}$/

export const required = (v: string, message: string) => (v.trim() ? '' : message)

export const email = (v: string) => {
  const t = v.trim()
  if (!t) return 'Enter an email address.'
  if (t.length > 120) return 'Email is too long.'
  return EMAIL_RE.test(t) ? '' : 'Enter a valid email address, e.g. name@institution.edu.'
}

export const personName = (v: string, who = 'name') => {
  const t = v.trim()
  if (!t) return `Enter the ${who}.`
  if (t.length < 2) return `The ${who} is too short.`
  return NAME_RE.test(t) ? '' : `The ${who} can contain letters, spaces, . ' and - only.`
}

export const textLength = (v: string, min: number, max: number, label: string) => {
  const n = v.trim().length
  if (n === 0) return `Enter the ${label}.`
  if (n < min) return `The ${label} is too short (minimum ${min} characters).`
  if (n > max) return `The ${label} is too long (maximum ${max} characters).`
  return ''
}

// ---- Phone ----
/** Keeps digits only. */
export const digitsOnly = (v: string) => v.replace(/\D/g, '')
/** Maximum national-number length for a dial code (India is fixed at 10 digits). */
export const phoneMaxLength = (dialCode: string) => (dialCode === '+91' ? 10 : 15)

export function phone(digits: string, dialCode: string) {
  if (!digits) return 'Enter your WhatsApp number.'
  if (dialCode === '+91') {
    if (digits.length !== 10) return 'Indian mobile numbers have 10 digits.'
    return /^[6-9]/.test(digits) ? '' : 'Indian mobile numbers start with 6, 7, 8 or 9.'
  }
  return digits.length >= 7 && digits.length <= 15 ? '' : 'Enter 7 to 15 digits, without the country code.'
}

// ---- ORCID ----
/** Formats typed input as 0000-0000-0000-000X while the user types. */
export function formatOrcid(raw: string) {
  const c = raw.toUpperCase().replace(/[^0-9X]/g, '').slice(0, 16)
  return c.replace(/(.{4})(?=.)/g, '$1-')
}

/** ISO 7064 mod 11-2 checksum used by ORCID. */
const orcidChecksumOk = (id: string) => {
  const d = id.replace(/-/g, '')
  let total = 0
  for (let i = 0; i < 15; i++) total = (total + Number(d[i])) * 2
  const result = (12 - (total % 11)) % 11
  return d[15] === (result === 10 ? 'X' : String(result))
}

export function orcid(v: string) {
  if (!v) return '' // optional
  if (!/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(v)) return 'ORCID iD must look like 0000-0002-1825-0097.'
  return orcidChecksumOk(v) ? '' : 'This ORCID iD is not valid. Please check the digits.'
}

// ---- Keywords ----
export const parseKeywords = (v: string) => v.split(',').map((k) => k.trim()).filter(Boolean)

export function keywords(v: string, min = 3, max = 8) {
  const list = parseKeywords(v)
  if (list.length < min || list.length > max) return `Enter ${min} to ${max} keywords separated by commas.`
  if (list.some((k) => k.length > 40)) return 'Each keyword must be 40 characters or fewer.'
  const lower = list.map((k) => k.toLowerCase())
  return new Set(lower).size === lower.length ? '' : 'Remove duplicate keywords.'
}

// ---- Misc ----
export const wordCount = (s: string) => s.trim().split(/\s+/).filter(Boolean).length

export const referralCode = (v: string) => (!v || /^[A-Z0-9-]{4,20}$/.test(v) ? '' : 'Referral codes are 4 to 20 letters, numbers or hyphens.')
/** Uppercases and strips anything that is not allowed in a referral code. */
export const formatReferral = (v: string) => v.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 20)

export const paperId = (v: string) => {
  const t = v.trim().toUpperCase()
  if (!t) return 'Enter your Paper ID.'
  return PAPER_ID_RE.test(t) ? '' : `A Paper ID looks like ${journal.paperIdPrefix}2026000123 (letters followed by 10 digits).`
}
