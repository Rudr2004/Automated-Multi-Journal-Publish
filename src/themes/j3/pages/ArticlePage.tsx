// Article page for IJCSD. A dark title block with an article card, one compact sticky bar while reading (it swaps with the site header, never stacks with it),
// a single reading column with margin-note references on wide screens, figures and tables, a bottom action dock and an end-of-article section.
import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineShare as ShareIcon } from 'react-icons/md'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { CITATION_STYLES_WITH_IEEE, citationFilename, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { copyText, downloadText } from '../../../core/lib/clipboard'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { getScholarMeta } from '../../../core/lib/scholar'
import { AppLink } from '../../../core/router'
import type { ArticleFigure, ArticleFull, ArticleTable, Reference } from '../../../core/types'
import { ArticleListItem } from '../components/ArticleListItem'
import { CiteMenu } from '../components/CiteMenu'
import { LightboxDialog } from '../components/LightboxDialog'
import { cx } from '../components/primitives'
import { useToast } from '../components/Toast'
import { ArrowRight, ChevronDown, Copy, Download, Email, Eye, OpenAccess, Quote, Verified } from '../icons'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const BODY_TEXT = 'font-jakarta text-[17px] leading-[1.75] text-night-700 md:text-[18px]'
const H2 = 'font-jakarta text-[1.625rem] font-bold leading-tight text-iris-700 sm:text-[1.875rem]'
const LABEL = 'font-inter text-xs font-semibold uppercase tracking-[0.08em] text-mauve-600'
const BTN_PRIMARY = 'inline-flex items-center justify-center gap-2 bg-iris-700 font-inter text-xs font-bold uppercase tracking-[0.08em] text-white hover:bg-iris-600'
const BTN_OUTLINE = 'inline-flex items-center justify-center gap-2 border border-iris-700 bg-white font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-50'
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
      {doi && r.doi && <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="font-semibold text-iris-700 underline underline-offset-2 hover:text-ember-700">doi:{r.doi}<span className="sr-only"> (opens in a new tab)</span></a></>}
    </>
  )
}

