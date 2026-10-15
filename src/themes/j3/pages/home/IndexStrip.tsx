// "Indexed & discovered in" band: the index logos the journal config has switched on (only listings the client has confirmed), with a link to the indexing page.
import { logoSrc, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { labelCls, linkCls, wrapCls } from './bits'

export function IndexStrip() {
  const logos = visibleLogos()
  if (!logos.length) return null
  // A short list is repeated so that one copy is wider than the strip.
  const reel = Array.from({ length: Math.max(logos.length, 8) }, (_, i) => logos[i % logos.length])
  return (
    <section aria-label="Indexed and discovered in" className="mt-10 border-y border-j3paper-rule bg-j3paper-cool">
      <div className={`${wrapCls} flex flex-wrap items-center gap-x-8 gap-y-3 py-4`}>
        <h2 className={`${labelCls} flex items-center gap-2.5 text-[12px] tracking-[0.08em] text-night-900`}><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Indexed &amp; discovered in:</h2>
        {/* The logos scroll from right to left in a loop (a short list is repeated to fill the width); hover or focus pauses them. */}
        <div className="j1-pausable min-w-0 flex-1 overflow-hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,#000_16px,#000_calc(100%-16px),transparent)]">
          <div className="j1-scroll-left flex w-max" style={{ ['--j1-scroll-duration' as string]: `${Math.max(20, reel.length * 4)}s` }}>
            {[0, 1].map((copy) => (
              <ul key={copy} className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={copy > 0 || undefined} aria-label={copy === 0 ? 'Indexing platforms' : undefined}>
                {reel.map((l, i) => (
                  <li key={`${copy}-${i}`}>
                    <a href={l.verifyUrl} target="_blank" rel="noreferrer" tabIndex={copy > 0 ? -1 : undefined} className="flex h-10 items-center rounded-tile border border-j3paper-rule bg-white px-4 hover:border-iris-700">
                      {l.file ? <img src={logoSrc(l.file)} alt={copy > 0 ? '' : l.name} className="max-h-6 w-auto" /> : <span className="font-jakarta text-sm font-semibold text-night-900">{l.name}</span>}
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <AppLink to={paths.about('indexing')} className={`${linkCls} shrink-0`}>Verify indexing status &rarr;</AppLink>
      </div>
    </section>
  )
}
