// Home hero, as in the reference: a 7-column "About the Journal" card with four feature tiles and a check row, beside a 5-column wine "Call for Papers" plate
// (timeline card, Submit button, editor email). Every figure comes from the journal config or the call for papers.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { CallForPapers } from '../../../../core/types'
import { Event, Fingerprint, Policy, PublishedWithChanges, Speed, VerifiedUser } from '../../components/homeIconsJ5'
import { Container } from '../../components/primitives'
import { ArrowRight, Book, OpenAccess, Publish, Verified } from '../../icons'

const tile = 'group rounded border border-[#dcc0be] bg-[#f4f5fc] p-3.5 transition hover:border-wine-800'

export function Hero({ cfp }: { cfp: CallForPapers }) {
  const [issueName, issueMonth] = cfp.issueName.split(' — ')
  const features = [
    { Icon: OpenAccess, title: 'Open Access Dissemination', text: `Free global access under ${journal.licence.name}, with a permanent Crossref DOI for every article.` },
    { Icon: VerifiedUser, title: 'Structured Peer Review', text: 'Every paper is screened by an editor and reviewed by experts against a published checklist, with written reasons for each decision.' },
    { Icon: Policy, title: 'Published Ethics Policies', text: 'Publication ethics, plagiarism, conflict-of-interest and retraction policies are published for authors, reviewers and editors.' },
    { Icon: PublishedWithChanges, title: 'Monthly Publication', text: `A new ${journal.frequency.toLowerCase()} issue with online publication and Crossref DOI deposit for every article.` },
  ]
  return (
    <section aria-labelledby="hero-title" className="border-b border-obsidian-200 bg-[#f9f9ff] px-0 py-8">
      <Container>
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          <div className="flex flex-col justify-between rounded border border-[#dcc0be] bg-white p-6 shadow-sm sm:p-8 lg:col-span-7">
            <div>
              <div className="mb-4 flex items-center justify-between border-b border-obsidian-200 pb-2">
                <span className="flex items-center gap-1.5 font-work text-xs font-semibold uppercase tracking-widest text-wine-800"><Book className="h-4 w-4" aria-hidden="true" />About the Journal</span>
              </div>
              <h2 id="hero-title" className="mb-3 font-newsreader text-2xl font-semibold leading-tight text-[#141b2b] sm:text-3xl">
                {journal.name} <span className="text-[#9b4500]">({journal.shortName})</span>
              </h2>
              <p className="mb-6 font-serif4 text-sm leading-relaxed text-[#564241]">
                {journal.name} ({journal.shortName}) is an international, open access, peer-reviewed {journal.frequency.toLowerCase()} journal published from {journal.publisherCity}. It is built for rigorous research that others can build on.
              </p>
              <div className="mb-6 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {features.map(({ Icon, title, text }) => (
                  <div key={title} className={tile}>
                    <div className="mb-1 flex items-center gap-2 text-wine-800"><Icon className="h-[18px] w-[18px]" aria-hidden="true" /><h3 className="font-newsreader text-sm font-semibold text-[#141b2b] group-hover:text-wine-800">{title}</h3></div>
                    <p className="font-work text-xs text-[#564241]">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <ul className="flex flex-wrap items-center justify-between gap-3 border-t border-obsidian-200 pt-4 font-work text-xs">
              <li className="flex items-center gap-1 font-medium text-[#141b2b]"><VerifiedUser className="h-4 w-4 text-[#9b4500]" aria-hidden="true" />Structured Peer Review</li>
              <li className="flex items-center gap-1 font-medium text-[#141b2b]"><OpenAccess className="h-4 w-4 text-emerald-700" aria-hidden="true" />Open Access ({journal.licence.name})</li>
              <li className="flex items-center gap-1 font-medium text-[#141b2b]"><Verified className="h-4 w-4 text-wine-800" aria-hidden="true" />Crossref DOI for every article</li>
            </ul>
          </div>

          <div className="relative flex flex-col justify-between overflow-hidden rounded border border-[#6b1e2f] bg-gradient-to-br from-wine-800 to-[#51020b] p-6 text-white shadow-lg sm:p-8 lg:col-span-5">
            <Book aria-hidden="true" className="pointer-events-none absolute -bottom-12 -right-12 h-[240px] w-[240px] opacity-10" />
            <div>
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded bg-amber-400 px-2.5 py-1 font-work text-[11px] font-bold uppercase tracking-wider text-amber-950 shadow">Call for Papers</span>
                <span className="font-work text-xs text-amber-200">{issueName.replace('Volume', 'Vol.')}{issueMonth ? ` (${issueMonth})` : ''}</span>
              </div>
              <h3 className="mb-3 font-newsreader text-2xl font-bold leading-tight text-white sm:text-3xl">Call for Papers: <span className="block">{issueName}{issueMonth ? `, ${issueMonth}` : ''}</span></h3>
              <p className="mb-5 font-serif4 text-xs leading-relaxed text-[#f4f5fc] sm:text-sm">The Editorial Board invites researchers worldwide to submit original manuscripts for this issue. Submissions are reviewed on a rolling basis.</p>
              <dl className="mb-6 space-y-2.5 rounded border border-white/20 bg-black/25 p-4 font-work text-xs text-white backdrop-blur-sm">
                {[
                  [Event, 'Submission Deadline:', formatDate(cfp.deadline.slice(0, 10))],
                  [Speed, 'First Decision Target:', `About ${cfp.avgReviewDays} days`],
                  [Publish, 'Expected Publication:', formatDate(cfp.expectedPublication)],
                  [Fingerprint, 'Crossref DOI Prefix:', journal.doiPrefix],
                ].map(([Icon, k, v], i) => {
                  const I = Icon as typeof Event
                  return (
                    <div key={k as string} className={`flex items-center justify-between gap-3 ${i ? 'border-t border-white/10 pt-2' : ''}`}>
                      <dt className="flex items-center gap-1.5 text-amber-200"><I className="h-[15px] w-[15px]" aria-hidden="true" />{k as string}</dt>
                      <dd className={`font-bold ${i === 3 ? 'font-mono text-amber-300' : ''}`}>{v as string}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
            <div className="pt-2">
              <AppLink to={paths.submit} className="inline-flex w-full items-center justify-center gap-2 rounded bg-amber-400 px-6 py-3.5 font-work text-sm font-bold uppercase tracking-wider text-stone-950 shadow-lg transition hover:bg-amber-300 active:scale-95 motion-reduce:active:scale-100">
                <span>Submit Manuscript Now</span><ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
              </AppLink>
              <p className="mt-2.5 text-center font-work text-[11px] text-amber-200">Email enquiries welcome: <a className="font-medium text-white underline hover:text-amber-300" href={`mailto:${journal.email}`}>{journal.email}</a></p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
