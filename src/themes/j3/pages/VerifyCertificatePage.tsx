// Journal 3 certificate verification: certificate number form, then a valid / invalid result.
import { useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { CertificateResult } from '../../../core/types'
import { AcLabel, acBtn } from '../components/AcademicUi'
import { J3CertificatePaper } from '../components/J3Certificate'
import { J3Field, J3Spinner, j3Input } from '../components/J3Field'
import { Container } from '../components/primitives'
import { Check, Search } from '../icons'

const EXAMPLE = `${journal.paperIdPrefix}-CERT-${journal.paperIdPrefix}2026000121`

export function VerifyCertificatePage({ initialId = '', initialResult = null, onVerify }: {
  initialId?: string
  initialResult?: CertificateResult | null
  onVerify: (id: string) => Promise<CertificateResult>
}) {
  const [id, setId] = useState(initialId)
  const [checked, setChecked] = useState(initialId)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<CertificateResult | null>(initialResult)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const v = id.trim()
    if (!v) { setError('Enter the certificate number.'); return }
    if (!/^[A-Za-z0-9-]{6,40}$/.test(v)) { setError('Certificate numbers contain only letters, numbers and hyphens (6 to 40 characters).'); return }
    setError(''); setBusy(true)
    try { setResult(await onVerify(v)); setChecked(v) }
    catch { setError('We could not check this right now. Please try again in a moment.') }
    finally { setBusy(false) }
  }

  return (
    <>
      <header className="border-b border-mauve-100 bg-[#F8FAFC]">
        <Container className="py-10 sm:py-14">
          <div className="max-w-3xl">
            <AcLabel className="!text-ember-700">{journal.shortName} · Certificate verification</AcLabel>
            <h1 className="mt-3 font-jakarta text-[clamp(2rem,3.4vw,2.75rem)] font-semibold leading-[1.1] text-iris-700">Is this certificate genuine?</h1>
            <p className="mt-4 font-jakarta text-lg leading-relaxed text-night-700">Enter the certificate number printed on an author certificate, or scan its QR code, to confirm it was issued by {journal.shortName}.</p>
          </div>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={submit} noValidate aria-label="Verify a certificate" className="grid gap-4 border border-mauve-100 bg-white p-5 sm:p-7 md:grid-cols-[1fr_auto] md:items-start">
            <J3Field label="Certificate number" name="certificate" required error={error}
              hint={<>Format: <code className="bg-[#F8FAFC] px-1 text-sm">{EXAMPLE}</code>. Co-author certificates end in -A2, -A3 and so on.</>}>
              <input className={j3Input(error, true)} value={id} maxLength={40} autoComplete="off" spellCheck={false} placeholder={EXAMPLE}
                onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
            </J3Field>
            <button type="submit" disabled={busy} aria-busy={busy} className={acBtn('primary', 'w-full px-8 py-[0.95rem] md:mt-[1.75rem] md:w-auto')}>
              {busy ? <J3Spinner /> : <Search className="h-5 w-5" aria-hidden="true" />}
              {busy ? 'Checking…' : 'Verify'}
            </button>
          </form>

          <div aria-live="polite" aria-busy={busy} className="mt-8">
            {result?.valid === true && (
              <div className="space-y-6">
                <section aria-labelledby="valid-h" className="border border-[#047857]/40 border-l-4 border-l-[#047857] bg-white p-6 sm:p-8">
                  <h2 id="valid-h" className="flex items-center gap-3 font-jakarta text-[1.5rem] font-semibold text-[#047857]">
                    <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#047857] text-white"><Check className="h-5 w-5" /></span>Valid certificate
                  </h2>
                  <p className="mt-1 font-inter text-sm text-mauve-600">This certificate number is on record at {journal.shortName}.</p>
                  <dl className="mt-5 grid gap-x-4 gap-y-3 border-t border-mauve-100 pt-5 font-inter text-base sm:grid-cols-[9rem_1fr]">
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600">Certificate no.</dt><dd className="break-all font-semibold text-night-700">{checked.toUpperCase()}</dd>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600">Awarded to</dt><dd className="font-semibold text-night-700">{result.author}</dd>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600">Article</dt><dd><AppLink to={paths.article(result.article.paperId)} className="font-jakarta text-lg font-semibold text-iris-700 underline underline-offset-4 hover:text-ember-700">{result.article.title}</AppLink></dd>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600">DOI</dt><dd className="break-all text-night-700">{doiFor(result.article.paperId)}</dd>
                    <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600">Published</dt><dd className="text-night-700">{formatDate(result.article.publishedAt)} · Volume {result.article.volume}, Issue {result.article.issue}</dd>
                  </dl>
                </section>
                <J3CertificatePaper number={checked.toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
                <button type="button" className={acBtn('outline')} onClick={() => window.print()}>Print / Save as PDF</button>
              </div>
            )}
            {result?.valid === false && (
              <section role="alert" className="border border-red-700/40 border-l-4 border-l-red-700 bg-white p-6 sm:p-8">
                <h2 className="font-jakarta text-[1.5rem] font-semibold text-red-700">Certificate not found</h2>
                <p className="mt-2 font-inter text-base text-mauve-700">We have no record of this certificate number. Check for typing errors, or email <a className="font-semibold text-iris-700 underline underline-offset-4" href={`mailto:${journal.email}`}>{journal.email}</a> if you believe this is a mistake.</p>
              </section>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
