import { CheckCircle2, Printer, ShieldX } from '../components/uiIcons'
import { useState, type FormEvent } from 'react'
import type { ArticleSummary } from '../../../mock-data/journals/j1'
import { Button } from '../components/Button'
import { CertificateCard } from '../components/CertificateCard'
import { Field, inputClass } from '../components/form'
import { PageHeader } from '../components/PageHeader'
import { Container } from '../components/primitives'
import { AppLink } from '../../../core/router'
import { doiFor } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'

export type CertificateResult = { valid: true; article: ArticleSummary; author: string } | { valid: false }

export function VerifyCertificatePage({ initialId = '', initialResult = null, onVerify }: {
  initialId?: string; initialResult?: CertificateResult | null; onVerify: (id: string) => Promise<CertificateResult>
}) {
  const [id, setId] = useState(initialId)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState<CertificateResult | null>(initialResult)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!id.trim()) { setError('Enter the certificate number.'); return }
    if (!/^[A-Za-z0-9-]{6,40}$/.test(id.trim())) { setError('Certificate numbers contain only letters, numbers and hyphens (6–40 characters).'); return }
    setError(''); setBusy(true)
    setResult(await onVerify(id))
    setBusy(false)
  }

  return (
    <>
      <PageHeader crumbs={[{ label: 'Home', to: paths.home }, { label: 'Certificate Verification' }]} title="Certificate Verification"
        subtitle="Enter the certificate number printed on an author certificate, or scan its QR code, to confirm it is genuine." />
      <Container className="mt-8 max-w-2xl">
        <form onSubmit={submit} noValidate className="grid gap-4 rounded-card border border-line bg-white p-5 sm:grid-cols-[1fr_auto] sm:items-end sm:p-6">
          <Field label="Certificate number" error={error} hint="Example: IJMAT-CERT-IJMAT2026000121">
            <input className={inputClass(error)} value={id} maxLength={40} autoComplete="off" spellCheck={false} onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
          </Field>
          <Button type="submit" size="lg" loading={busy}>{busy ? 'Checking…' : 'Verify'}</Button>
        </form>

        <div aria-live="polite" className="mt-6">
          {result?.valid === true && (
            <div className="space-y-5">
              <div className="rounded-card border border-oa/40 bg-oa-soft p-6">
                <p className="flex items-center gap-2 font-semibold text-oa"><CheckCircle2 className="h-6 w-6" aria-hidden />Valid certificate</p>
                <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-[130px_1fr]">
                  <dt className="text-ink-muted">Awarded to</dt><dd className="font-semibold">{result.author}</dd>
                  <dt className="text-ink-muted">Article</dt><dd><AppLink to={paths.article(result.article.paperId)} className="font-semibold text-navy-600 hover:underline">{result.article.title}</AppLink></dd>
                  <dt className="text-ink-muted">DOI</dt><dd>{doiFor(result.article.paperId)}</dd>
                  <dt className="text-ink-muted">Published</dt><dd>{formatDate(result.article.publishedAt)} · Vol {result.article.volume}, Issue {result.article.issue}</dd>
                </dl>
              </div>
              <CertificateCard number={id.trim().toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
              <Button variant="secondary" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />Print / Save as PDF</Button>
            </div>
          )}
          {result?.valid === false && (
            <div role="alert" className="rounded-card border border-danger/30 bg-red-50 p-6">
              <p className="flex items-center gap-2 font-semibold text-danger"><ShieldX className="h-6 w-6" aria-hidden />Certificate not found</p>
              <p className="mt-2 text-sm">We have no record of this certificate number. Check for typing errors, or contact the editorial office if you believe this is a mistake.</p>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}