/** One paragraph. Citations are compact "[1,2]" links; hovering or focusing one highlights its margin note (wide screens) or opens it under the paragraph (smaller screens). */
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
                  className={cx('px-px font-jakarta text-[0.95em] font-bold text-ember-700 hover:underline focus-visible:underline', hot === n && 'bg-ember-100')}>{n}</button>
              </Fragment>
            ))}]</span>
          )
        })}
      </p>
      {open.length > 0 && (
        <div className="mt-3 space-y-2 xl:hidden">
          {open.map((n) => (
            <p key={n} role="note" className="border-l-2 border-iris-700 bg-j3paper-cool p-4 font-inter text-[13px] leading-[1.5] text-mauve-800">
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
    <div className="border border-mauve-100 bg-j3paper-cool p-3 sm:p-4">
      <div role="region" aria-label={`Table ${index}. ${caption}`} tabIndex={0} className="max-h-[26rem] overflow-auto bg-white">
        <table className="w-full min-w-[460px] border-collapse text-left font-inter text-[15px]">
          <caption className="caption-top bg-j3paper-cool pb-3 text-left font-inter text-sm text-night-900"><strong className="font-bold">Table {index}</strong> <span aria-hidden="true">|</span> {caption}</caption>
          <thead><tr>{table.head.map((h) => <th key={h} scope="col" className="sticky top-0 border-b-2 border-iris-700 bg-white px-4 py-3 font-inter text-sm font-bold text-iris-700">{h}</th>)}</tr></thead>
          <tbody>{table.rows.map((r, i) => <tr key={i} className="border-b border-mauve-100 last:border-b-0">{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-2.5 font-semibold text-night-900">{c}</th> : <td key={j} className="px-4 py-2.5 tabular-nums text-mauve-700">{c}</td>)}</tr>)}</tbody>
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
            <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke="#E2E8F0" strokeWidth={t === 0 ? 1.5 : 1} />
            <text x={m.l - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#475569">{fmt(v)}</text>
          </g>
        )
      })}
      {fig.values.map((v, i) => {
        const x = m.l + bw * i + bw * 0.2
        return (
          <g key={i}>
            <rect x={x} y={y(v)} width={bw * 0.6} height={m.t + ih - y(v)} fill={i % 2 ? '#3E5F86' : '#0F2B48'} />
            <text x={x + bw * 0.3} y={y(v) - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#0F2B48">{fmt(v)}</text>
            <text transform={rotate ? `translate(${x + bw * 0.3} ${m.t + ih + 14}) rotate(-35)` : undefined} x={rotate ? 0 : x + bw * 0.3} y={rotate ? 0 : m.t + ih + 18}
              textAnchor={rotate ? 'end' : 'middle'} fontSize="12" fill="#475569">{fig.labels[i]}</text>
          </g>
        )
      })}
      <text x={m.l + iw / 2} y={H - 8} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F2B48">{fig.xLabel}</text>
      <text transform={`translate(14 ${m.t + ih / 2}) rotate(-90)`} textAnchor="middle" fontSize="13" fontWeight="700" fill="#0F2B48">{fig.yLabel}</text>
    </svg>
  )
}

function Figure({ fig, index }: { fig: ArticleFigure; index: number }) {
  const [open, setOpen] = useState(false)
  const caption = fig.caption.replace(/^Figure\s+\d+\.\s*/i, '') // the data already starts with "Figure N."
  const summary = fig.labels.map((l, i) => `${l}: ${fig.values[i]}`).join('; ')
  return (
    <figure className="border border-mauve-100 bg-j3paper-cool p-3 sm:p-4">
      <div className="overflow-x-auto bg-white p-2"><BarChart fig={fig} /></div>
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
        <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className="shrink-0 border border-iris-700 bg-white px-3 py-1.5 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:bg-iris-50">Enlarge figure</button>
      </figcaption>
      <LightboxDialog open={open} onClose={() => setOpen(false)} label={`Figure ${index}: ${caption}`}>
        <h3 className="pr-14 font-jakarta text-[1.3125rem] font-bold leading-snug text-iris-700">Figure {index}. {caption}</h3>
        <div role="img" aria-label={`Bar chart. ${fig.yLabel} by ${fig.xLabel}. ${summary}`} className="mt-5 overflow-x-auto"><BarChart fig={fig} big /></div>
      </LightboxDialog>
    </figure>
  )
}

// ---------- title block ----------
/** The green circular "iD" mark that stands for an ORCID iD; a link when the author has one. */
function OrcidMark({ orcid, name }: { orcid?: string; name?: string }) {
  const mark = <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-j3valid-700 font-inter text-[8px] font-extrabold leading-none text-white">iD</span>
  if (!orcid) return mark
  return <a href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer" aria-label={`ORCID iD for ${name} (opens in a new tab)`} className="inline-flex">{mark}</a>
}

function AuthorsRow({ article, num }: { article: ArticleFull; num: (n: number) => number }) {
  return (
    <ul className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-2 font-jakarta text-[1.0625rem] font-bold text-night-900 sm:text-[1.1875rem]">
      {article.authorDetails.map((a) => (
        <li key={a.name} className="inline-flex items-baseline gap-1">
          <span>{a.name}</span>
          {a.affiliations.length > 0 && <sup className="font-inter text-[11px] font-bold text-mauve-600">{[...new Set(a.affiliations.map(num))].sort((x, y) => x - y).join(',')}{a.corresponding && '*'}</sup>}
          {a.corresponding && <Email className="h-4 w-4 self-center text-iris-700" aria-label="Corresponding author" />}
          {a.orcid && <span className="self-center"><OrcidMark orcid={a.orcid} name={a.name} /></span>}
        </li>
      ))}
    </ul>
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
  const hasCorresponding = article.authorDetails.some((a) => a.corresponding)

  const toc = useMemo(() => [
    { id: 'abstract', label: 'Abstract' },
    ...article.sections.map((s, i) => ({ id: s.id, label: `${i + 1}. ${s.title}` })),
    { id: 'references', label: 'References' },
    { id: 'how-to-cite', label: 'How to cite' },
  ], [article.sections])
  const [current, setCurrent] = useState(toc[0].id)
  const [jumpOpen, setJumpOpen] = useState(false)
  const [hot, setHot] = useState<number | null>(null)
  const [pastTitle, setPastTitle] = useState(false)
  const [scrollingDown, setScrollingDown] = useState(false)
  const [dockVisible, setDockVisible] = useState(false)
  const [citeStyle, setCiteStyle] = useState<CitationStyle>('apa')
  const fill = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const column = useRef<HTMLDivElement>(null)
  const margin = useRef<HTMLDivElement>(null)
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

  // Margin notes: each group sits level with the paragraph that cites it; groups that would overlap are pushed down with a 12px gap.
  const noteGroups = useMemo(() => article.sections.flatMap((s, si) => s.paragraphs.map((p, pi) => ({ pid: `para-${si}-${pi}`, nums: citedIn(p, article.references.length) })).filter((g) => g.nums.length)), [article])
  const layoutNotes = useCallback(() => {
    const col = column.current, side = margin.current
    if (!col || !side) return
    if (!window.matchMedia('(min-width: 1280px)').matches) { side.style.minHeight = ''; return }
    const base = col.getBoundingClientRect().top
    let prevBottom = -12
    side.querySelectorAll<HTMLElement>('[data-note-for]').forEach((g) => {
      const p = document.getElementById(g.dataset.noteFor ?? '')
      if (!p) return
      const top = Math.max(p.getBoundingClientRect().top - base, prevBottom + 12)
      g.style.top = `${top}px`
      prevBottom = top + g.offsetHeight
    })
    side.style.minHeight = `${Math.max(prevBottom, 0)}px`
  }, [])
  useLayoutEffect(() => {
    layoutNotes()
    const ro = new ResizeObserver(layoutNotes)
    if (column.current) ro.observe(column.current)
    window.addEventListener('resize', layoutNotes)
    void document.fonts?.ready.then(layoutNotes)
    return () => { ro.disconnect(); window.removeEventListener('resize', layoutNotes) }
  }, [layoutNotes, article])

  // Current section for the Jump to menu.
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
  const dockBtn = 'inline-flex h-12 items-center justify-center gap-1.5 px-1 font-inter text-xs font-bold uppercase tracking-[0.06em] text-white hover:bg-iris-600 focus-visible:!outline-white sm:h-10 sm:px-4'
  const card = 'border border-mauve-100 bg-white'

  return (
    <div className="bg-j3paper-cool">
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={article.abstract.slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Compact sticky bar: it takes the place of the site header while reading, so two bars are never stacked. */}
      <div className={cx('fixed inset-x-0 top-0 z-[55] border-b border-mauve-100 bg-white shadow-lift3 transition-[transform,visibility] duration-200 motion-reduce:transition-none', compact ? 'visible translate-y-0' : 'invisible -translate-y-full')} aria-hidden={!compact}>
        <div className="relative mx-auto flex h-[60px] max-w-[1240px] items-center gap-3 px-4 sm:px-6">
          <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className="shrink-0"><img src="/journals/j3/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" /></AppLink>
          <p className="hidden min-w-0 flex-1 truncate font-jakarta text-sm font-bold text-iris-700 md:block">{article.title}</p>
          <button ref={jumpBtn} type="button" aria-expanded={jumpOpen} aria-controls={jumpOpen ? jumpId : undefined} onClick={() => setJumpOpen((v) => !v)} tabIndex={compact ? 0 : -1}
            className="ml-auto inline-flex h-9 max-w-[60vw] items-center gap-2 border border-mauve-100 bg-j3paper-cool px-3 font-inter text-xs font-bold uppercase tracking-[0.06em] text-night-900 hover:bg-iris-50 md:ml-0">
            <span className="text-mauve-600">Jump to</span>
            <span className="max-w-[28vw] truncate text-iris-700 sm:max-w-[10rem]">{toc.find((t) => t.id === current)?.label}</span>
            <ChevronDown className={cx('h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none', jumpOpen && 'rotate-180')} aria-hidden="true" />
          </button>
          <button type="button" onClick={download} tabIndex={compact ? 0 : -1} className={cx(BTN_PRIMARY, 'hidden h-9 shrink-0 px-4 sm:inline-flex')}><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download PDF</button>
          {jumpOpen && (
            <div ref={jumpPanel} id={jumpId} className="absolute right-4 top-full z-40 mt-1 max-h-[60vh] w-[min(22rem,calc(100vw-2rem))] overflow-auto border border-mauve-100 border-t-2 border-t-iris-700 bg-white p-1 shadow-dock motion-safe:animate-fade-in sm:right-6">
              <ul>
                {toc.map((t) => (
                  <li key={t.id}>
                    <button type="button" aria-current={current === t.id ? 'location' : undefined} onClick={() => jumpTo(t.id)}
                      className={cx('w-full px-4 py-2.5 text-left font-inter text-sm font-semibold', current === t.id ? 'bg-iris-700 text-white' : 'text-night-900 hover:bg-iris-50')}>{t.label}</button>
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
        <header ref={titleBlock} className="mx-auto max-w-[1240px] px-4 pt-6 sm:px-6 sm:pt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border border-mauve-100 bg-iris-50 px-4 py-2.5">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-inter text-[13px] text-mauve-700">
                <li><AppLink to={paths.home} className="hover:text-ember-700 hover:underline">{journal.shortName}</AppLink></li>
                <li aria-hidden="true" className="text-mauve-400">/</li>
                <li><AppLink to={paths.issue(article.volume, article.issue)} className="hover:text-ember-700 hover:underline">Vol. {article.volume} ({formatMonthYear(article.publishedAt).split(' ').pop()}), Issue {article.issue}</AppLink></li>
                <li aria-hidden="true" className="text-mauve-400">/</li>
                <li aria-current="page"><span className="bg-iris-700 px-2 py-0.5 font-semibold text-white">{article.type}</span></li>
                <li aria-hidden="true" className="text-mauve-400">/</li>
                <li><AppLink to={paths.search(article.subject)} className="hover:text-ember-700 hover:underline">{article.subject}</AppLink></li>
              </ol>
            </nav>
            <span className="inline-flex items-center gap-1.5 border border-j3valid-700 bg-j3valid-50 px-2.5 py-1 font-inter text-xs font-bold uppercase tracking-[0.08em] text-j3valid-700"><OpenAccess className="h-3.5 w-3.5" aria-hidden="true" />Open access</span>
          </div>

          <div className={cx(card, 'mt-4 grid gap-8 p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10')}>
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-inter text-[13px] text-mauve-700">
                <span className="bg-iris-50 px-2 py-0.5 font-semibold text-iris-700">{article.paperId}</span>
                <span>DOI: <a href={doiUrl} target="_blank" rel="noreferrer" className="break-all text-iris-700 underline hover:text-ember-700">{doi}<span className="sr-only"> (opens in a new tab)</span></a></span>
                <span className="hidden h-4 w-px bg-mauve-100 sm:block" aria-hidden="true" />
                <span><a href={journal.licence.url} target="_blank" rel="noreferrer" className="hover:text-ember-700 hover:underline">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a> International licence</span>
              </p>
              <h1 className="mt-4 font-jakarta font-bold leading-[1.15] text-iris-700" style={{ fontSize: 'clamp(28px,3vw,40px)' }}>{article.title}</h1>
              <AuthorsRow article={article} num={affNum} />
              <details className="group mt-4">
                <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-inter text-[13px] font-semibold text-night-900 hover:text-ember-700 [&::-webkit-details-marker]:hidden">
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />Show affiliations &amp; contact details
                </summary>
                <div className="mt-3 border-l-2 border-iris-700 bg-j3paper-cool p-4">
                  <ol className="space-y-1 font-inter text-[13px] leading-snug text-mauve-700">
                    {affOrder.map((n, i) => <li key={n}><sup className="mr-1 font-bold text-night-900">{i + 1}</sup>{article.affiliations[n - 1]}</li>)}
                  </ol>
                  {hasCorresponding && (
                    <ul className="mt-3 space-y-1 border-t border-mauve-100 pt-3 font-inter text-[13px] text-mauve-700">
                      {article.authorDetails.filter((a) => a.corresponding).map((a) => (
                        <li key={a.name}><span className="font-semibold text-night-900">* Corresponding author:</span> {a.name}{a.email && <> · <a href={`mailto:${a.email}`} className="text-iris-700 underline hover:text-ember-700">{a.email}</a></>}</li>
                      ))}
                    </ul>
                  )}
                  {article.authorDetails.some((a) => a.orcid) && (
                    <ul className="mt-3 space-y-1 border-t border-mauve-100 pt-3 font-inter text-[13px] text-mauve-700">
                      {article.authorDetails.filter((a) => a.orcid).map((a) => (
                        <li key={a.name} className="flex items-center gap-1.5"><OrcidMark />{a.name}: <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noreferrer" className="text-iris-700 underline hover:text-ember-700">{a.orcid}<span className="sr-only"> (opens in a new tab)</span></a></li>
                      ))}
                    </ul>
                  )}
                </div>
              </details>

              <dl className="mt-6 grid grid-cols-2 gap-px border border-mauve-100 bg-mauve-100 sm:grid-cols-4">
                {[['Received', formatDate(article.received)], ['Accepted', formatDate(article.accepted)], ['Published', formatDate(article.publishedOnline)], ['Pages', article.pages || `Vol. ${article.volume}, Issue ${article.issue}`]].map(([k, v]) => (
                  <div key={k} className="bg-j3paper-cool px-4 py-3"><dt className={LABEL}>{k}</dt><dd className="mt-0.5 font-inter text-sm font-semibold text-night-900">{v}</dd></div>
                ))}
              </dl>
            </div>

            {/* Actions and metrics */}
            <aside aria-label="Article actions" className="space-y-4">
              <div>
                <p className={LABEL}>Actions</p>
                <button type="button" onClick={download} className={cx(BTN_PRIMARY, 'mt-3 h-11 w-full')}><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download PDF</button>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <CiteMenu article={article} className={cx(BTN_OUTLINE, 'h-10')}><Quote className="h-[18px] w-[18px]" aria-hidden="true" />Cite</CiteMenu>
                  <button type="button" onClick={share} className={cx(BTN_OUTLINE, 'h-10')}><ShareIcon className="h-[18px] w-[18px]" aria-hidden="true" />Share</button>
                </div>
                <button type="button" onClick={copyDoi} aria-label={`Copy DOI ${doi}`} className="mt-2 flex w-full items-center justify-between gap-2 border border-mauve-100 bg-j3paper-cool px-3 py-2 text-left font-inter text-[13px] font-semibold text-iris-700 hover:bg-iris-50">
                  <span className="min-w-0 break-all">{doi}</span><Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                </button>
              </div>
              <section aria-label="Article impact" className="border border-mauve-100 bg-j3paper-cool p-4">
                <p className={LABEL}>Article impact</p>
                <dl className="mt-3 grid grid-cols-3 gap-2">
                  <div><Eye className="mb-1 h-5 w-5 text-iris-600" aria-hidden="true" /><dt className="font-inter text-xs text-mauve-600">Views</dt><dd className="font-jakarta text-xl font-bold text-iris-700">{formatNumber(article.views)}</dd></div>
                  <div><Download className="mb-1 h-5 w-5 text-iris-600" aria-hidden="true" /><dt className="font-inter text-xs text-mauve-600">Downloads</dt><dd className="font-jakarta text-xl font-bold text-iris-700">{formatNumber(article.downloads)}</dd></div>
                  <div><Quote className="mb-1 h-5 w-5 text-ember-700" aria-hidden="true" /><dt className="font-inter text-xs text-mauve-600">Citations</dt><dd className="font-jakarta text-xl font-bold text-ember-700">{formatNumber(article.citations)}</dd></div>
                </dl>
              </section>
            </aside>
          </div>
        </header>

        {/* Reading area: the text column and, on wide screens, the margin notes. */}
        <div className="mx-auto max-w-[1240px] px-4 pt-6 sm:px-6 sm:pt-8">
          <div ref={body} className="xl:grid xl:grid-cols-[minmax(0,740px)_280px] xl:justify-center xl:gap-x-8">
            <div ref={column} className={cx(card, 'min-w-0 p-5 sm:p-10')}>
              <section id="abstract" tabIndex={-1} aria-labelledby="abstract-h" className="scroll-mt-24 focus:outline-none">
                <h2 id="abstract-h" className={H2}>Abstract</h2>
                <p className="mt-4 border-l-2 border-iris-700 pl-5 font-jakarta text-[17px] leading-[1.7] text-night-700 md:text-[18px]">{article.abstract}</p>
                {article.keywords.length > 0 && (
                  <div className="mt-6 bg-j3paper-cool p-4">
                    <h3 className={LABEL}>Keywords</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-flex h-8 items-center border border-mauve-100 bg-white px-3 font-inter text-[13px] font-semibold text-night-900 hover:border-iris-700 hover:text-iris-700">{k}</AppLink></li>)}
                    </ul>
                  </div>
                )}
                <div className="mt-6 divide-y divide-mauve-100 border border-mauve-100">
                  {[
                    ['Licence', `Open access under ${journal.licence.name}. Share and adapt with credit to the authors.`],
                    ['Funding', 'No specific funding was reported for this article.'],
                    ['Conflicts of interest', 'The authors declared no competing interests.'],
                    ['Data availability', 'Data and materials are available from the corresponding author on reasonable request.'],
                  ].map(([k, v]) => (
                    <details key={k} className="group px-4 py-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-inter text-sm font-bold text-night-900 [&::-webkit-details-marker]:hidden"><span>{k}</span><ChevronDown className="h-4 w-4 text-mauve-600 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary>
                      <p className="mt-2 font-inter text-sm leading-relaxed text-mauve-700">{v}</p>
                    </details>
                  ))}
                </div>
              </section>

              {article.sections.map((s, si) => (
                <section key={s.id} id={s.id} tabIndex={-1} aria-labelledby={`${s.id}-h`} className="mt-12 scroll-mt-24 focus:outline-none">
                  <h2 id={`${s.id}-h`} className={H2}><span className="mr-2">{si + 1}.</span>{s.title}</h2>
                  <div className="mt-4 space-y-[1.1em]">
                    {s.paragraphs.map((p, pi) => <Paragraph key={pi} id={`para-${si}-${pi}`} text={p} refs={article.references} hot={hot} setHot={setHot} />)}
                  </div>
                  {s.table && <div className="mt-6"><DataTable table={s.table} index={++tableNo} /></div>}
                  {s.figure && <div className="mt-6"><Figure fig={s.figure} index={++figureNo} /></div>}
                </section>
              ))}

              <section id="references" tabIndex={-1} aria-labelledby="references-h" className="mt-12 scroll-mt-24 focus:outline-none">
                <h2 id="references-h" className={H2}>References <span className="font-inter text-base font-semibold text-mauve-600">({article.references.length})</span></h2>
                <ol className="mt-5 space-y-4">
                  {article.references.map((r, i) => (
                    <li key={i} id={`ref-${i + 1}`} tabIndex={-1} className="grid grid-cols-[2.25rem_minmax(0,1fr)] font-inter text-[15px] leading-relaxed text-mauve-700 focus:bg-iris-50 focus:outline-none">
                      <span className="font-bold text-night-900">{i + 1}.</span>
                      <span className="min-w-0 break-words">
                        <RefText r={r} doi={false} />
                        <span className="mt-1 flex flex-wrap gap-x-4 text-[13px] font-semibold">
                          {r.doi && <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="text-ember-700 hover:underline">[CrossRef]<span className="sr-only"> (opens in a new tab)</span></a>}
                          <a href={scholarUrl(r)} target="_blank" rel="noreferrer" className="text-night-900 hover:text-ember-700 hover:underline">[Google Scholar]<span className="sr-only"> (opens in a new tab)</span></a>
                        </span>
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            </div>

            {/* Margin notes (1280px and wider). */}
            <div ref={margin} className="relative hidden xl:block" aria-label="Notes on the references cited in the text" role="complementary">
              {noteGroups.map((g) => (
                <div key={g.pid} data-note-for={g.pid} className="absolute inset-x-0 space-y-3" style={{ top: 0 }}>
                  {g.nums.map((n) => (
                    <p key={n} onMouseEnter={() => setHot(n)} onMouseLeave={() => setHot(null)}
                      className={cx('border-l-2 py-0.5 pl-3 font-inter text-[13px] leading-[1.5] transition-colors motion-reduce:transition-none', hot === n ? 'border-ember-700 bg-ember-50 text-night-900' : 'border-mauve-100 text-mauve-700')}>
                      <span className="font-bold text-ember-700">[{n}]</span> <RefText r={article.references[n - 1]} />
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* End of the article: citation exporter */}
          <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,740px)_280px] xl:justify-center xl:gap-x-8">
            <section id="how-to-cite" tabIndex={-1} aria-labelledby="cite-h" className={cx(card, 'scroll-mt-24 p-5 focus:outline-none sm:p-8')}>
              <h2 id="cite-h" className={H2}>How to cite this article</h2>
              <div role="tablist" aria-label="Citation style" className="mt-4 flex flex-wrap gap-1.5">
                {CITATION_STYLES_WITH_IEEE.map((s) => (
                  <button key={s.id} type="button" role="tab" aria-selected={citeStyle === s.id} onClick={() => setCiteStyle(s.id)}
                    className={cx('h-8 px-3 font-inter text-xs font-bold uppercase tracking-[0.06em]', citeStyle === s.id ? 'bg-iris-700 text-white' : 'bg-iris-50 text-iris-700 hover:bg-iris-100')}>{s.label}</button>
                ))}
              </div>
              <p role="tabpanel" className="mt-4 whitespace-pre-wrap break-words border-l-2 border-iris-700 bg-j3paper-cool p-4 font-inter text-[14px] leading-relaxed text-night-900">{citation}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={copyCitation} className={cx(BTN_PRIMARY, 'h-10 px-5')}><Copy className="h-[18px] w-[18px]" aria-hidden="true" />Copy citation</button>
                {exportFile && <button type="button" onClick={() => { downloadText(citationFilename(article, citeStyle), citation); toast(`${citationFilename(article, citeStyle)} downloaded`) }} className={cx(BTN_OUTLINE, 'h-10 px-5')}><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download {citeStyle === 'ris' ? '.ris' : '.bib'}</button>}
              </div>
              <p className="mt-6 border-t border-mauve-100 pt-4 font-inter text-sm text-mauve-700">
                Published open access under <a href={journal.licence.url} target="_blank" rel="noreferrer" className="font-semibold text-iris-700 underline underline-offset-2 hover:text-ember-700">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a>.{' '}
                <AppLink to={paths.verify()} className="inline-flex items-center gap-1 font-semibold text-iris-700 underline underline-offset-2 hover:text-ember-700"><Verified className="h-4 w-4" aria-hidden="true" />Verify an author certificate</AppLink>
              </p>
            </section>
          </div>

          {article.related.length > 0 && (
            <section className="mt-12" aria-labelledby="more-h">
              <p className={LABEL}>Keep reading</p>
              <h2 id="more-h" className={cx(H2, 'mt-2')}>More from the journal</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {article.related.slice(0, 3).map((a) => <ArticleListItem key={a.paperId} article={a} />)}
              </div>
              <AppLink to={paths.issue(article.volume, article.issue)} className="mt-8 inline-flex items-center gap-1.5 font-inter text-xs font-bold uppercase tracking-[0.08em] text-iris-700 hover:text-ember-700"><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />Back to Vol. {article.volume}, Issue {article.issue}</AppLink>
            </section>
          )}
        </div>
      </article>

      {/* Bottom action dock: only after the title block has passed; it hides while scrolling down and returns on scroll up or after a pause. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center sm:bottom-4 sm:px-3">
        <div role="toolbar" aria-label="Article actions" aria-hidden={!dockVisible}
          className={cx('pointer-events-auto grid w-full grid-cols-4 overflow-hidden bg-iris-700 shadow-dock transition-[transform,visibility] duration-200 motion-reduce:transition-none sm:flex sm:w-auto sm:items-center sm:gap-px sm:p-1',
            dockVisible ? 'visible translate-y-0' : 'invisible translate-y-[130%]')}>
          <button type="button" aria-label="Download PDF" onClick={download} tabIndex={dockVisible ? 0 : -1}
            className="inline-flex h-12 items-center justify-center gap-1.5 bg-white px-1 font-inter text-xs font-bold uppercase tracking-[0.06em] text-iris-700 hover:bg-iris-50 focus-visible:!outline-iris-700 sm:h-10 sm:px-4"><Download className="h-[18px] w-[18px]" aria-hidden="true" /><span className="sm:hidden">PDF</span><span className="hidden sm:inline">Download PDF</span></button>
          <CiteMenu article={article} className={dockBtn}><Quote className="h-[18px] w-[18px]" aria-hidden="true" />Cite</CiteMenu>
          <button type="button" aria-label="Share article" onClick={share} tabIndex={dockVisible ? 0 : -1} className={dockBtn}><ShareIcon className="h-[18px] w-[18px]" aria-hidden="true" />Share</button>
          <button type="button" aria-label="Copy DOI" onClick={copyDoi} tabIndex={dockVisible ? 0 : -1} className={dockBtn}><Copy className="h-[18px] w-[18px]" aria-hidden="true" /><span className="sm:hidden">DOI</span><span className="hidden sm:inline">Copy DOI</span></button>
        </div>
      </div>
    </div>
  )
}
