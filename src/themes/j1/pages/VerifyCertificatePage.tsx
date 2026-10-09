import { CheckCircle2, Printer, ShieldX } from '../components/uiIcons'
import { useState, type FormEvent, type ReactNode } from 'react'
import type { ArticleSummary } from '../../../mock-data/journals/j1'
import { Button } from '../components/Button'
import { CertificateCard } from '../components/CertificateCard'
import { Field, inputClass } from '../components/form'
import { PageHead } from '../components/PageHead'
import { Container, Panel } from '../components/primitives'
import { AppLink } from '../../../core/router'
import { doiFor, journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'

export type CertificateResult = { valid: true; article: ArticleSummary; author: string } | { valid: false }

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className="grid gap-x-4 border-b border-line px-4 py-2.5 last:border-b-0 sm:grid-cols-[150px_minmax(0,1fr)]">
    <dt className="text-[11px] font-bold uppercase tracking-wider text-ink-muted sm:pt-0.5">{label}</dt>
    <dd className="min-w-0 break-words text-sm text-ink">{children}</dd>
  </div>
)

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
      <PageHead crumbs={[{ label: 'Home', to: paths.home }, { label: 'Certificate Verification' }]} eyebrow="Author services" title="Certificate Verification"
        subtitle="Enter the certificate number printed on an author certificate, or scan its QR code, to confirm it is genuine." />
      <Container className="mt-8 grid gap-8 pb-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          <section aria-labelledby="verify-h" className="border border-line bg-white">
            <header className="border-b border-line px-4 py-2.5"><h2 id="verify-h" className="font-serif text-[1.0625rem] font-semibold text-navy">Look up a certificate</h2></header>
            <form onSubmit={submit} noValidate className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:p-5">
              <Field label="Certificate number" error={error} hint={`Example: ${journal.paperIdPrefix}-CERT-${journal.paperIdPrefix}2026000121`}>
                <input className={`${inputClass(error)} font-mono uppercase tracking-wide tabular-nums`} value={id} maxLength={40} autoComplete="off" spellCheck={false} onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
              </Field>
              <Button type="submit" size="md" loading={busy} className="sm:mt-[27px]">{busy ? 'Checking…' : 'Verify certificate'}</Button>
            </form>
          </section>

          <div aria-live="polite" className="mt-6">
            {result?.valid === true && (
              <div className="space-y-6">
                <section aria-labelledby="record-h" className="border border-line bg-white">
                  <header className="flex flex-wrap items-center justify-between gap-2 border-b border-oa/30 bg-oa-soft px-4 py-3">
                    <h2 id="record-h" className="flex items-center gap-2 font-serif text-[1.125rem] font-semibold text-oa"><CheckCircle2 className="h-6 w-6" aria-hidden />Valid certificate</h2>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-oa">Record found in {journal.shortName} archive</span>
                  </header>
                  <dl>
                    <Row label="Certificate no."><span className="font-mono font-semibold tabular-nums">{id.trim().toUpperCase()}</span></Row>
                    <Row label="Awarded to"><span className="font-semibold">{result.author}</span></Row>
                    <Row label="Article"><AppLink to={paths.article(result.article.paperId)} className="font-serif text-base font-semibold text-scholar hover:underline">{result.article.title}</AppLink></Row>
                    <Row label="Paper ID"><span className="tabular-nums">{result.article.paperId}</span></Row>
                    <Row label="DOI"><a href={`https://doi.org/${doiFor(result.article.paperId)}`} className="tabular-nums text-scholar hover:underline">{doiFor(result.article.paperId)}</a></Row>
                    <Row label="Published"><span className="tabular-nums">{formatDate(result.article.publishedAt)} · Vol {result.article.volume}, Issue {result.article.issue}</span></Row>
                  </dl>
                </section>

                <CertificateCard number={id.trim().toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
                <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" aria-hidden />Print / Save as PDF</Button>
              </div>
            )}
            {result?.valid === false && (
              <section role="alert" className="border border-danger/40 bg-white">
                <header className="flex items-center gap-2 border-b border-danger/30 bg-red-50 px-4 py-3">
                  <ShieldX className="h-6 w-6 text-danger" aria-hidden /><h2 className="font-serif text-[1.125rem] font-semibold text-danger">Certificate not found</h2>
                </header>
                <div className="p-4 text-sm leading-relaxed">
                  <p>We have no record of this certificate number. Check for typing errors, or contact the editorial office if you believe this is a mistake.</p>
                  <p className="mt-2 text-ink-muted">Write to <a href={`mailto:${journal.email}`} className="font-semibold text-scholar hover:underline">{journal.email}</a> with the certificate number and the article title.</p>
                </div>
              </section>
            )}
          </div>
        </div>

        <aside aria-label="About certificates" className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Panel title="Where to find the number" tone="paper">
            <p className="text-[13px] leading-relaxed text-ink">The certificate number is printed beside the signature line of every author certificate. It follows this pattern:</p>
            <p className="mt-3 break-words border border-line bg-white px-3 py-2 font-mono text-[13px] font-semibold text-navy">{journal.paperIdPrefix}-CERT-&lt;Paper ID&gt;</p>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-muted">Co-authors have <span className="font-mono">-A2</span>, <span className="font-mono">-A3</span> and so on added to the end.</p>
          </Panel>
          <Panel title="Scan the QR code">
            <p className="text-[13px] leading-relaxed text-ink">Each certificate carries a QR code that opens this page with the number already filled in.</p>
          </Panel>
          <Panel title="Need help?">
            <p className="text-[13px] leading-relaxed text-ink">If a certificate cannot be verified, contact the editorial office at <a href={`mailto:${journal.email}`} className="font-semibold text-scholar hover:underline">{journal.email}</a> or see the <AppLink to={paths.about('contact')} className="font-semibold text-scholar hover:underline">contact page</AppLink>.</p>
          </Panel>
        </aside>
      </Container>
    </>
  )
}
