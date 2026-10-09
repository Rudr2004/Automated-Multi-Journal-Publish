// Right-hand column of the home page: call for papers, journal information, a pull quote from the issue, collections and author resources.
import { doiFor, journal, visibleLogos } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, CallForPapers, Testimonial } from '../../../../core/types'
import { themes } from '../../components/themes'
import { ArrowRight, Check, Download, Quote, Review, Shield, Submit, Verified } from '../../icons'
import { btn, labelCls, panel } from './bits'

const h = 'font-jakarta text-lg font-semibold text-iris-700'

function CallForPapersCard({ cfp }: { cfp: CallForPapers }) {
  const rows: [string, string][] = [
    ['Submission deadline', formatDate(cfp.deadline.slice(0, 10))],
    ['Target publication', formatDate(cfp.expectedPublication)],
    ['First decision', `about ${cfp.avgReviewDays} days`],
  ]
  return (
    <section aria-labelledby="home-cfp" className="bg-iris-50 p-4">
      <p className="mb-2 flex items-center gap-2"><span className={`${labelCls} bg-ember-700 px-2 py-0.5 tracking-wider text-white`}>Call for papers</span></p>
      <h2 id="home-cfp" className={h}>{cfp.issueName}</h2>
      <p className="mt-2 font-inter text-sm leading-relaxed text-mauve-600">We welcome research articles, reviews and short communications on design, the arts, media, culture and development.</p>
      <dl className="my-3 bg-white p-2 font-inter text-xs">
        {rows.map(([k, v]) => <div key={k} className="flex justify-between gap-3 py-0.5"><dt className="text-mauve-600">{k}:</dt><dd className="text-right font-semibold text-iris-700">{v}</dd></div>)}
      </dl>
      <AppLink to={paths.submit} className={`${btn} w-full bg-iris-700 py-2.5 text-white hover:bg-iris-600`}><Submit className="h-4 w-4" aria-hidden="true" /> Submit manuscript</AppLink>
    </section>
  )
}

function JournalInfo() {
  const rows: [string, string][] = [['E-ISSN', journal.issnOnline], ['Frequency', journal.frequency], ['Licence', journal.licence.name], ['DOI prefix', journal.doiPrefix], ['Publisher', journal.publisher]]
  const logos = visibleLogos()
  return (
    <section aria-labelledby="home-info" className={`${panel} p-4`}>
      <h2 id="home-info" className={`${h} mb-3`}>Journal information</h2>
      <dl className="mb-4 grid grid-cols-2 gap-2 font-inter text-sm">
        {rows.map(([k, v]) => <div key={k} className={`bg-iris-50 p-2 ${k === "Publisher" ? "col-span-2" : ""}`}><dt className={`${labelCls} text-mauve-600`}>{k}</dt><dd className="font-semibold text-iris-700">{v}</dd></div>)}
      </dl>
      {logos.length > 0 && (
        <>
          <p className={`${labelCls} mb-2 tracking-[0.08em] text-mauve-600`}>Identified and discoverable through:</p>
          <ul className="grid grid-cols-2 gap-1.5 font-inter text-xs text-night-700">
            {logos.map((l) => <li key={l.id} className="flex items-center gap-1.5 bg-iris-50 px-2 py-1"><Check className="h-3.5 w-3.5 shrink-0 text-j3valid-700" aria-hidden="true" /> {l.name}</li>)}
          </ul>
        </>
      )}
    </section>
  )
}

function FromTheIssue({ quote, article }: { quote: Testimonial; article?: ArticleSummary }) {
  return (
    <section aria-label="From the issue" className={`${panel} p-4`}>
      <div className="mb-3 flex items-center gap-3">
        {quote.photo && <img src={quote.photo} alt="" width={56} height={56} className="h-14 w-14 object-cover" />}
        <div className="min-w-0">
          <p className="font-jakarta text-base font-semibold leading-tight text-iris-700">{quote.name}</p>
          <p className="font-inter text-xs text-mauve-600">{quote.institution}</p>
        </div>
      </div>
      <Quote className="h-6 w-6 text-ember-700" aria-hidden="true" />
      <blockquote className="mt-1 font-jakarta text-base italic leading-relaxed text-night-700">{quote.quote}</blockquote>
      {article && (
        <p className="mt-3 border-t border-mauve-100 pt-2 font-inter text-xs text-mauve-600">
          From <AppLink to={paths.article(article.paperId)} className="font-semibold text-iris-700 underline hover:text-ember-700">{article.title}</AppLink> <span className="break-all">({doiFor(article.paperId)})</span>
        </p>
      )}
    </section>
  )
}

function Collections() {
  if (!themes.length) return null
  return (
    <section aria-labelledby="home-collections" className={`${panel} p-4`}>
      <h2 id="home-collections" className={`${h} mb-2`}>Browse by collection</h2>
      <ul className="divide-y divide-mauve-100">
        {themes.map((t) => (
          <li key={t.id}>
            <AppLink to={paths.search(t.name)} className="group flex items-center justify-between gap-3 py-2 font-inter text-sm text-night-700 hover:text-ember-700">
              <span className="flex items-center gap-2"><span aria-hidden="true" className="h-2.5 w-2.5 shrink-0" style={{ backgroundColor: t.color }} />{t.name}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-mauve-400 group-hover:text-ember-700" aria-hidden="true" />
            </AppLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Toolkit() {
  const items: [string, string, string, typeof Download][] = [
    ['Author guidelines', 'Read', paths.policy('author-guidelines'), Review],
    ['Article templates', 'Download', paths.forAuthors('templates'), Download],
    ['APC & payment', 'Details', paths.forAuthors('apc-payment'), Shield],
    ['Peer review policy', 'Policy', paths.policy('peer-review'), Verified],
    ['Verify an author certificate', 'Verify', paths.verify(), Verified],
  ]
  return (
    <section aria-labelledby="home-toolkit" className="flex flex-col gap-2 bg-iris-50 p-4">
      <h2 id="home-toolkit" className={h}>Author resources &amp; policies</h2>
      <ul className="flex flex-col gap-2 font-inter text-sm text-mauve-700">
        {items.map(([label, cta, to, Icon]) => (
          <li key={label} className="flex items-center justify-between gap-3 bg-white p-2">
            <span className="flex items-center gap-2"><Icon className="h-[18px] w-[18px] shrink-0 text-iris-700" aria-hidden="true" /> {label}</span>
            <AppLink to={to} className={`${labelCls} text-iris-700 underline hover:text-ember-700`}>{cta}</AppLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Sidebar({ cfp, quote, quoted }: { cfp: CallForPapers; quote?: Testimonial; quoted?: ArticleSummary }) {
  return (
    <aside aria-label="Journal desk" className="flex min-w-0 flex-col gap-5 lg:col-span-4">
      <CallForPapersCard cfp={cfp} />
      <JournalInfo />
      {quote && <FromTheIssue quote={quote} article={quoted} />}
      <Collections />
      <Toolkit />
    </aside>
  )
}
