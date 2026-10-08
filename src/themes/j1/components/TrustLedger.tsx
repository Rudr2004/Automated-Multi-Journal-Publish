import { journal } from '../../../config/journals/j1'
import { TrustIcon } from './icons'
import { AppLink } from '../../../core/router'

/** "Trust ledger": a bordered, table-like list of the journal's commitments, each linking to its policy page. */
export function TrustLedger() {
  return (
    <ul className="divide-y divide-line border border-line bg-white" aria-label="Trust ledger">
      {journal.trustLedger.map((t) => (
        <li key={t.id} className="grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1 px-4 py-3.5 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <span className="flex h-9 w-9 items-center justify-center rounded bg-navy text-white"><TrustIcon name={t.icon} className="h-5 w-5" aria-hidden /></span>
          <div>
            <p className="font-serif text-base font-semibold text-navy">{t.title}</p>
            <p className="text-sm leading-snug text-ink-muted">{t.text}</p>
          </div>
          <AppLink to={t.to} className="col-start-2 text-sm font-semibold text-scholar hover:underline sm:col-start-3">Learn more →</AppLink>
        </li>
      ))}
    </ul>
  )
}
