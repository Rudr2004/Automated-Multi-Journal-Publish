// Shared helpers for the J4 article workspace: tab list, action hooks and small display pieces.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { copyText } from '../../../../core/lib/clipboard'
import { downloadArticlePdf } from '../../../../core/lib/pdf'
import type { ArticleFull } from '../../../../core/types'
import { Check, Copy } from '../../icons'
import { cx } from '../../components/primitives'
import { useToast } from '../../components/Toast'

export type TabId = 'abstract' | 'full-text' | 'references' | 'metrics' | 'cite' | 'related'
export interface TabDef { id: TabId; label: string }

export const tabsFor = (a: ArticleFull): TabDef[] => [
  { id: 'abstract', label: 'Abstract' },
  ...(a.sections?.length ? [{ id: 'full-text' as const, label: 'Full text' }] : []),
  ...(a.references?.length ? [{ id: 'references' as const, label: `References (${a.references.length})` }] : []),
  { id: 'metrics', label: 'Metrics' },
  { id: 'cite', label: 'Cite & share' },
  ...(a.related?.length ? [{ id: 'related' as const, label: 'Related' }] : []),
]

export const H2 = 'font-serif4 text-[1.5rem] font-semibold leading-tight tracking-tight text-abyss-900 sm:text-[1.75rem]'
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
      className={cx('inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-ctl px-3 text-sm font-semibold sm:min-h-9 sm:min-w-9', className)}>
      {done ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {children}
      <span role="status" aria-live="polite" className="sr-only">{done ? `${what} copied` : ''}</span>
    </button>
  )
}
