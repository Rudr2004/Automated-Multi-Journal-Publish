// Building blocks for the issue and archive pages after the "refined author profiles" reference: square photo avatars, author rows with numbered
// affiliations, an ORCID chip and a small profile popover, status tags and the numbered pager. Flat surfaces, 1px hairlines, 2px corners, no shadows.
import { Fragment, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { api } from '../../../core/api'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import type { ArticleFull, ArticleSummary, AuthorDetail } from '../../../core/types'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { cx } from './primitives'
import { ChevronLeft, ChevronRight, OpenAccess } from '../icons'

const initials = (name: string) => name.replace(/^(Prof|Dr)\.?\s+/i, '').split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase()

/** Orange-tinted open-access tag with a padlock (the orange is the restricted accent: small tags only). */
export const OaTag = ({ licence }: { licence: string }) => (
  <span className="inline-flex items-center gap-1 bg-ember-100 px-2 py-1 font-jakarta text-[11px] font-bold uppercase tracking-[0.04em] text-ember-900">
    <OpenAccess className="h-3.5 w-3.5 text-ember-700" aria-hidden="true" />Open access · {licence}
  </span>
)

/** Solid purple stream / theme tag. */
export const StreamTag = ({ children }: { children: ReactNode }) => (
  <span className="bg-iris-700 px-2 py-1 font-jakarta text-[11px] font-bold uppercase tracking-[0.04em] text-white">{children}</span>
)

export const TypeTag = ({ children }: { children: ReactNode }) => (
  <span className="bg-j3paper-deep px-2 py-1 font-jakarta text-[11px] font-bold uppercase tracking-[0.04em] text-iris-800">{children}</span>
)

/** Square profile photo (initials when a person has no picture). */
export function AuthorAvatar({ name, photo, size = 40, className }: { name: string; photo?: string; size?: number; className?: string }) {
  const src = photo ?? portraitFor(name)
  const [broken, setBroken] = useState(false)
  const style = { width: size, height: size }
  if (!src || broken) {
    return <span aria-hidden="true" style={style} className={cx('inline-flex shrink-0 items-center justify-center border border-j3paper-rule bg-j3paper-deep font-jakarta text-xs font-bold text-iris-800', className)}>{initials(name)}</span>
  }
  return <img src={src} alt="" aria-hidden="true" width={size} height={size} loading="lazy" onError={() => setBroken(true)} style={style} className={cx('shrink-0 border border-j3paper-rule bg-j3paper-cool object-cover', className)} />
}

export function OrcidChip({ orcid, name }: { orcid: string; name: string }) {
  return (
    <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noopener noreferrer" aria-label={`ORCID iD of ${name}: ${orcid} (opens in a new tab)`}
      className="inline-flex items-center bg-j3valid-100 px-1.5 py-0.5 font-jakarta text-[10px] font-extrabold leading-none text-j3valid-800 hover:bg-j3valid-700 hover:text-white">iD</a>
  )
}

/** Author name with a profile popover (hover, focus or click; Escape closes). */
function AuthorName({ author, affiliations, articleId }: { author: AuthorDetail; affiliations: string[]; articleId: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const id = useId()
  const nums = author.affiliations
  return (
    <span ref={ref} className="relative inline-block"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget as Node | null)) setOpen(false) }}
      onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}>
      <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((v) => !v)}
        className="relative z-10 text-left font-jakarta text-[0.9375rem] font-bold text-night-900 underline decoration-j3paper-rule decoration-1 underline-offset-4 hover:text-iris-700 hover:decoration-iris-700">
        {author.name}
        {nums.length > 0 && <sup className="ml-px text-[0.7em] font-semibold text-mauve-600">{nums.join(',')}</sup>}
        {author.corresponding && <span className="font-semibold text-iris-700"><span aria-hidden="true">*</span><span className="sr-only"> (corresponding author)</span></span>}
      </button>
      {open && (
        <span id={id} role="group" aria-label={`Profile of ${author.name}`}
          className="absolute left-0 top-full z-30 mt-2 block w-[19rem] max-w-[calc(100vw-3rem)] border border-j3paper-rule border-t-2 border-t-iris-700 bg-white p-4 text-left">
          <span className="flex items-start gap-3">
            <AuthorAvatar name={author.name} photo={author.photo} size={56} />
            <span className="min-w-0">
              <span className="block font-jakarta text-sm font-bold text-night-900">{author.name}</span>
              <span className="block font-inter text-xs text-mauve-600">{author.corresponding ? 'Corresponding author' : 'Author'}</span>
              {author.orcid && <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noopener noreferrer" className="mt-1 block break-all font-mono text-[11px] text-iris-700 underline underline-offset-2">ORCID {author.orcid}</a>}
            </span>
          </span>
          {nums.length > 0 && (
            <span className="mt-3 block border-t border-j3paper-rule pt-3 font-inter text-xs leading-relaxed text-mauve-700">
              {nums.map((n) => <span key={n} className="block">{affiliations[n - 1]}</span>)}
            </span>
          )}
          {author.corresponding && author.email && <span className="mt-2 block break-all font-inter text-xs text-mauve-700">{author.email}</span>}
          <AppLink to={paths.article(articleId)} className="mt-3 inline-block font-inter text-xs font-semibold text-iris-700 underline underline-offset-2">Open the article</AppLink>
        </span>
      )}
    </span>
  )
}

