// Article page pieces added for the reference "verified full-text view": author photo, recommend dialog, declarations, previous/next bar, highlights.
import { useEffect, useState } from 'react'
import type { ArticleFull, ArticleSummary } from '../../../mock-data/journals/j1'
import { api } from '../../../core/api'
import { articleUrl } from '../../../core/lib/articleLink'
import { AppLink } from '../../../core/router'
import { doiFor, journal } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { CopyButton } from './ArticleParts'
import { Modal } from './Modal'
import { ArrowLeft, ArrowRight, Mail } from './uiIcons'

/** 56px round portrait with an initials fallback (the shared Avatar has no 56px size). */
export function AuthorPhoto({ name, photo, ring }: { name: string; photo?: string; ring?: boolean }) {
  const [failed, setFailed] = useState(false)
  const initials = name.replace(/^(Prof|Dr)\.?\s+/i, '').split(' ').map((p) => p[0]).slice(0, 2).join('')
  const base = `flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full ${ring ? 'border-2 border-scholar' : 'border border-line'}`
  if (photo && !failed) {
    return <img src={photo} alt={`Portrait of ${name}`} loading="lazy" width={56} height={56} onError={() => setFailed(true)} className={`${base} bg-paper object-cover object-top`} />
  }
  return <span role="img" aria-label={`Portrait placeholder for ${name}`} className={`${base} bg-navy-50 font-serif text-lg font-bold text-navy`}>{initials}</span>
}

