import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useId, useRef, useState } from 'react'
import { logoSrc, visibleLogos } from '../../../config/journals/j1'
import type { IndexLogo as IndexLogoData } from '../../../config/journals/types'
import { paths } from '../../../config/routes'
import { AppLink } from '../../../core/router'
import { OpenInNew, VerifiedUser } from './uiIcons'

type Align = 'left' | 'right' | 'center'
type Look = 'strip' | 'footer' | 'compact' | 'card'

const ALT_OVERRIDE: Record<string, string> = {
  issn: 'ISSN registered', iso: 'ISO 9001:2015 certified', sjif: 'SJIF impact factor rating', thomson: 'Thomson Reuters listing',
}
/** Alt text for a logo, e.g. "Indexed in Google Scholar". */
export const logoAlt = (l: IndexLogoData) => ALT_OVERRIDE[l.id] ?? `Indexed in ${l.name}`

// Logos are never recoloured, stretched or cropped: automatic width, capped height, object-contain, shown in full colour.
const IMG: Record<Look, string> = {
  strip: 'max-h-8 max-w-full w-auto object-contain',
  footer: 'h-6 w-auto max-w-[96px] object-contain',
  compact: 'max-h-5 max-w-full w-auto object-contain',
  card: 'h-9 w-auto max-w-[150px] object-contain',
}
// Strip and compact logos sit in even, bordered tiles so every row lines up.
const BOX: Record<Look, string> = {
  strip: 'h-14 w-full border-line bg-white px-3',
  footer: 'border-transparent bg-white px-2 py-1.5',
  compact: 'h-11 w-full border-line bg-white px-2',
  card: 'border-transparent py-1',
}
const POP_POS: Record<Align, string> = { left: 'left-0', right: 'right-0', center: 'left-1/2 -translate-x-1/2' }

/**
 * A single index logo. Clicking or focusing it opens a small popover with what the listing means for authors,
 * the journal's status and a "Verify on …" link, so authors can check every claim themselves.
 */
export function IndexLogo({ logo, look = 'strip', align = 'center', opensUp = false }: { logo: IndexLogoData; look?: Look; align?: Align; opensUp?: boolean }) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const id = useId()
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); wrap.current?.querySelector('button')?.focus() } }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  return (
    <div ref={wrap} className={`relative ${look === 'footer' || look === 'card' ? '' : 'w-full'}`} onBlur={(e) => { if (!wrap.current?.contains(e.relatedTarget as Node)) setOpen(false) }}>
      <button type="button" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined}
        onFocus={() => setOpen(true)} onClick={() => setOpen(true)}
        className={`group flex items-center justify-center rounded border hover:border-scholar ${BOX[look]}`}>
        <img src={logoSrc(logo.file)} alt={logoAlt(logo)} className={IMG[look]} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div id={id} role="dialog" aria-label={`${logo.name}: listing details`}
            initial={reduce ? false : { opacity: 0, y: opensUp ? 4 : -4 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0 }} transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute z-40 w-72 rounded border border-line bg-white p-4 text-left shadow-xl ${POP_POS[align]} ${opensUp ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
            <div className="flex items-start justify-between gap-3">
              <p className="font-serif text-base font-semibold text-navy">{logo.name}</p>
              <span className="rounded-sm border border-line bg-paper px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{logo.status}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink">{logo.meaning}</p>
            <a href={logo.verifyUrl} target="_blank" rel="noreferrer"
              className="mt-3 inline-flex h-9 items-center gap-1.5 rounded bg-scholar px-3 text-sm font-semibold text-white hover:bg-scholar-dark">
              <VerifiedUser className="h-4 w-4" aria-hidden />Verify on {logo.name}<OpenInNew className="h-3.5 w-3.5" aria-hidden /><span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="mt-2 text-xs text-ink-muted">Check the listing yourself on the index’s own website.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/** Only logos switched on in the config appear. Layout depends on where the strip is used. */
export function IndexedStrip({ look = 'strip', limit, alignAll }: { look?: 'strip' | 'footer' | 'compact'; limit?: number; alignAll?: Align }) {
  const all = visibleLogos()
  const logos = limit ? all.slice(0, limit) : all
  if (!logos.length) return null
  const layout = look === 'footer' ? 'flex flex-wrap items-center gap-2' : look === 'compact' ? 'grid grid-cols-2 gap-1.5' : 'grid grid-cols-2 gap-2 sm:grid-cols-4'
  // Popovers open towards the middle of the page so they never run off-screen.
  const align = (i: number): Align => alignAll ?? (look === 'strip' ? (i % 4 < 2 ? 'left' : 'right') : i < logos.length / 2 ? 'left' : 'right')
  return (
    <ul className={layout} aria-label="Indexed and verified by">
      {logos.map((l, i) => (
        <li key={l.id}><IndexLogo logo={l} look={look} opensUp={look === 'footer'} align={align(i)} /></li>
      ))}
    </ul>
  )
}

/** Grid for the Indexing & Abstracting page: logo, one-line description and a direct "Verify listing" link. */
export function IndexingGrid() {
  const logos = visibleLogos()
  return (
    <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
      {logos.map((l, i) => (
        <li key={l.id} className="flex flex-col border-b border-r border-line bg-white p-5">
          <div className="flex h-12 items-center"><IndexLogo logo={l} look="card" align={i % 3 === 2 ? 'right' : 'left'} /></div>
          <h3 className="mt-3 font-serif text-lg font-semibold text-navy">{l.name}</h3>
          <p className="mt-1 text-sm text-ink-muted">{l.description}</p>
          <p className="mt-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs">
            <span className="whitespace-nowrap rounded-sm border border-line bg-paper px-1.5 py-0.5 font-semibold uppercase tracking-wide text-ink-muted">{l.status}</span>
            <a href={l.verifyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-scholar hover:underline">Verify listing<OpenInNew className="h-3.5 w-3.5" aria-hidden /><span className="sr-only"> (opens in a new tab)</span></a>
          </p>
        </li>
      ))}
    </ul>
  )
}

export const AllListingsLink = ({ className = '' }: { className?: string }) => (
  <AppLink to={paths.about('indexing')} className={`text-sm font-semibold text-scholar hover:underline ${className}`}>All indexing details →</AppLink>
)
