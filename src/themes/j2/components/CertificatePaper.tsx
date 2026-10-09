// Printable certificate of publication with a QR code, plus the dialog that shows one certificate per author.
import { useId, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { Button } from './Button'
import { CopyChip } from './CopyChip'
import { ModalDialog } from './ModalDialog'
import { Print } from './pageIcons'
import { cx } from './primitives'

export interface CertificateData { author: string; paperId: string; title: string; publishedAt: string; volume?: number; issue?: number }

/** `${prefix}-CERT-${paperId}` for the first author, then -A2, -A3 … for co-authors. */
export const certificateNumber = (paperId: string, authorIndex: number) =>
  `${journal.paperIdPrefix}-CERT-${paperId}${authorIndex > 0 ? `-A${authorIndex + 1}` : ''}`
export const certificateUrl = (number: string) => `https://${journal.domain}${paths.verify(number)}`

export function CertificatePaper({ data, number }: { data: CertificateData; number: string }) {
  return (
    <div id="certificate-print" className="relative overflow-hidden rounded-sheet border-4 border-brand-800 bg-white p-5 text-center sm:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-panel border border-brand-200" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-brand-800 via-accent-700 to-brand-500" />
      <div className="relative">
        <img src="/journals/j2/logo.png" alt="" width={512} height={512} className="mx-auto h-16 w-16 select-none object-contain" />
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-accent-700 sm:text-xs">{journal.name}</p>
        <h3 className="mt-4 font-display text-2xl font-bold text-brand-800 sm:text-4xl">Certificate of Publication</h3>
        <p className="mt-4 text-sm text-graphite-600">This is to certify that</p>
        <p className="mt-1 break-words font-display text-2xl font-bold text-graphite-800 sm:text-4xl">{data.author}</p>
        <p className="mt-3 text-sm text-graphite-600">is an author of the open access article</p>
        <p className="mx-auto mt-2 max-w-2xl font-display text-base font-medium italic leading-snug text-brand-800 sm:text-lg">“{data.title}”</p>
        <p className="mt-3 text-sm text-graphite-700">{data.volume ? <>Volume {data.volume}, Issue {data.issue} · </> : null}Published {formatDate(data.publishedAt)}</p>
        <p className="break-all text-sm text-graphite-700">DOI {doiFor(data.paperId)}</p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:text-left">
          <div className="text-sm">
            <p className="font-semibold text-brand-800">Editor-in-Chief</p>
            <p className="text-graphite-600">{journal.name}</p>
            <p className="mt-2 break-all text-xs text-graphite-600">Certificate no. <strong className="text-graphite-800">{number}</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-graphite-600"><p className="font-semibold text-brand-800">Scan to verify</p><p>{journal.domain}</p></div>
            <QRCodeSVG value={certificateUrl(number)} size={84} level="M" fgColor="#064E3B" role="img" aria-label={`QR code for certificate ${number}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

/** One certificate per author. "Print / Save as PDF" prints only the certificate (print rules live in index.css). */
export function CertificateDialog({ open, onClose, paper }: {
  open: boolean; onClose: () => void
  paper: { paperId: string; title: string; publishedAt: string; authors: string[]; volume?: number; issue?: number }
}) {
  const [i, setI] = useState(0)
  const tabs = useId()
  const author = paper.authors[i] ?? paper.authors[0] ?? 'Author'
  const number = certificateNumber(paper.paperId, i)
  return (
    <ModalDialog open={open} onClose={onClose} title="Author certificate" size="xl">
      {paper.authors.length > 1 && (
        <div role="group" aria-labelledby={tabs} className="mb-4">
          <p id={tabs} className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-graphite-600">Choose author</p>
          <div className="flex flex-wrap gap-1.5">
            {paper.authors.map((a, k) => (
              <button key={a} type="button" aria-pressed={k === i} onClick={() => setI(k)}
                className={cx('rounded-chip border px-3 py-1.5 text-xs font-semibold', k === i ? 'border-brand-800 bg-brand-800 text-white' : 'border-graphite-300 text-graphite-700 hover:border-accent-700 hover:text-accent-700')}>{a}</button>
            ))}
          </div>
        </div>
      )}
      <CertificatePaper data={{ author, paperId: paper.paperId, title: paper.title, publishedAt: paper.publishedAt, volume: paper.volume, issue: paper.issue }} number={number} />
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button onClick={() => window.print()}><Print className="h-4 w-4" aria-hidden="true" />Print / Save as PDF</Button>
        <CopyChip text={certificateUrl(number)} label="Copy verification link" done="Link copied" className="!py-2.5 !text-sm" />
      </div>
    </ModalDialog>
  )
}
