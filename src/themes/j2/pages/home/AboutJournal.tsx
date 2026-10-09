// "Aims & Scope" with discipline pills, and the "Journal Specifications & Metadata" table (rows come from the journal config).
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { disciplines } from '../../components/discipline'
import { Explore, TableIcon } from '../../components/homeIcons'

const valueFor = (label: string, value: string) => {
  if (label === 'Email') return <a href={`mailto:${value}`} className="font-semibold text-accent-700 hover:underline">{value}</a>
  if (label === 'Website') return <a href={`https://${value}`} target="_blank" rel="noreferrer" className="font-semibold text-accent-700 hover:underline">{value}</a>
  if (/ISSN/.test(label)) return <span className="font-mono">{value}</span>
  return value
}

export function AboutJournal() {
  return (
    <section aria-labelledby="aims-title" className="rounded-sheet border border-graphite-200 bg-white p-5 shadow-card sm:p-6">
      <h2 id="aims-title" className="flex items-center gap-2.5 font-display text-2xl font-bold text-graphite-900"><Explore className="h-6 w-6 text-brand-800" aria-hidden="true" /> Aims &amp; Scope</h2>
      <p className="mt-4 text-sm leading-relaxed text-graphite-700 sm:text-base">{journal.mission}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {disciplines.map((d) => (
          <li key={d.id}><AppLink to={paths.search(d.name)} className="inline-block rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-800 hover:bg-brand-100">{d.name}</AppLink></li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-800"><TableIcon className="h-5 w-5" aria-hidden="true" /> Journal Specifications &amp; Metadata</h3>
        <AppLink to={paths.about('journal-information')} className="text-xs font-medium text-graphite-600 hover:text-accent-700 hover:underline">Journal information</AppLink>
      </div>
      <div className="mt-3 overflow-hidden rounded-panel border border-graphite-200">
        <table className="w-full border-collapse text-left text-sm">
          <caption className="sr-only">Journal specifications and metadata</caption>
          <tbody>
            {journal.info.map(([label, value]) => (
              <tr key={label} className="border-b border-graphite-200 last:border-b-0 even:bg-graphite-50/60">
                <th scope="row" className="w-32 bg-brand-800 px-3 py-2.5 align-top text-xs font-bold text-white sm:w-48 sm:px-4 sm:text-sm">{label}</th>
                <td className="px-3 py-2.5 align-top text-graphite-800 sm:px-4">{valueFor(label, value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
