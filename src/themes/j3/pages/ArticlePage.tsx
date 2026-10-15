// Article page for IJCSD ("Academic Editorial & Press"): a title block (breadcrumb, DOI strip, title, author cards, dark action toolbar), then a three-column reading view:
// a left rail (outline, record, PDF), the manuscript column, and a right rail (impact, notes on the references cited in the section being read, how to cite).
// One compact sticky bar while reading (it swaps with the site header, never stacks with it), figures and tables, a bottom action dock and an end-of-article section.
import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineMenuBook, MdOutlineShare as ShareIcon, MdOutlineThumbUp } from 'react-icons/md'
import { RecommendDialogJ3 } from '../components/RecommendDialogJ3'
import { J3CertificateDialog } from '../components/J3Certificate'
import { DoubleBlindBox } from '../components/DoubleBlindBox'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { copyText, downloadText } from '../../../core/lib/clipboard'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { getScholarMeta } from '../../../core/lib/scholar'
import { AppLink } from '../../../core/router'
import type { ArticleFigure, ArticleFull, ArticleTable, Reference } from '../../../core/types'
import { portraitFor } from '../../../mock-data/shared/portraits'
import { ArticleListItem } from '../components/ArticleListItem'
import { CiteMenu } from '../components/CiteMenu'
import { LightboxDialog } from '../components/LightboxDialog'
import { cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { ArrowRight, ChevronDown, Copy, Download, Eye, OpenAccess, OpenInNew, Quote, Verified } from '../icons'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const BODY_TEXT = 'font-inter text-[17px] leading-[28px] text-mauve-700'
const H2 = 'font-jakarta text-[1.375rem] font-bold leading-tight text-night-900 sm:text-[1.5rem]'
const LABEL = 'font-jakarta text-[11px] font-bold uppercase tracking-[0.08em] text-mauve-600'
const RULE = 'border-j3paper-rule'
const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 rounded-tile bg-iris-700 font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-iris-800'
const BTN_OUTLINE = 'inline-flex items-center justify-center gap-2 rounded-tile border border-j3paper-rule bg-white font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-night-900 hover:border-iris-700 hover:bg-j3paper-cool'
const DOCK_H = 48

// ---------- citations in text ----------
const CITE = /\[(\d+(?:\s*[,–-]\s*\d+)*)\]/g
function expand(s: string): number[] {
  const out: number[] = []
  s.split(',').forEach((part) => {
    const [a, b] = part.split(/[–-]/).map((x) => parseInt(x.trim(), 10))
    if (b && b >= a && b - a < 20) for (let n = a; n <= b; n++) out.push(n)
    else if (!Number.isNaN(a)) out.push(a)
  })
  return out
}
/** Reference numbers cited in a paragraph, in order and without repeats. */
function citedIn(text: string, count: number): number[] {
  const out: number[] = []
  for (const m of text.matchAll(CITE)) expand(m[1]).forEach((n) => { if (n >= 1 && n <= count && !out.includes(n)) out.push(n) })
  return out
}

function RefText({ r, doi = true }: { r: Reference; doi?: boolean }) {
  return (
    <>
      {r.text}
      {doi && r.doi && <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="font-semibold text-iris-700 underline underline-offset-2 hover:text-iris-800">doi:{r.doi}<span className="sr-only"> (opens in a new tab)</span></a></>}
    </>
  )
}

/** A card of the side rails: hairline border, small uppercase heading with the 8px orange square marker. */
function RailCard({ title, aside, children, className, id }: { title: string; aside?: string; children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} aria-label={title} className={cx('border bg-white p-4', RULE, className)}>
      <div className={cx('flex items-center justify-between gap-2 border-b pb-2.5', RULE)}>
        <h2 className="flex items-center gap-2 font-jakarta text-xs font-bold uppercase tracking-[0.08em] text-night-900"><span aria-hidden="true" className="h-2 w-2 shrink-0 bg-ember-500" />{title}</h2>
        {aside && <span className="font-inter text-[11px] tabular-nums text-mauve-600">{aside}</span>}
      </div>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** One paragraph. Citations are compact "[1,2]" links; hovering or focusing one highlights its note in the right rail (wide screens) or opens it under the paragraph (smaller screens). */
function Paragraph({ id, text, refs, hot, setHot }: { id: string; text: string; refs: Reference[]; hot: number | null; setHot: (n: number | null) => void }) {
  const [open, setOpen] = useState<number[]>([])
  const nodes = useMemo(() => {
    const out: (string | { key: number; nums: number[] })[] = []
    let last = 0
    for (const m of text.matchAll(CITE)) {
      const idx = m.index ?? 0
      out.push(text.slice(last, idx))
      const nums = expand(m[1]).filter((n) => n >= 1 && n <= refs.length)
      out.push(nums.length ? { key: idx, nums } : m[0])
      last = idx + m[0].length
    }
    out.push(text.slice(last))
    return out
  }, [text, refs.length])
  const toggle = (n: number) => setOpen((l) => (l.includes(n) ? l.filter((x) => x !== n) : [...l, n]))
  const goTo = (n: number) => { const el = document.getElementById(`ref-${n}`); el?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'center' }); el?.focus({ preventScroll: true }) }

  return (
    <div id={id} onKeyDown={(e) => { if (e.key === 'Escape' && open.length) setOpen([]) }}>
      <p className={BODY_TEXT}>
        {nodes.map((node, i) => {
          if (typeof node === 'string') return <Fragment key={i}>{node}</Fragment>
          return (
            <span key={`${node.key}-${i}`} className="whitespace-nowrap">[{node.nums.map((n, j) => (
              <Fragment key={n}>{j > 0 && ','}
                <button type="button" aria-expanded={open.includes(n)} aria-label={`Reference ${n}`} onClick={() => toggle(n)}
                  onMouseEnter={() => setHot(n)} onMouseLeave={() => setHot(null)} onFocus={() => setHot(n)} onBlur={() => setHot(null)}
                  className={cx('px-px font-jakarta text-[0.95em] font-bold text-ember-700 hover:underline focus-visible:underline', hot === n && 'bg-j3paper-deep')}>{n}</button>
              </Fragment>
            ))}]</span>
          )
        })}
      </p>
      {open.length > 0 && (
        <div className="mt-3 space-y-2 min-[1320px]:hidden">
          {open.map((n) => (
            <p key={n} role="note" className="border-l-2 border-ember-500 bg-j3paper-deep p-4 font-inter text-[13px] leading-[1.5] text-mauve-800">
              <span className="font-bold text-ember-700">[{n}]</span> <RefText r={refs[n - 1]} />{' '}
              <button type="button" onClick={() => goTo(n)} className="font-bold text-iris-700 underline underline-offset-2">Go to reference</button>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- table and figure ----------
function DataTable({ table, index }: { table: ArticleTable; index: number }) {
  const caption = table.caption.replace(/^Table\s+\d+[.:|]?\s*/i, '')
  return (
    <div className={cx('border bg-j3paper-cool p-3 sm:p-4', RULE)}>
      <div role="region" aria-label={`Table ${index}. ${caption}`} tabIndex={0} className={cx('max-h-[26rem] overflow-auto border bg-white', RULE)}>
        <table className="w-full min-w-[460px] border-collapse text-left font-inter text-[15px]">
          <caption className="caption-top bg-j3paper-cool pb-3 text-left font-inter text-sm text-night-900"><strong className="font-bold">Table {index}</strong> <span aria-hidden="true">|</span> {caption}</caption>
          <thead><tr>{table.head.map((h) => <th key={h} scope="col" className={cx('sticky top-0 border-b bg-j3paper-cool px-4 py-3 font-jakarta text-[11px] font-bold uppercase tracking-[0.06em] text-mauve-600', RULE)}>{h}</th>)}</tr></thead>
          <tbody>{table.rows.map((r, i) => <tr key={i} className={cx('border-b last:border-b-0', RULE)}>{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-2.5 font-semibold text-night-900">{c}</th> : <td key={j} className="px-4 py-2.5 tabular-nums text-mauve-700">{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}

function niceMax(v: number) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  const f = v / p
  return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p
}

function BarChart({ fig, big }: { fig: ArticleFigure; big?: boolean }) {
  const n = fig.values.length
  const rotate = n > 5 || fig.labels.some((l) => l.length > 10)
  const W = 640, H = big ? 420 : 320
  const m = { l: 62, r: 16, t: 24, b: rotate ? 104 : 58 }
  const iw = W - m.l - m.r, ih = H - m.t - m.b
  const max = niceMax(Math.max(...fig.values, 0))
  const bw = iw / Math.max(n, 1)
  const y = (v: number) => m.t + ih - (v / max) * ih
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true" className="h-auto w-full min-w-[520px] font-inter">
      {[0, 1, 2, 3, 4].map((t) => {
        const v = (max / 4) * t
        return (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke="#DAD5E6" strokeWidth={t === 0 ? 1.5 : 1} />
            <text x={m.l - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#544E68">{fmt(v)}</text>
          </g>
        )
      })}
      {fig.values.map((v, i) => {
        const x = m.l + bw * i + bw * 0.2
        return (
          <g key={i}>
            <rect x={x} y={y(v)} width={bw * 0.6} height={m.t + ih - y(v)} fill={i % 2 ? '#7B66B6' : '#4B2E9B'} />
            <text x={x + bw * 0.3} y={y(v) - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1B1430">{fmt(v)}</text>
            <text transform={rotate ? `translate(${x + bw * 0.3} ${m.t + ih + 14}) rotate(-35)` : undefined} x={rotate ? 0 : x + bw * 0.3} y={rotate ? 0 : m.t + ih + 18}
              textAnchor={rotate ? 'end' : 'middle'} fontSize="12" fill="#544E68">{fig.labels[i]}</text>
          </g>
        )
      })}
      <text x={m.l + iw / 2} y={H - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1B1430">{fig.xLabel}</text>
      <text transform={`translate(14 ${m.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1B1430">{fig.yLabel}</text>
    </svg>
  )
}

function Figure({ fig, index }: { fig: ArticleFigure; index: number }) {
  const [open, setOpen] = useState(false)
  const caption = fig.caption.replace(/^Figure\s+\d+\.\s*/i, '') // the data already starts with "Figure N."
  const summary = fig.labels.map((l, i) => `${l}: ${fig.values[i]}`).join('; ')
  return (
    <figure className={cx('border bg-j3paper-cool p-3 sm:p-4', RULE)}>
      <div className={cx('overflow-x-auto border bg-white p-2', RULE)}><BarChart fig={fig} /></div>
      {/* Data table for screen readers. It sits in a clipped wrapper because a table itself ignores the clipping that hides sr-only content. */}
      <div className="sr-only">
        <table>
          <caption>{fig.caption}</caption>
          <thead><tr><th scope="col">{fig.xLabel}</th><th scope="col">{fig.yLabel}</th></tr></thead>
          <tbody>{fig.labels.map((l, i) => <tr key={l}><th scope="row">{l}</th><td>{fig.values[i]}</td></tr>)}</tbody>
        </table>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-start justify-between gap-3 font-inter text-sm text-mauve-700">
        <span className="min-w-0 flex-1"><strong className="font-bold text-night-900">Figure {index}.</strong> {caption}</span>
        <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={cx(BTN_OUTLINE, 'shrink-0 px-3 py-1.5 text-[11px]')}>Enlarge figure</button>
      </figcaption>
      <LightboxDialog open={open} onClose={() => setOpen(false)} label={`Figure ${index}: ${caption}`}>
        <h3 className="pr-14 font-jakarta text-[1.3125rem] font-bold leading-snug text-night-900">Figure {index}. {caption}</h3>
        <div role="img" aria-label={`Bar chart. ${fig.yLabel} by ${fig.xLabel}. ${summary}`} className="mt-5 overflow-x-auto"><BarChart fig={fig} big /></div>
      </LightboxDialog>
    </figure>
  )
}

// ---------- title block ----------
/** The green "iD" mark that stands for an ORCID iD; a link when the author has one. */
function OrcidMark({ orcid, name }: { orcid?: string; name?: string }) {
  const mark = <span aria-hidden="true" className="inline-flex h-4 items-center justify-center rounded-tile bg-j3valid-100 px-1 font-inter text-[10px] font-extrabold leading-none text-j3valid-800">iD</span>
  if (!orcid) return mark
  return <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer" title={`ORCID iD: ${orcid}`} aria-label={`ORCID iD for ${name} (opens in a new tab)`} className="inline-flex">{mark}</a>
}

function initials(name: string) {
  return name.replace(/^(Prof|Dr)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
}

function AuthorCard({ article, index, num, onCert }: { article: ArticleFull; index: number; num: (n: number) => number; onCert: (i: number) => void }) {
  const a = article.authorDetails[index]
  const photo = a.photo ?? portraitFor(a.name)
  const affs = [...new Set(a.affiliations)].sort((x, y) => num(x) - num(y))
  const nums = affs.map(num)
  return (
    <li className={cx('flex flex-col justify-between border bg-white p-3.5 transition-colors hover:border-iris-700 motion-reduce:transition-none', RULE)}>
      <div className="flex items-start gap-3.5">
        {photo
          ? <img src={photo} alt="" width={64} height={64} loading="lazy" className={cx('h-16 w-16 shrink-0 rounded-full border-2 object-cover', a.corresponding ? 'border-iris-700' : RULE)} />
          : <span aria-hidden="true" className={cx('flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 bg-j3paper-deep font-jakarta text-lg font-bold text-iris-700', a.corresponding ? 'border-iris-700' : RULE)}>{initials(a.name)}</span>}
        <div className="min-w-0 space-y-1">
          <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-jakarta text-[15px] font-bold leading-snug text-night-900">
            <span>{a.name}{nums.length > 0 && <sup className="ml-0.5 font-inter text-[11px] font-bold text-mauve-600">{nums.join(',')}{a.corresponding && '*'}</sup>}</span>
            {a.orcid && <OrcidMark orcid={a.orcid} name={a.name} />}
          </p>
          {affs.map((n) => <p key={n} className="font-inter text-[12px] leading-snug text-mauve-600"><sup className="mr-0.5 font-bold">{num(n)}</sup>{article.affiliations[n - 1]}</p>)}
        </div>
      </div>
      <div className={cx('mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5', RULE)}>
        <span className={cx('px-1.5 py-0.5 font-jakarta text-[10px] font-bold uppercase tracking-[0.06em]', a.corresponding ? 'bg-j3paper-deep text-iris-700' : 'bg-j3paper-cool text-mauve-600')}>{a.corresponding ? 'Corresponding author' : index === 0 ? 'First author' : 'Author'}</span>
        {a.orcid && <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noreferrer" className="font-inter text-[11px] font-semibold text-iris-700 underline underline-offset-2 hover:text-iris-800">ORCID profile<span className="sr-only"> for {a.name} (opens in a new tab)</span></a>}
        <button type="button" onClick={() => onCert(index)} className="inline-flex items-center gap-1 border border-j3paper-rule bg-white px-2 py-1 font-jakarta text-[10px] font-bold uppercase tracking-[0.06em] text-iris-700 hover:border-iris-700"><Download className="h-3.5 w-3.5" aria-hidden="true" />Download certificate</button>
      </div>
    </li>
  )
}

export function ArticlePage({ article }: { article: ArticleFull }) {
  const toast = useToast()
  const { tags, jsonLd } = getScholarMeta(article)
  const doi = doiFor(article.paperId)
  const doiUrl = `https://doi.org/${doi}`
  const scholarUrl = (r: Reference) => `https://scholar.google.com/scholar?q=${encodeURIComponent(r.text.slice(0, 180))}`

  // Affiliations: only the ones the authors use, numbered in order of first use, so the numbers always match.
  const affOrder = useMemo(() => {
    const order: number[] = []
    article.authorDetails.forEach((a) => a.affiliations.forEach((n) => { if (!order.includes(n)) order.push(n) }))
    return order
  }, [article.authorDetails])
  const affNum = useCallback((n: number) => affOrder.indexOf(n) + 1, [affOrder])
  const correspondingAuthors = article.authorDetails.filter((a) => a.corresponding)

  const toc = useMemo(() => [
    { id: 'abstract', label: 'Abstract' },
    ...article.sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })),
    { id: 'declarations', label: 'Declarations' },
    { id: 'references', label: `References (${article.references.length})` },
    { id: 'how-to-cite', label: 'How to cite' },
  ], [article.sections, article.references.length])
  const [certIdx, setCertIdx] = useState<number | null>(null)
  const [recommendOpen, setRecommendOpen] = useState(false)
  const [current, setCurrent] = useState(toc[0].id)
  const [jumpOpen, setJumpOpen] = useState(false)
  const [hot, setHot] = useState<number | null>(null)
  const [pastTitle, setPastTitle] = useState(false)
  const [scrollingDown, setScrollingDown] = useState(false)
  const [dockVisible, setDockVisible] = useState(false)
  const [citeStyle, setCiteStyle] = useState<CitationStyle>('apa')
  const fill = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const titleBlock = useRef<HTMLElement>(null)
  const jumpBtn = useRef<HTMLButtonElement>(null)
  const jumpPanel = useRef<HTMLDivElement>(null)
  const jumpId = useId()

  // The compact bar replaces the site header once the title block is behind the reader and they scroll down; scrolling up brings the header back.
  const compact = pastTitle && scrollingDown
  useEffect(() => {
    document.documentElement.dataset.articleCompact = compact ? '1' : ''
    return () => { delete document.documentElement.dataset.articleCompact }
  }, [compact])

  // One scroll listener: reading progress, direction, whether the title block has passed, and when the dock shows.
  useEffect(() => {
    let raf = 0, last = window.scrollY, idle = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const dy = y - last
      const past = (titleBlock.current?.getBoundingClientRect().bottom ?? 1) < 0
      setPastTitle(past)
      if (Math.abs(dy) > 4) {
        const down = dy > 0
        setScrollingDown(down)
        last = y
        window.clearTimeout(idle)
        if (!past) setDockVisible(false)
        else if (down) { setDockVisible(false); idle = window.setTimeout(() => setDockVisible(true), 1100) }
        else setDockVisible(true)
      } else if (!past) setDockVisible(false)
      const el = body.current
      if (el && fill.current) {
        const r = el.getBoundingClientRect()
        const total = r.height - window.innerHeight * 0.6
        fill.current.style.transform = `scaleX(${Math.max(0, Math.min(1, total > 0 ? -r.top / total : 0))})`
      }
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', on, { passive: true })
    window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); window.clearTimeout(idle); if (raf) cancelAnimationFrame(raf) }
  }, [])

  // Current section: drives the outline, the Jump to menu and the notes in the right rail.
  useEffect(() => {
    const els = toc.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[]
    const seen = new Set<string>()
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target.id) : seen.delete(e.target.id)))
      const first = toc.find((t) => seen.has(t.id))
      if (first) setCurrent(first.id)
    }, { rootMargin: '-15% 0px -65% 0px' })
    els.forEach((e) => obs.observe(e))
    return () => obs.disconnect()
  }, [toc])

  // References cited in the section being read (plus the one under the pointer), shown as notes in the right rail.
  const railNotes = useMemo(() => {
    const sec = article.sections.find((s) => s.id === current)
    const nums = sec ? [...new Set(sec.paragraphs.flatMap((p) => citedIn(p, article.references.length)))] : []
    if (hot && !nums.includes(hot)) nums.unshift(hot)
    return nums
  }, [article, current, hot])

  const closeJump = useCallback((refocus: boolean) => { setJumpOpen(false); if (refocus) jumpBtn.current?.focus() }, [])
  useEffect(() => {
    if (!jumpOpen) return
    jumpPanel.current?.querySelector<HTMLElement>('[aria-current="location"]')?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); closeJump(true); return }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const items = [...(jumpPanel.current?.querySelectorAll<HTMLElement>('button') ?? [])]
        const i = items.indexOf(document.activeElement as HTMLElement)
        if (i < 0) return
        e.preventDefault()
        items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus()
      }
    }
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (!jumpPanel.current?.contains(t) && !jumpBtn.current?.contains(t)) closeJump(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onDown)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onDown) }
  }, [jumpOpen, closeJump])
  useEffect(() => { if (!compact) setJumpOpen(false) }, [compact])

  const jumpTo = (id: string) => {
    const el = document.getElementById(id)
    setJumpOpen(false)
    if (!el) return
    el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' })
    el.focus({ preventScroll: true })
    setCurrent(id)
  }

  const copyDoi = async () => { const ok = await copyText(doiUrl); toast(ok ? 'DOI copied' : 'Could not copy the DOI', ok ? 'success' : 'error') }
  const share = async () => {
    const url = window.location.href
    if (typeof navigator.share === 'function') {
      try { await navigator.share({ title: article.title, url }) } catch { /* the reader closed the share sheet */ }
      return
    }
    const ok = await copyText(url)
    toast(ok ? 'Link copied' : 'Could not copy the link', ok ? 'success' : 'error')
  }
  const download = () => { downloadArticlePdf(article); toast(`${article.paperId}.pdf downloaded`) }
  const citation = formatCitation(article, citeStyle)
  const exportFile = citeStyle === 'bibtex' || citeStyle === 'ris'
  const copyCitation = async () => { const ok = await copyText(citation); toast(ok ? 'Citation copied' : 'Could not copy the citation', ok ? 'success' : 'error') }

  let figureNo = 0
  let tableNo = 0
  const dockBtn = 'inline-flex h-12 items-center justify-center gap-1.5 px-1 font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-iris-800 focus-visible:!outline-white sm:h-10 sm:px-4'
  const darkBtn = 'inline-flex h-10 items-center justify-center gap-2 rounded-tile border border-white/25 bg-white/5 px-3.5 font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-white/15'
  // Rails: static below 1320px; beside the text, sticky below the site navigation, with their own scroll when taller than the window.
  const railSticky = 'min-[1320px]:sticky min-[1320px]:top-24 min-[1320px]:max-h-[calc(100vh-7rem)] min-[1320px]:overflow-y-auto'

  return (
    <div className="bg-white">
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={article.abstract.slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Compact sticky bar: it takes the place of the site header while reading, so two bars are never stacked. */}
      <div className={cx('fixed inset-x-0 top-0 z-[55] border-b bg-white transition-[transform,visibility] duration-200 motion-reduce:transition-none', RULE, compact ? 'visible translate-y-0' : 'invisible -translate-y-full')} aria-hidden={!compact}>
        <div className="relative mx-auto flex h-[60px] max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className="shrink-0"><img src="/journals/j3/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" /></AppLink>
          <p className="hidden min-w-0 flex-1 truncate font-jakarta text-sm font-bold text-night-900 md:block">{article.title}</p>
          <button ref={jumpBtn} type="button" aria-expanded={jumpOpen} aria-controls={jumpOpen ? jumpId : undefined} onClick={() => setJumpOpen((v) => !v)} tabIndex={compact ? 0 : -1}
            className={cx('ml-auto inline-flex h-9 max-w-[60vw] items-center gap-2 rounded-tile border bg-j3paper-cool px-3 font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-night-900 hover:border-iris-700 md:ml-0', RULE)}>
            <span className="text-mauve-600">Jump to</span>
            <span className="max-w-[28vw] truncate text-iris-700 sm:max-w-[10rem]">{toc.find((t) => t.id === current)?.label}</span>
            <ChevronDown className={cx('h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none', jumpOpen && 'rotate-180')} aria-hidden="true" />
          </button>
          <button type="button" onClick={download} tabIndex={compact ? 0 : -1} className={cx(BTN_PRIMARY, 'hidden h-9 shrink-0 px-4 sm:inline-flex')}><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download PDF</button>
          {jumpOpen && (
            <div ref={jumpPanel} id={jumpId} className={cx('absolute right-4 top-full z-40 mt-1 max-h-[60vh] w-[min(22rem,calc(100vw-2rem))] overflow-auto border border-t-2 border-t-iris-700 bg-white p-1 shadow-dock motion-safe:animate-fade-in sm:right-6 lg:right-8', RULE)}>
              <ul>
                {toc.map((t) => (
                  <li key={t.id}>
                    <button type="button" aria-current={current === t.id ? 'location' : undefined} onClick={() => jumpTo(t.id)}
                      className={cx('w-full px-4 py-2.5 text-left font-inter text-sm font-semibold', current === t.id ? 'bg-iris-700 text-white' : 'text-night-900 hover:bg-j3paper-cool')}>{t.label}</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[3px] bg-transparent"><div ref={fill} className="h-full origin-left bg-iris-700" style={{ transform: 'scaleX(0)' }} /></div>
      </div>

      <article style={{ paddingBottom: DOCK_H + 24 }}>
        {/* Title block */}
        <header ref={titleBlock} className={cx('border-b pb-6', RULE)}>
          <div className="mx-auto max-w-[1440px] space-y-4 px-4 pt-5 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-2 font-inter text-xs">
              <nav aria-label="Breadcrumb">
                <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-mauve-600">
                  <li><AppLink to={paths.home} className="hover:text-iris-700 hover:underline">{journal.shortName}</AppLink></li>
                  <li aria-hidden="true">/</li>
                  <li><AppLink to={paths.issue(article.volume, article.issue)} className="hover:text-iris-700 hover:underline">Vol. {article.volume} ({formatMonthYear(article.publishedAt).split(' ').pop()}), Issue {article.issue}</AppLink></li>
                  <li aria-hidden="true">/</li>
                  <li><AppLink to={paths.search(article.subject)} className="hover:text-iris-700 hover:underline">{article.subject}</AppLink></li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="font-bold text-night-900">{article.type}</li>
                </ol>
              </nav>
              <p className="tabular-nums text-mauve-600">ISSN {journal.issnOnline}{article.pages && <> <span aria-hidden="true">&middot;</span> Pages {article.pages}</>}</p>
            </div>

            {/* Badges, DOI and the editorial timeline */}
            <div className={cx('space-y-3 border bg-j3paper-cool p-4', RULE)}>
              <div className={cx('flex flex-wrap items-center gap-2 border-b pb-3', RULE)}>
                <span className="rounded-tile bg-iris-700 px-2.5 py-1 font-jakarta text-[10px] font-bold uppercase tracking-[0.08em] text-white">{article.type}</span>
                <span className="inline-flex items-center gap-1 rounded-tile bg-j3paper-deep px-2.5 py-1 font-jakarta text-[10px] font-bold uppercase tracking-[0.08em] text-night-900"><OpenAccess className="h-3.5 w-3.5 text-ember-700" aria-hidden="true" />Open access ({journal.licence.name})</span>
                <span className="rounded-tile border border-j3paper-rule bg-white px-2.5 py-1 font-inter text-[11px] font-semibold tabular-nums text-mauve-700">{article.paperId}</span>
              </div>
              <div className="flex flex-col items-start justify-between gap-3 border border-iris-700 bg-white p-3 md:flex-row md:items-center">
                <div className="min-w-0">
                  <p className={LABEL}>Persistent DOI</p>
                  <a href={doiUrl} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex max-w-full items-center gap-1 break-all font-inter text-sm font-bold text-iris-700 hover:underline">{doiUrl}<OpenInNew className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button type="button" onClick={copyDoi} aria-label={`Copy DOI ${doi}`} className={cx(BTN_OUTLINE, 'h-8 px-3 text-[11px]')}><Copy className="h-4 w-4" aria-hidden="true" />Copy DOI</button>
                </div>
              </div>
              <dl className="flex flex-wrap items-center gap-x-6 gap-y-1.5 font-inter text-xs text-mauve-600">
                {[['Pagination', article.pages || `Vol. ${article.volume}, Issue ${article.issue}`]].map(([k, v]) => (
                  <div key={k} className="flex items-baseline gap-1.5"><dt className="font-bold text-night-900">{k}:</dt><dd className="tabular-nums">{v}</dd></div>
                ))}
                <div className="flex items-baseline gap-1.5"><dt className="font-bold text-night-900">Licence:</dt><dd><a href={journal.licence.url} target="_blank" rel="noreferrer" className="text-iris-700 underline underline-offset-2 hover:text-iris-800">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a></dd></div>
              </dl>
            </div>

            <h1 className="font-jakarta font-extrabold leading-[1.15] tracking-tight text-night-900" style={{ fontSize: 'clamp(26px,2.6vw,36px)', maxWidth: '58ch' }}>{article.title}</h1>

            {/* Authors */}
            <section aria-labelledby="authors-h" className={cx('space-y-3 border bg-white p-4', RULE)}>
              <h2 id="authors-h" className={cx(LABEL, 'border-b pb-2', RULE)}>Authors &amp; institutional affiliations</h2>
              <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {article.authorDetails.map((_, i) => <AuthorCard key={i} article={article} index={i} num={affNum} onCert={setCertIdx} />)}
              </ul>
              {correspondingAuthors.length > 0 && (
                <p className={cx('border-t pt-2 font-inter text-[12px] text-mauve-600', RULE)}>* Corresponding author: {correspondingAuthors.map((a) => a.name).join(', ')}.</p>
              )}
            </section>

            {/* Action toolbar and metrics ribbon */}
            <div className="flex flex-col items-stretch justify-between gap-3 bg-night-900 p-3 lg:flex-row lg:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={download} className="inline-flex h-10 items-center justify-center gap-2 rounded-tile bg-ember-500 px-4 font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-night-900 hover:bg-ember-400"><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download PDF</button>
                <CiteMenu article={article} className={darkBtn}><Quote className="h-[18px] w-[18px]" aria-hidden="true" />Cite this article<ChevronDown className="h-4 w-4" aria-hidden="true" /></CiteMenu>
                <a href="#abstract" onClick={(e) => { e.preventDefault(); document.getElementById('abstract')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} className={darkBtn}><MdOutlineMenuBook className="h-[18px] w-[18px]" aria-hidden="true" />Read online</a>
                <button type="button" onClick={() => setRecommendOpen(true)} className={darkBtn}><MdOutlineThumbUp className="h-[18px] w-[18px]" aria-hidden="true" />Recommend this paper</button>
                <button type="button" onClick={share} className={darkBtn}><ShareIcon className="h-[18px] w-[18px]" aria-hidden="true" />Share</button>
              </div>
              <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 border border-white/15 px-3 py-2 font-inter text-xs text-j3paper-rule">
                {[[Eye, 'Views', article.views], [Download, 'Downloads', article.downloads], [Quote, 'Citations', article.citations]].map(([Icon, label, n]) => {
                  const I = Icon as typeof Eye
                  return <div key={label as string} className="flex items-center gap-1.5"><I className="h-4 w-4 text-white" aria-hidden="true" /><dt>{label as string}</dt><dd className="font-bold tabular-nums text-white">{formatNumber(n as number)}</dd></div>
                })}
              </dl>
            </div>
          </div>
        </header>

        {/* Reading area: left rail, manuscript column, right rail. */}
        <div className="mx-auto max-w-[1440px] px-4 pt-8 sm:px-6 lg:px-8">
          <div ref={body} className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)] min-[1320px]:grid-cols-[280px_minmax(0,1fr)_300px]">
            {/* LEFT RAIL */}
            <aside aria-label="Article navigation and record" className="hidden space-y-4 lg:row-span-2 lg:block lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto min-[1320px]:row-span-1">
              <RailCard title="Article outline" aside={`${toc.length} sections`}>
                <nav aria-label="Article outline">
                  <ul className="space-y-0.5 font-inter text-[13px]">
                    {toc.map((t) => (
                      <li key={t.id}>
                        <button type="button" aria-current={current === t.id ? 'location' : undefined} onClick={() => jumpTo(t.id)}
                          className={cx('block w-full rounded-tile px-2.5 py-1.5 text-left leading-snug', current === t.id ? 'bg-iris-700 font-semibold text-white' : 'text-mauve-700 hover:bg-j3paper-cool hover:text-iris-700')}>{t.label}</button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </RailCard>
              <button type="button" onClick={download} className={cx(BTN_PRIMARY, 'h-11 w-full')}><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download article PDF</button>
              <RailCard title="Article record">
                <dl className="space-y-2.5 font-inter text-[13px]">
                  {[['Paper ID', article.paperId], ['Article type', article.type], ['Subject', article.subject], ['Issue', `Vol. ${article.volume}, Issue ${article.issue}`], ['Published', formatDate(article.publishedOnline)], ['Licence', journal.licence.name]].map(([k, v]) => (
                    <div key={k}><dt className="font-jakarta text-[10px] font-bold uppercase tracking-[0.08em] text-mauve-600">{k}</dt><dd className="mt-0.5 break-words font-semibold text-night-900">{v}</dd></div>
                  ))}
                </dl>
              </RailCard>
              <RailCard title="Subject classification">
                <dl className="space-y-2.5 font-inter text-[13px]">
                  {[['Article type', article.type], ['Subject', article.subject]].map(([k, v]) => (
                    <div key={k}><dt className="font-jakarta text-[10px] font-bold uppercase tracking-[0.08em] text-mauve-600">{k}</dt><dd className="mt-0.5 font-semibold text-night-900">{v}</dd></div>
                  ))}
                </dl>
              </RailCard>
              <RailCard title="Ethics & compliance">
                <ul className="space-y-2 font-inter text-[13px] leading-snug text-night-700">
                  {['Double-blind peer reviewed', 'Follows COPE-style publication ethics', 'Similarity screening before publication', `Open access under ${journal.licence.name}`].map((t) => (
                    <li key={t} className="flex items-start gap-2"><Verified className="mt-0.5 h-4 w-4 shrink-0 text-j3valid-700" aria-hidden="true" />{t}</li>
                  ))}
                </ul>
                <AppLink to={paths.policy('publication-ethics')} className="mt-3 inline-block font-inter text-xs font-semibold text-iris-700 underline underline-offset-2 hover:text-iris-800">Read the publication ethics policy</AppLink>
              </RailCard>
              <RailCard title="Digital preservation">
                <p className="font-inter text-[13px] leading-relaxed text-night-700">This article has a permanent Crossref DOI, so its link never breaks, and it is kept in the journal&apos;s digital archive.</p>
                <AppLink to={paths.policy('archiving')} className="mt-3 inline-block font-inter text-xs font-semibold text-iris-700 underline underline-offset-2 hover:text-iris-800">Read the digital archiving policy</AppLink>
              </RailCard>
            </aside>

            {/* MANUSCRIPT COLUMN */}
            <div className="min-w-0 max-w-[740px] min-[1320px]:justify-self-center">
              <DoubleBlindBox className="mb-5" />
              <section id="abstract" tabIndex={-1} aria-labelledby="abstract-h" className="scroll-mt-24 focus:outline-none">
                <div className={cx('space-y-4 border bg-white p-5 sm:p-6', RULE)}>
                  <div className={cx('flex items-center justify-between border-b pb-3', RULE)}>
                    <h2 id="abstract-h" className={cx(H2, 'flex items-center gap-2.5 text-[1.125rem] uppercase tracking-[0.06em] sm:text-[1.125rem]')}><span aria-hidden="true" className="h-2 w-2 shrink-0 bg-ember-500" />Abstract</h2>
                    <span className="font-inter text-[11px] tabular-nums text-mauve-600">{article.abstract.split(/\s+/).length} words</span>
                  </div>
                  <p className={BODY_TEXT}>{article.abstract}</p>
                  {article.keywords.length > 0 && (
                    <div className={cx('flex flex-wrap items-center gap-2 border-t pt-4', RULE)}>
                      <h3 className="font-jakarta text-[11px] font-bold uppercase tracking-[0.08em] text-night-900">Keywords</h3>
                      <ul className="flex flex-wrap gap-1.5">
                        {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className={cx('inline-flex h-7 items-center rounded-tile border bg-j3paper-cool px-2.5 font-inter text-xs font-medium text-iris-700 hover:border-iris-700 hover:bg-j3paper-deep', RULE)}>{k}</AppLink></li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {article.sections.map((s, si) => (
                <section key={s.id} id={s.id} tabIndex={-1} aria-labelledby={`${s.id}-h`} className="mt-10 scroll-mt-24 focus:outline-none">
                  <h2 id={`${s.id}-h`} className={cx(H2, 'flex items-baseline gap-2.5 border-b pb-3', RULE)}><span aria-hidden="true" className="h-2 w-2 shrink-0 translate-y-[-3px] bg-ember-500" /><span>{si + 1}. {s.title}</span></h2>
                  <div className="mt-5 space-y-[1.1em]">
                    {s.paragraphs.map((p, pi) => <Paragraph key={pi} id={`para-${si}-${pi}`} text={p} refs={article.references} hot={hot} setHot={setHot} />)}
                  </div>
                  {s.table && <div className="mt-6"><DataTable table={s.table} index={++tableNo} /></div>}
                  {s.figure && <div className="mt-6"><Figure fig={s.figure} index={++figureNo} /></div>}
                </section>
              ))}

              <section id="declarations" tabIndex={-1} aria-labelledby="declarations-h" className="mt-10 scroll-mt-24 focus:outline-none">
                <h2 id="declarations-h" className={cx(H2, 'flex items-baseline gap-2.5 border-b pb-3 text-[1.125rem] uppercase tracking-[0.06em] sm:text-[1.125rem]', RULE)}><span aria-hidden="true" className="h-2 w-2 shrink-0 translate-y-[-2px] bg-ember-500" />Declarations</h2>
                <dl className="mt-4 space-y-3 font-inter text-sm leading-relaxed text-mauve-700">
                  {[
                    ['Licence', `Open access under ${journal.licence.name}. Share and adapt with credit to the authors.`],
                    ['Funding', 'No specific funding was reported for this article.'],
                    ['Conflicts of interest', 'The authors declared no competing interests.'],
                    ['Data availability', 'Data and materials are available from the corresponding author on reasonable request.'],
                  ].map(([k, v]) => <div key={k}><dt className="inline font-bold text-night-900">{k}: </dt><dd className="inline">{v}</dd></div>)}
                </dl>
              </section>

              <section id="references" tabIndex={-1} aria-labelledby="references-h" className="mt-10 scroll-mt-24 focus:outline-none">
                <h2 id="references-h" className={cx(H2, 'flex items-baseline gap-2.5 border-b pb-3', RULE)}><span aria-hidden="true" className="h-2 w-2 shrink-0 translate-y-[-3px] bg-ember-500" /><span>References <span className="font-inter text-base font-semibold text-mauve-600">({article.references.length})</span></span></h2>
                <ol className="mt-5 space-y-4">
                  {article.references.map((r, i) => (
                    <li key={i} id={`ref-${i + 1}`} tabIndex={-1} className="grid grid-cols-[2.25rem_minmax(0,1fr)] font-inter text-[15px] leading-relaxed text-mauve-700 focus:bg-j3paper-deep focus:outline-none">
                      <span className="font-bold tabular-nums text-night-900">{i + 1}.</span>
                      <span className="min-w-0 break-words">
                        <RefText r={r} doi={false} />
                        <span className="mt-1 flex flex-wrap gap-x-4 text-[13px] font-semibold">
                          {r.doi && <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="text-iris-700 underline underline-offset-2 hover:text-iris-800">CrossRef<span className="sr-only"> (opens in a new tab)</span></a>}
                          <a href={scholarUrl(r)} target="_blank" rel="noreferrer" className="text-iris-700 underline underline-offset-2 hover:text-iris-800">Google Scholar<span className="sr-only"> (opens in a new tab)</span></a>
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* RIGHT RAIL */}
            <aside aria-label="Impact, reference notes and citation" className={cx('space-y-4 lg:col-start-2 min-[1320px]:col-start-3 min-[1320px]:row-start-1', railSticky)}>
              <RailCard title="Article impact" className="border-t-2 border-t-iris-700">
                <dl className="grid grid-cols-3 gap-2 text-center">
                  {[[Eye, 'Views', article.views], [Download, 'Downloads', article.downloads], [Quote, 'Citations', article.citations]].map(([Icon, label, n]) => {
                    const I = Icon as typeof Eye
                    return (
                      <div key={label as string} className={cx('flex flex-col items-center border bg-j3paper-cool p-2', RULE)}>
                        <I className="h-4 w-4 text-iris-700" aria-hidden="true" />
                        <dt className="order-3 font-jakarta text-[10px] font-bold uppercase tracking-[0.06em] text-mauve-600">{label as string}</dt>
                        <dd className="order-2 mt-0.5 font-jakarta text-base font-bold tabular-nums text-night-900">{formatNumber(n as number)}</dd>
                      </div>
                    )
                  })}
                </dl>
              </RailCard>

              <RailCard title="Cited here" aside={railNotes.length ? `${railNotes.length} ref${railNotes.length > 1 ? 's' : ''}` : undefined}>
                <div role="region" aria-label="Notes on the references cited in the text" aria-live="off" className="font-inter text-[13px] leading-[1.5]">
                  {railNotes.length === 0 ? (
                    <p className="text-mauve-600">References cited in the section you are reading appear here.</p>
                  ) : (
                    <ul className="max-h-[15rem] space-y-2.5 overflow-auto">
                      {railNotes.map((n) => (
                        <li key={n} onMouseEnter={() => setHot(n)} onMouseLeave={() => setHot(null)}
                          className={cx('border-l-2 py-0.5 pl-3 transition-colors motion-reduce:transition-none', hot === n ? 'border-ember-500 bg-j3paper-deep text-night-900' : 'border-j3paper-rule text-mauve-700')}>
                          <span className="font-bold text-ember-700">[{n}]</span> <RefText r={article.references[n - 1]} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </RailCard>

              <RailCard id="how-to-cite" title="How to cite" aside={`${CITATION_STYLES_WITH_IEEE.length} styles`}>
                <div tabIndex={-1} className="focus:outline-none">
                  <div role="tablist" aria-label="Citation style" className="flex flex-wrap gap-1">
                    {CITATION_STYLES_WITH_IEEE.map((s) => (
                      <button key={s.id} type="button" role="tab" aria-selected={citeStyle === s.id} onClick={() => setCiteStyle(s.id)}
                        className={cx('h-7 rounded-tile px-2 font-jakarta text-[10px] font-bold uppercase tracking-[0.06em]', citeStyle === s.id ? 'bg-iris-700 text-white' : 'border border-j3paper-rule bg-white text-night-900 hover:border-iris-700 hover:bg-j3paper-cool')}>{s.label}</button>
                    ))}
                  </div>
                  <p role="tabpanel" className={cx('mt-3 max-h-48 select-all overflow-auto whitespace-pre-wrap break-words border bg-j3paper-cool p-3 font-inter text-[12px] leading-relaxed text-night-900', RULE)}>{citation}</p>
                  <div className="mt-3 grid grid-cols-2 gap-1.5">
                    <button type="button" onClick={copyCitation} className={cx(BTN_PRIMARY, 'h-9 px-2 text-[11px]', !exportFile && 'col-span-2')}><Copy className="h-4 w-4" aria-hidden="true" />Copy citation</button>
                    {exportFile && <button type="button" onClick={() => { downloadText(citationFilename(article, citeStyle), citation); toast(`${citationFilename(article, citeStyle)} downloaded`) }} className={cx(BTN_OUTLINE, 'h-9 px-2 text-[11px]')}><Download className="h-4 w-4" aria-hidden="true" />{citeStyle === 'ris' ? '.ris' : '.bib'}</button>}
                  </div>
                  <p className={cx('mt-4 border-t pt-3 font-inter text-xs leading-relaxed text-mauve-600', RULE)}>
                    Open access under <a href={journal.licence.url} target="_blank" rel="noreferrer" className="font-semibold text-iris-700 underline underline-offset-2 hover:text-iris-800">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a>.{' '}
                    <AppLink to={paths.verify()} className="inline-flex items-center gap-1 font-semibold text-iris-700 underline underline-offset-2 hover:text-iris-800"><Verified className="h-4 w-4" aria-hidden="true" />Verify an author certificate</AppLink>
                  </p>
                </div>
              </RailCard>

           </aside>
          </div>

          {article.related.length > 0 && (
            <section className={cx('mt-12 border-t pt-8', RULE)} aria-labelledby="more-h">
              <p className={LABEL}>Keep reading</p>
              <h2 id="more-h" className={cx(H2, 'mt-2')}>More from the journal</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {article.related.slice(0, 3).map((a) => <ArticleListItem key={a.paperId} article={a} />)}
              </div>
              <AppLink to={paths.issue(article.volume, article.issue)} className="mt-8 inline-flex items-center gap-1.5 font-jakarta text-xs font-bold uppercase tracking-[0.08em] text-iris-700 underline underline-offset-4 hover:text-iris-800"><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />Back to Vol. {article.volume}, Issue {article.issue}</AppLink>
            </section>
          )}
        </div>
      </article>

      {/* Bottom action dock: only after the title block has passed; it hides while scrolling down and returns on scroll up or after a pause. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center sm:bottom-4 sm:px-3">
        <div role="toolbar" aria-label="Article actions" aria-hidden={!dockVisible}
          className={cx('pointer-events-auto grid w-full grid-cols-4 overflow-hidden bg-iris-700 shadow-dock transition-[transform,visibility] duration-200 motion-reduce:transition-none sm:flex sm:w-auto sm:items-center sm:gap-px sm:rounded-tile sm:p-1',
            dockVisible ? 'visible translate-y-0' : 'invisible translate-y-[130%]')}>
          <button type="button" aria-label="Download PDF" onClick={download} tabIndex={dockVisible ? 0 : -1}
            className="inline-flex h-12 items-center justify-center gap-1.5 bg-white px-1 font-jakarta text-xs font-bold uppercase tracking-[0.06em] text-iris-700 hover:bg-j3paper-cool focus-visible:!outline-iris-700 sm:h-10 sm:px-4"><Download className="h-[18px] w-[18px]" aria-hidden="true" /><span className="sm:hidden">PDF</span><span className="hidden sm:inline">Download PDF</span></button>
          <CiteMenu article={article} className={dockBtn}><Quote className="h-[18px] w-[18px]" aria-hidden="true" />Cite</CiteMenu>
          <button type="button" aria-label="Share article" onClick={share} tabIndex={dockVisible ? 0 : -1} className={dockBtn}><ShareIcon className="h-[18px] w-[18px]" aria-hidden="true" />Share</button>
          <button type="button" aria-label="Copy DOI" onClick={copyDoi} tabIndex={dockVisible ? 0 : -1} className={dockBtn}><Copy className="h-[18px] w-[18px]" aria-hidden="true" /><span className="sm:hidden">DOI</span><span className="hidden sm:inline">Copy DOI</span></button>
        </div>
      </div>
      {certIdx !== null && <J3CertificateDialog key={certIdx} open onClose={() => setCertIdx(null)} initialIndex={certIdx}
        paper={{ paperId: article.paperId, title: article.title, publishedAt: article.publishedAt, authors: article.authorDetails.map((x) => x.name), volume: article.volume, issue: article.issue }} />}
      <RecommendDialogJ3 article={article} open={recommendOpen} onClose={() => setRecommendOpen(false)} />
    </div>
  )
}
