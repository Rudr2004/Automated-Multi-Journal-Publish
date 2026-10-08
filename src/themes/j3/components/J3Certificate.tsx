// Printable certificate of publication with QR code (Journal 3), and the dialog that shows one certificate per author.
import { useId, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { Button } from './Button'
import { J3Copy } from './J3Field'
import { J3Modal } from './J3Modal'
import { cx } from './primitives'

export interface J3CertificateData { author: string; paperId: string; title: string; publishedAt: string; volume?: number; issue?: number }

/** `${prefix}-CERT-${paperId}` for the first author, then -A2, -A3 … for co-authors. */
export const j3CertificateNumber = (paperId: string, authorIndex: number) =>
  `${journal.paperIdPrefix}-CERT-${paperId}${authorIndex > 0 ? `-A${authorIndex + 1}` : ''}`
export const j3CertificateUrl = (number: string) => `https://${journal.domain}${paths.verify(number)}`

export function J3CertificatePaper({ data, number }: { data: J3CertificateData; number: string }) {
  return (
    <div id="certificate-print" className="relative overflow-hidden rounded-sheet border-4 border-night-900 bg-white p-5 text-center sm:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-block border border-iris-200" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-iris-700 via-iris-400 to-night-900" />
      <div className="relative">
        <span className="mx-auto flex h-14 min-w-14 items-center justify-center rounded-full bg-night-900 px-3 font-jakarta text-sm font-extrabold text-white">{journal.shortName}</span>
        <p className="mt-3 font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-iris-700">{journal.name}</p>
        <h3 className="mt-4 font-jakarta text-2xl font-extrabold text-night-900 sm:text-[2rem]">Certificate of Publication</h3>
        <p className="mt-4 text-sm text-mauve-700">This is to certify that</p>
        <p className="mt-1 break-words font-jakarta text-2xl font-extrabold text-iris-700 sm:text-[2rem]">{data.author}</p>
        <p className="mt-3 text-sm text-mauve-700">is an author of the open access article</p>
        <p className="mx-auto mt-2 max-w-2xl font-jakarta text-base font-semibold italic leading-snug text-night-900 sm:text-lg">“{data.title}”</p>
        <p className="mt-3 text-sm text-mauve-700">{data.volume ? <>Volume {data.volume}, Issue {data.issue} · </> : null}Published {formatDate(data.publishedAt)}</p>
        <p className="break-all text-sm text-mauve-700">DOI {doiFor(data.paperId)}</p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:text-left">
          <div className="text-sm">
            <p className="font-jakarta font-bold text-night-900">Editor-in-Chief</p>
            <p className="text-mauve-700">{journal.name}</p>
            <p className="mt-2 break-all text-xs text-mauve-700">Certificate no. <strong className="text-night-900">{number}</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-mauve-700"><p className="font-jakarta font-bold text-night-900">Scan to verify</p><p>{journal.domain}</p></div>
            <QRCodeSVG value={j3CertificateUrl(number)} size={84} level="M" fgColor="#1B1430" role="img" aria-label={`QR code for certificate ${number}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** One certificate per author. "Print / Save as PDF" prints only the certificate (print rules live in index.css). */
export function J3CertificateDialog({ open, onClose, paper }: {
  open: boolean; onClose: () => void
  paper: { paperId: string; title: string; publishedAt: string; authors: string[]; volume?: number; issue?: number }
}) {
  const [i, setI] = useState(0)
  const tabs = useId()
  const author = paper.authors[i] ?? paper.authors[0] ?? 'Author'
  const number = j3CertificateNumber(paper.paperId, i)
  return (
    <J3Modal open={open} onClose={onClose} title="Author certificate" size="xl">
      {paper.authors.length > 1 && (
        <div role="group" aria-labelledby={tabs} className="mb-4">
          <p id={tabs} className="mb-1.5 font-jakarta text-sm font-bold text-night-900">Choose author</p>
          <div className="flex flex-wrap gap-2">
            {paper.authors.map((a, k) => (
              <button key={a} type="button" aria-pressed={k === i} onClick={() => setI(k)}
                className={cx('rounded-full border-2 px-4 py-1.5 font-jakarta text-sm font-bold', k === i ? 'border-iris-700 bg-iris-700 text-white' : 'border-iris-200 text-iris-800 hover:border-iris-700')}>{a}</button>
            ))}
          </div>
        </div>
      )}
      <J3CertificatePaper data={{ author, paperId: paper.paperId, title: paper.title, publishedAt: paper.publishedAt, volume: paper.volume, issue: paper.issue }} number={number} />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => window.print()}>Print / Save as PDF</Button>
        <J3Copy text={j3CertificateUrl(number)} label="Copy verification link" done="Link copied" />
      </div>
    </J3Modal>
  )
}
