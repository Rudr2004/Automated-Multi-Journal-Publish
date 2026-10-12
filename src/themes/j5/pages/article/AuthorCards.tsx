// "Authors & publication certificates": one card per author (initials disc, corresponding / ORCID marks, numbered affiliation) with a certificate action.
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { orcidFor } from '../../../../mock-data/shared/identity'
import { OrcidBadge } from '../../components/PaperBits'
import { Award, Email, Verified } from '../../icons'
import { CARD, LABEL } from './shared'

const DISCS = ['bg-wine-800', 'bg-ochre-700', 'bg-bordeaux-900', 'bg-obsidian-600']
const initials = (name: string) => name.replace(/^(Prof|Dr)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()

export function AuthorCards({ article }: { article: ArticleFull }) {
  const people = article.authorDetails ?? []
  if (!people.length) return null
  return (
    <div id="authors-section" className="scroll-mt-32 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 className={LABEL}>Authors &amp; publication certificates</h3>
        <span className="flex items-center gap-1 font-work text-[11px] font-medium text-wine-800"><Verified className="h-[13px] w-[13px]" aria-hidden="true" />Official e-certificates</span>
      </div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {people.map((a, i) => {
          const orcid = a.orcid ?? orcidFor(a.name)
          const marks = a.affiliations.filter((n) => article.affiliations?.[n - 1])
          return (
            <li key={a.name} className={`${CARD} flex flex-col justify-between gap-2.5 p-3.5`}>
              <div className="flex items-start gap-2.5">
                <span aria-hidden="true" className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-work text-xs font-bold text-white ${DISCS[i % DISCS.length]}`}>{initials(a.name)}</span>
                <div className="min-w-0 flex-1 space-y-0.5">
                  <p className="flex flex-wrap items-center gap-1 font-work text-xs font-bold text-obsidian-900">
                    <span className="break-words">{a.name}</span>
                    {a.corresponding && (a.email
                      ? <a href={`mailto:${a.email}`} aria-label={`Corresponding author: email ${a.name}`} title="Corresponding author" className="inline-flex rounded text-wine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700"><Email className="h-3 w-3" aria-hidden="true" /></a>
                      : <Email className="h-3 w-3 text-wine-800" role="img" aria-label="Corresponding author" />)}
                    {orcid && <OrcidBadge id={orcid} name={a.name} />}
                  </p>
                  {marks.map((n) => (
                    <p key={n} className="break-words font-work text-[11px] leading-tight text-[#564241]"><sup className="mr-0.5 font-bold text-wine-800">{n}</sup>{article.affiliations[n - 1]}</p>
                  ))}
                </div>
              </div>
              <AppLink to={paths.verify()} aria-label={`Verify publication certificate for ${a.name}`}
                className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded border border-amber-300 bg-amber-50 px-2 py-1.5 font-work text-[11px] font-semibold uppercase tracking-wider text-amber-900 transition-colors hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 motion-reduce:transition-none sm:min-h-9">
                <Award className="h-[14px] w-[14px] text-amber-700" aria-hidden="true" />Verify Certificate
              </AppLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
