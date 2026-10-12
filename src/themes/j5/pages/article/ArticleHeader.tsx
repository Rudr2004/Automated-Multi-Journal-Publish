// Wine header band of the article page (replica of the client's article view): breadcrumb, type / area / access chips, title,
// author pills with affiliations, action buttons, the DOI + metadata grid and the stats strip.
import { useMemo } from 'react'
import { MdOutlineVisibility as Eye } from 'react-icons/md'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { CiteMenu } from '../../components/CiteMenu'
import { areaColor } from '../../components/areas'
import { Award, Check, Download, Email, LinkIcon, OpenAccess, Quote, Verified } from '../../icons'
import { CopyButton, num, useArticleActions } from './shared'

const OrcidMark = () => <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#A6CE39] text-[8px] font-bold leading-none text-obsidian-900">iD</span>
const DT = 'block text-[10px] font-semibold uppercase tracking-wider text-bordeaux-200'
const GHOST = 'inline-flex min-h-11 items-center gap-1.5 rounded bg-white/15 px-3 py-1.5 font-work text-xs font-semibold text-white transition-colors hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-300 motion-reduce:transition-none sm:min-h-9'

function Authors({ article }: { article: ArticleFull }) {
  const people = article.authorDetails ?? []
  // Affiliations numbered in order of first use so the superscripts always match the list.
  const order = useMemo(() => {
    const o: number[] = []
    people.forEach((a) => a.affiliations.forEach((n) => { if (article.affiliations?.[n - 1] && !o.includes(n)) o.push(n) }))
    return o
  }, [people, article.affiliations])
  if (!people.length) return <p className="text-sm text-bordeaux-100">{(article.authors ?? []).join(', ')}</p>
  return (
    <div className="space-y-1.5">
      <ul className="flex flex-wrap items-center gap-2 text-sm text-white" aria-label="Authors">
        {people.map((a) => {
          const marks = [...new Set(a.affiliations.map((n) => order.indexOf(n) + 1).filter((n) => n > 0))].sort((x, y) => x - y)
          return (
            <li key={a.name} className="inline-flex items-center gap-1.5 break-words rounded bg-white/10 px-2 py-0.5 transition-colors hover:bg-white/15">
              <span className="font-semibold text-white">{a.name}</span>
              {marks.length > 0 && <sup className="font-bold text-amber-200">{marks.join(',')}</sup>}
              {a.corresponding && (a.email
                ? <a href={`mailto:${a.email}`} aria-label={`Corresponding author: email ${a.name}`} title="Corresponding author" className="inline-flex rounded text-amber-300 hover:text-white"><Email className="h-[13px] w-[13px]" aria-hidden="true" /></a>
                : <Email className="h-[13px] w-[13px] text-amber-300" role="img" aria-label="Corresponding author" />)}
              {a.orcid && <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD of ${a.name} (opens in a new tab)`} title="ORCID iD" className="inline-flex"><OrcidMark /></a>}
            </li>
          )
        })}
      </ul>
      {order.length > 0 && (
        <ol className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-bordeaux-100" aria-label="Affiliations">
          {order.map((n, i) => (
            <li key={n} className="flex items-center gap-1 break-words"><span className="font-bold text-amber-200">[{i + 1}]</span> {article.affiliations[n - 1]}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

export function ArticleHeader({ article }: { article: ArticleFull }) {
  const { download, share, linkCopied } = useArticleActions(article)
  const doi = doiFor(article.paperId)
  const published = article.publishedOnline || article.publishedAt
  return (
    <section className="w-full rounded-b bg-wine-900 px-4 py-5 text-white shadow-md sm:px-6 lg:px-8 print:bg-white print:text-black print:shadow-none">
      <div className="mx-auto max-w-7xl space-y-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2 font-work text-xs text-bordeaux-100">
            <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li>
            <li aria-hidden="true" className="text-bordeaux-200">/</li>
            <li><AppLink to={paths.issue(article.volume, article.issue)} className="hover:text-white hover:underline">Vol. {article.volume}, No. {article.issue}</AppLink></li>
            <li aria-hidden="true" className="text-bordeaux-200">/</li>
            <li aria-current="page" className="font-medium text-white">Article</li>
          </ol>
        </nav>
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <span className="rounded bg-wine-800 px-2.5 py-0.5 font-work text-[11px] font-semibold uppercase tracking-wider text-white">{article.type}</span>
          {article.subject && (
            <AppLink to={paths.search(article.subject)} className="inline-flex items-center gap-1.5 rounded bg-[#6b1e2f]/80 px-2.5 py-0.5 font-work text-[11px] tracking-wide text-white hover:bg-[#6b1e2f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-300">
              <span aria-hidden="true" className="h-2 w-2 rounded-full" style={{ background: areaColor(article.subject) }} />{article.subject}
            </AppLink>
          )}
          <span className="inline-flex items-center gap-1.5 rounded bg-white/15 px-2.5 py-0.5 font-work text-[11px] text-white"><OpenAccess className="h-[13px] w-[13px] text-amber-300" aria-hidden="true" />Open access</span>
        </div>
        <h1 className="max-w-5xl break-words font-newsreader text-xl font-bold leading-snug tracking-tight text-white [overflow-wrap:anywhere] sm:text-2xl lg:text-3xl">{article.title}</h1>
        <Authors article={article} />

        <div className="flex flex-wrap items-center gap-2.5 pt-0.5 print:hidden">
          <button type="button" onClick={download} className="inline-flex min-h-11 items-center gap-1.5 rounded bg-white px-3 py-1.5 font-work text-xs font-bold text-wine-800 shadow transition-colors hover:bg-wine-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-300 motion-reduce:transition-none sm:min-h-9"><Download className="h-[15px] w-[15px]" aria-hidden="true" />Download PDF</button>
          <CiteMenu article={article} className={GHOST}><Quote className="h-[15px] w-[15px]" aria-hidden="true" />Cite</CiteMenu>
          <button type="button" onClick={() => void share()} className={GHOST}>
            {linkCopied ? <Check className="h-[15px] w-[15px]" aria-hidden="true" /> : <LinkIcon className="h-[15px] w-[15px]" aria-hidden="true" />}Share
          </button>
          <a href="#authors-section" className="inline-flex min-h-11 items-center gap-1.5 rounded bg-amber-400 px-3 py-1.5 font-work text-xs font-bold text-stone-950 shadow-sm transition-colors hover:bg-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none sm:min-h-9"><Award className="h-[15px] w-[15px]" aria-hidden="true" />Author Certificates</a>
        </div>

        <div className="space-y-2 rounded bg-[#6b1e2f]/70 p-2.5 text-white shadow-sm">
          <dl className="grid grid-cols-2 gap-2.5 font-work text-[11px] sm:grid-cols-3 lg:grid-cols-7">
            <div className="col-span-2 min-w-0 sm:col-span-3 lg:col-span-2">
              <dt className={DT}>DOI</dt>
              <dd className="flex flex-wrap items-center gap-1 font-medium">
                <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="min-w-0 break-all text-amber-200 underline">{doi}<span className="sr-only"> (opens in a new tab)</span></a>
                <CopyButton text={doi} label={`Copy DOI ${doi}`} what="DOI" className="!min-h-8 !min-w-8 !px-1 text-white hover:text-amber-300" />
                <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" title="Resolve this DOI" className="ml-1 inline-flex shrink-0 items-center gap-0.5 rounded border border-emerald-300 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800 transition-colors hover:bg-emerald-100 motion-reduce:transition-none"><Verified className="h-[11px] w-[11px] text-emerald-700" aria-hidden="true" />Verify DOI<span className="sr-only"> (opens in a new tab)</span></a>
              </dd>
            </div>
            <div><dt className={DT}>Published</dt><dd className="font-medium tabular-nums text-white">{published ? formatDate(published) : '—'}</dd></div>
            <div><dt className={DT}>Volume / issue</dt><dd className="font-medium text-white">Vol. {article.volume}, No. {article.issue}</dd></div>
            <div><dt className={DT}>Pages</dt><dd className="font-medium tabular-nums text-white">{article.pages || '—'}</dd></div>
            <div><dt className={DT}>Licence</dt><dd className="font-medium text-white"><a href={journal.licence.url} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-2 hover:decoration-white">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>
            <div className="min-w-0"><dt className={DT}>Paper ID</dt><dd className="break-all font-medium text-white">{article.paperId}</dd></div>
          </dl>
          <ul aria-label="Article metrics" className="-mx-2.5 -mb-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-b bg-wine-800/40 px-3 py-1.5 font-work text-xs text-bordeaux-100">
            {([['Views', article.views, Eye], ['Downloads', article.downloads, Download], ['Citations', article.citations, Quote]] as const).map(([label, value, Icon]) => (
              <li key={label} className="flex items-center gap-1.5"><Icon className="h-[14px] w-[14px] text-amber-300" aria-hidden="true" /><strong className="tabular-nums text-white">{num(value)}</strong> {label}</li>
            ))}
            <li className="flex items-center gap-1.5"><Verified className="h-[14px] w-[14px] text-emerald-400" aria-hidden="true" /><AppLink to={paths.verify()} className="hover:text-white hover:underline">Author certificates verifiable</AppLink></li>
          </ul>
        </div>
      </div>
    </section>
  )
}
