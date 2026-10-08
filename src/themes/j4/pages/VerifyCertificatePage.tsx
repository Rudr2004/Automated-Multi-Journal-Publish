// Journal 4 certificate verification: a form, then a printable certificate panel or a not-found state, announced through aria-live.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { CertificateResult } from '../../../core/types'
import { Button } from '../components/Button'
import { Container, Label } from '../components/primitives'
import { CertificatePaper } from '../components/static/Certificate'
import { Field, inputClass } from '../components/static/fields'
import { Check, ErrorIcon, Search } from '../icons'

const EXAMPLE = `${journal.paperIdPrefix}-CERT-${journal.paperIdPrefix}2026000112`

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
  const heading = useRef<HTMLHeadingElement>(null)
  const first = useRef(true)

  // Move focus to the result heading after a check so keyboard and screen-reader users land on it.
  useEffect(() => { if (first.current) { first.current = false; return } if (result) heading.current?.focus() }, [result])

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
      <header className="relative isolate bg-abyss-900 text-white">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_80%_20%,black,transparent_75%)]" />
        </div>
        <Container className="pb-12 pt-10 sm:pb-14 sm:pt-12">
          <Label className="text-azure-300">Certificate verification</Label>
          <h1 className="mt-2 max-w-3xl font-serif4 text-[clamp(1.875rem,3.4vw,2.75rem)] font-semibold leading-[1.1] tracking-tight">Is this certificate genuine?</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-abyss-200 sm:text-[1.0625rem]">Enter the certificate number printed on an author certificate, or scan its QR code, to confirm that {journal.shortName} issued it.</p>
        </Container>
      </header>

      <Container className="py-10 sm:py-14">
        <div className="mx-auto max-w-3xl">
          <form onSubmit={submit} noValidate aria-label="Verify a certificate" className="grid gap-4 rounded-pane border border-abyss-200 bg-white p-5 shadow-panel sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <Field label="Certificate number" name="certificate" required error={error} hint={`Format: ${EXAMPLE}. Co-author certificates end in -A2, -A3 and so on.`}>
              <input className={inputClass(error)} value={id} maxLength={40} autoComplete="off" spellCheck={false} placeholder={EXAMPLE}
                onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
            </Field>
            <Button type="submit" variant="cta" disabled={busy} aria-busy={busy} className="min-h-[44px] w-full md:mt-[1.65rem] md:w-auto"><Search className="h-4 w-4" aria-hidden="true" />{busy ? 'Checking…' : 'Verify'}</Button>
          </form>

          <div aria-live="polite" aria-busy={busy} className="mt-8">
            {result?.valid === true && (
              <div className="space-y-6">
                <section aria-labelledby="valid-h" className="rounded-pane border border-abyss-200 border-l-4 border-l-azure-600 bg-white p-5 shadow-hair sm:p-6">
                  <h2 id="valid-h" ref={heading} tabIndex={-1} className="flex items-center gap-3 font-serif4 text-[1.5rem] font-semibold text-abyss-900 focus:outline-none">
                    <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-ctl bg-abyss-900 text-azure-300"><Check className="h-5 w-5" /></span>Valid certificate
                  </h2>
                  <dl className="mt-4 grid gap-x-4 gap-y-2 text-base sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <dt className="text-steel-600">Awarded to</dt><dd className="font-semibold text-abyss-900">{result.author}</dd>
                    <dt className="text-steel-600">Article</dt><dd><AppLink to={paths.article(result.article.paperId)} className="font-semibold text-cobalt-700 underline">{result.article.title}</AppLink></dd>
                    <dt className="text-steel-600">DOI</dt><dd className="break-all tabular-nums">{doiFor(result.article.paperId)}</dd>
                    <dt className="text-steel-600">Published</dt><dd className="tabular-nums">{formatDate(result.article.publishedAt)} · Volume {result.article.volume}, Issue {result.article.issue}</dd>
                  </dl>
                </section>
                <CertificatePaper number={checked.toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
                <Button variant="outline" className="min-h-[44px]" onClick={() => window.print()}>Print / Save as PDF</Button>
              </div>
            )}
            {result?.valid === false && (
              <section role="alert" aria-labelledby="invalid-h" className="rounded-pane border border-red-300 border-l-4 border-l-red-700 bg-white p-5 shadow-hair sm:p-6">
                <h2 id="invalid-h" ref={heading} tabIndex={-1} className="flex items-center gap-3 font-serif4 text-[1.5rem] font-semibold text-red-800 focus:outline-none"><ErrorIcon className="h-6 w-6" aria-hidden="true" />Certificate not found</h2>
                <p className="mt-2 text-base text-steel-700">We have no record of the number <strong className="tabular-nums">{checked.toUpperCase()}</strong>. Check for typing errors, or email <a className="font-semibold text-cobalt-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a> if you believe this is a mistake.</p>
              </section>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}
