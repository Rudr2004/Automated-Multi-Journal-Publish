// Printable certificate of publication with a QR code (Journal 4). Printing is handled by the #certificate-print rule in index.css.
import { QRCodeSVG } from 'qrcode.react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'

export interface CertificateData { author: string; paperId: string; title: string; publishedAt: string; volume?: number; issue?: number }
export const certificateUrl = (number: string) => `https://${journal.domain}${paths.verify(number)}`

export function CertificatePaper({ data, number }: { data: CertificateData; number: string }) {
  return (
    <div id="certificate-print" className="relative overflow-hidden rounded-pane border border-abyss-300 bg-white p-5 text-center shadow-panel sm:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute inset-2 rounded-ctl border border-abyss-900" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[14px] rounded-ctl border border-abyss-200" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-abyss-900" />
      <div className="relative px-2 py-3">
        <p className="font-serif4 text-3xl font-bold tracking-tight text-abyss-900">{journal.shortName}</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-steel-600">{journal.name}</p>
        <h3 className="mt-6 font-serif4 text-2xl font-semibold text-abyss-900 sm:text-[2rem]">Certificate of Publication</h3>
        <p className="mt-5 text-sm text-steel-600">This is to certify that</p>
        <p className="mt-1 break-words font-serif4 text-2xl font-semibold text-cobalt-700 sm:text-[2rem]">{data.author}</p>
        <p className="mt-3 text-sm text-steel-600">is an author of the open access article</p>
        <p className="mx-auto mt-2 max-w-2xl font-serif4 text-base font-medium italic leading-snug text-abyss-900 sm:text-lg">“{data.title}”</p>
        <p className="mt-3 text-sm tabular-nums text-steel-600">{data.volume ? <>Volume {data.volume}, Issue {data.issue} · </> : null}Published {formatDate(data.publishedAt)}</p>
        <p className="break-all text-sm tabular-nums text-steel-600">DOI {doiFor(data.paperId)}</p>
        <div className="mt-7 flex flex-col items-center gap-4 border-t border-abyss-200 pt-5 sm:flex-row sm:justify-between sm:text-left">
          <div className="text-sm">
            <p className="font-semibold text-abyss-900">Editor-in-Chief</p>
            <p className="text-steel-600">{journal.name}</p>
            <p className="mt-2 break-all text-xs text-steel-600">Certificate no. <strong className="tabular-nums text-abyss-900">{number}</strong></p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs text-steel-600"><p className="font-semibold text-abyss-900">Scan to verify</p><p>{journal.domain}</p></div>
            <QRCodeSVG value={certificateUrl(number)} size={84} level="M" fgColor="#0F172A" role="img" aria-label={`QR code for certificate ${number}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
