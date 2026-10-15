// "Indexed in" strip under the navigation, as in the reference: a pale-sky band with an "Indexed In:" label and one white chip per index.
// Lists only the indexes switched on in the journal config (visibleLogos), each linking to its verification page.
import { logoSrc, visibleLogos } from '../../../config/journals'
import { Verified } from '../components/refIconsJ4'

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
                {logos.map((l) => (
                  <li key={l.id}>
                    <a href={l.verifyUrl} target="_blank" rel="noreferrer" tabIndex={copy > 0 ? -1 : undefined} className="inline-flex h-10 items-center whitespace-nowrap rounded border border-sky-200 bg-white px-4 font-medium text-slate-700 transition-colors hover:border-azure-600 hover:text-cobalt-700">
                      {l.file ? <img src={logoSrc(l.file)} alt={copy > 0 ? '' : l.name} loading="lazy" className="max-h-6 w-auto max-w-[7rem] object-contain" /> : <span>{l.name}</span>}{copy === 0 && <span className="sr-only"> (opens in a new tab)</span>}
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
