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
        {/* Scrolls from right to left in a loop; hover or keyboard focus pauses it, and reduced-motion visitors can scroll by hand. */}
        <div className="j1-pausable ml-4 min-w-0 flex-1 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)]">
          <div className="j1-scroll-left flex w-max" style={{ ['--j1-scroll-duration' as string]: `${Math.max(24, logos.length * 4)}s` }}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center gap-x-4 pr-4" aria-hidden={copy > 0 || undefined} aria-label={copy === 0 ? 'Indexing platforms' : undefined}>
                {logos.map((l, i) => (
                  <li key={l.id}>
                    <a href={l.verifyUrl} target="_blank" rel="noreferrer" tabIndex={copy > 0 ? -1 : undefined} className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-sky-200 bg-white px-3 py-1 font-medium text-slate-700 transition-colors hover:border-azure-600 hover:text-cobalt-700">
                      <span aria-hidden="true" className={`h-2 w-2 rounded-full ${DOTS[i % DOTS.length]}`} />{l.name}{l.id === 'crossref' ? ' (DOI Indexed)' : ''}{copy === 0 && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
