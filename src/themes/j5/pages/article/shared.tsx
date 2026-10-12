// Shared helpers for the J5 article workspace: tab list, action hooks and small display pieces.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { copyText } from '../../../../core/lib/clipboard'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import type { ArticleFull } from '../../../../core/types'
import { Check, Copy } from '../../icons'
import { cx } from '../../components/primitives'
import { useToast } from '../../components/Toast'

export type TabId = 'abstract' | 'authors-section' | 'full-text' | 'references' | 'metrics' | 'disclosures' | 'cite-panel'
export interface TabDef { id: TabId; label: string }

/** Anchor tabs of the sticky bar, in the reference's order. Full text and References appear only when the article has them. */
export const tabsFor = (a: ArticleFull): TabDef[] => [
  { id: 'abstract', label: 'Abstract' },
  { id: 'authors-section', label: 'Authors & Certificates' },
  ...(a.sections?.length ? [{ id: 'full-text' as const, label: 'Full Text & Figures' }] : []),
  ...(a.references?.length ? [{ id: 'references' as const, label: 'References' }] : []),
  { id: 'metrics', label: 'Metrics & Charts' },
  { id: 'disclosures', label: 'Declarations' },
  { id: 'cite-panel', label: 'Cite' },
]

/** Small uppercase label used for card and block headings. */
export const LABEL = 'font-work text-[11px] font-bold uppercase tracking-wider text-obsidian-600'
/** White card with hairline border. */
export const CARD = 'rounded border border-[#DCC0BE] bg-white shadow-sm'
/** Section heading (Newsreader). */
export const H2 = 'font-newsreader text-xl font-semibold text-obsidian-900'
export const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const num = (n: number | undefined) => (typeof n === 'number' ? new Intl.NumberFormat('en-US').format(n) : '—')
export const pageUrl = () => window.location.href.split('#')[0]

/** Copy-to-clipboard with a short "copied" state and a toast. */
export function useCopy(what: string) {
  const toast = useToast()
  const [done, setDone] = useState(false)
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = useCallback(async (text: string) => {
    const ok = await copyText(text)
    if (ok) { setDone(true); window.clearTimeout(timer.current); timer.current = window.setTimeout(() => setDone(false), 1800) }
    toast(ok ? `${what} copied` : `Could not copy the ${what.toLowerCase()}`, ok ? 'success' : 'error')
    return ok
  }, [what, toast])
  return { copy, done }
}

export function useArticleActions(article: ArticleFull) {
  const toast = useToast()
  const link = useCopy('Link')
  const download = () => { downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded`) }
  const share = async () => {
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: article.title, url: pageUrl() }) } catch { /* the reader closed the share sheet */ }
      return
    }
    void link.copy(pageUrl())
  }
  return { download, share, copyLink: () => link.copy(pageUrl()), linkCopied: link.done }
}

/** Small copy button: the icon swaps to a check and a polite live region announces the result. */
export function CopyButton({ text, label, what, className, children }: { text: string; label: string; what: string; className?: string; children?: ReactNode }) {
  const { copy, done } = useCopy(what)
  return (
    <button type="button" onClick={() => void copy(text)} aria-label={label}
      className={cx('inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded px-3 text-sm font-semibold sm:min-h-9 sm:min-w-9', className)}>
      {done ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {children}
      <span role="status" aria-live="polite" className="sr-only">{done ? `${what} copied` : ''}</span>
    </button>
  )
}
