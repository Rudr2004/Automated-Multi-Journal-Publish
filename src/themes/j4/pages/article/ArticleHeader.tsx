// Top of the article card (reference "article detail"): breadcrumb, type / licence chips, subject strip, title, DOI bar, author cards and the action command centre.
import { MdOutlineArticle, MdOutlineCategory, MdOutlineHome, MdOutlineMail, MdOutlineMenuBook, MdOutlineVerified, MdOutlineWorkspacePremium } from 'react-icons/md'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { areaColor } from '../../components/areas'
import { buttonClass } from '../../components/Button'
import { CiteMenu } from '../../components/CiteMenu'
import { Avatar, OrcidBadge } from '../../components/PaperBits'
import { Check, Download, LinkIcon, Quote } from '../../icons'
import { CopyButton, MONO, NAVY, useArticleActions } from './shared'

export function Breadcrumbs({ article }: { article: ArticleFull }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 print:hidden">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 py-1 text-xs font-medium text-steel-600">
        <li><AppLink to={paths.home} className="inline-flex items-center gap-1 hover:text-cobalt-700 hover:underline"><MdOutlineHome className="h-4 w-4" aria-hidden="true" />Home</AppLink></li>
        <li aria-hidden="true">/</li>
        <li><AppLink to={paths.issue(article.volume, article.issue)} className="hover:text-cobalt-700 hover:underline">Volume {String(article.volume).padStart(2, '0')} • Issue {String(article.issue).padStart(2, '0')}</AppLink></li>
        <li aria-hidden="true">/</li>
        <li aria-current="page" className={`min-w-0 max-w-sm truncate font-semibold ${NAVY}`}>{article.title}</li>
      </ol>
    </nav>
  )
}

