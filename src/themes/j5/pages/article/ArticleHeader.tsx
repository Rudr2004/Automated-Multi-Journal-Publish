// Bordeaux header band: type and area chips, title, authors with affiliations, the metadata strip and the primary actions.
import { useMemo, type ReactNode } from 'react'
import { MdOutlineVisibility as Eye } from 'react-icons/md'
import { doiFor, journal } from '../../../../config/journals'
import { paths } from '../../../../config/routes'
import { formatDate } from '../../../../core/lib/format'
import { AppLink } from '../../../../core/router'
import type { ArticleFull } from '../../../../core/types'
import { AuthorAvatarJ5 } from '../../components/AuthorChipJ5'
import { buttonClass } from '../../components/Button'
import { CiteMenu } from '../../components/CiteMenu'
import { AreaChip, Dateline, DoubleRule } from '../../components/PageBand'
import { Container } from '../../components/primitives'
import { OrnamentRule } from '../../components/signature'
import { Check, Download, Email, LinkIcon, OpenAccess, Quote } from '../../icons'
import { CopyButton, num, useArticleActions } from './shared'

const OrcidMark = () => <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#A6CE39] text-[8px] font-bold leading-none text-obsidian-900">iD</span>
const DT = 'text-xs font-semibold uppercase tracking-[0.08em] text-bordeaux-200'

