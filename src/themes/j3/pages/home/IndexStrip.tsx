// "Indexed & discovered in" band: the index logos the journal config has switched on (only listings the client has confirmed), with a link to the indexing page.
import { logoSrc, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { labelCls, linkCls, wrapCls } from './bits'

export function IndexStrip() {
  const logos = visibleLogos()
  if (!logos.length) return null
  return (
    <section aria-label="Indexed and discovered in" className="mt-10 border-y border-j3paper-rule bg-j3paper-cool">
      <div className={`${wrapCls} flex flex-wrap items-center gap-x-8 gap-y-3 py-4`}>
        <h2 className={`${labelCls} flex items-center gap-2.5 text-[12px] tracking-[0.08em] text-night-900`}><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Indexed &amp; discovered in:</h2>
        <ul className="flex flex-wrap items-center gap-3">
          {logos.map((l) => (
            <li key={l.id}>
              <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="flex h-10 items-center rounded-tile border border-j3paper-rule bg-white px-4 hover:border-iris-700">
                {l.file ? <img src={logoSrc(l.file)} alt={l.name} className="max-h-6 w-auto" /> : <span className="font-jakarta text-sm font-semibold text-night-900">{l.name}</span>}
              </a>
            </li>
          ))}
        </ul>
        <AppLink to={paths.about('indexing')} className={`${linkCls} ml-auto`}>Verify indexing status &rarr;</AppLink>
      </div>
    </section>
  )
}
