// Spec-sheet style blocks for Journal 5 (IJFRD) static pages: indexing table, journal information and contact details.
import { journal, logoSrc, visibleLogos } from '../../../../config/journals'
import { ArrowUpRight, Email, Person } from '../../icons'
import { cx } from '../primitives'

const th = 'px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600'

/** Services the journal can confirm, as a spec sheet: status, what it means for authors, verify link. */
export function IndexingTable() {
  const logos = visibleLogos()
  return (
    <div>
      <p className="mb-4 text-base text-obsidian-600">Only listings the journal can confirm are shown. Use the verify link to check each one on the service’s own website.</p>
      <div className="relative overflow-x-auto rounded border border-[#E6DCD0] bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Indexing and registration services</caption>
          <thead className="border-b border-[#E6DCD0] bg-[#F4EEE6]"><tr>
            <th scope="col" className={th}>Service</th><th scope="col" className={th}>Status</th><th scope="col" className={th}>What it means for authors</th><th scope="col" className={th}>Verify</th>
          </tr></thead>
          <tbody className="divide-y divide-[#E6DCD0]">
            {logos.map((l) => (
              <tr key={l.id} className="align-top">
                <th scope="row" className="px-4 py-4 font-medium text-obsidian-900">
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded border border-[#E6DCD0] bg-white p-1">
                      {l.file ? <img src={logoSrc(l.file)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" /> : <span className="font-newsreader text-[11px] font-bold text-obsidian-800">{l.name.slice(0, 3)}</span>}
                    </span>
                    <span>{l.name}<span className="mt-0.5 block text-xs font-normal text-obsidian-600">{l.description}</span></span>
                  </span>
                </th>
                <td className="px-4 py-4"><span className="inline-flex rounded border border-ochre-200 bg-ochre-50 px-2 py-0.5 text-xs font-semibold text-ochre-800">{l.status}</span></td>
                <td className="px-4 py-4 text-obsidian-700">{l.meaning}</td>
                <td className="px-4 py-4">
                  <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-1 font-semibold text-wine-700 underline-offset-2 hover:underline lg:min-h-0">
                    Verify<ArrowUpRight className="h-4 w-4" aria-hidden="true" /><span className="sr-only"> {l.name} (opens in a new tab)</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function KeyValueTable({ rows, caption }: { rows: [string, string][]; caption: string }) {
  return (
    <div className="relative overflow-x-auto rounded border border-[#E6DCD0] bg-white">
      <table className="w-full text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <tbody className="divide-y divide-[#E6DCD0]">
          {rows.map(([k, val]) => (
            <tr key={k}>
              <th scope="row" className="w-2/5 min-w-[7.5rem] bg-[#F4EEE6] px-4 py-3 align-top text-xs font-semibold uppercase tracking-[0.08em] text-obsidian-600 sm:w-1/3">{k}</th>
              <td className="break-words px-4 py-3 tabular-nums text-obsidian-900">
                {k === 'Email' ? <a className="text-wine-700 underline" href={`mailto:${val}`}>{val}</a>
                  : k === 'Website' ? <a className="text-wine-700 underline" href={`https://${val}`} target="_blank" rel="noreferrer">{val}<span className="sr-only"> (opens in a new tab)</span></a> : val}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const JournalInfoTable = () => <KeyValueTable rows={journal.info as unknown as [string, string][]} caption="Journal information" />

export function ContactDetails({ className }: { className?: string }) {
  const wa = `https://wa.me/${journal.whatsapp.replace(/\D/g, '')}`
  const directions = `https://www.google.com/maps/search/?api=1&query=${journal.location.lat},${journal.location.lng}`
  const rows: [string, string][] = [['Email', journal.email], ['WhatsApp', journal.whatsapp], ['Publisher', journal.publisher], ['Editorial office', journal.address], ['Response time', 'Within two working days']]
  return (
    <div className={cx('space-y-3', className)}>
      <KeyValueTable rows={rows} caption="Editorial office contact details" />
      <div className="flex flex-wrap gap-2">
        <a href={`mailto:${journal.email}`} className="inline-flex min-h-[44px] items-center gap-2 rounded border border-obsidian-300 bg-white px-4 text-sm font-semibold text-obsidian-900 hover:border-wine-700 hover:text-wine-700"><Email className="h-4 w-4" aria-hidden="true" />Email us</a>
        <a href={wa} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded border border-obsidian-300 bg-white px-4 text-sm font-semibold text-obsidian-900 hover:border-wine-700 hover:text-wine-700"><Person className="h-4 w-4" aria-hidden="true" />WhatsApp<span className="sr-only"> (opens in a new tab)</span></a>
        <a href={directions} target="_blank" rel="noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded border border-obsidian-300 bg-white px-4 text-sm font-semibold text-obsidian-900 hover:border-wine-700 hover:text-wine-700"><ArrowUpRight className="h-4 w-4" aria-hidden="true" />Get directions<span className="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
  )
}
