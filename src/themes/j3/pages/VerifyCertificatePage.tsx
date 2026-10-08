// Journal 3 certificate verification: certificate number form, then a valid / invalid result.
import { useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { CertificateResult } from '../../../core/types'
import { Button } from '../components/Button'
import { J3CertificatePaper } from '../components/J3Certificate'
import { J3Field, J3Spinner, j3Input } from '../components/J3Field'
import { Container, Kicker } from '../components/primitives'
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
    <div className="bg-iris-50 pb-20 pt-10 sm:pb-28 sm:pt-14">
      <Container>
        <div className="mx-auto max-w-3xl">
          <header>
            <Kicker className="text-iris-700">Certificate verification</Kicker>
            <h1 className="mt-3 font-jakarta text-[clamp(2rem,3.4vw,2.75rem)] font-extrabold leading-[1.1] tracking-tight text-night-900">Is this certificate genuine?</h1>
            <p className="mt-4 text-lg text-mauve-700">Enter the certificate number printed on an author certificate, or scan its QR code, to confirm it was issued by {journal.shortName}.</p>
          </header>

          <form onSubmit={submit} noValidate aria-label="Verify a certificate" className="mt-8 grid gap-4 rounded-sheet bg-white p-5 shadow-lift3 sm:p-7 md:grid-cols-[1fr_auto] md:items-start">
            <J3Field label="Certificate number" name="certificate" required error={error}
              hint={<>Format: <code className="rounded bg-iris-100 px-1 text-sm">{EXAMPLE}</code>. Co-author certificates end in -A2, -A3 and so on.</>}>
              <input className={j3Input(error, true)} value={id} maxLength={40} autoComplete="off" spellCheck={false} placeholder={EXAMPLE}
                onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
            </J3Field>
            <Button type="submit" disabled={busy} aria-busy={busy} className="w-full px-8 py-4 text-base md:mt-[1.75rem] md:w-auto">
              {busy ? <J3Spinner /> : <Search className="h-5 w-5" aria-hidden="true" />}
              {busy ? 'Checking…' : 'Verify'}
            </Button>
          </form>

          <div aria-live="polite" aria-busy={busy} className="mt-8">
            {result?.valid === true && (
              <div className="space-y-6">
                <section aria-labelledby="valid-h" className="rounded-sheet bg-night-900 p-6 text-white shadow-lift3 sm:p-8">
                  <h2 id="valid-h" className="flex items-center gap-3 font-jakarta text-[1.75rem] font-extrabold">
                    <span aria-hidden="true" className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-iris-700"><Check className="h-6 w-6" /></span>Valid certificate
                  </h2>
                  <dl className="mt-5 grid gap-x-4 gap-y-2 text-base sm:grid-cols-[8rem_1fr]">
                    <dt className="text-iris-200">Awarded to</dt><dd className="font-bold">{result.author}</dd>
                    <dt className="text-iris-200">Article</dt><dd><AppLink to={paths.article(result.article.paperId)} className="font-bold underline hover:text-iris-100">{result.article.title}</AppLink></dd>
                    <dt className="text-iris-200">DOI</dt><dd className="break-all">{doiFor(result.article.paperId)}</dd>
                    <dt className="text-iris-200">Published</dt><dd>{formatDate(result.article.publishedAt)} · Volume {result.article.volume}, Issue {result.article.issue}</dd>
                  </dl>
                </section>
                <J3CertificatePaper number={checked.toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
                <Button variant="outline" onClick={() => window.print()}>Print / Save as PDF</Button>
              </div>
            )}
            {result?.valid === false && (
              <section role="alert" className="rounded-sheet border-2 border-red-700 bg-white p-6 shadow-lift3 sm:p-8">
                <h2 className="font-jakarta text-[1.75rem] font-extrabold text-red-700">Certificate not found</h2>
                <p className="mt-2 text-base text-mauve-700">We have no record of this certificate number. Check for typing errors, or email <a className="font-bold text-iris-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a> if you believe this is a mistake.</p>
              </section>
            )}
          </div>
        </div>
      </Container>
    </div>
  )
}
