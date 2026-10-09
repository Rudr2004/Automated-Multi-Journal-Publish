// Shared pieces for the J5 listing pages (issue, archive, search): the classical bordeaux masthead band (dateline, double hairline rules,
// ornament rule), form-control classes, the PDF + Cite action pair and the research-area chip (periodic-table style).
import type { ReactNode } from 'react'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import type { ArticleSummary } from '../../../core/types'
import { journal } from '../../../config/journals'
import { Download, Quote } from '../icons'
import { areaColor } from './areas'
import { CiteMenu } from './CiteMenu'
import { Container, cx } from './primitives'
import { Kicker, OrnamentRule, symbolOf } from './signature'

export const FIELD = 'h-11 rounded border border-ochre-400 bg-white px-3 text-sm text-obsidian-900 transition-colors motion-reduce:transition-none focus-visible:border-wine-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-wine-700/20'
export const LINK = 'rounded text-wine-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700'
const ACT = 'inline-flex h-11 items-center gap-1.5 rounded border border-obsidian-300 bg-white px-3 text-xs font-semibold text-obsidian-900 transition-colors motion-reduce:transition-none hover:border-wine-700 hover:text-wine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wine-700 lg:h-9'

/** Warm parchment surface with a barely visible paper grain (dots), for page bodies and plates. */
export const PARCHMENT = 'bg-[#FBF8F4] bg-[radial-gradient(rgba(112,26,30,0.05)_1px,transparent_1px)] [background-size:5px_5px]'

/** Two thin lines with a gap, the classical masthead rule. */
export const DoubleRule = ({ tone = 'dark', className }: { tone?: 'light' | 'dark'; className?: string }) => (
  <div aria-hidden="true" className={cx('h-[5px] border-y', tone === 'dark' ? 'border-ochre-300/45' : 'border-wine-800/35', className)} />
)

/** Dateline row above a masthead title: a kicker on the left, the journal line on the right. */
export function Dateline({ label, text }: { label: string; text?: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2.5">
      <Kicker tone="dark">{label}</Kicker>
      <p className="font-work text-[11px] font-medium uppercase tracking-[0.14em] text-bordeaux-200">{text ?? `${journal.shortName} · ISSN ${journal.issnOnline}`}</p>
    </div>
  )
}

/** Classical bordeaux masthead: dateline, double rule, serif title, ornament rule, then free content and an optional aside. */
export function PageBand({ label, title, children, aside, dateline }: { label: string; title: ReactNode; children?: ReactNode; aside?: ReactNode; dateline?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-bordeaux-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_85%_0%,rgba(180,83,9,0.28),transparent_55%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(252,211,77,0.07)_1px,transparent_1px)] [background-size:6px_6px]" />
      <Container className="pb-10 pt-3 sm:pb-14">
        <DoubleRule className="mb-0" />
        <Dateline label={label} text={dateline} />
        <DoubleRule />
        <div className="mt-8 grid items-end gap-8 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
          <div className="min-w-0">
            <h1 className="max-w-3xl font-newsreader font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(34px,3.8vw,54px)' }}>{title}</h1>
            <OrnamentRule tone="dark" className="mt-5 max-w-[16rem]" />
            {children}
          </div>
          {aside}
        </div>
      </Container>
    </section>
  )
}

/** Section heading used inside listing pages: kicker, serif title, optional text, ornament rule. */
export function PlateHead({ label, title, text, id }: { label: string; title: string; text?: string; id?: string }) {
  return (
    <div className="mb-8">
      <Kicker>{label}</Kicker>
      <h2 id={id} className="mt-2 font-newsreader text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-obsidian-900 sm:text-[2.125rem]">{title}</h2>
      {text && <p className="mt-2 max-w-3xl font-serif4 text-base text-obsidian-700">{text}</p>}
      <OrnamentRule className="mt-4 max-w-sm" />
    </div>
  )
}

/** Research area as a periodic-table style chip: a symbol cell in the area colour, then the name. */
export function AreaChip({ subject, tone = 'light', className }: { subject: string; tone?: 'light' | 'dark'; className?: string }) {
  const color = areaColor(subject)
  return (
    <span className={cx('inline-flex items-stretch overflow-hidden rounded-sm border text-xs font-medium', tone === 'dark' ? 'border-white/20 bg-white/5 text-white' : 'border-wine-800/20 bg-white text-obsidian-800', className)}>
      <span aria-hidden="true" className="flex min-w-[1.75rem] items-center justify-center border-l-[3px] bg-[#FBF8F4] px-1.5 font-newsreader text-[13px] font-semibold leading-none" style={{ color, borderLeftColor: color }}>{symbolOf(subject)}</span>
      <span className="px-2 py-1">{subject}</span>
    </span>
  )
}

/** Research area tag used in rows. */
export const AreaTag = ({ subject }: { subject: string }) => <AreaChip subject={subject} />

/** PDF download and Cite flyout for one article. */
export function ArticleActions({ article }: { article: ArticleSummary }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <button type="button" onClick={() => downloadArticlePdf(article)} aria-label={`Download PDF: ${article.title}`} className={ACT}><Download className="h-4 w-4" aria-hidden="true" />PDF</button>
      <CiteMenu article={article} className={ACT}><Quote className="h-4 w-4" aria-hidden="true" />Cite</CiteMenu>
    </div>
  )
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** Wraps each occurrence of the query words in <mark>. */
export function Highlight({ text, terms }: { text: string; terms: string[] }) {
  const ts = terms.filter((t) => t.length > 1)
  if (!ts.length) return <>{text}</>
  const re = new RegExp(`(${ts.map(esc).join('|')})`, 'gi')
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i} className="rounded-sm bg-ochre-100 px-0.5 text-obsidian-900">{p}</mark> : p))}</>
}