function Authors({ article }: { article: ArticleFull }) {
  const people = article.authorDetails ?? []
  if (!people.length) return (article.authors ?? []).length ? <p className="text-sm text-steel-700">{article.authors.join(', ')}</p> : null
  return (
    <section id="authors" aria-labelledby="authors-h" className="scroll-mt-32 space-y-4 border-t border-abyss-100 pt-1">
      <div className="flex items-center justify-between gap-2 pt-4">
        <h2 id="authors-h" className={`${MONO} text-xs font-bold uppercase tracking-wider text-steel-600`}>Authors &amp; Affiliations</h2>
        <span className="text-[11px] text-steel-600">{people.length} Contributing {people.length === 1 ? 'Author' : 'Authors'}</span>
      </div>
      <ul className="space-y-3">
        {people.map((a) => (
          <li key={a.name} className="flex flex-col gap-3.5 rounded border border-abyss-200 bg-abyss-50/60 p-3.5 transition-colors hover:border-azure-600 hover:bg-white sm:flex-row sm:items-start">
            {a.photo
              ? <img src={a.photo} alt="" width={64} height={64} loading="lazy" className="h-14 w-14 shrink-0 rounded-full border-2 border-azure-300 object-cover sm:h-16 sm:w-16" />
              : <span className="shrink-0 self-start rounded-full border-2 border-abyss-300 [&>*]:block"><Avatar name={a.name} size={60} /></span>}
            <div className="min-w-0 flex-1 space-y-1 text-xs">
              <p className="flex flex-wrap items-center gap-2">
                <span className="break-words font-serif4 text-sm font-bold text-abyss-900">{a.name}</span>
                {a.corresponding && (a.email
                  ? <a href={`mailto:${a.email}`} aria-label={`Corresponding author: email ${a.name}`} className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900 hover:bg-amber-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600"><MdOutlineMail className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />Corresponding Author</a>
                  : <span className="inline-flex items-center gap-1 rounded border border-amber-300 bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900"><MdOutlineMail className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />Corresponding Author</span>)}
                {!a.corresponding && people.length > 1 && <span className="text-[11px] font-medium text-steel-600">Co-Author</span>}
                {a.orcid && <span className={`inline-flex items-center gap-1 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-800 ${MONO}`}><OrcidBadge id={a.orcid} name={a.name} />ORCID: {a.orcid}</span>}
              </p>
              <ul className="leading-snug text-steel-700">
                {a.affiliations.map((n) => article.affiliations?.[n - 1] && <li key={n} className="break-words">{article.affiliations[n - 1]}</li>)}
              </ul>
              <p className="pt-1 text-[11px]">
                <AppLink to={paths.verify()} className="inline-flex min-h-8 items-center gap-1 font-medium text-steel-700 hover:text-cobalt-700 hover:underline"><MdOutlineWorkspacePremium className="h-4 w-4 text-azure-600" aria-hidden="true" />Verify author certificate</AppLink>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function ArticleHeader({ article, onReadFull }: { article: ArticleFull; onReadFull?: () => void }) {
  const { download, share, linkCopied } = useArticleActions(article)
  const doi = doiFor(article.paperId)
  const published = article.publishedOnline || article.publishedAt
  return (
    <div className="space-y-6">
      <div className="space-y-3 border-b border-abyss-100 pb-5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded bg-cobalt-700 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white"><MdOutlineArticle className="h-3.5 w-3.5" aria-hidden="true" />{article.type}</span>
          <span className="inline-flex items-center gap-1.5 rounded border border-azure-200 bg-azure-50 px-2.5 py-1 text-[11px] font-medium text-cobalt-700"><MdOutlineVerified className="h-3.5 w-3.5 text-emerald-700" aria-hidden="true" />Peer-Reviewed • Open Access</span>
          <a href={journal.licence.url} target="_blank" rel="noreferrer" className={`inline-flex items-center rounded border border-abyss-200 bg-abyss-100 px-2 py-1 text-[11px] text-abyss-700 hover:text-cobalt-700 ${MONO}`}>{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        {article.subject && (
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-azure-200 bg-azure-50 p-2.5 text-xs text-abyss-900">
            <span className={`inline-flex items-center gap-1 rounded bg-cobalt-700 px-2 py-0.5 text-[11px] font-bold uppercase text-white ${MONO}`}><MdOutlineCategory className="h-3.5 w-3.5" aria-hidden="true" />Subject</span>
            <AppLink to={paths.search(article.subject)} className={`inline-flex items-center gap-1.5 text-xs font-semibold text-cobalt-800 hover:underline ${MONO}`}>
              <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: areaColor(article.subject) }} />{article.subject}
            </AppLink>
          </div>
        )}
        {published && <p className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-[11px]"><span className="font-semibold text-emerald-800"><strong>Published Online:</strong> {formatDate(published)}</span></p>}
      </div>

      <h1 className={`break-words font-serif4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl ${NAVY} [overflow-wrap:anywhere]`}>{article.title}</h1>

      <div className="flex flex-col justify-between gap-3 rounded-xl border-2 border-azure-600 bg-gradient-to-r from-azure-50 via-white to-azure-50/50 p-3.5 text-xs shadow-hair sm:flex-row sm:items-center sm:p-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`inline-flex shrink-0 items-center gap-1 rounded bg-cobalt-700 px-2.5 py-1 text-xs font-bold text-white ${MONO}`}><MdOutlineVerified className="h-3.5 w-3.5" aria-hidden="true" />DOI</span>
          <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className={`min-w-0 break-all py-1 text-xs font-bold hover:text-cobalt-700 hover:underline sm:text-sm ${NAVY} ${MONO}`}>https://doi.org/{doi}<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <CopyButton text={`https://doi.org/${doi}`} label={`Copy DOI link ${doi}`} what="DOI" className="rounded-md border border-abyss-300 bg-white !text-xs text-abyss-800 hover:bg-abyss-50 [&>svg]:text-azure-600">Copy DOI</CopyButton>
          <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className={buttonClass('cta', 'min-h-11 !rounded-md !px-3.5 !py-0 !text-xs sm:min-h-9')}><MdOutlineVerified className="h-4 w-4" aria-hidden="true" />Verify DOI (Crossref)<span className="sr-only"> (opens in a new tab)</span></a>
        </div>
      </div>

      <Authors article={article} />

      <div className="space-y-3.5 rounded-xl border border-abyss-200 bg-abyss-50 p-4 print:hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {onReadFull && <button type="button" onClick={onReadFull} className={buttonClass('cta', 'min-h-11 !rounded-md !px-3.5 !text-xs sm:min-h-10')}><MdOutlineMenuBook className="h-[18px] w-[18px]" aria-hidden="true" />Read Full Article</button>}
            <button type="button" onClick={download} className={buttonClass('outline', 'min-h-11 !rounded-md !px-3.5 !text-xs sm:min-h-10')}><Download className="h-[18px] w-[18px] text-red-700" aria-hidden="true" />Download PDF</button>
            <CiteMenu article={article} className={buttonClass('outline', 'min-h-11 !rounded-md !px-3.5 !text-xs !font-medium sm:min-h-10')}><Quote className="h-[18px] w-[18px] text-azure-700" aria-hidden="true" />Cite This Article</CiteMenu>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => void share()} className={buttonClass('outline', 'min-h-11 !px-2.5 !text-xs !font-medium sm:min-h-9')}>
              {linkCopied ? <Check className="h-4 w-4" aria-hidden="true" /> : <LinkIcon className="h-4 w-4 text-azure-700" aria-hidden="true" />}Copy Link
            </button>
            <a href={`mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(`https://doi.org/${doi}`)}`} aria-label="Share by email" title="Share by email" className="inline-flex h-11 w-11 items-center justify-center rounded border border-abyss-200 bg-white text-steel-700 hover:border-azure-600 hover:text-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 sm:h-9 sm:w-9"><MdOutlineMail className="h-[18px] w-[18px]" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </div>
  )
}
