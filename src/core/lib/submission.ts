// Submission form model: types, defaults and per-step validation (pure functions, no UI).
import type { ArticleType } from '../types'
import { branchesFor } from './branches'
import * as v from './validators'

export const MAX_FILE_MB = 10
export const ACCEPTED_EXT = ['.doc', '.docx']
export const ABSTRACT_MIN_WORDS = 50
export const ABSTRACT_MAX_WORDS = 300
export const LIMITS = { title: 250, institution: 120, name: 80, email: 120, coverLetter: 2000, mentor: 80 } as const

export const STEPS = [
  { id: 'manuscript', label: 'Manuscript' },
  { id: 'authors', label: 'Authors' },
  { id: 'additional', label: 'Additional' },
  { id: 'review', label: 'Review & Submit' },
] as const
export type StepIndex = 0 | 1 | 2 | 3

export const DIAL_CODES = [
  { code: '+91', label: 'India (+91)' }, { code: '+1', label: 'USA / Canada (+1)' }, { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+49', label: 'Germany (+49)' }, { code: '+65', label: 'Singapore (+65)' }, { code: '+971', label: 'UAE (+971)' },
  { code: '+234', label: 'Nigeria (+234)' }, { code: '+61', label: 'Australia (+61)' },
  { code: '+33', label: 'France (+33)' }, { code: '+39', label: 'Italy (+39)' }, { code: '+34', label: 'Spain (+34)' }, { code: '+31', label: 'Netherlands (+31)' },
  { code: '+46', label: 'Sweden (+46)' }, { code: '+41', label: 'Switzerland (+41)' }, { code: '+7', label: 'Russia (+7)' }, { code: '+81', label: 'Japan (+81)' },
  { code: '+82', label: 'South Korea (+82)' }, { code: '+86', label: 'China (+86)' }, { code: '+852', label: 'Hong Kong (+852)' }, { code: '+60', label: 'Malaysia (+60)' },
  { code: '+62', label: 'Indonesia (+62)' }, { code: '+63', label: 'Philippines (+63)' }, { code: '+66', label: 'Thailand (+66)' }, { code: '+84', label: 'Vietnam (+84)' },
  { code: '+92', label: 'Pakistan (+92)' }, { code: '+880', label: 'Bangladesh (+880)' }, { code: '+94', label: 'Sri Lanka (+94)' }, { code: '+977', label: 'Nepal (+977)' },
  { code: '+966', label: 'Saudi Arabia (+966)' }, { code: '+974', label: 'Qatar (+974)' }, { code: '+90', label: 'Türkiye (+90)' }, { code: '+20', label: 'Egypt (+20)' },
  { code: '+27', label: 'South Africa (+27)' }, { code: '+254', label: 'Kenya (+254)' }, { code: '+233', label: 'Ghana (+233)' }, { code: '+64', label: 'New Zealand (+64)' },
  { code: '+55', label: 'Brazil (+55)' }, { code: '+52', label: 'Mexico (+52)' }, { code: '+54', label: 'Argentina (+54)' },
]
export const COUNTRIES = [
  'India', 'United States', 'United Kingdom', 'Germany', 'Singapore', 'United Arab Emirates', 'Nigeria', 'Australia', 'Canada',
  'France', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Switzerland', 'Russia', 'Japan', 'South Korea', 'China', 'Hong Kong', 'Malaysia', 'Indonesia',
  'Philippines', 'Thailand', 'Vietnam', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Saudi Arabia', 'Qatar', 'Turkey', 'Egypt', 'South Africa', 'Kenya',
  'Ghana', 'New Zealand', 'Brazil', 'Mexico', 'Argentina', 'Other',
]

/** The corresponding author's optional profile picture: a small square JPEG thumbnail (data URL) so a saved draft can show it again. */
export interface AuthorPhoto { name: string; size: number; dataUrl: string }

export interface CoAuthor { id: number; name: string; email: string; institution: string }

export interface SubmissionForm {
  title: string
  abstract: string
  keywords: string
  articleType: ArticleType | ''
  subject: string
  /** Branch of the chosen discipline (only asked for disciplines that list branches, see branches.ts). */
  branch: string
  file: { name: string; size: number } | null
  author: { name: string; email: string; dialCode: string; whatsapp: string; institution: string; country: string; orcid: string; photo: AuthorPhoto | null
    /** Optional academic designation (e.g. Assistant Professor, Ph.D. Scholar). Shown by J1 only; never validated in core. */
    designation?: string }
  coAuthors: CoAuthor[]
  mentor: string
  /** Optional mentor / research-guide contact details (the form in J1 and J2 asks for them next to the co-authors). */
  mentorEmail: string
  mentorInstitution: string
  referralCode: string
  coverLetter: string
  declarations: { originality: boolean; noSimultaneous: boolean; consentData: boolean; consentMessages: boolean }
  captcha: boolean
}

export const initialForm: SubmissionForm = {
  title: '', abstract: '', keywords: '', articleType: '', subject: '', branch: '', file: null,
  author: { name: '', email: '', dialCode: '+91', whatsapp: '', institution: '', country: 'India', orcid: '', photo: null, designation: '' },
  coAuthors: [], mentor: '', mentorEmail: '', mentorInstitution: '', referralCode: '', coverLetter: '',
  declarations: { originality: false, noSimultaneous: false, consentData: false, consentMessages: false }, captcha: false,
}

/** Field-key → message. Keys match the `name` attribute of each control. */
export type FormErrors = Record<string, string>

export { wordCount } from './validators'

/** Validates the file chosen in the dropzone. Returns an error message or ''. */
export function validateFile(file: { name: string; size: number }): string {
  if (!ACCEPTED_EXT.some((e) => file.name.toLowerCase().endsWith(e))) return 'Only Word files (.doc, .docx) are accepted.'
  if (file.size === 0) return 'This file is empty. Please choose another file.'
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `File is larger than ${MAX_FILE_MB} MB.`
  return ''
}

/** Adds `message` under `key` when it is non-empty. */
const put = (e: FormErrors, key: string, message: string) => { if (message) e[key] = message }

const stepValidators: Record<StepIndex, (f: SubmissionForm) => FormErrors> = {
  0: (f) => {
    const e: FormErrors = {}
    put(e, 'title', v.textLength(f.title, 10, LIMITS.title, 'manuscript title'))
    const w = v.wordCount(f.abstract)
    if (w === 0) e.abstract = 'Enter the abstract.'
    else if (w < ABSTRACT_MIN_WORDS) e.abstract = `Abstract is too short (${w} words). Write at least ${ABSTRACT_MIN_WORDS} words.`
    else if (w > ABSTRACT_MAX_WORDS) e.abstract = `Abstract is too long (${w} words). The maximum is ${ABSTRACT_MAX_WORDS}.`
    put(e, 'keywords', v.keywords(f.keywords))
    if (!f.articleType) e.articleType = 'Select an article type.'
    if (!f.subject) e.subject = 'Select a subject area.'
    else if (branchesFor(f.subject).length && !branchesFor(f.subject).includes(f.branch)) e.branch = 'Select the branch of your subject area.'
    if (!f.file) e.file = 'Upload your manuscript as a Word file.'
    return e
  },
  1: (f) => {
    const e: FormErrors = {}
    const a = f.author
    put(e, 'author.name', v.personName(a.name, 'author’s name'))
    put(e, 'author.email', v.email(a.email))
    put(e, 'author.whatsapp', v.phone(a.whatsapp, a.dialCode))
    put(e, 'author.institution', v.textLength(a.institution, 3, LIMITS.institution, 'institution'))
    if (!a.country) e['author.country'] = 'Select a country.'
    put(e, 'author.orcid', v.orcid(a.orcid))

    const seen = new Set([a.email.trim().toLowerCase()])
    f.coAuthors.forEach((c) => {
      put(e, `co.${c.id}.name`, v.personName(c.name, 'co-author’s name'))
      const mail = v.email(c.email)
      const key = c.email.trim().toLowerCase()
      if (mail) e[`co.${c.id}.email`] = mail
      else if (seen.has(key)) e[`co.${c.id}.email`] = 'This email is already used by another author.'
      seen.add(key)
      put(e, `co.${c.id}.institution`, v.textLength(c.institution, 3, LIMITS.institution, 'institution'))
    })

    // Mentor details are optional, but once any of them is filled in the name is needed and the rest must be valid.
    const mentorName = f.mentor.trim(), mentorMail = f.mentorEmail.trim(), mentorInst = f.mentorInstitution.trim()
    if (mentorName) put(e, 'mentor', v.personName(f.mentor, 'mentor’s name'))
    else if (mentorMail || mentorInst) e.mentor = 'Enter the mentor’s name, or clear the other mentor details.'
    if (mentorMail) put(e, 'mentorEmail', v.email(f.mentorEmail))
    if (mentorInst) put(e, 'mentorInstitution', v.textLength(f.mentorInstitution, 3, LIMITS.institution, 'mentor’s institution'))
    return e
  },
  2: (f) => {
    const e: FormErrors = {}
    if (f.mentor.trim()) put(e, 'mentor', v.personName(f.mentor, 'mentor’s name'))
    put(e, 'referralCode', v.referralCode(f.referralCode))
    if (f.coverLetter.length > LIMITS.coverLetter) e.coverLetter = `Cover letter is too long (maximum ${LIMITS.coverLetter} characters).`
    if (!f.declarations.originality) e.originality = 'You must confirm the work is original.'
    if (!f.declarations.noSimultaneous) e.noSimultaneous = 'You must confirm it is not under review elsewhere.'
    if (!f.declarations.consentData) e.consentData = 'Consent to process your data is needed to handle your submission.'
    if (!f.declarations.consentMessages) e.consentMessages = 'Consent is needed to send your Paper ID and status updates.'
    if (!f.captcha) e.captcha = 'Please confirm you are not a robot.'
    return e
  },
  3: () => ({}),
}

export const validateStep = (step: StepIndex, form: SubmissionForm): FormErrors => stepValidators[step](form)

/** Validates every step; returns the first invalid step (or null). */
export function firstInvalidStep(form: SubmissionForm): StepIndex | null {
  for (const i of [0, 1, 2] as const) if (Object.keys(validateStep(i, form)).length) return i
  return null
}