/** "Authors and institutional affiliations": one row per author (photo, name, ORCID, affiliation lines). Names only until the full record has loaded. */
export function AuthorProfiles({ article, full }: { article: ArticleSummary; full?: ArticleFull | null }) {
  const details: AuthorDetail[] = full?.authorDetails ?? article.authors.map((name) => ({ name, photo: portraitFor(name), affiliations: [] }))
  const affs = full?.affiliations ?? []
  return (
    <div>
      <h4 className="border-b border-j3paper-rule pb-2 font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-mauve-600">Authors &amp; institutional affiliations</h4>
      <ul className="mt-4 space-y-3">
        {details.map((a) => (
          <li key={a.name} className="flex items-start gap-3">
            <AuthorAvatar name={a.name} photo={a.photo} size={40} />
            <div className="min-w-0 pt-px">
              <p className="flex flex-wrap items-center gap-x-2">
                <AuthorName author={a} affiliations={affs} articleId={article.paperId} />
                {a.orcid && <OrcidChip orcid={a.orcid} name={a.name} />}
              </p>
              {a.affiliations.length > 0 && (
                <p className="mt-0.5 font-inter text-[13px] leading-snug text-mauve-700">
                  {a.affiliations.map((n, i) => <Fragment key={n}>{i > 0 && <span aria-hidden="true">; </span>}<sup className="text-[0.75em]">{n}</sup>{affs[n - 1]}</Fragment>)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      {full?.authorDetails.some((a) => a.corresponding) && <p className="mt-3 font-inter text-xs text-mauve-600"><span aria-hidden="true">*</span> Corresponding author</p>}
    </div>
  )
}

/** Loads the full record (affiliations, ORCID iDs, photos) of each listed article. Rows render at once and fill in as the records arrive. */
export function useFullArticles(articles: ArticleSummary[]) {
  const [map, setMap] = useState<Record<string, ArticleFull | null>>({})
  const key = articles.map((a) => a.paperId).join('|')
  useEffect(() => {
    let live = true
    articles.forEach((a) => {
      api.getArticle(a.paperId).then((f) => { if (live) setMap((m) => (m[a.paperId] ? m : { ...m, [a.paperId]: f })) }).catch(() => {})
    })
    return () => { live = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])
  return map
}

/** Numbered pager: Previous, page numbers (current = solid purple), Next. */
export function Pager({ page, pages, onPage, label = 'Pagination' }: { page: number; pages: number; onPage: (p: number) => void; label?: string }) {
  if (pages <= 1) return null
  const btn = 'inline-flex h-9 min-w-9 items-center justify-center gap-1 border px-2.5 font-inter text-sm font-semibold tabular-nums'
  return (
    <nav aria-label={label} className="flex flex-wrap items-center justify-center gap-2 border border-j3paper-rule bg-white p-4">
      <button type="button" disabled={page === 1} onClick={() => onPage(page - 1)} className={cx(btn, 'border-j3paper-rule text-night-900 hover:border-iris-700 hover:bg-j3paper-cool disabled:cursor-not-allowed disabled:text-mauve-500 disabled:hover:border-j3paper-rule disabled:hover:bg-transparent')}><ChevronLeft className="h-4 w-4" aria-hidden="true" />Previous</button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <button key={p} type="button" aria-current={p === page ? 'page' : undefined} aria-label={`Page ${p}`} onClick={() => onPage(p)}
          className={cx(btn, p === page ? 'border-iris-700 bg-iris-700 text-white' : 'border-j3paper-rule text-night-900 hover:border-iris-700 hover:bg-j3paper-cool')}>{p}</button>
      ))}
      <button type="button" disabled={page === pages} onClick={() => onPage(page + 1)} className={cx(btn, 'border-j3paper-rule text-night-900 hover:border-iris-700 hover:bg-j3paper-cool disabled:cursor-not-allowed disabled:text-mauve-500 disabled:hover:border-j3paper-rule disabled:hover:bg-transparent')}>Next<ChevronRight className="h-4 w-4" aria-hidden="true" /></button>
    </nav>
  )
}
