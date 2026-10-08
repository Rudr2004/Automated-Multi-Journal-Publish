// Journal 2 certificate verification: certificate number form, then a valid / invalid result panel.
import { useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { CertificateResult } from '../../../core/types'
import { Button } from '../components/Button'
import { CertificatePaper } from '../components/CertificatePaper'
import { Field, inputCls } from '../components/FieldKit'
import { PageBand } from '../components/PageBand'
import { Print, ShieldOff } from '../components/pageIcons'
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
      <PageBand eyebrow="Certificate verification" title="Verify a certificate" text="Enter the certificate number printed on an author certificate, or scan its QR code, to confirm it is genuine." />
      <Container className="max-w-3xl py-8 sm:py-10">
        <form onSubmit={submit} noValidate aria-label="Verify a certificate" className="grid gap-4 rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:grid-cols-[1fr_auto] sm:items-start sm:p-6">
          <Field label="Certificate number" name="certificate" required error={error} hint={<>Format: <code className="rounded-chip bg-graphite-100 px-1">{journal.paperIdPrefix}-CERT-{journal.paperIdPrefix}2026000121</code>. Co-author certificates end in -A2, -A3 and so on.</>}>
            <input className={inputCls(error)} value={id} maxLength={40} autoComplete="off" spellCheck={false} placeholder={EXAMPLE}
              onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
          </Field>
          <Button type="submit" disabled={busy} aria-busy={busy} className="w-full px-6 py-2.5 sm:mt-[1.65rem] sm:w-auto">
            {busy ? <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" /> : <Search className="h-4 w-4" aria-hidden="true" />}
            {busy ? 'Checking…' : 'Verify'}
          </Button>
        </form>

        <div aria-live="polite" className="mt-6">
          {result?.valid === true && (
            <div className="space-y-5">
              <section aria-labelledby="valid-h" className="rounded-panel border border-brand-200 bg-brand-50 p-5 sm:p-6">
                <h2 id="valid-h" className="flex items-center gap-2 font-display text-lg font-bold text-brand-800">
                  <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-white"><Check className="h-5 w-5" /></span>Valid certificate
                </h2>
                <dl className="mt-4 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-[8rem_1fr]">
                  <dt className="text-graphite-600">Awarded to</dt><dd className="font-semibold text-graphite-800">{result.author}</dd>
                  <dt className="text-graphite-600">Article</dt><dd><AppLink to={paths.article(result.article.paperId)} className="font-semibold text-accent-700 hover:underline">{result.article.title}</AppLink></dd>
                  <dt className="text-graphite-600">DOI</dt><dd className="break-all">{doiFor(result.article.paperId)}</dd>
                  <dt className="text-graphite-600">Published</dt><dd>{formatDate(result.article.publishedAt)} · Volume {result.article.volume}, Issue {result.article.issue}</dd>
                </dl>
              </section>
              <CertificatePaper number={checked.toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
              <Button variant="secondary" onClick={() => window.print()}><Print className="h-4 w-4" aria-hidden="true" />Print / Save as PDF</Button>
            </div>
          )}
          {result?.valid === false && (
            <section role="alert" className="rounded-panel border border-red-700/25 bg-red-50 p-6">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-red-700"><ShieldOff className="h-6 w-6" aria-hidden="true" />Certificate not found</h2>
              <p className="mt-2 text-sm text-graphite-700">We have no record of this certificate number. Check for typing errors, or email <a className="font-semibold text-accent-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a> if you believe this is a mistake.</p>
            </section>
          )}
        </div>
      </Container>
    </>
  )
}
