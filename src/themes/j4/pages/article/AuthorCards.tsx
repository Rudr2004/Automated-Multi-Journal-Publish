// Author cards: portrait, name, corresponding-author mark, numbered affiliations and ORCID badge.
import type { ArticleFull } from '../../../../core/types'
import { orcidFor } from '../../../../mock-data/shared/identity'
import { Avatar, OrcidBadge } from '../../components/PaperBits'
import { Email } from '../../icons'
import { Label } from '../../components/primitives'

export function AuthorCards({ article }: { article: ArticleFull }) {
  const people = article.authorDetails ?? []
  if (!people.length) return null
  return (
    <div id="authors" className="mt-10 scroll-mt-32">
      <h3><Label className="text-cobalt-700">Authors</Label></h3>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {people.map((a) => {
          const orcid = a.orcid ?? orcidFor(a.name)
          return (
            <li key={a.name} className="flex gap-3 rounded-pane border border-abyss-200 bg-white p-4 shadow-hair">
              <Avatar name={a.name} size={48} />
              <div className="min-w-0">
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold text-abyss-900">
                  <span className="break-words">{a.name}</span>
                  {orcid && <OrcidBadge id={orcid} name={a.name} />}
                  {a.corresponding && (a.email
                    ? <a href={`mailto:${a.email}`} aria-label={`Corresponding author: email ${a.name}`} className="inline-flex items-center gap-1 rounded-ctl text-xs font-semibold text-cobalt-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600"><Email className="h-4 w-4" aria-hidden="true" />Corresponding</a>
                    : <span className="inline-flex items-center gap-1 text-xs font-semibold text-steel-700"><Email className="h-4 w-4" aria-hidden="true" />Corresponding</span>)}
                </p>
                <ul className="mt-1 space-y-0.5 text-[13px] leading-snug text-steel-600">
                  {a.affiliations.map((n) => article.affiliations?.[n - 1] && <li key={n} className="break-words"><sup className="mr-1 font-semibold text-cobalt-700">{n}</sup>{article.affiliations[n - 1]}</li>)}
                </ul>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
