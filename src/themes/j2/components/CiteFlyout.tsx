// "Cite Article" flyout: APA, MLA, Chicago, Harvard, IEEE, BibTeX and RIS. The formatting itself is shared logic (core/lib/cite).
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { CITATION_STYLES_WITH_IEEE, formatCitation, citationFilename, type CitationStyle } from '../../../core/lib/cite'
import { copyText, downloadText } from '../../../core/lib/clipboard'
import type { ArticleFull, ArticleSummary } from '../../../core/types'
import { Button, buttonClass } from './Button'
import { cx } from './primitives'
import { useToast } from './Toast'
import { Check, Close, Copy, Download, Quote } from '../icons'

/** Summaries carry everything a citation needs, except the "published online" date (same as the issue date). */
export const citable = (a: ArticleSummary | ArticleFull): ArticleFull => ({ ...(a as ArticleFull), publishedOnline: (a as ArticleFull).publishedOnline ?? a.publishedAt })

export function CiteFlyout({ article, className }: { article: ArticleSummary | ArticleFull; className?: string }) {
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<CitationStyle>('apa')
  const [copied, setCopied] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<CSSProperties>({})
  const toast = useToast()
  const text = formatCitation(citable(article), style)
  const file = style === 'bibtex' || style === 'ris'

  // The flyout is rendered in a portal (cards clip their content), so it is positioned from the button's place in the viewport.
  useLayoutEffect(() => {
    if (!open) return
    const place = () => {
      const r = root.current?.getBoundingClientRect()
      if (!r) return
      const width = Math.min(window.innerWidth * 0.92, 416)
      const left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8))
      const below = window.innerHeight - r.bottom
      setPos(below < 360 && r.top > below ? { left, width, bottom: window.innerHeight - r.top + 8 } : { left, width, top: r.bottom + 8 })
    }
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (!root.current?.contains(t) && !panel.current?.contains(t)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const copy = async () => {
    const ok = await copyText(text)
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1800); toast('Citation copied') } else toast('Could not copy. Select the text and copy it manually.', 'error')
  }

  return (
    <div ref={root} className={cx('relative', className)}>
      <button type="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen((v) => !v)} className={buttonClass('outline')}>
        <Quote className="h-4 w-4" aria-hidden="true" /> Cite Article
      </button>
      {open && createPortal(
        <div ref={panel} role="dialog" aria-label="Cite this article" style={pos} className="fixed z-[65] rounded-panel border border-graphite-200 bg-white p-4 shadow-pop motion-safe:animate-fade-in">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-display text-sm font-semibold text-graphite-800">Cite this article</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="rounded-chip p-1 text-graphite-500 hover:bg-graphite-100"><Close className="h-4 w-4" aria-hidden="true" /></button>
          </div>
          <div role="tablist" aria-label="Citation style" className="flex flex-wrap gap-1">
            {CITATION_STYLES_WITH_IEEE.map((s) => (
              <button key={s.id} type="button" role="tab" aria-selected={style === s.id} onClick={() => setStyle(s.id)}
                className={cx('rounded-chip px-2.5 py-1 text-xs font-semibold', style === s.id ? 'bg-accent-700 text-white' : 'bg-graphite-100 text-graphite-700 hover:bg-graphite-200')}>
                {s.label}
              </button>
            ))}
          </div>
          <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap break-words rounded-soft bg-graphite-50 p-3 font-body text-xs leading-relaxed text-graphite-700">{text}</pre>
          <div className="mt-3 flex gap-2">
            <Button variant="secondary" onClick={copy} className="flex-1">{copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{copied ? 'Copied' : 'Copy'}</Button>
            {file && <Button variant="outline" onClick={() => downloadText(citationFilename(citable(article), style), text)}><Download className="h-4 w-4" aria-hidden="true" /> Download</Button>}
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
