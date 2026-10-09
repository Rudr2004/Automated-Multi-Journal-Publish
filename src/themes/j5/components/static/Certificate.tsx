// Printable certificate of publication with a QR code (Journal 5): burgundy and amber, ornamental triple border, laurel seal.
// Printing is handled by the #certificate-print rule in index.css.
import { QRCodeSVG } from 'qrcode.react'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { OrnamentRule } from '../signature'

export interface CertificateData { author: string; paperId: string; title: string; publishedAt: string; volume?: number; issue?: number }
export const certificateUrl = (number: string) => `https://${journal.domain}${paths.verify(number)}`

/** Round seal: scalloped amber rim, burgundy disc, atom orbits and the journal abbreviation. */
export function Seal({ className = 'h-24 w-24' }: { className?: string }) {
  const orbit = [0, 60, 120]
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <circle cx="50" cy="50" r="45" fill="none" stroke="#B45309" strokeWidth="7" strokeDasharray="5.2 2.4" />
      <circle cx="50" cy="50" r="41" fill="#701A1E" />
      <circle cx="50" cy="50" r="37" fill="none" stroke="#FCD34D" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="33.5" fill="none" stroke="#FCD34D" strokeWidth="0.4" strokeOpacity="0.6" />
      <g transform="translate(50 42)" fill="none" stroke="#FCD34D" strokeWidth="0.9">
        {orbit.map((r) => <ellipse key={r} rx="20" ry="7.5" transform={`rotate(${r})`} />)}
        <circle r="2.8" fill="#FBBF24" stroke="none" />
      </g>
      <text x="50" y="72" textAnchor="middle" fontFamily="Newsreader, Georgia, serif" fontSize="10.5" fontWeight="700" letterSpacing="1.2" fill="#FCD34D">{journal.shortName}</text>
      <text x="50" y="81" textAnchor="middle" fontFamily="Work Sans, Arial, sans-serif" fontSize="4.2" letterSpacing="1.4" fill="#FDE68A">EST. 2026</text>
    </svg>
  )
}

const corner = 'pointer-events-none absolute h-3 w-3 rotate-45 bg-ochre-700'

export function CertificatePaper({ data, number }: { data: CertificateData; number: string }) {
  return (
    <div id="certificate-print" style={{ WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }} className="relative overflow-hidden rounded-sm border-2 border-wine-800 bg-[#FFFBF3] p-3 text-center sm:p-4">
      <div aria-hidden="true" className="pointer-events-none absolute inset-[7px] border border-ochre-700" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-[12px] border-[3px] border-double border-wine-800/70" />
      <span aria-hidden="true" className={`${corner} left-[5px] top-[5px]`} /><span aria-hidden="true" className={`${corner} right-[5px] top-[5px]`} />
      <span aria-hidden="true" className={`${corner} bottom-[5px] left-[5px]`} /><span aria-hidden="true" className={`${corner} bottom-[5px] right-[5px]`} />
      <img aria-hidden="true" alt="" src="/journals/j5/images/orbits.svg" className="pointer-events-none absolute left-1/2 top-1/2 w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-[0.07] [filter:sepia(1)_saturate(3)_hue-rotate(-20deg)]" />
      <div className="relative px-4 pb-4 pt-8 sm:px-12 sm:pb-6 sm:pt-10">
        <p className="font-newsreader text-[2.25rem] font-semibold leading-none tracking-[0.12em] text-wine-800 sm:text-5xl">{journal.shortName}</p>
        <p className="mx-auto mt-2 max-w-md font-work text-[11px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-ochre-800">{journal.name}</p>
        <OrnamentRule className="mx-auto mt-4 max-w-sm" />
        <h3 className="mt-5 font-newsreader text-[1.75rem] font-semibold leading-tight text-obsidian-900 sm:text-[2.5rem]">Certificate of Publication</h3>
        <p className="mt-5 font-serif4 text-sm italic text-obsidian-600">This is to certify that</p>
        <p className="mx-auto mt-1 max-w-xl break-words border-b border-ochre-700/50 pb-2 font-newsreader text-[1.75rem] font-semibold leading-tight text-wine-800 sm:text-[2.5rem]">{data.author}</p>
        <p className="mt-4 font-serif4 text-sm italic text-obsidian-600">is an author of the open access article</p>
        <p className="mx-auto mt-2 max-w-2xl font-newsreader text-base font-medium italic leading-snug text-obsidian-900 sm:text-xl">“{data.title}”</p>
        <p className="mt-4 font-work text-[13px] tabular-nums text-obsidian-700">{data.volume ? <>Volume {data.volume}, Issue {data.issue} · </> : null}Published {formatDate(data.publishedAt)}</p>
        <p className="break-all font-work text-[13px] tabular-nums text-obsidian-700">DOI {doiFor(data.paperId)}</p>
        <div className="mt-7 grid items-end gap-5 border-t border-ochre-700/40 pt-5 sm:grid-cols-[1fr_auto_1fr]">
          <div className="text-center sm:text-left">
            <div className="mx-auto h-9 w-44 border-b border-obsidian-700 sm:mx-0" aria-hidden="true" />
            <p className="mt-1.5 font-newsreader text-base font-semibold text-obsidian-900">Editor-in-Chief</p>
            <p className="font-work text-xs text-obsidian-600">{journal.name}</p>
            <p className="mt-2 break-all font-work text-xs text-obsidian-600">Certificate no. <strong className="tabular-nums text-obsidian-900">{number}</strong></p>
          </div>
          <div className="flex justify-center"><Seal /></div>
          <div className="flex items-center justify-center gap-3 sm:justify-end">
            <div className="text-right font-work text-xs text-obsidian-600"><p className="font-semibold text-obsidian-900">Scan to verify</p><p>{journal.domain}</p></div>
            <QRCodeSVG value={certificateUrl(number)} size={84} level="M" fgColor="#4C0519" bgColor="transparent" role="img" aria-label={`QR code for certificate ${number}`} />
          </div>
        </div>
      </div>
    </div>
  )
}
