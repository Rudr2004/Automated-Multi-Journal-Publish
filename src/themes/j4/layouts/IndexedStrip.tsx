// "Indexed in" strip under the navigation, as in the reference: a pale-sky band with an "Indexed In:" label and one white chip per index.
// Lists only the indexes switched on in the journal config (visibleLogos), each linking to its verification page.
import { visibleLogos } from '../../../config/journals'
import { Verified } from '../components/refIconsJ4'

const DOTS = ['bg-azure-600', 'bg-blue-500', 'bg-red-500', 'bg-emerald-500', 'bg-indigo-500', 'bg-sky-600', 'bg-amber-500', 'bg-purple-500', 'bg-teal-500']

export function IndexedStrip() {
  const logos = visibleLogos()
  if (!logos.length) return null
  return (
    <section aria-label="Indexed in" className="w-full overflow-hidden border-b border-sky-200/80 bg-[#f0f7ff] py-2.5 text-xs">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-y-2 px-4">
        <p className="flex shrink-0 items-center gap-2 border-r border-sky-300 pr-4 text-xs font-semibold text-[#0b2545]"><Verified className="h-4 w-4 text-azure-600" aria-hidden="true" /><span className="text-[11px] uppercase tracking-wider">Indexed In:</span></p>
        <ul className="ml-4 flex flex-1 flex-wrap items-center gap-x-6 gap-y-2">
          {logos.map((l, i) => (
            <li key={l.id}>
              <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-sky-200 bg-white px-3 py-1 font-medium text-slate-700 transition-colors hover:border-azure-600">
                <span aria-hidden="true" className={`h-2 w-2 rounded-full ${DOTS[i % DOTS.length]}`} />{l.name}{l.id === 'crossref' ? ' (DOI Indexed)' : ''}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
