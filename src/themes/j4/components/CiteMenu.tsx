// Cite flyout: a trigger plus a panel rendered in a portal and placed with `fixed` from the trigger's rectangle, so tables and cards never clip it.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { copyText, downloadText } from '../../../core/lib/clipboard'
import type { ArticleFull, ArticleSummary } from '../../../core/types'
import { Check, Close, Copy, Download } from '../icons'
import { Button } from './Button'
import { cx } from './primitives'
import { useToast } from './Toast'

/** Summaries carry everything a citation needs except the "published online" date, which is the issue date. */
const citable = (a: ArticleSummary | ArticleFull): ArticleFull => ({ ...(a as ArticleFull), publishedOnline: (a as ArticleFull).publishedOnline ?? a.publishedAt })
const WIDTH = 400

export function CiteMenu({ article, className, children }: { article: ArticleSummary | ArticleFull; className?: string; children: ReactNode }) {
  const toast = useToast()
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<CitationStyle>('apa')
  const [copied, setCopied] = useState(false)
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number }>({ left: 8, width: WIDTH })
  const full = citable(article)
  const text = formatCitation(full, style)
  const asFile = style === 'bibtex' || style === 'ris'

  const place = useCallback(() => {
    const r = trigger.current?.getBoundingClientRect()
    if (!r) return
    const width = Math.min(WIDTH, window.innerWidth - 16)
    const left = Math.max(8, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 8))
    const below = window.innerHeight - r.bottom
    setPos(below < 380 && r.top > below ? { left, width, bottom: window.innerHeight - r.top + 8 } : { left, width, top: r.bottom + 8 })
  }, [])
  useLayoutEffect(() => {
    if (!open) return
    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open, place])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (!panel.current?.contains(t) && !trigger.current?.contains(t)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    panel.current?.querySelector<HTMLElement>('[role=tab][aria-selected=true]')?.focus()
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown) }
  }, [open])

  const copy = async () => {
    const ok = await copyText(text)
    if (ok) { setCopied(true); setTimeout(() => setCopied(false), 1800); toast('Citation copied') } else toast('Could not copy. Select the text and copy it manually.', 'error')
  }

  return (
    <>
      <button ref={trigger} type="button" aria-expanded={open} aria-haspopup="dialog" aria-controls={open ? id : undefined} onClick={() => setOpen((v) => !v)} className={className}>{children}</button>
      {open && createPortal(
        <div ref={panel} id={id} role="dialog" aria-label="Cite this article" style={pos} className="fixed z-[75] rounded-pane border border-abyss-200 bg-white p-4 shadow-float motion-safe:animate-fade-in">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif4 text-base font-semibold text-abyss-900">Cite this article</p>
            <button type="button" onClick={() => { setOpen(false); trigger.current?.focus() }} aria-label="Close" className="rounded-ctl p-1 text-steel-500 hover:bg-abyss-100"><Close className="h-4 w-4" aria-hidden="true" /></button>
          </div>
          <div role="tablist" aria-label="Citation style" className="flex flex-wrap gap-1">
            {CITATION_STYLES_WITH_IEEE.map((s) => (
              <button key={s.id} type="button" role="tab" aria-selected={style === s.id} onClick={() => setStyle(s.id)}
                className={cx('rounded-ctl px-2.5 py-1 text-xs font-semibold', style === s.id ? 'bg-abyss-900 text-white' : 'bg-abyss-100 text-steel-700 hover:bg-abyss-200')}>{s.label}</button>
            ))}
          </div>
          <pre tabIndex={0} className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap break-words rounded-ctl bg-abyss-50 p-3 font-work text-xs leading-relaxed text-steel-700">{text}</pre>
          <div className="mt-3 flex gap-2">
            <Button variant="cta" onClick={copy} className="flex-1">{copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{copied ? 'Copied' : 'Copy'}</Button>
            {asFile && <Button variant="outline" onClick={() => downloadText(citationFilename(full, style), text)}><Download className="h-4 w-4" aria-hidden="true" /> Download</Button>}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
