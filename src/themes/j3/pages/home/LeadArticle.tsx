// "Lead" block: the featured article (authors, affiliations, abstract, DOI and actions) beside the Editor's Choice sidebar.
// The summary renders at once; affiliations, ORCID marks and keywords arrive when the full article has loaded.
import { api } from '../../../../core/api'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import { formatDate } from '../../../../core/lib/format'
import { useAsync } from '../../../../core/lib/useAsync'
import { AppLink } from '../../../../core/router'
import type { ArticleSummary } from '../../../../core/types'
import { CiteMenu } from '../../components/CiteMenu'
import { cx } from '../../components/primitives'
import { useToast } from '../../components/Toast'
import { Book, Download, Eye, Quote, Verified } from '../../icons'
import { Chip, labelCls, OrcidMark, panel, SectionHead } from './bits'

const names = (a: ArticleSummary) => `${a.authors.slice(0, 2).join(', ')}${a.authors.length > 2 ? ' et al.' : ''}`
const action = 'inline-flex h-9 items-center justify-center gap-1.5 px-3 font-inter text-xs font-semibold uppercase tracking-[0.06em] transition-colors'

function Lead({ story }: { story: ArticleSummary }) {
  const toast = useToast()
  const full = useAsync(() => api.getArticle(story.paperId), [story.paperId]).data ?? null
  const details = full?.authorDetails
  const correspondence = details?.find((d) => d.corresponding)
  const year = story.publishedAt.slice(0, 4)
  const download = () => { downloadArticlePdf(story); toast(`${story.paperId}.pdf downloaded`) }
  return (
    <article className={cx(panel, 'flex min-w-0 flex-col justify-between p-5 sm:p-8 lg:col-span-8')}>
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className={`${labelCls} bg-iris-700 px-2.5 py-0.5 tracking-wider text-white`}>Featured article</span>
          {journal.badges.openAccess && <span className={`${labelCls} inline-flex items-center bg-j3valid-700 px-2 py-0.5 tracking-wider text-white`}>{journal.licence.name} Open Access</span>}
          <span className="font-inter text-xs text-mauve-600">Published online: {formatDate(story.publishedAt)}</span>
        </div>
        <h1 className="font-jakarta text-[1.75rem] font-semibold leading-tight tracking-[-0.01em] text-iris-700 sm:text-[2.125rem] sm:leading-[1.2]">
          <AppLink to={paths.article(story.paperId)} className="hover:text-iris-600">{story.title}</AppLink>
        </h1>

        <p className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-jakarta text-base font-semibold text-iris-700">
          {details
            ? details.map((d, i) => (
              <span key={d.name} className="inline-flex items-center gap-1">
                <span>{d.name}</span>
                {d.orcid && <OrcidMark orcid={d.orcid} name={d.name} />}
                <sup className="font-inter text-xs font-normal text-mauve-600">{[...d.affiliations, ...(d.corresponding ? ['*'] : [])].join(',')}</sup>
                {i < details.length - 1 && <span aria-hidden="true" className="font-normal">{i === details.length - 2 ? ' &' : ','}</span>}
              </span>
            ))
            : story.authors.map((n, i) => <span key={n}>{n}{i < story.authors.length - 1 ? ',' : ''}</span>)}
        </p>

        {full && full.affiliations.length > 0 && (
          <div className="mt-4 flex flex-col gap-0.5 bg-iris-50 p-3 font-inter text-xs text-mauve-600">
            {full.affiliations.map((a, i) => <p key={a}><span className="font-bold text-mauve-700">{i + 1}</span> {a}</p>)}
            {correspondence?.email && <p><span className="font-bold text-mauve-700">*</span> Correspondence: <a href={`mailto:${correspondence.email}`} className="text-iris-700 underline">{correspondence.email}</a></p>}
          </div>
        )}

        <p className="mt-5 font-jakarta text-[1.0625rem] leading-[1.65] text-night-700">{story.abstract}</p>
        {full && full.keywords.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Keywords">
            {full.keywords.map((k) => <li key={k} className="bg-iris-100 px-2 py-0.5 font-inter text-xs text-iris-700">{k}</li>)}
          </ul>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 bg-iris-50 p-3">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-inter text-xs text-mauve-600">
          <span className="font-semibold text-iris-700">DOI: <a href={`https://doi.org/${doiFor(story.paperId)}`} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ember-700">{doiFor(story.paperId)}</a></span>
          <span aria-hidden="true" className="text-mauve-300">·</span>
          <span>Cite as: <em className="font-jakarta">{journal.shortName}</em> {year};{story.volume}({story.issue}):{story.pages}</span>
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={download} className={`${action} bg-iris-700 text-white hover:bg-iris-600`}><Download className="h-4 w-4" aria-hidden="true" /> PDF</button>
          <AppLink to={paths.article(story.paperId)} className={`${action} bg-iris-100 text-iris-700 hover:bg-iris-200`}><Book className="h-4 w-4" aria-hidden="true" /> Full text</AppLink>
          {full
            ? <CiteMenu article={full} className={`${action} bg-iris-100 text-iris-700 hover:bg-iris-200`}><Quote className="h-4 w-4" aria-hidden="true" />Cite article</CiteMenu>
            : <button type="button" disabled className={`${action} bg-iris-100 text-iris-700 opacity-60`}><Quote className="h-4 w-4" aria-hidden="true" />Cite article</button>}
        </div>
      </div>
    </article>
  )
}

function Choice({ articles }: { articles: ArticleSummary[] }) {
  return (
    <aside aria-label="Editor's Choice" className="flex min-w-0 flex-col gap-4 lg:col-span-4">
      <div className="bg-iris-700 p-4 text-white">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-jakarta text-lg font-semibold text-iris-100">Editor’s Choice</h2>
          <Verified className="h-5 w-5 text-ember-500" aria-hidden="true" />
        </div>
        <p className="font-inter text-sm leading-relaxed text-iris-200">Articles selected by the editorial board as particularly useful reading from recent issues.</p>
      </div>
      {articles.map((a, i) => (
        <div key={a.paperId} className={cx(panel, 'flex flex-col justify-between p-4')}>
          <div>
            <div className="mb-1.5"><Chip tone={i}>{a.subject}</Chip></div>
            <h3 className="font-jakarta text-lg font-semibold leading-snug text-iris-700"><AppLink to={paths.article(a.paperId)} className="hover:text-ember-700">{a.title}</AppLink></h3>
            <p className="mt-1 font-inter text-xs text-mauve-600">{names(a)} · <span className="break-all">DOI: {doiFor(a.paperId)}</span></p>
          </div>
          <p className="mt-3 flex items-center justify-between font-inter text-xs text-mauve-600">
            <span>{a.type}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-iris-700" title="Views"><Eye className="h-4 w-4" aria-hidden="true" />{a.views.toLocaleString('en-US')}<span className="sr-only"> views</span></span>
          </p>
        </div>
      ))}
    </aside>
  )
}

export function LeadSection({ story, choices, volume }: { story: ArticleSummary; choices: ArticleSummary[]; volume: number }) {
  return (
    <section aria-label="Lead article" className="mt-10">
      <SectionHead title="Lead Article" kicker={`· Volume ${volume} · ${story.paperId}`} aside={journal.badges.peerReviewed ? <span className={`${labelCls} inline-flex items-center gap-1 bg-j3valid-100 px-2.5 py-0.5 tracking-wider text-j3valid-800`}><Verified className="h-3.5 w-3.5" aria-hidden="true" /> Peer reviewed</span> : undefined} />
      <div className="grid gap-5 lg:grid-cols-12">
        <Lead story={story} />
        <Choice articles={choices} />
      </div>
    </section>
  )
}
