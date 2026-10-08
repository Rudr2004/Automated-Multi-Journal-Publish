// Article page for IJCSD. A dark title block with an article card, one compact sticky bar while reading (it swaps with the site header, never stacks with it),
// a single reading column with margin-note references on wide screens, figures and tables, a bottom action dock and an end-of-article section.
import { Fragment, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { MdOutlineShare as ShareIcon } from 'react-icons/md'
import { doiFor, journal } from '../../../config/journals'
import { paths } from '../../../config/routes'
import { CITATION_STYLES_WITH_IEEE, formatCitation, type CitationStyle } from '../../../core/lib/cite'
import { copyText } from '../../../core/lib/clipboard'
import { formatDate, formatMonthYear, formatNumber } from '../../../core/lib/format'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import { getScholarMeta } from '../../../core/lib/scholar'
import { AppLink } from '../../../core/router'
import type { ArticleFigure, ArticleFull, ArticleTable, Reference } from '../../../core/types'
import { ArticleTile } from '../components/ArticleTile'
import { Artwork } from '../components/Artwork'
import { CiteMenu } from '../components/CiteMenu'
import { LightboxDialog } from '../components/LightboxDialog'
import { cx, Kicker } from '../components/primitives'
import { useToast } from '../components/Toast'
import { themeColor } from '../components/themes'
import { ArrowRight, ChevronDown, Copy, Download, Email, OpenAccess, Quote, Verified } from '../icons'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
const BODY_TEXT = 'text-[16px] leading-[1.7] text-[#2A2440] md:text-[17px]'
const H2 = 'font-jakarta text-[1.625rem] font-bold leading-tight tracking-tight text-night-900 sm:text-[1.75rem]'
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
      {doi && r.doi && <> <a href={`https://doi.org/${r.doi}`} target="_blank" rel="noreferrer" className="font-semibold text-iris-700 underline underline-offset-2">doi:{r.doi}<span className="sr-only"> (opens in a new tab)</span></a></>}
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
                  className={cx('rounded-sm px-px font-jakarta text-[0.92em] font-bold text-iris-700 hover:underline focus-visible:underline', hot === n && 'bg-iris-100')}>{n}</button>
              </Fragment>
            ))}]</span>
          )
        })}
      </p>
      {open.length > 0 && (
        <div className="mt-3 space-y-2 xl:hidden">
          {open.map((n) => (
            <p key={n} role="note" className="rounded-tile bg-iris-50 p-4 text-[13px] leading-[1.5] text-mauve-800">
              <span className="font-jakarta font-extrabold text-iris-700">[{n}]</span> <RefText r={refs[n - 1]} />{' '}
              <button type="button" onClick={() => goTo(n)} className="font-jakarta font-bold text-iris-700 underline underline-offset-2">Go to reference</button>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------- table and figure ----------
function DataTable({ table }: { table: ArticleTable }) {
  return (
    <div role="region" aria-label={table.caption} tabIndex={0} className="max-h-[26rem] overflow-auto rounded-[12px] ring-1 ring-mauve-200">
      <table className="w-full min-w-[460px] border-collapse text-left text-[15px]">
        <caption className="caption-top bg-white px-4 py-3 text-left font-jakarta text-sm font-bold text-night-900">{table.caption}</caption>
        <thead><tr>{table.head.map((h) => <th key={h} scope="col" className="sticky top-0 border-b-2 border-night-900 bg-iris-50 px-4 py-2.5 font-jakarta text-sm font-extrabold text-night-900">{h}</th>)}</tr></thead>
        <tbody>{table.rows.map((r, i) => <tr key={i} className="border-b border-mauve-100 odd:bg-white even:bg-iris-50/60">{r.map((c, j) => j === 0 ? <th key={j} scope="row" className="px-4 py-2.5 font-semibold text-night-900">{c}</th> : <td key={j} className="px-4 py-2.5 tabular-nums text-mauve-800">{c}</td>)}</tr>)}</tbody>
      </table>
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
            <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke="#D9D8DD" strokeWidth={t === 0 ? 1.5 : 1} />
            <text x={m.l - 8} y={y(v) + 4} textAnchor="end" fontSize="12" fill="#3A3350">{fmt(v)}</text>
          </g>
        )
      })}
      {fig.values.map((v, i) => {
        const x = m.l + bw * i + bw * 0.2
        return (
          <g key={i}>
            <rect x={x} y={y(v)} width={bw * 0.6} height={m.t + ih - y(v)} rx={4} fill={i % 2 ? '#7B66B6' : '#4B2E9B'} />
            <text x={x + bw * 0.3} y={y(v) - 6} textAnchor="middle" fontSize="12" fontWeight="700" fill="#1B1430">{fmt(v)}</text>
            <text transform={rotate ? `translate(${x + bw * 0.3} ${m.t + ih + 14}) rotate(-35)` : undefined} x={rotate ? 0 : x + bw * 0.3} y={rotate ? 0 : m.t + ih + 18}
              textAnchor={rotate ? 'end' : 'middle'} fontSize="12" fill="#3A3350">{fig.labels[i]}</text>
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
    <figure className="rounded-[12px] bg-white p-4 ring-1 ring-mauve-200">
      <div className="overflow-x-auto"><BarChart fig={fig} /></div>
      {/* Data table for screen readers. It sits in a clipped wrapper because a table itself ignores the clipping that hides sr-only content. */}
      <div className="sr-only">
        <table>
          <caption>{fig.caption}</caption>
          <thead><tr><th scope="col">{fig.xLabel}</th><th scope="col">{fig.yLabel}</th></tr></thead>
          <tbody>{fig.labels.map((l, i) => <tr key={l}><th scope="row">{l}</th><td>{fig.values[i]}</td></tr>)}</tbody>
        </table>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-start justify-between gap-3 text-sm text-mauve-700">
        <span className="min-w-0 flex-1"><strong className="font-jakarta text-night-900">Figure {index}.</strong> {caption}</span>
        <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className="shrink-0 rounded-full bg-iris-50 px-4 py-1.5 font-jakarta text-sm font-bold text-iris-700 hover:bg-iris-100">Enlarge figure</button>
      </figcaption>
      <LightboxDialog open={open} onClose={() => setOpen(false)} label={`Figure ${index}: ${caption}`}>
        <h3 className="pr-14 font-jakarta text-[1.3125rem] font-bold leading-snug text-night-900">Figure {index}. {caption}</h3>
        <div role="img" aria-label={`Bar chart. ${fig.yLabel} by ${fig.xLabel}. ${summary}`} className="mt-5 overflow-x-auto"><BarChart fig={fig} big /></div>
      </LightboxDialog>
    </figure>
  )
}

// ---------- title block ----------
const initialsOf = (name: string) => name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]).join('')

/** The small green "iD" mark that stands for an ORCID iD. */
const OrcidMark = () => <span aria-hidden="true" className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#A6CE39] font-jakarta text-[8px] font-extrabold leading-none text-white">iD</span>

function AuthorsInline({ article, num }: { article: ArticleFull; num: (n: number) => number }) {
  const people = article.authorDetails
  return (
    <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="flex shrink-0 -space-x-2" aria-hidden="true">
        {people.slice(0, 4).map((a) => (
          a.photo
            ? <img key={a.name} src={a.photo} alt="" width={28} height={28} className="h-7 w-7 rounded-full object-cover ring-2 ring-night-900" />
            : <span key={a.name} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-iris-700 font-jakarta text-[10px] font-extrabold text-white ring-2 ring-night-900">{initialsOf(a.name)}</span>
        ))}
      </span>
      <ul className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1 gap-y-1 text-[15px]">
        {people.map((a, i) => (
          <li key={a.name} className="group relative flex items-center">
            <button type="button" className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-jakarta font-bold text-white hover:bg-white/10 focus-visible:bg-white/10" aria-describedby={`author-card-${i}`}>
              {a.name}
              {a.affiliations.length > 0 && <sup className="font-inter text-[11px] font-bold text-ember-400">{[...new Set(a.affiliations.map(num))].sort((x, y) => x - y).join(',')}</sup>}
              {a.corresponding && <Email className="h-4 w-4 text-ember-400" aria-label="Corresponding author" />}
              {a.orcid && <OrcidMark />}
            </button>
            {i < people.length - 1 && <span aria-hidden="true" className="px-0.5 text-night-300">·</span>}
            <div id={`author-card-${i}`} role="tooltip" className="invisible absolute left-0 top-full z-30 mt-2 w-72 rounded-tile bg-white p-4 text-left text-night-900 opacity-0 shadow-dock transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 motion-reduce:transition-none">
              <p className="font-jakarta text-sm font-extrabold">{a.name}</p>
              {a.affiliations.map((n) => <p key={n} className="mt-1 text-[13px] leading-snug text-mauve-700">{article.affiliations[n - 1]}</p>)}
              {a.orcid && <a href={`https://orcid.org/${a.orcid}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-iris-700 underline underline-offset-2"><OrcidMark />{a.orcid}<span className="sr-only"> (opens in a new tab)</span></a>}
              {a.corresponding && a.email && <a href={`mailto:${a.email}`} className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-iris-700 underline underline-offset-2"><Email className="h-4 w-4" aria-hidden="true" />{a.email}</a>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------- page ----------
export function ArticlePage({ article }: { article: ArticleFull }) {
  const toast = useToast()
  const { tags, jsonLd } = getScholarMeta(article)
  const doi = doiFor(article.paperId)
  const doiUrl = `https://doi.org/${doi}`
  const color = themeColor(article.subject)

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
  const copyCitation = async () => { const ok = await copyText(citation); toast(ok ? 'Citation copied' : 'Could not copy the citation', ok ? 'success' : 'error') }

  const dockBtn = 'inline-flex h-12 items-center justify-center gap-1.5 px-1 font-jakarta text-[13px] font-bold text-white hover:bg-night-700 focus-visible:!outline-white sm:h-10 sm:rounded-full sm:px-3.5 sm:text-sm'
  let figureNo = 0

  return (
    <>
      <Helmet>
        <title>{`${article.title} | ${journal.name}`}</title>
        <meta name="description" content={article.abstract.slice(0, 160)} />
        {tags.map((t, i) => <meta key={i} name={t.name} content={t.content} />)}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      {/* Compact sticky bar: it takes the place of the site header while reading, so two bars are never stacked. */}
      <div className={cx('fixed inset-x-0 top-0 z-[55] border-b border-mauve-100 bg-white/95 shadow-lift3 backdrop-blur transition-[transform,visibility] duration-200 motion-reduce:transition-none', compact ? 'visible translate-y-0' : 'invisible -translate-y-full')} aria-hidden={!compact}>
        <div className="relative mx-auto flex h-[60px] max-w-[1240px] items-center gap-3 px-4 sm:px-6">
          <AppLink to={paths.home} aria-label={`${journal.shortName} home`} className="shrink-0"><img src="/journals/j3/logo.png" alt="" width={36} height={36} className="h-9 w-9" /></AppLink>
          <p className="hidden min-w-0 flex-1 truncate font-jakarta text-sm font-bold text-night-900 md:block">{article.title}</p>
          <button ref={jumpBtn} type="button" aria-expanded={jumpOpen} aria-controls={jumpOpen ? jumpId : undefined} onClick={() => setJumpOpen((v) => !v)} tabIndex={compact ? 0 : -1}
            className="ml-auto inline-flex h-9 max-w-[60vw] items-center gap-2 rounded-full bg-iris-50 px-3.5 font-jakarta text-[13px] font-bold text-night-900 hover:bg-iris-100 md:ml-0">
            <span className="text-mauve-700">Jump to</span>
            <span className="max-w-[28vw] truncate text-iris-700 sm:max-w-[10rem]">{toc.find((t) => t.id === current)?.label}</span>
            <ChevronDown className={cx('h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none', jumpOpen && 'rotate-180')} aria-hidden="true" />
          </button>
          <button type="button" onClick={download} tabIndex={compact ? 0 : -1} className="hidden h-9 shrink-0 items-center gap-1.5 rounded-full bg-iris-700 px-4 font-jakarta text-[13px] font-bold text-white hover:bg-iris-800 sm:inline-flex"><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download PDF</button>
          {jumpOpen && (
            <div ref={jumpPanel} id={jumpId} className="absolute right-4 top-full z-40 mt-2 max-h-[60vh] w-[min(22rem,calc(100vw-2rem))] overflow-auto rounded-block bg-white p-2 shadow-dock ring-1 ring-mauve-100 motion-safe:animate-fade-in sm:right-6">
              <ul>
                {toc.map((t) => (
                  <li key={t.id}>
                    <button type="button" aria-current={current === t.id ? 'location' : undefined} onClick={() => jumpTo(t.id)}
                      className={cx('w-full rounded-tile px-4 py-2.5 text-left font-jakarta text-sm font-bold', current === t.id ? 'bg-iris-700 text-white' : 'text-night-900 hover:bg-iris-50')}>{t.label}</button>
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
        <header ref={titleBlock} className="relative isolate bg-night-900 text-white">
          {/* One subtle brand pattern on the right edge only. */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/3 bg-[repeating-linear-gradient(135deg,rgba(123,102,182,0.28)_0_1px,transparent_1px_16px)] [mask-image:linear-gradient(to_left,black,transparent)] lg:block" />
          <div className="mx-auto max-w-[1240px] px-4 pb-8 pt-8 sm:px-6 sm:pb-10 sm:pt-10">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="min-w-0 lg:col-span-8">
                <nav aria-label="Breadcrumb">
                  <ol className="flex flex-wrap items-center gap-1.5 text-[13px] text-night-200">
                    <li><AppLink to={paths.home} className="hover:text-white hover:underline">Home</AppLink></li>
                    <li aria-hidden="true">/</li>
                    <li><AppLink to={paths.issue(article.volume, article.issue)} className="hover:text-white hover:underline">Vol. {article.volume}, Issue {article.issue}</AppLink></li>
                    <li aria-hidden="true">/</li>
                    <li aria-current="page" className="font-semibold text-white">Article</li>
                  </ol>
                </nav>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <AppLink to={paths.search(article.subject)} className="inline-flex h-7 items-center rounded-full bg-white px-3 font-jakarta text-xs font-extrabold hover:bg-iris-50" style={{ color }}>{article.subject}</AppLink>
                  <span className="inline-flex h-7 items-center rounded-full bg-white/10 px-3 font-jakarta text-xs font-bold">{article.type}</span>
                  <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-white/10 px-3 font-jakarta text-xs font-bold"><OpenAccess className="h-3.5 w-3.5 text-ember-400" aria-hidden="true" />Open access · {journal.licence.name}</span>
                </div>
                <h1 className="mt-4 font-jakarta font-extrabold leading-[1.15] tracking-tight" style={{ fontSize: 'clamp(30px,3.2vw,44px)' }}>{article.title}</h1>
                <AuthorsInline article={article} num={affNum} />
                <ol className="mt-4 space-y-0.5 text-[13px] leading-snug text-night-200">
                  {affOrder.map((n, i) => <li key={n}><sup className="mr-1 font-bold text-ember-400">{i + 1}</sup>{article.affiliations[n - 1]}</li>)}
                </ol>
                {hasCorresponding && <p className="mt-2 flex items-center gap-1.5 text-[13px] text-night-200"><Email className="h-4 w-4 text-ember-400" aria-hidden="true" /> Corresponding author</p>}
              </div>

              {/* Article card */}
              <aside aria-label="Article actions" className="lg:col-span-4">
                <div className="rounded-[16px] bg-white p-5 text-night-900 shadow-dock">
                  <div className="flex items-center gap-3">
                    <Artwork seed={article.paperId} className="h-14 w-14 shrink-0 rounded-tile" />
                    <p className="font-jakarta text-sm font-bold leading-snug">Vol. {article.volume} · Issue {article.issue}<span className="block font-medium text-mauve-700">{formatMonthYear(article.publishedAt)}</span></p>
                  </div>
                  <button type="button" onClick={download} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-iris-700 font-jakarta text-sm font-bold text-white hover:bg-iris-800"><Download className="h-[18px] w-[18px]" aria-hidden="true" />Download PDF</button>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <CiteMenu article={article} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-mauve-300 font-jakarta text-sm font-bold text-night-900 hover:border-iris-700 hover:text-iris-700"><Quote className="h-[18px] w-[18px]" aria-hidden="true" />Cite</CiteMenu>
                    <button type="button" onClick={share} className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-mauve-300 font-jakarta text-sm font-bold text-night-900 hover:border-iris-700 hover:text-iris-700"><ShareIcon className="h-[18px] w-[18px]" aria-hidden="true" />Share</button>
                  </div>
                  <button type="button" onClick={copyDoi} aria-label={`Copy DOI ${doi}`} className="mt-3 flex w-full items-center justify-between gap-2 rounded-full bg-iris-50 px-4 py-2 text-left font-jakarta text-[13px] font-bold text-iris-800 hover:bg-iris-100">
                    <span className="min-w-0 truncate">{doi}</span><Copy className="h-4 w-4 shrink-0" aria-hidden="true" />
                  </button>
                  <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-mauve-100 pt-4 text-center">
                    <div><dd className="font-jakarta text-lg font-extrabold">{formatNumber(article.views)}</dd><dt className="text-xs text-mauve-700">Views</dt></div>
                    <div><dd className="font-jakarta text-lg font-extrabold">{formatNumber(article.downloads)}</dd><dt className="text-xs text-mauve-700">Downloads</dt></div>
                  </dl>
                </div>
              </aside>
            </div>

            <dl className="mt-8 grid grid-cols-2 gap-y-4 border-t border-white/15 pt-6 sm:grid-cols-4 sm:divide-x sm:divide-white/15">
              {[['Received', formatDate(article.received)], ['Accepted', formatDate(article.accepted)], ['Published', formatDate(article.publishedOnline)], ['Pages', article.pages]].map(([k, v], i) => (
                <div key={k} className={cx('sm:px-6', i === 0 && 'sm:pl-0')}><dt className="text-xs text-night-200">{k}</dt><dd className="mt-0.5 font-jakarta text-[15px] font-semibold">{v}</dd></div>
              ))}
            </dl>
          </div>
        </header>

        {/* Reading area: the text column and, on wide screens, the margin notes. */}
        <div className="mx-auto max-w-[1240px] px-4 pt-12 sm:px-6 sm:pt-16">
          <div ref={body} className="xl:grid xl:grid-cols-[minmax(0,700px)_280px] xl:justify-center xl:gap-x-8">
            <div ref={column} className="min-w-0">
              <section id="abstract" tabIndex={-1} aria-labelledby="abstract-h" className="scroll-mt-24 focus:outline-none">
                <div className="rounded-[16px] bg-[#F5F2FF] p-6 sm:p-7">
                  <h2 id="abstract-h" className="font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-iris-700">Abstract</h2>
                  <p className="mt-3 text-[16px] leading-[1.65] text-night-900 md:text-[17px]">{article.abstract}</p>
                  {article.keywords.length > 0 && (
                    <div className="mt-5 border-t border-iris-200 pt-4">
                      <h3 className="font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-iris-700">Keywords</h3>
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {article.keywords.map((k) => <li key={k}><AppLink to={paths.search(k)} className="inline-flex h-7 items-center rounded-full bg-white px-3 font-jakarta text-[13px] font-semibold text-iris-800 ring-1 ring-iris-200 hover:bg-iris-100">{k}</AppLink></li>)}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-3 divide-y divide-mauve-100 rounded-[16px] border border-mauve-200">
                  {[
                    ['Licence', `Open access under ${journal.licence.name}. Share and adapt with credit to the authors.`],
                    ['Funding', 'No specific funding was reported for this article.'],
                    ['Conflicts of interest', 'The authors declared no competing interests.'],
                    ['Data availability', 'Data and materials are available from the corresponding author on reasonable request.'],
                  ].map(([k, v]) => (
                    <details key={k} className="group px-5 py-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-jakarta text-sm font-bold text-night-900"><span>{k}</span><ChevronDown className="h-4 w-4 text-mauve-600 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" /></summary>
                      <p className="mt-2 text-sm leading-relaxed text-mauve-800">{v}</p>
                    </details>
                  ))}
                </div>
              </section>

              {article.sections.map((s, si) => (
                <section key={s.id} id={s.id} tabIndex={-1} aria-labelledby={`${s.id}-h`} className="mt-14 scroll-mt-24 focus:outline-none">
                  <h2 id={`${s.id}-h`} className={H2}><span className="mr-2 text-iris-700">{si + 1}.</span>{s.title}</h2>
                  <div className="mt-4 space-y-[1.1em]">
                    {s.paragraphs.map((p, pi) => <Paragraph key={pi} id={`para-${si}-${pi}`} text={p} refs={article.references} hot={hot} setHot={setHot} />)}
                  </div>
                  {s.table && <div className="mt-6"><DataTable table={s.table} /></div>}
                  {s.figure && <div className="mt-6"><Figure fig={s.figure} index={++figureNo} /></div>}
                </section>
              ))}

              <section id="references" tabIndex={-1} aria-labelledby="references-h" className="mt-14 scroll-mt-24 focus:outline-none">
                <h2 id="references-h" className={H2}>References</h2>
                <ol className="mt-5 space-y-3">
                  {article.references.map((r, i) => (
                    <li key={i} id={`ref-${i + 1}`} tabIndex={-1} className="flex gap-3 rounded-tile text-[15px] leading-relaxed text-mauve-800 focus:bg-iris-50 focus:outline-none">
                      <span className="w-9 shrink-0 font-jakarta font-extrabold text-iris-700">[{i + 1}]</span>
                      <span className="min-w-0 break-words"><RefText r={r} /></span>
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
                      className={cx('border-l-2 py-0.5 pl-3 text-[13px] leading-[1.5] transition-colors motion-reduce:transition-none', hot === n ? 'border-iris-700 bg-iris-50 text-night-900' : 'border-iris-300 text-mauve-700')}>
                      <span className="font-jakarta font-extrabold text-iris-700">[{n}]</span> <RefText r={article.references[n - 1]} />
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* End of the article */}
          <div className="mt-16 grid gap-6 xl:grid-cols-[minmax(0,700px)_280px] xl:justify-center xl:gap-x-8">
            <section id="how-to-cite" tabIndex={-1} aria-labelledby="cite-h" className="scroll-mt-24 rounded-[16px] bg-[#F5F2FF] p-6 focus:outline-none sm:p-7">
              <h2 id="cite-h" className="font-jakarta text-xs font-extrabold uppercase tracking-[0.08em] text-iris-700">How to cite this article</h2>
              <div role="tablist" aria-label="Citation style" className="mt-3 flex flex-wrap gap-1.5">
                {CITATION_STYLES_WITH_IEEE.map((s) => (
                  <button key={s.id} type="button" role="tab" aria-selected={citeStyle === s.id} onClick={() => setCiteStyle(s.id)}
                    className={cx('h-8 rounded-full px-3.5 font-jakarta text-[13px] font-bold', citeStyle === s.id ? 'bg-iris-700 text-white' : 'bg-white text-night-900 ring-1 ring-iris-200 hover:bg-iris-100')}>{s.label}</button>
                ))}
              </div>
              <p role="tabpanel" className="mt-4 whitespace-pre-wrap break-words rounded-tile bg-white p-4 text-[14px] leading-relaxed text-night-900">{citation}</p>
              <button type="button" onClick={copyCitation} className="mt-3 inline-flex h-10 items-center gap-1.5 rounded-full bg-iris-700 px-5 font-jakarta text-sm font-bold text-white hover:bg-iris-800"><Copy className="h-[18px] w-[18px]" aria-hidden="true" />Copy citation</button>
              <p className="mt-5 border-t border-iris-200 pt-4 text-sm text-mauve-800">
                Published open access under <a href={journal.licence.url} target="_blank" rel="noreferrer" className="font-semibold text-iris-700 underline underline-offset-2">{journal.licence.name}<span className="sr-only"> (opens in a new tab)</span></a>.{' '}
                <AppLink to={paths.verify()} className="inline-flex items-center gap-1 font-semibold text-iris-700 underline underline-offset-2"><Verified className="h-4 w-4" aria-hidden="true" />Verify an author certificate</AppLink>
              </p>
            </section>
          </div>

          {article.related.length > 0 && (
            <section className="mt-16" aria-labelledby="more-h">
              <Kicker className="text-iris-700">Keep reading</Kicker>
              <h2 id="more-h" className={cx(H2, 'mt-2')}>More from the journal</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {article.related.slice(0, 3).map((a, i) => <ArticleTile key={a.paperId} article={a} size="small" surface={i} className="min-h-[13rem]" />)}
              </div>
              <AppLink to={paths.issue(article.volume, article.issue)} className="mt-8 inline-flex items-center gap-1.5 font-jakarta text-sm font-bold text-iris-700 hover:underline"><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" />Back to Vol. {article.volume}, Issue {article.issue}</AppLink>
            </section>
          )}
        </div>
      </article>

      {/* Bottom action dock: only after the title block has passed; it hides while scrolling down and returns on scroll up or after a pause. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center sm:bottom-4 sm:px-3">
        <div role="toolbar" aria-label="Article actions" aria-hidden={!dockVisible}
          className={cx('pointer-events-auto grid w-full grid-cols-4 overflow-hidden bg-night-900 shadow-dock transition-[transform,visibility] duration-200 motion-reduce:transition-none sm:flex sm:w-auto sm:items-center sm:gap-0.5 sm:rounded-full sm:p-1',
            dockVisible ? 'visible translate-y-0' : 'invisible translate-y-[130%]')}>
          <button type="button" aria-label="Download PDF" onClick={download} tabIndex={dockVisible ? 0 : -1}
            className="inline-flex h-12 items-center justify-center gap-1.5 bg-white px-1 font-jakarta text-[13px] font-bold text-night-900 hover:bg-iris-100 focus-visible:!outline-iris-700 sm:h-10 sm:rounded-full sm:px-4 sm:text-sm"><Download className="h-[18px] w-[18px]" aria-hidden="true" /><span className="sm:hidden">PDF</span><span className="hidden sm:inline">Download PDF</span></button>
          <CiteMenu article={article} className={dockBtn}><Quote className="h-[18px] w-[18px]" aria-hidden="true" />Cite</CiteMenu>
          <button type="button" aria-label="Share article" onClick={share} tabIndex={dockVisible ? 0 : -1} className={dockBtn}><ShareIcon className="h-[18px] w-[18px]" aria-hidden="true" />Share</button>
          <button type="button" aria-label="Copy DOI" onClick={copyDoi} tabIndex={dockVisible ? 0 : -1} className={dockBtn}><Copy className="h-[18px] w-[18px]" aria-hidden="true" /><span className="sm:hidden">DOI</span><span className="hidden sm:inline">Copy DOI</span></button>
        </div>
      </div>
    </>
  )
}