function Authors({ article }: { article: ArticleFull }) {
  const people = article.authorDetails ?? []
  // Affiliations numbered in order of first use so the superscripts always match the list.
  const order = useMemo(() => {
    const o: number[] = []
    people.forEach((a) => a.affiliations.forEach((n) => { if (article.affiliations?.[n - 1] && !o.includes(n)) o.push(n) }))
    return o
  }, [people, article.affiliations])
  if (!people.length) return <p className="mt-4 text-base text-bordeaux-200">{(article.authors ?? []).join(', ')}</p>
  return (
    <>
      <ul className="mt-5 flex flex-wrap gap-2.5 text-base text-white" aria-label="Authors">
        {people.map((a) => {
          const marks = [...new Set(a.affiliations.map((n) => order.indexOf(n) + 1).filter((n) => n > 0))].sort((x, y) => x - y)
          return (
            <li key={a.name} className="inline-flex items-center gap-2 break-words rounded border border-white/15 bg-white/5 py-1.5 pl-1.5 pr-3 font-medium">
              <AuthorAvatarJ5 name={a.name} className="h-8 w-8 text-[11px] !ring-white/25" />
              {a.name}
              {marks.length > 0 && <sup className="text-xs font-semibold text-ochre-300">{marks.join(',')}</sup>}
              {a.corresponding && (a.email
                ? <a href={`mailto:${a.email}`} aria-label={`Corresponding author: email ${a.name}`} className="inline-flex rounded text-ochre-300 hover:text-white"><Email className="h-4 w-4" aria-hidden="true" /></a>
                : <Email className="h-4 w-4 text-ochre-300" role="img" aria-label="Corresponding author" />)}
              {a.orcid && <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD of ${a.name} (opens in a new tab)`} className="inline-flex"><OrcidMark /></a>}
            </li>
          )
        })}
      </ul>
      {order.length > 0 && (
        <ol className="mt-4 space-y-2 text-sm text-bordeaux-200" aria-label="Affiliations">
          {order.map((n, i) => (
            <li key={n} className="flex items-start gap-2.5 break-words">
              <span aria-hidden="true" className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded border border-ochre-300/40 bg-ochre-400/10 text-[11px] font-semibold tabular-nums text-ochre-300">{i + 1}</span>
              <span className="leading-5">{article.affiliations[n - 1]}</span>
            </li>
          ))}
        </ol>
      )}
    </>
  )
}

export function ArticleHeader({ article }: { article: ArticleFull }) {
  const { download, share, linkCopied } = useArticleActions(article)
  const doi = doiFor(article.paperId)
  const published = article.publishedOnline || article.publishedAt
  const strip: [string, ReactNode][] = [
    ['Published', published ? formatDate(published) : '—'],
    ['Volume / issue', `Vol. ${article.volume}, No. ${article.issue}`],
    ['Pages', article.pages || '—'],
    ['Licence', <a key="l" href={journal.licence.url} target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-2 hover:decoration-white">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a>],
    ['Paper ID', <span key="p" className="break-all">{article.paperId}</span>],
  ]
  return (
    <header className="relative isolate overflow-hidden bg-bordeaux-900 text-white print:bg-white print:text-black">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgba(180,83,9,0.28),transparent_55%)] print:hidden" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgba(252,211,77,0.07)_1px,transparent_1px)] [background-size:6px_6px] print:hidden" />
      <Container className="pb-8 pt-7 sm:pb-10 sm:pt-9">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-bordeaux-200">
            <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li>
            <li aria-hidden="true">/</li>
            <li><AppLink to={paths.issue(article.volume, article.issue)} className="hover:text-white hover:underline">Vol. {article.volume}, No. {article.issue}</AppLink></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-white">Article</li>
          </ol>
        </nav>
        <div className="mt-4 print:hidden"><DoubleRule /><Dateline label={article.type} text={`${journal.shortName} · Vol. ${article.volume}, No. ${article.issue} · ISSN ${journal.issnOnline}`} /><DoubleRule /></div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {article.subject && (
            <AppLink to={paths.search(article.subject)} className="rounded-sm transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre-300">
              <AreaChip subject={article.subject} tone="dark" />
            </AppLink>
          )}
          <span className="inline-flex items-center gap-1.5 rounded border border-ochre-300/30 bg-ochre-400/10 px-2.5 py-1 text-xs font-semibold text-ochre-300"><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />Open access</span>
        </div>
        <h1 className="mt-4 max-w-4xl break-words font-newsreader font-semibold leading-[1.12] tracking-tight [overflow-wrap:anywhere]" style={{ fontSize: 'clamp(30px,3.4vw,46px)' }}>{article.title}</h1>
        <OrnamentRule tone="dark" className="mt-5 max-w-[16rem] print:hidden" />
        <Authors article={article} />

        <div className="mt-7 flex flex-wrap items-center gap-2 print:hidden">
          <button type="button" onClick={download} className={buttonClass('light', 'min-h-11')}><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download PDF</button>
          <CiteMenu article={article} className={buttonClass('onDark', 'min-h-11')}><Quote className="h-[18px] w-[18px]" aria-hidden="true" />Cite</CiteMenu>
          <button type="button" onClick={() => void share()} className={buttonClass('onDark', 'min-h-11')}>
            {linkCopied ? <Check className="h-[18px] w-[18px]" aria-hidden="true" /> : <LinkIcon className="h-[18px] w-[18px]" aria-hidden="true" />}Share
          </button>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded border border-white/15 bg-white/15 text-sm sm:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2 min-w-0 bg-wine-900 px-4 py-3 sm:col-span-3 lg:col-span-2">
            <dt className={DT}>DOI</dt>
            <dd className="mt-1 flex items-start gap-1">
              <a href={`https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="min-w-0 break-all py-1 font-medium tabular-nums text-ochre-300 hover:underline">{doi}<span className="sr-only"> (opens in a new tab)</span></a>
              <CopyButton text={doi} label={`Copy DOI ${doi}`} what="DOI" className="-my-1 shrink-0 text-bordeaux-200 hover:bg-white/10" />
            </dd>
          </div>
          {strip.map(([k, v]) => (
            <div key={k} className={`min-w-0 bg-wine-900 px-4 py-3${k === 'Paper ID' ? ' col-span-2 sm:col-span-1' : ''}`}>
              <dt className={DT}>{k}</dt>
              <dd className="mt-1 font-medium tabular-nums text-white">{v}</dd>
            </div>
          ))}
        </dl>
        <ul aria-label="Article metrics" className="mt-3 inline-grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded border border-white/15 bg-white/5">
          {([['Views', article.views, Eye], ['Downloads', article.downloads, Download], ['Citations', article.citations, Quote]] as const).map(([label, value, Icon]) => (
            <li key={label} className="flex items-center gap-2.5 px-4 py-2.5 sm:px-5">
              <Icon className="h-5 w-5 shrink-0 text-ochre-300" aria-hidden="true" />
              <span className="leading-tight">
                <span className="block text-lg font-semibold tabular-nums text-white">{num(value)}</span>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-bordeaux-200">{label}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </header>
  )
}
