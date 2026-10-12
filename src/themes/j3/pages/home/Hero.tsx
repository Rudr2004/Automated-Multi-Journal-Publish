// Home hero after the reference: kicker, journal title, mission, a facts strip, the primary actions and the archive search on the left;
// the journal profile table (from the journal config) and the dark Call for Papers card (from HomeData.callForPapers) on the right.
import { journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { CallForPapers } from '../../../../core/types'
import { HeroSearch } from '../../components/HeroSearch'
import { Book, Submit } from '../../icons'
import { btnOrange, btnPrimary, btnSecondary, labelCls, linkCls, rail } from './bits'

const info = (key: string) => journal.info.find(([k]) => k === key)?.[1]

function Facts() {
  const rows: [string, string][] = [
    ['Frequency', journal.frequency], ['Format', info('Publication Format') ?? 'Online'], ['Licensing', journal.licence.name], ['Language', info('Language') ?? 'English'], ['DOI prefix', journal.doiPrefix],
  ]
  return (
    <dl className="mt-6 grid grid-cols-2 divide-j3paper-rule rounded-tile border border-j3paper-rule bg-j3paper-cool sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-none sm:divide-x">
      {rows.map(([k, v]) => (
        <div key={k} className="px-3 py-2.5 text-center">
          <dt className={`${labelCls} text-[10px] text-mauve-600`}>{k}</dt>
          <dd className="mt-0.5 font-jakarta text-sm font-semibold tabular-nums text-night-900">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

function Profile() {
  const asLink = (v: string) => (v.includes('@') ? <a href={`mailto:${v}`} className="text-iris-700 underline underline-offset-2">{v}</a> : /^[\w.-]+\.[a-z]{2,}$/i.test(v) ? <a href={`https://${v}`} target="_blank" rel="noreferrer" className="text-iris-700 underline underline-offset-2">{v}</a> : v)
  return (
    <section aria-labelledby="home-profile" className={`${rail} p-5`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="home-profile" className="flex items-center gap-2.5 font-jakarta text-[13px] font-bold uppercase tracking-[0.08em] text-iris-700"><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Journal profile &amp; publication metadata</h2>
      </div>
      <table className="w-full border-collapse overflow-hidden rounded-tile border border-j3paper-rule bg-white text-left font-inter text-[13px]">
        <caption className="sr-only">Journal profile and publication metadata</caption>
        <tbody>
          {journal.info.map(([k, v]) => (
            <tr key={k} className="border-b border-j3paper-rule last:border-b-0">
              <th scope="row" className="w-[34%] bg-j3paper-cool px-3 py-2 align-top font-semibold text-night-900">{k}</th>
              <td className="px-3 py-2 align-top text-night-700">{k === 'Email' || k === 'Website' ? asLink(v) : v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

function CallCard({ cfp }: { cfp: CallForPapers }) {
  const cells: [string, string][] = [['Issue closing date', formatDate(cfp.deadline.slice(0, 10))], ['First decision', `About ${cfp.avgReviewDays} days`], ['Target publication', formatDate(cfp.expectedPublication)]]
  return (
    <section aria-labelledby="home-cfp" className="mt-5 rounded-tile bg-night-900 p-5 text-white">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 id="home-cfp" className="flex items-center gap-2.5 font-jakarta text-[13px] font-bold uppercase tracking-[0.08em]"><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Call for papers &mdash; {cfp.issueName}</h2>
        <span className={`${labelCls} rounded-tile bg-ember-500 px-2 py-0.5 text-night-900`}>Active call</span>
      </div>
      <dl className="grid divide-y divide-white/15 border-y border-white/15 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {cells.map(([k, v]) => (
          <div key={k} className="px-3 py-3 text-center">
            <dt className="font-jakarta text-[10px] font-semibold uppercase tracking-[0.06em] text-iris-200">{k}</dt>
            <dd className="mt-1 font-jakarta text-sm font-semibold text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <AppLink to={paths.submit} className={btnOrange}><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript Now</AppLink>
        <AppLink to={paths.policy('author-guidelines')} className="font-inter text-[13px] font-medium text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">Check Author Guidelines &rarr;</AppLink>
      </div>
    </section>
  )
}

export function Hero({ cfp }: { cfp: CallForPapers }) {
  return (
    <section aria-label="About the journal" className="grid gap-8 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-12">
      <div className="min-w-0">
        <p className="flex items-center gap-2.5 font-jakarta text-[12px] font-bold uppercase tracking-[0.08em] text-iris-700"><span aria-hidden="true" className="h-2 w-2 bg-ember-500" />Creative studies &amp; development &bull; Monthly open access journal</p>
        <h1 className="mt-4 font-jakarta text-[2.25rem] font-bold leading-[1.1] tracking-[-0.015em] text-night-900 sm:text-[2.75rem]">{journal.name}</h1>
        <p className="mt-5 max-w-xl font-inter text-[17px] leading-[1.65] text-night-700">{journal.mission}</p>
        <Facts />
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <AppLink to={paths.submit} className={btnPrimary}><Submit className="h-4 w-4" aria-hidden="true" /> Submit Manuscript</AppLink>
          <AppLink to={paths.policy('author-guidelines')} className={btnSecondary}><Book className="h-4 w-4" aria-hidden="true" /> Author Guidelines</AppLink>
          <AppLink to={paths.about('aims-scope')} className={linkCls}>Editorial Scope &rarr;</AppLink>
        </div>
        <div className="mt-6"><HeroSearch /></div>
        <p className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1">
          <AppLink to={paths.search('')} className={`${linkCls} text-xs`}>Advanced search</AppLink>
          <AppLink to={paths.pastIssues} className={`${linkCls} text-xs`}>Browse all issues</AppLink>
        </p>
      </div>
      <div className="min-w-0">
        <Profile />
        <CallCard cfp={cfp} />
      </div>
    </section>
  )
}
