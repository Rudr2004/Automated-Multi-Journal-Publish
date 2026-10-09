import { QRCodeSVG } from 'qrcode.react'
import { doiFor, journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'

export interface CertificateData {
  author: string
  paperId: string
  title: string
  /** ISO date the article was published. */
  publishedAt: string
  volume?: number
  issue?: number
}

/** Certificate number: IJMAT-CERT-{Paper ID} for the first author, then -A2, -A3 … for co-authors. */
export const certificateNumber = (paperId: string, authorIndex: number) =>
  `${journal.paperIdPrefix}-CERT-${paperId}${authorIndex > 0 ? `-A${authorIndex + 1}` : ''}`

/** The URL a certificate's QR code opens (the public verification page). */
export const certificateUrl = (number: string) => `https://${journal.domain}${paths.verify(number)}`

/** Printable certificate of publication with a QR code that opens the verification page. */
export function CertificateCard({ data, number }: { data: CertificateData; number: string }) {
  return (
    <div id="certificate-print" className="relative overflow-hidden rounded border-[6px] border-double border-navy bg-white p-6 text-center sm:p-10">
      <div aria-hidden className="pointer-events-none absolute inset-2 border border-navy-200" />
      <div className="relative">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded bg-navy font-serif text-lg font-bold text-white">{journal.shortName}</span>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-navy-500">{journal.name}</p>
        <h3 className="mt-5 font-serif text-3xl font-semibold text-navy sm:text-4xl">Certificate of Publication</h3>
        <p className="mt-5 text-sm text-ink-muted">This is to certify that</p>
        <p className="mt-2 font-serif text-3xl font-semibold text-ink sm:text-4xl">{data.author}</p>
        <p className="mt-4 text-sm text-ink-muted">is an author of the open access article</p>
        <p className="mx-auto mt-2 max-w-2xl font-serif text-lg italic leading-snug text-navy">“{data.title}”</p>
        <p className="mt-3 text-sm text-ink">
          {data.volume ? <>Volume {data.volume}, Issue {data.issue} · </> : null}Published {formatDate(data.publishedAt)}
        </p>
        <p className="text-sm text-ink">DOI {doiFor(data.paperId)}</p>

        <div className="mt-7 flex flex-col items-center justify-center gap-5 sm:flex-row sm:justify-between sm:text-left">
          <div className="text-sm"><p className="font-semibold text-navy">Editor-in-Chief</p><p className="text-ink-muted">{journal.name}</p><p className="mt-2 text-xs text-ink-muted">Certificate no. <strong className="text-ink">{number}</strong></p></div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-ink-muted"><p className="font-semibold text-navy">Scan to verify</p><p>{journal.domain}</p></div>
            <QRCodeSVG value={certificateUrl(number)} size={84} level="M" fgColor="#14284B" aria-label={`QR code for certificate ${number}`} role="img" />
          </div>
        </div>
      </div>
    </div>
  )
}
