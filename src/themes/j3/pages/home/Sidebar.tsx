// Left rail of the home page after the reference: announcements (journal notices), the awards card (HomeData.awards, shown only when there are awards),
// browse by subject, journal metrics, essential author assets and the Crossref registry note.
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary, HomeData } from '../../../../core/types'
import { CountUp } from '../../components/CountUp'
import { Award, Download } from '../../icons'
import { labelCls, linkCls, panel, rail } from './bits'

const heading = 'flex items-center gap-2.5 font-jakarta text-[13px] font-bold uppercase tracking-[0.06em] text-night-900'
const Sq = () => <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-ember-500" />

function Announcements({ notices }: { notices: HomeData['notices'] }) {
  if (!notices.length) return null
  return (
    <section aria-labelledby="home-ann" className={`${panel} overflow-hidden`}>
      <h2 id="home-ann" className="bg-night-900 px-4 py-3 text-center font-jakarta text-sm font-bold text-white">Announcements</h2>
      <ul className="divide-y divide-j3paper-rule">
        {notices.map((n) => (
          <li key={n.date + n.text} className="p-4">
            <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.06em] text-iris-700"><time dateTime={n.date}>{formatDate(n.date)}</time></p>
            <p className="mt-1 font-inter text-[13px] leading-relaxed text-night-700">{n.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Awards({ awards, pool }: { awards: HomeData['awards']; pool: ArticleSummary[] }) {
  return (
    <>
      {awards.map((a) => {
        const article = pool.find((p) => p.title === a.title)
        return (
          <section key={a.kind + a.title} aria-label={a.kind} className={`${panel} overflow-hidden`}>
            <div className="flex items-center justify-between gap-3 bg-night-900 px-4 py-3 text-white">
              <h2 className="flex items-center gap-2.5 font-jakarta text-[13px] font-bold uppercase tracking-[0.06em]"><Sq />{a.kind}</h2>
              <span className={`${labelCls} rounded-tile bg-ember-500 px-2 py-0.5 text-night-900`}>{a.period}</span>
            </div>
            <div className="p-4">
              <p className="flex items-center gap-1.5 font-jakarta text-[11px] font-bold uppercase tracking-[0.06em] text-iris-700"><Award className="h-4 w-4" aria-hidden="true" />Laureate recognition</p>
              <h3 className="mt-2 font-jakarta text-[15px] font-semibold leading-snug text-night-900">&ldquo;{article ? <AppLink to={paths.article(article.paperId)} className="hover:text-iris-700 hover:underline">{a.title}</AppLink> : a.title}&rdquo;</h3>
              <p className="mt-1.5 font-inter text-[13px] text-night-700">{a.recipient}</p>
              <p className="mt-2 font-inter text-xs leading-relaxed text-mauve-600">{a.reason}</p>
              {article && (
                <p className="mt-3 border-t border-j3paper-rule pt-3">
                  <span className="mb-2 block break-all font-inter text-[11px] tabular-nums text-mauve-600">DOI: {doiFor(article.paperId)}</span>
                  <AppLink to={paths.article(article.paperId)} className={linkCls}>Read the paper &rarr;</AppLink>
                </p>
              )}
            </div>
          </section>
        )
      })}
    </>
  )
}

function Subjects() {
  return (
    <section aria-labelledby="home-subjects" className={`${panel} p-4`}>
      <div className="mb-3 flex items-baseline justify-between gap-2 border-b border-j3paper-rule pb-3">
        <h2 id="home-subjects" className={heading}><Sq />Browse by subject</h2>
        <span className="font-inter text-[11px] uppercase text-mauve-600">Collections</span>
      </div>
      <ul className="flex flex-wrap gap-2">
        {journal.subjects.map((s) => (
          <li key={s}><AppLink to={paths.search(s)} className="inline-block rounded-tile border border-j3paper-rule bg-j3paper-cool px-2.5 py-1.5 font-inter text-xs font-medium text-iris-800 transition-colors hover:border-iris-700 hover:bg-j3paper-deep">{s}</AppLink></li>
        ))}
      </ul>
    </section>
  )
}

function Metrics({ days }: { days: number }) {
  const rows: [string, React.ReactNode][] = [
    ['E-ISSN', <span className="tabular-nums">{journal.issnOnline}</span>],
    ['DOI prefix', <span className="tabular-nums text-iris-700">{journal.doiPrefix}</span>],
    ['Frequency', journal.frequency],
    ['First decision (target)', <span className="tabular-nums"><CountUp value={`~${days} days`} /></span>],
    ['Licence', journal.licence.name],
    ...(journal.badges.peerReviewed ? [['Peer review', 'Expert-reviewed'] as [string, React.ReactNode]] : []),
  ]
  return (
    <section aria-labelledby="home-metrics" className={`${panel} p-4`}>
      <h2 id="home-metrics" className={`${heading} mb-3 border-b border-j3paper-rule pb-3`}><Sq />Journal facts</h2>
      <dl className="font-inter text-[13px]">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-baseline justify-between gap-4 border-b border-j3paper-rule py-2 last:border-b-0">
            <dt className="text-mauve-600">{k}</dt>
            <dd className="text-right font-semibold text-night-900">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Assets() {
  const rows: [string, string, string][] = [
    ['Article templates', 'DOCX', paths.forAuthors('templates')],
    ['Author guidelines', 'Guide', paths.policy('author-guidelines')],
    ['Peer review process', 'Policy', paths.policy('peer-review')],
    ['APC & payment', 'Charges', paths.forAuthors('apc-payment')],
    ['Plagiarism policy', 'Policy', paths.policy('plagiarism')],
    ['Verify an author certificate', 'Verify', paths.verify()],
  ]
  return (
    <section aria-labelledby="home-assets" className={`${panel} p-4`}>
      <h2 id="home-assets" className={`${heading} mb-2 border-b border-j3paper-rule pb-3`}>Essential author assets</h2>
      <ul>
        {rows.map(([l, meta, to]) => (
          <li key={l}><AppLink to={to} className="flex items-baseline justify-between gap-3 border-b border-j3paper-rule py-2 font-inter text-[13px] text-night-700 last:border-b-0 hover:text-iris-700"><span className="flex items-center gap-2"><Download className="h-4 w-4 shrink-0 text-iris-700" aria-hidden="true" />{l}</span><span className="text-[11px] uppercase text-mauve-600">{meta}</span></AppLink></li>
        ))}
      </ul>
    </section>
  )
}

function Registry() {
  return (
    <section aria-label="Crossref registry" className={`${rail} flex items-center gap-4 p-4`}>
      <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-tile bg-night-900 font-jakarta text-sm font-bold text-white">DOI</span>
      <div className="min-w-0">
        <p className="font-jakarta text-sm font-bold text-night-900">Crossref DOI registration</p>
        <p className="font-inter text-xs tabular-nums text-night-700">Prefix: {journal.doiPrefix}</p>
        <p className="font-inter text-xs text-mauve-600">A permanent DOI for every article</p>
      </div>
    </section>
  )
}

export function Sidebar({ data, pool }: { data: HomeData; pool: ArticleSummary[] }) {
  return (
    <aside aria-label="Journal desk" className="flex min-w-0 flex-col gap-5">
      <Announcements notices={data.notices} />
      <Awards awards={data.awards} pool={pool} />
      <Subjects />
      <Metrics days={data.callForPapers.avgReviewDays} />
      <Assets />
      <Registry />
    </aside>
  )
}
