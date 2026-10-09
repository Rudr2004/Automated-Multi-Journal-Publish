// Journal 5 certificate verification: a form, then a printable certificate panel or a not-found state, announced through aria-live.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import type { CertificateResult } from '../../../core/types'
import { Button } from '../components/Button'
import { ClassicHeader } from '../components/ClassicHeader'
import { Container } from '../components/primitives'
import { Kicker, OrnamentRule } from '../components/signature'
import { CertificatePaper, Seal } from '../components/static/Certificate'
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
      <ClassicHeader crumbs={[{ label: 'Verify certificate' }]} kicker="Certificate verification" title="Is this certificate genuine?"
        intro={<>Enter the certificate number printed on an author certificate, or scan its QR code, to confirm that {journal.shortName} issued it.</>} />

      <div className="bg-[#FBF8F4]"><Container className="py-10 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="min-w-0">
          <form onSubmit={submit} noValidate aria-label="Verify a certificate" className="grid gap-4 rounded border border-[#E6DCD0] bg-white p-5  sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
            <Field label="Certificate number" name="certificate" required error={error} hint={`Format: ${EXAMPLE}. Co-author certificates end in -A2, -A3 and so on.`}>
              <input className={inputClass(error)} value={id} maxLength={40} autoComplete="off" spellCheck={false} placeholder={EXAMPLE}
                onChange={(e) => { setId(e.target.value.replace(/\s/g, '')); setError('') }} />
            </Field>
            <Button type="submit" variant="cta" disabled={busy} aria-busy={busy} className="min-h-[44px] w-full md:mt-[1.65rem] md:w-auto"><Search className="h-4 w-4" aria-hidden="true" />{busy ? 'Checking…' : 'Verify'}</Button>
          </form>

          <div aria-live="polite" aria-busy={busy} className="mt-8">
            {result?.valid === true && (
              <div className="space-y-6">
                <section aria-labelledby="valid-h" className="overflow-hidden rounded border border-[#E6DCD0] border-t-4 border-t-wine-800 bg-white p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <Seal className="hidden h-16 w-16 shrink-0 sm:block" />
                    <div className="min-w-0">
                      <Kicker>Record verified</Kicker>
                      <h2 id="valid-h" ref={heading} tabIndex={-1} className="mt-1 flex items-center gap-3 font-newsreader text-[1.5rem] font-semibold text-wine-900 focus-visible:!outline-none">
                        <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded bg-wine-800 text-ochre-300"><Check className="h-5 w-5" /></span>Valid certificate
                      </h2>
                    </div>
                  </div>
                  <OrnamentRule className="mt-4" />
                  <p className="mt-4 inline-flex rounded-sm border border-ochre-200 bg-ochre-50 px-2 py-0.5 text-xs font-semibold text-ochre-800">Record found for {checked.toUpperCase()}</p>
                  <dl className="mt-4 grid gap-x-4 gap-y-2 text-base sm:grid-cols-[8rem_minmax(0,1fr)]">
                    <dt className="text-obsidian-600">Awarded to</dt><dd className="font-semibold text-obsidian-900">{result.author}</dd>
                    <dt className="text-obsidian-600">Article</dt><dd><AppLink to={paths.article(result.article.paperId)} className="font-semibold text-wine-700 underline">{result.article.title}</AppLink></dd>
                    <dt className="text-obsidian-600">DOI</dt><dd className="break-all tabular-nums">{doiFor(result.article.paperId)}</dd>
                    <dt className="text-obsidian-600">Published</dt><dd className="tabular-nums">{formatDate(result.article.publishedAt)} · Volume {result.article.volume}, Issue {result.article.issue}</dd>
                  </dl>
                </section>
                <CertificatePaper number={checked.toUpperCase()} data={{ author: result.author, paperId: result.article.paperId, title: result.article.title, publishedAt: result.article.publishedAt, volume: result.article.volume, issue: result.article.issue }} />
                <Button variant="outline" className="min-h-[44px]" onClick={() => window.print()}><Print className="h-4 w-4" aria-hidden="true" />Print / Save as PDF</Button>
              </div>
            )}
            {result?.valid === false && (
              <section role="alert" aria-labelledby="invalid-h" className="rounded border border-red-300 border-l-4 border-l-red-700 bg-white p-5  sm:p-6">
                <h2 id="invalid-h" ref={heading} tabIndex={-1} className="flex items-center gap-3 font-newsreader text-[1.5rem] font-semibold text-red-800 focus-visible:!outline-none"><ErrorIcon className="h-6 w-6" aria-hidden="true" />Certificate not found</h2>
                <p className="mt-2 text-base text-obsidian-700">We have no record of the number <strong className="tabular-nums">{checked.toUpperCase()}</strong>. Check for typing errors, or email <a className="font-semibold text-wine-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a> if you believe this is a mistake.</p>
              </section>
            )}
          </div>
        </div>
        <aside aria-label="About verification" className="space-y-4 lg:sticky lg:top-24">
          <section className="rounded border border-[#E6DCD0] bg-white p-5 ">
            <Kicker>How it works</Kicker>
            <ol className="mt-3 space-y-3 text-sm text-obsidian-700">
              {['Find the certificate number printed under the signature line.', 'Type it in the box, or scan the QR code on the certificate.', 'We show the matching record, or tell you we hold none.'].map((t, i) => (
                <li key={t} className="flex gap-3"><span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-wine-800 text-xs font-semibold tabular-nums text-white">{i + 1}</span><span>{t}</span></li>
              ))}
            </ol>
          </section>
          <section className="rounded border border-[#E6DCD0] border-l-4 border-l-ochre-700 bg-white p-5 ">
            <Kicker>Need help?</Kicker>
            <p className="mt-2 text-sm text-obsidian-700">If a genuine certificate is not found, write to <a className="font-semibold text-wine-700 underline" href={`mailto:${journal.email}`}>{journal.email}</a> with the number and the article title.</p>
          </section>
        </aside>
        </div>
      </Container></div>
    </>
  )
}
