// Journal 2 certificate verification: certificate number form, then a verified / not-found record panel with the printable certificate.
import { useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { CertificateResult } from '../../../core/types'
import { Button } from '../components/Button'
import { CertificatePaper } from '../components/CertificatePaper'
import { Field, inputCls } from '../components/FieldKit'
import { PageHeader, PillTag } from '../components/PageHeader'
import { Print, ShieldOff } from '../components/pageIcons'
import { Container } from '../components/primitives'
import { Check, Search, Verified } from '../icons'

const EXAMPLE = `${journal.paperIdPrefix}-CERT-${journal.paperIdPrefix}2026000121`

const STEPS = [
  'Find the certificate number printed under the signature, or scan the QR code on the certificate.',
  'Enter the number exactly as printed. Co-author certificates end in -A2, -A3 and so on.',
  'The record shows who the certificate was issued to and the article it belongs to.',
]

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
      <PageHeader crumbs={['Verify Certificate']} tag={<PillTag icon={<Verified className="h-3.5 w-3.5" aria-hidden="true" />}>Certificate verification</PillTag>}
        title="Verify a certificate" text="Enter the certificate number printed on an author certificate, or scan its QR code, to confirm it is genuine." />
      <Container className="py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
          <div className="min-w-0 space-y-6">
            <form onSubmit={submit} noValidate aria-label="Verify a certificate" className="grid gap-4 rounded-panel border border-graphite-200 bg-white p-5 shadow-card sm:grid-cols-[1fr_auto] sm:items-start sm:p-6">
              <Field label="Certificate number" name="certificate" required error={error} hint={<>Format: <code className="rounded-chip bg-graphite-100 px-1 font-mono">{EXAMPLE}</code>. Co-author certificates end in -A2, -A3 and so on.</>}>
                <input className={inputCls(error)} value={id} maxLength={40} autoComplete="off" spellCheck={false} placeholder={EXAMPLE}
                  onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
              </Field>
              <Button type="submit" disabled={busy} aria-busy={busy} className="w-full px-6 py-2.5 sm:mt-[1.65rem] sm:w-auto">
                {busy ? <span aria-hidden="true" className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white motion-safe:animate-spin" /> : <Search className="h-4 w-4" aria-hidden="true" />}
                {busy ? 'Checking…' : 'Verify'}
              </Button>
            </form>

            <div aria-live="polite" className="space-y-5">
              {result?.valid === true && (
                <>
                  <section aria-labelledby="valid-h" className="overflow-hidden rounded-panel border border-brand-200 bg-white shadow-card">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-200 bg-brand-50 px-5 py-4">
                      <h2 id="valid-h" className="flex items-center gap-2 font-display text-lg font-bold text-brand-800">
                        <span aria-hidden="true" className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-800 text-white"><Check className="h-5 w-5" /></span>Valid certificate
                      </h2>
                      <span className="rounded-full bg-white px-3 py-1 font-mono text-xs font-semibold text-brand-900 ring-1 ring-inset ring-brand-200">{checked.toUpperCase()}</span>
                    </div>
                    <dl className="grid divide-y divide-graphite-100 text-sm">
                      {[
                        ['Awarded to', <strong key="a" className="font-semibold text-graphite-900">{result.author}</strong>],
                        ['Article', <AppLink key="t" to={paths.article(result.article.paperId)} className="font-semibold text-accent-700 hover:underline">{result.article.title}</AppLink>],
                        ['Paper ID', <span key="p" className="font-mono">{result.article.paperId}</span>],
                        ['DOI', <span key="d" className="break-all font-mono">{doiFor(result.article.paperId)}</span>],
                        ['Published', <span key="u">{formatDate(result.article.publishedAt)} · Volume {result.article.volume}, Issue {result.article.issue}</span>],
                      ].map(([k, v], i) => (
                        <div key={i} className="grid gap-1 px-5 py-3 sm:grid-cols-[9rem_1fr] sm:gap-4">
                          <dt className="text-graphite-600">{k}</dt><dd className="min-w-0 text-graphite-800">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                  <CertificatePaper number={checked.toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
                  <Button variant="secondary" onClick={() => window.print()}><Print className="h-4 w-4" aria-hidden="true" />Print / Save as PDF</Button>
                </>
              )}
              {result?.valid === false && (
                <section role="alert" className="rounded-panel border border-red-700/25 bg-red-50 p-6">
                  <h2 className="flex items-center gap-2 font-display text-lg font-bold text-red-700"><ShieldOff className="h-6 w-6" aria-hidden="true" />Certificate not found</h2>
                  <p className="mt-2 text-sm text-graphite-700">We have no record of this certificate number. Check for typing errors, or email <a className="font-semibold text-accent-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a> if you believe this is a mistake.</p>
                </section>
              )}
            </div>
          </div>

          <aside aria-labelledby="how-h" className="rounded-panel border border-graphite-200 bg-white p-5 shadow-card lg:sticky lg:top-24">
            <h2 id="how-h" className="font-display text-base font-bold uppercase tracking-wide text-brand-800">How verification works</h2>
            <ol className="mt-4 space-y-4">
              {STEPS.map((s, i) => (
                <li key={s} className="flex gap-3 text-sm text-graphite-700">
                  <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-900">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
            <p className="mt-5 border-t border-graphite-100 pt-4 text-sm text-graphite-600">Need help? Email <a className="font-semibold text-accent-700 hover:underline" href={`mailto:${journal.email}`}>{journal.email}</a>.</p>
          </aside>
        </div>
      </Container>
    </>
  )
}
