import { journal, visibleLogos } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { formatDate } from '../../../core/lib/format'
import { AppLink } from '../../../core/router'
import { RightSidebar } from './HomeSidebars'
import { ButtonLink } from './Button'
import { Countdown } from './Countdown'
import { IndexLogo } from './IndexLogos'
import { StickyRail } from './StickyRail'
import { FilePlus2, OpenInNew } from './uiIcons'

/** One row of compact index tiles (only logos switched on in the config) with a link to the indexing page. */
export function IndexedStrip() {
  const logos = visibleLogos()
  if (!logos.length) return null
  return (
    <section aria-labelledby="indexed-title" className="mt-8 border border-line bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <h2 id="indexed-title" className="font-serif text-[1.125rem] font-semibold text-navy">Indexed &amp; Discoverable On Global Academic Indices</h2>
        <AppLink to={paths.about('indexing')} className="inline-flex items-center gap-1 text-sm font-semibold text-scholar hover:underline">Verify repositories<OpenInNew className="h-3.5 w-3.5" aria-hidden /></AppLink>
      </div>
      <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:flex lg:gap-2">
        {logos.map((l) => <li key={l.id} className="lg:min-w-0 lg:flex-1"><IndexLogo logo={l} look="compact" opensUp /></li>)}
      </ul>
    </section>
  )
}

/** Navy "Call for next issue" banner with the countdown and the Submit button. */
export function NextIssueBanner() {
  const { nextIssue } = journal
  return (
    <section aria-labelledby="next-call-title" className="mt-6 flex flex-col gap-5 bg-navy p-6 text-white md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#AFC1E3]">Call for next issue</p>
        <h2 id="next-call-title" className="mt-1 font-serif text-[1.5rem] font-semibold leading-snug">{nextIssue.label}</h2>
        <p className="mt-1 text-sm text-[#D6E0F3]">Submission deadline <strong className="tabular-nums text-white">{formatDate(nextIssue.deadline.slice(0, 10))}</strong> · Expected publication <strong className="tabular-nums text-white">{formatDate(nextIssue.expectedPublication)}</strong></p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Countdown deadline={nextIssue.deadline} windowDays={60} />
        <ButtonLink to={paths.submit} variant="submit" size="lg"><FilePlus2 className="h-5 w-5" aria-hidden />Submit Manuscript</ButtonLink>
      </div>
    </section>
  )
}

/** Right rail of the issue pages: the same sidebar as the home page. */
export function IssueRightRail() {
  return (
    <StickyRail as="div" className="grid content-start gap-4 md:grid-cols-2 xl:block xl:space-y-4 lg:col-span-2 xl:col-span-1 xl:col-start-3 xl:row-start-1">
      <RightSidebar />
    </StickyRail>
  )
}
