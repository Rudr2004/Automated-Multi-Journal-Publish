// Closing call to action: a deep-emerald band with the two main author actions.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { AppLink } from '../../../../core/router'
import { Container } from '../../components/primitives'
import { CloudUpload, Description } from '../../components/homeIcons'

export function FinalCta() {
  const checks = [journal.badges.peerReviewed && 'Peer reviewed', journal.badges.openAccess && `${journal.licence.name} open access`, 'Crossref DOI registered'].filter(Boolean) as string[]
  return (
    <section aria-labelledby="final-title">
      <Container>
        <div className="rounded-sheet bg-brand-800 px-6 py-12 text-center text-white shadow-soft sm:px-10">
          <p className="inline-block rounded-full bg-white/15 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider text-brand-100">Emerald Scholar open access network</p>
          <h2 id="final-title" className="mx-auto mt-4 max-w-3xl font-display text-3xl font-extrabold sm:text-4xl">Ready to Publish Your Multidisciplinary Research?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-brand-100">Fair peer review with an average first decision in about two weeks, and immediate worldwide open access under {journal.licence.name}.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <AppLink to={paths.submit} className="inline-flex items-center gap-2 rounded-panel bg-white px-6 py-3 text-sm font-bold text-brand-800 hover:bg-brand-50 focus-visible:!outline-white"><CloudUpload className="h-5 w-5" aria-hidden="true" /> Submit Manuscript Now</AppLink>
            <AppLink to={paths.policy('author-guidelines')} className="inline-flex items-center gap-2 rounded-panel border border-brand-300 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 focus-visible:!outline-white"><Description className="h-5 w-5" aria-hidden="true" /> Read Guidelines</AppLink>
          </div>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-brand-100">
            {checks.map((c) => <li key={c}>✓ {c}</li>)}
          </ul>
        </div>
      </Container>
    </section>
  )
}
