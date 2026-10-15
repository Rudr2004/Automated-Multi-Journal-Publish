// Official journal specifications: a two-column scholarly matrix built from journal.info (serif labels, hairline rows, alternating tint), as in the reference.
import { journal } from '../../../../config/journals'
import { Language, Mail, TableView } from '../../components/refIconsJ4'
import { Box, SectionHead } from './parts'

function Value({ k, v }: { k: string; v: string }) {
  if (k === 'Email') return <a href={`mailto:${v}`} className="flex items-center gap-1 font-mono font-medium text-cobalt-700 hover:underline"><Mail className="h-3.5 w-3.5" aria-hidden="true" />{v}</a>
  if (k === 'Website') return <a href={`https://${v}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono font-medium text-cobalt-700 hover:underline"><Language className="h-3.5 w-3.5" aria-hidden="true" />https://{v}/<span className="sr-only"> (opens in a new tab)</span></a>
  if (k === 'Frequency') return <span className="flex flex-wrap items-center gap-2">{v}{journal.frequency === 'Monthly' && <span className="rounded border border-emerald-200 bg-emerald-50 px-2 font-mono text-[11px] font-medium text-emerald-700">12 Issues / Year</span>}</span>
  if (k.startsWith('ISSN')) return <><span className="rounded border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono font-bold text-amber-800">{v}</span><span className="ml-2 text-[11px] text-slate-500">({k.includes('Online') ? 'Online' : 'Print'} ISSN)</span></>
  if (k === 'Address') {
    const i = v.indexOf(', ')
    return <><p className="font-semibold text-slate-800">{i > 0 ? v.slice(0, i) : v}</p>{i > 0 && <p className="mt-0.5 text-slate-600">{v.slice(i + 2)}</p>}</>
  }
  if (k === 'Title' || k === 'Publisher') return <span className="font-semibold text-slate-800">{v}</span>
  return <>{v}</>
}

// Home-page presentation: no "Starting Year" row, the publisher reads "IJECM Journal" and the subject is multidisciplinary.
const ROWS = journal.info.filter(([k]) => k !== 'Starting Year').map(([k, v]) => [k, k === 'Publisher' ? 'IJECM Journal' : k === 'Subject' ? 'Multidisciplinary Journal' : v] as const)

export function Specs() {
  const year = journal.info.find(([k]) => k === 'Starting Year')?.[1]
  return (
    <Box id="journal-specs" aria-labelledby="home-specs" className="p-5 md:p-6">
      <SectionHead id="home-specs" title="Official Journal Specifications & Overview" icon={<TableView className="h-6 w-6 text-azure-600" aria-hidden="true" />} text="Publishing parameters and editorial office details, as recorded in the journal's official information."
        tag={`Official Record${year ? ` ${year}` : ''}`} tagClass="border border-amber-200 bg-amber-50 font-mono font-bold text-amber-800" />
      <div className="overflow-hidden rounded-[8px] border border-slate-300">
        <table className="w-full border-collapse text-left text-xs">
          <tbody>
            {ROWS.map(([k, v], i) => (
              <tr key={k} className={`${i < ROWS.length - 1 ? 'border-b border-slate-200' : ''} ${i % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'} transition-colors hover:bg-sky-50/40`}>
                <th scope="row" className={`w-[34%] border-r border-slate-200 px-4 font-serif4 font-bold text-[#0b2545] sm:w-1/3 ${k === 'Address' ? 'py-3 align-top' : 'py-2.5'}`}>{k}</th>
                <td className={`min-w-0 break-words px-4 text-slate-700 ${k === 'Address' ? 'py-3 leading-relaxed' : 'py-2.5'}`}><Value k={k} v={v} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  )
}
