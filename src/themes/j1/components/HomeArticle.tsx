import { useState } from 'react'
import { MdOutlineExpandMore } from 'react-icons/md'
import type { ArticleFull, ArticleSummary } from '../../../mock-data/journals/j1'
import { orcidFor } from '../../../mock-data/shared/identity'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { api } from '../../../core/api'
import { doiFor } from '../../../config/journals/j1'
import { paths } from '../../../config/routes'
import { articleUrl } from '../../../core/lib/articleLink'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { AppLink } from '../../../core/router'
import { Avatar } from './Avatar'
import { OrcidIcon } from './ArticleParts'
import { CiteModal } from './CiteModal'
import { Tag } from './PortalParts'
import { useToast } from './Toast'
import { Download, Eye, FormatQuote, Loader2, Share2 } from './uiIcons'

const ACTION = 'inline-flex h-9 items-center justify-center gap-1.5 rounded px-3.5 text-xs font-bold'

/** Article row of the home "Current Issue Scholarly Articles" list: Download PDF, Cite Article (loads the full record on click) and a share icon. */
export function HomeArticle({ article }: { article: ArticleSummary }) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [full, setFull] = useState<ArticleFull | null>(null)
  const [citeOpen, setCiteOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const doi = doiFor(article.paperId)
  const absId = `habs-${article.paperId}`

  const cite = async () => {
    if (full) { setCiteOpen(true); return }
    setLoading(true)
    try {
      const a = await api.getArticle(article.paperId)
      if (!a) throw new Error('missing')
      setFull(a); setCiteOpen(true)
    } catch { toast('Could not load the citation. Please try again.', 'error') }
    finally { setLoading(false) }
  }
  const share = async () => {
    const url = articleUrl(article.paperId)
    if (typeof navigator.share === 'function') { try { await navigator.share({ title: article.title, url }); return } catch { /* cancelled: fall back to copy */ } }
    const ok = await copyText(url)
    toast(ok ? 'Article link copied.' : 'Could not copy the link.', ok ? 'success' : 'error')
  }

  return (
    <article className="border-b border-line px-4 py-5 last:border-b-0 sm:px-5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
        <Tag tone="amber">{article.type}</Tag>
        <span className="text-xs text-ink-muted">Published: <span className="tabular-nums">{formatDate(article.publishedAt)}</span></span>
        <span aria-hidden className="text-line">•</span>
        <span className="text-xs text-ink-muted">Vol. {article.volume}, Iss. {article.issue}</span>
      </div>
      <h3 className="mt-2 font-serif text-[1.125rem] font-bold leading-snug tracking-tight text-navy sm:text-[1.1875rem]">
        <AppLink to={paths.article(article.paperId)} className="hover:text-scholar hover:underline">{article.title}</AppLink>
      </h3>
      <ul className="mt-2 flex flex-wrap gap-2" aria-label="Authors">
        {article.authors.map((name) => (
          <li key={name} className="inline-flex items-center gap-2 rounded border border-line bg-white py-1 pl-1 pr-2.5 text-[13px]">
            <Avatar name={name} photo={portraitFor(name)} size="xs" />
            <AppLink to={paths.search(name)} className="font-semibold text-ink hover:text-scholar hover:underline">{name}</AppLink>
            {orcidFor(name) && <OrcidIcon id={orcidFor(name)!} />}
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
        <span>DOI: <a href={`https://doi.org/${doi}`} className="font-mono tabular-nums text-scholar hover:underline">{doi}</a></span>
        <span className="inline-flex items-center gap-1 tabular-nums"><FormatQuote className="h-4 w-4" aria-hidden />{formatNumber(article.citations)} Citations</span>
        <span className="inline-flex items-center gap-1 tabular-nums"><Eye className="h-4 w-4" aria-hidden />{formatNumber(article.views)} Views</span>
      </div>
      <button type="button" aria-expanded={open} aria-controls={absId} onClick={() => setOpen(!open)} className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-scholar hover:underline">
        <MdOutlineExpandMore className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />{open ? 'Hide Abstract' : 'View Abstract'}
      </button>
      {open && <p id={absId} className="mt-2 border-l-[3px] border-navy bg-paper p-3 text-sm leading-relaxed text-ink">{article.abstract}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
        <a href={paths.pdf(article.paperId)} download onClick={(e) => { e.preventDefault(); downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded.`) }}
          className={`${ACTION} bg-scholar text-white hover:bg-scholar-dark`}><Download className="h-4 w-4" aria-hidden />Download PDF</a>
        <button type="button" onClick={cite} disabled={loading} aria-busy={loading || undefined} aria-haspopup="dialog"
          className={`${ACTION} border border-line bg-white text-navy hover:bg-mist disabled:opacity-60`}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <FormatQuote className="h-4 w-4" aria-hidden />}Cite Article
        </button>
        <button type="button" onClick={share} aria-label={`Share ${article.paperId}`} title="Share"
          className="inline-flex h-9 w-9 items-center justify-center rounded border border-line bg-white text-navy hover:bg-mist"><Share2 className="h-4 w-4" aria-hidden /></button>
      </div>
      {full && <CiteModal article={full} open={citeOpen} onClose={() => setCiteOpen(false)} />}
    </article>
  )
}
