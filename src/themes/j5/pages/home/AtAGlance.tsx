// "Journal at a glance": a specification sheet in a two-column table. Every value comes from the journal config.
import { journal } from '../../../../config/journals'
import { formatNumber } from '../../../../core/lib/format'
import { HomeSection } from './HomeHead'

export function AtAGlance({ reviewDays }: { reviewDays: number }) {
  const { apc } = journal
  const rows: [string, string][] = [
    ['Frequency', journal.frequency],
    ['Review model', 'Peer review: editor screening, then external reviewers'],
    ['First decision', `Target of about ${reviewDays} days`],
    ['Licence', `Open access, ${journal.licence.name}`],
    ['DOI', `${journal.doiPrefix}/{Paper ID}, registered with Crossref`],
    ['APC', `₹${formatNumber(apc.inr)} + ${apc.gstPercent}% GST (India), US$${formatNumber(apc.usd)} (other countries), payable after acceptance`],
    ['ISSN (Online)', journal.issnOnline],
    ['Language', 'English'],
    ['Format', 'Online'],
    ['Publisher', journal.publisher],
  ]
  return (
    <HomeSection id="glance-title" label="Journal information" title="Specification sheet" text="The essentials an author or librarian needs, in one place.">
        <dl className="grid overflow-hidden rounded border border-obsidian-200 md:grid-cols-2">
          {rows.map(([k, v], i) => (
            <div key={k} className={`grid grid-cols-[9rem_1fr] border-obsidian-200 sm:grid-cols-[11rem_1fr] ${i % 2 === 0 ? 'md:border-r' : ''} ${i < rows.length - (rows.length % 2 === 0 ? 2 : 1) ? 'border-b' : ''} ${i === rows.length - 1 && rows.length % 2 === 0 ? 'max-md:border-b-0' : ''}`}>
              <dt className="bg-[#F6EFE6] px-4 py-3 text-sm font-semibold text-wine-900">{k}</dt>
              <dd className="px-4 py-3 text-sm tabular-nums text-obsidian-700">{v}</dd>
            </div>
          ))}
        </dl>
    </HomeSection>
  )
}
