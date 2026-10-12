// Journal 4 certificate verification: a form, then a printable certificate panel or a not-found state, announced through aria-live.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { CertificateResult } from '../../../core/types'
import { Button } from '../components/Button'
import { Container, Label } from '../components/primitives'
import { PageHead } from '../components/static/PageHead'
import { CertificatePaper } from '../components/static/Certificate'
import { Field, inputClass } from '../components/static/fields'
import { MdOutlinePrint as Print } from 'react-icons/md'
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
      <PageHead crumbs={[{ label: 'Verify certificate' }]} eyebrow="Certificate verification" title="Is this certificate genuine?"
        intro={<>Enter the certificate number printed on an author certificate, or scan its QR code, to confirm that {journal.shortName} issued it.</>} />

      <div className="bg-abyss-50"><Container className="py-6 sm:py-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0">
          <form onSubmit={submit} noValidate aria-label="Verify a certificate" className="grid gap-4 rounded-pane border border-abyss-200 bg-white p-5 shadow-hair sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <Field label="Certificate number" name="certificate" required error={error} hint={`Format: ${EXAMPLE}. Co-author certificates end in -A2, -A3 and so on.`}>
              <input className={inputClass(error)} value={id} maxLength={40} autoComplete="off" spellCheck={false} placeholder={EXAMPLE}
                onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
            </Field>
            <Button type="submit" variant="cta" disabled={busy} aria-busy={busy} className="min-h-[44px] w-full md:mt-[1.65rem] md:w-auto"><Search className="h-4 w-4" aria-hidden="true" />{busy ? 'Checking…' : 'Verify'}</Button>
          </form>

          <div aria-live="polite" aria-busy={busy} className="mt-8">
            {result?.valid === true && (
              <div className="space-y-6">
                <section aria-labelledby="valid-h" className="overflow-hidden rounded-pane border border-abyss-200 border-t-4 border-t-azure-600 bg-white p-5 shadow-panel sm:p-6">
                  <h2 id="valid-h" ref={heading} tabIndex={-1} className="flex items-center gap-3 font-serif4 text-[1.5rem] font-semibold text-[#0b2545] focus:outline-none">
                    <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-ctl border border-azure-200 bg-azure-50 text-cobalt-700"><Check className="h-5 w-5" /></span>Valid certificate
                  </h2>
                  <p className="mt-2 inline-flex rounded-ctl border border-azure-200 bg-azure-50 px-2 py-0.5 text-xs font-semibold text-azure-800">Record found for {checked.toUpperCase()}</p>
                  <dl className="mt-4 grid gap-x-4 gap-y-2 text-base sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <dt className="text-steel-600">Awarded to</dt><dd className="font-semibold text-abyss-900">{result.author}</dd>
                    <dt className="text-steel-600">Article</dt><dd><AppLink to={paths.article(result.article.paperId)} className="font-semibold text-cobalt-700 underline">{result.article.title}</AppLink></dd>
                    <dt className="text-steel-600">DOI</dt><dd className="break-all tabular-nums">{doiFor(result.article.paperId)}</dd>
                    <dt className="text-steel-600">Published</dt><dd className="tabular-nums">{formatDate(result.article.publishedAt)} · Volume {result.article.volume}, Issue {result.article.issue}</dd>
                  </dl>
                </section>
                <CertificatePaper number={checked.toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
                <Button variant="outline" className="min-h-[44px]" onClick={() => window.print()}><Print className="h-4 w-4" aria-hidden="true" />Print / Save as PDF</Button>
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
        <aside aria-label="About verification" className="space-y-4 lg:sticky lg:top-16">
          <section className="rounded-pane border border-abyss-200 bg-white p-5 shadow-hair">
            <Label className="text-cobalt-700">How it works</Label>
            <ol className="mt-3 space-y-3 text-sm text-steel-700">
              {['Find the certificate number printed under the signature line.', 'Type it in the box, or scan the QR code on the certificate.', 'We show the matching record, or tell you we hold none.'].map((t, i) => (
                <li key={t} className="flex gap-3"><span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-azure-200 bg-azure-50 text-xs font-bold tabular-nums text-cobalt-700">{i + 1}</span><span>{t}</span></li>
              ))}
            </ol>
          </section>
          <section className="rounded-pane border border-abyss-200 border-l-4 border-l-azure-600 bg-white p-5 shadow-hair">
            <Label className="text-steel-600">Need help?</Label>
            <p className="mt-2 text-sm text-steel-700">If a genuine certificate is not found, write to <a className="font-semibold text-cobalt-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a> with the number and the article title.</p>
          </section>
        </aside>
        </div>
      </Container></div>
    </>
  )
}