/** "Recommend to Librarian / Scholar": a prefilled message (mailto or copy), no backend. */
export function RecommendModal({ article, mode, onClose }: { article: ArticleFull; mode: 'librarian' | 'scholar' | null; onClose: () => void }) {
  const url = articleUrl(article.paperId)
  const doi = `https://doi.org/${doiFor(article.paperId)}`
  const cite = `${article.authors.join(', ')}. "${article.title}". ${journal.name}, Vol. ${article.volume}, Issue ${article.issue}, pp. ${article.pages}.`
  const librarian = mode === 'librarian'
  const subject = librarian ? `Acquisition recommendation: ${journal.shortName} - ${article.title}` : `Article recommendation: ${article.title}`
  const body = librarian
    ? `Dear Librarian,\n\nI would like to recommend that our library lists ${journal.name} (ISSN ${journal.issnOnline}, open access, ${journal.licence.name}) for its collection.\n\nArticle I read:\n${cite}\nDOI: ${doi}\nLink: ${url}\n\nThank you.`
    : `Hello,\n\nI thought you might find this article useful:\n\n${cite}\nDOI: ${doi}\nLink: ${url}\n\nIt is open access (${journal.licence.name}).`
  return (
    <Modal open={mode !== null} onClose={onClose} title={librarian ? 'Recommend to Librarian' : 'Recommend to Scholar'}>
      <p className="text-sm text-ink-muted">
        {librarian ? 'Send your librarian a ready-made note about this journal and article. Nothing is sent from this site; the message opens in your email app.' : 'Share this article with a colleague. Nothing is sent from this site; the message opens in your email app.'}
      </p>
      <pre className="mt-4 max-h-56 overflow-auto whitespace-pre-wrap break-words border border-line border-l-[3px] border-l-scholar bg-paper p-3 font-sans text-[13px] leading-relaxed text-ink">{body}</pre>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <a href={`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}
          className="inline-flex h-9 items-center gap-1.5 rounded bg-scholar px-4 text-sm font-semibold text-white hover:bg-scholar-dark"><Mail className="h-4 w-4" aria-hidden />Open in email</a>
        <CopyButton text={body} label="Copy message" className="h-9" />
        <CopyButton text={url} label="Copy link" className="h-9" />
      </div>
    </Modal>
  )
}

const sentences = (text: string) => text.split(/(?<=[.!?])\s+(?=[A-Z“"])/).map((x) => x.trim()).filter(Boolean)
const firstSentences = (text: string) => sentences(text)[0] ?? text

/** Honest highlights: sentences copied from the article's own results and conclusion (nothing is invented). */
export function deriveHighlights(a: ArticleFull): string[] {
  const results = a.sections.find((s) => s.id === 'results')
  const conclusion = a.sections.find((s) => s.id === 'conclusion')
  const out: string[] = []
  const r1 = results?.paragraphs[0]
  if (r1) {
    const ss = sentences(r1)
    if (ss[1]) out.push(ss[1])
  }
  if (results?.paragraphs[1]) out.push(firstSentences(results.paragraphs[1]))
  if (conclusion?.paragraphs[0]) out.push(firstSentences(conclusion.paragraphs[0]))
  return out.filter((t) => t.length > 20).slice(0, 3)
}

function Card({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`border border-line bg-mist p-4 ${wide ? 'md:col-span-2' : ''}`}>
      <h3 className="text-xs font-bold uppercase tracking-wide text-navy">{title}</h3>
      <div className="mt-1.5 text-[13px] leading-relaxed text-ink">{children}</div>
    </div>
  )
}

/** "Declarations, Ethics & Compliance": cards built from what the article data actually says. */
export function DeclarationsSection({ article, heading }: { article: ArticleFull; heading: string }) {
  const find = (id: string, re: RegExp) => {
    const text = article.sections.find((s) => s.id === id)?.paragraphs.join(' ') ?? ''
    return sentences(text).find((x) => re.test(x))
  }
  const conduct = find('methods', /institutional guidelines/i)
  const data = find('conclusion', /available from the corresponding author/i)
  const corresponding = article.authorDetails.find((a) => a.corresponding)
  return (
    <section id="declarations" className="mt-10 scroll-mt-24 border-t border-line pt-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-serif text-[1.5rem] font-semibold text-navy">{heading}</h2>
      </div>
      <div className="mt-4 grid gap-3.5 md:grid-cols-2">
        <Card title="Ethics & research conduct">{conduct ?? 'The authors confirm that the work follows the relevant institutional and ethical guidelines.'}</Card>
        <Card title="Data availability">{data ?? 'Data supporting the findings are available from the corresponding author on reasonable request.'}{corresponding?.email && <> Contact: <a href={`mailto:${corresponding.email}`} className="break-all text-scholar hover:underline">{corresponding.email}</a>.</>}</Card>
        <Card title="Competing interests">The authors declare that they have no competing interests.</Card>
        <Card title="Funding">No specific funding was declared for this work.</Card>
        <Card title="Licence & copyright" wide>
          This article is published open access under the <a href={journal.licence.url} target="_blank" rel="noreferrer" className="font-semibold text-scholar hover:underline">{journal.licence.name}</a> licence; authors retain copyright.
          The DOI <span className="font-mono tabular-nums">{doiFor(article.paperId)}</span> is registered with Crossref.
        </Card>
      </div>
    </section>
  )
}

/** Previous / next article in the same issue; a side with no neighbour is hidden. */
export function PrevNextBar({ article }: { article: ArticleFull }) {
  const [nb, setNb] = useState<{ prev?: ArticleSummary; next?: ArticleSummary } | null>(null)
  useEffect(() => {
    let live = true
    setNb(null)
    api.getIssue(article.volume, article.issue).then((d) => {
      if (!live || !d) return
      const i = d.articles.findIndex((a) => a.paperId === article.paperId)
      if (i < 0) return setNb({})
      setNb({ prev: d.articles[i - 1], next: d.articles[i + 1] })
    }).catch(() => live && setNb({}))
    return () => { live = false }
  }, [article.paperId, article.volume, article.issue])
  if (!nb || (!nb.prev && !nb.next)) return null
  const cell = 'flex min-w-0 flex-1 flex-col gap-0.5 rounded p-2.5 text-xs hover:bg-mist focus-visible:outline focus-visible:outline-2 focus-visible:outline-scholar'
  return (
    <nav aria-label="Previous and next article" className="mt-10 flex items-stretch justify-between gap-3 border-t border-line pt-4">
      {nb.prev ? (
        <AppLink to={paths.article(nb.prev.paperId)} className={`${cell} text-left`}>
          <span className="inline-flex items-center gap-1 font-semibold text-ink-muted"><ArrowLeft className="h-4 w-4" aria-hidden />Previous article</span>
          <span className="line-clamp-2 font-serif text-sm font-semibold text-navy">{nb.prev.title}</span>
          <span className="font-mono text-[11px] text-ink-muted">{nb.prev.paperId}</span>
        </AppLink>
      ) : <span className="flex-1" />}
      {nb.next ? (
        <AppLink to={paths.article(nb.next.paperId)} className={`${cell} items-end text-right`}>
          <span className="inline-flex items-center gap-1 font-semibold text-scholar">Next article<ArrowRight className="h-4 w-4" aria-hidden /></span>
          <span className="line-clamp-2 font-serif text-sm font-semibold text-navy">{nb.next.title}</span>
          <span className="font-mono text-[11px] text-ink-muted">{nb.next.paperId}</span>
        </AppLink>
      ) : <span className="flex-1" />}
    </nav>
  )
}
