import { journal } from '../../../config/journals/j1'

/** Journal information as a table with a navy label column (layout taken from the client's sample). */
export function JournalInfoTable() {
  const value = (k: string, v: string) => {
    if (k === 'Email') return <a href={`mailto:${v}`} className="font-semibold text-scholar hover:underline">{v}</a>
    if (k === 'Website') return <a href={`https://${v}`} target="_blank" rel="noreferrer" className="font-semibold text-scholar hover:underline">{v}</a>
    if (k === 'Publisher') return <>{v}, <a href="https://edtechpublishers.com" target="_blank" rel="noreferrer" className="font-semibold text-scholar hover:underline">Visit EdTech Publishers</a></>
    return v
  }
  return (
    <div className="overflow-x-auto border border-line">
      <table className="w-full min-w-[420px] border-collapse text-left text-sm">
        <caption className="sr-only">Journal information</caption>
        <tbody>
          {journal.info.map(([k, v]) => (
            <tr key={k} className="border-b border-line last:border-b-0">
              <th scope="row" className="w-36 bg-navy px-4 py-3 align-top text-sm font-semibold text-white sm:w-44">{k}</th>
              <td className="bg-white px-4 py-3 align-top leading-snug text-ink">{value(k, v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
