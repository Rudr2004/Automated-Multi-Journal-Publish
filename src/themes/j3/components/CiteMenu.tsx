// Cite flyout: a trigger plus a panel rendered in a portal and positioned with `fixed` from the trigger's rectangle, so cards and overflow never clip it.
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { copyText, downloadText } from '../../../core/lib/clipboard'
import type { ArticleFull } from '../../../core/types'
import { Copy, Download } from '../icons'
import { Button } from './Button'
import { cx } from './primitives'
import { useToast } from './Toast'

const FOCUSABLE = 'button:not([disabled]),a[href],pre[tabindex]'
const WIDTH = 380

export function CiteMenu({ article, className, children }: { article: ArticleFull; className?: string; children: ReactNode }) {
  const toast = useToast()
  const id = useId()
  const trigger = useRef<HTMLButtonElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [style, setStyle] = useState<CitationStyle>('apa')
  const [pos, setPos] = useState<{ left: number; width: number; top?: number; bottom?: number }>({ left: 8, width: WIDTH })
  const text = formatCitation(article, style)
  const asFile = style === 'bibtex' || style === 'ris'

  const place = useCallback(() => {
    const r = trigger.current?.getBoundingClientRect()
    if (!r) return
    const width = Math.min(WIDTH, window.innerWidth - 16)
    const left = Math.max(8, Math.min(r.left + r.width / 2 - width / 2, window.innerWidth - width - 8))
    const below = window.innerHeight - r.bottom
    setPos(below > 380 || below > r.top ? { left, width, top: r.bottom + 8 } : { left, width, bottom: window.innerHeight - r.top + 8 })
  }, [])

  useLayoutEffect(() => { if (open) place() }, [open, place])
  useEffect(() => {
    if (!open) return
    panel.current?.querySelector<HTMLElement>('[aria-pressed="true"]')?.focus()
    const close = (refocus: boolean) => { setOpen(false); if (refocus) trigger.current?.focus() }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(true); return }
      if (e.key !== 'Tab' || !panel.current) return
      const items = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
      const first = items[0], last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (!panel.current?.contains(t) && !trigger.current?.contains(t)) close(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown); window.removeEventListener('resize', place); window.removeEventListener('scroll', place, true) }
  }, [open, place])

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => setOpen((v) => !v)} className={className}>{children}</button>
      {open && createPortal(
        <div ref={panel} id={id} role="dialog" aria-label="Cite this article" style={{ position: 'fixed', left: pos.left, width: pos.width, top: pos.top, bottom: pos.bottom }}
          className="z-[80] max-h-[calc(100vh-16px)] overflow-auto rounded-block bg-white p-5 text-left shadow-dock ring-1 ring-mauve-100 motion-safe:animate-fade-in">
          <p className="font-jakarta text-lg font-extrabold text-night-900">Cite this article</p>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Citation style">
            {CITATION_STYLES_WITH_IEEE.map((s) => (
              <button key={s.id} type="button" aria-pressed={style === s.id} onClick={() => setStyle(s.id)}
                className={cx('rounded-full px-3.5 py-1.5 font-jakarta text-sm font-bold', style === s.id ? 'bg-iris-700 text-white' : 'bg-iris-50 text-night-900 hover:bg-iris-100')}>{s.label}</button>
            ))}
          </div>
          <pre tabIndex={0} aria-label={`${style.toUpperCase()} citation`} className="mt-4 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-tile bg-iris-50 p-4 font-inter text-sm leading-relaxed text-night-900">{text}</pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="primary" onClick={async () => { const ok = await copyText(text); toast(ok ? 'Citation copied' : 'Could not copy the citation', ok ? 'success' : 'error') }}>
              <Copy className="h-4 w-4" aria-hidden="true" /> Copy
            </Button>
            {asFile && (
              <Button variant="outline" onClick={() => { downloadText(citationFilename(article, style), text); toast(`${citationFilename(article, style)} downloaded`) }}>
                <Download className="h-4 w-4" aria-hidden="true" /> Download
              </Button>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
