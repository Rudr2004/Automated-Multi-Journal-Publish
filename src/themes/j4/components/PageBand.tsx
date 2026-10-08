// Shared pieces for the J4 listing pages (issue, archive, search): the dark blueprint-grid page header, form-control classes,
// the PDF + Cite action pair and the research-area tag.
import type { ReactNode } from 'react'
import { downloadArticlePdf } from '../../../core/lib/pdf'
import type { ArticleSummary } from '../../../core/types'
import { Download, Quote } from '../icons'
import { areaColor } from './areas'
import { CiteMenu } from './CiteMenu'
import { Container, Label } from './primitives'

export const FIELD = 'h-11 rounded-ctl border border-abyss-300 bg-white px-3 text-sm text-abyss-900 focus-visible:border-azure-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-azure-600/20'
export const LINK = 'rounded-ctl text-cobalt-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600'
const ACT = 'inline-flex h-11 items-center gap-1.5 rounded-ctl border border-abyss-300 bg-white px-3 text-xs font-semibold text-abyss-900 hover:border-cobalt-700 hover:text-cobalt-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-600 lg:h-9'

/** Dark slate header band with the faint blueprint grid used on the home hero. */
export function PageBand({ label, title, children, aside }: { label: string; title: ReactNode; children?: ReactNode; aside?: ReactNode }) {
  return (
    <section className="relative isolate bg-abyss-900 text-white">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_at_72%_30%,black,transparent_72%)]" />
      </div>
      <Container className="grid items-end gap-8 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14">
        <div className="min-w-0">
          <Label className="text-azure-300">{label}</Label>
          <h1 className="mt-3 max-w-3xl font-serif4 font-semibold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(34px,3.8vw,54px)' }}>{title}</h1>
          {children}
        </div>
        {aside}
      </Container>
    </section>
  )
}

/** Research area as a coloured dot plus name. */
export const AreaTag = ({ subject }: { subject: string }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: areaColor(subject) }}>
    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: areaColor(subject) }} />{subject}
  </span>
)

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
  return <>{text.split(re).map((p, i) => (i % 2 ? <mark key={i} className="rounded-sm bg-azure-100 px-0.5 text-abyss-900">{p}</mark> : p))}</>
}
